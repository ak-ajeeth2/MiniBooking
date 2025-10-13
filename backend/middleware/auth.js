const jwt = require('jsonwebtoken');
require('dotenv').config();
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Missing authorization header' });
  const parts = header.split(' ');
  if (parts.length !== 2) return res.status(401).json({ error: 'Invalid authorization header' });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // verify user exists
    const user = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(payload.id);
    if (!user) return res.status(401).json({ error: 'Invalid token (user not found)' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = authMiddleware;