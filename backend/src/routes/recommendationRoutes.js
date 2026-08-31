const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticateToken } = require('../middleware/auth');
const { getPrioritizedRecommendation } = require('../services/recommendationService');
const { getFullPrerequisiteChain, getDirectPrerequisites } = require('../services/graphService');

// GET /recommendations?goal_id=...
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { goal_id } = req.query;
    const result = await getPrioritizedRecommendation(req.user.id, goal_id);
    res.json(result);
  } catch (err) {
    console.error('Recommendation generation error:', err);
    res.status(500).json({ error: 'Failed to generate recommendation.' });
  }
});

// GET /skill-gaps?goal_id=...
router.get('/gaps', authenticateToken, async (req, res) => {
  try {
    const { goal_id } = req.query;
    let targetGoal = null;
    if (goal_id) {
      targetGoal = await prisma.learningGoal.findUnique({ where: { id: goal_id } });
    }
    if (!targetGoal) {
      const userGoal = await prisma.userGoal.findFirst({
        where: { userId: req.user.id },
        include: { goal: true }
      });
      if (userGoal && userGoal.goal) targetGoal = userGoal.goal;
    }
    if (!targetGoal) targetGoal = await prisma.learningGoal.findFirst();

    if (!targetGoal) return res.json({ skillGaps: [] });

    const fullChain = await getFullPrerequisiteChain(targetGoal.targetSkillId, true);
    const relevantSkillIds = fullChain.map(s => s.id);

    const masteries = await prisma.skillMastery.findMany({
      where: {
        userId: req.user.id,
        skillId: { in: relevantSkillIds }
      }
    });

    const masteryMap = new Map();
    masteries.forEach(m => masteryMap.set(m.skillId, m.masteryScore));

    const gaps = [];
    for (const skill of fullChain) {
      const score = masteryMap.get(skill.id) ?? 0.0;
      if (score < 0.6) {
        const directPrereqs = await getDirectPrerequisites(skill.id);
        const isReady = directPrereqs.every(p => (masteryMap.get(p.id) ?? 0.0) >= 0.6);

        gaps.push({
          skillId: skill.id,
          skillName: skill.name,
          domain: skill.domain,
          masteryScore: score,
          isReady
        });
      }
    }

    res.json({
      goalId: targetGoal.id,
      goalName: targetGoal.name,
      skillGaps: gaps
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch skill gaps.' });
  }
});

module.exports = router;
