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

/**
 * BODY_SIGNALS — formerly "symptoms".
 * Framed as signals the body sends, not problems to fix.
 * Grouped by category. Keys must stay stable (stored in logs).
 *
 * Hormone correlations from literature:
 * - Low oestrogen (menstrual/late luteal): fatigue, low libido, low mood, sensitivity
 * - Rising oestrogen (follicular): energy, motivation, desire, social hunger
 * - Oestrogen peak + LH surge (ovulatory): desire peaks, confidence, extroversion
 * - Progesterone rise (luteal): calm, drowsy, sweet cravings, breast fullness, bloating
 * - Progesterone drop (late luteal): anxiety, irritability, disrupted sleep, sensitivity
 * - Prostaglandins (menstrual): cramps, lower back, digestive changes, headaches
 */
export const BODY_SIGNAL_GROUPS = [
  {
    group: 'Physical',
    signals: [
      { key: 'cramps', label: 'Cramps / pelvic pain' },
      { key: 'back_pain', label: 'Lower back heaviness' },
      { key: 'headache', label: 'Headache / migraine' },
      { key: 'bloating', label: 'Bloating / fullness' },
      { key: 'breast_tenderness', label: 'Breast tenderness' },
      { key: 'acne', label: 'Skin flaring' },
      { key: 'digestive_changes', label: 'Digestive changes' },
      { key: 'joint_aches', label: 'Joint / muscle aches' },
    ],
  },
  {
    group: 'Energy & Mind',
    signals: [
      { key: 'low_energy', label: 'Low energy' },
      { key: 'high_energy', label: 'Radiant energy' },
      { key: 'sharp_focus', label: 'Sharp focus' },
      { key: 'low_motivation', label: 'Low motivation' },
      { key: 'creative_spark', label: 'Creative spark' },
      { key: 'brain_fog', label: 'Brain fog' },
      { key: 'vivid_dreams', label: 'Vivid dreams' },
      { key: 'insomnia', label: 'Disrupted sleep' },
    ],
  },
  {
    group: 'Emotional',
    signals: [
      { key: 'tender_heart', label: 'Tender / sensitive heart' },
      { key: 'mood_swings', label: 'Emotional waves' },
      { key: 'anxiety', label: 'Anxiety / unease' },
      { key: 'irritability', label: 'Irritability / sharp edges' },
      { key: 'deep_calm', label: 'Deep calm' },
      { key: 'grief_surfacing', label: 'Grief or old feelings surfacing' },
      { key: 'joy_aliveness', label: 'Joy / aliveness' },
      { key: 'need_solitude', label: 'Craving solitude' },
    ],
  },
  {
    group: 'Sensual & Relational',
    signals: [
      { key: 'desire', label: 'Desire / arousal' },
      { key: 'low_libido', label: 'Low libido' },
      { key: 'social_hunger', label: 'Craving connection' },
      { key: 'need_solitude', label: 'Craving solitude' },
      { key: 'magnetism', label: 'Feeling magnetic' },
      { key: 'craving_touch', label: 'Craving touch / held' },
    ],
  },
  {
    group: 'Appetite & Cravings',
    signals: [
      { key: 'craving_sweet', label: 'Sweet cravings' },
      { key: 'craving_salt', label: 'Salt / savoury cravings' },
      { key: 'craving_warmth', label: 'Craving warm / nourishing food' },
      { key: 'appetite_low', label: 'Low appetite' },
      { key: 'appetite_high', label: 'Increased appetite' },
    ],
  },
];

// Flat list for backward-compat with pattern detection and log storage
export const SYMPTOMS = BODY_SIGNAL_GROUPS.flatMap(g => g.signals)
  .filter((s, i, arr) => arr.findIndex(x => x.key === s.key) === i); // dedupe need_solitude
