import { describe, it, expect, beforeEach } from 'vitest';
import { generateLearningPath } from '../server/services/learningPathService.js';
import { store } from '../server/store.js';
import { resetTestStore } from './setup.js';
import { getDirectPrerequisites } from '../server/services/graphService.js';

describe('Learning Path Service - Goal-Driven Topological Sequencing', () => {
  const testUserId = 'test_learner_path';

  beforeEach(async () => {
    await resetTestStore();
  });

  describe('1. Prerequisite Ordering', () => {
    it('guarantees that every prerequisite is sequenced before its dependent skills', () => {
      // All skills weak
      const path = generateLearningPath(testUserId, 'goal_mle');

      expect(path.length).toBeGreaterThan(0);

      const skillOrderMap = new Map<string, number>();
      path.forEach((step) => {
        skillOrderMap.set(step.skillId, step.order);
      });

      // For every step in the path, all its prerequisites must either be absent (already mastered)
      // or appear with an earlier order number.
      for (const step of path) {
        const directPrereqs = getDirectPrerequisites(step.skillId);
        for (const prereq of directPrereqs) {
          if (skillOrderMap.has(prereq.id)) {
            const prereqOrder = skillOrderMap.get(prereq.id)!;
            const currentOrder = step.order;
            expect(prereqOrder).toBeLessThan(currentOrder);
          }
        }
      }
    });
  });

  describe('2. Mastered Skills Filtering', () => {
    it('excludes mastered skills (mastery >= 0.6) from the remaining learning path', () => {
      // Mark Python and Probability as mastered
      store.masteries.set(`${testUserId}_skill_python`, {
        userId: testUserId,
        skillId: 'skill_python',
        skillName: 'Python',
        domain: 'Programming & Data Science',
        masteryScore: 0.85,
        interpretation: 'Strong',
        evidenceCount: 3,
        lastUpdated: new Date().toISOString(),
      });

      store.masteries.set(`${testUserId}_skill_prob`, {
        userId: testUserId,
        skillId: 'skill_prob',
        skillName: 'Probability',
        domain: 'Mathematics & Statistics',
        masteryScore: 0.80,
        interpretation: 'Strong',
        evidenceCount: 3,
        lastUpdated: new Date().toISOString(),
      });

      const path = generateLearningPath(testUserId, 'goal_mle');
      const pathSkillIds = path.map((s) => s.skillId);

      expect(pathSkillIds).not.toContain('skill_python');
      expect(pathSkillIds).not.toContain('skill_prob');
    });

    it('returns an empty path when all skills for the chosen goal are mastered', () => {
      const allSkills = Array.from(store.skills.keys());
      for (const sId of allSkills) {
        store.masteries.set(`${testUserId}_${sId}`, {
          userId: testUserId,
          skillId: sId,
          skillName: sId,
          domain: 'Domain',
          masteryScore: 0.90,
          interpretation: 'Strong',
          evidenceCount: 4,
          lastUpdated: new Date().toISOString(),
        });
      }

      const path = generateLearningPath(testUserId, 'goal_mle');
      expect(path).toEqual([]);
    });
  });

  describe('3. Goal-Based Path Scope', () => {
    it('restricts learning path to skills relevant to the Probability Specialist goal', () => {
      // goal_prob target is skill_prob_dist
      const path = generateLearningPath(testUserId, 'goal_prob');
      const pathSkillIds = path.map((s) => s.skillId);

      // Must include probability chain
      expect(pathSkillIds).toContain('skill_prob');
      expect(pathSkillIds).toContain('skill_cond_prob');
      expect(pathSkillIds).toContain('skill_prob_dist');

      // Must NOT include downstream ML-specific skills
      expect(pathSkillIds).not.toContain('skill_ml');
      expect(pathSkillIds).not.toContain('skill_model_eval');
    });

    it('includes full ML prerequisites for the Machine Learning Engineer goal', () => {
      const path = generateLearningPath(testUserId, 'goal_mle');
      const pathSkillIds = new Set(path.map((s) => s.skillId));

      expect(pathSkillIds.has('skill_ml')).toBe(true);
      expect(pathSkillIds.has('skill_python')).toBe(true);
      expect(pathSkillIds.has('skill_linalg')).toBe(true);
    });
  });
});
