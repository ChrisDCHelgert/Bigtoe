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
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '19,99 €',
    credits: 500,
    features: ['200 Bilder/Monat', 'Hohe Auflösung', 'Priorisierter Server-Zugriff', 'Keine Wartezeit'],
    recommended: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '29,99 €',
    credits: 1500,
    features: ['Unbegrenzte Bilder', '4K Ultra-HD', 'VIP Support', 'Exklusive Stile'],
  },
];

export const CREDIT_PACKS = [
  { id: 'starter', name: 'Starter', credits: 100, price: '4,99€' },
  { id: 'enthusiast', name: 'Enthusiast', credits: 500, price: '19,99€', save: '15%' },
  { id: 'pro', name: 'Pro', credits: 1500, price: '49,99€' },
];
