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
    // Physical
    cramps: `You often experience cramps on day ${cycleDay} — a castor oil pack the night before, ginger tea, and magnesium glycinate can reduce prostaglandin-driven pain over time.`,
    back_pain: `Lower back heaviness tends to arrive on day ${cycleDay}. Gentle yin yoga, a warm compress, and magnesium may provide relief.`,
    headache: `Headaches have appeared on day ${cycleDay} before. Stay hydrated, reduce screen time, and consider magnesium supplementation long-term.`,
    bloating: `Bloating often arrives on day ${cycleDay}. Warm fennel or ginger tea, reducing salt, and gentle abdominal massage can help.`,
    breast_tenderness: `Breast tenderness tends to peak for you around day ${cycleDay}. Reducing caffeine and evening primrose oil may ease sensitivity over time.`,
    acne: `Skin tends to flare on day ${cycleDay}. Anti-inflammatory foods, zinc-rich meals, and a gentle skincare routine support your skin from within.`,
    digestive_changes: `Digestive shifts often appear on day ${cycleDay} — a sign of prostaglandin activity. Warm, cooked foods and probiotics can bring balance.`,
    joint_aches: `Joint and muscle aches show up for you around day ${cycleDay}. Omega-3-rich foods, turmeric, and gentle movement support inflammation.`,
    // Energy & Mind
    low_energy: `Your energy tends to dip on day ${cycleDay}. This is a great day for gentle tasks, restorative yoga, and early sleep.`,
    high_energy: `Day ${cycleDay} is typically a high-energy day for you — perfect for ambitious plans and creative work!`,
    sharp_focus: `Mental clarity peaks for you around day ${cycleDay}. Schedule your most cognitively demanding work here.`,
    low_motivation: `Motivation dips on day ${cycleDay} — this is your body asking for softness, not pushing harder. Rest is productive.`,
    creative_spark: `Creative energy surges on day ${cycleDay}. Keep a notebook close — ideas that arrive now are worth capturing.`,
    brain_fog: `Brain fog tends to appear on day ${cycleDay}. Reducing sugar, staying hydrated, and a short walk can clear the clouds.`,
    vivid_dreams: `Your dream life intensifies on day ${cycleDay}. Consider keeping a dream journal — the unconscious speaks loudly here.`,
    insomnia: `Sleep can be disrupted on day ${cycleDay}. A calming wind-down ritual, magnesium glycinate, and limiting screens after 9pm can help.`,
    // Emotional
    tender_heart: `Emotional sensitivity rises for you on day ${cycleDay}. This tenderness is a superpower — give yourself spaciousness and compassion.`,
    mood_swings: `Emotional waves tend to move through you around day ${cycleDay}. Grounding rituals, time in nature, and honest connection help.`,
    anxiety: `Anxiety tends to surface on day ${cycleDay}. Breathwork (especially extended exhale), a walk barefoot outside, and less caffeine can steady you.`,
    irritability: `A sharper edge appears on day ${cycleDay}. Your body may be pointing to something that needs attention — journal before reacting.`,
    deep_calm: `Day ${cycleDay} brings a deep settledness for you. Use this spaciousness for reflection, meditation, or meaningful conversation.`,
    grief_surfacing: `Old feelings sometimes surface around day ${cycleDay}. This is a natural release cycle — let it move through you without judgment.`,
    joy_aliveness: `A natural aliveness arrives on day ${cycleDay}. Lean into it — say yes to beauty, celebration, and things that light you up.`,
    need_solitude: `You tend to crave solitude on day ${cycleDay}. Honour this signal — retreat is medicine, not withdrawal.`,
    // Sensual & Relational
    desire: `Desire peaks for you on day ${cycleDay} — this is oestrogen and LH at work. A natural, healthy surge of life force energy.`,
    low_libido: `Libido tends to be quieter on day ${cycleDay}. This is a natural ebb — your body is conserving energy elsewhere.`,
    social_hunger: `You crave connection on day ${cycleDay}. Oestrogen rising amplifies your magnetism and desire for togetherness.`,
    magnetism: `You tend to feel especially magnetic on day ${cycleDay}. Trust it — this is your full-bloom ovulatory power.`,
    craving_touch: `A deep desire for closeness or being held tends to appear on day ${cycleDay}. Ask for what you need — it's not too much.`,
    // Appetite & Cravings
    craving_sweet: `Sweet cravings arrive on day ${cycleDay} — often a sign of progesterone rise and blood sugar fluctuations. Root vegetables and dark chocolate can satisfy without the crash.`,
    craving_salt: `Salt cravings on day ${cycleDay} often signal mineral needs. Mineral-rich broths, seaweed, and whole foods can help.`,
    craving_warmth: `You tend to want warm, nourishing food on day ${cycleDay}. Soups, stews, and spiced grains are deeply supportive right now.`,
    appetite_low: `Appetite tends to be lower on day ${cycleDay}. Eat small, nutrient-dense meals and trust your body's quieter hunger signals.`,
    appetite_high: `Appetite increases on day ${cycleDay} — your body is asking for more fuel. Prioritise protein and healthy fats to stay satiated.`,
    // Energy patterns
    low_energy_pattern: `Your energy consistently dips on day ${cycleDay}. Plan lighter tasks and give yourself permission to rest — this is cyclical wisdom.`,
    high_energy_pattern: `Day ${cycleDay} is a naturally high-energy day for you — an ideal time for important work, social plans, and creative projects!`,
  };
  return map[symptom] || `You've noticed a recurring pattern on day ${cycleDay} with ${symptom.replace(/_/g, ' ')} (${occurrences} occurrences). Listen to your body and adjust your plans accordingly.`;
}

module.exports = router;
