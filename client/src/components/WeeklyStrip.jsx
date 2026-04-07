import { useMemo } from 'react';
import { format, parseISO, isToday, startOfWeek, addDays } from 'date-fns';
import { useCycle } from '../context/CycleContext';
import { getCycleInfo, getPhaseColor, PHASES } from '../utils/cycleUtils';

const ENERGY_LABELS = ['', 'Very Low', 'Low', 'Moderate', 'High', 'Very High'];

export default function WeeklyStrip() {
  const { settings, logs, selectedDate, setSelectedDate } = useCycle();

  const weekDays = useMemo(() => {
    const selected = selectedDate ? parseISO(selectedDate) : new Date();
    const start = startOfWeek(selected, { weekStartsOn: 0 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [selectedDate]);

  const weekPhases = useMemo(() => {
    if (!settings.start_date) return [];
    return weekDays.map(d => ({
      date: format(d, 'yyyy-MM-dd'),
      info: getCycleInfo(d, settings.start_date, settings.cycle_length),
      log: logs[format(d, 'yyyy-MM-dd')],
      isToday: isToday(d),
    }));
  }, [weekDays, settings, logs]);

  if (!settings.start_date) return null;

  return (
    <div className="border-b border-cosmic-border px-4 py-2 bg-cosmic-card/40">
      <div className="flex items-center gap-1 max-w-4xl mx-auto">
        <span className="text-white/40 text-xs mr-2 shrink-0">This week</span>
        <div className="flex gap-1 flex-1 overflow-x-auto pb-1">
          {weekPhases.map(({ date, info, log, isToday: today }) => {
            const color = info ? getPhaseColor(info.phase) : '#444';
            const energy = log?.energy_level || 0;
            const isSelected = date === selectedDate;

            return (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`flex-1 min-w-[44px] rounded-lg p-1.5 text-center transition-all ${
                  isSelected ? 'ring-1 ring-cosmic-gold' : ''
                }`}
                style={{ background: isSelected ? `${color}33` : `${color}15` }}
                title={info ? `Day ${info.cycleDay} — ${PHASES[info.phase]?.label}` : 'No cycle data'}
              >
                <div className={`text-[10px] font-medium ${today ? 'text-cosmic-gold' : 'text-white/50'}`}>
                  {format(parseISO(date), 'EEE')}
                </div>
                <div className={`text-sm font-bold ${today ? 'text-cosmic-gold' : 'text-white'}`}>
                  {format(parseISO(date), 'd')}
                </div>
                {info && (
                  <div className="text-[9px] font-semibold mt-0.5 truncate" style={{ color }}>
                    D{info.cycleDay}
                  </div>
                )}
                {/* Energy bar */}
                {energy > 0 && (
                  <div className="mt-1 h-1 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${(energy / 5) * 100}%`, background: color }}
                    />
                  </div>
                )}
                {/* Period dot */}
                {log?.period ? <div className="w-1.5 h-1.5 rounded-full bg-phase-menstrual mx-auto mt-0.5" /> : null}
              </button>
            );
          })}
        </div>

        {/* Week summary */}
        <div className="ml-2 shrink-0 text-right hidden sm:block">
          {(() => {
            const phases = weekPhases.filter(w => w.info).map(w => w.info.phase);
            const dominant = phases.reduce((acc, p) => {
              acc[p] = (acc[p] || 0) + 1;
              return acc;
            }, {});
            const top = Object.entries(dominant).sort((a, b) => b[1] - a[1])[0];
            if (!top) return null;
            return (
              <div>
                <div className="text-[10px] text-white/40">Dominant phase</div>
                <div className="text-xs font-semibold" style={{ color: getPhaseColor(top[0]) }}>
                  {PHASES[top[0]]?.label}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
