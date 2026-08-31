const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * ============================================================================
 * GRAPH SERVICE - Knowledge Graph Traversal & Topology
 * ============================================================================
 * 
 * Semantics:
 *   SkillPrerequisite { skillId, prerequisiteSkillId }
 *   Means: skillId depends on prerequisiteSkillId
 * ============================================================================
 */

async function getDirectPrerequisites(skillId) {
  const relations = await prisma.skillPrerequisite.findMany({
    where: { skillId },
    include: { prerequisiteSkill: true }
  });
  return relations.map(r => r.prerequisiteSkill);
}

async function getDirectDependents(skillId) {
  const relations = await prisma.skillPrerequisite.findMany({
    where: { prerequisiteSkillId: skillId },
    include: { skill: true }
  });
  return relations.map(r => r.skill);
}

/**
 * Full Recursive Ancestor Chain Traversal using Breadth-First Search (BFS)
 * with cycle protection and duplicate prevention.
 */
async function getFullPrerequisiteChain(targetSkillId, includeTarget = true) {
  const visited = new Set();
  const queue = [targetSkillId];
  const chain = [];

  const targetSkill = await prisma.skill.findUnique({ where: { id: targetSkillId } });
  if (!targetSkill) return [];

  if (includeTarget) {
    chain.push(targetSkill);
    visited.add(targetSkillId);
  } else {
    visited.add(targetSkillId);
  }

  while (queue.length > 0) {
    const currentId = queue.shift();

    const directPrereqs = await prisma.skillPrerequisite.findMany({
      where: { skillId: currentId },
      include: { prerequisiteSkill: true }
    });

    for (const item of directPrereqs) {
      const prereqSkill = item.prerequisiteSkill;
      if (!visited.has(prereqSkill.id)) {
        visited.add(prereqSkill.id);
        chain.push(prereqSkill);
        queue.push(prereqSkill.id);
      }
    }
  }

  return chain;
}

module.exports = {
  getDirectPrerequisites,
  getDirectDependents,
  getFullPrerequisiteChain
};
