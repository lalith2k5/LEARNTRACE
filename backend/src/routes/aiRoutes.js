const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticateToken } = require('../middleware/auth');
const { getAiExplanation } = require('../services/ollamaService');

// POST /ai/explain
router.post('/explain', authenticateToken, async (req, res) => {
  try {
    const { questionId } = req.body;
    if (!questionId) {
      return res.status(400).json({ error: 'questionId is required.' });
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: { skill: true }
    });

    if (!question) {
      return res.status(404).json({ error: 'Question not found.' });
    }

    // Find correct answer text
    let correctText = question.correctAnswer;
    if (Array.isArray(question.options)) {
      const match = question.options.find(o => o.id === question.correctAnswer);
      if (match) correctText = match.text;
    }

    const explanationResult = await getAiExplanation(
      question.text,
      question.skill.name,
      correctText,
      question.explanation
    );

    res.json(explanationResult);
  } catch (err) {
    console.error('AI explanation route error:', err);
    res.json({
      source: 'fallback',
      available: false,
      explanation: 'AI explanation is currently unavailable. Please review the core concept in the skill curriculum.'
    });
  }
});

module.exports = router;
