const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const slotsRoutes = require('./routes/slots');
const bookingsRoutes = require('./routes/bookings');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// prefix api
app.use('/auth', authRoutes);
app.use('/slots', slotsRoutes);
app.use('/bookings', bookingsRoutes);

// simple health
app.get('/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
app.use(cors({
  origin: "http://localhost:3000", // frontend URL
  credentials: true,
}));
