import { getMoonPhaseName } from './moonPhase';
import { getCycleInfo, PHASES } from './cycleUtils';

const LUNAR_READINGS = {
  'New Moon': [
    '🌑 Plant seeds of intention today. New beginnings are calling.',
    '🌑 Rest in the darkness. This is a time for reflection and release.',
    '🌑 Set your clearest intention. The universe is listening.',
    '🌑 Surrender to the unknown. Trust the cycle.',
  ],
  'Waxing Crescent': [
    '🌒 Water your intentions with action. Small steps lead far.',
    '🌒 Trust your emerging desires. Build momentum.',
    '🌒 Invite growth into your life. You are becoming.',
    '🌒 Take a leap of faith. The energy supports you.',
  ],
  'First Quarter': [
    '🌓 Face a challenge with courage. You are stronger than you know.',
    '🌓 Take decisive action. The time for thought has passed.',
    '🌓 Push through resistance. Growth lives on the other side.',
    '🌓 Commit to what matters. Half measures won\'t suffice.',
  ],
  'Waxing Gibbous': [
    '🌔 Refine your vision. Almost there. Fine-tune your approach.',
    '🌔 Tend to what you\'ve planted. Nurture your creations.',
    '🌔 Your effort is visible now. Keep the momentum going.',
    '🌔 See the light. You\'re closer than you think.',
  ],
  'Full Moon': [
    '🌕 You are luminous. Celebrate your fullness.',
    '🌕 Everything is illuminated. See the truth of your power.',
    '🌕 Release what no longer serves. Make space for new magic.',
    '🌕 Your harvest is here. Receive what you\'ve created.',
  ],
  'Waning Gibbous': [
    '🌖 Give back. Share your light with others.',
    '🌖 Gratitude amplifies magic. Acknowledge the gifts.',
    '🌖 Wisdom is dawning. Listen to what you\'ve learned.',
    '🌖 Slow down. Your energy is being refined.',
  ],
  'Last Quarter': [
    '🌗 Let go. What needs to die is making space for rebirth.',
    '🌗 Forgive yourself and others. Release the weight.',
    '🌗 Reflect on the cycle. What wisdom will you carry forward?',
    '🌗 Clear the old. You are preparing new ground.',
  ],
  'Waning Crescent': [
    '🌘 Rest is not laziness. Restoration is sacred work.',
    '🌘 Dream of what\'s possible. Your intuition glows.',
    '🌘 Trust the darkness before the dawn. All is well.',
    '🌘 Prepare for renewal. The next cycle begins soon.',
  ],
};

const CYCLE_PHASE_INSIGHTS = {
  menstrual: [
    'Your power flows inward. Honor your need for rest and reflection.',
    'This is sacred downtime. Release what no longer serves you.',
    'Listen to your body. Your wisdom is strongest now.',
    'Retreat and renew. You are planting seeds of transformation.',
  ],
  follicular: [
    'Your energy is rising. Channel it into new beginnings.',
    'This is your creative spark. What wants to be born?',
    'Your optimism is magnetic. People feel your lightness.',
    'Plant your seeds now. The soil is fertile for growth.',
  ],
  ovulatory: [
    'You are at your peak. This is your time to shine and lead.',
    'Your magnetism is undeniable. Use it wisely and joyfully.',
    'This is your power phase. Speak your truth boldly.',
    'Your presence matters. Step into full visibility today.',
  ],
  luteal: [
    'Turn inward with purpose. Your second wind is productive and wise.',
    'Your discernment is sharp. Trust your instincts now.',
    'Slow intentions are strongest. Deep work calls you.',
    'Rest when called. Your needs matter as much as your output.',
  ],
};

/**
 * Get a daily reading based on moon phase and cycle phase.
 * Uses date and seeded randomization for consistency throughout the day.
 */
export function getDailyReading(date, cycleInfo) {
  const d = typeof date === 'string' ? new Date(date) : date;
  const dateString = d.toISOString().split('T')[0];

  // Seed random number generator based on date
  const seed = dateString.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const seededRandom = (seed % 100) / 100;

  const moonInfo = getMoonPhaseName(d);
  const lunarReading =
    LUNAR_READINGS[moonInfo.name][
      Math.floor(seededRandom * LUNAR_READINGS[moonInfo.name].length)
    ];

  const cycleReading = cycleInfo
    ? CYCLE_PHASE_INSIGHTS[cycleInfo.phase][
        Math.floor(seededRandom * CYCLE_PHASE_INSIGHTS[cycleInfo.phase].length)
      ]
    : null;

  return {
    lunar: lunarReading,
    cycle: cycleReading,
    moonPhase: moonInfo.name,
    cyclePhase: cycleInfo?.phase,
  };
}
