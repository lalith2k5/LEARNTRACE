const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * ============================================================================
 * MASTERY SERVICE
 * ============================================================================
 * 
 * IMPORTANT METHODOLOGICAL DOCUMENTATION:
 * 
 * This is an initial rule-based heuristic and NOT a scientifically validated
 * psychometric measurement model.
 * 
 * The LearnTrace architecture is intentionally designed with strict modularity
 * so this mastery service can be replaced with:
 *   - Bayesian Knowledge Tracing (BKT)
 *   - Item Response Theory (IRT)
 *   - Deep Knowledge Tracing (DKT)
 * without requiring changes throughout the rest of the application or database.
 * 
 * ALGORITHM:
 * 1. Retrieve all user attempts associated with questions testing the skill.
 * 2. Order attempts: oldest -> newest (chronological).
 * 3. Assign 1-based recency weight: weight = attempt_position (1, 2, 3, ...).
 * 4. Calculate adjusted score:
 *      if correct: adjustedScore = 1 * (0.7 + 0.3 * (confidence / 5))
 *      if incorrect: adjustedScore = 0
 * 5. Mastery Formula: sum(weight * adjustedScore) / sum(weight)
 * 6. Clamp result: 0 <= masteryScore <= 1
 * 7. Upsert into SkillMastery table.
 * ============================================================================
 */

async function calculateSkillMasteryForUser(userId, skillId) {
  // 1. Fetch all attempts by this user for questions testing this skill
  const attempts = await prisma.attempt.findMany({
    where: {
      userId,
      question: {
        OR: [
          { skillId: skillId },
          { questionSkills: { some: { skillId: skillId } } }
        ]
      }
    },
    orderBy: {
      createdAt: 'asc' // Oldest to newest
    }
  });

  if (attempts.length === 0) {
    const existing = await prisma.skillMastery.findUnique({
      where: { userId_skillId: { userId, skillId } }
    });
    if (existing) return existing;

    return await prisma.skillMastery.upsert({
      where: { userId_skillId: { userId, skillId } },
      update: { masteryScore: 0.0, evidenceCount: 0, lastUpdated: new Date() },
      create: { userId, skillId, masteryScore: 0.0, evidenceCount: 0, lastUpdated: new Date() }
    });
  }

  let weightedScoreSum = 0;
  let totalWeight = 0;

  // 3 & 4. Recency weights and confidence adjustments
  attempts.forEach((attempt, index) => {
    const weight = index + 1; // 1-based recency weight (1, 2, 3, ...)
    let adjustedScore = 0;

    if (attempt.correct) {
      const confidence = Math.min(Math.max(attempt.confidence || 3, 1), 5);
      // Adjusted score formula
      adjustedScore = 1.0 * (0.7 + 0.3 * (confidence / 5));
    } else {
      adjustedScore = 0.0;
    }

    weightedScoreSum += weight * adjustedScore;
    totalWeight += weight;
  });

  // 5. Mastery Score = sum(weight * adjustedScore) / sum(weight)
  const rawMastery = totalWeight > 0 ? weightedScoreSum / totalWeight : 0.0;

  // 6. Clamp between 0 and 1
  const clampedMastery = Math.min(Math.max(rawMastery, 0.0), 1.0);
  const normalizedMastery = Math.round(clampedMastery * 1000) / 1000;

  // 7. Upsert SkillMastery
  const masteryRecord = await prisma.skillMastery.upsert({
    where: {
      userId_skillId: {
        userId,
        skillId
      }
    },
    update: {
      masteryScore: normalizedMastery,
      evidenceCount: attempts.length,
      lastUpdated: new Date()
    },
    create: {
      userId,
      skillId,
      masteryScore: normalizedMastery,
      evidenceCount: attempts.length,
      lastUpdated: new Date()
    }
  });

  return masteryRecord;
}

async function recalculateAllUserMasteries(userId) {
  const allSkills = await prisma.skill.findMany();
  const results = [];

  for (const skill of allSkills) {
    const record = await calculateSkillMasteryForUser(userId, skill.id);
    results.push(record);
  }

  return {
    userId,
    skillMasteries: results,
    calculatedAt: new Date()
  };
}

module.exports = {
  calculateSkillMasteryForUser,
  recalculateAllUserMasteries
};
