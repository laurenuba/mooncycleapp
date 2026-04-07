const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const settings = db.prepare('SELECT * FROM cycle_settings WHERE id = 1').get();
  res.json(settings || { start_date: null, cycle_length: 28 });
});

router.post('/', (req, res) => {
  const { start_date, cycle_length } = req.body;
  if (!start_date) return res.status(400).json({ error: 'start_date required' });
  db.prepare(`
    INSERT INTO cycle_settings (id, start_date, cycle_length, updated_at)
    VALUES (1, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(id) DO UPDATE SET
      start_date = excluded.start_date,
      cycle_length = excluded.cycle_length,
      updated_at = CURRENT_TIMESTAMP
  `).run(start_date, cycle_length || 28);
  res.json({ success: true });
});

module.exports = router;
