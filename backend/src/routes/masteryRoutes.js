const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticateToken } = require('../middleware/auth');
const { recalculateAllUserMasteries } = require('../services/masteryService');

// GET /mastery
router.get('/', authenticateToken, async (req, res) => {
  try {
    const masteries = await prisma.skillMastery.findMany({
      where: { userId: req.user.id },
      include: {
        skill: { select: { id: true, name: true, domain: true } }
      }
    });

    const formatted = masteries.map(m => ({
      userId: m.userId,
      skillId: m.skillId,
      skillName: m.skill.name,
      domain: m.skill.domain,
      masteryScore: m.masteryScore,
      evidenceCount: m.evidenceCount,
      lastUpdated: m.lastUpdated
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve skill masteries.' });
  }
});

// POST /mastery/recalculate
router.post('/recalculate', authenticateToken, async (req, res) => {
  try {
    const result = await recalculateAllUserMasteries(req.user.id);
    res.json(result);
  } catch (err) {
    console.error('Mastery recalculation error:', err);
    res.status(500).json({ error: 'Failed to recalculate mastery.' });
  }
});

module.exports = router;
