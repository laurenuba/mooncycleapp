import { useState, useEffect } from 'react';
import { useCycle } from '../../context/CycleContext';
import { SYMPTOMS } from '../../utils/cycleUtils';

const ENERGY_LABELS = ['', 'Very Low', 'Low', 'Moderate', 'High', 'Very High'];
const ENERGY_COLORS = ['', '#c04080', '#c06040', '#c0a040', '#60c080', '#40b0e0'];

export default function LogTab({ date, cycleInfo }) {
  const { logs, saveLog } = useCycle();
  const existing = logs[date];

  const [period, setPeriod] = useState(false);
  const [spotting, setSpotting] = useState(false);
  const [intimacy, setIntimacy] = useState(false);
  const [symptoms, setSymptoms] = useState([]);
  const [energy, setEnergy] = useState(3);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Populate from existing log
  useEffect(() => {
    if (existing) {
      setPeriod(!!existing.period);
      setSpotting(!!existing.spotting);
      setIntimacy(!!existing.intimacy);
      setSymptoms(existing.symptoms || []);
      setEnergy(existing.energy_level || 3);
      setNotes(existing.notes || '');
    } else {
      setPeriod(false);
      setSpotting(false);
      setIntimacy(false);
      setSymptoms([]);
      setEnergy(3);
      setNotes('');
    }
  }, [date, existing]);

  function toggleSymptom(key) {
    setSymptoms(prev => prev.includes(key) ? prev.filter(s => s !== key) : [...prev, key]);
  }

  async function handleSave() {
    setSaving(true);
    await saveLog(date, {
      period,
      spotting,
      intimacy,
      symptoms,
      energy_level: energy,
      notes,
      cycle_day: cycleInfo?.cycleDay,
      phase: cycleInfo?.phase,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="p-4 space-y-5">
      {/* Flow toggles */}
      <div>
        <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Flow</div>
        <div className="flex gap-2">
          {[
            { key: 'period', label: 'Period', color: '#c04080', state: period, set: setPeriod, icon: '🔴' },
            { key: 'spotting', label: 'Spotting', color: '#e08060', state: spotting, set: setSpotting, icon: '🟠' },
            { key: 'intimacy', label: 'Intimacy', color: '#8060c0', state: intimacy, set: setIntimacy, icon: '💜' },
          ].map(({ key, label, color, state, set, icon }) => (
            <button
              key={key}
              onClick={() => set(v => !v)}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{
                background: state ? `${color}30` : 'rgba(255,255,255,0.04)',
                border: `1px solid ${state ? color : 'rgba(255,255,255,0.1)'}`,
                color: state ? color : 'rgba(255,255,255,0.5)',
              }}
            >
              <span className="block text-lg mb-0.5">{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Energy */}
      <div>
        <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
          Energy level: <span style={{ color: ENERGY_COLORS[energy] }}>{ENERGY_LABELS[energy]}</span>
        </div>
        <input
          type="range"
          min={1}
          max={5}
          value={energy}
          onChange={e => setEnergy(Number(e.target.value))}
          className="w-full"
          style={{ accentColor: ENERGY_COLORS[energy] }}
        />
        <div className="flex justify-between text-[10px] text-white/30 mt-0.5">
          <span>Very Low</span>
          <span>Very High</span>
        </div>
      </div>

      {/* Symptoms */}
      <div>
        <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Symptoms</div>
        <div className="grid grid-cols-2 gap-1.5">
          {SYMPTOMS.map(({ key, label }) => {
            const active = symptoms.includes(key);
            return (
              <button
                key={key}
                onClick={() => toggleSymptom(key)}
                className="text-left px-3 py-2 rounded-lg text-xs transition-all"
                style={{
                  background: active ? 'rgba(240,192,96,0.15)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${active ? 'rgba(240,192,96,0.5)' : 'rgba(255,255,255,0.08)'}`,
                  color: active ? '#f0c060' : 'rgba(255,255,255,0.5)',
                }}
              >
                {active ? '✓ ' : ''}{label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notes */}
      <div>
        <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Notes</div>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={3}
          placeholder="How are you feeling today? Any observations..."
          className="w-full bg-cosmic-bg border border-cosmic-border rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-cosmic-gold/50 resize-none"
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-2.5 rounded-lg font-semibold text-sm transition-all"
        style={{
          background: saved ? '#40c080' : 'rgba(240,192,96,0.15)',
          border: `1px solid ${saved ? '#40c080' : 'rgba(240,192,96,0.4)'}`,
          color: saved ? '#fff' : '#f0c060',
        }}
      >
        {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Log'}
      </button>
    </div>
  );
}
