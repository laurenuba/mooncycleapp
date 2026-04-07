import { useState, useEffect } from 'react';
import { useCycle } from '../context/CycleContext';
import { PHASES } from '../utils/cycleUtils';

export default function CycleSettings() {
  const { settings, saveSettings, analyzePatterns, patterns } = useCycle();
  const [startDate, setStartDate] = useState(settings.start_date || '');
  const [cycleLength, setCycleLength] = useState(settings.cycle_length || 28);
  const [saved, setSaved] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeResult, setAnalyzeResult] = useState(null);

  useEffect(() => {
    setStartDate(settings.start_date || '');
    setCycleLength(settings.cycle_length || 28);
  }, [settings]);

  async function handleSave(e) {
    e.preventDefault();
    if (!startDate) return;
    await saveSettings({ start_date: startDate, cycle_length: cycleLength });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleAnalyze() {
    setAnalyzing(true);
    setAnalyzeResult(null);
    const result = await analyzePatterns();
    setAnalyzeResult(result);
    setAnalyzing(false);
  }

  const phases = [
    { key: 'menstrual', days: `Days 1–5`, desc: 'Menstruation — rest and reflect' },
    { key: 'follicular', days: `Days 6–${Math.round(cycleLength * 0.46)}`, desc: 'Rising energy — create and connect' },
    { key: 'ovulatory', days: `Days ${Math.round(cycleLength * 0.46) + 1}–${Math.round(cycleLength * 0.57)}`, desc: 'Peak energy — lead and express' },
    { key: 'luteal', days: `Days ${Math.round(cycleLength * 0.57) + 1}–${cycleLength}`, desc: 'Inward energy — complete and prepare' },
  ];

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-cosmic-gold text-2xl font-semibold mb-1">Cycle Settings</h2>
      <p className="text-white/50 text-sm mb-6">Configure your personal cycle to unlock personalized recommendations.</p>

      <form onSubmit={handleSave} className="card p-6 mb-6 space-y-6">
        {/* Start date */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            First day of last period
          </label>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            required
            className="w-full bg-cosmic-bg border border-cosmic-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cosmic-gold/50 focus:border-cosmic-gold/50"
          />
          <p className="text-white/40 text-xs mt-1">This anchors your cycle phase calculations.</p>
        </div>

        {/* Cycle length */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Cycle length: <span className="text-cosmic-gold font-bold">{cycleLength} days</span>
          </label>
          <input
            type="range"
            min={21}
            max={35}
            value={cycleLength}
            onChange={e => setCycleLength(Number(e.target.value))}
            className="w-full accent-[#f0c060]"
          />
          <div className="flex justify-between text-xs text-white/30 mt-1">
            <span>21 days</span>
            <span>28 days (avg)</span>
            <span>35 days</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 rounded-lg font-semibold transition-all"
          style={{ background: saved ? '#40c080' : '#f0c060', color: '#0d0a1a' }}
        >
          {saved ? '✓ Saved!' : 'Save Settings'}
        </button>
      </form>

      {/* Phase breakdown */}
      <div className="card p-5 mb-6">
        <h3 className="font-semibold text-white/80 mb-3 text-sm">Your cycle phases</h3>
        <div className="space-y-2">
          {phases.map(({ key, days, desc }) => (
            <div key={key} className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full shrink-0" style={{ background: PHASES[key].color }} />
              <div>
                <span className="text-sm font-medium" style={{ color: PHASES[key].color }}>
                  {PHASES[key].label}
                </span>
                <span className="text-white/40 text-xs ml-2">{days}</span>
              </div>
              <span className="text-white/50 text-xs ml-auto hidden sm:block">{desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Pattern Analysis */}
      <div className="card p-5">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-cosmic-gold mb-1">AI Pattern Analysis</h3>
            <p className="text-white/50 text-xs">
              Analyzes your logs to detect recurring patterns and generates personalized insights powered by Claude AI.
              Works best after 30+ days of logging.
            </p>
          </div>
        </div>

        {patterns.length > 0 && (
          <div className="mt-3 mb-4 text-sm text-white/60">
            <span className="text-cosmic-gold font-semibold">{patterns.length}</span> patterns currently detected across your cycle.
          </div>
        )}

        {analyzeResult && (
          <div className={`text-sm rounded-lg p-3 mb-4 ${analyzeResult.success ? 'bg-phase-ovulatory/10 text-phase-ovulatory' : 'bg-white/5 text-white/60'}`}>
            {analyzeResult.message}
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={analyzing || !settings.start_date}
          className="px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-40"
          style={{ background: 'rgba(240,192,96,0.15)', color: '#f0c060', border: '1px solid rgba(240,192,96,0.3)' }}
        >
          {analyzing ? '✨ Analyzing...' : '✨ Run Pattern Analysis'}
        </button>
        {!settings.start_date && (
          <p className="text-white/30 text-xs mt-2">Save your cycle settings first.</p>
        )}
      </div>
    </main>
  );
}
