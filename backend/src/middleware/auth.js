const jwt = require('jsonwebtoken');

/**
 * Reusable JWT Authentication Middleware
 * Enforces Authorization: Bearer <token> header validation
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({
      error: 'Authentication token required. Format must be: Authorization: Bearer <token>',
    });
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error('CRITICAL: JWT_SECRET environment variable is missing.');
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded; // { id: string, email: string }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Authentication token has expired. Please log in again.' });
    }
    return res.status(401).json({ error: 'Invalid or malformed authentication token.' });
  }
}

module.exports = { authenticateToken };
