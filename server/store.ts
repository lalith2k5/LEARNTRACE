import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { User, Skill, SkillPrerequisite, LearningGoal, UserGoal, Question, Attempt, SkillMastery, Recommendation, LearningResource } from '../src/types.js';
import { COMPREHENSIVE_QUESTION_BANK } from './data/questionBank.js';
import { SEED_LEARNING_RESOURCES } from './data/learningResources.js';

export interface DatabaseStore {
  users: Map<string, User & { passwordHash: string }>;
  skills: Map<string, Skill>;
  prerequisites: SkillPrerequisite[];
  goals: Map<string, LearningGoal>;
  userGoals: Map<string, UserGoal>; // key: `${userId}_${goalId}`
  questions: Map<string, Question>;
  resources: Map<string, LearningResource>;
  attempts: Attempt[];
  masteries: Map<string, SkillMastery>; // key: `${userId}_${skillId}`
  recommendations: Recommendation[];
}

export const store: DatabaseStore = {
  users: new Map(),
  skills: new Map(),
  prerequisites: [],
  goals: new Map(),
  userGoals: new Map(),
  questions: new Map(),
  resources: new Map(),
  attempts: [],
  masteries: new Map(),
  recommendations: [],
};

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'learntrace_store.json');

export function saveStoreToDisk() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const serialized = {
      users: Array.from(store.users.entries()),
      userGoals: Array.from(store.userGoals.entries()),
      questions: Array.from(store.questions.entries()),
      attempts: store.attempts,
      masteries: Array.from(store.masteries.entries()),
      savedAt: new Date().toISOString(),
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(serialized, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Failed to save store snapshot to disk:', err);
  }
}

export function loadStoreFromDisk(): boolean {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const dataStr = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(dataStr);
      if (parsed.users && parsed.attempts) {
        store.users = new Map(parsed.users);
        store.userGoals = new Map(parsed.userGoals || []);
        if (parsed.questions && parsed.questions.length > 0) {
          const bankIdSet = new Set(COMPREHENSIVE_QUESTION_BANK.map(q => q.id));
          // Merge only custom/AI generated questions, skipping obsolete legacy seed items
          for (const [qId, q] of parsed.questions) {
            if (!bankIdSet.has(qId) && (qId.startsWith('ai_') || qId.startsWith('custom_') || (q as any).isCustom)) {
              store.questions.set(qId, q);
            }
          }
        }
        // Always ensure comprehensive question bank is fully loaded with latest cognitive fields
        for (const q of COMPREHENSIVE_QUESTION_BANK) {
          store.questions.set(q.id, {
            id: q.id,
            skillId: q.skillId,
            skillName: q.skillName,
            skillsTested: q.skillsTested,
            difficulty: q.difficulty,
            cognitiveCategory: q.cognitiveCategory,
            questionType: 'MULTIPLE_CHOICE',
            text: q.text,
            options: q.options,
            correctAnswer: q.correctAnswer,
            distractorRationales: q.distractorRationales,
            explanation: q.explanation,
          });
        }
        // Always ensure learning resources repository is loaded
        for (const res of SEED_LEARNING_RESOURCES) {
          store.resources.set(res.id, res);
        }
        store.attempts = parsed.attempts || [];
        store.masteries = new Map(parsed.masteries || []);
        return true;
      }
    }
  } catch (err) {
    console.warn('Failed to load store snapshot from disk:', err);
  }
  return false;
}

export async function initializeDatabaseSeed(forceReset = false) {
  // Clear any existing seed
  store.skills.clear();
  store.prerequisites = [];
  store.goals.clear();
  store.questions.clear();
  store.resources.clear();

  // Load curated learning resources
  for (const res of SEED_LEARNING_RESOURCES) {
    store.resources.set(res.id, res);
  }

  // 1. Skills (8-node DAG Matching Proposal Section 1, 2, 6 & Domain Map)
  const skillsData: Skill[] = [
    {
      id: 'skill_python',
      name: 'Python',
      domain: 'Programming & Data Science',
      description: 'Foundational programming concepts, control flow, list comprehensions, vectorization, and data structures.',
    },
    {
      id: 'skill_prob',
      name: 'Probability',
      domain: 'Mathematics & Statistics',
      description: 'Sample spaces, independent events, Bayes theorem foundations, combinatorics, and uncertainty modeling.',
    },
    {
      id: 'skill_cond_prob',
      name: 'Conditional Probability',
      domain: 'Mathematics & Statistics',
      description: 'Law of total probability, joint probability, marginal probabilities, and Bayesian inference updates.',
    },
    {
      id: 'skill_prob_dist',
      name: 'Probability Distributions',
      domain: 'Mathematics & Statistics',
      description: 'Discrete and continuous random variables, Normal, Binomial, Poisson distributions, PDF, and CDF functions.',
    },
    {
      id: 'skill_stats',
      name: 'Statistics',
      domain: 'Mathematics & Statistics',
      description: 'Hypothesis testing, p-values, confidence intervals, Central Limit Theorem, variance estimation, and regression.',
    },
    {
      id: 'skill_linalg',
      name: 'Linear Algebra',
      domain: 'Mathematics & Computing',
      description: 'Vector spaces, matrix transformations, dot products, eigenvalues, eigenvectors, and dimensionality reduction.',
    },
    {
      id: 'skill_model_eval',
      name: 'Model Evaluation',
      domain: 'Applied Machine Learning',
      description: 'Confusion matrices, Precision, Recall, F1-score, ROC-AUC, cross-validation, and error diagnostics.',
    },
    {
      id: 'skill_ml',
      name: 'Machine Learning',
      domain: 'Artificial Intelligence',
      description: 'Loss functions, gradient descent optimization, bias-variance tradeoff, classification, and neural algorithms.',
    },
  ];

  for (const skill of skillsData) {
    store.skills.set(skill.id, skill);
  }

  // 2. Knowledge Graph Prerequisite Relationships:
  store.prerequisites = [
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

  // 3. Learning Goals
  const mlGoal: LearningGoal = {
    id: 'goal_mle',
    name: 'Machine Learning Engineer',
    targetSkillId: 'skill_ml',
    description: 'Master foundational mathematics, statistics, model evaluation, and machine learning algorithms.',
    targetSkill: store.skills.get('skill_ml'),
  };
  store.goals.set(mlGoal.id, mlGoal);

  const dataScientistGoal: LearningGoal = {
    id: 'goal_ds',
    name: 'Data Science Specialist',
    targetSkillId: 'skill_model_eval',
    description: 'Master rigorous statistical inference, probability distributions, data wrangling, and predictive model validation.',
    targetSkill: store.skills.get('skill_model_eval'),
  };
  store.goals.set(dataScientistGoal.id, dataScientistGoal);

  const probSpecialistGoal: LearningGoal = {
    id: 'goal_prob',
    name: 'Probability & Inference Specialist',
    targetSkillId: 'skill_prob_dist',
    description: 'Deep dive into Bayesian methods, probability density functions, and stochastic distributions.',
    targetSkill: store.skills.get('skill_prob_dist'),
  };
  store.goals.set(probSpecialistGoal.id, probSpecialistGoal);

  // 4. Curated Comprehensive Diagnostic Question Bank (320 items across 8 skills)
  // Load and register all items from comprehensive question repository
  for (const q of COMPREHENSIVE_QUESTION_BANK) {
    store.questions.set(q.id, {
      id: q.id,
      skillId: q.skillId,
      skillName: q.skillName,
      skillsTested: q.skillsTested,
      difficulty: q.difficulty,
      cognitiveCategory: q.cognitiveCategory,
      questionType: 'MULTIPLE_CHOICE',
      text: q.text,
      options: q.options,
      correctAnswer: q.correctAnswer,
      distractorRationales: q.distractorRationales,
      explanation: q.explanation,
    });
  }

  // 5. Default Demo User
  const demoUserId = 'user_demo_learner';
  const defaultPassword = 'password123';
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(defaultPassword, salt);

  const demoUser: User & { passwordHash: string } = {
    id: demoUserId,
    email: 'learner@learntrace.ai',
    passwordHash,
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  };

  store.users.set(demoUser.id, demoUser);

  // Set default goal: Machine Learning Engineer
  store.userGoals.set(`${demoUserId}_goal_mle`, {
    userId: demoUserId,
    goalId: 'goal_mle',
    selectedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    goal: mlGoal,
  });

  // Check if saved disk data exists
  if (!forceReset && loadStoreFromDisk()) {
    return;
  }

  // 6. Diagnostic Initial Attempts Matching Proposal Baseline
  const initialAttempts: Attempt[] = [
    // Python (High mastery evidence)
    {
      id: 'att_1',
      userId: demoUserId,
      questionId: 'q_py_1',
      questionText: store.questions.get('q_py_1')?.text,
      skillId: 'skill_python',
      skillName: 'Python',
      skillsTested: ['skill_python'],
      selectedAnswer: 'opt_1',
      correct: true,
      timeTakenSeconds: 8,
      confidence: 5,
      attemptNumber: 1,
      cognitiveState: 'SOLID_MASTERY',
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      id: 'att_2',
      userId: demoUserId,
      questionId: 'q_py_2',
      questionText: store.questions.get('q_py_2')?.text,
      skillId: 'skill_python',
      skillName: 'Python',
      skillsTested: ['skill_python'],
      selectedAnswer: 'opt_1',
      correct: true,
      timeTakenSeconds: 12,
      confidence: 5,
      attemptNumber: 1,
      cognitiveState: 'SOLID_MASTERY',
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: 'att_3',
      userId: demoUserId,
      questionId: 'q_py_3',
      questionText: store.questions.get('q_py_3')?.text,
      skillId: 'skill_python',
      skillName: 'Python',
      skillsTested: ['skill_python'],
      selectedAnswer: 'opt_1',
      correct: true,
      timeTakenSeconds: 15,
      confidence: 4,
      attemptNumber: 1,
      cognitiveState: 'SOLID_MASTERY',
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    },

    // Probability (Weak mastery evidence - 34% - Confident Misconception)
    {
      id: 'att_4',
      userId: demoUserId,
      questionId: 'q_prob_1',
      questionText: store.questions.get('q_prob_1')?.text,
      skillId: 'skill_prob',
      skillName: 'Probability',
      skillsTested: ['skill_prob'],
      selectedAnswer: 'opt_2', // Incorrect: P(A or B) = P(A) + P(B)
      correct: false,
      timeTakenSeconds: 28,
      confidence: 4, // High confidence misconception
      attemptNumber: 1,
      cognitiveState: 'CONFIDENT_MISCONCEPTION',
      createdAt: new Date(Date.now() - 20 * 3600000).toISOString(),
    },
    {
      id: 'att_5',
      userId: demoUserId,
      questionId: 'q_prob_2',
      questionText: store.questions.get('q_prob_2')?.text,
      skillId: 'skill_prob',
      skillName: 'Probability',
      skillsTested: ['skill_prob'],
      selectedAnswer: 'opt_2', // Incorrect: 2/6
      correct: false,
      timeTakenSeconds: 35,
      confidence: 3,
      attemptNumber: 1,
      cognitiveState: 'UNCERTAIN_MISTAKE',
      createdAt: new Date(Date.now() - 16 * 3600000).toISOString(),
    },

    // Conditional Probability (Weak)
    {
      id: 'att_6',
      userId: demoUserId,
      questionId: 'q_cond_1',
      questionText: store.questions.get('q_cond_1')?.text,
      skillId: 'skill_cond_prob',
      skillName: 'Conditional Probability',
      skillsTested: ['skill_prob', 'skill_cond_prob'],
      selectedAnswer: 'opt_2', // Incorrect formula
      correct: false,
      timeTakenSeconds: 40,
      confidence: 3,
      attemptNumber: 1,
      cognitiveState: 'UNCERTAIN_MISTAKE',
      createdAt: new Date(Date.now() - 14 * 3600000).toISOString(),
    },

    // Statistics (Good foundation - 72%)
    {
      id: 'att_7',
      userId: demoUserId,
      questionId: 'q_stat_1',
      questionText: store.questions.get('q_stat_1')?.text,
      skillId: 'skill_stats',
      skillName: 'Statistics',
      skillsTested: ['skill_stats'],
      selectedAnswer: 'opt_1',
      correct: true,
      timeTakenSeconds: 14,
      confidence: 4,
      attemptNumber: 1,
      cognitiveState: 'SOLID_MASTERY',
      createdAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    },
    {
      id: 'att_8',
      userId: demoUserId,
      questionId: 'q_stat_2',
      questionText: store.questions.get('q_stat_2')?.text,
      skillId: 'skill_stats',
      skillName: 'Statistics',
      skillsTested: ['skill_stats', 'skill_prob_dist'],
      selectedAnswer: 'opt_1',
      correct: true,
      timeTakenSeconds: 20,
      confidence: 3,
      attemptNumber: 1,
      cognitiveState: 'NORMAL_MASTERY',
      createdAt: new Date(Date.now() - 10 * 3600000).toISOString(),
    },

    // Linear Algebra (Moderate - 64%)
    {
      id: 'att_9',
      userId: demoUserId,
      questionId: 'q_la_1',
      questionText: store.questions.get('q_la_1')?.text,
      skillId: 'skill_linalg',
      skillName: 'Linear Algebra',
      skillsTested: ['skill_linalg'],
      selectedAnswer: 'opt_1',
      correct: true,
      timeTakenSeconds: 15,
      confidence: 4,
      attemptNumber: 1,
      cognitiveState: 'SOLID_MASTERY',
      createdAt: new Date(Date.now() - 8 * 3600000).toISOString(),
    },
    {
      id: 'att_10',
      userId: demoUserId,
      questionId: 'q_la_2',
      questionText: store.questions.get('q_la_2')?.text,
      skillId: 'skill_linalg',
      skillName: 'Linear Algebra',
      skillsTested: ['skill_linalg'],
      selectedAnswer: 'opt_2', // Incorrect
      correct: false,
      timeTakenSeconds: 32,
      confidence: 2,
      attemptNumber: 1,
      cognitiveState: 'UNCERTAIN_MISTAKE',
      createdAt: new Date(Date.now() - 6 * 3600000).toISOString(),
    },

    // Model Evaluation (Developing - 52%)
    {
      id: 'att_11',
      userId: demoUserId,
      questionId: 'q_eval_1',
      questionText: store.questions.get('q_eval_1')?.text,
      skillId: 'skill_model_eval',
      skillName: 'Model Evaluation',
      skillsTested: ['skill_model_eval', 'skill_stats'],
      selectedAnswer: 'opt_1',
      correct: true,
      timeTakenSeconds: 22,
      confidence: 3,
      attemptNumber: 1,
      cognitiveState: 'NORMAL_MASTERY',
      createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    },

    // Machine Learning (Developing - 55%)
    {
      id: 'att_12',
      userId: demoUserId,
      questionId: 'q_ml_1',
      questionText: store.questions.get('q_ml_1')?.text,
      skillId: 'skill_ml',
      skillName: 'Machine Learning',
      skillsTested: ['skill_ml'],
      selectedAnswer: 'opt_1',
      correct: true,
      timeTakenSeconds: 18,
      confidence: 3,
      attemptNumber: 1,
      cognitiveState: 'NORMAL_MASTERY',
      createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    },
    {
      id: 'att_13',
      userId: demoUserId,
      questionId: 'q_ml_2',
      questionText: store.questions.get('q_ml_2')?.text,
      skillId: 'skill_ml',
      skillName: 'Machine Learning',
      skillsTested: ['skill_ml', 'skill_linalg'],
      selectedAnswer: 'opt_2', // Incorrect
      correct: false,
      timeTakenSeconds: 30,
      confidence: 3,
      attemptNumber: 1,
      cognitiveState: 'UNCERTAIN_MISTAKE',
      createdAt: new Date(Date.now() - 1 * 3600000).toISOString(),
    },
  ];

  store.attempts = initialAttempts;
  saveStoreToDisk();
}
