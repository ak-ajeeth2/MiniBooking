const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
require('dotenv').config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES = '7d';

// register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
    const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (exists) return res.status(400).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const info = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)').run(name, email, hashed);
    const userId = info.lastInsertRowid;
    const token = jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.json({ token, user: { id: userId, name, email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
    const user = db.prepare('SELECT id, name, email, password FROM users WHERE email = ?').get(email);
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
