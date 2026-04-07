/**
 * Daily Reading System
 *
 * Grounded in:
 * - Wild Power (Alexandra Pope & Sjanie Hugo Wurlitzer) — four inner seasons,
 *   menstrual cycle awareness, the Cycle Powers, and the archetype map.
 * - Jane Hardwicke Collings — menstruation as spiritual practice, monthly death
 *   and rebirth, the woman as oracle, the sacred descent.
 * - The principle that the cycle is not a problem to manage but a path to power,
 *   consciousness, and self-knowledge.
 */

import { getMoonPhaseName } from './moonPhase.jsx';

// ─── LUNAR READINGS ─────────────────────────────────────────────────────────
// Each moon phase carries an invitation. These are drawn from lunar mythology,
// the Wild Power lunar awareness framework, and feminine cosmology traditions.

const LUNAR_READINGS = {
  'New Moon': [
    "The new moon holds the void — the fertile emptiness before form. This is the most powerful moment for seeding intention. What truth wants to be born through you this cycle?",
    "In many traditions, the new moon and the first day of bleeding were the same sacred threshold — the woman's body in sync with the cosmos. Whether or not you bleed today, something in you is beginning again.",
    "Darkness precedes all creation. The new moon calls you to rest in the unknown, to resist the urge to know the outcome, and to trust that what you are dreaming is already taking root.",
    "The Wise Woman and the New Moon share the same teaching: in emptiness is everything. Sit with what you cannot yet see.",
  ],
  'Waxing Crescent': [
    "A sliver of light has returned. Like the first green shoot after winter, something in you is leaning toward life. Trust this impulse — it knows where it is going.",
    "This is the time to take one small, clear action in the direction of your intention. The waxing moon amplifies energy given to new beginnings. Plant your seeds while the soil is soft.",
    "The crescent invites commitment — not the loud declaration, but the quiet, steady turning of your face toward the light. What are you choosing to grow this month?",
  ],
  'First Quarter': [
    "The first quarter moon brings tension: half-dark, half-light. This is the moon of the decision point — the moment when intention meets resistance. Push through gently but persistently.",
    "Challenges appearing now are not obstacles. They are the friction that shapes you. The quarter moon asks: what are you willing to do for what matters to you?",
    "This phase belongs to the one who keeps going — not from force, but from rootedness. Action is required now. Let your body lead.",
  ],
  'Waxing Gibbous': [
    "You are so close to fullness. Refine, adjust, and trust the process. The waxing gibbous asks you to stay patient at the threshold of completion — your effort is almost ready to bloom.",
    "Tend what you have planted with devotion. This is not the time to abandon the work — it is the time to give it your full attention. Nourishment now changes everything.",
    "Something is building to a peak within you and above you. Align your actions with your intention. The full moon is coming to illuminate all that you have grown.",
  ],
  'Full Moon': [
    "The full moon floods everything with light. What has been hidden in you is illuminated now — your gifts, your emotions, your deepest longing. Feel it all. Nothing needs to be resolved tonight.",
    "In the old ways, women gathered at the full moon to dream, to celebrate, and to release what no longer served the whole. You carry this medicine. Who in your life needs your light right now?",
    "Ovulation and the full moon share a frequency — the body at peak expression, the most giving, most magnetic, most alive. Whether you ovulate or not, this energy is available to you. Step into it.",
    "Full moons are completion points. What you set at the new moon is being revealed. Receive it — the good, the surprising, the unfinished. The cycle knows what it is doing.",
  ],
  'Waning Gibbous': [
    "The sharing begins. The full moon's bounty now flows outward. What wisdom, art, love, or truth has been fermenting in you? This is the time to give it form and offer it forward.",
    "Gratitude is a full moon practice. As the light begins to recede, count what has been given — to you, through you, from you. The harvest is not just what you made. It is who you became.",
    "Something is completing. Let yourself feel the satisfaction of what has been and the readiness for what will end. Not all cycles close with triumph — sometimes wisdom is the harvest.",
  ],
  'Last Quarter': [
    "The last quarter moon calls for an honest reckoning. The Enchantress energy is present — the one who sees through pretence, who will not tolerate the inauthentic. What needs to go?",
    "Release is not loss — it is alchemy. What you let go of at the last quarter makes room for what wants to come at the new moon. The feminine path is cyclic, not linear. Trust the letting go.",
    "This is the moon of the inner critic turned healer. If a harsh voice rises in you now, ask it what it is truly afraid of. Beneath every sharp edge is an unexpressed longing for truth.",
  ],
  'Waning Crescent': [
    "The balsamic moon — the dark resting before new beginnings. In the waning crescent, your task is surrender. Not defeat, but the sacred softening that precedes renewal. Rest now. The new moon is coming.",
    "You are between cycles — the most liminal, most visionary time. Dreams are vivid, intuition runs deep. This is not a void to endure but a well to drink from. What is the dream beneath the dream?",
    "In the deep quiet before the new moon, listen. The still small voice has been waiting for the noise to subside. She has something to tell you about the next cycle — about who you are becoming.",
  ],
};

// ─── CYCLE PHASE READINGS ────────────────────────────────────────────────────
// Drawn from Wild Power's four inner seasons and archetypes,
// and Jane Hardwicke Collings' spiritual practice of menstruation.

const CYCLE_PHASE_READINGS = {
  // WINTER — The Wise Woman / The Oracle
  // Menstruation as spiritual threshold: dissolution, visionary insight, rest.
  // "The menstruating woman was considered the most psychically powerful at this time."
  // — Jane Hardwicke Collings
  menstrual: {
    early: [ // Days 1-2: The threshold
      "You are crossing the threshold. In many traditions, the first day of bleeding was a woman's new year — a monthly death and rebirth. You are not beginning a period. You are completing a cycle and stepping into a new one.",
      "The bleeding time is your most intuitive, most visionary time. Jane Hardwicke Collings calls the menstruating woman 'the oracle' — her connection to inner knowing is at its peak. If you can rest today, do. Your body is doing the most sacred work.",
      "Winter has arrived in your cycle. The Wise Woman archetype holds this phase — ancient, knowing, unattached to outcomes. She does not strive. She sees. Let her wisdom surface through the quiet.",
    ],
    mid: [ // Days 3-4: The dreaming
      "You are in the dreaming time. Alexandra Pope and Sjanie Hugo Wurlitzer describe this as the season when 'the veils between the worlds are thin' — between conscious and unconscious, between who you have been and who you are becoming. Pay attention to what surfaces now.",
      "Menstrual blood carries the wisdom of the cycle — what the body has been processing emotionally and physically. Honouring this time is not indulgence; it is a spiritual practice that returns you to yourself.",
      "The body is in full winter now. Deep rest is not passive — it is the active work of renewal. Everything that will emerge in your follicular spring is seeding itself in this darkness. Trust the process you cannot see.",
    ],
    late: [ // Day 5: Returning
      "You are beginning your return. The first stirrings of energy are like light through curtains — gentle, tentative, tender. Welcome them without rushing. The transition out of winter asks for patience.",
      "As your bleed completes, carry its wisdom forward. What did you dream? What did you feel? What truth became undeniable? The menstrual phase speaks — the rest of the cycle acts on what it said.",
    ],
  },

  // SPRING — The Maiden / The Girl
  // Rising energy, creativity, curiosity, new beginnings.
  // "Spring is the time of the girl-self — innocent, unguarded, excited by life."
  follicular: {
    early: [ // Days 6-10
      "Spring is rising in your body. Your follicular phase is the inner season of the Maiden — she is curious, playful, undefended. She reaches toward life with open hands. What excites you right now, without needing a reason?",
      "Your creative channel is opening. The follicular phase is one of the most generative times of the cycle — ideas come easily, learning feels effortless, possibilities multiply. Follow what calls you without asking where it leads.",
      "The rising tide of oestrogen is bringing you back to yourself — lighter, more social, more alive to beauty and possibility. This is the time to begin. Not the fully formed beginning, but the tentative, brave first step.",
    ],
    late: [ // Days 11-13
      "Your spring is reaching its fullness. The energy that has been quietly building is becoming visible and potent. You are entering your most magnetic, creative, communicative window of the month. What have you been afraid to say or begin?",
      "In the spring phase, the feminine principle known as Quickening is active: the quickening of life-force, of ideas, of desire. Something is asking to be born through you. Say yes to it — even imperfectly, even tentatively.",
      "Wild Power speaks of this time as the 'menstrual cycle's superpower' — the fresh-eyed, open-hearted perception that sees possibilities others miss. Your follicular phase perception is a gift. Use it to imagine your life boldly.",
    ],
  },

  // SUMMER — The Mother / The Wild Woman
  // Ovulatory peak: full expression, magnetism, leadership, giving.
  // "Summer is the time to step out, to be seen, to lead and love fully."
  ovulatory: {
    peak: [ // Days 14-16
      "You are at full summer. This is the most outward, most expressive, most luminous time of your cycle. Your voice carries further, your presence lands more powerfully, your capacity to connect is extraordinary. Do not hold yourself back today.",
      "Ovulation is the physical peak, but it is also a spiritual one. The Wild Woman archetype is fully present — she is creative, sexual, uninhibited, generous, fierce. She is not performing. She is simply fully herself. Be her today.",
      "Wild Power calls ovulation the 'Fulfilling' — the complete expression of all that you are. You do not need to manufacture this energy. It is already in you. Your task is simply to remove the obstacles that prevent it from flowing freely.",
      "In many traditions, the ovulating woman was said to hold the power of creation itself — the capacity to bring new life, new ideas, new realities into being. Whatever you are making right now, you are making it with your whole being. Give it everything.",
    ],
  },

  // AUTUMN — The Enchantress / The Witch
  // Luteal: distillation, critical awareness, truth-telling, preparation.
  // "The autumn is the most misunderstood phase — her gifts are hidden in her demands."
  luteal: {
    early: [ // Days 17-21
      "You have passed the peak and entered your inner autumn. The Enchantress is beginning to stir — the part of you that sees clearly, that knows what is real and what is performance, that will not pretend. This is a gift, not a problem.",
      "Your luteal phase is the season of distillation. The harvest of your whole cycle is being gathered. What you have learned, created, and felt is being integrated. Allow the inward turning — it is purposeful.",
      "Early autumn holds a particular kind of warmth — the golden afternoon energy before the days shorten. Your focus is sharper, your work is more refined, your capacity for depth is at its highest. This is an extraordinary time for careful, meaningful work.",
    ],
    mid: [ // Days 22-25
      "You are in the heart of your inner autumn. The Enchantress is fully present now — she sees what is misaligned, what is false, what needs to change. When she speaks harshly, ask: what does she actually want? Often it is honesty, beauty, or rest.",
      "This phase has been called 'the second awareness' — a heightened sensitivity to what is true and what is not. You may feel less tolerant of noise, inauthenticity, or commitments that no longer serve you. These feelings are data, not dysfunction.",
      "Wild Power teaches that the premenstrual phase carries the power to 'break the spell' — to see through social masks and habitual patterns to the truth beneath. What spell needs breaking in your life right now?",
    ],
    late: [ // Days 26-end
      "You are approaching the threshold. The late luteal phase is the most liminal, most visionary, and often most tender time. Your nervous system is sensitive, your dreams are vivid, your need for solitude and truth is at its peak.",
      "Jane Hardwicke Collings calls the premenstrual time 'the wise bleeding ground' — the place where what has accumulated in you over the month is brought to the surface for release. The bleed will take it. You don't have to carry it much longer.",
      "The Enchantress at her most powerful is not the rage or the weeping — it is the clarity. The absolute, uncompromising knowing of what matters. Listen to her now, before the cycle turns. She is telling you something important.",
    ],
  },
};

// Reflections from logs — insights that surface based on what a user has logged
const REFLECTION_SEEDS = {
  high_energy: "Your logs tell you something important: even on days when the calendar says rest, your body sometimes has its own knowing. Trust your direct experience over the template.",
  low_energy: "You've noticed energy dips that don't always follow the expected arc. Your body is tracking something subtle. The gift of cycle awareness is this: over time, your personal map becomes far more useful than the general one.",
  cramps: "Your body speaks loudly in this season. The menstrual experience, including pain, has been described by many women as holding a teaching — a demand for presence, for slowing, for listening to what the body knows.",
  mood_swings: "Emotional intensity is not a symptom to suppress — in the cycle wisdom tradition, it is a form of perception. The feelings rising in you now are often accurate. Let them speak before acting on them.",
  insomnia: "Sleep disturbances in the luteal and premenstrual phase often signal heightened inner activity — dreaming, processing, downloading. Keep a journal nearby. The night-mind has its own intelligence.",
  anxiety: "Anxiety in the late luteal phase is often the Enchantress speaking without words — something needs to change and the body knows it before the mind does. What do you already know that you haven't yet admitted?",
};

/**
 * Build a reading for a given date and cycle state.
 * Optionally accepts logged symptoms to surface reflection seeds.
 */
export function getDailyReading(date, cycleInfo, loggedSymptoms = []) {
  const d = typeof date === 'string' ? new Date(date) : date;
  const dateStr = d.toISOString().split('T')[0];

  // Deterministic but varied selection based on date
  const seed = dateStr.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const pick = (arr) => arr[seed % arr.length];

  const moonInfo = getMoonPhaseName(d);
  const lunar = pick(LUNAR_READINGS[moonInfo.name]);

  let cycle = null;
  if (cycleInfo?.phase) {
    const { phase, cycleDay, cycleLength = 28 } = cycleInfo;
    const ratio = cycleDay / cycleLength;

    if (phase === 'menstrual') {
      if (cycleDay <= 2) cycle = pick(CYCLE_PHASE_READINGS.menstrual.early);
      else if (cycleDay <= 4) cycle = pick(CYCLE_PHASE_READINGS.menstrual.mid);
      else cycle = pick(CYCLE_PHASE_READINGS.menstrual.late);
    } else if (phase === 'follicular') {
      if (ratio <= 0.35) cycle = pick(CYCLE_PHASE_READINGS.follicular.early);
      else cycle = pick(CYCLE_PHASE_READINGS.follicular.late);
    } else if (phase === 'ovulatory') {
      cycle = pick(CYCLE_PHASE_READINGS.ovulatory.peak);
    } else if (phase === 'luteal') {
      if (ratio <= 0.68) cycle = pick(CYCLE_PHASE_READINGS.luteal.early);
      else if (ratio <= 0.82) cycle = pick(CYCLE_PHASE_READINGS.luteal.mid);
      else cycle = pick(CYCLE_PHASE_READINGS.luteal.late);
    }
  }

  // Surface a reflection if a relevant symptom was logged
  let reflection = null;
  if (loggedSymptoms.length > 0) {
    const matches = loggedSymptoms.filter(s => REFLECTION_SEEDS[s]);
    if (matches.length > 0) {
      reflection = REFLECTION_SEEDS[matches[0]];
    }
  }

  return {
    lunar,
    cycle,
    reflection,
    moonPhase: moonInfo.name,
    moonEmoji: moonInfo.emoji,
    cyclePhase: cycleInfo?.phase || null,
  };
}
