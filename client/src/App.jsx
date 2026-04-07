import { useMemo } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { parseISO, isToday, format } from 'date-fns';
import { useCycle } from './context/CycleContext';
import Calendar from './components/Calendar';
import DayPanel from './components/DayPanel';
import InsightsPage from './pages/InsightsPage';
import CycleSettings from './components/CycleSettings';
import WeeklyStrip from './components/WeeklyStrip';
import { getCycleInfo } from './utils/cycleUtils';
import { getDailyReading } from './utils/dailyReading';

function Layout() {
  const { loading, settings, logs, selectedDate } = useCycle();

  // Recompute reading whenever the selected date changes — pure JS, negligible cost
  const reading = useMemo(() => {
    if (!selectedDate) return null;
    const d = parseISO(selectedDate);
    const cycleInfo = settings.start_date
      ? getCycleInfo(d, settings.start_date, settings.cycle_length)
      : null;
    const symptoms = logs[selectedDate]?.symptoms || [];
    return getDailyReading(d, cycleInfo, symptoms);
  }, [selectedDate, settings, logs]);

  const readingLabel = useMemo(() => {
    if (!selectedDate) return "Today's Reading";
    const d = parseISO(selectedDate);
    return isToday(d) ? "Today's Reading" : `${format(d, 'MMMM d')} Reading`;
  }, [selectedDate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-cosmic-bg">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">🌙</div>
          <div className="text-cosmic-gold text-sm tracking-widest uppercase">Loading your cycle...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cosmic-bg flex flex-col">
      {/* Header */}
      <header className="border-b border-cosmic-border px-6 py-3 flex items-center justify-between sticky top-0 z-50 bg-cosmic-bg/95 backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌙</span>
          <h1 className="text-cosmic-gold font-semibold text-lg tracking-wide">Moon Cycle Planner</h1>
        </div>
        <nav className="flex gap-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-cosmic-gold-dim text-cosmic-gold' : 'text-white/60 hover:text-white'
              }`
            }
          >
            Calendar
          </NavLink>
          <NavLink
            to="/insights"
            className={({ isActive }) =>
              `px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-cosmic-gold-dim text-cosmic-gold' : 'text-white/60 hover:text-white'
              }`
            }
          >
            Insights
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-cosmic-gold-dim text-cosmic-gold' : 'text-white/60 hover:text-white'
              }`
            }
          >
            Settings
          </NavLink>
        </nav>
      </header>

      {/* Daily Reading — updates when any calendar day is clicked */}
      {reading && (
        <div className="border-b border-cosmic-border px-6 py-3 bg-gradient-to-r from-cosmic-card/60 to-transparent">
          <div className="max-w-5xl mx-auto">
            <div className="text-[10px] text-white/30 uppercase tracking-widest mb-1">
              {reading.moonEmoji} {reading.moonPhase} &nbsp;·&nbsp; {readingLabel}
            </div>
            <div className="flex flex-col sm:flex-row gap-1 sm:gap-4">
              {reading.lunar && (
                <p className="text-sm text-white/75 leading-relaxed flex-1">
                  <span className="text-cosmic-gold font-semibold">Lunar: </span>{reading.lunar}
                </p>
              )}
              {reading.cycle && (
                <p className="text-sm text-white/75 leading-relaxed flex-1">
                  <span className="text-cosmic-gold font-semibold">Cycle: </span>{reading.cycle}
                </p>
              )}
            </div>
            {reading.reflection && (
              <p className="text-xs text-white/40 mt-1.5 italic leading-relaxed border-t border-cosmic-border/40 pt-1.5">
                ✦ {reading.reflection}
              </p>
            )}
          </div>
        </div>
      )}

      <Routes>
        <Route
          path="/"
          element={
            <main className="flex flex-col flex-1 overflow-hidden">
              <WeeklyStrip />
              <div className="flex flex-1 overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4">
                  <Calendar />
                </div>
                <div className="w-96 overflow-y-auto border-l border-cosmic-border">
                  <DayPanel />
                </div>
              </div>
            </main>
          }
        />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/settings" element={<CycleSettings />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return <Layout />;
}
