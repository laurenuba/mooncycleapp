/**
 * Calculates real astronomical moon phase for a given date.
 * Returns a value 0–1 (0 = new moon, 0.5 = full moon).
 */
export function getMoonPhase(date) {
  const d = new Date(date);
  // Known new moon: January 6, 2000 at 18:14 UTC
  const knownNewMoon = new Date('2000-01-06T18:14:00Z');
  const synodicPeriod = 29.53058867; // days
  const diffMs = d.getTime() - knownNewMoon.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  const phase = ((diffDays % synodicPeriod) + synodicPeriod) % synodicPeriod;
  return phase / synodicPeriod; // 0 to 1
}

/**
 * Returns moon phase name and emoji.
 */
export function getMoonPhaseName(date) {
  const p = getMoonPhase(date);
  if (p < 0.03 || p >= 0.97) return { name: 'New Moon', emoji: '🌑' };
  if (p < 0.22) return { name: 'Waxing Crescent', emoji: '🌒' };
  if (p < 0.28) return { name: 'First Quarter', emoji: '🌓' };
  if (p < 0.47) return { name: 'Waxing Gibbous', emoji: '🌔' };
  if (p < 0.53) return { name: 'Full Moon', emoji: '🌕' };
  if (p < 0.72) return { name: 'Waning Gibbous', emoji: '🌖' };
  if (p < 0.78) return { name: 'Last Quarter', emoji: '🌗' };
  return { name: 'Waning Crescent', emoji: '🌘' };
}

/**
 * SVG moon shape for a given phase (0–1).
 */
export function MoonSVG({ phase, size = 24, className = '' }) {
  const p = phase;
  let d;
  if (p < 0.5) {
    const wax = (0.5 - p) / 0.5;
    const cx = 50 - wax * 50;
    const rx = Math.abs(50 - cx);
    d = `M 50 10 A 40 40 0 0 1 50 90 ${rx < 2 ? 'L 50 10' : `A ${rx} 40 0 0 ${wax > 0 ? 1 : 0} 50 10`}`;
  } else {
    const wan = (p - 0.5) / 0.5;
    const cx = wan * 50;
    const rx = Math.abs(cx);
    d = `M 50 10 A 40 40 0 0 0 50 90 ${rx < 2 ? 'L 50 10' : `A ${rx} 40 0 0 ${wan > 0 ? 0 : 1} 50 10`}`;
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <circle cx="50" cy="50" r="40" fill="rgba(255,255,255,0.08)" />
      {p > 0.02 && p < 0.98 ? (
        <path d={d} fill="rgba(240,192,96,0.8)" />
      ) : p <= 0.02 ? (
        <circle cx="50" cy="50" r="40" fill="rgba(240,192,96,0.05)" />
      ) : (
        <circle cx="50" cy="50" r="40" fill="rgba(240,192,96,0.85)" />
      )}
    </svg>
  );
}
