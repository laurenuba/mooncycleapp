import { format, differenceInDays, parseISO } from 'date-fns';

export const PHASES = {
  menstrual: { label: 'Menstrual', color: '#c04080', bg: 'rgba(192,64,128,0.18)', days: '1–5' },
  follicular: { label: 'Follicular', color: '#6080e0', bg: 'rgba(96,128,224,0.18)', days: '6–13' },
  ovulatory: { label: 'Ovulatory', color: '#40c080', bg: 'rgba(64,192,128,0.18)', days: '14–16' },
  luteal: { label: 'Luteal', color: '#c08040', bg: 'rgba(192,128,64,0.18)', days: '17–28' },
};

/**
 * Given a calendar date, cycle start date, and cycle length,
 * returns { cycleDay, phase } or null if before cycle start.
 */
export function getCycleInfo(date, startDate, cycleLength = 28) {
  if (!startDate) return null;
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const d = typeof date === 'string' ? parseISO(date) : date;
  const daysDiff = differenceInDays(d, start);
  if (daysDiff < 0) return null;
  const cycleDay = (daysDiff % cycleLength) + 1;
  const phase = getPhaseForDay(cycleDay, cycleLength);
  return { cycleDay, phase };
}

export function getPhaseForDay(cycleDay, cycleLength = 28) {
  const ratio = cycleDay / cycleLength;
  if (cycleDay <= 5) return 'menstrual';
  if (ratio <= 0.46) return 'follicular';
  if (ratio <= 0.57) return 'ovulatory';
  return 'luteal';
}

export function getPhaseColor(phase) {
  return PHASES[phase]?.color || '#888';
}

export function getPhaseBg(phase) {
  return PHASES[phase]?.bg || 'transparent';
}

export function formatDate(date) {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'yyyy-MM-dd');
}

export function getWeekDays(date) {
  const d = typeof date === 'string' ? parseISO(date) : new Date(date);
  const day = d.getDay(); // 0=Sun
  const startOfWeek = new Date(d);
  startOfWeek.setDate(d.getDate() - day);
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    return day;
  });
}

export const SYMPTOMS = [
  { key: 'cramps', label: 'Cramps' },
  { key: 'headache', label: 'Headache' },
  { key: 'fatigue', label: 'Fatigue' },
  { key: 'bloating', label: 'Bloating' },
  { key: 'breast_tenderness', label: 'Breast tenderness' },
  { key: 'mood_swings', label: 'Mood swings' },
  { key: 'anxiety', label: 'Anxiety' },
  { key: 'insomnia', label: 'Insomnia' },
  { key: 'back_pain', label: 'Back pain' },
  { key: 'acne', label: 'Acne' },
  { key: 'low_energy', label: 'Low energy' },
  { key: 'high_energy', label: 'High energy' },
];
