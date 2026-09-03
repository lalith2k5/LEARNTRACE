import React from 'react';
import { LearningPathStep } from '../types';
import { LearningPathRecommendations } from './LearningPathRecommendations';

interface LearningPathViewProps {
  pathSteps: LearningPathStep[];
  goalName?: string;
  onSelectSkill: (skillId: string) => void;
  activeGapSkillId?: string | null;
  onCloseGapModal?: () => void;
}

export const LearningPathView: React.FC<LearningPathViewProps> = (props) => {
  return <LearningPathRecommendations {...props} />;
};

export { LearningPathRecommendations };
