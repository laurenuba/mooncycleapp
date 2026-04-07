const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'mooncycle.db'));

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS cycle_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    start_date TEXT NOT NULL,
    cycle_length INTEGER DEFAULT 28,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS daily_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL UNIQUE,
    period INTEGER DEFAULT 0,
    spotting INTEGER DEFAULT 0,
    intimacy INTEGER DEFAULT 0,
    symptoms TEXT DEFAULT '[]',
    energy_level INTEGER DEFAULT 3,
    notes TEXT DEFAULT '',
    cycle_day INTEGER,
    phase TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS patterns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cycle_day INTEGER,
    phase TEXT,
    symptom TEXT,
    occurrences INTEGER DEFAULT 0,
    insight_text TEXT,
    last_analyzed TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE UNIQUE INDEX IF NOT EXISTS idx_patterns_unique
    ON patterns(cycle_day, symptom);
`);

module.exports = db;
