import { store } from '../store.js';
import { SkillMastery, MasteryInterpretation, Attempt, BktParameters } from '../../src/types.js';

export interface RecalculatedMasteryResult {
  userId: string;
  skillMasteries: SkillMastery[];
  calculatedAt: string;
}

export const DEFAULT_BKT_PARAMS: BktParameters = {
  pL0: 0.15,      // Initial knowledge probability
  pTransit: 0.18,  // Learning transition probability
  pSlip: 0.10,     // Probability of slip (knows skill but makes error)
  pGuess: 0.25,    // Probability of lucky guess (doesn't know but answers correctly)
};

export function getInterpretationFromScore(score: number): MasteryInterpretation {
  if (score >= 0.8) return 'Strong';
  if (score >= 0.7) return 'Good foundation';
  if (score >= 0.6) return 'Moderate';
  if (score >= 0.5) return 'Developing';
  return 'Weak';
}

/**
 * Computes Bayesian Knowledge Tracing (BKT) estimate over a sequential stream of student attempts.
 */
export function computeBktEstimate(attempts: Attempt[], params: BktParameters = DEFAULT_BKT_PARAMS): number {
  if (attempts.length === 0) return params.pL0;

  let pL = params.pL0;

  for (const att of attempts) {
    let pLGivenObs = 0;
    if (att.correct) {
      const numerator = pL * (1 - params.pSlip);
      const denominator = numerator + (1 - pL) * params.pGuess;
      pLGivenObs = denominator > 0 ? numerator / denominator : pL;
    } else {
      const numerator = pL * params.pSlip;
      const denominator = numerator + (1 - pL) * (1 - params.pGuess);
      pLGivenObs = denominator > 0 ? numerator / denominator : pL;
    }

    // Apply learning transition
    pL = pLGivenObs + (1 - pLGivenObs) * params.pTransit;
    pL = Math.min(Math.max(pL, 0.01), 0.99);
  }

  return Math.round(pL * 1000) / 1000;
}

/**
 * Calculates evidence-driven skill mastery for a user.
 * Combines multi-skill tagged attempts, recency-weighted updates, confidence weighting, and time penalty.
 */
export function calculateSkillMasteryForUser(userId: string, skillId: string): SkillMastery {
  const skill = store.skills.get(skillId);
  const skillName = skill?.name || skillId;
  const domain = skill?.domain || 'General';

  // 1. Retrieve all user attempts associated with this skill (either direct skillId or multi-skill tagged)
  const skillAttempts = store.attempts.filter(
    (att) =>
      att.userId === userId &&
      (att.skillId === skillId || (att.skillsTested && att.skillsTested.includes(skillId)))
  );

  if (skillAttempts.length === 0) {
    const defaultMastery: SkillMastery = {
      userId,
      skillId,
      skillName,
      domain,
      masteryScore: 0.0,
      interpretation: 'Weak',
      evidenceCount: 0,
      bktEstimate: DEFAULT_BKT_PARAMS.pL0,
      lastUpdated: new Date().toISOString(),
    };
    store.masteries.set(`${userId}_${skillId}`, defaultMastery);
    return defaultMastery;
  }

  // 2. Order attempts: oldest -> newest
  const sortedAttempts = [...skillAttempts].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  let weightedScoreSum = 0;
  let totalWeight = 0;

  // 3. Assign each attempt a recency weight equal to its 1-based position
  sortedAttempts.forEach((attempt, index) => {
    const weight = index + 1; // 1-based recency weight

    let adjustedScore = 0;

    if (attempt.correct) {
      const confidence = Math.min(Math.max(attempt.confidence || 3, 1), 5);
      // Base score is scaled by confidence factor (0.7 + 0.3 * (confidence / 5))
      let score = 1.0 * (0.7 + 0.3 * (confidence / 5));

      // Moderate bonus for swift, fluid responses (< 20 seconds)
      if (attempt.timeTakenSeconds && attempt.timeTakenSeconds < 20) {
        score = Math.min(score * 1.05, 1.0);
      }
      adjustedScore = score;
    } else {
      // Confident misconception penalty vs uncertain error
      const confidence = Math.min(Math.max(attempt.confidence || 3, 1), 5);
      if (confidence >= 4) {
        // High confidence mistake (misconception) stays 0.0
        adjustedScore = 0.0;
      } else {
        adjustedScore = 0.0;
      }
    }

    weightedScoreSum += weight * adjustedScore;
    totalWeight += weight;
  });

  // 4. Mastery Formula: sum(weight * adjustedScore) / sum(weight)
  const rawMastery = totalWeight > 0 ? weightedScoreSum / totalWeight : 0.0;
  const clampedRawMastery = Math.min(Math.max(rawMastery, 0.0), 1.0);
  const normalizedRawMastery = Math.round(clampedRawMastery * 100) / 100;

  // 5. Ebbinghaus Forgetting Curve & Temporal Decay Calculation
  // Memory Stability S (half-life in days) scaled by evidence count and average confidence
  const lastAttempt = sortedAttempts[sortedAttempts.length - 1];
  const lastAttemptTime = new Date(lastAttempt.createdAt).getTime();
  const nowTime = Date.now();
  const elapsedMs = Math.max(0, nowTime - lastAttemptTime);
  const elapsedDays = Math.round((elapsedMs / (1000 * 60 * 60 * 24)) * 10) / 10;

  const avgConfidence = sortedAttempts.reduce((acc, a) => acc + (a.confidence || 3), 0) / sortedAttempts.length;
  // Base stability of 7 days, augmented up to 3x with repeated spaced practice and high confidence
  const stabilityDays = 7 * (1 + 0.25 * Math.min(sortedAttempts.length, 8)) * (0.7 + 0.3 * (avgConfidence / 5));
  
  // Ebbinghaus exponential decay: R(t) = exp(- ln(2) * t / S)
  const retentionFactor = Math.exp((-Math.LN2 * elapsedDays) / stabilityDays);
  const clampedRetention = Math.max(0.20, Math.min(1.0, Math.round(retentionFactor * 100) / 100));

  // Effective retained mastery = raw mastery * retention
  const effectiveMastery = Math.round(normalizedRawMastery * clampedRetention * 100) / 100;
  const needsSpacedReview = (normalizedRawMastery >= 0.60 && clampedRetention < 0.85) || (elapsedDays >= 7 && normalizedRawMastery >= 0.50);

  // Compute BKT parallel estimate for research comparisons
  const bktEstimate = computeBktEstimate(sortedAttempts);

  const result: SkillMastery = {
    userId,
    skillId,
    skillName,
    domain,
    masteryScore: effectiveMastery,
    rawMasteryScore: normalizedRawMastery,
    retentionRate: clampedRetention,
    daysSinceLastAttempt: elapsedDays,
    needsSpacedReview,
    interpretation: getInterpretationFromScore(effectiveMastery),
    evidenceCount: sortedAttempts.length,
    bktEstimate,
    lastUpdated: new Date().toISOString(),
  };

  // Upsert into derived store
  store.masteries.set(`${userId}_${skillId}`, result);
  return result;
}

export function recalculateAllUserMasteries(userId: string): RecalculatedMasteryResult {
  const skills = Array.from(store.skills.values());
  const updatedMasteries: SkillMastery[] = [];

  for (const skill of skills) {
    const mastery = calculateSkillMasteryForUser(userId, skill.id);
    updatedMasteries.push(mastery);
  }

  return {
    userId,
    skillMasteries: updatedMasteries,
    calculatedAt: new Date().toISOString(),
  };
}

export function getUserMastery(userId: string, skillId: string): number {
  const mastery = store.masteries.get(`${userId}_${skillId}`);
  if (mastery) {
    return mastery.masteryScore;
  }
  const calculated = calculateSkillMasteryForUser(userId, skillId);
  return calculated.masteryScore;
}
