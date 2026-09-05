import { PrismaClient } from '@prisma/client';
import { User, Attempt, SkillMastery, LearningGoal, Recommendation, LearningResource, Question } from '../src/types.js';
import { COMPREHENSIVE_QUESTION_BANK } from './data/questionBank.js';
import { SEED_LEARNING_RESOURCES } from './data/learningResources.js';

let prisma: PrismaClient | null = null;
let isPostgresConnected = false;
let connectionStatus: 'connected' | 'sandboxed_fallback' | 'not_configured' = 'not_configured';
let connectionError: string | null = null;
let lastCheckedAt: string | null = null;

/**
 * Returns the active PrismaClient if connected, or null in fallback mode.
 */
export function getPrismaClient(): PrismaClient | null {
  return isPostgresConnected ? prisma : null;
}

/**
 * Safely masks credentials in connection string for logging.
 */
function maskDatabaseUrl(url?: string): string {
  if (!url) return 'None';
  try {
    const parsed = new URL(url);
    if (parsed.password) {
      parsed.password = '****';
    }
    return parsed.toString();
  } catch {
    return 'postgresql://***';
  }
}

/**
 * Initializes database connection.
 * Attempts to connect to PostgreSQL via Prisma if DATABASE_URL is supplied.
 * In development, if unreachable, gracefully falls back to local storage without crashing.
 * In production, requires DATABASE_URL and a live PostgreSQL connection; fails clearly otherwise.
 */
export async function initializeDatabaseConnection(): Promise<{
  connected: boolean;
  status: 'connected' | 'sandboxed_fallback' | 'not_configured' | 'failed_production';
  message: string;
}> {
  lastCheckedAt = new Date().toISOString();
  const dbUrl = process.env.DATABASE_URL;
  const isProduction = process.env.NODE_ENV === 'production';

  if (!dbUrl || dbUrl.trim() === '') {
    connectionStatus = 'not_configured';
    isPostgresConnected = false;
    connectionError = 'DATABASE_URL environment variable is not set.';

    if (isProduction) {
      console.error('[LearnTrace Security] ❌ FATAL IN PRODUCTION: DATABASE_URL environment variable is required. Silently falling back to JSON storage is prohibited in production.');
      throw new Error('Production database failure: DATABASE_URL is required in production environment.');
    }

    console.log('[LearnTrace Storage] DATABASE_URL not set. Running in development local JSON file storage mode.');
    return {
      connected: false,
      status: 'not_configured',
      message: 'DATABASE_URL not set; running with local storage (development only).',
    };
  }

  const masked = maskDatabaseUrl(dbUrl);
  console.log(`[LearnTrace Storage] DATABASE_URL detected (${masked}). Probing PostgreSQL instance via Prisma...`);

  try {
    if (!prisma) {
      prisma = new PrismaClient({
        log: process.env.DEBUG_PRISMA ? ['query', 'info', 'warn', 'error'] : ['error'],
      });
    }

    // Connect with a 3.5s timeout race to prevent server hanging indefinitely
    const connectPromise = prisma.$connect().then(async () => {
      // Execute a lightweight query to ensure target database responds
      await prisma!.$queryRaw`SELECT 1 AS healthcheck`;
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Connection timed out after 3500ms (PostgreSQL host unreachable)')), 3500)
    );

    await Promise.race([connectPromise, timeoutPromise]);

    isPostgresConnected = true;
    connectionStatus = 'connected';
    connectionError = null;
    console.log(`[LearnTrace Storage] ✅ Successfully connected to PostgreSQL instance via Prisma ORM at ${masked}. Operating in PostgreSQL mode.`);

    // Seed database if empty
    await seedPostgresIfEmpty();

    return {
      connected: true,
      status: 'connected',
      message: `Connected to PostgreSQL at ${masked}`,
    };
  } catch (err: any) {
    isPostgresConnected = false;
    connectionStatus = isProduction ? 'failed_production' as any : 'sandboxed_fallback';
    connectionError = err.message || String(err);

    // Gracefully disconnect prisma client so connection pool does not leak
    if (prisma) {
      try {
        await prisma.$disconnect();
      } catch {
        // ignore
      }
    }

    if (isProduction) {
      console.error(`[LearnTrace Security] ❌ FATAL IN PRODUCTION: PostgreSQL connection failed: ${connectionError}. Refusing to fall back to JSON storage.`);
      throw new Error(`Production database connection failed: ${connectionError}`);
    }

    console.info(`[LearnTrace Storage] ℹ️ PostgreSQL instance not reachable in local sandbox (${connectionError}). Resilient local JSON storage mode active.`);

    return {
      connected: false,
      status: 'sandboxed_fallback',
      message: `PostgreSQL unreachable; fallback active (${connectionError})`,
    };
  }
}

/**
 * Seeds initial skills, prerequisites, goals, questions, and resources into PostgreSQL if empty.
 */
async function seedPostgresIfEmpty(): Promise<void> {
  if (!prisma || !isPostgresConnected) return;

  try {
    const skillCount = await prisma.skill.count();
    if (skillCount > 0) {
      console.log(`[LearnTrace Storage] PostgreSQL already initialized with ${skillCount} skills.`);
      return;
    }

    console.log('[LearnTrace Storage] Seeding baseline curriculum and diagnostic data into PostgreSQL...');

    // 1. Skills
    const skills = [
      { id: 'skill_python', name: 'Python', domain: 'Programming & Data Science', description: 'Foundational programming concepts, control flow, list comprehensions, vectorization, and data structures.' },
      { id: 'skill_prob', name: 'Probability', domain: 'Mathematics & Statistics', description: 'Sample spaces, independent events, Bayes theorem foundations, combinatorics, and uncertainty modeling.' },
      { id: 'skill_cond_prob', name: 'Conditional Probability', domain: 'Mathematics & Statistics', description: 'Law of total probability, joint probability, marginal probabilities, and Bayesian inference updates.' },
      { id: 'skill_prob_dist', name: 'Probability Distributions', domain: 'Mathematics & Statistics', description: 'Discrete and continuous random variables, Normal, Binomial, Poisson distributions, PDF, and CDF functions.' },
      { id: 'skill_stats', name: 'Statistics', domain: 'Mathematics & Statistics', description: 'Hypothesis testing, p-values, confidence intervals, Central Limit Theorem, variance estimation, and regression.' },
      { id: 'skill_linalg', name: 'Linear Algebra', domain: 'Mathematics & Computing', description: 'Vector spaces, matrix transformations, dot products, eigenvalues, eigenvectors, and dimensionality reduction.' },
      { id: 'skill_model_eval', name: 'Model Evaluation', domain: 'Applied Machine Learning', description: 'Confusion matrices, Precision, Recall, F1-score, ROC-AUC, cross-validation, and error diagnostics.' },
      { id: 'skill_ml', name: 'Machine Learning', domain: 'Artificial Intelligence', description: 'Loss functions, gradient descent optimization, bias-variance tradeoff, classification, and neural algorithms.' },
    ];

    for (const s of skills) {
      await prisma.skill.upsert({
        where: { id: s.id },
        update: {},
        create: s,
      });
    }

    // 2. Prerequisites
    const prerequisites = [
      { skillId: 'skill_cond_prob', prerequisiteSkillId: 'skill_prob' },
      { skillId: 'skill_prob_dist', prerequisiteSkillId: 'skill_cond_prob' },
      { skillId: 'skill_stats', prerequisiteSkillId: 'skill_prob' },
      { skillId: 'skill_stats', prerequisiteSkillId: 'skill_prob_dist' },
      { skillId: 'skill_model_eval', prerequisiteSkillId: 'skill_stats' },
      { skillId: 'skill_ml', prerequisiteSkillId: 'skill_stats' },
      { skillId: 'skill_ml', prerequisiteSkillId: 'skill_linalg' },
      { skillId: 'skill_ml', prerequisiteSkillId: 'skill_model_eval' },
      { skillId: 'skill_ml', prerequisiteSkillId: 'skill_python' },
    ];

    for (const p of prerequisites) {
      await prisma.skillPrerequisite.upsert({
        where: {
          skillId_prerequisiteSkillId: {
            skillId: p.skillId,
            prerequisiteSkillId: p.prerequisiteSkillId,
          },
        },
        update: {},
        create: p,
      });
    }

    // 3. Learning Goals
    const goals = [
      { id: 'goal_mle', name: 'Machine Learning Engineer', targetSkillId: 'skill_ml' },
      { id: 'goal_ds', name: 'Data Science Specialist', targetSkillId: 'skill_model_eval' },
      { id: 'goal_prob', name: 'Probability & Inference Specialist', targetSkillId: 'skill_prob_dist' },
    ];

    for (const g of goals) {
      await prisma.learningGoal.upsert({
        where: { id: g.id },
        update: {},
        create: g,
      });
    }

    // 4. Question Bank
    for (const q of COMPREHENSIVE_QUESTION_BANK) {
      await prisma.question.upsert({
        where: { id: q.id },
        update: {},
        create: {
          id: q.id,
          skillId: q.skillId,
          text: q.text,
          difficulty: q.difficulty,
          correctAnswer: q.correctAnswer,
          questionType: 'MULTIPLE_CHOICE',
          options: q.options as any,
          explanation: q.explanation,
          cognitiveCategory: q.cognitiveCategory,
          distractorRationales: q.distractorRationales as any,
          skillsTested: q.skillsTested as any,
        },
      });
    }

    // 5. Learning Resources
    for (const r of SEED_LEARNING_RESOURCES) {
      await prisma.learningResource.upsert({
        where: { id: r.id },
        update: {},
        create: {
          id: r.id,
          skillId: r.skillId,
          skillName: r.skillName,
          title: r.title,
          type: r.type,
          description: r.description,
          url: r.url,
          readTimeMinutes: r.readTimeMinutes,
          difficulty: r.difficulty,
          keyConcepts: r.keyConcepts as any,
          contentSummary: r.contentSummary,
          practiceExercise: r.practiceExercise as any,
        },
      });
    }

    console.log('[LearnTrace Storage] ✅ PostgreSQL successfully seeded with curriculum, question bank, and learning resources.');
  } catch (err: any) {
    console.error('[LearnTrace Storage] Error during PostgreSQL seeding:', err.message);
  }
}

/**
 * Synchronize user to PostgreSQL if connected.
 */
export async function syncUserToDb(user: { id: string; email: string; passwordHash?: string }): Promise<void> {
  if (!prisma || !isPostgresConnected) return;
  try {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        email: user.email.toLowerCase().trim(),
        passwordHash: user.passwordHash || '',
      },
      create: {
        id: user.id,
        email: user.email.toLowerCase().trim(),
        passwordHash: user.passwordHash || '',
      },
    });
  } catch (err: any) {
    console.warn(`[LearnTrace Storage] Warning: Failed to sync user to PostgreSQL: ${err.message}`);
  }
}

/**
 * Synchronize attempt record to PostgreSQL if connected.
 */
export async function syncAttemptToDb(attempt: Attempt): Promise<void> {
  if (!prisma || !isPostgresConnected) return;
  try {
    await prisma.attempt.create({
      data: {
        id: attempt.id,
        userId: attempt.userId,
        questionId: attempt.questionId,
        correct: attempt.correct,
        timeTakenSeconds: attempt.timeTakenSeconds || 0,
        confidence: attempt.confidence || 3,
        attemptNumber: attempt.attemptNumber || 1,
        createdAt: attempt.createdAt ? new Date(attempt.createdAt) : new Date(),
      },
    });
  } catch (err: any) {
    console.warn(`[LearnTrace Storage] Warning: Failed to sync attempt to PostgreSQL: ${err.message}`);
  }
}

/**
 * Synchronize mastery update to PostgreSQL if connected.
 */
export async function syncMasteryToDb(userId: string, skillId: string, masteryScore: number, evidenceCount: number): Promise<void> {
  if (!prisma || !isPostgresConnected) return;
  try {
    await prisma.skillMastery.upsert({
      where: {
        userId_skillId: {
          userId,
          skillId,
        },
      },
      update: {
        masteryScore,
        evidenceCount,
        lastUpdated: new Date(),
      },
      create: {
        userId,
        skillId,
        masteryScore,
        evidenceCount,
        lastUpdated: new Date(),
      },
    });
  } catch (err: any) {
    console.warn(`[LearnTrace Storage] Warning: Failed to sync mastery to PostgreSQL: ${err.message}`);
  }
}

/**
 * Synchronize user goal assignment to PostgreSQL if connected.
 */
export async function syncUserGoalToDb(userId: string, goalId: string): Promise<void> {
  if (!prisma || !isPostgresConnected) return;
  try {
    await prisma.userGoal.upsert({
      where: {
        userId_goalId: {
          userId,
          goalId,
        },
      },
      update: {
        selectedAt: new Date(),
      },
      create: {
        userId,
        goalId,
        selectedAt: new Date(),
      },
    });
  } catch (err: any) {
    console.warn(`[LearnTrace Storage] Warning: Failed to sync user goal to PostgreSQL: ${err.message}`);
  }
}

/**
 * Synchronize a new or enriched Question to PostgreSQL if connected.
 */
export async function syncQuestionToDb(q: Question): Promise<void> {
  if (!prisma || !isPostgresConnected) return;
  try {
    await prisma.question.upsert({
      where: { id: q.id },
      update: {
        skillId: q.skillId,
        text: q.text,
        difficulty: q.difficulty,
        correctAnswer: q.correctAnswer,
        questionType: (q.questionType || 'MULTIPLE_CHOICE') as string,
        options: q.options as any,
        explanation: q.explanation,
        cognitiveCategory: (q.cognitiveCategory as string) || 'Application',
        distractorRationales: q.distractorRationales as any,
        skillsTested: (q.skillsTested as any) || [q.skillId],
      },
      create: {
        id: q.id,
        skillId: q.skillId,
        text: q.text,
        difficulty: q.difficulty,
        correctAnswer: q.correctAnswer,
        questionType: (q.questionType || 'MULTIPLE_CHOICE') as string,
        options: q.options as any,
        explanation: q.explanation,
        cognitiveCategory: (q.cognitiveCategory as string) || 'Application',
        distractorRationales: q.distractorRationales as any,
        skillsTested: (q.skillsTested as any) || [q.skillId],
      },
    });
  } catch (err: any) {
    console.warn(`[LearnTrace Storage] Warning: Failed to sync question to PostgreSQL: ${err.message}`);
  }
}

/**
 * Retrieves current database health and persistence status.
 */
export function getDatabaseStatus() {
  return {
    database: isPostgresConnected ? 'postgresql' : 'local_storage',
    databaseUrlProvided: Boolean(process.env.DATABASE_URL),
    databaseUrlMasked: maskDatabaseUrl(process.env.DATABASE_URL),
    isPostgresConnected,
    connectionStatus,
    connectionError,
    lastCheckedAt,
    storageEngine: isPostgresConnected ? 'PostgreSQL (Prisma ORM)' : 'Local File Storage (Sandboxed Fallback)',
    details: isPostgresConnected
      ? 'Connected to live PostgreSQL database with Prisma ORM.'
      : 'Operating in sandboxed development mode with resilient local JSON persistence.',
  };
}
