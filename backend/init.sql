CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS slots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  date TEXT NOT NULL,
  starts_at TEXT,
  ends_at TEXT,
  rows INTEGER DEFAULT 6,
  cols INTEGER DEFAULT 8,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  slot_id INTEGER NOT NULL,
  seat TEXT NOT NULL, -- single seat like A1
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(slot_id) REFERENCES slots(id)
);

-- seed some slots
INSERT INTO slots (name, date, starts_at, ends_at, rows, cols)
VALUES
  ('Morning Show', date('now', '+1 day'), '09:00', '11:00', 6, 8),
  ('Afternoon Show', date('now', '+1 day'), '13:00', '15:00', 6, 8),
  ('Evening Show', date('now', '+1 day'), '18:00', '20:00', 6, 10);
