/**
 * Energy arc prediction system.
 *
 * Base predictions come from the cycle position (phase + day).
 * After 3+ logs on the same cycle day, personal averages override the base.
 * This lets lived experience reshape the forecast over time.
 */

export const ENERGY_LEVELS = {
  1: { label: 'Deep Rest', color: '#c06080', bg: 'rgba(192,96,128,0.75)',  icon: '✦', desc: 'Turn inward. Restore.' },
  2: { label: 'Quiet',     color: '#8860c8', bg: 'rgba(136,96,200,0.75)', icon: '✦', desc: 'Gentle presence.' },
  3: { label: 'Steady',    color: '#5888b0', bg: 'rgba(88,136,176,0.75)', icon: '🌿', desc: 'Grounded momentum.' },
  4: { label: 'Rising',    color: '#40a870', bg: 'rgba(64,168,112,0.75)', icon: '🌱', desc: 'Creative fire building.' },
  5: { label: 'Peak',      color: '#f0c060', bg: 'rgba(240,192,96,0.90)', icon: '✦', desc: 'Full luminous power.' },
};

/**
 * Base energy curve — maps cycle day to 1–5 level.
 * Modelled on the four inner seasons: Winter, Spring, Summer, Autumn.
 */
export function getBaseEnergy(cycleDay, cycleLength = 28) {
  const ratio = cycleDay / cycleLength;
  if (cycleDay <= 1)  return 1; // Deep Rest — day 1, deepest inward turn
  if (cycleDay <= 4)  return 2; // Quiet — menstrual days 2-4
  if (cycleDay <= 6)  return 3; // Steady — transition out of winter
  if (ratio <= 0.40)  return 4; // Rising — follicular build (spring)
  if (ratio <= 0.57)  return 5; // Peak — ovulatory window (summer)
  if (ratio <= 0.65)  return 4; // Rising — early luteal warmth
  if (ratio <= 0.75)  return 3; // Steady — mid luteal
  if (ratio <= 0.86)  return 2; // Quiet — late luteal, Enchantress rising
  return 1;                      // Deep Rest — premenstrual threshold
}

/**
 * Computes personal energy averages from all saved logs.
 * Returns { [cycleDay]: { avg: number, count: number } }
 */
export function getLoggedEnergyAverages(logs) {
  const byDay = {};
  Object.values(logs).forEach(log => {
    const day = log.cycle_day;
    const lvl = log.energy_level;
    if (!day || !lvl) return;
    if (!byDay[day]) byDay[day] = { total: 0, count: 0 };
    byDay[day].total += lvl;
    byDay[day].count++;
  });
  const result = {};
  Object.entries(byDay).forEach(([day, d]) => {
    result[Number(day)] = { avg: d.total / d.count, count: d.count };
  });
  return result;
}

/**
 * Predict energy for a cycle day, incorporating personal history if available (≥3 logs).
 * Returns { level, label, color, bg, icon, desc, personalized }
 */
export function getPredictedEnergy(cycleDay, cycleLength = 28, loggedAverages = {}) {
  const personal = loggedAverages[cycleDay];
  let level;
  let personalized = false;

  if (personal && personal.count >= 3) {
    level = Math.round(personal.avg);
    personalized = true;
  } else {
    level = getBaseEnergy(cycleDay, cycleLength);
  }

  level = Math.max(1, Math.min(5, level));
  return { level, personalized, ...ENERGY_LEVELS[level] };
}
