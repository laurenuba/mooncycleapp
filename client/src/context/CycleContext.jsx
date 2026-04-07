import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { formatDate } from '../utils/cycleUtils';

const CycleContext = createContext(null);

const STORAGE_KEYS = {
  settings: 'moon_settings',
  logs: 'moon_logs',
  events: 'moon_events',
  patterns: 'moon_patterns',
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

let eventIdCounter = Date.now();

export function CycleProvider({ children }) {
  const [settings, setSettings] = useState(() => loadFromStorage(STORAGE_KEYS.settings, { start_date: null, cycle_length: 28 }));
  const [logs, setLogs] = useState(() => loadFromStorage(STORAGE_KEYS.logs, {}));
  const [events, setEvents] = useState(() => loadFromStorage(STORAGE_KEYS.events, []));
  const [patterns, setPatterns] = useState(() => loadFromStorage(STORAGE_KEYS.patterns, []));
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [dailyReading, setDailyReading] = useState(() => loadFromStorage(STORAGE_KEYS.reading, null));
  const [loading, setLoading] = useState(true);

  useEffect(() => { saveToStorage(STORAGE_KEYS.settings, settings); }, [settings]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.logs, logs); }, [logs]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.events, events); }, [events]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.patterns, patterns); }, [patterns]);

  const syncFromAPI = useCallback(async () => {
    try {
      const [settingsRes, patternsRes] = await Promise.all([
        fetch('/api/settings'),
        fetch('/api/insights/patterns'),
      ]);
      if (settingsRes.ok) {
        const data = await settingsRes.json();
        if (data.start_date) setSettings(data);
      }
      if (patternsRes.ok) {
        const data = await patternsRes.json();
        if (Array.isArray(data) && data.length > 0) setPatterns(data);
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    const init = async () => {
      await syncFromAPI();
      try {
        const { getDailyReading } = await import('../utils/dailyReading');
        const { getCycleInfo } = await import('../utils/cycleUtils');
        const today = new Date();
        const s = loadFromStorage(STORAGE_KEYS.settings, { start_date: null, cycle_length: 28 });
        const cycleInfo = s.start_date ? getCycleInfo(today, s.start_date, s.cycle_length) : null;
        const todayStr = today.toISOString().split("T")[0]; const storedLogs = loadFromStorage(STORAGE_KEYS.logs, {}); const symptoms = (storedLogs[todayStr]?.symptoms) || []; const reading = getDailyReading(today, cycleInfo, symptoms);
        setDailyReading(reading);
        saveToStorage(STORAGE_KEYS.reading, reading);
      } catch (e) {
        console.error('Daily reading error:', e);
      }
      setLoading(false);
    };
    init();
  }, []);

  const saveSettings = useCallback(async (newSettings) => {
    setSettings(newSettings);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
    } catch (e) {}
  }, []);

  const saveLog = useCallback(async (date, logData) => {
    setLogs(prev => ({ ...prev, [date]: { ...prev[date], ...logData, date } }));
    try {
      await fetch('/api/logs/' + date, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logData),
      });
    } catch (e) {}
  }, []);

  const loadLogs = useCallback(async (start, end) => {
    try {
      const res = await fetch('/api/logs?start=' + start + '&end=' + end);
      if (!res.ok) return;
      const data = await res.json();
      setLogs(prev => {
        const next = { ...prev };
        data.forEach(log => { next[log.date] = log; });
        return next;
      });
    } catch (e) {}
  }, []);

  const loadEvents = useCallback(async () => {
    try {
      const res = await fetch('/api/events');
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) setEvents(data);
    } catch (e) {}
  }, []);

  const saveEvent = useCallback(async (eventData) => {
    const localEvent = { ...eventData, id: eventIdCounter++ };
    setEvents(prev => [...prev, localEvent]);
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });
      if (res.ok) {
        const saved = await res.json();
        setEvents(prev => prev.map(e => e.id === localEvent.id ? saved : e));
        return saved;
      }
    } catch (e) {}
    return localEvent;
  }, []);

  const deleteEvent = useCallback(async (id) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    try {
      await fetch('/api/events/' + id, { method: 'DELETE' });
    } catch (e) {}
  }, []);

  const analyzePatterns = useCallback(async () => {
    try {
      const res = await fetch('/api/insights/analyze', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.patterns) setPatterns(data.patterns);
        return data;
      }
    } catch (e) {}
    return { success: false, message: 'Backend not available. Run the API server locally for AI pattern analysis.' };
  }, []);

  const loadPatterns = useCallback(async () => {
    try {
      const res = await fetch('/api/insights/patterns');
      if (res.ok) {
        const data = await res.json();
        setPatterns(data);
      }
    } catch (e) {}
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
