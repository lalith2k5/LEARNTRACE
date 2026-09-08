import { describe, it, expect, beforeEach } from 'vitest';
import {
  calculateSkillMasteryForUser,
  getInterpretationFromScore,
  computeBktEstimate,
  DEFAULT_BKT_PARAMS,
} from '../server/services/masteryService.js';
import { store } from '../server/store.js';
import { resetTestStore } from './setup.js';
import { Attempt } from '../src/types.js';

describe('Mastery Service - Evidence-Based Mastery Engine', () => {
  const testUserId = 'test_learner_1';
  const testSkillId = 'skill_python';

  function mockAttempt(partial: Partial<Attempt>): Attempt {
    return {
      id: 'att_' + Math.random().toString(36).substring(2, 9),
      userId: testUserId,
      questionId: 'q_py_1',
      skillId: testSkillId,
      selectedAnswer: 'opt_a',
      correct: true,
      confidence: 3,
      timeTakenSeconds: 30,
      attemptNumber: 1,
      createdAt: new Date().toISOString(),
      ...partial,
    };
  }

  beforeEach(async () => {
    await resetTestStore();
  });

  describe('1. Baseline and Initial State', () => {
    it('returns baseline 0.0 mastery and Weak interpretation when no evidence exists', () => {
      const mastery = calculateSkillMasteryForUser(testUserId, testSkillId);
      expect(mastery.masteryScore).toBe(0.0);
      expect(mastery.evidenceCount).toBe(0);
      expect(mastery.interpretation).toBe('Weak');
      expect(mastery.bktEstimate).toBe(DEFAULT_BKT_PARAMS.pL0);
    });
  });

  describe('2. Correct and Incorrect Answers', () => {
    it('increases mastery following a single correct answer', () => {
      const attempt = mockAttempt({
        id: 'att_1',
        correct: true,
        confidence: 3,
        timeTakenSeconds: 30,
      });
      store.attempts.push(attempt);

      const mastery = calculateSkillMasteryForUser(testUserId, testSkillId);
      expect(mastery.masteryScore).toBeGreaterThan(0.7);
      expect(mastery.evidenceCount).toBe(1);
    });

    it('produces zero mastery following a single incorrect answer', () => {
      const attempt = mockAttempt({
        id: 'att_2',
        correct: false,
        confidence: 3,
        timeTakenSeconds: 25,
      });
      store.attempts.push(attempt);

      const mastery = calculateSkillMasteryForUser(testUserId, testSkillId);
      expect(mastery.masteryScore).toBe(0.0);
      expect(mastery.evidenceCount).toBe(1);
      expect(mastery.interpretation).toBe('Weak');
    });
  });

  describe('3. Confidence Weighting', () => {
    it('rewards high confidence correct responses more than low confidence correct responses', () => {
      const highConfUserId = 'learner_high_conf';
      const lowConfUserId = 'learner_low_conf';

      // High confidence (5)
      store.attempts.push(
        mockAttempt({
          id: 'att_high',
          userId: highConfUserId,
          confidence: 5,
          correct: true,
        })
      );

      // Low confidence (1)
      store.attempts.push(
        mockAttempt({
          id: 'att_low',
          userId: lowConfUserId,
          confidence: 1,
          correct: true,
        })
      );

      const highConfMastery = calculateSkillMasteryForUser(highConfUserId, testSkillId);
      const lowConfMastery = calculateSkillMasteryForUser(lowConfUserId, testSkillId);

      expect(highConfMastery.masteryScore).toBeGreaterThan(lowConfMastery.masteryScore);
    });
  });

  describe('4. Recency Weighting over Time', () => {
    it('weights recent performance higher than historical mistakes (mistake -> recovery)', () => {
      const recoveryUserId = 'learner_recovery';
      const relapseUserId = 'learner_relapse';

      const pastDate = new Date(Date.now() - 3600 * 1000).toISOString();
      const recentDate = new Date().toISOString();

      // Recovery Learner: Incorrect first, Correct recently
      store.attempts.push(
        mockAttempt({
          id: 'rec_1',
          userId: recoveryUserId,
          questionId: 'q_py_1',
          correct: false,
          confidence: 3,
          createdAt: pastDate,
        }),
        mockAttempt({
          id: 'rec_2',
          userId: recoveryUserId,
          questionId: 'q_py_2',
          correct: true,
          confidence: 5,
          createdAt: recentDate,
        })
      );

      // Relapse Learner: Correct first, Incorrect recently
      store.attempts.push(
        mockAttempt({
          id: 'rel_1',
          userId: relapseUserId,
          questionId: 'q_py_1',
          correct: true,
          confidence: 5,
          createdAt: pastDate,
        }),
        mockAttempt({
          id: 'rel_2',
          userId: relapseUserId,
          questionId: 'q_py_2',
          correct: false,
          confidence: 3,
          createdAt: recentDate,
        })
      );

      const recoveryMastery = calculateSkillMasteryForUser(recoveryUserId, testSkillId);
      const relapseMastery = calculateSkillMasteryForUser(relapseUserId, testSkillId);

      expect(recoveryMastery.masteryScore).toBeGreaterThan(relapseMastery.masteryScore);
      expect(recoveryMastery.masteryScore).toBeGreaterThan(0.6);
      expect(relapseMastery.masteryScore).toBeLessThan(0.4);
    });
  });

  describe('5. Temporal Memory Decay (Ebbinghaus Forgetting Curve)', () => {
    it('applies retention decay when time has elapsed since last attempt', () => {
      const activeUserId = 'active_learner';
      const lapsedUserId = 'lapsed_learner';

      const recentTime = new Date().toISOString();
      // 21 days ago
      const twentyOneDaysAgo = new Date(Date.now() - 21 * 24 * 3600 * 1000).toISOString();

      store.attempts.push(
        mockAttempt({
          id: 'att_active',
          userId: activeUserId,
          confidence: 5,
          correct: true,
          createdAt: recentTime,
        })
      );

      store.attempts.push(
        mockAttempt({
          id: 'att_lapsed',
          userId: lapsedUserId,
          confidence: 5,
          correct: true,
          createdAt: twentyOneDaysAgo,
        })
      );

      const activeMastery = calculateSkillMasteryForUser(activeUserId, testSkillId);
      const lapsedMastery = calculateSkillMasteryForUser(lapsedUserId, testSkillId);

      expect(activeMastery.retentionRate).toBe(1.0);
      expect(lapsedMastery.retentionRate).toBeLessThan(1.0);
      expect(lapsedMastery.masteryScore).toBeLessThan(activeMastery.masteryScore);
      expect(lapsedMastery.needsSpacedReview).toBe(true);
      expect(lapsedMastery.daysSinceLastAttempt).toBeGreaterThanOrEqual(20);
    });
  });

  describe('6. Mastery Interpretation Boundaries', () => {
    it('maps scores accurately to qualitative interpretation bands', () => {
      expect(getInterpretationFromScore(0.95)).toBe('Strong');
      expect(getInterpretationFromScore(0.80)).toBe('Strong');
      expect(getInterpretationFromScore(0.75)).toBe('Good foundation');
      expect(getInterpretationFromScore(0.70)).toBe('Good foundation');
      expect(getInterpretationFromScore(0.65)).toBe('Moderate');
      expect(getInterpretationFromScore(0.60)).toBe('Moderate');
      expect(getInterpretationFromScore(0.55)).toBe('Developing');
      expect(getInterpretationFromScore(0.50)).toBe('Developing');
      expect(getInterpretationFromScore(0.49)).toBe('Weak');
      expect(getInterpretationFromScore(0.10)).toBe('Weak');
      expect(getInterpretationFromScore(0.00)).toBe('Weak');
    });
  });

  describe('7. Bayesian Knowledge Tracing (BKT) Behavior', () => {
    it('monotonically increases estimated probability of knowledge with consecutive successes', () => {
      const attempts: Attempt[] = [];
      let lastEstimate = DEFAULT_BKT_PARAMS.pL0;

      for (let i = 1; i <= 4; i++) {
        attempts.push(
          mockAttempt({
            id: `bkt_${i}`,
            userId: testUserId,
            questionId: `q_${i}`,
            correct: true,
            confidence: 4,
          })
        );

        const currentEstimate = computeBktEstimate(attempts);
        expect(currentEstimate).toBeGreaterThan(lastEstimate);
        lastEstimate = currentEstimate;
      }

      expect(lastEstimate).toBeGreaterThan(0.7);
    });

    it('decreases estimated probability of knowledge after an incorrect attempt', () => {
      const attempts: Attempt[] = [
        mockAttempt({
          id: 'bkt_1',
          userId: testUserId,
          questionId: 'q_1',
          correct: true,
          confidence: 4,
        }),
      ];

      const afterSuccess = computeBktEstimate(attempts);

      attempts.push(
        mockAttempt({
          id: 'bkt_2',
          userId: testUserId,
          questionId: 'q_2',
          correct: false,
          confidence: 4,
        })
      );

      const afterFailure = computeBktEstimate(attempts);
      expect(afterFailure).toBeLessThan(afterSuccess);
    });
  });
});
