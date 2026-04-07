import { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, isToday, parseISO } from 'date-fns';
import { useCycle } from '../context/CycleContext';
import { getCycleInfo, getPhaseColor, getPhaseBg, PHASES } from '../utils/cycleUtils';
import { getMoonPhase, getMoonPhaseName } from '../utils/moonPhase.jsx';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Calendar() {
  const { settings, logs, events, selectedDate, setSelectedDate } = useCycle();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPad = getDay(monthStart);

  const monthStr = format(currentMonth, 'yyyy-MM');
  const monthEvents = useMemo(
    () => events.filter(e => e.date.startsWith(monthStr)),
    [events, monthStr]
  );

  function prevMonth() {
    setCurrentMonth(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }
  function nextMonth() {
    setCurrentMonth(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  return (
    <div className="card p-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-cosmic-border transition-colors text-white/70 hover:text-white">
          ‹
        </button>
        <div className="text-center">
          <h2 className="text-cosmic-gold font-semibold text-lg">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
        </div>
        <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-cosmic-border transition-colors text-white/70 hover:text-white">
          ›
        </button>
      </div>

      {/* Phase legend */}
      <div className="flex gap-3 mb-4 flex-wrap">
        {Object.entries(PHASES).map(([key, phase]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: phase.color }} />
            <span className="text-xs text-white/60">{phase.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-white/20" />
          <span className="text-xs text-white/60">No cycle data</span>
        </div>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS_OF_WEEK.map(d => (
          <div key={d} className="text-center text-xs text-white/40 py-1 font-medium">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startPad }).map((_, i) => <div key={`pad-${i}`} />)}
        {days.map(day => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const cycleInfo = settings.start_date
            ? getCycleInfo(day, settings.start_date, settings.cycle_length)
            : null;
          const moonPhase = getMoonPhase(day);
          const moonInfo = getMoonPhaseName(day);
          const log = logs[dateStr];
          const isSelected = dateStr === selectedDate;
          const isTodayDate = isToday(day);
          const dayEvents = monthEvents.filter(e => e.date === dateStr);

          const phaseBg = cycleInfo ? getPhaseBg(cycleInfo.phase) : 'transparent';
          const phaseColor = cycleInfo ? getPhaseColor(cycleInfo.phase) : '#666';

          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDate(dateStr)}
              className={`
                relative aspect-square rounded-lg p-1 text-left transition-all text-xs
                hover:brightness-125 focus:outline-none focus:ring-1 focus:ring-cosmic-gold/50
                ${isSelected ? 'ring-2 ring-cosmic-gold glow-gold' : ''}
                ${isTodayDate ? 'ring-1 ring-white/40' : ''}
              `}
              style={{ background: phaseBg, border: `1px solid ${isSelected ? 'transparent' : 'rgba(255,255,255,0.05)'}` }}
            >
              {/* Day number */}
              <span
                className={`font-semibold block text-center leading-none mb-0.5 ${
                  isTodayDate ? 'text-cosmic-gold' : cycleInfo ? 'text-white' : 'text-white/50'
                }`}
              >
                {format(day, 'd')}
              </span>

              {/* Moon emoji (only show for significant phases) */}
              {(moonPhase < 0.05 || moonPhase > 0.95 || (moonPhase > 0.46 && moonPhase < 0.54)) && (
                <div className="text-center text-xs leading-none" title={moonInfo.name}>
                  {moonInfo.emoji}
                </div>
              )}

              {/* Cycle day badge */}
              {cycleInfo && (
                <div
                  className="absolute bottom-0.5 right-0.5 text-[9px] font-bold leading-none opacity-70"
                  style={{ color: phaseColor }}
                >
                  {cycleInfo.cycleDay}
                </div>
              )}

              {/* Log indicators */}
              <div className="flex gap-0.5 justify-center mt-0.5 flex-wrap">
                {log?.period ? <div className="w-1.5 h-1.5 rounded-full bg-phase-menstrual" title="Period" /> : null}
                {log?.spotting ? <div className="w-1.5 h-1.5 rounded-full bg-pink-400/70" title="Spotting" /> : null}
                {(log?.symptoms?.length > 0) ? <div className="w-1.5 h-1.5 rounded-full bg-white/40" title="Symptoms logged" /> : null}
                {dayEvents.length > 0 ? <div className="w-1.5 h-1.5 rounded-full bg-cosmic-gold" title="Events" /> : null}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
