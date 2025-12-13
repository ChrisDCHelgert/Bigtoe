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
  gender: 'female' | 'male' | 'diverse';
  skinTone: string;
  footSize: number;
  toeShape: string;
  perspective: string;
  scene: string;
  realism: 'anime' | 'photo';
  customPrompt: string;
  side: 'left' | 'right' | 'both';
  cameraAngle: 'top' | 'side' | '45' | 'macro';
  medicalConditions?: string[];
  freeText?: string;
  isRandomMode?: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'system' | 'content' | 'tip';
}
