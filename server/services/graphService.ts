import { store } from '../store.js';
import { Skill, SkillPrerequisite } from '../../src/types.js';
import { getInterpretationFromScore } from './masteryService.js';

/**
 * ============================================================================
 * GRAPH SERVICE - Knowledge Graph Traversal & Topology
 * ============================================================================
 * 
 * Semantics:
 *   SkillPrerequisite { skillId, prerequisiteSkillId }
 *   Means: "skillId depends on prerequisiteSkillId"
 * ============================================================================
 */

export function getDirectPrerequisites(skillId: string): Skill[] {
  const directPrereqIds = store.prerequisites
    .filter((p) => p.skillId === skillId)
    .map((p) => p.prerequisiteSkillId);

  const skills: Skill[] = [];
  for (const id of directPrereqIds) {
    const skill = store.skills.get(id);
    if (skill) {
      skills.push(skill);
    }
  }
  return skills;
}

export function getDirectDependents(skillId: string): Skill[] {
  const dependentIds = store.prerequisites
    .filter((p) => p.prerequisiteSkillId === skillId)
    .map((p) => p.skillId);

  const skills: Skill[] = [];
  for (const id of dependentIds) {
    const skill = store.skills.get(id);
    if (skill) {
      skills.push(skill);
    }
  }
  return skills;
}

/**
 * Returns the FULL recursive prerequisite chain for a target skill.
 * Performs Breadth-First Search (BFS) with cycle protection.
 */
export function getFullPrerequisiteChain(targetSkillId: string, includeTarget = true): Skill[] {
  const visited = new Set<string>();
  const queue: string[] = [targetSkillId];
  const chain: Skill[] = [];

  if (!includeTarget) {
    visited.add(targetSkillId);
  }

  while (queue.length > 0) {
    const currentId = queue.shift()!;

    if (includeTarget || currentId !== targetSkillId) {
      if (!visited.has(currentId)) {
        visited.add(currentId);
        const currentSkill = store.skills.get(currentId);
        if (currentSkill) {
          chain.push(currentSkill);
        }
      }
    }

    const directPrereqIds = store.prerequisites
      .filter((p) => p.skillId === currentId)
      .map((p) => p.prerequisiteSkillId);

    for (const prereqId of directPrereqIds) {
      if (!visited.has(prereqId)) {
        visited.add(prereqId);
        const prereqSkill = store.skills.get(prereqId);
        if (prereqSkill) {
          chain.push(prereqSkill);
        }
        queue.push(prereqId);
      }
    }
  }

  return chain;
}

/**
 * Calculates downstream count:
 * How many OTHER skills in the specified relevant chain depend on `skillId`.
 */
export function calculateDownstreamCountInChain(skillId: string, relevantSkillIds: Set<string>): number {
  const dependents = store.prerequisites.filter(
    (p) => p.prerequisiteSkillId === skillId && relevantSkillIds.has(p.skillId)
  );
  return dependents.length;
}

/**
 * Returns full graph representation formatted for React Flow with optimal visual coordinates
 */
export function getGraphPayload(userMasteriesMap: Map<string, number>, targetSkillId?: string, recommendedSkillId?: string) {
  const skills = Array.from(store.skills.values());
  
  // Custom structured coordinates for pedagogical DAG visualization
  const nodePositions: Record<string, { x: number; y: number }> = {
    skill_python: { x: 60, y: 50 },
    skill_prob: { x: 60, y: 220 },
    skill_cond_prob: { x: 280, y: 150 },
    skill_prob_dist: { x: 500, y: 150 },
    skill_linalg: { x: 280, y: 380 },
    skill_stats: { x: 720, y: 220 },
    skill_model_eval: { x: 940, y: 220 },
    skill_ml: { x: 1160, y: 280 },
  };

  const nodes = skills.map((skill, index) => {
    const mastery = userMasteriesMap.get(skill.id) ?? 0;
    const directPrereqs = getDirectPrerequisites(skill.id);
    const isReady = directPrereqs.every((p) => (userMasteriesMap.get(p.id) ?? 0) >= 0.6);
    const position = nodePositions[skill.id] || { x: 100 + (index % 4) * 260, y: 80 + Math.floor(index / 4) * 180 };

    return {
      id: skill.id,
      type: 'skillNode',
      position,
      data: {
        id: skill.id,
        label: skill.name,
        domain: skill.domain,
        description: skill.description,
        mastery,
        interpretation: getInterpretationFromScore(mastery),
        isTarget: skill.id === targetSkillId,
        isReady,
        isRecommended: skill.id === recommendedSkillId,
        prerequisiteCount: directPrereqs.length,
      },
    };
  });

  const edges = store.prerequisites.map((p, i) => ({
    id: `edge_${p.prerequisiteSkillId}_to_${p.skillId}_${i}`,
    source: p.prerequisiteSkillId,
    target: p.skillId,
    animated: true,
    style: { stroke: '#818cf8', strokeWidth: 2.5 },
    type: 'smoothstep',
    markerEnd: {
      type: 'arrowclosed',
      color: '#818cf8',
    },
  }));

  return { nodes, edges };
}
