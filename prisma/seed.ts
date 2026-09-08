import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { COMPREHENSIVE_QUESTION_BANK } from '../server/data/questionBank.js';
import { SEED_LEARNING_RESOURCES } from '../server/data/learningResources.js';

const prisma = new PrismaClient();

async function main() {
  console.log('[LearnTrace Prisma] 🚀 Starting database seed...');

  // 1. Clean existing records in dependency-safe order
  await prisma.recommendation.deleteMany({});
  await prisma.skillMastery.deleteMany({});
  await prisma.attempt.deleteMany({});
  await prisma.questionSkill.deleteMany({});
  await prisma.question.deleteMany({});
  await prisma.userGoal.deleteMany({});
  await prisma.learningGoal.deleteMany({});
  await prisma.skillPrerequisite.deleteMany({});
  await prisma.learningResource.deleteMany({});
  await prisma.skill.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Seed Skills (Domain: Data Science & AI Foundations)
  const skillsData = [
    {
      id: 'skill_python',
      name: 'Python Programming',
      domain: 'Computer Science',
      description: 'Foundational programming concepts, control flow, list comprehensions, and vectorized data operations.',
    },
    {
      id: 'skill_prob',
      name: 'Probability Foundations',
      domain: 'Mathematics',
      description: 'Probability spaces, discrete & continuous variables, independence, and foundational likelihood.',
    },
    {
      id: 'skill_cond_prob',
      name: 'Conditional Probability',
      domain: 'Mathematics',
      description: "Bayes' theorem, prior and posterior updates, conditionality, and likelihood ratios.",
    },
    {
      id: 'skill_prob_dist',
      name: 'Probability Distributions',
      domain: 'Mathematics',
      description: 'Gaussian, Binomial, Poisson, uniform distributions, expectation, and variance.',
    },
    {
      id: 'skill_stats',
      name: 'Statistical Inference',
      domain: 'Statistics',
      description: 'Hypothesis testing, p-values, Central Limit Theorem, confidence intervals, and estimation.',
    },
    {
      id: 'skill_linalg',
      name: 'Linear Algebra',
      domain: 'Mathematics',
      description: 'Vector spaces, matrix multiplication, dot products, eigenvalues, eigenvectors, and transformations.',
    },
    {
      id: 'skill_model_eval',
      name: 'Model Evaluation',
      domain: 'Machine Learning',
      description: 'Precision, recall, F1, ROC curves, cross-validation, bias-variance tradeoff, and calibration.',
    },
    {
      id: 'skill_ml',
      name: 'Machine Learning Foundations',
      domain: 'Machine Learning',
      description: 'Supervised & unsupervised learning, gradient descent, loss functions, and generalization.',
    },
  ];

  for (const s of skillsData) {
    await prisma.skill.create({ data: s });
  }
  console.log(`[LearnTrace Prisma] ✅ Seeded ${skillsData.length} skills.`);

  // 3. Seed Prerequisites
  const prerequisites = [
    { skillId: 'skill_cond_prob', prerequisiteSkillId: 'skill_prob' },
    { skillId: 'skill_prob_dist', prerequisiteSkillId: 'skill_cond_prob' },
    { skillId: 'skill_stats', prerequisiteSkillId: 'skill_prob_dist' },
    { skillId: 'skill_ml', prerequisiteSkillId: 'skill_python' },
    { skillId: 'skill_ml', prerequisiteSkillId: 'skill_linalg' },
    { skillId: 'skill_ml', prerequisiteSkillId: 'skill_stats' },
    { skillId: 'skill_model_eval', prerequisiteSkillId: 'skill_stats' },
    { skillId: 'skill_model_eval', prerequisiteSkillId: 'skill_ml' },
  ];

  for (const p of prerequisites) {
    await prisma.skillPrerequisite.create({ data: p });
  }
  console.log(`[LearnTrace Prisma] ✅ Seeded ${prerequisites.length} prerequisite edges.`);

  // 4. Seed Learning Goals
  const goals = [
    {
      id: 'goal_ml_engineer',
      name: 'Machine Learning Engineer',
      targetSkillId: 'skill_ml',
    },
    {
      id: 'goal_data_scientist',
      name: 'Data Scientist',
      targetSkillId: 'skill_model_eval',
    },
    {
      id: 'goal_stat_analyst',
      name: 'Statistical Analyst',
      targetSkillId: 'skill_stats',
    },
  ];

  for (const g of goals) {
    await prisma.learningGoal.create({ data: g });
  }
  console.log(`[LearnTrace Prisma] ✅ Seeded ${goals.length} learning goals.`);

  // 5. Seed Questions from Comprehensive Bank
  let questionCount = 0;
  for (const q of COMPREHENSIVE_QUESTION_BANK) {
    await prisma.question.create({
      data: {
        id: q.id,
        skillId: q.skillId,
        text: q.text,
        difficulty: q.difficulty || 1,
        correctAnswer: q.correctAnswer || 'A',
        questionType: (q as any).questionType || 'MULTIPLE_CHOICE',
        options: q.options as any,
        explanation: q.explanation || '',
        cognitiveCategory: q.cognitiveCategory || 'Comprehension',
        distractorRationales: (q.distractorRationales as any) || {},
        skillsTested: (q.skillsTested as any) || [q.skillId],
      },
    });

    await prisma.questionSkill.create({
      data: {
        questionId: q.id,
        skillId: q.skillId,
      },
    });
    questionCount++;
  }
  console.log(`[LearnTrace Prisma] ✅ Seeded ${questionCount} calibrated assessment items.`);

  // 6. Seed Learning Resources
  for (const r of SEED_LEARNING_RESOURCES) {
    await prisma.learningResource.create({
      data: {
        id: r.id,
        skillId: r.skillId,
        title: r.title,
        type: r.type,
        description: r.description,
        url: r.url || '',
        readTimeMinutes: r.readTimeMinutes || 10,
        difficulty: r.difficulty || 'Intermediate',
        keyConcepts: (r.keyConcepts as any) || [],
        contentSummary: r.contentSummary || '',
        practiceExercise: (r.practiceExercise as any) || null,
      },
    });
  }
  console.log(`[LearnTrace Prisma] ✅ Seeded ${SEED_LEARNING_RESOURCES.length} learning resources.`);

  // 7. Seed Demo Learner Account
  const passwordHash = await bcrypt.hash('password123', 10);
  const demoUser = await prisma.user.create({
    data: {
      id: 'user_demo_learner',
      email: 'learner@learntrace.ai',
      passwordHash,
    },
  });

  await prisma.userGoal.create({
    data: {
      userId: demoUser.id,
      goalId: 'goal_ml_engineer',
    },
  });

  // Seed baseline masteries
  for (const s of skillsData) {
    await prisma.skillMastery.create({
      data: {
        userId: demoUser.id,
        skillId: s.id,
        masteryScore: 0.15,
        evidenceCount: 0,
      },
    });
  }

  console.log('[LearnTrace Prisma] ✅ Seeded demo user account (learner@learntrace.ai).');
  console.log('[LearnTrace Prisma] 🏁 Database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('[LearnTrace Prisma] ❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
