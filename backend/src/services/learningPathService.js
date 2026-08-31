const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { getFullPrerequisiteChain, getDirectPrerequisites } = require('./graphService');

/**
 * ============================================================================
 * LEARNING PATH SERVICE
 * ============================================================================
 * 
 * ALGORITHM:
 * 1. Get full relevant skill set for the goal.
 * 2. Identify skills where mastery < 0.6 and direct prerequisites are either:
 *    - mastered >= 0.6
 *    - OR already placed earlier in the learning path.
 * 3. Among ready weak candidates, choose lowest current mastery first.
 * 4. Add to path, mark placed, and iterate until done.
 * ============================================================================
 */

async function generateLearningPath(userId, goalId) {
  let targetGoal = null;
  if (goalId) {
    targetGoal = await prisma.learningGoal.findUnique({ where: { id: goalId } });
  }

  if (!targetGoal) {
    const userGoal = await prisma.userGoal.findFirst({
      where: { userId },
      include: { goal: true }
    });
    if (userGoal && userGoal.goal) {
      targetGoal = userGoal.goal;
    }
  }

  if (!targetGoal) {
    targetGoal = await prisma.learningGoal.findFirst();
  }

  if (!targetGoal) return [];

  // Step 1: Get full relevant skill set
  const relevantSkills = await getFullPrerequisiteChain(targetGoal.targetSkillId, true);
  const relevantSkillIds = relevantSkills.map(s => s.id);

  const masteries = await prisma.skillMastery.findMany({
    where: {
      userId,
      skillId: { in: relevantSkillIds }
    }
  });

  const masteryMap = new Map();
  masteries.forEach(m => masteryMap.set(m.skillId, m.masteryScore));

  const masteredSkills = new Set();
  relevantSkills.forEach(s => {
    const m = masteryMap.get(s.id) ?? 0.0;
    if (m >= 0.6) {
      masteredSkills.add(s.id);
    }
  });

  const remainingWeakSkills = new Set(
    relevantSkills.filter(s => !masteredSkills.has(s.id)).map(s => s.id)
  );

  const placedSkillIds = new Set();
  const learningPath = [];
  let currentOrder = 1;
  let iterations = 0;
  const maxIterations = relevantSkills.length * 2;

  while (remainingWeakSkills.size > 0 && iterations < maxIterations) {
    iterations++;
    const readyCandidates = [];

    for (const skillId of remainingWeakSkills) {
      const directPrereqs = await getDirectPrerequisites(skillId);
      const isSatisfied = directPrereqs.every(
        p => masteredSkills.has(p.id) || placedSkillIds.has(p.id)
      );

      if (isSatisfied) {
        const mastery = masteryMap.get(skillId) ?? 0.0;
        readyCandidates.push({ skillId, mastery });
      }
    }

    if (readyCandidates.length === 0) {
      const fallbackId = Array.from(remainingWeakSkills)[0];
      readyCandidates.push({ skillId: fallbackId, mastery: masteryMap.get(fallbackId) ?? 0.0 });
    }

    // Lowest mastery first
    readyCandidates.sort((a, b) => a.mastery - b.mastery);

    const chosen = readyCandidates[0];
    const skillObj = relevantSkills.find(s => s.id === chosen.skillId);

    placedSkillIds.add(chosen.skillId);
    remainingWeakSkills.delete(chosen.skillId);

    learningPath.push({
      skillId: chosen.skillId,
      skillName: skillObj.name,
      domain: skillObj.domain,
      masteryScore: chosen.mastery,
      order: currentOrder++,
      status: 'ready_to_learn'
    });
  }

  return learningPath;
}

module.exports = {
  generateLearningPath
};
