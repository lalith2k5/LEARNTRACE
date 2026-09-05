import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

import { store, initializeDatabaseSeed, saveStoreToDisk } from './server/store.js';
import { 
  initializeDatabaseConnection, 
  getDatabaseStatus, 
  syncUserToDb, 
  syncAttemptToDb, 
  syncMasteryToDb, 
  syncUserGoalToDb,
  syncQuestionToDb
} from './server/db.js';
import { recalculateAllUserMasteries, calculateSkillMasteryForUser, getUserMastery, getInterpretationFromScore, computeBktEstimate } from './server/services/masteryService.js';
import { getDirectPrerequisites, getFullPrerequisiteChain, getGraphPayload, calculateDownstreamCountInChain } from './server/services/graphService.js';
import { getPrioritizedRecommendation } from './server/services/recommendationService.js';
import { generateLearningPath } from './server/services/learningPathService.js';
import { explainQuestion, generateAdaptiveQuestion, generateBankEnrichmentQuestions } from './server/services/ollamaService.js';
import { gradeOpenEndedResponse } from './server/services/semanticGraderService.js';
import { generateMultiModelTraceSimulation, computeDktMasterySequence, DEFAULT_BKT_PARAMS, evaluateEducationalDataset, getSampleBenchmarkDataset } from './server/services/knowledgeTracingService.js';
import { User, Attempt, UserGoal, CognitiveState, LearningGoal, Question } from './src/types.js';

dotenv.config();

const PORT = 3000;
const isProduction = process.env.NODE_ENV === 'production';

// In production, JWT_SECRET is strictly required and cannot fall back to a hardcoded default.
// In development, if JWT_SECRET is not provided, we allow a development-only secret.
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (secret && secret.trim().length > 0) {
    return secret.trim();
  }
  if (isProduction) {
    console.error('[LearnTrace Security] ❌ FATAL IN PRODUCTION: JWT_SECRET environment variable is missing or empty. Server cannot start.');
    throw new Error('Production configuration error: JWT_SECRET environment variable is required.');
  }
  return 'learntrace_jwt_dev_secret_only_for_local_sandbox';
}

const JWT_SECRET = getJwtSecret();

/**
 * Demo authentication check:
 * In development, demo authentication is allowed by default unless explicitly disabled (ALLOW_DEMO_AUTH=false).
 * In production, demo authentication is strictly blocked unless explicitly enabled (ALLOW_DEMO_AUTH=true).
 */
function isDemoAuthAllowed(): boolean {
  const flag = process.env.ALLOW_DEMO_AUTH;
  if (isProduction) {
    return flag === 'true';
  }
  return flag !== 'false';
}

const app = express();

app.use(cors());
app.use(express.json());

// Extend express Request interface
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

/**
 * Reusable JWT Authentication Middleware
 * Enforces strict cryptographic signature verification.
 * Does NOT allow unverified token decoding or silent fallback to demo user.
 * Demo token / fallback is guarded behind isDemoAuthAllowed().
 */
function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token || token === 'null' || token === 'undefined') {
    if (isDemoAuthAllowed()) {
      const demoUser = store.users.get('user_demo_learner');
      req.user = {
        id: demoUser ? demoUser.id : 'user_demo_learner',
        email: demoUser ? demoUser.email : 'learner@learntrace.ai',
      };
      return next();
    }
    res.status(401).json({
      error: 'Authentication required. Missing Bearer authorization token.',
      code: 'AUTH_TOKEN_MISSING'
    });
    return;
  }

  if (token === 'demo_token') {
    if (isDemoAuthAllowed()) {
      req.user = { id: 'user_demo_learner', email: 'learner@learntrace.ai' };
      return next();
    }
    res.status(403).json({
      error: 'Demo authentication is disabled in this environment.',
      code: 'DEMO_AUTH_DISABLED'
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    if (!decoded || !decoded.id) {
      res.status(401).json({
        error: 'Invalid authentication token claims.',
        code: 'INVALID_TOKEN'
      });
      return;
    }
    let user = store.users.get(decoded.id);
    if (!user) {
      user = {
        id: decoded.id,
        email: decoded.email || `${decoded.id}@learntrace.ai`,
        passwordHash: '',
        createdAt: new Date().toISOString(),
      };
      store.users.set(user.id, user);
    }
    req.user = { id: user.id, email: user.email };
    return next();
  } catch (err: any) {
    if (err?.name === 'TokenExpiredError') {
      res.status(401).json({
        error: 'Authentication token has expired. Please log in again.',
        code: 'TOKEN_EXPIRED'
      });
      return;
    }
    res.status(401).json({
      error: 'Invalid or corrupted authentication token signature.',
      code: 'INVALID_TOKEN'
    });
    return;
  }
}

function optionalAuthenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  authenticateToken(req, res, next);
}

function mountRoute(method: 'get' | 'post' | 'put' | 'patch' | 'delete', pathUrl: string, ...handlers: any[]) {
  app[method](pathUrl, ...handlers);
  if (!pathUrl.startsWith('/api')) {
    app[method](`/api${pathUrl}`, ...handlers);
  }
}

// Health check
mountRoute('get', '/health', (req: Request, res: Response) => {
  const dbStatus = getDatabaseStatus();
  res.json({ 
    status: 'ok', 
    service: 'LearnTrace API', 
    time: new Date().toISOString(),
    database: dbStatus,
  });
});

// Database & Deployment Diagnostics
mountRoute('get', '/database/status', (req: Request, res: Response) => {
  res.json(getDatabaseStatus());
});

/* ---------------- AUTHENTICATION ---------------- */

mountRoute('post', '/auth/register', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    res.status(400).json({ 
      error: 'Please enter a valid email address (e.g. name@example.com).',
      code: 'INVALID_EMAIL' 
    });
    return;
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    res.status(400).json({ 
      error: 'Password must be at least 6 characters in length.',
      code: 'WEAK_PASSWORD' 
    });
    return;
  }

  const cleanEmail = email.trim().toLowerCase();
  const existingUser = Array.from(store.users.values()).find((u) => u?.email?.toLowerCase() === cleanEmail);
  if (existingUser) {
    res.status(409).json({ 
      error: 'An account with this email address already exists. Please sign in instead.',
      code: 'USER_EXISTS' 
    });
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser: User & { passwordHash: string } = {
    id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    email: cleanEmail,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  store.users.set(newUser.id, newUser);

  const defaultGoal = store.goals.get('goal_mle') || Array.from(store.goals.values())[0];
  if (defaultGoal) {
    store.userGoals.set(`${newUser.id}_${defaultGoal.id}`, {
      userId: newUser.id,
      goalId: defaultGoal.id,
      selectedAt: new Date().toISOString(),
      goal: defaultGoal,
    });
  }

  recalculateAllUserMasteries(newUser.id);
  saveStoreToDisk();

  // Gracefully synchronize with PostgreSQL if active
  syncUserToDb({ id: newUser.id, email: newUser.email, passwordHash });
  if (defaultGoal) {
    syncUserGoalToDb(newUser.id, defaultGoal.id);
  }

  const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });

  res.status(201).json({
    message: 'User registered successfully.',
    token,
    user: {
      id: newUser.id,
      email: newUser.email,
      createdAt: newUser.createdAt,
    },
  });
});

mountRoute('post', '/auth/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    res.status(400).json({ 
      error: 'Both email and password are required.',
      code: 'MISSING_FIELDS' 
    });
    return;
  }

  const cleanEmail = email.trim().toLowerCase();
  const user = Array.from(store.users.values()).find((u) => u?.email?.toLowerCase() === cleanEmail);
  if (!user) {
    res.status(404).json({ 
      error: "Don't have an account? No user is registered with this email. Please register first.",
      code: 'USER_NOT_FOUND' 
    });
    return;
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isValidPassword) {
    res.status(401).json({ 
      error: 'Incorrect password. Please verify your password and try again.',
      code: 'INCORRECT_PASSWORD' 
    });
    return;
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

  res.json({
    message: 'Login successful.',
    token,
    user: {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
});

mountRoute('get', '/auth/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const user = store.users.get(req.user!.id);
  if (!user) {
    res.status(404).json({ error: 'User not found.' });
    return;
  }

  res.json({
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
  });
});

mountRoute('put', '/auth/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { email, currentPassword, newPassword } = req.body;

  const user = store.users.get(userId);
  if (!user) {
    res.status(404).json({ error: 'User not found.' });
    return;
  }

  // Update email if provided
  if (email && email.trim() && email.trim().toLowerCase() !== user.email?.toLowerCase()) {
    const trimmedEmail = email.trim().toLowerCase();
    const existing = Array.from(store.users.values()).find(
      (u) => u?.email?.toLowerCase() === trimmedEmail && u.id !== userId
    );
    if (existing) {
      res.status(400).json({ error: 'Email is already taken by another account.' });
      return;
    }
    user.email = trimmedEmail;
  }

  // Update password if provided
  if (newPassword) {
    if (newPassword.length < 6) {
      res.status(400).json({ error: 'New password must be at least 6 characters.' });
      return;
    }
    if (user.passwordHash && currentPassword) {
      const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isValid) {
        res.status(400).json({ error: 'Current password does not match.' });
        return;
      }
    }
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
  }

  store.users.set(userId, user);
  saveStoreToDisk();

  res.json({
    message: 'Profile updated successfully.',
    user: {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
});

mountRoute('get', '/user/stats', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const user = store.users.get(userId);

  const attempts = store.attempts.filter((a) => a.userId === userId);
  const totalAttempts = attempts.length;
  const correctCount = attempts.filter((a) => a.correct).length;
  const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;
  const totalTimeSeconds = attempts.reduce((acc, a) => acc + (a.timeTakenSeconds || 0), 0);

  const masteries = Array.from(store.masteries.values()).filter((m) => m.userId === userId);
  const solidCount = masteries.filter((m) => m.masteryScore >= 0.7).length;
  const developingCount = masteries.filter((m) => m.masteryScore >= 0.4 && m.masteryScore < 0.7).length;
  const noviceCount = masteries.filter((m) => m.masteryScore < 0.4).length;

  const currentGoalEntry = Array.from(store.userGoals.values()).find((ug) => ug.userId === userId);

  res.json({
    userId,
    email: user?.email || req.user?.email,
    createdAt: user?.createdAt,
    totalAttempts,
    correctCount,
    accuracy,
    totalTimeSeconds,
    skillsSolid: solidCount,
    skillsDeveloping: developingCount,
    skillsNovice: noviceCount,
    totalSkills: store.skills.size,
    currentGoal: currentGoalEntry?.goal || null,
  });
});

mountRoute('post', '/user/reset-progress', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;

  // Remove user's attempts
  store.attempts = store.attempts.filter((a) => a.userId !== userId);

  // Remove user's masteries
  for (const [masteryId, mastery] of store.masteries.entries()) {
    if (mastery.userId === userId) {
      store.masteries.delete(masteryId);
    }
  }

  // Re-initialize baseline masteries
  recalculateAllUserMasteries(userId);
  saveStoreToDisk();

  res.json({
    message: 'User progress reset successfully.',
    totalAttempts: 0,
  });
});

/* ---------------- SKILLS & GRAPH ---------------- */

mountRoute('get', '/skills', (req: Request, res: Response) => {
  const skills = Array.from(store.skills.values());
  res.json(skills);
});

mountRoute('get', '/skills/:id/prerequisites', (req: Request, res: Response) => {
  const skill = store.skills.get(req.params.id);
  if (!skill) {
    res.status(404).json({ error: 'Skill not found.' });
    return;
  }
  const directPrereqs = getDirectPrerequisites(req.params.id);
  res.json({
    skill,
    prerequisites: directPrereqs,
  });
});

mountRoute('get', '/skills/:id/chain', (req: Request, res: Response) => {
  const skill = store.skills.get(req.params.id);
  if (!skill) {
    res.status(404).json({ error: 'Skill not found.' });
    return;
  }
  const fullChain = getFullPrerequisiteChain(req.params.id, true);
  res.json({
    skill,
    chain: fullChain,
  });
});

mountRoute('get', '/skills/graph', optionalAuthenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const userMasteriesMap = new Map<string, number>();

  for (const skill of store.skills.values()) {
    userMasteriesMap.set(skill.id, getUserMastery(userId, skill.id));
  }

  let targetSkillId = 'skill_ml';
  const userGoalEntries = Array.from(store.userGoals.values()).filter((ug) => ug.userId === userId);
  if (userGoalEntries.length > 0) {
    const goal = store.goals.get(userGoalEntries[0].goalId);
    if (goal) targetSkillId = goal.targetSkillId;
  }

  const recResult = getPrioritizedRecommendation(userId);
  const recommendedSkillId = recResult.recommendation?.skillId;

  const payload = getGraphPayload(userMasteriesMap, targetSkillId, recommendedSkillId);
  res.json(payload);
});

/* ---------------- GOALS ---------------- */

mountRoute('get', '/goals', (req: Request, res: Response) => {
  const goals = Array.from(store.goals.values()).map((g) => ({
    ...g,
    targetSkill: store.skills.get(g.targetSkillId),
  }));
  res.json(goals);
});

mountRoute('post', '/user-goals', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { goalId } = req.body;
  if (!goalId) {
    res.status(400).json({ error: 'goalId is required.' });
    return;
  }

  const goal = store.goals.get(goalId);
  if (!goal) {
    res.status(404).json({ error: 'Learning goal not found.' });
    return;
  }

  const userId = req.user!.id;

  for (const key of Array.from(store.userGoals.keys())) {
    if (key.startsWith(`${userId}_`)) {
      store.userGoals.delete(key);
    }
  }

  const userGoal: UserGoal = {
    userId,
    goalId,
    selectedAt: new Date().toISOString(),
    goal: {
      ...goal,
      targetSkill: store.skills.get(goal.targetSkillId),
    },
  };

  store.userGoals.set(`${userId}_${goalId}`, userGoal);
  saveStoreToDisk();
  syncUserGoalToDb(userId, goalId);

  res.json({
    message: `Goal successfully set to "${goal.name}".`,
    userGoal,
  });
});

mountRoute('get', '/user-goals/current', optionalAuthenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const userGoalEntries = Array.from(store.userGoals.values()).filter((ug) => ug.userId === userId);
  
  if (userGoalEntries.length === 0) {
    const defaultGoal = store.goals.get('goal_mle') || Array.from(store.goals.values())[0];
    res.json({
      userId,
      goalId: defaultGoal.id,
      selectedAt: new Date().toISOString(),
      goal: {
        ...defaultGoal,
        targetSkill: store.skills.get(defaultGoal.targetSkillId),
      },
    });
    return;
  }

  const ug = userGoalEntries[0];
  const goal = store.goals.get(ug.goalId);
  res.json({
    ...ug,
    goal: goal ? { ...goal, targetSkill: store.skills.get(goal.targetSkillId) } : undefined,
  });
});

/* ---------------- QUESTIONS & ATTEMPTS ---------------- */

mountRoute('get', '/questions/stats', (req: Request, res: Response) => {
  const allQuestions = Array.from(store.questions.values());
  const bySkill: Record<string, number> = {};
  const byDifficulty: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const coveredSkills = new Set<string>();

  allQuestions.forEach((q) => {
    bySkill[q.skillId] = (bySkill[q.skillId] || 0) + 1;
    const diff = q.difficulty || 1;
    byDifficulty[diff] = (byDifficulty[diff] || 0) + 1;
    coveredSkills.add(q.skillId);
    if (q.skillsTested) {
      q.skillsTested.forEach((s) => coveredSkills.add(s));
    }
  });

  res.json({
    totalQuestions: allQuestions.length,
    bySkill,
    byDifficulty,
    skillsCovered: coveredSkills.size,
    totalSkillsInCurriculum: store.skills.size,
  });
});

mountRoute('get', '/questions', (req: Request, res: Response) => {
  const skillId = req.query.skill_id as string | undefined;
  const includeAnswers = req.query.include_answers === 'true';

  let questions = Array.from(store.questions.values());
  if (skillId) {
    questions = questions.filter((q) => q.skillId === skillId || (q.skillsTested && q.skillsTested.includes(skillId)));
  }

  const result = questions.map((q) => {
    const base = {
      ...q,
      skillName: store.skills.get(q.skillId)?.name || q.skillId,
    };
    if (!includeAnswers) {
      const { correctAnswer, ...sanitized } = base;
      return sanitized;
    }
    return base;
  });

  res.json(result);
});

// POST /attempts (Grades strictly on backend, evaluates cognitive state, propagates multi-skill evidence)
mountRoute('post', '/attempts', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { questionId, answer, timeTakenSeconds, confidence, attemptNumber } = req.body;

  if (!questionId) {
    res.status(400).json({ error: 'questionId is required.' });
    return;
  }
  if (answer === undefined || answer === null || String(answer).trim() === '') {
    res.status(400).json({ error: 'Selected answer is required.' });
    return;
  }

  const parsedConfidence = Number(confidence);
  if (isNaN(parsedConfidence) || parsedConfidence < 1 || parsedConfidence > 5) {
    res.status(400).json({ error: 'Confidence must be an integer between 1 and 5.' });
    return;
  }

  const parsedTime = Number(timeTakenSeconds);
  if (isNaN(parsedTime) || parsedTime < 0) {
    res.status(400).json({ error: 'timeTakenSeconds must be a non-negative number.' });
    return;
  }

  const question = store.questions.get(questionId);
  if (!question) {
    res.status(404).json({ error: 'Question not found.' });
    return;
  }

  const userId = req.user!.id;
  const isCorrect = String(answer).trim() === String(question.correctAnswer).trim();

  const userPrevAttempts = store.attempts.filter((a) => a.userId === userId && a.questionId === questionId);
  const currentAttemptNumber = attemptNumber ? Number(attemptNumber) : userPrevAttempts.length + 1;

  // Classify cognitive state (Proposal Section 7)
  let cognitiveState: CognitiveState = 'NORMAL_MASTERY';
  if (!isCorrect) {
    cognitiveState = parsedConfidence >= 4 ? 'CONFIDENT_MISCONCEPTION' : 'UNCERTAIN_MISTAKE';
  } else {
    if (parsedConfidence <= 2) {
      cognitiveState = 'FRAGILE_KNOWLEDGE';
    } else if (parsedConfidence >= 4 && parsedTime < 25) {
      cognitiveState = 'SOLID_MASTERY';
    } else {
      cognitiveState = 'NORMAL_MASTERY';
    }
  }

  const skillsTested = question.skillsTested && question.skillsTested.length > 0
    ? question.skillsTested
    : [question.skillId];

  const attempt: Attempt = {
    id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    userId,
    questionId,
    questionText: question.text,
    skillId: question.skillId,
    skillName: store.skills.get(question.skillId)?.name || question.skillId,
    skillsTested,
    selectedAnswer: String(answer),
    correct: isCorrect,
    timeTakenSeconds: Math.round(parsedTime),
    confidence: parsedConfidence,
    attemptNumber: currentAttemptNumber,
    cognitiveState,
    createdAt: new Date().toISOString(),
  };

  store.attempts.push(attempt);
  saveStoreToDisk();
  syncAttemptToDb(attempt);

  // Update mastery for ALL skills tested in this question
  skillsTested.forEach((sId) => {
    const m = calculateSkillMasteryForUser(userId, sId);
    syncMasteryToDb(userId, sId, m.masteryScore, m.evidenceCount);
  });
  const primaryMastery = calculateSkillMasteryForUser(userId, question.skillId);
  syncMasteryToDb(userId, question.skillId, primaryMastery.masteryScore, primaryMastery.evidenceCount);

  res.status(201).json({
    success: true,
    correct: isCorrect,
    attempt,
    updatedMastery: primaryMastery,
    correctAnswerText: !isCorrect
      ? question.options.find((o) => o.id === question.correctAnswer)?.text
      : undefined,
    explanation: question.explanation,
  });
});

mountRoute('get', '/attempts', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const userAttempts = store.attempts
    .filter((a) => a.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json(userAttempts);
});

/* ---------------- MASTERY ---------------- */

mountRoute('get', '/mastery', optionalAuthenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const skills = Array.from(store.skills.values());
  const masteries = skills.map((s) => {
    let m = store.masteries.get(`${userId}_${s.id}`);
    if (!m) {
      m = calculateSkillMasteryForUser(userId, s.id);
    }
    return m;
  });

  res.json(masteries);
});

mountRoute('post', '/mastery/recalculate', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const result = recalculateAllUserMasteries(userId);
  res.json(result);
});

/* ---------------- SKILL GAPS ---------------- */

mountRoute('get', '/skill-gaps', optionalAuthenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const goalId = req.query.goal_id as string | undefined;

  let targetGoal = goalId ? store.goals.get(goalId) : null;
  if (!targetGoal) {
    const userGoalEntries = Array.from(store.userGoals.values()).filter((ug) => ug.userId === userId);
    if (userGoalEntries.length > 0) {
      targetGoal = store.goals.get(userGoalEntries[0].goalId) || null;
    }
  }
  if (!targetGoal) {
    targetGoal = store.goals.get('goal_mle') || Array.from(store.goals.values())[0];
  }

  const fullChain = getFullPrerequisiteChain(targetGoal.targetSkillId, true);
  const relevantSkillIds = new Set(fullChain.map((s) => s.id));

  const gaps = fullChain
    .map((skill) => {
      const masteryScore = getUserMastery(userId, skill.id);
      const directPrereqs = getDirectPrerequisites(skill.id);
      const unmetPrereqs = directPrereqs
        .filter((p) => getUserMastery(userId, p.id) < 0.6)
        .map((p) => p.name);
      const isReady = unmetPrereqs.length === 0;
      const downstreamCount = calculateDownstreamCountInChain(skill.id, relevantSkillIds);

      return {
        skillId: skill.id,
        skillName: skill.name,
        domain: skill.domain,
        masteryScore,
        interpretation: getInterpretationFromScore(masteryScore),
        isReady,
        prerequisiteCount: directPrereqs.length,
        downstreamCount,
        unmetPrerequisites: unmetPrereqs,
      };
    })
    .filter((s) => s.masteryScore < 0.6);

  res.json({
    goalId: targetGoal.id,
    goalName: targetGoal.name,
    targetSkillName: store.skills.get(targetGoal.targetSkillId)?.name,
    skillGaps: gaps,
  });
});

/* ---------------- RECOMMENDATIONS ---------------- */

mountRoute('get', '/recommendations', optionalAuthenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const goalId = req.query.goal_id as string | undefined;

  const result = getPrioritizedRecommendation(userId, goalId);
  res.json(result);
});

/* ---------------- LEARNING PATH ---------------- */

mountRoute('get', '/learning-path', optionalAuthenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const goalId = req.query.goal_id as string | undefined;

  const pathSteps = generateLearningPath(userId, goalId);
  res.json(pathSteps);
});

/* ---------------- LEARNING RESOURCES ---------------- */

mountRoute('get', '/resources', optionalAuthenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const skillId = (req.query.skillId || req.query.skill_id) as string | undefined;
  const type = req.query.type as string | undefined;

  let allResources = Array.from(store.resources.values());

  if (skillId) {
    allResources = allResources.filter((r) => r.skillId === skillId);
  }
  if (type) {
    allResources = allResources.filter((r) => r.type === type);
  }

  res.json(allResources);
});

mountRoute('get', '/skills/:skillId/resources', optionalAuthenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { skillId } = req.params;
  const resources = Array.from(store.resources.values()).filter((r) => r.skillId === skillId);
  res.json(resources);
});

mountRoute('get', '/resources/:resourceId', optionalAuthenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { resourceId } = req.params;
  const resource = store.resources.get(resourceId);
  if (!resource) {
    res.status(404).json({ error: 'Resource not found' });
    return;
  }
  res.json(resource);
});

/* ---------------- AI DIAGNOSTIC EXPLANATIONS & GENERATOR ---------------- */

mountRoute('post', '/ai/explain', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { questionId, selectedAnswer, confidence, isCorrect } = req.body;

  if (!questionId) {
    res.status(400).json({ error: 'questionId is required.' });
    return;
  }

  const question = store.questions.get(questionId);
  if (!question) {
    res.status(404).json({ error: 'Question not found.' });
    return;
  }

  const skill = store.skills.get(question.skillId);
  const skillName = skill?.name || 'Data Science';

  const selectedOptionText = question.options.find((o) => o.id === selectedAnswer)?.text;
  const correctOptionText = question.options.find((o) => o.id === question.correctAnswer)?.text;

  const explanationResult = await explainQuestion({
    questionText: question.text,
    skillName,
    options: question.options,
    selectedOptionText,
    correctOptionText,
    defaultExplanation: question.explanation,
    confidence: Number(confidence),
    isCorrect: Boolean(isCorrect),
  });

  res.json(explanationResult);
});

mountRoute('post', '/ai/generate-question', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { skillId } = req.body;
  if (!skillId) {
    res.status(400).json({ error: 'skillId is required.' });
    return;
  }

  const skill = store.skills.get(skillId);
  if (!skill) {
    res.status(404).json({ error: 'Skill not found.' });
    return;
  }

  let generated = await generateAdaptiveQuestion(skill.id, skill.name, skill.domain);
  if (!generated) {
    const bank = await generateBankEnrichmentQuestions({ skillId: skill.id, skillName: skill.name, domain: skill.domain, count: 1 });
    generated = bank[0] || null;
  }

  if (!generated) {
    // Return existing question if any
    const existing = Array.from(store.questions.values()).find((q) => q.skillId === skill.id);
    if (existing) {
      const { correctAnswer, ...sanitized } = existing;
      res.status(200).json({
        message: `Loaded existing diagnostic question for ${skill.name}.`,
        question: sanitized,
      });
      return;
    }
    res.status(503).json({ error: 'Unable to synthesize question at this time. Please try another skill.' });
    return;
  }

  store.questions.set(generated.id, generated);
  saveStoreToDisk();
  syncQuestionToDb(generated);

  const { correctAnswer, ...sanitized } = generated;
  res.status(201).json({
    message: `Generated practice question for ${skill.name}.`,
    question: sanitized,
  });
});

mountRoute('post', '/ai/generate-questions-bank', optionalAuthenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { skillId, count, difficulty, cognitiveCategory } = req.body;
  const requestedCount = Math.min(5, Math.max(1, Number(count) || 2));

  const allSkills = Array.from(store.skills.values());
  if (allSkills.length === 0) {
    res.status(500).json({ error: 'No skills found in curriculum to generate questions for.' });
    return;
  }

  const generatedQuestions: Question[] = [];

  if (skillId && skillId !== 'all') {
    const targetSkill = store.skills.get(skillId);
    if (!targetSkill) {
      res.status(404).json({ error: `Skill "${skillId}" not found.` });
      return;
    }
    const newItems = await generateBankEnrichmentQuestions({
      skillId: targetSkill.id,
      skillName: targetSkill.name,
      domain: targetSkill.domain,
      count: requestedCount,
      difficulty: difficulty ? Number(difficulty) : undefined,
      cognitiveCategory,
    });
    generatedQuestions.push(...newItems);
  } else {
    // If 'all', distribute across curriculum skills (prioritizing lowest representation)
    const skillCounts: Record<string, number> = {};
    allSkills.forEach((s) => { skillCounts[s.id] = 0; });
    store.questions.forEach((q) => {
      if (skillCounts[q.skillId] !== undefined) {
        skillCounts[q.skillId]++;
      }
    });

    const sortedSkills = [...allSkills].sort((a, b) => (skillCounts[a.id] || 0) - (skillCounts[b.id] || 0));
    
    for (let i = 0; i < requestedCount; i++) {
      const targetSkill = sortedSkills[i % sortedSkills.length];
      const items = await generateBankEnrichmentQuestions({
        skillId: targetSkill.id,
        skillName: targetSkill.name,
        domain: targetSkill.domain,
        count: 1,
        difficulty: difficulty ? Number(difficulty) : ((i % 5) + 1),
        cognitiveCategory,
      });
      generatedQuestions.push(...items);
    }
  }

  // Store in memory, local disk, and PostgreSQL if connected
  for (const q of generatedQuestions) {
    store.questions.set(q.id, q);
    await syncQuestionToDb(q);
  }
  saveStoreToDisk();

  // Compute updated statistics
  const allQuestions = Array.from(store.questions.values());
  const bySkill: Record<string, number> = {};
  const byDifficulty: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const coveredSkills = new Set<string>();

  allQuestions.forEach((q) => {
    bySkill[q.skillId] = (bySkill[q.skillId] || 0) + 1;
    const diff = q.difficulty || 1;
    byDifficulty[diff] = (byDifficulty[diff] || 0) + 1;
    coveredSkills.add(q.skillId);
    if (q.skillsTested) {
      q.skillsTested.forEach((s) => coveredSkills.add(s));
    }
  });

  const stats = {
    totalQuestions: allQuestions.length,
    bySkill,
    byDifficulty,
    skillsCovered: coveredSkills.size,
    totalSkillsInCurriculum: store.skills.size,
  };

  res.status(201).json({
    success: true,
    message: `Generated and added ${generatedQuestions.length} new question(s) to the Question Bank with Gemini.`,
    generatedQuestions,
    totalInBank: store.questions.size,
    stats,
  });
});

mountRoute('post', '/ai/grade-open-ended', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { skillId, prompt, studentResponse, selfConfidence } = req.body;

  if (!skillId || !prompt || !studentResponse) {
    res.status(400).json({ error: 'skillId, prompt, and studentResponse are required.' });
    return;
  }

  const skill = store.skills.get(skillId);
  if (!skill) {
    res.status(404).json({ error: 'Skill not found.' });
    return;
  }

  const userId = req.user!.id;
  const evaluation = await gradeOpenEndedResponse({
    skillName: skill.name,
    skillDomain: skill.domain,
    prompt,
    studentResponse,
    selfConfidence: Number(selfConfidence) || 3,
  });

  const isCorrect = evaluation.score >= 0.6;
  const userPrevAttempts = store.attempts.filter((a) => a.userId === userId && a.skillId === skillId);

  const attempt: Attempt = {
    id: `att_oe_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    userId,
    questionId: `open_ended_${skillId}`,
    questionText: prompt,
    skillId,
    skillName: skill.name,
    skillsTested: [skillId],
    selectedAnswer: studentResponse.length > 120 ? studentResponse.substring(0, 117) + '...' : studentResponse,
    correct: isCorrect,
    timeTakenSeconds: 45,
    confidence: Number(selfConfidence) || 3,
    attemptNumber: userPrevAttempts.length + 1,
    cognitiveState: evaluation.cognitiveState,
    createdAt: new Date().toISOString(),
  };

  store.attempts.push(attempt);
  const updatedMastery = calculateSkillMasteryForUser(userId, skillId);
  saveStoreToDisk();
  syncAttemptToDb(attempt);
  syncMasteryToDb(userId, skillId, updatedMastery.masteryScore, updatedMastery.evidenceCount);

  res.status(200).json({
    ...evaluation,
    attempt,
    updatedMastery,
  });
});

/* ---------------- RESEARCH, DKT SIMULATION & INTERACTION TRACE EXPORT ---------------- */

mountRoute('get', '/research/trace', optionalAuthenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const userAttempts = store.attempts.filter((a) => a.userId === userId);

  const traceRecords = userAttempts.map((a, idx) => ({
    interaction_id: idx + 1,
    student_id: a.userId,
    question_id: a.questionId,
    correct: a.correct ? 1 : 0,
    time_taken_seconds: a.timeTakenSeconds,
    confidence: a.confidence,
    attempt_number: a.attemptNumber,
    skill_id: a.skillId,
    skill_name: a.skillName,
    skills_tested: a.skillsTested || [a.skillId],
    cognitive_state: a.cognitiveState || 'NORMAL_MASTERY',
    timestamp: a.createdAt,
  }));

  res.json({
    studentId: userId,
    recordCount: traceRecords.length,
    records: traceRecords,
  });
});

mountRoute('post', '/research/simulate', optionalAuthenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { customSequence, bktParams, skillId } = req.body;
  const userId = req.user!.id;

  let attemptsToSimulate: Array<{ correct: boolean; confidence?: number; timeTakenSeconds?: number; questionText?: string }> = [];

  if (Array.isArray(customSequence) && customSequence.length > 0) {
    attemptsToSimulate = customSequence.map((item: any) => ({
      correct: Boolean(item.correct !== undefined ? item.correct : item),
      confidence: item.confidence ? Number(item.confidence) : 3,
      timeTakenSeconds: item.timeTakenSeconds ? Number(item.timeTakenSeconds) : 20,
      questionText: item.questionText || 'Practice question',
    }));
  } else {
    // Use real user attempts for specified skill or overall
    const userAttempts = store.attempts.filter(
      (a) => a.userId === userId && (!skillId || a.skillId === skillId || (a.skillsTested && a.skillsTested.includes(skillId)))
    );
    attemptsToSimulate = userAttempts.map((a) => ({
      correct: a.correct,
      confidence: a.confidence,
      timeTakenSeconds: a.timeTakenSeconds,
      questionText: a.questionText,
    }));
  }

  const simulationPoints = generateMultiModelTraceSimulation(
    attemptsToSimulate,
    bktParams || DEFAULT_BKT_PARAMS
  );

  res.json({
    sequenceLength: attemptsToSimulate.length,
    bktParams: bktParams || DEFAULT_BKT_PARAMS,
    simulationPoints,
  });
});

mountRoute('get', '/research/bkt-compare', optionalAuthenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const skills = Array.from(store.skills.values());

  const comparisonData = skills.map((skill) => {
    const attempts = store.attempts.filter(
      (a) => a.userId === userId && (a.skillId === skill.id || (a.skillsTested && a.skillsTested.includes(skill.id)))
    );
    const learnTraceMastery = getUserMastery(userId, skill.id);
    const bktEstimate = computeBktEstimate(attempts);
    const dktHistory = computeDktMasterySequence(attempts);
    const dktEstimate = dktHistory[dktHistory.length - 1] || 0.15;

    return {
      skillId: skill.id,
      skillName: skill.name,
      domain: skill.domain,
      evidenceCount: attempts.length,
      learnTraceScore: learnTraceMastery,
      learnTraceInterpretation: getInterpretationFromScore(learnTraceMastery),
      bktScore: bktEstimate,
      bktInterpretation: getInterpretationFromScore(bktEstimate),
      dktScore: dktEstimate,
      dktInterpretation: getInterpretationFromScore(dktEstimate),
      difference: Math.round((learnTraceMastery - bktEstimate) * 100) / 100,
    };
  });

  res.json({
    userId,
    modelsCompared: [
      'LearnTrace Recency-Weighted Heuristic',
      'Bayesian Knowledge Tracing (BKT)',
      'Deep Knowledge Tracing (DKT Neural Approximation)',
    ],
    skills: comparisonData,
  });
});

mountRoute('post', '/research/evaluate-dataset', optionalAuthenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { datasetName, records, bktParams } = req.body;

  if (!records || !Array.isArray(records) || records.length === 0) {
    res.status(400).json({ error: 'records array with at least one student-skill interaction is required.' });
    return;
  }

  // Sanitize record format
  const sanitizedRecords = records.map((r: any, idx: number) => ({
    userId: String(r.userId || r.studentId || `user_${Math.floor(idx / 10)}`),
    skillId: String(r.skillId || r.skill_id || 'skill_prob'),
    correct: Boolean(r.correct === 1 || r.correct === true || r.correct === '1' || r.correct === 'true'),
    confidence: r.confidence ? Number(r.confidence) : 3,
    timeTakenSeconds: r.timeTakenSeconds ? Number(r.timeTakenSeconds) : 20,
  }));

  const results = evaluateEducationalDataset(
    sanitizedRecords,
    datasetName || 'Custom Educational Benchmark Dataset',
    bktParams || DEFAULT_BKT_PARAMS
  );

  res.json(results);
});

mountRoute('get', '/research/benchmark-samples/:type', (req: Request, res: Response) => {
  const type = req.params.type as 'assistments' | 'ednet' | 'synthetic';
  if (!['assistments', 'ednet', 'synthetic'].includes(type)) {
    res.status(400).json({ error: 'Invalid sample type. Must be assistments, ednet, or synthetic.' });
    return;
  }

  const sample = getSampleBenchmarkDataset(type);
  res.json({
    type,
    recordCount: sample.length,
    records: sample,
  });
});

mountRoute('get', '/questions/stats', (req: Request, res: Response) => {
  const allQuestions = Array.from(store.questions.values());
  const bySkill: Record<string, number> = {};
  const byDifficulty: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  allQuestions.forEach((q) => {
    bySkill[q.skillId] = (bySkill[q.skillId] || 0) + 1;
    byDifficulty[q.difficulty] = (byDifficulty[q.difficulty] || 0) + 1;
  });

  res.json({
    totalQuestions: allQuestions.length,
    bySkill,
    byDifficulty,
    skillsCovered: Object.keys(bySkill).length,
  });
});

mountRoute('post', '/goals/custom', optionalAuthenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { name, targetSkillId, description } = req.body;
  const userId = req.user!.id;

  if (!name || !targetSkillId) {
    res.status(400).json({ error: 'Goal name and targetSkillId are required.' });
    return;
  }

  const targetSkill = store.skills.get(targetSkillId);
  if (!targetSkill) {
    res.status(404).json({ error: `Target skill ${targetSkillId} does not exist in domain DAG.` });
    return;
  }

  const customGoalId = `goal_custom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const newGoal: LearningGoal = {
    id: customGoalId,
    name: String(name).trim(),
    targetSkillId,
    description: description ? String(description).trim() : `Master prerequisites leading to ${targetSkill.name}.`,
    targetSkill,
  };

  store.goals.set(newGoal.id, newGoal);

  // Automatically assign to current user
  const userGoal: UserGoal = {
    userId,
    goalId: customGoalId,
    selectedAt: new Date().toISOString(),
    goal: newGoal,
  };

  store.userGoals.set(`${userId}_${customGoalId}`, userGoal);
  saveStoreToDisk();
  syncUserGoalToDb(userId, customGoalId);

  res.status(201).json({
    success: true,
    message: 'Custom learning goal created and activated successfully.',
    goal: newGoal,
  });
});

/* ---------------- RESET / SEED DEMO ---------------- */

mountRoute('post', '/reset-demo', async (req: Request, res: Response) => {
  if (!isDemoAuthAllowed()) {
    res.status(403).json({
      error: 'Demo reset operations are disabled in this environment.',
      code: 'DEMO_RESET_DISABLED'
    });
    return;
  }
  await initializeDatabaseSeed();
  await initializeDatabaseConnection();
  recalculateAllUserMasteries('user_demo_learner');
  res.json({ message: 'Database and demo state successfully re-seeded to initial diagnostic baseline.' });
});

/**
 * Global Error Sanitizer Middleware
 * Ensures internal system error stacks, database queries, and credentials are never leaked to clients.
 */
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[LearnTrace ErrorHandler] Handled uncaught route exception:', err?.message || err);

  const status = typeof err?.status === 'number' && err.status >= 400 && err.status < 600 ? err.status : 500;
  const isProd = process.env.NODE_ENV === 'production';

  res.status(status).json({
    error: isProd ? (status === 500 ? 'An unexpected internal error occurred. Please try again later.' : (err?.message || 'Request failed.')) : (err?.message || 'Internal server error'),
    code: err?.code || 'INTERNAL_ERROR',
    ...(isProd ? {} : { details: err?.stack || String(err) })
  });
});

/**
 * ============================================================================
 * VITE MIDDLEWARE & STATIC SERVING
 * ============================================================================
 */

async function startServer() {
  await initializeDatabaseSeed();
  await initializeDatabaseConnection();
  recalculateAllUserMasteries('user_demo_learner');

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LearnTrace Full-Stack Engine running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
