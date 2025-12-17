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

// Skin Tones (Fitzpatrick Scale - Neutral & Professional)
export const SKIN_TONE_PRESETS = [
  { name: 'Type I', value: 'very light skin tone, pale', hex: '#FAD7C0' },
  { name: 'Type II', value: 'light skin tone, fair', hex: '#EAC0A5' },
  { name: 'Type III', value: 'medium skin tone, olive', hex: '#D2A180' },
  { name: 'Type IV', value: 'tan skin tone, bronze', hex: '#B88260' },
  { name: 'Type V', value: 'dark skin tone, brown', hex: '#8D5B3E' },
  { name: 'Type VI', value: 'very dark skin tone, ebony', hex: '#583626' },
];

// Grouped Visual Details for structured selection
export const VISUAL_DETAIL_GROUPS = {
  shape: {
    label: 'Toe & Shape',
    options: ['Long Toes', 'Short Toes', 'Toe Spacing', 'High Arch', 'Flat Sole']
  },
  texture: {
    label: 'Skin & Texture',
    options: ['Smooth', 'Wrinkled Soles', 'Veiny', 'Natural Look']
  },
  style: {
    label: 'Style & Accessories',
    options: ['Painted Nails', 'French Tips', 'Jewelry/Anklet', 'Tattooed', 'Wet/Oiled']
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
      scene: 'Studio White',
      lighting: 'Softbox Studio',
      visualDetails: ['Smooth', 'Natural Look', 'Pedicured'],
      angle: 'side profile'
    }
  },
  {
    id: 'wrinkled_soles',
    label: 'Wrinkled Soles',
    params: {
      scene: 'Minimal Dark',
      lighting: 'Cinematic Low Light',
      visualDetails: ['Wrinkled Soles', 'High Arch', 'Veiny'],
      angle: 'soles focus'
    }
  },
  {
    id: 'macro_toes',
    label: 'Macro Toes',
    params: {
      scene: 'Soft Blurred',
      lighting: 'Natural Window Light',
      visualDetails: ['Long Toes', 'Painted Nails', 'Smooth'],
      angle: 'close-up macro'
    }
  },
  {
    id: 'natural_bedroom',
    label: 'Natural Bedroom',
    params: {
      scene: 'Bedroom',
      lighting: 'Morning Sun',
      visualDetails: ['Natural Look', 'Short Toes'],
      angle: 'top-down view'
    }
  }
];

export const FORBIDDEN_WORDS = [
  'blood', 'wound', 'gore', 'child', 'minor', 'kid', 'underage', 'dead', 'corpse', 'mutilated',
  'rape', 'assault', 'non-consensual', 'abuse'
];

export const CAMERA_ANGLES = [
  { id: 'top', label: 'Top Down', value: 'top-down view' },
  { id: 'side', label: 'Side Profile', value: 'side profile' },
  { id: 'soles', label: 'Soles Focus', value: 'bottom view showing soles' },
  { id: 'macro', label: 'Macro Close-Up', value: 'close-up macro shot' },
  { id: 'full', label: 'Full Foot', value: 'full foot view' }
];

export const SCENE_OPTIONS = [
  'Studio White',
  'Studio Dark',
  'Bedroom',
  'Minimal / Black',
  'Outdoor Concrete',
  'Outdoor Sand',
  'Outdoor Grass'
];

export const LIGHTING_CHIPS = [
  'Softbox Studio',
  'Natural Window Light',
  'Cinematic Low Light',
  'Golden Hour',
  'Flash Photography'
];

export const FOOT_SIDES: Record<string, string> = {
  'left': 'left foot',
  'right': 'right foot',
  'both': 'both feet'
};
