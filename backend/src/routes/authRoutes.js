const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticateToken } = require('../middleware/auth');

// POST /auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return res.status(400).json({ 
        error: 'Please enter a valid email address (e.g. name@example.com).',
        code: 'INVALID_EMAIL' 
      });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters long.',
        code: 'WEAK_PASSWORD' 
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail }
    });
    if (existingUser) {
      return res.status(409).json({ 
        error: 'An account with this email address already exists. Please sign in instead.',
        code: 'USER_EXISTS' 
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email: cleanEmail,
        passwordHash
      }
    });

    const jwtSecret = process.env.JWT_SECRET || 'secret';
    const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User successfully registered.',
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Error creating user account.' });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required.',
        code: 'MISSING_FIELDS' 
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail }
    });
    if (!user) {
      return res.status(404).json({ 
        error: "Don't have an account? No user is registered with this email. Please register first.",
        code: 'USER_NOT_FOUND' 
      });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ 
        error: 'Incorrect password. Please verify your password and try again.',
        code: 'INCORRECT_PASSWORD' 
      });
    }

    const jwtSecret = process.env.JWT_SECRET || 'secret';
    const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: '7d' });

    res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Authentication failed.' });
  }
});

// GET /auth/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, createdAt: true }
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching user profile.' });
  }
});

module.exports = router;
