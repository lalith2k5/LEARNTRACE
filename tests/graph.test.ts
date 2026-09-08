import { describe, it, expect, beforeEach } from 'vitest';
import { 
  getDirectPrerequisites, 
  getDirectDependents, 
  getFullPrerequisiteChain, 
  calculateDownstreamCountInChain, 
  detectCycle, 
  getTopologicalSort 
} from '../server/services/graphService.js';
import { store } from '../server/store.js';
import { resetTestStore } from './setup.js';
import { SkillPrerequisite } from '../src/types.js';

describe('Graph Service - Knowledge Graph Traversal & Topology', () => {
  beforeEach(async () => {
    await resetTestStore();
  });

  describe('1. Prerequisite Traversal', () => {
    it('retrieves direct prerequisites correctly', () => {
      // In seed: skill_cond_prob depends on skill_prob
      const prereqs = getDirectPrerequisites('skill_cond_prob');
      expect(prereqs.length).toBe(1);
      expect(prereqs[0].id).toBe('skill_prob');
    });

    it('retrieves direct dependents correctly', () => {
      // In seed: skill_prob is prerequisite to skill_cond_prob and skill_stats
      const dependents = getDirectDependents('skill_prob');
      const dependentIds = dependents.map((d) => d.id);
      expect(dependentIds).toContain('skill_cond_prob');
      expect(dependentIds).toContain('skill_stats');
    });

    it('returns empty array when skill has no prerequisites', () => {
      // Root foundational skills like Python have no prerequisites
      const prereqs = getDirectPrerequisites('skill_python');
      expect(prereqs).toEqual([]);
    });
  });

  describe('2. Ancestor Detection (Recursive Prerequisite Chain)', () => {
    it('retrieves full recursive ancestor prerequisite chain for a target skill', () => {
      // skill_prob_dist depends on skill_cond_prob, which depends on skill_prob
      const chain = getFullPrerequisiteChain('skill_prob_dist', false);
      const chainIds = chain.map((s) => s.id);

      expect(chainIds).toContain('skill_cond_prob');
      expect(chainIds).toContain('skill_prob');
      expect(chainIds).not.toContain('skill_prob_dist');
    });

    it('includes target skill when includeTarget is true', () => {
      const chain = getFullPrerequisiteChain('skill_prob_dist', true);
      const chainIds = chain.map((s) => s.id);

      expect(chainIds).toContain('skill_prob_dist');
      expect(chainIds).toContain('skill_cond_prob');
      expect(chainIds).toContain('skill_prob');
    });

    it('recursively gathers all ancestors for top-level skill_ml', () => {
      const chain = getFullPrerequisiteChain('skill_ml', true);
      const chainIds = new Set(chain.map((s) => s.id));

      expect(chainIds.has('skill_ml')).toBe(true);
      expect(chainIds.has('skill_stats')).toBe(true);
      expect(chainIds.has('skill_linalg')).toBe(true);
      expect(chainIds.has('skill_python')).toBe(true);
      expect(chainIds.has('skill_model_eval')).toBe(true);
      expect(chainIds.has('skill_prob_dist')).toBe(true);
      expect(chainIds.has('skill_cond_prob')).toBe(true);
      expect(chainIds.has('skill_prob')).toBe(true);
    });
  });

  describe('3. Downstream Detection in Subgraphs', () => {
    it('calculates downstream count correctly within a relevant subgraph', () => {
      const relevantChain = new Set(['skill_prob', 'skill_cond_prob', 'skill_prob_dist', 'skill_stats']);
      // In this chain:
      // skill_prob is prerequisite to skill_cond_prob and skill_stats (2 downstream)
      const count = calculateDownstreamCountInChain('skill_prob', relevantChain);
      expect(count).toBe(2);
    });

    it('returns 0 for leaf nodes with no downstream dependents in subgraph', () => {
      const relevantChain = new Set(['skill_prob', 'skill_cond_prob', 'skill_prob_dist']);
      const count = calculateDownstreamCountInChain('skill_prob_dist', relevantChain);
      expect(count).toBe(0);
    });
  });

  describe('4. Prerequisite Ordering & Topological Sorting', () => {
    it('orders linear prerequisite chain: A → B → C (Expected: A before B before C)', () => {
      // Custom linear chain where C depends on B, and B depends on A
      const customPrereqs: SkillPrerequisite[] = [
        { skillId: 'B', prerequisiteSkillId: 'A' },
        { skillId: 'C', prerequisiteSkillId: 'B' },
      ];

      const sorted = getTopologicalSort(['A', 'B', 'C'], customPrereqs);
      const sortedIds = sorted.map((s) => s.id);

      expect(sortedIds).toEqual(['A', 'B', 'C']);

      const indexA = sortedIds.indexOf('A');
      const indexB = sortedIds.indexOf('B');
      const indexC = sortedIds.indexOf('C');

      expect(indexA).toBeLessThan(indexB);
      expect(indexB).toBeLessThan(indexC);
    });

    it('orders branching prerequisite graph: A → B and A → C', () => {
      // B depends on A; C depends on A
      const customPrereqs: SkillPrerequisite[] = [
        { skillId: 'B', prerequisiteSkillId: 'A' },
        { skillId: 'C', prerequisiteSkillId: 'A' },
      ];

      const sorted = getTopologicalSort(['A', 'B', 'C'], customPrereqs);
      const sortedIds = sorted.map((s) => s.id);

      const indexA = sortedIds.indexOf('A');
      const indexB = sortedIds.indexOf('B');
      const indexC = sortedIds.indexOf('C');

      // A must precede both B and C
      expect(indexA).toBeLessThan(indexB);
      expect(indexA).toBeLessThan(indexC);
    });

    it('orders multiple prerequisite paths / diamond: A → B, A → C, B → D, C → D', () => {
      const customPrereqs: SkillPrerequisite[] = [
        { skillId: 'B', prerequisiteSkillId: 'A' },
        { skillId: 'C', prerequisiteSkillId: 'A' },
        { skillId: 'D', prerequisiteSkillId: 'B' },
        { skillId: 'D', prerequisiteSkillId: 'C' },
      ];

      const sorted = getTopologicalSort(['A', 'B', 'C', 'D'], customPrereqs);
      const sortedIds = sorted.map((s) => s.id);

      const indexA = sortedIds.indexOf('A');
      const indexB = sortedIds.indexOf('B');
      const indexC = sortedIds.indexOf('C');
      const indexD = sortedIds.indexOf('D');

      expect(indexA).toBeLessThan(indexB);
      expect(indexA).toBeLessThan(indexC);
      expect(indexB).toBeLessThan(indexD);
      expect(indexC).toBeLessThan(indexD);
    });

    it('correctly sorts the entire LearnTrace curriculum DAG without prerequisite violations', () => {
      const sorted = getTopologicalSort();
      const sortedIds = sorted.map((s) => s.id);

      // Verify for every prerequisite edge in store that prerequisite precedes dependent
      for (const edge of store.prerequisites) {
        const prereqIdx = sortedIds.indexOf(edge.prerequisiteSkillId);
        const dependentIdx = sortedIds.indexOf(edge.skillId);

        expect(prereqIdx).toBeGreaterThanOrEqual(0);
        expect(dependentIdx).toBeGreaterThanOrEqual(0);
        expect(prereqIdx).toBeLessThan(dependentIdx);
      }
    });
  });

  describe('5. Cycle Protection & Cycle Detection', () => {
    it('detects a 3-node cycle: A → B, B → C, C → A', () => {
      // B depends on A, C depends on B, A depends on C
      const cyclePrereqs: SkillPrerequisite[] = [
        { skillId: 'B', prerequisiteSkillId: 'A' },
        { skillId: 'C', prerequisiteSkillId: 'B' },
        { skillId: 'A', prerequisiteSkillId: 'C' },
      ];

      const cycleResult = detectCycle(cyclePrereqs);
      expect(cycleResult.hasCycle).toBe(true);
      expect(cycleResult.cycle).toBeDefined();
    });

    it('rejects topological sorting when a cycle is present', () => {
      const cyclePrereqs: SkillPrerequisite[] = [
        { skillId: 'B', prerequisiteSkillId: 'A' },
        { skillId: 'C', prerequisiteSkillId: 'B' },
        { skillId: 'A', prerequisiteSkillId: 'C' },
      ];

      expect(() => {
        getTopologicalSort(['A', 'B', 'C'], cyclePrereqs);
      }).toThrow(/Cycle detected/i);
    });

    it('safely handles circular chains in recursive traversal without hanging or stack overflow', () => {
      // Inject temporary cycle into store
      store.prerequisites.push({ skillId: 'skill_prob', prerequisiteSkillId: 'skill_prob_dist' });

      // getFullPrerequisiteChain must terminate safely due to visited set
      const chain = getFullPrerequisiteChain('skill_prob_dist', true);
      expect(Array.isArray(chain)).toBe(true);
      expect(chain.length).toBeGreaterThan(0);
    });

    it('confirms the production LearnTrace curriculum graph is completely acyclic', () => {
      const cycleResult = detectCycle();
      expect(cycleResult.hasCycle).toBe(false);
      expect(cycleResult.cycle).toBeUndefined();
    });
  });
});
