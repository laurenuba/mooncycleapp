require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');

const settingsRoutes = require('./routes/settings');
const logsRoutes = require('./routes/logs');
const eventsRoutes = require('./routes/events');
const insightsRoutes = require('./routes/insights');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json());

app.use('/api/settings', settingsRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/insights', insightsRoutes);

app.listen(PORT, () => {
  console.log(`🌙 Moon Cycle API running on http://localhost:${PORT}`);
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log('⚠  No ANTHROPIC_API_KEY set — AI insights will use fallback messages');
  }
});
