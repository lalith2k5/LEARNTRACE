import { describe, it, expect, beforeEach } from 'vitest';
import { COMPREHENSIVE_QUESTION_BANK } from '../server/data/questionBank.js';
import { store } from '../server/store.js';
import { resetTestStore } from './setup.js';

describe('Dataset Verification - 320 Item Active Question Bank', () => {
  beforeEach(async () => {
    await resetTestStore();
  });

  describe('1. Dataset Volume and Completeness', () => {
    it('contains exactly 320 diagnostic question items (no more, no less)', () => {
      expect(COMPREHENSIVE_QUESTION_BANK.length).toBe(320);
    });

    it('distributes exactly 40 questions across each of the 8 curriculum skills', () => {
      const countsBySkill = new Map<string, number>();

      for (const q of COMPREHENSIVE_QUESTION_BANK) {
        countsBySkill.set(q.skillId, (countsBySkill.get(q.skillId) || 0) + 1);
      }

      const expectedSkills = [
        'skill_python',
        'skill_prob',
        'skill_cond_prob',
        'skill_prob_dist',
        'skill_stats',
        'skill_linalg',
        'skill_model_eval',
        'skill_ml',
      ];

      expect(countsBySkill.size).toBe(8);
      for (const sId of expectedSkills) {
        expect(countsBySkill.get(sId)).toBe(40);
      }
    });

    it('distributes exactly 8 questions per difficulty level (1 to 5) within every skill', () => {
      for (const sId of Array.from(store.skills.keys())) {
        const skillQuestions = COMPREHENSIVE_QUESTION_BANK.filter((q) => q.skillId === sId);
        expect(skillQuestions.length).toBe(40);

        for (let diff = 1; diff <= 5; diff++) {
          const diffQuestions = skillQuestions.filter((q) => q.difficulty === diff);
          expect(diffQuestions.length).toBe(8);
        }
      }
    });
  });

  describe('2. Question Validity & Required Fields', () => {
    it('ensures every question conforms to strict structural requirements', () => {
      for (const q of COMPREHENSIVE_QUESTION_BANK) {
        // ID
        expect(q.id).toBeDefined();
        expect(typeof q.id).toBe('string');
        expect(q.id.trim().length).toBeGreaterThan(0);

        // Text
        expect(q.text).toBeDefined();
        expect(typeof q.text).toBe('string');
        expect(q.text.trim().length).toBeGreaterThan(10);

        // Skill ID
        expect(q.skillId).toBeDefined();
        expect(store.skills.has(q.skillId)).toBe(true);

        // Difficulty
        expect(Number.isInteger(q.difficulty)).toBe(true);
        expect(q.difficulty).toBeGreaterThanOrEqual(1);
        expect(q.difficulty).toBeLessThanOrEqual(5);

        // Options
        expect(Array.isArray(q.options)).toBe(true);
        expect(q.options.length).toBeGreaterThanOrEqual(2);

        // Correct Answer
        expect(q.correctAnswer).toBeDefined();
        const optionIds = q.options.map((opt) => opt.id);
        expect(optionIds).toContain(q.correctAnswer);

        // Explanation
        expect(q.explanation).toBeDefined();
        expect(typeof q.explanation).toBe('string');
        expect(q.explanation.trim().length).toBeGreaterThan(5);

        // Cognitive Category
        expect(q.cognitiveCategory).toBeDefined();
      }
    });
  });

  describe('3. Duplicate Detection', () => {
    it('guarantees unique IDs across all 320 questions with zero collision', () => {
      const seenIds = new Set<string>();
      const duplicates: string[] = [];

      for (const q of COMPREHENSIVE_QUESTION_BANK) {
        if (seenIds.has(q.id)) {
          duplicates.push(q.id);
        }
        seenIds.add(q.id);
      }

      expect(duplicates).toEqual([]);
      expect(seenIds.size).toBe(320);
    });

    it('guarantees unique question prompts across the entire question bank', () => {
      const seenPrompts = new Set<string>();
      const duplicatePrompts: string[] = [];

      for (const q of COMPREHENSIVE_QUESTION_BANK) {
        const normalized = q.text.trim().toLowerCase();
        if (seenPrompts.has(normalized)) {
          duplicatePrompts.push(q.id);
        }
        seenPrompts.add(normalized);
      }

      expect(duplicatePrompts).toEqual([]);
      expect(seenPrompts.size).toBe(320);
    });
  });

  describe('4. Skill Mapping & Prerequisite Alignment', () => {
    it('verifies all skillsTested entries map directly to valid skills in the curriculum', () => {
      for (const q of COMPREHENSIVE_QUESTION_BANK) {
        if (q.skillsTested && q.skillsTested.length > 0) {
          for (const testedSkillId of q.skillsTested) {
            expect(store.skills.has(testedSkillId)).toBe(true);
          }
        }
      }
    });
  });
});
