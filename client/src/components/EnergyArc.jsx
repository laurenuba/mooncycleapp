import { useMemo } from 'react';
import { format, addDays, parseISO } from 'date-fns';
import { useCycle } from '../context/CycleContext';
import { getCycleInfo } from '../utils/cycleUtils';
import { getMoonPhaseName } from '../utils/moonPhase.jsx';
import { getPredictedEnergy, getLoggedEnergyAverages, ENERGY_LEVELS } from '../utils/energyUtils';

const LEGEND = [1, 2, 3, 4, 5].map(n => ({ level: n, ...ENERGY_LEVELS[n] }));

export default function EnergyArc({ startDate }) {
  const { settings, logs, selectedDate, setSelectedDate } = useCycle();

  const base = useMemo(() => {
    const d = startDate || selectedDate || format(new Date(), 'yyyy-MM-dd');
    return typeof d === 'string' ? parseISO(d) : d;
  }, [startDate, selectedDate]);

  const loggedAverages = useMemo(() => getLoggedEnergyAverages(logs), [logs]);

  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = addDays(base, i);
      const dateStr = format(d, 'yyyy-MM-dd');
      const info = settings.start_date
        ? getCycleInfo(d, settings.start_date, settings.cycle_length)
        : null;
      const moon = getMoonPhaseName(d);
      const energy = info
        ? getPredictedEnergy(info.cycleDay, settings.cycle_length, loggedAverages)
        : { level: 3, ...ENERGY_LEVELS[3], personalized: false };
      const loggedEnergy = logs[dateStr]?.energy_level || null;

      return { dateStr, dayLabel: format(d, 'EE').slice(0, 2), dayNum: format(d, 'd'), info, moon, energy, loggedEnergy };
    });
  }, [base, settings, loggedAverages, logs]);

  const hasPersonalized = days.some(d => d.energy.personalized);

  return (
    <div className="rounded-xl border border-cosmic-border p-4" style={{ background: 'rgba(255,255,255,0.03)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm">📊</span>
          <span className="text-sm font-semibold text-white/80">Week Ahead — Energy Arc</span>
        </div>
        {hasPersonalized && (
          <span className="text-[10px] text-cosmic-gold/70 border border-cosmic-gold/30 rounded-full px-2 py-0.5">
            ✦ personalised
          </span>
        )}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map(({ dateStr, dayLabel, dayNum, info, moon, energy, loggedEnergy }) => {
          const isSelected = dateStr === selectedDate;
          const blockHeight = 32 + (energy.level - 1) * 10; // 32–72px

          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDate(dateStr)}
              className="flex flex-col items-center gap-0.5 group focus:outline-none"
            >
              {/* Day label */}
              <span className={`text-[11px] font-medium ${isSelected ? 'text-cosmic-gold' : 'text-white/50'}`}>
                {dayLabel}
              </span>

              {/* Moon */}
              <span className="text-xs leading-none" title={moon.name}>{moon.emoji}</span>

              {/* Energy block */}
              <div
                className="w-full rounded-lg transition-all flex items-center justify-center relative"
                style={{
                  height: blockHeight,
                  background: isSelected ? energy.bg : energy.bg.replace('0.75', '0.55').replace('0.90', '0.70'),
                  border: isSelected ? `2px solid ${energy.color}` : `1px solid ${energy.color}40`,
                  boxShadow: isSelected ? `0 0 10px ${energy.color}50` : 'none',
                }}
              >
                {/* Logged vs predicted dot */}
                {loggedEnergy && (
                  <div
                    className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
                    style={{ background: ENERGY_LEVELS[loggedEnergy]?.color || '#fff' }}
                    title={`Logged: ${ENERGY_LEVELS[loggedEnergy]?.label}`}
                  />
                )}
                {energy.personalized && !loggedEnergy && (
                  <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-cosmic-gold/60" title="From your history" />
                )}
              </div>

              {/* Label */}
              <span
                className="text-[9px] font-semibold leading-tight text-center"
                style={{ color: isSelected ? energy.color : energy.color + 'cc' }}
              >
                {energy.label}
              </span>

              {/* Icon */}
              <span className="text-[10px] leading-none">{energy.icon}</span>

              {/* Cycle day */}
              <span className="text-[9px] text-white/30">{info ? info.cycleDay : ''}</span>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 pt-2 border-t border-cosmic-border/50">
        {LEGEND.map(({ level, label, color }) => (
          <div key={level} className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: color + '99' }} />
            <span className="text-[10px] text-white/40">{label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1 ml-auto">
          <div className="w-1.5 h-1.5 rounded-full bg-cosmic-gold/60" />
          <span className="text-[10px] text-white/30">from your logs</span>
        </div>
      </div>
    </div>
  );
}
