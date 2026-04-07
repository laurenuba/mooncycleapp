import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { formatDate } from '../utils/cycleUtils';

const CycleContext = createContext(null);

export function CycleProvider({ children }) {
  const [settings, setSettings] = useState({ start_date: null, cycle_length: 28 });
  const [logs, setLogs] = useState({});       // keyed by date string
  const [events, setEvents] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [loading, setLoading] = useState(true);

  // Load settings
  const loadSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.start_date) setSettings(data);
    } catch (e) { console.error(e); }
  }, []);

  // Load logs for a date range
  const loadLogs = useCallback(async (start, end) => {
    try {
      const res = await fetch(`/api/logs?start=${start}&end=${end}`);
      const data = await res.json();
      setLogs(prev => {
        const next = { ...prev };
        data.forEach(log => { next[log.date] = log; });
        return next;
      });
    } catch (e) { console.error(e); }
  }, []);

  const loadEvents = useCallback(async (month) => {
    try {
      const url = month ? `/api/events?month=${month}` : '/api/events';
      const res = await fetch(url);
      const data = await res.json();
      setEvents(data);
    } catch (e) { console.error(e); }
  }, []);

  const loadPatterns = useCallback(async () => {
    try {
      const res = await fetch('/api/insights/patterns');
      const data = await res.json();
      setPatterns(data);
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    const init = async () => {
      await Promise.all([loadSettings(), loadPatterns()]);
      // Load a wide range of logs
      const start = formatDate(new Date(new Date().getFullYear(), 0, 1));
      const end = formatDate(new Date(new Date().getFullYear(), 11, 31));
      await loadLogs(start, end);
      await loadEvents();
      setLoading(false);
    };
    init();
  }, [loadSettings, loadLogs, loadEvents, loadPatterns]);

  const saveSettings = useCallback(async (newSettings) => {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings),
    });
    setSettings(newSettings);
  }, []);

  const saveLog = useCallback(async (date, logData) => {
    await fetch(`/api/logs/${date}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logData),
    });
    setLogs(prev => ({ ...prev, [date]: { ...prev[date], ...logData, date } }));
  }, []);

  const saveEvent = useCallback(async (eventData) => {
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });
    const saved = await res.json();
    setEvents(prev => [...prev, saved]);
    return saved;
  }, []);

  const deleteEvent = useCallback(async (id) => {
    await fetch(`/api/events/${id}`, { method: 'DELETE' });
    setEvents(prev => prev.filter(e => e.id !== id));
  }, []);

  const analyzePatterns = useCallback(async () => {
    const res = await fetch('/api/insights/analyze', { method: 'POST' });
    const data = await res.json();
    if (data.patterns) setPatterns(data.patterns);
    return data;
  }, []);

  return (
    <CycleContext.Provider value={{
      settings, saveSettings,
      logs, saveLog, loadLogs,
      events, saveEvent, deleteEvent, loadEvents,
      patterns, analyzePatterns, loadPatterns,
      selectedDate, setSelectedDate,
      loading,
    }}>
      {children}
    </CycleContext.Provider>
  );
}

export function useCycle() {
  const ctx = useContext(CycleContext);
  if (!ctx) throw new Error('useCycle must be used inside CycleProvider');
  return ctx;
}
