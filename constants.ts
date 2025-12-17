export const PRESETS = [
  { id: '1', name: 'Beach Day', tags: ['Outdoor', 'Sand', 'Soles'] },
  { id: '2', name: 'Office Casual', tags: ['Indoor', 'Nylon', 'Heels'] },
  { id: '3', name: 'Morning Bed', tags: ['Indoor', 'Soft Light', 'POV'] },
];

export const PLANS = [
  {
    id: 'basic',
    name: 'Starter',
    price: '9,99 €',
    credits: 100,
    features: ['50 Images/Month', 'Standard Quality', 'Basic Styles'],
    description: 'For casual creators & trying it out',
  },
  {
    id: 'pro',
    name: 'Creator',
    price: '19,99 €',
    credits: 500,
    features: ['200 Images/Month', 'High Resolution', 'Priority Generation', 'No Watermarks'],
    recommended: true,
    description: 'Best for content creators & artists',
  },
  {
    id: 'premium',
    name: 'Pro',
    price: '29,99 €',
    credits: 1500,
    features: ['Uncapped Potential', '4K Ultra-HD', 'Commercial License', 'Exclusive Prompts'],
    description: 'For power users & agencies',
  },
];

export const CREDIT_PACKS = [
  { id: 'starter', name: 'Starter', credits: 100, price: '4,99€' },
  { id: 'enthusiast', name: 'Enthusiast', credits: 500, price: '19,99€', save: '15%' },
  { id: 'pro', name: 'Pro', credits: 1500, price: '49,99€' },
];

export const SKIN_TONE_PRESETS = [
  { name: 'Pale / Light', value: 'very light skin tone', hex: '#FAD7C0' },
  { name: 'Fair / Beige', value: 'light skin tone', hex: '#EAC0A5' },
  { name: 'Medium / Olive', value: 'medium skin tone', hex: '#D2A180' },
  { name: 'Tan / Bronze', value: 'tan skin tone', hex: '#B88260' },
  { name: 'Deep / Brown', value: 'dark skin tone', hex: '#8D5B3E' },
  { name: 'Ebony / Dark', value: 'very dark skin tone', hex: '#583626' },
];

export const VISUAL_DETAILS = [
  'High Arch',
  'Flat Sole',
  'Long Toes',
  'Short Toes',
  'Painted Nails',
  'Natural Look',
  'Smooth Texture',
  'Wrinkled Soles',
  'Veiny',
  'Tattooed',
  'Jewelry/Anklet',
];

export const FORBIDDEN_WORDS = [
  'blood', 'wound', 'gore', 'child', 'minor', 'kid', 'underage', 'dead', 'corpse', 'mutilated'
];

export const CAMERA_ANGLES: Record<string, string> = {
  'top': 'top-down view',
  'side': 'side profile',
  '45': 'angled from 45-degree front view',
  'macro': 'close-up macro shot, focus on toes and skin texture'
};

export const FOOT_SIDES: Record<string, string> = {
  'left': 'left foot',
  'right': 'right foot',
  'both': 'both feet'
};

export const MEDICAL_TRANSLATIONS: Record<string, string> = {
  'Plattfuß (Flat Foot)': 'flat foot condition',
  'Spreizfuß (Splay Foot)': 'splay foot condition',
  'Hallux Valgus': 'hallux valgus bunion',
  'Hammerzehe': 'hammer toe',
  'Hoher Spann (High Arch)': 'high arch structure'
};
