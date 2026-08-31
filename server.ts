import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

import { store, initializeDatabaseSeed, saveStoreToDisk } from './server/store.js';
import { recalculateAllUserMasteries, calculateSkillMasteryForUser, getUserMastery, getInterpretationFromScore, computeBktEstimate } from './server/services/masteryService.js';
import { getDirectPrerequisites, getFullPrerequisiteChain, getGraphPayload, calculateDownstreamCountInChain } from './server/services/graphService.js';
import { getPrioritizedRecommendation } from './server/services/recommendationService.js';
import { generateLearningPath } from './server/services/learningPathService.js';
import { explainQuestion, generateAdaptiveQuestion } from './server/services/ollamaService.js';
import { gradeOpenEndedResponse } from './server/services/semanticGraderService.js';
import { generateMultiModelTraceSimulation, computeDktMasterySequence, DEFAULT_BKT_PARAMS } from './server/services/knowledgeTracingService.js';
import { User, Attempt, UserGoal, CognitiveState } from './src/types.js';

dotenv.config();

const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'learntrace_jwt_secret_dev_key_2026';

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
 */
function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token || token === 'null' || token === 'undefined') {
    const demoUser = store.users.get('user_demo_learner');
    req.user = {
      id: demoUser ? demoUser.id : 'user_demo_learner',
      email: demoUser ? demoUser.email : 'learner@learntrace.ai',
    };
    return next();
  }

  if (token === 'demo_token') {
    req.user = { id: 'user_demo_learner', email: 'learner@learntrace.ai' };
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
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
  } catch {
    try {
      const decodedUnverified = jwt.decode(token) as { id?: string; email?: string } | null;
      if (decodedUnverified?.id) {
        let user = store.users.get(decodedUnverified.id);
        if (!user) {
          user = {
            id: decodedUnverified.id,
            email: decodedUnverified.email || `${decodedUnverified.id}@learntrace.ai`,
            passwordHash: '',
            createdAt: new Date().toISOString(),
          };
          store.users.set(user.id, user);
        }
        req.user = { id: user.id, email: user.email };
        return next();
      }
    } catch {
      // ignore
    }
  }

  req.user = { id: 'user_demo_learner', email: 'learner@learntrace.ai' };
  next();
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
  res.json({ status: 'ok', service: 'LearnTrace API', time: new Date().toISOString() });
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
  const existingUser = Array.from(store.users.values()).find((u) => u.email.toLowerCase() === cleanEmail);
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
  const user = Array.from(store.users.values()).find((u) => u.email.toLowerCase() === cleanEmail);
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
  if (email && email.trim() && email.trim().toLowerCase() !== user.email.toLowerCase()) {
    const trimmedEmail = email.trim().toLowerCase();
    const existing = Array.from(store.users.values()).find(
      (u) => u.email.toLowerCase() === trimmedEmail && u.id !== userId
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

mountRoute('get', '/questions', (req: Request, res: Response) => {
  const skillId = req.query.skill_id as string | undefined;

  let questions = Array.from(store.questions.values());
  if (skillId) {
    questions = questions.filter((q) => q.skillId === skillId || (q.skillsTested && q.skillsTested.includes(skillId)));
  }

  const sanitizedQuestions = questions.map(({ correctAnswer, ...rest }) => ({
    ...rest,
    skillName: store.skills.get(rest.skillId)?.name || rest.skillId,
  }));

  res.json(sanitizedQuestions);
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

  // Update mastery for ALL skills tested in this question
  skillsTested.forEach((sId) => calculateSkillMasteryForUser(userId, sId));
  const primaryMastery = calculateSkillMasteryForUser(userId, question.skillId);

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

  const generated = await generateAdaptiveQuestion(skill.id, skill.name, skill.domain);
  if (!generated) {
    res.status(503).json({ error: 'Unable to generate dynamic question. Please practice with existing questions.' });
    return;
  }

  store.questions.set(generated.id, generated);

  const { correctAnswer, ...sanitized } = generated;
  res.status(201).json({
    message: `Generated practice question for ${skill.name}.`,
    question: sanitized,
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

/* ---------------- RESET / SEED DEMO ---------------- */

mountRoute('post', '/reset-demo', async (req: Request, res: Response) => {
  await initializeDatabaseSeed();
  recalculateAllUserMasteries('user_demo_learner');
  res.json({ message: 'Database and demo state successfully re-seeded to initial diagnostic baseline.' });
});

/**
 * ============================================================================
 * VITE MIDDLEWARE & STATIC SERVING
 * ============================================================================
 */

async function startServer() {
  await initializeDatabaseSeed();
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
