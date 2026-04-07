export const RECOMMENDATIONS = {
  menstrual: {
    work: {
      stars: 2,
      green: ['Gentle admin tasks', 'Journaling & reflection', 'Planning future projects', 'Slow creative brainstorming'],
      avoid: ['High-stakes presentations', 'New project launches', 'Difficult negotiations'],
    },
    social: {
      stars: 2,
      green: ['Quiet 1:1 conversations', 'Cozy catch-ups at home', 'Solo time guilt-free'],
      avoid: ['Large social events', 'Networking gatherings', 'Conflict-heavy conversations'],
    },
    selfCare: {
      stars: 5,
      green: ['Warm baths with Epsom salt', 'Heating pad + rest', 'Gentle yoga / yin', 'Journaling', 'Napping freely'],
      avoid: ['Vigorous exercise', 'Overcommitting', 'Skipping sleep'],
    },
    creative: {
      stars: 4,
      green: ['Poetry or prose', 'Dream journaling', 'Intuitive painting', 'Music that moves you'],
      avoid: ['Technical, deadline-driven work', 'Perfectionism'],
    },
    fitness: {
      stars: 2,
      green: ['Yin yoga', 'Light walking', 'Gentle stretching', 'Swimming (if comfortable)'],
      avoid: ['HIIT', 'Heavy lifting', 'Long runs'],
    },
    food: [
      { name: 'Dark chocolate', color: '#c04080', tag: 'magnesium' },
      { name: 'Beets', color: '#c04080', tag: 'iron' },
      { name: 'Spinach', color: '#40c080', tag: 'iron' },
      { name: 'Ginger tea', color: '#c08040', tag: 'anti-cramp' },
      { name: 'Salmon', color: '#c04080', tag: 'omega-3' },
      { name: 'Lentils', color: '#c08040', tag: 'iron + protein' },
      { name: 'Raspberries', color: '#c04080', tag: 'antioxidants' },
      { name: 'Pumpkin seeds', color: '#40c080', tag: 'zinc' },
    ],
  },
  follicular: {
    work: {
      stars: 4,
      green: ['Brainstorming sessions', 'Starting new projects', 'Learning & skill-building', 'Strategy meetings'],
      avoid: ['Repetitive routine work (if possible)'],
    },
    social: {
      stars: 4,
      green: ['Networking events', 'Meeting new people', 'Group activities', 'First dates'],
      avoid: [],
    },
    selfCare: {
      stars: 3,
      green: ['Try something new', 'Morning routines', 'Skin care rituals', 'Vision boarding'],
      avoid: ['Neglecting sleep in favor of social plans'],
    },
    creative: {
      stars: 5,
      green: ['Ideation sprints', 'Writing first drafts', 'New art projects', 'Learning instruments'],
      avoid: [],
    },
    fitness: {
      stars: 4,
      green: ['Running', 'Dance classes', 'Strength training', 'Group fitness', 'Hiking'],
      avoid: ['Overtraining — energy is building, not peak yet'],
    },
    food: [
      { name: 'Eggs', color: '#6080e0', tag: 'choline' },
      { name: 'Broccoli', color: '#40c080', tag: 'estrogen support' },
      { name: 'Fermented foods', color: '#6080e0', tag: 'gut health' },
      { name: 'Flaxseeds', color: '#c08040', tag: 'lignans' },
      { name: 'Almonds', color: '#c08040', tag: 'vitamin E' },
      { name: 'Citrus fruits', color: '#f0c060', tag: 'vitamin C' },
      { name: 'Quinoa', color: '#6080e0', tag: 'protein' },
      { name: 'Green tea', color: '#40c080', tag: 'antioxidants' },
    ],
  },
  ovulatory: {
    work: {
      stars: 5,
      green: ['Big presentations', 'Negotiations', 'Leadership moments', 'Public speaking', 'Launching projects'],
      avoid: ['Hiding away — this is peak charisma time!'],
    },
    social: {
      stars: 5,
      green: ['Big parties', 'Dates', 'Collaborative work', 'Team-building', 'Performance'],
      avoid: [],
    },
    selfCare: {
      stars: 3,
      green: ['Channel energy productively', 'Breathwork', 'Cold plunges', 'Body movement you love'],
      avoid: ['Burning out by overcommitting to everyone'],
    },
    creative: {
      stars: 4,
      green: ['Collaboration', 'Performance art', 'Public creative sharing', 'Music recording'],
      avoid: [],
    },
    fitness: {
      stars: 5,
      green: ['HIIT', 'Strength PRs', 'Competitive sports', 'Long hikes', 'Hot yoga'],
      avoid: ["Ignoring hydration \u2014 you're working hard!"],
    },
    food: [
      { name: 'Berries', color: '#40c080', tag: 'antioxidants' },
      { name: 'Asparagus', color: '#40c080', tag: 'folate' },
      { name: 'Avocado', color: '#40c080', tag: 'healthy fats' },
      { name: 'Chickpeas', color: '#c08040', tag: 'zinc' },
      { name: 'Coconut water', color: '#6080e0', tag: 'electrolytes' },
      { name: 'Tomatoes', color: '#c04080', tag: 'lycopene' },
      { name: 'Watermelon', color: '#c04080', tag: 'hydration' },
      { name: 'Sunflower seeds', color: '#f0c060', tag: 'vitamin E' },
    ],
  },
  luteal: {
    work: {
      stars: 3,
      green: ['Detail work', 'Editing & refining', 'Completing tasks', 'Organizing systems'],
      avoid: ['Major decisions in late luteal', 'Overloading schedule'],
    },
    social: {
      stars: 3,
      green: ['Close friends only', 'Cozy dinners', 'Meaningful conversations'],
      avoid: ['Draining social obligations', 'Large events if you feel withdrawing'],
    },
    selfCare: {
      stars: 4,
      green: ['Magnesium baths', 'Reduce caffeine', 'Extra sleep', 'Journaling feelings', 'Gentle massage'],
      avoid: ['Alcohol', 'Skipping meals', 'Overworking'],
    },
    creative: {
      stars: 3,
      green: ['Editing existing work', 'Organizing creative files', 'Detailed craft work', 'Cooking'],
      avoid: ['Expecting big new ideas — save those for follicular'],
    },
    fitness: {
      stars: 3,
      green: ['Pilates', 'Yoga', 'Walking', 'Swimming', 'Moderate strength training'],
      avoid: ['Intense HIIT in late luteal', 'Pushing through fatigue signals'],
    },
    food: [
      { name: 'Sweet potato', color: '#c08040', tag: 'complex carbs' },
      { name: 'Dark leafy greens', color: '#40c080', tag: 'calcium' },
      { name: 'Banana', color: '#f0c060', tag: 'potassium' },
      { name: 'Oats', color: '#c08040', tag: 'serotonin support' },
      { name: 'Turmeric', color: '#f0c060', tag: 'anti-inflammatory' },
      { name: 'Walnuts', color: '#c08040', tag: 'omega-3' },
      { name: 'Chamomile tea', color: '#f0c060', tag: 'calming' },
      { name: 'Chickpeas', color: '#c08040', tag: 'B6' },
    ],
  },
};

export function getRecommendations(phase, patterns = [], cycleDay) {
  const base = RECOMMENDATIONS[phase] || RECOMMENDATIONS.follicular;
  const rec = JSON.parse(JSON.stringify(base)); // deep clone

  // Adjust star ratings based on personal patterns
  if (patterns.length > 0) {
    const dayPatterns = patterns.filter(p => p.cycle_day === cycleDay);
    dayPatterns.forEach(p => {
      if (p.symptom === 'high_energy_pattern') {
        rec.work.stars = Math.min(5, rec.work.stars + 1);
        rec.fitness.stars = Math.min(5, rec.fitness.stars + 1);
      }
      if (p.symptom === 'low_energy_pattern' || p.symptom === 'fatigue') {
        rec.work.stars = Math.max(1, rec.work.stars - 1);
        rec.fitness.stars = Math.max(1, rec.fitness.stars - 1);
        rec.selfCare.stars = Math.min(5, rec.selfCare.stars + 1);
      }
      if (p.symptom === 'anxiety' || p.symptom === 'mood_swings') {
        rec.social.stars = Math.max(1, rec.social.stars - 1);
        rec.selfCare.stars = Math.min(5, rec.selfCare.stars + 1);
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
