const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /questions (Security: omits correctAnswer)
router.get('/', async (req, res) => {
  try {
    const { skill_id } = req.query;
    const where = {};
    if (skill_id) {
      where.skillId = skill_id;
    }

    const questions = await prisma.question.findMany({
      where,
      select: {
        id: true,
        skillId: true,
        text: true,
        difficulty: true,
        questionType: true,
        options: true,
        skill: {
          select: { name: true, domain: true }
        }
      }
    });

    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve questions.' });
  }
});

module.exports = router;
