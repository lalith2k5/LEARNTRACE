const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const { authenticateToken } = require('./middleware/auth');
const authRoutes = require('./routes/authRoutes');
const skillRoutes = require('./routes/skillRoutes');
const goalRoutes = require('./routes/goalRoutes');
const questionRoutes = require('./routes/questionRoutes');
const attemptRoutes = require('./routes/attemptRoutes');
const masteryRoutes = require('./routes/masteryRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const learningPathRoutes = require('./routes/learningPathRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'LearnTrace Backend' });
});

// RESTful Route Mounting
app.use('/auth', authRoutes);
app.use('/skills', skillRoutes);
app.use('/goals', goalRoutes);
app.use('/questions', questionRoutes);
app.use('/attempts', attemptRoutes);
app.use('/mastery', masteryRoutes);
app.use('/skill-gaps', recommendationRoutes);
app.use('/recommendations', recommendationRoutes);
app.use('/learning-path', learningPathRoutes);
app.use('/ai', aiRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal server error occurred.' });
});

module.exports = app;
