import { Routes, Route, NavLink } from 'react-router-dom';
import { useCycle } from './context/CycleContext';
import Calendar from './components/Calendar';
import DayPanel from './components/DayPanel';
import InsightsPage from './pages/InsightsPage';
import CycleSettings from './components/CycleSettings';
import WeeklyStrip from './components/WeeklyStrip';

function Layout() {
  const { loading, settings, dailyReading } = useCycle();

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

      {/* Daily Reading */}
      {dailyReading && (
        <div className="border-b border-cosmic-border px-6 py-4 bg-gradient-to-r from-cosmic-card/50 to-transparent">
          <div className="max-w-4xl mx-auto">
            <div className="text-xs text-white/40 uppercase tracking-widest mb-1.5">Today's Reading</div>
            <div className="space-y-2">
              {dailyReading.lunar && (
                <div className="text-sm text-white/80 leading-relaxed">
                  <span className="text-cosmic-gold font-semibold">Lunar:</span> {dailyReading.lunar}
                </div>
              )}
              {dailyReading.cycle && (
                <div className="text-sm text-white/80 leading-relaxed">
                  <span className="text-cosmic-gold font-semibold">Cycle:</span> {dailyReading.cycle}
                </div>
              )}
            </div>
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
