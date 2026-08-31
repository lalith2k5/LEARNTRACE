const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticateToken } = require('../middleware/auth');

// GET /goals
router.get('/', async (req, res) => {
  try {
    const goals = await prisma.learningGoal.findMany({
      include: { targetSkill: true }
    });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch learning goals.' });
  }
});

// POST /user-goals (or /goals/user)
router.post('/user-goals', authenticateToken, async (req, res) => {
  try {
    const { goalId } = req.body;
    if (!goalId) return res.status(400).json({ error: 'goalId is required.' });

    const goal = await prisma.learningGoal.findUnique({ where: { id: goalId } });
    if (!goal) return res.status(404).json({ error: 'Goal not found.' });

    const userGoal = await prisma.userGoal.upsert({
      where: {
        userId_goalId: {
          userId: req.user.id,
          goalId: goal.id
        }
      },
      update: { selectedAt: new Date() },
      create: {
        userId: req.user.id,
        goalId: goal.id,
        selectedAt: new Date()
      },
      include: { goal: { include: { targetSkill: true } } }
    });

    res.json({
      message: `Selected learning goal "${goal.name}".`,
      userGoal
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user goal.' });
  }
});

module.exports = router;
