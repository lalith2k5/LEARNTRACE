export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface Skill {
  id: string;
  name: string;
  domain: string;
  description: string;
}

export interface SkillPrerequisite {
  skillId: string;
  prerequisiteSkillId: string;
}

export interface LearningGoal {
  id: string;
  name: string;
  targetSkillId: string;
  targetSkill?: Skill;
  description?: string;
}

export interface UserGoal {
  userId: string;
  goalId: string;
  selectedAt: string;
  goal?: LearningGoal;
}

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  skillId: string;
  skillName?: string;
  skillsTested?: string[]; // Multi-skill tagging support as per proposal Section 7
  text: string;
  difficulty: number; // 1 to 5
  options: QuestionOption[];
  questionType: 'MULTIPLE_CHOICE';
  explanation?: string;
  correctAnswer?: string; // Hidden from normal client quiz requests
}

export interface QuestionSkill {
  questionId: string;
  skillId: string;
}

export type CognitiveState = 
  | 'CONFIDENT_MISCONCEPTION' // Incorrect with high confidence (4 or 5)
  | 'UNCERTAIN_MISTAKE'       // Incorrect with low/medium confidence (1 to 3)
  | 'FRAGILE_KNOWLEDGE'       // Correct with low confidence (1 or 2)
  | 'SOLID_MASTERY'           // Correct with high confidence (4 or 5) + fast time
  | 'NORMAL_MASTERY';         // Standard correct attempt

export interface Attempt {
  id: string;
  userId: string;
  questionId: string;
  questionText?: string;
  skillId: string;
  skillName?: string;
  skillsTested?: string[];
  selectedAnswer: string;
  correct: boolean;
  timeTakenSeconds: number;
  confidence: number; // 1 to 5
  attemptNumber: number;
  cognitiveState?: CognitiveState;
  createdAt: string;
}

export type MasteryInterpretation = 'Strong' | 'Good foundation' | 'Moderate' | 'Developing' | 'Weak';

export interface SkillMastery {
  userId: string;
  skillId: string;
  skillName?: string;
  domain?: string;
  masteryScore: number; // 0.0 to 1.0
  interpretation: MasteryInterpretation;
  evidenceCount: number;
  lastUpdated: string;
  bktEstimate?: number; // Bayesian Knowledge Tracing estimate for research comparison
}

export interface Recommendation {
  id: string;
  userId: string;
  skillId: string;
  skillName?: string;
  priorityScore: number;
  reasonText: string;
  createdAt: string;
  // Metadata for explainability
  masteryScore?: number;
  interpretation?: MasteryInterpretation;
  downstreamCount?: number;
  goalName?: string;
  isReady?: boolean;
}

export interface LearningPathStep {
  skillId: string;
  skillName: string;
  domain: string;
  masteryScore: number;
  interpretation?: MasteryInterpretation;
  order: number;
  status: 'mastered' | 'ready_to_learn' | 'locked';
  prerequisites: string[];
}

export interface SkillGap {
  skillId: string;
  skillName: string;
  domain: string;
  masteryScore: number;
  interpretation?: MasteryInterpretation;
  isReady: boolean;
  prerequisiteCount: number;
  downstreamCount: number;
  unmetPrerequisites?: string[];
}

export interface GraphNodeData {
  id: string;
  label: string;
  domain: string;
  description: string;
  mastery: number;
  interpretation?: MasteryInterpretation;
  isTarget?: boolean;
  isReady?: boolean;
  isRecommended?: boolean;
  prerequisiteCount?: number;
  downstreamCount?: number;
}

export interface GraphEdgeData {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface AiExplainResponse {
  source: 'ollama' | 'gemini' | 'fallback';
  available: boolean;
  explanation: string;
  correctAnswer?: string;
  keyConcept?: string;
  cognitiveDiagnosis?: string;
}

export interface OpenEndedEvaluationRequest {
  skillId: string;
  prompt: string;
  studentResponse: string;
  selfConfidence?: number;
}

export interface OpenEndedEvaluationResponse {
  score: number; // 0.0 to 1.0
  grade: 'EXEMPLARY' | 'PROFICIENT' | 'DEVELOPING' | 'INCORRECT';
  feedback: string;
  conceptsIdentified: string[];
  conceptsMissed: string[];
  misconceptionsDetected: string[];
  cognitiveState: CognitiveState;
  suggestedAction: string;
  attempt?: Attempt;
  updatedMastery?: SkillMastery;
}

export interface BktParameters {
  pL0: number;      // Initial mastery probability
  pTransit: number;  // Transition probability from unlearned to learned
  pSlip: number;     // Probability of slipping (incorrect despite knowing)
  pGuess: number;    // Probability of guessing (correct despite not knowing)
}

export interface TraceSimulationPoint {
  step: number;
  isCorrect: boolean;
  confidence?: number;
  label?: string;
  learnTraceScore: number;
  bktScore: number;
  dktScore: number;
}

export interface ModelComparisonMetrics {
  learnTrace: { name: string; type: string; sensitivity: string; interpretability: string; computationalCost: string };
  bkt: { name: string; type: string; sensitivity: string; interpretability: string; computationalCost: string; currentEstimate: number };
  dkt: { name: string; type: string; sensitivity: string; interpretability: string; computationalCost: string; currentEstimate: number };
}

export function getMasteryInterpretation(score: number): {
  label: MasteryInterpretation;
  color: string;
  bgColor: string;
  borderColor: string;
} {
  if (score >= 0.8) {
    return {
      label: 'Strong',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
    };
  }
  if (score >= 0.7) {
    return {
      label: 'Good foundation',
      color: 'text-teal-400',
      bgColor: 'bg-teal-500/10',
      borderColor: 'border-teal-500/30',
    };
  }
  if (score >= 0.6) {
    return {
      label: 'Moderate',
      color: 'text-sky-400',
      bgColor: 'bg-sky-500/10',
      borderColor: 'border-sky-500/30',
    };
  }
  if (score >= 0.5) {
    return {
      label: 'Developing',
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
    };
  }
  return {
    label: 'Weak',
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/30',
  };
}
