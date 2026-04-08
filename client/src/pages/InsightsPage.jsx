import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from 'recharts';
import { useCycle } from '../context/CycleContext';
import { getPhaseColor, getPhaseForDay, PHASES } from '../utils/cycleUtils';

const SYMPTOM_LABELS = {
  // Physical
  cramps: 'Cramps / pelvic pain',
  back_pain: 'Lower back heaviness',
  headache: 'Headache / migraine',
  bloating: 'Bloating / fullness',
  breast_tenderness: 'Breast tenderness',
  acne: 'Skin flaring',
  digestive_changes: 'Digestive changes',
  joint_aches: 'Joint / muscle aches',
  // Energy & Mind
  low_energy: 'Low energy',
  high_energy: 'Radiant energy',
  sharp_focus: 'Sharp focus',
  low_motivation: 'Low motivation',
  creative_spark: 'Creative spark',
  brain_fog: 'Brain fog',
  vivid_dreams: 'Vivid dreams',
  insomnia: 'Disrupted sleep',
  // Emotional
  tender_heart: 'Tender / sensitive heart',
  mood_swings: 'Emotional waves',
  anxiety: 'Anxiety / unease',
  irritability: 'Irritability / sharp edges',
  deep_calm: 'Deep calm',
  grief_surfacing: 'Grief surfacing',
  joy_aliveness: 'Joy / aliveness',
  need_solitude: 'Craving solitude',
  // Sensual & Relational
  desire: 'Desire / arousal',
  low_libido: 'Low libido',
  social_hunger: 'Craving connection',
  magnetism: 'Feeling magnetic',
  craving_touch: 'Craving touch / held',
  // Appetite & Cravings
  craving_sweet: 'Sweet cravings',
  craving_salt: 'Salt / savoury cravings',
  craving_warmth: 'Craving warm food',
  appetite_low: 'Low appetite',
  appetite_high: 'Increased appetite',
  // Energy patterns
  low_energy_pattern: 'Low energy (pattern)',
  high_energy_pattern: 'High energy (pattern)',
  // Legacy keys
  fatigue: 'Low energy',
};

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-cosmic-card border border-cosmic-border rounded-lg p-3 text-xs max-w-xs">
      <div className="font-semibold text-white mb-1">Day {d.cycle_day} · {PHASES[d.phase]?.label}</div>
      <div className="text-cosmic-gold font-medium mb-1">{SYMPTOM_LABELS[d.symptom] || d.symptom}</div>
      <div className="text-white/60">{d.occurrences}× detected</div>
      {d.insight_text && <div className="text-white/50 mt-2 leading-relaxed">{d.insight_text}</div>}
    </div>
  );
}

export default function InsightsPage() {
  const { patterns, analyzePatterns, logs, settings } = useCycle();
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  async function handleAnalyze() {
    setAnalyzing(true);
    setResult(null);
    const r = await analyzePatterns();
    setResult(r);
    setAnalyzing(false);
  }

  // Chart data: patterns over cycle days
  const chartData = patterns.map(p => ({
    ...p,
    display: `D${p.cycle_day}`,
    color: getPhaseColor(p.phase || getPhaseForDay(p.cycle_day, settings.cycle_length || 28)),
  }));

  // Phase breakdown of patterns
  const phaseBreakdown = Object.entries(PHASES).map(([key, phase]) => {
    const count = patterns.filter(p => (p.phase || getPhaseForDay(p.cycle_day, settings.cycle_length || 28)) === key).length;
    return { phase: phase.label, count, color: phase.color };
  });

  // Symptom frequency across all logs
  const symptomFreq = {};
  Object.values(logs).forEach(log => {
    (log.symptoms || []).forEach(s => { symptomFreq[s] = (symptomFreq[s] || 0) + 1; });
  });
  const topSymptoms = Object.entries(symptomFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([s, count]) => ({ symptom: SYMPTOM_LABELS[s] || s, count }));

  // Energy by cycle day (aggregate)
  const energyByDay = {};
  Object.values(logs).forEach(log => {
    if (log.cycle_day && log.energy_level) {
      if (!energyByDay[log.cycle_day]) energyByDay[log.cycle_day] = [];
      energyByDay[log.cycle_day].push(log.energy_level);
    }
  });
  const energyChart = Object.entries(energyByDay)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([day, vals]) => ({
      day: Number(day),
      avg: vals.reduce((a, b) => a + b, 0) / vals.length,
      color: getPhaseColor(getPhaseForDay(Number(day), settings.cycle_length || 28)),
    }));

  const logCount = Object.keys(logs).length;

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-cosmic-gold text-2xl font-semibold mb-1">Your Insights</h2>
          <p className="text-white/40 text-sm">{logCount} days logged · {patterns.length} patterns detected</p>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={analyzing || !settings.start_date}
          className="px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-40"
          style={{ background: 'rgba(240,192,96,0.15)', color: '#f0c060', border: '1px solid rgba(240,192,96,0.3)' }}
        >
          {analyzing ? '✨ Analyzing...' : '✨ Re-analyze'}
        </button>
      </div>

      {result && (
        <div className={`rounded-lg p-4 text-sm ${result.success ? 'bg-phase-ovulatory/10 border border-phase-ovulatory/30 text-phase-ovulatory' : 'bg-white/5 border border-white/10 text-white/60'}`}>
          {result.message}
        </div>
      )}

      {logCount < 7 && (
        <div className="card p-6 text-center">
          <div className="text-3xl mb-3">🌱</div>
          <h3 className="font-semibold text-white mb-2">Start logging to see insights</h3>
          <p className="text-white/40 text-sm">Log at least 7 days to start seeing your patterns. Insights get richer after 30+ days.</p>
        </div>
      )}

      {/* Patterns list */}
      {patterns.length > 0 && (
        <div className="card p-5">
          <h3 className="font-semibold text-white mb-4">Detected Patterns</h3>
          <div className="space-y-3">
            {patterns.map(p => {
              const phase = p.phase || getPhaseForDay(p.cycle_day, settings.cycle_length || 28);
              const color = getPhaseColor(phase);
              return (
                <div
                  key={p.id}
                  className="rounded-lg p-3 flex gap-3"
                  style={{ background: `${color}12`, border: `1px solid ${color}25` }}
                >
                  <div className="shrink-0 text-center">
                    <div className="font-bold text-lg" style={{ color }}>{p.cycle_day}</div>
                    <div className="text-[10px] text-white/40">day</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-white">
                        {SYMPTOM_LABELS[p.symptom] || p.symptom}
                      </span>
                      <span
                        className="phase-pill text-[10px]"
                        style={{ background: `${color}25`, color }}
                      >
                        {PHASES[phase]?.label}
                      </span>
                      <span className="text-[10px] text-white/30 ml-auto">{p.occurrences}×</span>
                    </div>
                    {p.insight_text && (
                      <p className="text-xs text-white/60 leading-relaxed">{p.insight_text}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pattern chart */}
      {chartData.length > 0 && (
        <div className="card p-5">
          <h3 className="font-semibold text-white mb-4">Patterns by Cycle Day</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <XAxis dataKey="display" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
              <Bar dataKey="occurrences" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Energy chart */}
      {energyChart.length > 3 && (
        <div className="card p-5">
          <h3 className="font-semibold text-white mb-4">Average Energy by Cycle Day</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={energyChart} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
              <YAxis domain={[0, 5]} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
              <Tooltip
                formatter={(v) => [v.toFixed(1), 'Avg energy']}
                contentStyle={{ background: '#1a1535', border: '1px solid #2a2550', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: 'rgba(255,255,255,0.6)' }}
                itemStyle={{ color: '#f0c060' }}
              />
              <Bar dataKey="avg" radius={[3, 3, 0, 0]}>
                {energyChart.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-3 flex-wrap">
            {Object.entries(PHASES).map(([key, phase]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: phase.color }} />
                <span className="text-xs text-white/50">{phase.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top symptoms */}
      {topSymptoms.length > 0 && (
        <div className="card p-5">
          <h3 className="font-semibold text-white mb-4">Most Logged Body Signals</h3>
          <div className="space-y-2">
            {topSymptoms.map(({ symptom, count }, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-white/60 w-36 truncate">{symptom}</span>
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-cosmic-gold/70"
                    style={{ width: `${(count / topSymptoms[0].count) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-white/40 w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Phase breakdown */}
      {patterns.length > 0 && (
        <div className="card p-5">
          <h3 className="font-semibold text-white mb-4">Patterns by Phase</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {phaseBreakdown.map(({ phase, count, color }) => (
              <div
                key={phase}
                className="rounded-lg p-3 text-center"
                style={{ background: `${color}15`, border: `1px solid ${color}30` }}
              >
                <div className="text-2xl font-bold" style={{ color }}>{count}</div>
                <div className="text-xs text-white/50 mt-0.5">{phase}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
