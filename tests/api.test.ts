import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../server.ts';
import { resetTestStore } from './setup.js';

describe('API Endpoints - Integration & Contract Verification', () => {
  let authToken: string;
  let userId: string;

  beforeEach(async () => {
    await resetTestStore();
    const regRes = await request(app)
      .post('/api/auth/register')
      .send({ email: `api_tester_${Date.now()}@learntrace.ai`, password: 'password123' });
    authToken = regRes.body.token;
    userId = regRes.body.user.id;
  });

  describe('1. Health and Status Endpoints', () => {
    it('GET /api/health returns status ok and database connectivity metrics', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.service).toBe('LearnTrace API');
      expect(res.body.database).toBeDefined();
    });

    it('GET /api/database/status returns system database status structure', async () => {
      const res = await request(app).get('/api/database/status');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('database');
      expect(res.body).toHaveProperty('storageEngine');
      expect(res.body).toHaveProperty('connectionStatus');
    });
  });

  describe('2. Skills & Knowledge Graph Endpoints', () => {
    it('GET /api/skills returns all 8 curriculum skills with domain and description', async () => {
      const res = await request(app).get('/api/skills');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(8);

      const firstSkill = res.body[0];
      expect(firstSkill).toHaveProperty('id');
      expect(firstSkill).toHaveProperty('name');
      expect(firstSkill).toHaveProperty('domain');
      expect(firstSkill).toHaveProperty('description');
    });

    it('GET /api/skills/graph returns visual payload with nodes, edges, and mastery indicators', async () => {
      const res = await request(app)
        .get('/api/skills/graph')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('nodes');
      expect(res.body).toHaveProperty('edges');
      expect(res.body.nodes.length).toBe(8);
      expect(res.body.edges.length).toBeGreaterThan(0);
    });

    it('GET /api/goals returns list of available learning goals', async () => {
      const res = await request(app).get('/api/goals');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(3);
    });

    it('GET /api/resources returns curated educational learning resources', async () => {
      const res = await request(app)
        .get('/api/resources')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('3. Assessment Question Serving', () => {
    it('GET /api/questions returns assessment questions with options and cognitive metadata', async () => {
      const res = await request(app).get('/api/questions');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);

      const q = res.body[0];
      expect(q).toHaveProperty('id');
      expect(q).toHaveProperty('text');
      expect(q).toHaveProperty('options');
      expect(Array.isArray(q.options)).toBe(true);
      expect(q.options.length).toBeGreaterThanOrEqual(2);
    });

    it('GET /api/questions?skill_id=skill_python filters items strictly by skill', async () => {
      const res = await request(app).get('/api/questions?skill_id=skill_python');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      for (const q of res.body) {
        expect(q.skillId).toBe('skill_python');
      }
    });
  });

  describe('4. Attempt Submission & Evaluation', () => {
    it('POST /api/attempts records attempt and returns updated mastery calculation', async () => {
      const payload = {
        questionId: 'q_py_01',
        answer: 'opt_a',
        confidence: 4,
        timeTakenSeconds: 18,
      };

      const res = await request(app)
        .post('/api/attempts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('attempt');
      expect(res.body).toHaveProperty('updatedMastery');
      expect(res.body.attempt.questionId).toBe('q_py_01');
      expect(res.body.attempt.userId).toBe(userId);
    });

    it('POST /api/attempts rejects invalid request with missing questionId (HTTP 400)', async () => {
      const invalidPayload = {
        answer: 'opt_a',
        confidence: 4,
        timeTakenSeconds: 10,
      };

      const res = await request(app)
        .post('/api/attempts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidPayload);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('5. Goal Management, Recommendations & Learning Paths', () => {
    it('POST /api/user-goals updates the learner target goal', async () => {
      const res = await request(app)
        .post('/api/user-goals')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ goalId: 'goal_ds' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('userGoal');
      expect(res.body.userGoal.goalId).toBe('goal_ds');
    });

    it('POST /api/user-goals rejects non-existent goal ID with HTTP 404', async () => {
      const res = await request(app)
        .post('/api/user-goals')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ goalId: 'goal_unknown_invalid' });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });

    it('GET /api/recommendations returns high-leverage recommendation and analysis', async () => {
      const res = await request(app)
        .get('/api/recommendations')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('analysis');
      expect(Array.isArray(res.body.analysis)).toBe(true);
    });

    it('GET /api/learning-path returns ordered curriculum steps towards target goal', async () => {
      const res = await request(app)
        .get('/api/learning-path')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty('order');
      expect(res.body[0]).toHaveProperty('skillId');
      expect(res.body[0]).toHaveProperty('status');
    });
  });

  describe('6. Research Model Evaluation Laboratory', () => {
    it('GET /api/research/bkt-compare returns comparative evaluation for all skills', async () => {
      const res = await request(app)
        .get('/api/research/bkt-compare')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('skills');
      expect(Array.isArray(res.body.skills)).toBe(true);
      expect(res.body.skills.length).toBe(8);
      const first = res.body.skills[0];
      expect(first).toHaveProperty('skillId');
      expect(first).toHaveProperty('learnTraceScore');
      expect(first).toHaveProperty('bktScore');
      expect(first).toHaveProperty('dktScore');
    });

    it('POST /api/research/evaluate-dataset evaluates interactions on benchmark data', async () => {
      const records = [
        { studentId: 'stu_1', skillId: 'skill_prob', correct: 1, confidence: 4 },
        { studentId: 'stu_1', skillId: 'skill_prob', correct: 1, confidence: 5 },
        { studentId: 'stu_2', skillId: 'skill_prob', correct: 0, confidence: 2 },
      ];

      const res = await request(app)
        .post('/api/research/evaluate-dataset')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ datasetName: 'Test Benchmark', records });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('metrics');
      expect(res.body).toHaveProperty('datasetName');
      expect(res.body.metrics).toHaveProperty('bkt');
      expect(res.body.metrics).toHaveProperty('learnTrace');
    });
  });
});
