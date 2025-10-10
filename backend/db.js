const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const DB_FILE = process.env.DB_FILE || path.join(__dirname, 'booking.db');
const INIT_SQL = path.join(__dirname, 'init.sql');

const firstTime = !fs.existsSync(DB_FILE);
const db = new Database(DB_FILE);

if (firstTime) {
  const sql = fs.readFileSync(INIT_SQL, 'utf8');
  db.exec(sql);
  console.log('Database initialized:', DB_FILE);
}

module.exports = db;
