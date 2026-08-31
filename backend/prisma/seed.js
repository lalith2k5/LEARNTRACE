const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding LearnTrace database...');

  // 1. Clean existing records in dependency-safe order
  await prisma.recommendation.deleteMany({});
  await prisma.skillMastery.deleteMany({});
  await prisma.attempt.deleteMany({});
  await prisma.questionSkill.deleteMany({});
  await prisma.question.deleteMany({});
  await prisma.userGoal.deleteMany({});
  await prisma.learningGoal.deleteMany({});
  await prisma.skillPrerequisite.deleteMany({});
  await prisma.skill.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Create Skills (Domain: Data Science)
  const python = await prisma.skill.create({
    data: {
      id: 'skill_python',
      name: 'Python',
      domain: 'Data Science',
      description: 'Foundational programming concepts, control flow, list comprehensions, and vectorized data operations.',
    },
  });

  const probability = await prisma.skill.create({
    data: {
      id: 'skill_prob',
      name: 'Probability',
      domain: 'Data Science',
      description: 'Probability spaces, conditional probability, Bayes theorem, discrete/continuous distributions, and mathematical expectation.',
    },
  });

  const statistics = await prisma.skill.create({
    data: {
      id: 'skill_stats',
      name: 'Statistics',
      domain: 'Data Science',
      description: 'Descriptive and inferential statistics, hypothesis testing, p-values, Central Limit Theorem, and regression analysis.',
    },
  });

  const linearAlgebra = await prisma.skill.create({
    data: {
      id: 'skill_linalg',
      name: 'Linear Algebra',
      domain: 'Data Science',
      description: 'Vector spaces, matrix multiplication, dot products, eigenvalues, eigenvectors, and dimensionality reduction.',
    },
  });

  const machineLearning = await prisma.skill.create({
    data: {
      id: 'skill_ml',
      name: 'Machine Learning',
      domain: 'Data Science',
      description: 'Supervised and unsupervised algorithms, gradient descent optimization, bias-variance tradeoff, and model evaluation metrics.',
    },
  });

  console.log('Created 5 core skills in Data Science domain');

  // 3. Create Prerequisite Relationships
  // Meaning: skillId depends on prerequisiteSkillId
  // Probability -> Statistics
  // Statistics -> Machine Learning
  // Linear Algebra -> Machine Learning
  await prisma.skillPrerequisite.createMany({
    data: [
      { skillId: statistics.id, prerequisiteSkillId: probability.id },
      { skillId: machineLearning.id, prerequisiteSkillId: statistics.id },
      { skillId: machineLearning.id, prerequisiteSkillId: linearAlgebra.id },
    ],
  });

  console.log('Created Knowledge Graph prerequisite relationships');

  // 4. Create Learning Goal: Machine Learning Engineer -> target skill: Machine Learning
  const mleGoal = await prisma.learningGoal.create({
    data: {
      id: 'goal_mle',
      name: 'Machine Learning Engineer',
      targetSkillId: machineLearning.id,
    },
  });

  const dsGoal = await prisma.learningGoal.create({
    data: {
      id: 'goal_ds',
      name: 'Data Science Specialist',
      targetSkillId: statistics.id,
    },
  });

  console.log('Created learning goals: "Machine Learning Engineer" & "Data Science Specialist"');

  // 5. Create Questions (at least 2 questions per skill)
  const questions = [
    // Python
    {
      id: 'q_py_1',
      skillId: python.id,
      text: 'What is the average time complexity of looking up a key in a standard Python dictionary?',
      difficulty: 1,
      correctAnswer: 'opt_1',
      options: [
        { id: 'opt_1', text: 'O(1) constant time' },
        { id: 'opt_2', text: 'O(n) linear time' },
        { id: 'opt_3', text: 'O(log n) logarithmic time' },
        { id: 'opt_4', text: 'O(n^2) quadratic time' },
      ],
      explanation: 'Python dictionaries are implemented with hash tables using open addressing, providing O(1) average lookup time.',
    },
    {
      id: 'q_py_2',
      skillId: python.id,
      text: 'What does the list comprehension `[x**2 for x in range(5) if x % 2 != 0]` evaluate to in Python?',
      difficulty: 2,
      correctAnswer: 'opt_1',
      options: [
        { id: 'opt_1', text: '[1, 9]' },
        { id: 'opt_2', text: '[0, 4, 16]' },
        { id: 'opt_3', text: '[1, 9, 25]' },
        { id: 'opt_4', text: '[1, 4, 9]' },
      ],
      explanation: 'range(5) outputs 0, 1, 2, 3, 4. The odd numbers are 1 and 3. Squaring them produces [1, 9].',
    },

    // Probability
    {
      id: 'q_prob_1',
      skillId: probability.id,
      text: 'If two events A and B are statistically independent, which equality must hold true?',
      difficulty: 2,
      correctAnswer: 'opt_1',
      options: [
        { id: 'opt_1', text: 'P(A and B) = P(A) * P(B)' },
        { id: 'opt_2', text: 'P(A or B) = P(A) + P(B)' },
        { id: 'opt_3', text: 'P(A | B) = 0' },
        { id: 'opt_4', text: 'P(A and B) = P(A) / P(B)' },
      ],
      explanation: 'By the mathematical definition of independence, joint probability factors into the product of marginals: P(A ∩ B) = P(A)P(B).',
    },
    {
      id: 'q_prob_2',
      skillId: probability.id,
      text: "How is posterior probability P(A | B) calculated according to Bayes' Theorem?",
      difficulty: 3,
      correctAnswer: 'opt_1',
      options: [
        { id: 'opt_1', text: '[P(B | A) * P(A)] / P(B)' },
        { id: 'opt_2', text: '[P(A | B) * P(B)] / P(A)' },
        { id: 'opt_3', text: 'P(A) * P(B) + P(B | A)' },
        { id: 'opt_4', text: 'P(B | A) / [P(A) * P(B)]' },
      ],
      explanation: "Bayes' formula states P(A | B) = [P(B | A) * P(A)] / P(B).",
    },

    // Statistics
    {
      id: 'q_stat_1',
      skillId: statistics.id,
      text: 'In null hypothesis significance testing, what is the precise interpretation of a p-value?',
      difficulty: 2,
      correctAnswer: 'opt_1',
      options: [
        { id: 'opt_1', text: 'The probability of observing sample data at least as extreme as observed, assuming H0 is true' },
        { id: 'opt_2', text: 'The probability that the null hypothesis is true' },
        { id: 'opt_3', text: 'The probability that the research hypothesis is false' },
        { id: 'opt_4', text: 'The exact percentage of measurement noise' },
      ],
      explanation: 'The p-value measures the probability of obtaining test results at least as extreme as the sample data under the assumption that the null hypothesis is true.',
    },
    {
      id: 'q_stat_2',
      skillId: statistics.id,
      text: 'What is the principal guarantee of the Central Limit Theorem (CLT)?',
      difficulty: 3,
      correctAnswer: 'opt_1',
      options: [
        { id: 'opt_1', text: 'The distribution of sample means approaches a normal distribution as sample size grows' },
        { id: 'opt_2', text: 'The underlying population values become normally distributed' },
        { id: 'opt_3', text: 'Sample variance drops to zero' },
        { id: 'opt_4', text: 'All outliers are removed automatically' },
      ],
      explanation: 'The CLT guarantees asymptotic normality for the sample mean distribution regardless of parent population shape given finite variance.',
    },

    // Linear Algebra
    {
      id: 'q_la_1',
      skillId: linearAlgebra.id,
      text: 'If the dot product of two non-zero vectors u and v is equal to 0, what geometric property holds?',
      difficulty: 2,
      correctAnswer: 'opt_1',
      options: [
        { id: 'opt_1', text: 'The vectors are orthogonal (perpendicular) to each other' },
        { id: 'opt_2', text: 'The vectors are collinear and identical in magnitude' },
        { id: 'opt_3', text: 'One vector is the matrix identity' },
        { id: 'opt_4', text: 'The angle between them is 0 degrees' },
      ],
      explanation: 'Because u · v = ||u|| ||v|| cos(θ), dot product = 0 implies cos(θ) = 0, so θ = 90° (orthogonal).',
    },
    {
      id: 'q_la_2',
      skillId: linearAlgebra.id,
      text: 'What characterizes an eigenvector v of matrix A associated with eigenvalue λ?',
      difficulty: 3,
      correctAnswer: 'opt_1',
      options: [
        { id: 'opt_1', text: 'A non-zero vector v such that A v = λ v (direction is preserved under transformation)' },
        { id: 'opt_2', text: 'A vector whose components sum to 1' },
        { id: 'opt_3', text: 'The transpose of matrix A' },
        { id: 'opt_4', text: 'A vector orthogonal to all coordinates' },
      ],
      explanation: 'Eigenvectors satisfy Av = λv; their span is invariant under the linear transformation A.',
    },

    // Machine Learning
    {
      id: 'q_ml_1',
      skillId: machineLearning.id,
      text: 'In the bias-variance tradeoff, what error pattern defines high variance (overfitting)?',
      difficulty: 2,
      correctAnswer: 'opt_1',
      options: [
        { id: 'opt_1', text: 'High training accuracy with poor validation/test generalization' },
        { id: 'opt_2', text: 'Low training accuracy and low test accuracy' },
        { id: 'opt_3', text: 'Zero gradients during backpropagation' },
        { id: 'opt_4', text: 'Excessive regularization penalty' },
      ],
      explanation: 'Overfitting occurs when high model capacity captures idiosyncratic training noise, resulting in low training error but high test variance.',
    },
    {
      id: 'q_ml_2',
      skillId: machineLearning.id,
      text: 'In Gradient Descent optimization, what does the learning rate parameter (α) control?',
      difficulty: 3,
      correctAnswer: 'opt_1',
      options: [
        { id: 'opt_1', text: 'The step size along the negative gradient direction during parameter updates' },
        { id: 'opt_2', text: 'The total number of neural layers' },
        { id: 'opt_3', text: 'The classification decision threshold' },
        { id: 'opt_4', text: 'The random seed for data shuffling' },
      ],
      explanation: 'The learning rate scales the magnitude of the parameter update: θ := θ - α ∇J(θ).',
    },
  ];

  for (const q of questions) {
    await prisma.question.create({
      data: {
        id: q.id,
        skillId: q.skillId,
        text: q.text,
        difficulty: q.difficulty,
        correctAnswer: q.correctAnswer,
        options: q.options,
        explanation: q.explanation,
      },
    });
  }

  console.log(`Created ${questions.length} multiple-choice questions`);

  // 6. Create Demo User
  const passwordHash = await bcrypt.hash('password123', 10);
  const demoUser = await prisma.user.create({
    data: {
      id: 'user_demo_learner',
      email: 'learner@learntrace.ai',
      passwordHash,
    },
  });

  // Assign user to Machine Learning Engineer goal
  await prisma.userGoal.create({
    data: {
      userId: demoUser.id,
      goalId: mleGoal.id,
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
