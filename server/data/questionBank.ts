import { Question, CognitiveCategory } from '../../src/types.js';

export interface SeedQuestionDefinition {
  id: string;
  skillId: string;
  skillName: string;
  skillsTested: string[];
  difficulty: number; // 1 (Intro/Recall), 2-3 (Application), 4-5 (Synthesis/Edge Case)
  cognitiveCategory?: CognitiveCategory;
  text: string;
  options: Array<{ id: string; text: string }>;
  correctAnswer: string;
  distractorRationales?: Record<string, string>;
  explanation: string;
}

import { PYTHON_QUESTIONS } from './questions/python.js';
import { PROBABILITY_QUESTIONS } from './questions/probability.js';
import { CONDITIONAL_PROBABILITY_QUESTIONS } from './questions/conditionalProbability.js';
import { PROBABILITY_DISTRIBUTIONS_QUESTIONS } from './questions/probabilityDistributions.js';
import { STATISTICS_QUESTIONS } from './questions/statistics.js';
import { LINEAR_ALGEBRA_QUESTIONS } from './questions/linearAlgebra.js';
import { MODEL_EVALUATION_QUESTIONS } from './questions/modelEvaluation.js';
import { MACHINE_LEARNING_QUESTIONS } from './questions/machineLearning.js';

export {
  PYTHON_QUESTIONS,
  PROBABILITY_QUESTIONS,
  CONDITIONAL_PROBABILITY_QUESTIONS,
  PROBABILITY_DISTRIBUTIONS_QUESTIONS,
  STATISTICS_QUESTIONS,
  LINEAR_ALGEBRA_QUESTIONS,
  MODEL_EVALUATION_QUESTIONS,
  MACHINE_LEARNING_QUESTIONS,
};

/**
 * LearnTrace Master Question Repository
 * Standardized assessment items structured across Bloom's Taxonomy tiers,
 * multi-skill prerequisite testing, code snippets, and diagnostic distractors.
 * Exactly 320 questions: 40 questions across 5 difficulty levels for all 8 curriculum skills.
 */
export const COMPREHENSIVE_QUESTION_BANK: SeedQuestionDefinition[] = [
  ...PYTHON_QUESTIONS,
  ...PROBABILITY_QUESTIONS,
  ...CONDITIONAL_PROBABILITY_QUESTIONS,
  ...PROBABILITY_DISTRIBUTIONS_QUESTIONS,
  ...STATISTICS_QUESTIONS,
  ...LINEAR_ALGEBRA_QUESTIONS,
  ...MODEL_EVALUATION_QUESTIONS,
  ...MACHINE_LEARNING_QUESTIONS,
];
