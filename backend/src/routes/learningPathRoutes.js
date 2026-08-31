const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { generateLearningPath } = require('../services/learningPathService');

// GET /learning-path?goal_id=...
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { goal_id } = req.query;
    const learningPath = await generateLearningPath(req.user.id, goal_id);
    res.json(learningPath);
  } catch (err) {
    console.error('Learning path generation error:', err);
    res.status(500).json({ error: 'Failed to generate learning path.' });
  }
});

module.exports = router;
