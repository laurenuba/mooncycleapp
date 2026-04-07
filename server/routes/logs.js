const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const { start, end } = req.query;
  let rows;
  if (start && end) {
    rows = db.prepare('SELECT * FROM daily_logs WHERE date >= ? AND date <= ? ORDER BY date').all(start, end);
  } else {
    rows = db.prepare('SELECT * FROM daily_logs ORDER BY date DESC').all();
  }
  const parsed = rows.map(r => ({ ...r, symptoms: JSON.parse(r.symptoms || '[]') }));
  res.json(parsed);
});

router.get('/:date', (req, res) => {
  const row = db.prepare('SELECT * FROM daily_logs WHERE date = ?').get(req.params.date);
  if (row) {
    row.symptoms = JSON.parse(row.symptoms || '[]');
  }
  res.json(row || null);
});

router.post('/:date', (req, res) => {
  const { period, spotting, intimacy, symptoms, energy_level, notes, cycle_day, phase } = req.body;
  db.prepare(`
    INSERT INTO daily_logs (date, period, spotting, intimacy, symptoms, energy_level, notes, cycle_day, phase, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(date) DO UPDATE SET
      period = excluded.period,
      spotting = excluded.spotting,
      intimacy = excluded.intimacy,
      symptoms = excluded.symptoms,
      energy_level = excluded.energy_level,
      notes = excluded.notes,
      cycle_day = excluded.cycle_day,
      phase = excluded.phase,
      updated_at = CURRENT_TIMESTAMP
  `).run(
    req.params.date,
    period ? 1 : 0,
    spotting ? 1 : 0,
    intimacy ? 1 : 0,
    JSON.stringify(symptoms || []),
    energy_level || 3,
    notes || '',
    cycle_day || null,
    phase || null
  );
  res.json({ success: true });
});

module.exports = router;
