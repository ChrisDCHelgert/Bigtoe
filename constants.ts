export const PRESETS = [
  { id: '1', name: 'Beach Day', tags: ['Outdoor', 'Sand', 'Soles'] },
  { id: '2', name: 'Office Casual', tags: ['Indoor', 'Nylon', 'Heels'] },
  { id: '3', name: 'Morning Bed', tags: ['Indoor', 'Soft Light', 'POV'] },
];

export const PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: '9,99 €',
    credits: 100,
    features: ['50 Bilder/Monat', 'Standard Qualität (HD)', 'Basis-Kategorien'],
    description: 'Für Einzelpersonen & Einsteiger',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '19,99 €',
    credits: 500,
    features: ['200 Bilder/Monat', 'Hohe Auflösung', 'Priorisierter Server-Zugriff', 'Keine Wartezeit'],
    recommended: true,
    description: 'Für professionelle Podologen & Praxen',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '29,99 €',
    credits: 1500,
    features: ['Unbegrenzte Bilder', '4K Ultra-HD', 'VIP Support', 'Exklusive Stile'],
    description: 'Für Kliniken & Großteams',
  },
];

export const CREDIT_PACKS = [
  { id: 'starter', name: 'Starter', credits: 100, price: '4,99€' },
  { id: 'enthusiast', name: 'Enthusiast', credits: 500, price: '19,99€', save: '15%' },
  { id: 'pro', name: 'Pro', credits: 1500, price: '49,99€' },
];

export const MEDICAL_CONDITIONS = [
  'Plattfuß (Flat Foot)',
  'Spreizfuß (Splay Foot)',
  'Hallux Valgus',
  'Hammerzehe',
  'Hoher Spann (High Arch)'
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
