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
          // Merge custom questions
          for (const [qId, q] of parsed.questions) {
            store.questions.set(qId, q);
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

  // 4. Curated Comprehensive Diagnostic Question Bank
  const questionsData: Question[] = [
    // Python Questions
    {
      id: 'q_py_1',
      skillId: 'skill_python',
      skillName: 'Python',
      skillsTested: ['skill_python'],
      difficulty: 1,
      questionType: 'MULTIPLE_CHOICE',
      text: 'What is the average time complexity of looking up a key in a standard Python dictionary?',
      options: [
        { id: 'opt_1', text: 'O(1) constant time' },
        { id: 'opt_2', text: 'O(n) linear time' },
        { id: 'opt_3', text: 'O(log n) logarithmic time' },
        { id: 'opt_4', text: 'O(n^2) quadratic time' },
      ],
      correctAnswer: 'opt_1',
      explanation: 'Python dictionaries are implemented using hash tables with open addressing, yielding O(1) average time complexity for key lookups.',
    },
    {
      id: 'q_py_2',
      skillId: 'skill_python',
      skillName: 'Python',
      skillsTested: ['skill_python'],
      difficulty: 2,
      questionType: 'MULTIPLE_CHOICE',
      text: 'What does the expression `[x**2 for x in range(5) if x % 2 != 0]` evaluate to in Python?',
      options: [
        { id: 'opt_1', text: '[1, 9]' },
        { id: 'opt_2', text: '[0, 4, 16]' },
        { id: 'opt_3', text: '[1, 9, 25]' },
        { id: 'opt_4', text: '[1, 4, 9]' },
      ],
      correctAnswer: 'opt_1',
      explanation: 'range(5) produces 0, 1, 2, 3, 4. The odd numbers are 1 and 3. Squaring them yields 1**2 = 1 and 3**2 = 9, resulting in [1, 9].',
    },
    {
      id: 'q_py_3',
      skillId: 'skill_python',
      skillName: 'Python',
      skillsTested: ['skill_python'],
      difficulty: 3,
      questionType: 'MULTIPLE_CHOICE',
      text: 'In NumPy and Python data science pipelines, what is "broadcasting"?',
      options: [
        { id: 'opt_1', text: 'How NumPy treats arrays with different shapes during arithmetic operations without explicit loop overhead' },
        { id: 'opt_2', text: 'Transmitting array data over socket networks to worker nodes' },
        { id: 'opt_3', text: 'Converting multi-dimensional arrays into flat single-dimensional arrays' },
        { id: 'opt_4', text: 'Automatic type conversion from integer to floating point values' },
      ],
      correctAnswer: 'opt_1',
      explanation: 'Broadcasting describes how NumPy executes arithmetic operations on arrays of differing shapes by virtually stretching trailing dimensions with size 1.',
    },
    {
      id: 'q_py_4',
      skillId: 'skill_python',
      skillName: 'Python',
      skillsTested: ['skill_python'],
      difficulty: 4,
      questionType: 'MULTIPLE_CHOICE',
      text: 'In Python, what is the key difference between `is` and `==` operators?',
      options: [
        { id: 'opt_1', text: '`is` checks memory identity (same object reference), whereas `==` checks value equality' },
        { id: 'opt_2', text: '`is` checks value equality, whereas `==` checks type compatibility' },
        { id: 'opt_3', text: '`is` is only used for numerical comparisons' },
        { id: 'opt_4', text: 'They are completely interchangeable syntactical aliases' },
      ],
      correctAnswer: 'opt_1',
      explanation: '`is` compares whether two variables point to the exact same memory address (id(a) == id(b)), whereas `==` invokes the __eq__ method to compare evaluated values.',
    },

    // Probability Foundations
    {
      id: 'q_prob_1',
      skillId: 'skill_prob',
      skillName: 'Probability',
      skillsTested: ['skill_prob'],
      difficulty: 2,
      questionType: 'MULTIPLE_CHOICE',
      text: 'If events A and B are independent, which of the following mathematical statements is strictly true?',
      options: [
        { id: 'opt_1', text: 'P(A and B) = P(A) * P(B)' },
        { id: 'opt_2', text: 'P(A or B) = P(A) + P(B)' },
        { id: 'opt_3', text: 'P(A | B) = 0' },
        { id: 'opt_4', text: 'P(A and B) = P(A) / P(B)' },
      ],
      correctAnswer: 'opt_1',
      explanation: 'By the mathematical definition of statistical independence, the joint probability P(A and B) equals the product of their individual probabilities: P(A) * P(B).',
    },
    {
      id: 'q_prob_2',
      skillId: 'skill_prob',
      skillName: 'Probability',
      skillsTested: ['skill_prob'],
      difficulty: 3,
      questionType: 'MULTIPLE_CHOICE',
      text: 'If the probability of rolling a 6 on a fair die is 1/6, what is the probability of rolling at least one 6 in two independent rolls?',
      options: [
        { id: 'opt_1', text: '11/36 (approx 30.6%)' },
        { id: 'opt_2', text: '2/6 = 1/3 (approx 33.3%)' },
        { id: 'opt_3', text: '1/36 (approx 2.8%)' },
        { id: 'opt_4', text: '25/36 (approx 69.4%)' },
      ],
      correctAnswer: 'opt_1',
      explanation: 'Use the complement rule: P(at least one 6) = 1 - P(no 6s in both rolls) = 1 - (5/6 * 5/6) = 1 - 25/36 = 11/36.',
    },
    {
      id: 'q_prob_3',
      skillId: 'skill_prob',
      skillName: 'Probability',
      skillsTested: ['skill_prob'],
      difficulty: 4,
      questionType: 'MULTIPLE_CHOICE',
      text: 'For any two arbitrary events A and B, which general formula expresses P(A ∪ B)?',
      options: [
        { id: 'opt_1', text: 'P(A) + P(B) - P(A ∩ B)' },
        { id: 'opt_2', text: 'P(A) + P(B)' },
        { id: 'opt_3', text: 'P(A) * P(B) + P(A | B)' },
        { id: 'opt_4', text: 'P(A ∩ B) / P(B)' },
      ],
      correctAnswer: 'opt_1',
      explanation: 'By the Principle of Inclusion-Exclusion, P(A ∪ B) = P(A) + P(B) - P(A ∩ B) to avoid double-counting the overlap.',
    },

    // Conditional Probability (Multi-skill tagged: Probability + Conditional Probability)
    {
      id: 'q_cond_1',
      skillId: 'skill_cond_prob',
      skillName: 'Conditional Probability',
      skillsTested: ['skill_prob', 'skill_cond_prob'],
      difficulty: 2,
      questionType: 'MULTIPLE_CHOICE',
      text: 'According to Bayes\' Theorem, how is the posterior probability P(A | B) calculated from prior, likelihood, and evidence?',
      options: [
        { id: 'opt_1', text: '[P(B | A) * P(A)] / P(B)' },
        { id: 'opt_2', text: '[P(A | B) * P(B)] / P(A)' },
        { id: 'opt_3', text: 'P(A) * P(B) + P(B | A)' },
        { id: 'opt_4', text: 'P(B | A) / [P(A) * P(B)]' },
      ],
      correctAnswer: 'opt_1',
      explanation: "Bayes' Theorem relates posterior probability to likelihood, prior, and marginal evidence: P(A | B) = [P(B | A) * P(A)] / P(B).",
    },
    {
      id: 'q_cond_2',
      skillId: 'skill_cond_prob',
      skillName: 'Conditional Probability',
      skillsTested: ['skill_prob', 'skill_cond_prob'],
      difficulty: 3,
      questionType: 'MULTIPLE_CHOICE',
      text: 'If events A and B are mutually exclusive (disjoint) with P(A) > 0 and P(B) > 0, what is P(A | B)?',
      options: [
        { id: 'opt_1', text: '0' },
        { id: 'opt_2', text: 'P(A)' },
        { id: 'opt_3', text: 'P(A) * P(B)' },
        { id: 'opt_4', text: '1.0' },
      ],
      correctAnswer: 'opt_1',
      explanation: 'Because mutually exclusive events cannot occur simultaneously, P(A and B) = 0. Therefore, P(A | B) = P(A and B) / P(B) = 0 / P(B) = 0.',
    },
    {
      id: 'q_cond_3',
      skillId: 'skill_cond_prob',
      skillName: 'Conditional Probability',
      skillsTested: ['skill_prob', 'skill_cond_prob'],
      difficulty: 4,
      questionType: 'MULTIPLE_CHOICE',
      text: 'A disease has a 1% prevalence. A diagnostic test has 95% sensitivity (true positive) and 90% specificity (true negative). If a patient tests positive, what is the approximate posterior probability P(Disease | Positive)?',
      options: [
        { id: 'opt_1', text: '~8.8% (due to the low base rate prevalence)' },
        { id: 'opt_2', text: '95.0%' },
        { id: 'opt_3', text: '85.5%' },
        { id: 'opt_4', text: '50.0%' },
      ],
      correctAnswer: 'opt_1',
      explanation: "Applying Bayes' Theorem: P(Pos) = (0.01 * 0.95) + (0.99 * 0.10) = 0.0095 + 0.099 = 0.1085. P(D | Pos) = 0.0095 / 0.1085 ≈ 8.76%. The low base rate heavily influences the posterior.",
    },

    // Probability Distributions
    {
      id: 'q_dist_1',
      skillId: 'skill_prob_dist',
      skillName: 'Probability Distributions',
      skillsTested: ['skill_prob_dist', 'skill_cond_prob'],
      difficulty: 2,
      questionType: 'MULTIPLE_CHOICE',
      text: 'For a continuous random variable with probability density function (PDF) f(x), what is the probability of the variable taking a single exact point value P(X = c)?',
      options: [
        { id: 'opt_1', text: '0 (probability of an exact point is zero for continuous distributions)' },
        { id: 'opt_2', text: 'f(c)' },
        { id: 'opt_3', text: '1.0' },
        { id: 'opt_4', text: 'Undefined without variance' },
      ],
      correctAnswer: 'opt_1',
      explanation: 'In continuous distributions, probabilities correspond to the area under the PDF curve across an interval. The integral over a single zero-width point is strictly 0.',
    },
    {
      id: 'q_dist_2',
      skillId: 'skill_prob_dist',
      skillName: 'Probability Distributions',
      skillsTested: ['skill_prob_dist'],
      difficulty: 3,
      questionType: 'MULTIPLE_CHOICE',
      text: 'Under a Standard Normal Distribution (mean μ = 0, std σ = 1), approximately what percentage of data falls within ±1 standard deviation?',
      options: [
        { id: 'opt_1', text: '68.2%' },
        { id: 'opt_2', text: '95.4%' },
        { id: 'opt_3', text: '50.0%' },
        { id: 'opt_4', text: '99.7%' },
      ],
      correctAnswer: 'opt_1',
      explanation: 'By the Empirical Rule (68-95-99.7 rule) for Gaussian distributions, approximately 68.2% of observations fall within ±1σ of the mean.',
    },
    {
      id: 'q_dist_3',
      skillId: 'skill_prob_dist',
      skillName: 'Probability Distributions',
      skillsTested: ['skill_prob_dist', 'skill_prob'],
      difficulty: 4,
      questionType: 'MULTIPLE_CHOICE',
      text: 'Which distribution models the number of discrete independent events occurring within a fixed interval of time or space given a constant average rate λ?',
      options: [
        { id: 'opt_1', text: 'Poisson Distribution' },
        { id: 'opt_2', text: 'Uniform Distribution' },
        { id: 'opt_3', text: 'Exponential Distribution (models continuous inter-arrival time)' },
        { id: 'opt_4', text: 'Bernoulli Distribution' },
      ],
      correctAnswer: 'opt_1',
      explanation: 'The Poisson distribution models discrete count occurrences in a fixed interval with parameter λ, where P(X=k) = (λ^k * e^-λ) / k!.',
    },

    // Statistics Questions
    {
      id: 'q_stat_1',
      skillId: 'skill_stats',
      skillName: 'Statistics',
      skillsTested: ['skill_stats'],
      difficulty: 2,
      questionType: 'MULTIPLE_CHOICE',
      text: 'What is the precise definition of a p-value in classical null hypothesis significance testing?',
      options: [
        { id: 'opt_1', text: 'The probability of observing sample results at least as extreme as observed, assuming the null hypothesis is true' },
        { id: 'opt_2', text: 'The probability that the null hypothesis is true' },
        { id: 'opt_3', text: 'The probability that the alternative hypothesis is false' },
        { id: 'opt_4', text: 'The percentage error of the estimation apparatus' },
      ],
      correctAnswer: 'opt_1',
      explanation: 'The p-value is the probability of obtaining test results at least as extreme as the observed sample data, assuming that the null hypothesis is strictly true.',
    },
    {
      id: 'q_stat_2',
      skillId: 'skill_stats',
      skillName: 'Statistics',
      skillsTested: ['skill_stats', 'skill_prob_dist'],
      difficulty: 3,
      questionType: 'MULTIPLE_CHOICE',
      text: 'What does the Central Limit Theorem (CLT) guarantee regarding the sampling distribution of the sample mean?',
      options: [
        { id: 'opt_1', text: 'As sample size increases, the distribution of sample means approaches a normal distribution regardless of population distribution shape' },
        { id: 'opt_2', text: 'All raw population variables become normally distributed as N increases' },
        { id: 'opt_3', text: 'Sample variance approaches zero when N > 30' },
        { id: 'opt_4', text: 'The sample median always equals the population mode' },
      ],
      correctAnswer: 'opt_1',
      explanation: 'The CLT guarantees that the sampling distribution of the mean approaches Gaussian normality as sample size increases, provided the underlying population has finite variance.',
    },
    {
      id: 'q_stat_3',
      skillId: 'skill_stats',
      skillName: 'Statistics',
      skillsTested: ['skill_stats'],
      difficulty: 4,
      questionType: 'MULTIPLE_CHOICE',
      text: 'What is a Type I error (False Positive) in hypothesis testing?',
      options: [
        { id: 'opt_1', text: 'Rejecting the null hypothesis when it is actually true (α level)' },
        { id: 'opt_2', text: 'Failing to reject the null hypothesis when it is false (β level)' },
        { id: 'opt_3', text: 'Incorrectly computing the sample standard deviation' },
        { id: 'opt_4', text: 'Selecting a non-random sample' },
      ],
      correctAnswer: 'opt_1',
      explanation: 'A Type I error occurs when researchers reject a true null hypothesis, with the maximum acceptable probability conventionally bounded by α (e.g. 0.05).',
    },

    // Linear Algebra Questions
    {
      id: 'q_la_1',
      skillId: 'skill_linalg',
      skillName: 'Linear Algebra',
      skillsTested: ['skill_linalg'],
      difficulty: 2,
      questionType: 'MULTIPLE_CHOICE',
      text: 'If the dot product of two non-zero vectors u and v is equal to 0, what geometric relationship does this indicate?',
      options: [
        { id: 'opt_1', text: 'The two vectors are orthogonal (perpendicular) to each other' },
        { id: 'opt_2', text: 'The two vectors are parallel and pointing in the same direction' },
        { id: 'opt_3', text: 'One of the vectors must be the identity vector' },
        { id: 'opt_4', text: 'The angle between them is 0 degrees' },
      ],
      correctAnswer: 'opt_1',
      explanation: 'Because u · v = ||u|| ||v|| cos(θ), a dot product of zero for non-zero vectors implies cos(θ) = 0, meaning θ = 90° (the vectors are orthogonal).',
    },
    {
      id: 'q_la_2',
      skillId: 'skill_linalg',
      skillName: 'Linear Algebra',
      skillsTested: ['skill_linalg'],
      difficulty: 3,
      questionType: 'MULTIPLE_CHOICE',
      text: 'What is an eigenvector of a square matrix A corresponding to eigenvalue λ?',
      options: [
        { id: 'opt_1', text: 'A non-zero vector v such that A v = λ v (its direction is preserved under transformation)' },
        { id: 'opt_2', text: 'A vector whose elements always sum to 1' },
        { id: 'opt_3', text: 'The inverse column of matrix A' },
        { id: 'opt_4', text: 'Any vector that maps matrix A to the zero matrix' },
      ],
      correctAnswer: 'opt_1',
      explanation: 'An eigenvector v satisfies A v = λ v. The linear transformation A scales vector v by factor λ without changing its span or directional line.',
    },
    {
      id: 'q_la_3',
      skillId: 'skill_linalg',
      skillName: 'Linear Algebra',
      skillsTested: ['skill_linalg'],
      difficulty: 4,
      questionType: 'MULTIPLE_CHOICE',
      text: 'What does the rank of a matrix represent?',
      options: [
        { id: 'opt_1', text: 'The maximum number of linearly independent column or row vectors in the matrix' },
        { id: 'opt_2', text: 'The sum of all diagonal elements (Trace)' },
        { id: 'opt_3', text: 'The determinant of the sub-matrices' },
        { id: 'opt_4', text: 'The total number of nonzero entries' },
      ],
      correctAnswer: 'opt_1',
      explanation: 'The rank of a matrix is the dimension of the vector space spanned by its columns (or rows), equal to the number of linearly independent vectors.',
    },

    // Model Evaluation Questions
    {
      id: 'q_eval_1',
      skillId: 'skill_model_eval',
      skillName: 'Model Evaluation',
      skillsTested: ['skill_model_eval', 'skill_stats'],
      difficulty: 2,
      questionType: 'MULTIPLE_CHOICE',
      text: 'In a medical diagnostic classifier where missing a positive disease case is dangerous, which metric should be prioritized?',
      options: [
        { id: 'opt_1', text: 'Recall (Sensitivity) — minimizing False Negatives' },
        { id: 'opt_2', text: 'Specificity — minimizing False Positives only' },
        { id: 'opt_3', text: 'Raw overall Accuracy on imbalanced test set' },
        { id: 'opt_4', text: 'Mean Squared Error' },
      ],
      correctAnswer: 'opt_1',
      explanation: 'Recall = TP / (TP + FN). When missing a positive condition has severe consequences, maximizing Recall minimizes False Negatives.',
    },
    {
      id: 'q_eval_2',
      skillId: 'skill_model_eval',
      skillName: 'Model Evaluation',
      skillsTested: ['skill_model_eval'],
      difficulty: 3,
      questionType: 'MULTIPLE_CHOICE',
      text: 'What does the Area Under the ROC Curve (ROC-AUC) measure?',
      options: [
        { id: 'opt_1', text: 'The probability that the classifier ranks a randomly chosen positive instance higher than a randomly chosen negative instance' },
        { id: 'opt_2', text: 'The exact percentage of training records that fit within 1 standard deviation' },
        { id: 'opt_3', text: 'The optimal learning rate threshold for gradient descent' },
        { id: 'opt_4', text: 'The cross-entropy loss between training and test sets' },
      ],
      correctAnswer: 'opt_1',
      explanation: 'ROC-AUC evaluates ranking quality across all classification thresholds, corresponding to the probability of ranking a random positive higher than a random negative.',
    },
    {
      id: 'q_eval_3',
      skillId: 'skill_model_eval',
      skillName: 'Model Evaluation',
      skillsTested: ['skill_model_eval', 'skill_stats'],
      difficulty: 4,
      questionType: 'MULTIPLE_CHOICE',
      text: 'What is the harmonic mean of Precision and Recall known as?',
      options: [
        { id: 'opt_1', text: 'F1 Score' },
        { id: 'opt_2', text: 'Cohen\'s Kappa' },
        { id: 'opt_3', text: 'Matthews Correlation Coefficient' },
        { id: 'opt_4', text: 'Log-Loss' },
      ],
      correctAnswer: 'opt_1',
      explanation: 'The F1-score is 2 * (Precision * Recall) / (Precision + Recall), giving a balanced measure especially when class distributions are uneven.',
    },

    // Machine Learning Questions
    {
      id: 'q_ml_1',
      skillId: 'skill_ml',
      skillName: 'Machine Learning',
      skillsTested: ['skill_ml'],
      difficulty: 2,
      questionType: 'MULTIPLE_CHOICE',
      text: 'In the bias-variance tradeoff, what problem is characterized by high training accuracy but poor generalization to test data?',
      options: [
        { id: 'opt_1', text: 'Overfitting (high variance)' },
        { id: 'opt_2', text: 'Underfitting (high bias)' },
        { id: 'opt_3', text: 'High entropy loss' },
        { id: 'opt_4', text: 'Vanishing gradient' },
      ],
      correctAnswer: 'opt_1',
      explanation: 'Overfitting occurs when a model fits noise in the training set rather than the underlying generative distribution, leading to low bias but high variance on unseen data.',
    },
    {
      id: 'q_ml_2',
      skillId: 'skill_ml',
      skillName: 'Machine Learning',
      skillsTested: ['skill_ml', 'skill_linalg'],
      difficulty: 3,
      questionType: 'MULTIPLE_CHOICE',
      text: 'In Gradient Descent optimization, what role does the learning rate (alpha) parameter play?',
      options: [
        { id: 'opt_1', text: 'It controls the step size taken along the negative gradient vector at each iteration' },
        { id: 'opt_2', text: 'It sets the number of hidden layers in the network architecture' },
        { id: 'opt_3', text: 'It calculates the exact precision and recall of the validation set' },
        { id: 'opt_4', text: 'It determines the L1 regularization penalty' },
      ],
      correctAnswer: 'opt_1',
      explanation: 'The learning rate hyperparameter scales the gradient update vector θ = θ - α * ∇J(θ), controlling how aggressively weights shift in parameter space toward the minimum of the loss function.',
    },
    {
      id: 'q_ml_3',
      skillId: 'skill_ml',
      skillName: 'Machine Learning',
      skillsTested: ['skill_ml', 'skill_linalg'],
      difficulty: 4,
      questionType: 'MULTIPLE_CHOICE',
      text: 'How does L2 Regularization (Ridge) prevent overfitting in linear models?',
      options: [
        { id: 'opt_1', text: 'By adding a penalty proportional to the sum of squared weights (||w||^2) to the loss function, shrinking weight magnitudes' },
        { id: 'opt_2', text: 'By setting irrelevant feature weights strictly to zero' },
        { id: 'opt_3', text: 'By removing random training samples during each batch' },
        { id: 'opt_4', text: 'By inverting the gradient direction' },
      ],
      correctAnswer: 'opt_1',
      explanation: 'L2 regularization adds λ * Σ w_i^2 to the loss function, penalizing large weights and smoothing decision boundaries.',
    },
  ];

  for (const q of questionsData) {
    store.questions.set(q.id, q);
  }

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
