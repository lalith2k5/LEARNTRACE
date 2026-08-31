const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticateToken } = require('../middleware/auth');
const { calculateSkillMasteryForUser } = require('../services/masteryService');

// POST /attempts (Grades strictly on the backend)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { questionId, answer, timeTakenSeconds, confidence, attemptNumber } = req.body;

    if (!questionId) return res.status(400).json({ error: 'questionId is required.' });
    if (answer === undefined || answer === null || String(answer).trim() === '') {
      return res.status(400).json({ error: 'Answer is required.' });
    }

    const conf = parseInt(confidence, 10);
    if (isNaN(conf) || conf < 1 || conf > 5) {
      return res.status(400).json({ error: 'Confidence must be an integer between 1 and 5.' });
    }

    const timeTaken = parseInt(timeTakenSeconds, 10);
    if (isNaN(timeTaken) || timeTaken < 0) {
      return res.status(400).json({ error: 'timeTakenSeconds must be a non-negative integer.' });
    }

    const question = await prisma.question.findUnique({ where: { id: questionId } });
    if (!question) return res.status(404).json({ error: 'Question not found.' });

    // Backend grading evaluation
    const isCorrect = String(answer).trim() === String(question.correctAnswer).trim();

    // Determine current attempt number if not specified
    const prevAttemptsCount = await prisma.attempt.count({
      where: { userId: req.user.id, questionId }
    });
    const currentAttemptNum = attemptNumber ? parseInt(attemptNumber, 10) : prevAttemptsCount + 1;

    // Create raw Attempt evidence record
    const attempt = await prisma.attempt.create({
      data: {
        userId: req.user.id,
        questionId: question.id,
        correct: isCorrect,
        timeTakenSeconds: timeTaken,
        confidence: conf,
        attemptNumber: currentAttemptNum
      }
    });

    // Automatically recalculate mastery
    const updatedMastery = await calculateSkillMasteryForUser(req.user.id, question.skillId);

    // Return grading result and educational explanation
    res.status(201).json({
      success: true,
      correct: isCorrect,
      attempt,
      updatedMastery,
      explanation: question.explanation
    });
  } catch (err) {
    console.error('Attempt submission error:', err);
    res.status(500).json({ error: 'Failed to record attempt.' });
  }
});

module.exports = router;
