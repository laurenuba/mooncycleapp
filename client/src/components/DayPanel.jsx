import { useState, useMemo } from 'react';
import { format, parseISO, isToday } from 'date-fns';
import { useCycle } from '../context/CycleContext';
import { getCycleInfo, getPhaseColor, PHASES } from '../utils/cycleUtils';
import { getMoonPhaseName } from '../utils/moonPhase.jsx';
import RecommendationsTab from './tabs/RecommendationsTab';
import LogTab from './tabs/LogTab';
import PlannerTab from './tabs/PlannerTab';

const TABS = ['Recommendations', 'Log', 'Planner'];

export default function DayPanel() {
  const { selectedDate, settings, patterns } = useCycle();
  const [activeTab, setActiveTab] = useState('Recommendations');

  const cycleInfo = useMemo(() => {
    if (!settings.start_date || !selectedDate) return null;
    return getCycleInfo(selectedDate, settings.start_date, settings.cycle_length);
  }, [selectedDate, settings]);

  const moonInfo = useMemo(() => getMoonPhaseName(selectedDate), [selectedDate]);

  const dayPatterns = useMemo(
    () => patterns.filter(p => p.cycle_day === cycleInfo?.cycleDay),
    [patterns, cycleInfo]
  );

  const phaseColor = cycleInfo ? getPhaseColor(cycleInfo.phase) : '#888';
  const phaseName = cycleInfo ? PHASES[cycleInfo.phase]?.label : null;

  const date = parseISO(selectedDate);
  const isTodayDate = isToday(date);

  return (
    <div className="flex flex-col h-full">
      {/* Day header */}
      <div
        className="p-4 border-b border-cosmic-border"
        style={{ background: cycleInfo ? `${phaseColor}18` : 'transparent' }}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="text-white/50 text-xs font-medium uppercase tracking-widest mb-0.5">
              {isTodayDate ? 'Today' : format(date, 'EEEE')}
            </div>
            <div className="text-white text-2xl font-bold">{format(date, 'MMMM d, yyyy')}</div>
            <div className="flex items-center gap-2 mt-1">
              {cycleInfo ? (
                <>
                  <span
                    className="phase-pill"
                    style={{ background: `${phaseColor}25`, color: phaseColor }}
                  >
                    {phaseName}
                  </span>
                  <span className="text-white/40 text-xs">Day {cycleInfo.cycleDay} of {settings.cycle_length}</span>
                </>
              ) : (
                <span className="text-white/30 text-xs">No cycle configured — visit Settings</span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl" title={moonInfo.name}>{moonInfo.emoji}</div>
            <div className="text-white/40 text-[10px] mt-0.5">{moonInfo.name}</div>
          </div>
        </div>

        {/* AI Pattern insight */}
        {dayPatterns.length > 0 && (
          <div
            className="mt-3 rounded-lg p-3 text-xs"
            style={{ background: `${phaseColor}20`, border: `1px solid ${phaseColor}40` }}
          >
            <div className="font-semibold mb-1" style={{ color: phaseColor }}>✦ Your patterns</div>
            {dayPatterns.slice(0, 2).map(p => (
              <p key={p.id} className="text-white/70 leading-relaxed">{p.insight_text}</p>
            ))}
          </div>
        )}
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-cosmic-border">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'text-cosmic-gold border-b-2 border-cosmic-gold -mb-px'
                : 'text-white/50 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'Recommendations' && (
          <RecommendationsTab cycleInfo={cycleInfo} dayPatterns={dayPatterns} />
        )}
        {activeTab === 'Log' && (
          <LogTab date={selectedDate} cycleInfo={cycleInfo} />
        )}
        {activeTab === 'Planner' && (
          <PlannerTab date={selectedDate} cycleInfo={cycleInfo} />
        )}
      </div>
    </div>
  );
}
