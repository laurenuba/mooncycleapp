import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { formatDate } from '../utils/cycleUtils';

const CycleContext = createContext(null);

// localStorage helpers
const STORAGE_KEYS = {
  settings: 'moon_settings',
  logs: 'moon_logs',
  events: 'moon_events',
  reading: 'moon_reading_today',
};

function loadFromStorage(key, defaultValue) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (e) {
    console.error(e);
    return defaultValue;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(e);
  }
}

export function CycleProvider({ children }) {
  const [settings, setSettings] = useState(() => loadFromStorage(STORAGE_KEYS.settings, { start_date: null, cycle_length: 28 }));
  const [logs, setLogs] = useState(() => loadFromStorage(STORAGE_KEYS.logs, {}));
  const [events, setEvents] = useState(() => loadFromStorage(STORAGE_KEYS.events, []));
  const [patterns, setPatterns] = useState([]);
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [dailyReading, setDailyReading] = useState(() => loadFromStorage(STORAGE_KEYS.reading, null));
  const [loading, setLoading] = useState(true);

  // Sync settings to localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.settings, settings);
  }, [settings]);

  // Sync logs to localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.logs, logs);
  }, [logs]);

  // Sync events to localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.events, events);
  }, [events]);
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

      // Generate daily reading for today
      const { getDailyReading } = await import('../utils/dailyReading');
      const { getCycleInfo } = await import('../utils/cycleUtils');
      const today = new Date();
      const cycleInfo = settings.start_date ? getCycleInfo(today, settings.start_date, settings.cycle_length) : null;
      const reading = getDailyReading(today, cycleInfo);
      setDailyReading(reading);
      saveToStorage(STORAGE_KEYS.reading, reading);

      setLoading(false);
    };
    init();
  }, [loadSettings, loadLogs, loadEvents, loadPatterns, settings]);

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
      dailyReading,
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
