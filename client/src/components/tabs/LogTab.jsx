import { useState, useEffect } from 'react';
import { useCycle } from '../../context/CycleContext';
import { BODY_SIGNAL_GROUPS } from '../../utils/cycleUtils';

const ENERGY_LABELS = ['', 'Very Low', 'Low', 'Moderate', 'High', 'Very High'];
const ENERGY_COLORS = ['', '#c04080', '#c06040', '#c0a040', '#60c080', '#40b0e0'];

const GROUP_COLORS = {
  'Physical':           { active: '#c04080', dim: 'rgba(192,64,128,0.15)' },
  'Energy & Mind':      { active: '#40b0e0', dim: 'rgba(64,176,224,0.15)' },
  'Emotional':          { active: '#8860c8', dim: 'rgba(136,96,200,0.15)' },
  'Sensual & Relational': { active: '#40c080', dim: 'rgba(64,192,128,0.15)' },
  'Appetite & Cravings': { active: '#c08040', dim: 'rgba(192,128,64,0.15)' },
};

export default function LogTab({ date, cycleInfo }) {
  const { logs, saveLog } = useCycle();
  const existing = logs[date];

  const [period, setPeriod] = useState(false);
  const [spotting, setSpotting] = useState(false);
  const [intimacy, setIntimacy] = useState(false);
  const [signals, setSignals] = useState([]);
  const [energy, setEnergy] = useState(3);
  const [notes, setNotes] = useState('');
  const [reflection, setReflection] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [openGroup, setOpenGroup] = useState('Physical');

  useEffect(() => {
    if (existing) {
      setPeriod(!!existing.period);
      setSpotting(!!existing.spotting);
      setIntimacy(!!existing.intimacy);
      setSignals(existing.symptoms || []);
      setEnergy(existing.energy_level || 3);
      setNotes(existing.notes || '');
      setReflection(existing.reflection || '');
    } else {
      setPeriod(false);
      setSpotting(false);
      setIntimacy(false);
      setSignals([]);
      setEnergy(3);
      setNotes('');
      setReflection('');
    }
  }, [date, existing]);

  function toggleSignal(key) {
    setSignals(prev => prev.includes(key) ? prev.filter(s => s !== key) : [...prev, key]);
  }

  async function handleSave() {
    setSaving(true);
    await saveLog(date, {
      period,
      spotting,
      intimacy,
      symptoms: signals,
      energy_level: energy,
      notes,
      reflection,
      cycle_day: cycleInfo?.cycleDay,
      phase: cycleInfo?.phase,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="p-4 space-y-5">
      {/* Flow */}
      <div>
        <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Flow</div>
        <div className="flex gap-2">
          {[
            { key: 'period',   label: 'Period',   color: '#c04080', state: period,   set: setPeriod,   icon: '🔴' },
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
        <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
          Vitality: <span style={{ color: ENERGY_COLORS[energy] }}>{ENERGY_LABELS[energy]}</span>
        </div>
        <input
          type="range" min={1} max={5} value={energy}
          onChange={e => setEnergy(Number(e.target.value))}
          className="w-full"
          style={{ accentColor: ENERGY_COLORS[energy] }}
        />
        <div className="flex justify-between text-[10px] text-white/30 mt-0.5">
          <span>Depleted</span><span>Radiant</span>
        </div>
      </div>

      {/* Body Signals — grouped, collapsible */}
      <div>
        <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
          Body signals
          {signals.length > 0 && (
            <span className="ml-2 text-cosmic-gold/70 normal-case font-normal">
              {signals.length} noted
            </span>
          )}
        </div>
        <div className="space-y-1.5">
          {BODY_SIGNAL_GROUPS.map(({ group, signals: groupSignals }) => {
            const { active: activeColor, dim } = GROUP_COLORS[group] || { active: '#f0c060', dim: 'rgba(240,192,96,0.12)' };
            const activeCount = groupSignals.filter(s => signals.includes(s.key)).length;
            const isOpen = openGroup === group;

            return (
              <div key={group} className="rounded-lg overflow-hidden border border-cosmic-border/60">
                <button
                  onClick={() => setOpenGroup(isOpen ? null : group)}
                  className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="text-xs font-medium text-white/70">{group}</span>
                  <div className="flex items-center gap-2">
                    {activeCount > 0 && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                        style={{ background: `${activeColor}30`, color: activeColor }}>
                        {activeCount}
                      </span>
                    )}
                    <span className="text-white/30 text-xs">{isOpen ? '▲' : '▼'}</span>
                  </div>
                </button>
                {isOpen && (
                  <div className="px-3 pb-3 grid grid-cols-2 gap-1.5">
                    {groupSignals.map(({ key, label }) => {
                      const isActive = signals.includes(key);
                      return (
                        <button
                          key={key}
                          onClick={() => toggleSignal(key)}
                          className="text-left px-2.5 py-2 rounded-lg text-xs transition-all leading-snug"
                          style={{
                            background: isActive ? dim : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${isActive ? activeColor + '80' : 'rgba(255,255,255,0.07)'}`,
                            color: isActive ? activeColor : 'rgba(255,255,255,0.5)',
                          }}
                        >
                          {isActive ? '✓ ' : ''}{label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Notes */}
      <div>
        <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Notes</div>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={3}
          placeholder="How are you feeling today? What did you notice?"
          className="w-full bg-cosmic-bg border border-cosmic-border rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-cosmic-gold/50 resize-none"
        />
      </div>

      {/* Reflection — seeds long-term vision arc */}
      <div>
        <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-1">Reflection</div>
        <div className="text-[11px] text-white/30 mb-2 leading-relaxed">
          Is there a vision, intention, or feeling that wants your attention this cycle?
        </div>
        <textarea
          value={reflection}
          onChange={e => setReflection(e.target.value)}
          rows={2}
          placeholder="Something I'm becoming aware of..."
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
        {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save'}
      </button>
    </div>
  );
}
