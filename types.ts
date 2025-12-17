export interface ImageAsset {
  id: string;
  url: string;
  isLocked: boolean;
  tags: string[];
  date: string;
  isHD: boolean;
  isFavorite: boolean;
  prompt_summary: string;
  metadata?: {
    fullPrompt: string;
    title: string;
    warnings?: string[];
  };
}

export interface UserProfile {
  name: string;
  credits: number;
  isPremium: boolean;
  plan: 'Free' | 'Basic' | 'Pro' | 'Premium';
  freeTrialUsed: number; // e.g., 2 out of 3
  freeTrialTotal: number;
  settings?: {
    language: 'de' | 'en';
    trackingEnabled: boolean;
  };
}

export interface GeneratorParams {
  quality?: 'standard' | 'high' | 'studio';
  gender: string;
  skinTone: { name: string; value: string; hex: string } | string;
  footSize: number;
  side: 'left' | 'right' | 'both';
  angle: { id: string; label: string; value: string } | string;
  visualDetails: string[];
  scene: string;
  lighting?: string;
  prompt?: string;
  aspectRatio?: string;
  enhancePrompt?: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'system' | 'content' | 'tip';
}
