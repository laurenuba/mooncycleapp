/**
 * Phase recommendations with Ayurvedic, TCM, and cycle-wisdom prevention guidance.
 *
 * Prevention philosophy: the cycle's intensity (cramps, mood swings, fatigue) is
 * not inevitable — it's often the body's response to accumulated imbalance.
 * Ayurveda, TCM, and cycle awareness all point to the same truth:
 * support the phase *before* it arrives and you change what it feels like.
 *
 * Doshas map loosely to phases:
 * - Menstrual: Vata (movement, release, cold, dryness) — warm, grounding, oily
 * - Follicular: Kapha lifting into Pitta — light, stimulating, fresh
 * - Ovulatory: Pitta peak (fire, intensity, transformation) — cooling, hydrating
 * - Luteal: Vata rising again — grounding, nourishing, warm, sweet
 *
 * TCM: the cycle is governed by Blood, Yin, Yang, and Qi.
 * Supporting each phase prevents deficiency in the next.
 */

export const RECOMMENDATIONS = {
  menstrual: {
    wisdom: {
      theme: 'Winter · Vata · Yin at its deepest',
      prevention: [
        'To ease cramps: reduce Vata with warmth, oil, and stillness. Castor oil packs on the abdomen 2–3 days before bleeding is a classical Ayurvedic protocol.',
        'TCM views menstrual pain as Blood stagnation — warming herbs (ginger, cinnamon), gentle movement, and avoiding cold food and cold environments in the days before your bleed helps Blood flow freely.',
        'Magnesium glycinate (200–400mg) taken from mid-luteal onwards consistently reduces cramping and mood disruption by the next cycle.',
        'Replenish iron and blood-building foods now — your body is literally building itself back up.',
      ],
    },
    work: {
      stars: 2,
      green: ['Gentle admin tasks', 'Journaling & reflection', 'Planning future projects', 'Slow creative brainstorming', 'Dreaming without pressure'],
      avoid: ['High-stakes presentations', 'New project launches', 'Difficult negotiations', 'Filling every hour'],
    },
    social: {
      stars: 2,
      green: ['Quiet 1:1 conversations', 'Cosy catch-ups at home', 'Solo time without guilt', 'Deep conversations with close friends'],
      avoid: ['Large social events', 'Networking', 'Conflict-heavy conversations', 'People-pleasing'],
    },
    selfCare: {
      stars: 5,
      green: [
        'Castor oil pack on lower abdomen — classical Ayurvedic practice for easing release',
        'Warm sesame oil self-massage (Abhyanga) — grounds Vata, reduces pain signals',
        'Warm baths with Epsom salt + rose oil',
        'Yin yoga or yoga nidra — deep parasympathetic rest',
        'Napping freely, sleeping more than usual',
        'Red raspberry leaf tea — uterine tonic (TCM: Blood moving)',
        'Moxibustion at Ren 4 (lower abdomen) — traditional for warmth and relief',
        'Journaling by candlelight — honour the visionary time',
      ],
      avoid: ['Cold foods and drinks — constrict blood flow', 'Vigorous exercise', 'Overcommitting', 'Screens before sleep'],
    },
    creative: {
      stars: 4,
      green: ['Poetry or prose', 'Dream journaling', 'Intuitive painting', 'Music that moves you', 'Voice memos of visions'],
      avoid: ['Technical, deadline-driven work', 'Perfectionism', 'Comparing your output'],
    },
    fitness: {
      stars: 2,
      green: ['Yin yoga', 'Light walking in nature', 'Gentle stretching', 'Swimming if it feels good', 'Restorative poses'],
      avoid: ['HIIT', 'Heavy lifting', 'Long runs', 'Anything that depletes rather than restores'],
    },
    food: [
      { name: 'Dark chocolate', color: '#c04080', tag: 'magnesium → eases cramps' },
      { name: 'Beets', color: '#c04080', tag: 'iron + Blood building (TCM)' },
      { name: 'Spinach & nettles', color: '#40c080', tag: 'iron + chlorophyll' },
      { name: 'Ginger tea', color: '#c08040', tag: 'anti-spasmodic · warms uterus' },
      { name: 'Wild salmon', color: '#c04080', tag: 'omega-3 → reduces prostaglandins' },
      { name: 'Black sesame', color: '#8860c8', tag: 'Kidney Yin tonic (TCM)' },
      { name: 'Bone broth', color: '#c08040', tag: 'rebuilds Blood + minerals' },
      { name: 'Red dates (jujube)', color: '#c04080', tag: 'Blood tonic (TCM)' },
      { name: 'Pumpkin seeds', color: '#40c080', tag: 'zinc · phase 1 seed cycling' },
      { name: 'Cinnamon', color: '#c08040', tag: 'warms + moves stagnation' },
    ],
  },

  follicular: {
    wisdom: {
      theme: 'Spring · Kapha → Pitta · Yin rising into Yang',
      prevention: [
        'This is your window to build foundations for the whole month. Good sleep, stress management, and nourishing food during follicular determines how smooth ovulation and the luteal phase will feel.',
        'Seed cycling: flaxseeds + pumpkin seeds in follicular phase support oestrogen production via phytooestrogens and zinc.',
        'In Ayurveda, spring (Kapha season) calls for lightening and stimulating — move your body, try new things, avoid heaviness.',
        'Rising oestrogen naturally increases motivation and social desire — ride this wave without burning through it before ovulation.',
      ],
    },
    work: {
      stars: 4,
      green: ['Brainstorming sessions', 'Starting new projects', 'Learning new skills', 'Strategy meetings', 'Pitching ideas'],
      avoid: ['Getting stuck in repetitive tasks if you can help it'],
    },
    social: {
      stars: 4,
      green: ['Networking events', 'Meeting new people', 'Group activities', 'First dates', 'Trying new places'],
      avoid: [],
    },
    selfCare: {
      stars: 3,
      green: [
        'Dry brushing — stimulates lymph and circulation (Ayurvedic Garshana)',
        'Morning sunlight — regulates circadian rhythms and supports oestrogen',
        'Seed cycling: 1 tbsp each ground flax + pumpkin seeds daily',
        'Light face massage with rosehip or marula oil — skin renewal is highest now',
        'Vision journaling — write what you want this cycle to bring',
        'Cold morning shower to wake the body fully',
      ],
      avoid: ['Heavy, oily meals', 'Oversleeping', 'Neglecting morning movement'],
    },
    creative: {
      stars: 5,
      green: ['Ideation sprints', 'Writing first drafts', 'New art projects', 'Learning instruments', 'Beginning anything you\'ve been delaying'],
      avoid: [],
    },
    fitness: {
      stars: 4,
      green: ['Running', 'Dance classes', 'Strength training', 'Group fitness', 'Hiking', 'Trying a new class'],
      avoid: ['Overtraining — energy is building, not at peak yet'],
    },
    food: [
      { name: 'Sprouted seeds', color: '#6080e0', tag: 'enzymatic · Kapha-reducing' },
      { name: 'Broccoli + cauliflower', color: '#40c080', tag: 'DIM → oestrogen metabolism' },
      { name: 'Kimchi & miso', color: '#6080e0', tag: 'gut microbiome → hormone clearance' },
      { name: 'Ground flaxseed', color: '#c08040', tag: 'lignans · seed cycling phase 1' },
      { name: 'Eggs', color: '#f0c060', tag: 'choline → liver detox' },
      { name: 'Citrus', color: '#f0c060', tag: 'vitamin C → supports ovulation' },
      { name: 'Artichoke', color: '#40c080', tag: 'liver support → hormone clearance' },
      { name: 'Green tea', color: '#40c080', tag: 'EGCG → antioxidant' },
      { name: 'Almonds', color: '#c08040', tag: 'vitamin E · seed cycling support' },
      { name: 'Nettle tea', color: '#40c080', tag: 'mineral-rich · kidney tonic' },
    ],
  },

  ovulatory: {
    wisdom: {
      theme: 'Summer · Pitta · Yang at its peak',
      prevention: [
        'Ovulatory Pitta can tip into excess heat — irritability, inflammation, pushing too hard. Cool and hydrate: cucumber, coconut water, mint, swimming.',
        'The oestrogen + testosterone peak also peaks desire and confidence. This is not accidental — it is biological. Honour it consciously rather than suppressing or ignoring it.',
        'Prepare for the luteal phase now: add magnesium and B6 this week to smooth the progesterone transition. TCM advises supporting Kidney Yang here.',
        'Avoid rushing past this phase — its abundance is medicine for the rest of the month.',
      ],
    },
    work: {
      stars: 5,
      green: ['Big presentations', 'Negotiations', 'Leadership moments', 'Public speaking', 'Launching projects', 'Difficult conversations'],
      avoid: ['Hiding away — this is peak charisma and persuasion time'],
    },
    social: {
      stars: 5,
      green: ['Big parties', 'Dates', 'Collaborative work', 'Team-building', 'Performance', 'Hosting'],
      avoid: [],
    },
    selfCare: {
      stars: 3,
      green: [
        'Swim or bathe — water cools Pitta excess',
        'Seed cycling: 1 tbsp each ground sesame + sunflower seeds daily',
        'Sheetali pranayama — cooling breath for Pitta balance',
        'Rose water mist — cooling, heart-opening',
        'Embrace and express desire — it is hormonal intelligence, not distraction',
        'Coconut oil pulling — detox when Pitta/lymph is high',
      ],
      avoid: ['Overcommitting to everyone', 'Spicy food in excess', 'Skimping on sleep'],
    },
    creative: {
      stars: 4,
      green: ['Collaboration', 'Performance art', 'Public creative sharing', 'Music recording', 'Speaking your ideas aloud'],
      avoid: [],
    },
    fitness: {
      stars: 5,
      green: ['HIIT', 'Strength PRs', 'Competitive sports', 'Long hikes', 'Hot yoga', 'Dancing'],
      avoid: ['Ignoring hydration — Pitta dehydrates fast'],
    },
    food: [
      { name: 'Berries', color: '#40c080', tag: 'antioxidants → reduce inflammation' },
      { name: 'Cucumber', color: '#40c080', tag: 'cooling Pitta · hydrating' },
      { name: 'Asparagus', color: '#40c080', tag: 'folate · supports ovulation' },
      { name: 'Coconut water', color: '#6080e0', tag: 'electrolytes · Pitta cooling' },
      { name: 'Sesame seeds', color: '#c08040', tag: 'zinc · seed cycling phase 2' },
      { name: 'Avocado', color: '#40c080', tag: 'healthy fats → progesterone precursor' },
      { name: 'Pomegranate', color: '#c04080', tag: 'antioxidant · Blood tonic (TCM)' },
      { name: 'Sunflower seeds', color: '#f0c060', tag: 'vitamin E · seed cycling phase 2' },
      { name: 'Mint + coriander', color: '#40c080', tag: 'cooling herbs · Pitta balance' },
      { name: 'Watermelon', color: '#c04080', tag: 'deep hydration · cooling' },
    ],
  },

  luteal: {
    wisdom: {
      theme: 'Autumn · Vata rising · Yang declining into Yin',
      prevention: [
        'The late luteal is where most cycle distress concentrates — but it is built in the weeks before. The most powerful intervention is mid-cycle: magnesium, B6, and reducing sugar + alcohol.',
        'Vata rises in the premenstrual phase causing anxiety, insomnia, and racing thoughts. Grounding practices (oil massage, warm food, early sleep, abhyanga) are preventive, not just palliative.',
        'TCM: late luteal is Liver Qi stagnation territory. Acupuncture at Liver 3, gentle inversions, and liver-supporting herbs (dandelion, milk thistle) ease the transition.',
        'Progesterone is calming — its drop in late luteal is the root of premenstrual symptoms. Chasteberry (vitex), evening primrose oil, and reduced stress support progesterone levels over time.',
      ],
    },
    work: {
      stars: 3,
      green: ['Detail work', 'Editing & refining', 'Completing tasks', 'Organising systems', 'Tying up loose ends'],
      avoid: ['Major new decisions in late luteal', 'Overloading the calendar', 'Starting what you cannot finish'],
    },
    social: {
      stars: 3,
      green: ['Close friends only', 'Cosy dinners', 'Meaningful 1:1 conversations', 'Saying no to what feels too much'],
      avoid: ['Draining social obligations', 'Large events if you feel withdrawing', 'Pretending you\'re fine when you\'re not'],
    },
    selfCare: {
      stars: 4,
      green: [
        'Warm sesame or almond oil Abhyanga — grounding Vata, soothing nervous system',
        'Magnesium glycinate before bed — reduces anxiety, improves sleep quality',
        'Castor oil pack on liver (right side, below ribcage) — Liver Qi support (TCM)',
        'Legs-up-the-wall pose (Viparita Karani) — calms nervous system, reduces oedema',
        'Reduce caffeine — spikes cortisol and worsens Vata/anxiety',
        'Early, consistent sleep — progesterone peaks at night; disruption worsens PMS',
        'Chamomile + ashwagandha tea — nervine + adaptogen for Vata calming',
        'Journaling difficult feelings — the Enchantress is seeing clearly; give her a page',
      ],
      avoid: ['Alcohol — crashes blood sugar and worsens mood', 'Skipping meals', 'Late nights', 'Suppressing difficult feelings'],
    },
    creative: {
      stars: 3,
      green: ['Editing existing work', 'Organising creative files', 'Detailed craft work', 'Cooking nourishing meals'],
      avoid: ['Expecting big new ideas — save those for follicular', 'Judging what you made earlier in the cycle'],
    },
    fitness: {
      stars: 3,
      green: ['Pilates', 'Yin yoga', 'Walking — especially in nature', 'Swimming', 'Moderate strength training', 'Inversions'],
      avoid: ['Intense HIIT in late luteal', 'Pushing through fatigue signals', 'Comparing performance to ovulatory phase'],
    },
    food: [
      { name: 'Sweet potato', color: '#c08040', tag: 'complex carbs → serotonin' },
      { name: 'Dark leafy greens', color: '#40c080', tag: 'calcium + magnesium' },
      { name: 'Oats', color: '#c08040', tag: 'B vitamins → serotonin support' },
      { name: 'Walnuts', color: '#c08040', tag: 'omega-3 → reduces inflammation' },
      { name: 'Turmeric + black pepper', color: '#f0c060', tag: 'anti-inflammatory · Liver support' },
      { name: 'Chamomile tea', color: '#f0c060', tag: 'nervine calming · Vata' },
      { name: 'Chickpeas', color: '#c08040', tag: 'B6 → progesterone support' },
      { name: 'Ashwagandha', color: '#c08040', tag: 'adaptogen · cortisol regulation' },
      { name: 'Dandelion root tea', color: '#f0c060', tag: 'liver detox · reduces bloating' },
      { name: 'Cacao + maca', color: '#c04080', tag: 'magnesium + hormone adaptogen' },
    ],
  },
};

export function getRecommendations(phase, patterns = [], cycleDay) {
  const base = RECOMMENDATIONS[phase] || RECOMMENDATIONS.follicular;
  const rec = JSON.parse(JSON.stringify(base));

  if (patterns.length > 0) {
    const dayPatterns = patterns.filter(p => p.cycle_day === cycleDay);
    dayPatterns.forEach(p => {
      if (p.symptom === 'high_energy_pattern' || p.symptom === 'radiant_energy') {
        rec.work.stars = Math.min(5, rec.work.stars + 1);
        rec.fitness.stars = Math.min(5, rec.fitness.stars + 1);
      }
      if (['low_energy_pattern', 'fatigue', 'low_energy', 'low_motivation'].includes(p.symptom)) {
        rec.work.stars = Math.max(1, rec.work.stars - 1);
        rec.fitness.stars = Math.max(1, rec.fitness.stars - 1);
        rec.selfCare.stars = Math.min(5, rec.selfCare.stars + 1);
      }
      if (['anxiety', 'mood_swings', 'irritability', 'tender_heart'].includes(p.symptom)) {
        rec.social.stars = Math.max(1, rec.social.stars - 1);
        rec.selfCare.stars = Math.min(5, rec.selfCare.stars + 1);
      }
      if (['desire', 'magnetism'].includes(p.symptom)) {
        rec.social.stars = Math.min(5, rec.social.stars + 1);
      }
      if (['need_solitude', 'brain_fog'].includes(p.symptom)) {
        rec.social.stars = Math.max(1, rec.social.stars - 1);
      }
    });
  }

  return rec;
}

export const BEST_DAY_CATEGORIES = [
  { key: 'work', label: 'Big work task', icon: '💼' },
  { key: 'social', label: 'Social event', icon: '🎉' },
  { key: 'creative', label: 'Creative project', icon: '🎨' },
  { key: 'fitness', label: 'Intense workout', icon: '🏋️' },
  { key: 'selfcare', label: 'Rest day', icon: '🛁' },
  { key: 'romance', label: 'Date night', icon: '💕' },
  { key: 'travel', label: 'Travel', icon: '✈️' },
  { key: 'medical', label: 'Medical appt', icon: '🩺' },
];

export const BEST_DAY_PHASE_MAP = {
  work: 'ovulatory',
  social: 'ovulatory',
  creative: 'follicular',
  fitness: 'ovulatory',
  selfcare: 'menstrual',
  romance: 'ovulatory',
  travel: 'follicular',
  medical: 'follicular',
};
