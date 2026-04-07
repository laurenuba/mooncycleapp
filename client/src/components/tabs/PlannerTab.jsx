import { useState, useMemo } from 'react';
import { format, parseISO, addDays } from 'date-fns';
import { useCycle } from '../../context/CycleContext';
import { getCycleInfo, getPhaseColor, PHASES } from '../../utils/cycleUtils';
import { BEST_DAY_CATEGORIES, BEST_DAY_PHASE_MAP } from '../../utils/recommendations';

const EVENT_CATEGORIES = [
  { key: 'work', label: 'Work', color: '#6080e0' },
  { key: 'social', label: 'Social', color: '#40c080' },
  { key: 'health', label: 'Health', color: '#c04080' },
  { key: 'personal', label: 'Personal', color: '#c08040' },
  { key: 'general', label: 'General', color: '#888' },
];

export default function PlannerTab({ date, cycleInfo }) {
  const { settings, events, saveEvent, deleteEvent } = useCycle();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [eventTitle, setEventTitle] = useState('');
  const [eventCat, setEventCat] = useState('general');
  const [saving, setSaving] = useState(false);

  const todayEvents = events.filter(e => e.date === date);

  // Best day finder
  const bestDays = useMemo(() => {
    if (!settings.start_date || selectedCategories.length === 0) return [];
    const days = [];
    for (let i = 0; i < (settings.cycle_length || 28); i++) {
      const d = addDays(parseISO(date), i - 15);
      const info = getCycleInfo(d, settings.start_date, settings.cycle_length);
      if (!info) continue;
      const dateStr = format(d, 'yyyy-MM-dd');
      const matches = selectedCategories.filter(cat => BEST_DAY_PHASE_MAP[cat] === info.phase);
      if (matches.length > 0) {
        days.push({ date: dateStr, display: format(d, 'MMM d'), info, matches, score: matches.length });
      }
    }
    return days.sort((a, b) => b.score - a.score).slice(0, 5);
  }, [selectedCategories, date, settings]);

  function toggleBestDayCat(key) {
    setSelectedCategories(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  }

  async function handleAddEvent() {
    if (!eventTitle.trim()) return;
    setSaving(true);
    await saveEvent({ date, title: eventTitle.trim(), category: eventCat });
    setEventTitle('');
    setSaving(false);
  }

  function buildGoogleCalendarUrl(event) {
    const d = parseISO(event.date);
    const start = format(d, "yyyyMMdd");
    const end = format(addDays(d, 1), "yyyyMMdd");
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${start}/${end}`,
      details: `Logged in Moon Cycle Planner`,
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  return (
    <div className="p-4 space-y-5">
      {/* Best day finder */}
      <div>
        <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
          Best day finder
        </div>
        <p className="text-xs text-white/40 mb-3">Select what you're planning and we'll suggest optimal cycle days nearby.</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {BEST_DAY_CATEGORIES.map(({ key, label, icon }) => {
            const active = selectedCategories.includes(key);
            return (
              <button
                key={key}
                onClick={() => toggleBestDayCat(key)}
                className="px-2.5 py-1 rounded-full text-xs font-medium transition-all"
                style={{
                  background: active ? 'rgba(240,192,96,0.2)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${active ? 'rgba(240,192,96,0.6)' : 'rgba(255,255,255,0.1)'}`,
                  color: active ? '#f0c060' : 'rgba(255,255,255,0.5)',
                }}
              >
                {icon} {label}
              </button>
            );
          })}
        </div>
        {bestDays.length > 0 && (
          <div className="space-y-1.5">
            {bestDays.map(({ date: d, display, info, matches }) => {
              const color = getPhaseColor(info.phase);
              return (
                <div
                  key={d}
                  className="flex items-center gap-3 rounded-lg px-3 py-2"
                  style={{ background: `${color}15`, border: `1px solid ${color}30` }}
                >
                  <div>
                    <div className="text-sm font-semibold text-white">{display}</div>
                    <div className="text-[10px]" style={{ color }}>Day {info.cycleDay} · {PHASES[info.phase]?.label}</div>
                  </div>
                  <div className="ml-auto flex flex-wrap gap-1">
                    {matches.map(m => {
                      const cat = BEST_DAY_CATEGORIES.find(c => c.key === m);
                      return <span key={m} className="text-[10px] text-white/60">{cat?.icon}</span>;
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {selectedCategories.length > 0 && bestDays.length === 0 && (
          <div className="text-xs text-white/30 py-2">No matching days found in range.</div>
        )}
      </div>

      {/* Add event */}
      <div>
        <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Add event</div>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={eventTitle}
            onChange={e => setEventTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddEvent()}
            placeholder="Event title..."
            className="flex-1 bg-cosmic-bg border border-cosmic-border rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-cosmic-gold/50"
          />
          <button
            onClick={handleAddEvent}
            disabled={saving || !eventTitle.trim()}
            className="px-3 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-40"
            style={{ background: 'rgba(240,192,96,0.15)', color: '#f0c060', border: '1px solid rgba(240,192,96,0.3)' }}
          >
            +
          </button>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {EVENT_CATEGORIES.map(({ key, label, color }) => (
            <button
              key={key}
              onClick={() => setEventCat(key)}
              className="px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all"
              style={{
                background: eventCat === key ? `${color}30` : 'transparent',
                border: `1px solid ${eventCat === key ? color : 'rgba(255,255,255,0.1)'}`,
                color: eventCat === key ? color : 'rgba(255,255,255,0.4)',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Today's events */}
      {todayEvents.length > 0 && (
        <div>
          <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
            Events on this day
          </div>
          <div className="space-y-1.5">
            {todayEvents.map(event => {
              const cat = EVENT_CATEGORIES.find(c => c.key === event.category) || EVENT_CATEGORIES[4];
              return (
                <div
                  key={event.id}
                  className="flex items-center gap-2 rounded-lg px-3 py-2"
                  style={{ background: `${cat.color}15`, border: `1px solid ${cat.color}30` }}
                >
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: cat.color }} />
                  <span className="text-sm text-white flex-1">{event.title}</span>
                  <a
                    href={buildGoogleCalendarUrl(event)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-white/30 hover:text-cosmic-gold transition-colors px-1"
                    title="Export to Google Calendar"
                  >
                    📅
                  </a>
                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="text-white/20 hover:text-red-400 transition-colors text-xs px-1"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
