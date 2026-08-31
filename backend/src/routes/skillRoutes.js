const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { getDirectPrerequisites, getFullPrerequisiteChain } = require('../services/graphService');

// GET /skills
router.get('/', async (req, res) => {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch skills.' });
  }
});

// GET /skills/:id/prerequisites (Direct one-level only)
router.get('/:id/prerequisites', async (req, res) => {
  try {
    const skill = await prisma.skill.findUnique({ where: { id: req.params.id } });
    if (!skill) return res.status(404).json({ error: 'Skill not found.' });

    const directPrereqs = await getDirectPrerequisites(req.params.id);
    res.json({
      skill,
      prerequisites: directPrereqs
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch prerequisites.' });
  }
});

// GET /skills/:id/chain (Full recursive prerequisite chain)
router.get('/:id/chain', async (req, res) => {
  try {
    const skill = await prisma.skill.findUnique({ where: { id: req.params.id } });
    if (!skill) return res.status(404).json({ error: 'Skill not found.' });

    const chain = await getFullPrerequisiteChain(req.params.id, true);
    res.json({
      skill,
      chain
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch prerequisite chain.' });
  }
});

module.exports = router;
