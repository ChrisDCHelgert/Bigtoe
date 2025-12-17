
import { SKIN_TONE_PRESETS, CAMERA_ANGLES, SCENE_OPTIONS, VISUAL_DETAILS } from '../../constants';

export interface PromptSettings {
    gender: 'female' | 'male' | 'diverse';
    side: string; // 'left', 'right', 'both'
    footSize: number;
    skinTone: { value: string };
    angle: { value: string };
    visualDetails: string[];
    scene: string;
    lighting: string;
    quality?: 'standard' | 'high' | 'studio';
}

interface PromptFragment {
    text: string;
    weight?: number; // 1.0 default
    required?: boolean;
    conflicts?: string[]; // IDs of features this conflicts with (helper for future UI)
}

// Mapping UI strings (German) to Engineering Prompt (English)
const FEATURE_MAP: Record<string, string> = {
    // SHAPE
    'Lange Zehen': '(long toes:1.3), elegant toes',
    'Kurze Zehen': 'short toes, cute feet',
    'Zehenspreizung': 'spread toes, splayed toes, active pose',
    'Hoher Spann': '(high arch feet:1.4), arched foot, pointed foot',
    'Flache Sohlen': 'flat soles, flat feet, standing firmly',

    // TEXTURE
    'Glatt & Weich': 'smooth skin, soft texture, unblemished',
    'Faltige Sohlen': '(wrinkled soles:1.4), deep skin folds, highly textured soles, mature skin',
    'Aderig': '(veiny feet:1.3), visible veins, vascular skin, realistic vascularity',
    'Natürlicher Look': 'raw photo, natural skin texture, less makeup, real skin pores',

    // STYLE
    'Lackierte Nägel': '(painted toenails:1.4), shiny nail polish, pedicure, vibrant color',
    'French Tips': '(french tip pedicure:1.4), white tip nails, natural base, manicured toes',
    'Fußkettchen': '(wearing anklet:1.4), gold chain around ankle, foot jewelry',
    'Tätowiert': '(tattoo on foot:1.3), ink design on skin, artistic tattoo',
    'Nass/Ölig': '(wet skin:1.3), shiny oily skin, glossy texture, baby oil'
};

const NEGATIVE_PROMPTS = {
    base: 'ugly, deformed, disfigured, poor quality, bad anatomy, missing limbs, extra limbs, fused fingers, watermark, text, signature, cartoon, illustration, painting, drawing, render, 3d, doll, plastic',
    noPolish: 'nail polish, painted nails, colorful nails',
    noJewelry: 'jewelry, anklet, bracelet, ring',
    noShoes: 'shoes, sandals, socks, footwear' // We want bare feet usually
};

export const PromptBuilder = {
    /**
     * Maps global settings to a final deterministic prompt string.
     */
    buildPrompt: (settings: PromptSettings): string => {
        const segments: string[] = [];

        // 1. SUBJECT (Weighted)
        const genderTerm = settings.gender === 'diverse' ? 'person' : (settings.gender === 'male' ? 'man' : 'woman');
        const sideTerm = settings.side === 'both' ? 'pair of feet' : (settings.side === 'left' ? 'left foot' : 'right foot');

        segments.push(`(Photorealistic ${genderTerm} feet:1.2)`);
        segments.push(sideTerm);
        segments.push(`size ${settings.footSize}`);

        // 2. CORE ATTRIBUTES
        // Skin tone is crucial
        segments.push(`(${settings.skinTone.value})`);
        // Angle relies on correct mapping from View
        segments.push(settings.angle.value);

        // 3. FEATURES (The critical part)
        const details = settings.visualDetails || [];

        // Map features, prioritizing certain ones
        const featurePrompts: string[] = [];

        details.forEach(detail => {
            const mapped = FEATURE_MAP[detail];
            if (mapped) {
                featurePrompts.push(mapped);
            }
        });

        if (featurePrompts.length > 0) {
            segments.push(`Details: ${featurePrompts.join(', ')}`);
        }

        // 4. SCENE & LIGHTING
        segments.push(`Scene: ${translateScene(settings.scene)}`);
        segments.push(`Lighting: ${translateLighting(settings.lighting)}`);

        // 5. QUALITY BOOSTERS (V5.0 enforcement)
        segments.push('8k resolution, highly detailed skin texture, realistic toes, masterpiece, dslr, macro photography');

        return segments.join(', ');
    },

    /**
     * Builds the negative prompt, handling conflicts.
     */
    buildNegativePrompt: (settings: PromptSettings): string => {
        const negs = [NEGATIVE_PROMPTS.base];
        const details = settings.visualDetails || [];

        // Conflict Resolution:
        // Only add "noPolish" if user did NOT select painted/french
        const hasPolish = details.includes('Lackierte Nägel') || details.includes('French Tips');
        if (!hasPolish) {
            // If they explicitly asked for Natural, we enforce no polish stronger
            if (details.includes('Natürlicher Look')) {
                negs.push(NEGATIVE_PROMPTS.noPolish);
            }
        }

        // Only add "noJewelry" if user did NOT select Anklet
        const hasJewelry = details.includes('Fußkettchen');
        if (!hasJewelry) {
            negs.push(NEGATIVE_PROMPTS.noJewelry);
        }

        // Always no shoes for now (unless we add shoe options later)
        negs.push(NEGATIVE_PROMPTS.noShoes);

        return negs.join(', ');
    },

    /**
     * Debug function to return the full payload snapshot
     */
    debug: (settings: PromptSettings) => {
        return {
            prompt: PromptBuilder.buildPrompt(settings),
            negative_prompt: PromptBuilder.buildNegativePrompt(settings),
            active_features: settings.visualDetails.map(d => `${d} -> ${FEATURE_MAP[d] ? 'MAPPED' : 'MISSING'}`),
            settings_snapshot: settings
        };
    }
};

// Helpers for Translation (Mock -> English for Model)
function translateScene(scene: string): string {
    const map: Record<string, string> = {
        'Studio Weiß': 'clean white studio background, infinite white',
        'Studio Schwarz': 'dark black studio background, low key',
        'Schlafzimmer': 'cozy bedroom, bed sheets, soft fabric',
        'Hotelzimmer': 'luxury hotel room, carpet, elegant furniture',
        'Badezimmer / Dusche': 'bathroom tiles, shower, wet environment',
        'Minimal / Schwarz': 'minimal dark aesthetic, abstract background',
        'Outdoor Beton': 'grey concrete, urban ground, street',
        'Outdoor Sonnenlicht': 'outdoor, nature, warm sunlight',
        'Auto Innenraum': 'car interior, leather seats, dashboard',
        'Outdoor Sand': 'sandy beach, grains of sand, dunes',
        'Outdoor Wiese': 'grass, green lawn, nature'
    };
    return map[scene] || scene;
}

function translateLighting(lighting: string): string {
    const map: Record<string, string> = {
        'Softbox Studio': 'soft studio lighting, diffuse light',
        'Tageslicht (Fenster)': 'natural window light, side lighting',
        'Golden Hour': 'warm golden hour sun, cinematic lighting',
        'Morgensonne': 'bright morning light, cool tones',
        'Cinematic Low Light': 'dim lighting, moody shadows, rim light',
        'Blitzlicht': 'harsh flash photography, direct light'
    };
    return map[lighting] || lighting;
}
