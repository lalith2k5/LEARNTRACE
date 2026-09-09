import { CognitiveState } from '../types';

export interface CognitiveStateDisplay {
  label: string;
  technical: string;
  badgeClass: string;
  textClass: string;
  description: string;
}

export const formatCognitiveState = (state?: CognitiveState | string): CognitiveStateDisplay => {
  switch (state) {
    case 'SOLID_MASTERY':
      return {
        label: 'Strong Understanding',
        technical: 'SOLID_MASTERY',
        badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        textClass: 'text-emerald-700',
        description: 'Accurate and fast recall with high self-reported confidence.',
      };
    case 'FRAGILE_KNOWLEDGE':
      return {
        label: 'Needs Reinforcement',
        technical: 'FRAGILE_KNOWLEDGE',
        badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
        textClass: 'text-amber-700',
        description: 'Correct answer but low self-reported confidence; concepts need reinforcement.',
      };
    case 'CONFIDENT_MISCONCEPTION':
      return {
        label: 'Confident but Needs Correction',
        technical: 'CONFIDENT_MISCONCEPTION',
        badgeClass: 'bg-rose-100 text-rose-900 border-rose-300',
        textClass: 'text-rose-700',
        description: 'High confidence on an incorrect choice; indicates a systematic conceptual misconception.',
      };
    case 'UNCERTAIN_MISTAKE':
      return {
        label: 'Needs More Practice',
        technical: 'UNCERTAIN_MISTAKE',
        badgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
        textClass: 'text-slate-700',
        description: 'Incorrect response with low confidence; foundational topic review suggested.',
      };
    default:
      return {
        label: state ? state.replace(/_/g, ' ') : 'Standard Assessment',
        technical: state || 'NORMAL_MASTERY',
        badgeClass: 'bg-slate-100 text-slate-800 border-slate-200',
        textClass: 'text-slate-700',
        description: 'Standard evaluation based on accuracy and response time.',
      };
  }
};
