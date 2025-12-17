export const PRESETS = [
  { id: '1', name: 'Strandtag', tags: ['Outdoor', 'Sand', 'Sohlen'] },
  { id: '2', name: 'Büro Casual', tags: ['Indoor', 'Nylon', 'Heels'] },
  { id: '3', name: 'Morgens im Bett', tags: ['Indoor', 'Weiches Licht', 'POV'] },
];

export const PLANS = [
  {
    id: 'basic',
    name: 'Starter',
    price: '9,99 €',
    credits: 100,
    features: ['50 Bilder/Monat', 'Standard Qualität', 'Basis-Stile'],
    description: 'Zum Ausprobieren',
  },
  {
    id: 'pro',
    name: 'Creator',
    price: '19,99 €',
    credits: 500,
    features: ['200 Bilder/Monat', 'Hohe Auflösung', 'Priorisierte Generierung', 'Keine Wasserzeichen'],
    recommended: true,
    description: 'Ideal für Creator & Künstler',
  },
  {
    id: 'premium',
    name: 'Pro',
    price: '29,99 €',
    credits: 1500,
    features: ['Unbegrenztes Potenzial', '4K Ultra-HD', 'Kommerzielle Lizenz', 'Exklusive Prompts'],
    description: 'Für Power-Use & Agenturen',
  },
];

export const CREDIT_PACKS = [
  { id: 'starter', name: 'Starter', credits: 100, price: '4,99€' },
  { id: 'enthusiast', name: 'Enthusiast', credits: 500, price: '19,99€', save: '15%' },
  { id: 'pro', name: 'Pro', credits: 1500, price: '49,99€' },
];

// Skin Tones (Fitzpatrick Scale - Neutral & Professional)
export const SKIN_TONE_PRESETS = [
  { name: 'Typ I', value: 'very light skin tone, pale', hex: '#FAD7C0' },
  { name: 'Typ II', value: 'light skin tone, fair', hex: '#EAC0A5' },
  { name: 'Typ III', value: 'medium skin tone, olive', hex: '#D2A180' },
  { name: 'Typ IV', value: 'tan skin tone, bronze', hex: '#B88260' },
  { name: 'Typ V', value: 'dark skin tone, brown', hex: '#8D5B3E' },
  { name: 'Typ VI', value: 'very dark skin tone, ebony', hex: '#583626' },
];

// Grouped Visual Details for structured selection
export const VISUAL_DETAIL_GROUPS = {
  shape: {
    label: 'Form & Zehen',
    options: ['Lange Zehen', 'Kurze Zehen', 'Zehenspreizung', 'Hoher Spann', 'Flache Sohle']
  },
  texture: {
    label: 'Haut & Textur',
    options: ['Glatt & Weich', 'Faltige Sohlen', 'Aderig', 'Natürlicher Look']
  },
  style: {
    label: 'Stil & Extras',
    options: ['Lackierte Nägel', 'French Tips', 'Fußkettchen', 'Tätowiert', 'Nass/Ölig']
  }
};

// Flattened list for backward compatibility if needed, but prefer groups
export const VISUAL_DETAILS = [
  ...VISUAL_DETAIL_GROUPS.shape.options,
  ...VISUAL_DETAIL_GROUPS.texture.options,
  ...VISUAL_DETAIL_GROUPS.style.options
];

// Top-Level Style Presets (Quick Start)
export const STYLE_PRESETS = [
  {
    id: 'clean_studio',
    label: 'Clean Studio',
    params: {
      scene: 'Studio Weiß',
      lighting: 'Softbox Studio',
      visualDetails: ['Glatt & Weich', 'Natürlicher Look', 'Gepflegt'],
      angle: 'side profile'
    }
  },
  {
    id: 'wrinkled_soles',
    label: 'Faltige Sohlen',
    params: {
      scene: 'Minimal Dark',
      lighting: 'Cinematic Low Light',
      visualDetails: ['Faltige Sohlen', 'Hoher Spann', 'Aderig'],
      angle: 'soles focus'
    }
  },
  {
    id: 'macro_toes',
    label: 'Makro Zehen',
    params: {
      scene: 'Weich Gezeichnet',
      lighting: 'Tageslicht',
      visualDetails: ['Lange Zehen', 'Lackierte Nägel', 'Glatt & Weich'],
      angle: 'close-up macro'
    }
  },
  {
    id: 'natural_bedroom',
    label: 'Natürlich',
    params: {
      scene: 'Schlafzimmer',
      lighting: 'Morgensonne',
      visualDetails: ['Natürlicher Look', 'Kurze Zehen'],
      angle: 'top-down view'
    }
  }
];

export const FORBIDDEN_WORDS = [
  'blood', 'wound', 'gore', 'child', 'minor', 'kid', 'underage', 'dead', 'corpse', 'mutilated',
  'rape', 'assault', 'non-consensual', 'abuse'
];

export const CAMERA_ANGLES = [
  { id: 'top', label: 'Draufsicht', value: 'top-down view' },
  { id: 'side', label: 'Seitenprofil', value: 'side profile' },
  { id: 'soles', label: 'Sohlen-Fokus', value: 'bottom view showing soles' },
  { id: 'macro', label: 'Makro-Nahaufnahme', value: 'close-up macro shot' },
  { id: 'full', label: 'Ganzansicht', value: 'full foot view' }
];

export const SCENE_OPTIONS = [
  'Studio Weiß',
  'Studio Schwarz',
  'Schlafzimmer',
  'Hotelzimmer',
  'Badezimmer / Dusche',
  'Minimal / Schwarz',
  'Outdoor Beton',
  'Outdoor Sonnenlicht',
  'Auto Innenraum',
  'Outdoor Sand',
  'Outdoor Wiese'
];

// NEW: Vibe / Target Groups
export const STYLE_VIBES = [
  { id: 'esoteric', label: 'Esoteric / Ritual', diff: 'incense, mystical atmosphere, warm candlelight, spiritual vibe' },
  { id: 'tribal', label: 'Tribal / Indigenous', diff: 'henna tattoos, natural ornaments, earthy tones, raw aesthetic' },
  { id: 'punk', label: 'Punk / Hardcore', diff: 'contrast lighting, edgy, tattoos, dark mood, rebellious' },
  { id: 'dark', label: 'Dark Aesthetic', diff: 'low key lighting, deep shadows, mysterious, goth aesthetic' },
  { id: 'luxury', label: 'Luxury / High-End', diff: 'clean editorial look, expensive atmosphere, perfect grooming, softbox lighting' },
  { id: 'natural', label: 'Natural / Raw', diff: 'ungroomed, authentic skin texture, daylight, imperfect realism, raw photo' }
];

// NEW: Actions / Moments
export const ACTION_MOMENTS = [
  { id: 'painting', label: 'Being Painted', prompt: 'toenails being painted, pedicure session, application of nail polish' },
  { id: 'washing', label: 'Being Washed', prompt: 'foot being washed, soap bubbles, wet skin, hands cleaning foot' },
  { id: 'oiling', label: 'Being Oiled', prompt: 'applying oil to feet, shiny oily skin, hands massaging oil' },
  { id: 'touching', label: 'Being Touched', prompt: 'hand gently touching foot, contact, interaction' },
  { id: 'stretch', label: 'Stretch / Pose', prompt: 'tensed foot arch, toes stretching, dynamic pose, muscle tension' },
  { id: 'relax', label: 'Relaxed / Aftercare', prompt: 'relaxed feet on towel, resting, soft bed sheets, cozy atmosphere' }
];


export const LIGHTING_CHIPS = [
  'Softbox Studio',
  'Tageslicht (Fenster)',
  'Golden Hour',
  'Morgensonne', // requested
  'Cinematic Low Light',
  'Blitzlicht' // Flash
];

export const FOOT_SIDES: Record<string, string> = {
  'left': 'Linker Fuß',
  'right': 'Rechter Fuß',
  'both': 'Beide Füße'
};
