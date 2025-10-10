const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Log file path
const logFile = path.join(__dirname, '../booking.log');

// Utility: write log entry safely
function writeLog(message) {
  const logLine = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFileSync(logFile, logLine, 'utf8');
}

// ======================================================
// 📘 CREATE BOOKING
// ======================================================
router.post('/', auth, (req, res) => {
  try {
    const user = req.user;
    const { slotId, seats, customerName, customerEmail } = req.body || {};

    if (!slotId || !Array.isArray(seats) || seats.length === 0 || !customerName || !customerEmail) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const slot = db.prepare('SELECT * FROM slots WHERE id = ?').get(slotId);
    if (!slot) return res.status(404).json({ error: 'Slot not found' });

    const insertBooking = db.prepare(
      'INSERT INTO bookings (user_id, slot_id, seat, customer_name, customer_email) VALUES (?, ?, ?, ?, ?)'
    );
    const selectSeat = db.prepare('SELECT id FROM bookings WHERE slot_id = ? AND seat = ?');

    const tx = db.transaction((seatsArr) => {
      for (const seat of seatsArr) {
        if (!/^[A-Z]\d+$/.test(seat)) {
          throw new Error(`Invalid seat format: ${seat}`);
        }
        const conflict = selectSeat.get(slotId, seat);
        if (conflict) {
          throw new Error(`Seat ${seat} already booked`);
        }
        insertBooking.run(user.id, slotId, seat, customerName, customerEmail);
      }
    });

    try {
      tx(seats);
      writeLog(`BOOKED by ${user.email} - SlotID: ${slotId}, Seats: ${seats.join(', ')}`);
      res.status(201).json({ success: true, seatsBooked: seats });
    } catch (err) {
      return res.status(409).json({ error: err.message || 'Seat conflict' });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ======================================================
// 📗 LIST USER BOOKINGS
// ======================================================
router.get('/mine', auth, (req, res) => {
  try {
    const user = req.user;
    const rows = db
      .prepare(
        `SELECT b.id, b.slot_id, s.name as slot_name, s.date, b.seat, b.customer_name, b.customer_email, b.created_at
         FROM bookings b
         JOIN slots s ON s.id = b.slot_id
         WHERE b.user_id = ?
         ORDER BY b.created_at DESC`
      )
      .all(user.id);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ======================================================
// 📕 DELETE (CANCEL) BOOKING
// ======================================================
router.delete('/:id', auth, (req, res) => {
  try {
    const user = req.user;
    const bookingId = req.params.id;

    // Fetch booking
    const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Ensure current user owns it
    if (booking.user_id !== user.id) {
      return res.status(403).json({ error: 'Unauthorized to delete this booking' });
    }

    // Delete booking
    const del = db.prepare('DELETE FROM bookings WHERE id = ?');
    del.run(bookingId);

    // Log deletion
    writeLog(
      `CANCELLED by ${user.email} - SlotID: ${booking.slot_id}, Seat: ${booking.seat}, Customer: ${booking.customer_name}`
    );

    res.json({ success: true, message: 'Booking cancelled successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
