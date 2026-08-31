const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { getFullPrerequisiteChain, getDirectPrerequisites } = require('./graphService');

/**
 * ============================================================================
 * RECOMMENDATION SERVICE
 * ============================================================================
 * 
 * CORE REQUIREMENT:
 * The recommendation engine MUST NEVER simply recommend the skill with the lowest score.
 * It must balance:
 *   1. Full prerequisite traversal of the selected goal
 *   2. Readiness (all direct prerequisites >= 0.6)
 *   3. Downstream impact / unblocking count
 *   4. Priority formula: (1 - mastery) * (1 + downstreamCount)
 * ============================================================================
 */

async function getPrioritizedRecommendation(userId, goalId) {
  // 1. Identify Learning Goal
  let targetGoal = null;
  if (goalId) {
    targetGoal = await prisma.learningGoal.findUnique({
      where: { id: goalId },
      include: { targetSkill: true }
    });
  }

  if (!targetGoal) {
    const userGoal = await prisma.userGoal.findFirst({
      where: { userId },
      include: { goal: { include: { targetSkill: true } } }
    });
    if (userGoal && userGoal.goal) {
      targetGoal = userGoal.goal;
    }
  }

  if (!targetGoal) {
    targetGoal = await prisma.learningGoal.findFirst({
      include: { targetSkill: true }
    });
  }

  if (!targetGoal) {
    return {
      recommendation: null,
      message: 'No learning goal configured.'
    };
  }

  const targetSkillId = targetGoal.targetSkillId;
  const goalName = targetGoal.name;

  // Step 1: Find all skills in the FULL prerequisite chain
  const relevantSkills = await getFullPrerequisiteChain(targetSkillId, true);
  const relevantSkillIds = new Set(relevantSkills.map(s => s.id));

  // Step 2: Retrieve mastery scores for all relevant skills
  const masteries = await prisma.skillMastery.findMany({
    where: {
      userId,
      skillId: { in: Array.from(relevantSkillIds) }
    }
  });

  const masteryMap = new Map();
  masteries.forEach(m => masteryMap.set(m.skillId, m.masteryScore));

  // Step 3, 4, 6: Evaluate candidate scores
  const candidates = [];

  for (const skill of relevantSkills) {
    const mastery = masteryMap.get(skill.id) ?? 0.0;

    // Step 3: Calculate downstream count within relevant chain
    const downstreamRels = await prisma.skillPrerequisite.findMany({
      where: {
        prerequisiteSkillId: skill.id,
        skillId: { in: Array.from(relevantSkillIds) }
      }
    });
    const downstreamCount = downstreamRels.length;

    // Step 4: Determine readiness
    const directPrereqs = await getDirectPrerequisites(skill.id);
    const unmetPrereqs = [];

    for (const p of directPrereqs) {
      const pMastery = masteryMap.get(p.id) ?? 0.0;
      if (pMastery < 0.6) {
        unmetPrereqs.push(p.name);
      }
    }

    const isReady = unmetPrereqs.length === 0;

    // Step 6: Priority score = (1 - mastery) * (1 + downstreamCount)
    const priorityScore = (1.0 - mastery) * (1 + downstreamCount);

    candidates.push({
      skill,
      mastery,
      downstreamCount,
      isReady,
      priorityScore: Math.round(priorityScore * 1000) / 1000,
      unmetPrereqs
    });
  }

  // Step 5: Candidate Filter (mastery < 0.6 AND ready === true)
  const eligibleCandidates = candidates.filter(c => c.mastery < 0.6 && c.isReady);

  // Step 18: No-Ready-Candidate Edge Case
  if (eligibleCandidates.length === 0) {
    const targetMastery = masteryMap.get(targetSkillId) ?? 0.0;
    if (targetMastery >= 0.6) {
      return {
        recommendation: null,
        message: `You have successfully achieved mastery across all skills required for the "${goalName}" goal.`
      };
    }

    return {
      recommendation: null,
      message: 'You have no currently eligible weak skill to prioritize for this goal.'
    };
  }

  // Step 7: Select Recommendation (highest priorityScore first)
  eligibleCandidates.sort((a, b) => b.priorityScore - a.priorityScore);
  const topCandidate = eligibleCandidates[0];

  // Step 8: Generate Human-Readable Reason
  const pct = Math.round(topCandidate.mastery * 100);
  let reasonText = '';
  if (topCandidate.downstreamCount > 0) {
    reasonText = `Your current mastery in ${topCandidate.skill.name} is ${pct}%. Improving it is important because it helps unlock ${topCandidate.downstreamCount} downstream skill${topCandidate.downstreamCount > 1 ? 's' : ''} on your path toward becoming a ${goalName}.`;
  } else {
    reasonText = `Your current mastery in ${topCandidate.skill.name} is ${pct}%. Focusing on this milestone skill completes your path toward becoming a ${goalName}.`;
  }

  // Step 9: Log Recommendation
  const loggedRec = await prisma.recommendation.create({
    data: {
      userId,
      skillId: topCandidate.skill.id,
      priorityScore: topCandidate.priorityScore,
      reasonText
    }
  });

  return {
    recommendation: {
      ...loggedRec,
      skillName: topCandidate.skill.name,
      masteryScore: topCandidate.mastery,
      downstreamCount: topCandidate.downstreamCount,
      goalName
    }
  };
}

module.exports = {
  getPrioritizedRecommendation
};
