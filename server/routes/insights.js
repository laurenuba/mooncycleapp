const express = require('express');
const router = express.Router();
const db = require('../db');

let Anthropic;
try {
  Anthropic = require('@anthropic-ai/sdk');
} catch (e) {
  Anthropic = null;
}

router.get('/patterns', (req, res) => {
  const patterns = db.prepare('SELECT * FROM patterns ORDER BY cycle_day').all();
  res.json(patterns);
});

router.get('/patterns/:cycleDay', (req, res) => {
  const patterns = db.prepare('SELECT * FROM patterns WHERE cycle_day = ?').all(parseInt(req.params.cycleDay));
  res.json(patterns);
});

router.post('/analyze', async (req, res) => {
  try {
    const settings = db.prepare('SELECT * FROM cycle_settings WHERE id = 1').get();
    if (!settings) {
      return res.json({ success: false, message: 'Please configure your cycle settings first.' });
    }

    const logs = db.prepare('SELECT * FROM daily_logs WHERE cycle_day IS NOT NULL ORDER BY date').all();
    if (logs.length < 30) {
      return res.json({
        success: false,
        message: `Keep logging! You have ${logs.length} logged days. Patterns emerge after ~30 days.`
      });
    }

    // Group by cycle day and tally symptoms
    const byDay = {};
    logs.forEach(log => {
      const day = log.cycle_day;
      if (!byDay[day]) byDay[day] = { count: 0, symptoms: {}, energy: [], period: 0, phase: log.phase };
      byDay[day].count++;
      const symptoms = JSON.parse(log.symptoms || '[]');
      symptoms.forEach(s => { byDay[day].symptoms[s] = (byDay[day].symptoms[s] || 0) + 1; });
      if (log.energy_level) byDay[day].energy.push(log.energy_level);
      if (log.period) byDay[day].period++;
    });

    // Detect patterns: symptom on same cycle day 3+ times
    const detected = [];
    for (const [day, data] of Object.entries(byDay)) {
      const d = parseInt(day);
      for (const [symptom, count] of Object.entries(data.symptoms)) {
        if (count >= 3) {
          detected.push({ cycleDay: d, phase: data.phase, symptom, occurrences: count });
        }
      }
      if (data.energy.length >= 3) {
        const avg = data.energy.reduce((a, b) => a + b, 0) / data.energy.length;
        if (avg <= 2) detected.push({ cycleDay: d, phase: data.phase, symptom: 'low_energy_pattern', occurrences: data.energy.length });
        else if (avg >= 4) detected.push({ cycleDay: d, phase: data.phase, symptom: 'high_energy_pattern', occurrences: data.energy.length });
      }
    }

    if (detected.length === 0) {
      return res.json({ success: true, message: 'No strong patterns yet — keep logging consistently!', patterns: [] });
    }

    // Generate AI insights
    let aiInsights = {};
    if (process.env.ANTHROPIC_API_KEY && Anthropic) {
      try {
        const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
        const patternText = detected.map(p =>
          `Cycle day ${p.cycleDay} (${p.phase} phase): ${p.symptom} occurred ${p.occurrences} times`
        ).join('\n');

        const response = await client.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          messages: [{
            role: 'user',
            content: `You are a compassionate menstrual health coach. A woman has been tracking her cycle and the following patterns have emerged in her logs. Write a warm, personalized, 1-2 sentence insight for each pattern that will appear on her daily planner to help her schedule and care for herself.

Patterns:
${patternText}

Respond with JSON only in this exact format (no markdown, no explanation):
{
  "day_X_symptom": "Your insight here."
}
Where X is the cycle day number and symptom is the symptom name (use underscores for spaces). Be warm, practical, and empowering.`
          }]
        });

        const text = response.content[0].text.trim();
        const jsonStr = text.startsWith('{') ? text : text.match(/\{[\s\S]*\}/)?.[0];
        if (jsonStr) aiInsights = JSON.parse(jsonStr);
      } catch (e) {
        console.error('Anthropic error:', e.message);
      }
    }

    // Upsert patterns
    const upsert = db.prepare(`
      INSERT INTO patterns (cycle_day, phase, symptom, occurrences, insight_text, last_analyzed)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(cycle_day, symptom) DO UPDATE SET
        phase = excluded.phase,
        occurrences = excluded.occurrences,
        insight_text = excluded.insight_text,
        last_analyzed = CURRENT_TIMESTAMP
    `);

    for (const p of detected) {
      const key = `day_${p.cycleDay}_${p.symptom.replace(/ /g, '_')}`;
      const insight = aiInsights[key] || defaultInsight(p);
      upsert.run(p.cycleDay, p.phase, p.symptom, p.occurrences, insight);
    }

    const all = db.prepare('SELECT * FROM patterns ORDER BY cycle_day').all();
    res.json({ success: true, patterns: all, message: `Found ${detected.length} patterns across your cycle.` });
  } catch (err) {
    console.error('Analyze error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

function defaultInsight({ cycleDay, symptom, occurrences }) {
  const map = {
    cramps: `You often experience cramps on day ${cycleDay} — a heating pad, gentle yoga, and ginger tea can help ease discomfort.`,
    fatigue: `Fatigue tends to show up for you on day ${cycleDay}. Consider scheduling lighter tasks and prioritizing rest today.`,
    headache: `Headaches have appeared on day ${cycleDay} before. Stay well-hydrated and reduce screen time if possible.`,
    bloating: `Bloating often arrives on day ${cycleDay}. Warm herbal teas and avoiding salty foods may help you feel more comfortable.`,
    'mood swings': `Emotional sensitivity peaks for you around day ${cycleDay}. Extra self-compassion and grounding rituals go a long way.`,
    'low energy': `Your energy tends to dip on day ${cycleDay}. This is a great day for gentle tasks and restorative activities.`,
    'high energy': `Day ${cycleDay} is typically a high-energy day for you — perfect for ambitious plans and creative work!`,
    acne: `Skin tends to be more reactive on day ${cycleDay}. Anti-inflammatory foods and a gentle skincare routine can help.`,
    'back pain': `Back tension often appears on day ${cycleDay}. Gentle stretching, a warm bath, and magnesium may provide relief.`,
    'breast tenderness': `Breast tenderness tends to peak for you around day ${cycleDay}. Reducing caffeine and wearing a supportive bra can help.`,
    insomnia: `Sleep can be disrupted on day ${cycleDay} based on your patterns. A calming wind-down ritual and magnesium-rich foods may help.`,
    anxiety: `Anxiety tends to surface for you on day ${cycleDay}. Breathwork, a walk in nature, and gentle movement can ground you.`,
    low_energy_pattern: `Your energy consistently dips on day ${cycleDay}. Plan lighter tasks and give yourself permission to rest.`,
    high_energy_pattern: `Day ${cycleDay} is a naturally high-energy day for you — an ideal time for important work and social plans!`,
  };
  return map[symptom] || `You've noticed a recurring pattern on day ${cycleDay} with ${symptom} (${occurrences} occurrences). Listen to your body and adjust your plans accordingly.`;
}

module.exports = router;
