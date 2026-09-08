import { describe, it, expect, beforeEach } from 'vitest';
import { getPrioritizedRecommendation } from '../server/services/recommendationService.js';
import { store } from '../server/store.js';
import { resetTestStore } from './setup.js';
import { Attempt } from '../src/types.js';

describe('Recommendation Service - High-Leverage Prerequisite Gap Engine', () => {
  const testUserId = 'test_learner_rec';
  const goalId = 'goal_mle'; // Target: skill_ml

  beforeEach(async () => {
    await resetTestStore();
    store.userGoals.set(`${testUserId}_${goalId}`, {
      userId: testUserId,
      goalId,
      selectedAt: new Date().toISOString(),
    });
  });

  it('prioritizes a weak foundational prerequisite over blocked downstream skills', () => {
    // Both skill_prob and skill_cond_prob are weak (0.15),
    // but skill_cond_prob depends on skill_prob.
    // Therefore skill_cond_prob is blocked, and skill_prob MUST be prioritized.
    store.masteries.set(`${testUserId}_skill_prob`, {
      userId: testUserId,
      skillId: 'skill_prob',
      skillName: 'Probability',
      domain: 'Mathematics & Statistics',
      masteryScore: 0.15,
      interpretation: 'Weak',
      evidenceCount: 1,
      lastUpdated: new Date().toISOString(),
    });

    store.masteries.set(`${testUserId}_skill_cond_prob`, {
      userId: testUserId,
      skillId: 'skill_cond_prob',
      skillName: 'Conditional Probability',
      domain: 'Mathematics & Statistics',
      masteryScore: 0.10,
      interpretation: 'Weak',
      evidenceCount: 1,
      lastUpdated: new Date().toISOString(),
    });

    store.masteries.set(`${testUserId}_skill_ml`, {
      userId: testUserId,
      skillId: 'skill_ml',
      skillName: 'Machine Learning',
      domain: 'Artificial Intelligence',
      masteryScore: 0.05,
      interpretation: 'Weak',
      evidenceCount: 1,
      lastUpdated: new Date().toISOString(),
    });

    const result = getPrioritizedRecommendation(testUserId, goalId);

    expect(result.recommendation).not.toBeNull();
    // Foundational ready skill with downstream impact is prioritized
    const recommendedSkillId = result.recommendation!.skillId;
    // Must be one of the foundational root skills that are ready (e.g. skill_prob or skill_python)
    const analysis = result.analysis.find((a) => a.skill.id === recommendedSkillId);
    expect(analysis?.isReady).toBe(true);
    expect(analysis?.mastery).toBeLessThan(0.6);

    // Specifically, blocked skills like skill_cond_prob must NOT be recommended
    const condProbAnalysis = result.analysis.find((a) => a.skill.id === 'skill_cond_prob');
    expect(condProbAnalysis?.isReady).toBe(false);
    expect(condProbAnalysis?.unmetPrerequisites).toContain('Probability');
  });

  it('unblocks downstream skill as eligible once its prerequisite is mastered', () => {
    // Stage 1: Foundational prerequisite is mastered (e.g., skill_prob = 0.85)
    store.masteries.set(`${testUserId}_skill_prob`, {
      userId: testUserId,
      skillId: 'skill_prob',
      skillName: 'Probability',
      domain: 'Mathematics & Statistics',
      masteryScore: 0.85,
      interpretation: 'Strong',
      evidenceCount: 3,
      lastUpdated: new Date().toISOString(),
    });

    // Foundational python is also mastered so it does not compete
    store.masteries.set(`${testUserId}_skill_python`, {
      userId: testUserId,
      skillId: 'skill_python',
      skillName: 'Python',
      domain: 'Programming & Data Science',
      masteryScore: 0.80,
      interpretation: 'Strong',
      evidenceCount: 3,
      lastUpdated: new Date().toISOString(),
    });

    // Foundational linear algebra is also mastered
    store.masteries.set(`${testUserId}_skill_linalg`, {
      userId: testUserId,
      skillId: 'skill_linalg',
      skillName: 'Linear Algebra',
      domain: 'Mathematics & Computing',
      masteryScore: 0.80,
      interpretation: 'Strong',
      evidenceCount: 3,
      lastUpdated: new Date().toISOString(),
    });

    // Downstream skill_cond_prob is still weak (0.20)
    store.masteries.set(`${testUserId}_skill_cond_prob`, {
      userId: testUserId,
      skillId: 'skill_cond_prob',
      skillName: 'Conditional Probability',
      domain: 'Mathematics & Statistics',
      masteryScore: 0.20,
      interpretation: 'Weak',
      evidenceCount: 1,
      lastUpdated: new Date().toISOString(),
    });

    const result = getPrioritizedRecommendation(testUserId, goalId);

    expect(result.recommendation).not.toBeNull();
    // Now skill_cond_prob's prerequisite (skill_prob) is satisfied, making it eligible
    const condProbAnalysis = result.analysis.find((a) => a.skill.id === 'skill_cond_prob');
    expect(condProbAnalysis?.isReady).toBe(true);
    expect(condProbAnalysis?.unmetPrerequisites).toHaveLength(0);
    expect(result.recommendation!.skillId).toBe('skill_cond_prob');
  });

  it('calculates priorityScore accurately using the formula (1 - mastery) * (1 + downstreamCount)', () => {
    // Set up known mastery and check math
    store.masteries.set(`${testUserId}_skill_prob`, {
      userId: testUserId,
      skillId: 'skill_prob',
      skillName: 'Probability',
      domain: 'Mathematics & Statistics',
      masteryScore: 0.20,
      interpretation: 'Weak',
      evidenceCount: 1,
      lastUpdated: new Date().toISOString(),
    });

    const result = getPrioritizedRecommendation(testUserId, goalId);
    const probAnalysis = result.analysis.find((a) => a.skill.id === 'skill_prob')!;

    const expectedScore = Math.round((1.0 - 0.20) * (1 + probAnalysis.downstreamCount) * 1000) / 1000;
    expect(probAnalysis.priorityScore).toBeCloseTo(expectedScore, 3);
  });

  it('returns congratulatory state when all foundational and target skills are mastered', () => {
    const allSkills = Array.from(store.skills.keys());
    for (const skillId of allSkills) {
      store.masteries.set(`${testUserId}_${skillId}`, {
        userId: testUserId,
        skillId,
        skillName: skillId,
        domain: 'Domain',
        masteryScore: 0.85,
        interpretation: 'Strong',
        evidenceCount: 4,
        lastUpdated: new Date().toISOString(),
      });
    }

    const result = getPrioritizedRecommendation(testUserId, goalId);
    expect(result.recommendation).toBeNull();
    expect(result.message).toMatch(/achieved mastery/i);
  });
});
