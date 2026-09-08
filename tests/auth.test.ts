import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app, JWT_SECRET } from '../server.ts';
import { store } from '../server/store.js';
import { resetTestStore } from './setup.js';

describe('Authentication & Authorization Tests', () => {
  beforeEach(async () => {
    await resetTestStore();
  });

  describe('1. User Registration', () => {
    it('successfully registers a new learner with valid email and password', async () => {
      const email = `learner_${Date.now()}@learntrace.ai`;
      const password = 'securePassword123';

      const res = await request(app)
        .post('/api/auth/register')
        .send({ email, password });

      expect(res.status).toBe(201);
      expect(res.body.token).toBeDefined();
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe(email.toLowerCase());
      expect(res.body.user.id).toBeDefined();
    });

    it('rejects registration with duplicate email (HTTP 409)', async () => {
      const email = 'duplicate@learntrace.ai';
      const password = 'validPassword123';

      // First registration
      const firstRes = await request(app)
        .post('/api/auth/register')
        .send({ email, password });
      expect(firstRes.status).toBe(201);

      // Duplicate registration attempt
      const secondRes = await request(app)
        .post('/api/auth/register')
        .send({ email, password });

      expect(secondRes.status).toBe(409);
      expect(secondRes.body.code).toBe('USER_EXISTS');
    });

    it('validates email format and rejects malformed addresses', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'invalid-email-address', password: 'validPassword123' });

      expect(res.status).toBe(400);
      expect(res.body.code).toBe('INVALID_EMAIL');
    });

    it('rejects passwords shorter than 6 characters', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'valid@learntrace.ai', password: '123' });

      expect(res.status).toBe(400);
      expect(res.body.code).toBe('WEAK_PASSWORD');
    });
  });

  describe('2. User Login', () => {
    const testEmail = 'logintest@learntrace.ai';
    const testPassword = 'mySecretPassword99';

    beforeEach(async () => {
      await request(app)
        .post('/api/auth/register')
        .send({ email: testEmail, password: testPassword });
    });

    it('successfully authenticates with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testEmail, password: testPassword });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe(testEmail);
    });

    it('rejects login with incorrect password (HTTP 401)', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testEmail, password: 'wrongPassword!' });

      expect(res.status).toBe(401);
      expect(res.body.code).toBe('INCORRECT_PASSWORD');
    });

    it('rejects login for non-existent user account (HTTP 404)', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nobody@learntrace.ai', password: 'password123' });

      expect(res.status).toBe(404);
      expect(res.body.code).toBe('USER_NOT_FOUND');
    });

    it('rejects login with missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testEmail });

      expect(res.status).toBe(400);
      expect(res.body.code).toBe('MISSING_FIELDS');
    });
  });

  describe('3. Protected Routes & Token Verification', () => {
    let validToken: string;

    beforeEach(async () => {
      const reg = await request(app)
        .post('/api/auth/register')
        .send({ email: `protected_${Date.now()}@learntrace.ai`, password: 'password123' });
      validToken = reg.body.token;
    });

    it('allows access to protected routes with valid Bearer token', async () => {
      const res = await request(app)
        .post('/api/user-goals')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ goalId: 'goal_mle' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('userGoal');
    });

    it('rejects corrupted or forged token signatures (HTTP 401)', async () => {
      const forgedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.badSignatureFakeToken';

      const res = await request(app)
        .post('/api/user-goals')
        .set('Authorization', `Bearer ${forgedToken}`)
        .send({ goalId: 'goal_mle' });

      expect(res.status).toBe(401);
      expect(res.body.code).toBe('INVALID_TOKEN');
    });

    it('rejects expired tokens (HTTP 401)', async () => {
      const expiredToken = jwt.sign(
        { id: 'user_expired', email: 'expired@learntrace.ai' },
        JWT_SECRET,
        { expiresIn: '-1s' }
      );

      const res = await request(app)
        .post('/api/user-goals')
        .set('Authorization', `Bearer ${expiredToken}`)
        .send({ goalId: 'goal_mle' });

      expect(res.status).toBe(401);
      expect(res.body.code).toBe('TOKEN_EXPIRED');
    });

    it('enforces authentication requirement when demo auth is disabled and token is missing', async () => {
      const originalFlag = process.env.ALLOW_DEMO_AUTH;
      process.env.ALLOW_DEMO_AUTH = 'false';

      try {
        const res = await request(app)
          .post('/api/user-goals')
          .send({ goalId: 'goal_mle' });

        expect(res.status).toBe(401);
        expect(res.body.code).toBe('AUTH_TOKEN_MISSING');
      } finally {
        process.env.ALLOW_DEMO_AUTH = originalFlag;
      }
    });
  });
});
