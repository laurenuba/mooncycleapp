const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const { month } = req.query;
  let events;
  if (month) {
    events = db.prepare("SELECT * FROM events WHERE date LIKE ? ORDER BY date").all(`${month}%`);
  } else {
    events = db.prepare("SELECT * FROM events ORDER BY date").all();
  }
  res.json(events);
});

router.post('/', (req, res) => {
  const { date, title, category } = req.body;
  if (!date || !title) return res.status(400).json({ error: 'date and title required' });
  const result = db.prepare('INSERT INTO events (date, title, category) VALUES (?, ?, ?)').run(date, title, category || 'general');
  res.json({ id: result.lastInsertRowid, date, title, category: category || 'general' });
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM events WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
