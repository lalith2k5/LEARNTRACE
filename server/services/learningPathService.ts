import { store } from '../store.js';
import { LearningPathStep } from '../../src/types.js';
import { getFullPrerequisiteChain, getDirectPrerequisites } from './graphService.js';
import { getUserMastery, getInterpretationFromScore } from './masteryService.js';

export function generateLearningPath(userId: string, goalId?: string): LearningPathStep[] {
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
    return [];
  }

  const relevantSkills = getFullPrerequisiteChain(targetGoal.targetSkillId, true);
  const placedSkillIds = new Set<string>();
  const learningPath: LearningPathStep[] = [];

  const masteredSkills = new Set<string>();
  for (const skill of relevantSkills) {
    const mastery = getUserMastery(userId, skill.id);
    if (mastery >= 0.6) {
      masteredSkills.add(skill.id);
    }
  }

  const remainingWeakSkills = new Set(
    relevantSkills
      .filter((s) => !masteredSkills.has(s.id))
      .map((s) => s.id)
  );

  let currentOrder = 1;
  const maxIterations = relevantSkills.length * 2;
  let iterations = 0;

  while (remainingWeakSkills.size > 0 && iterations < maxIterations) {
    iterations++;

    const readyCandidates: { skillId: string; mastery: number }[] = [];

    for (const skillId of remainingWeakSkills) {
      const directPrereqs = getDirectPrerequisites(skillId);
      
      const allPrereqsSatisfied = directPrereqs.every(
        (p) => masteredSkills.has(p.id) || placedSkillIds.has(p.id)
      );

      if (allPrereqsSatisfied) {
        const mastery = getUserMastery(userId, skillId);
        readyCandidates.push({ skillId, mastery });
      }
    }

    if (readyCandidates.length === 0) {
      const fallbackId = Array.from(remainingWeakSkills)[0];
      readyCandidates.push({ skillId: fallbackId, mastery: getUserMastery(userId, fallbackId) });
    }

    // Schedule lowest current mastery first among ready candidates
    readyCandidates.sort((a, b) => a.mastery - b.mastery);

    const chosen = readyCandidates[0];
    const skillObj = store.skills.get(chosen.skillId)!;
    const directPrereqs = getDirectPrerequisites(chosen.skillId).map((p) => p.name);

    placedSkillIds.add(chosen.skillId);
    remainingWeakSkills.delete(chosen.skillId);

    learningPath.push({
      skillId: chosen.skillId,
      skillName: skillObj.name,
      domain: skillObj.domain,
      masteryScore: chosen.mastery,
      interpretation: getInterpretationFromScore(chosen.mastery),
      order: currentOrder++,
      status: 'ready_to_learn',
      prerequisites: directPrereqs,
    });
  }

  return learningPath;
}
