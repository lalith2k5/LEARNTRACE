import { store } from '../store.js';
import { Recommendation, Skill } from '../../src/types.js';
import { getFullPrerequisiteChain, getDirectPrerequisites, calculateDownstreamCountInChain } from './graphService.js';
import { getUserMastery, getInterpretationFromScore } from './masteryService.js';

export interface CandidateAnalysis {
  skill: Skill;
  mastery: number;
  downstreamCount: number;
  isReady: boolean;
  priorityScore: number;
  unmetPrerequisites: string[];
}

export function getPrioritizedRecommendation(userId: string, goalId?: string): {
  recommendation: Recommendation | null;
  analysis: CandidateAnalysis[];
  message?: string;
} {
  // Determine user goal
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

  if (!targetGoal) {
    return {
      recommendation: null,
      analysis: [],
      message: 'No learning goal found.',
    };
  }

  const targetSkillId = targetGoal.targetSkillId;
  const goalName = targetGoal.name;

  // Step 1 — Find Relevant Skills (Target skill + full recursive ancestor chain)
  const relevantSkills = getFullPrerequisiteChain(targetSkillId, true);
  const relevantSkillIds = new Set(relevantSkills.map((s) => s.id));

  // Step 2, 3, 4, 5, 6 — Analyze each skill
  const candidateAnalyses: CandidateAnalysis[] = [];

  for (const skill of relevantSkills) {
    const mastery = getUserMastery(userId, skill.id);
    const downstreamCount = calculateDownstreamCountInChain(skill.id, relevantSkillIds);
    const directPrereqs = getDirectPrerequisites(skill.id);
    const unmetPrerequisites: string[] = [];

    for (const prereq of directPrereqs) {
      const prereqMastery = getUserMastery(userId, prereq.id);
      if (prereqMastery < 0.6) {
        unmetPrerequisites.push(prereq.name);
      }
    }

    const isReady = unmetPrerequisites.length === 0;
    const priorityScore = (1.0 - mastery) * (1 + downstreamCount);

    candidateAnalyses.push({
      skill,
      mastery,
      downstreamCount,
      isReady,
      priorityScore: Math.round(priorityScore * 1000) / 1000,
      unmetPrerequisites,
    });
  }

  // Step 5: Candidate Filter (mastery < 0.60 AND ready === true)
  const eligibleCandidates = candidateAnalyses.filter(
    (c) => c.mastery < 0.6 && c.isReady
  );

  // Step 7: Sort candidates: highest priorityScore first
  eligibleCandidates.sort((a, b) => b.priorityScore - a.priorityScore);

  if (eligibleCandidates.length === 0) {
    const targetMastery = getUserMastery(userId, targetSkillId);
    if (targetMastery >= 0.6) {
      return {
        recommendation: null,
        analysis: candidateAnalyses,
        message: `Congratulations! You have achieved mastery across all foundational and target skills for the "${goalName}" goal.`,
      };
    }

    const blockedWeakSkills = candidateAnalyses.filter((c) => c.mastery < 0.6 && !c.isReady);
    if (blockedWeakSkills.length > 0) {
      return {
        recommendation: null,
        analysis: candidateAnalyses,
        message: `Skills like ${blockedWeakSkills.map((s) => s.skill.name).join(', ')} require strengthening earlier prerequisites first.`,
      };
    }

    return {
      recommendation: null,
      analysis: candidateAnalyses,
      message: 'You have no currently eligible weak skill to prioritize for this goal.',
    };
  }

  const topCandidate = eligibleCandidates[0];

  // Step 8: Generate Human-Readable Pedagogical Reason
  const masteryPercentage = Math.round(topCandidate.mastery * 100);
  const interpretation = getInterpretationFromScore(topCandidate.mastery);
  let reasonText = '';

  if (topCandidate.downstreamCount > 0) {
    reasonText = `Your current mastery in ${topCandidate.skill.name} is ${masteryPercentage}% (${interpretation}). Improving it is your highest-leverage foundational step because all its prerequisites are satisfied and it unblocks ${topCandidate.downstreamCount} downstream skill${topCandidate.downstreamCount > 1 ? 's' : ''} on your path toward ${goalName}.`;
  } else {
    reasonText = `Your current mastery in ${topCandidate.skill.name} is ${masteryPercentage}% (${interpretation}). As the target milestone for ${goalName}, focusing here delivers direct progress now that all supporting prerequisites are mastered.`;
  }

  const recommendationRecord: Recommendation = {
    id: `rec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    userId,
    skillId: topCandidate.skill.id,
    skillName: topCandidate.skill.name,
    priorityScore: topCandidate.priorityScore,
    reasonText,
    createdAt: new Date().toISOString(),
    masteryScore: topCandidate.mastery,
    interpretation,
    downstreamCount: topCandidate.downstreamCount,
    goalName,
    isReady: true,
  };

  store.recommendations.push(recommendationRecord);

  return {
    recommendation: recommendationRecord,
    analysis: candidateAnalyses,
  };
}
