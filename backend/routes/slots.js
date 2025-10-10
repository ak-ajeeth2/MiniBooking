const express = require('express');
const db = require('../db');
const router = express.Router();

// returns all slots with seat info
router.get('/', (req, res) => {
  try {
    const slots = db.prepare('SELECT * FROM slots ORDER BY date, starts_at').all();
    const payload = slots.map(s => {
      const bookings = db.prepare('SELECT seat FROM bookings WHERE slot_id = ?').all(s.id);
      const takenSeats = bookings.map(b => b.seat);
      // create seat map info
      const rows = s.rows || 6;
      const cols = s.cols || 8;
      return {
        id: s.id,
        name: s.name,
        date: s.date,
        startsAt: s.starts_at,
        endsAt: s.ends_at,
        rows,
        cols,
        takenSeats,
        availableSeats: rows * cols - takenSeats.length
      };
    });
    res.json(payload);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// get single slot detail
router.get('/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const s = db.prepare('SELECT * FROM slots WHERE id = ?').get(id);
    if (!s) return res.status(404).json({ error: 'Slot not found' });
    const bookings = db.prepare('SELECT seat FROM bookings WHERE slot_id = ?').all(id);
    const takenSeats = bookings.map(b => b.seat);
    res.json({
      id: s.id,
      name: s.name,
      date: s.date,
      startsAt: s.starts_at,
      endsAt: s.ends_at,
      rows: s.rows,
      cols: s.cols,
      takenSeats
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
