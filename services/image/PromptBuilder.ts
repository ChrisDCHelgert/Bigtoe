
import { SKIN_TONE_PRESETS, CAMERA_ANGLES, SCENE_OPTIONS, VISUAL_DETAILS, STYLE_VIBES, ACTION_MOMENTS } from '../../constants';

export interface PromptSettings {
    gender: 'female' | 'male' | 'diverse';
    side: string; // 'left', 'right', 'both'
    footSize: number;
    skinTone: { value: string };
    angle: { value: string };
    visualDetails: string[];
    scene: string;
    lighting: string;
    styleVibe?: string; // ID of STYLE_VIBES
    actionMoment?: string; // ID of ACTION_MOMENTS
    quality?: 'standard' | 'high' | 'studio';
}

// STRICT MAPPING: Feature -> { Positive, Negative }
// If feature is SELECTED -> Positive is added.
// If feature is NOT SELECTED -> Negative is added (Explicit Exclusion).
const STRICT_FEATURES: Record<string, { pos: string, neg: string }> = {
    // SHAPE
    'Lange Zehen': { pos: '(long toes:1.3), elegant toes, slender digits', neg: 'long toes' },
    'Kurze Zehen': { pos: '(short toes:1.3), cute feet, small toes', neg: 'short toes' },
    'Zehenspreizung': { pos: '(spread toes:1.4), splayed toes, active pose, toes apart', neg: 'spread toes' },
    'Hoher Spann': { pos: '(high arch:1.4), arched foot, pointed foot', neg: 'high arch' },
    'Flache Sohlen': { pos: '(flat soles:1.4), standing firmly, flat feet', neg: 'flat soles' },

    // TEXTURE
    'Glatt & Weich': { pos: '(smooth skin:1.3), soft texture, unblemished, baby soft', neg: 'smooth skin, airbrushed' },
    'Faltige Sohlen': { pos: '(wrinkled soles:1.5), deep skin folds, highly textured soles, mature skin', neg: 'wrinkled soles, deep folds, mature skin' },
    'Aderig': { pos: '(veiny feet:1.4), visible veins, vascular skin, realistic vascularity, anatomically correct veins', neg: 'veiny, vascular, veins' },
    'Natürlicher Look': { pos: 'raw photo, natural skin texture, less makeup, real skin pores, slight imperfections', neg: 'makeup, airbrushed, plastic skin' },

    // STYLE
    'Lackierte Nägel': { pos: '(painted toenails:1.5), shiny nail polish, pedicure, vibrant color', neg: 'painted nails, nail polish, pedicure' },
    'French Tips': { pos: '(french tip pedicure:1.5), white tip nails, natural base, manicured toes', neg: 'french tips, painted nails' },
    'Fußkettchen': { pos: '(wearing anklet:1.5), gold chain around ankle, foot jewelry', neg: 'jewelry, anklet, bracelet, ring, metal' },
    'Tätowiert': { pos: '(tattoo on foot:1.5), ink design on skin, artistic tattoo', neg: 'tattoo, ink, drawing on skin' },
    'Nass/Ölig': { pos: '(wet skin:1.4), shiny oily skin, glossy texture, baby oil, covered in oil', neg: 'oily, wet, sweat' }
};

const NEGATIVE_PROMPTS = {
    base: 'ugly, deformed, disfigured, poor quality, bad anatomy, missing limbs, fused fingers, watermark, text, signature, cartoon, illustration, painting, drawing, render, 3d, doll, plastic, blurred, low resolution',
    anatomy: 'extra toes, missing toes, fused toes, mutated toes, more than 5 toes, less than 5 toes, claws, animal feet, paw, deformed shape, unnatural arch, bad proportions',
    singleFoot: 'two feet, extra legs, double exposure, mirrored image, second foot, twin, multiple feet',
    soleFocus: 'visible toe nails, top of feet, face, legs, knees, body',
    shoes: 'shoes, sandals, socks, footwear, boots, sneakers'
};

export const PromptBuilder = {
    /**
     * Maps global settings to a final deterministic prompt string.
     */
    buildPrompt: (settings: PromptSettings): string => {
        const segments: string[] = [];

        // 1. SUBJECT & SIDE (The most critical part)
        const genderTerm = settings.gender === 'diverse' ? 'person' : (settings.gender === 'male' ? 'man' : 'woman');

        // Strict Side Logic
        if (settings.side === 'left') {
            segments.push(`(single standalone left ${genderTerm} foot:1.6)`);
            segments.push('anatomically correct left foot: big toe on right side, pinky toe on left side');
            segments.push('exactly one foot, no second foot, solitary foot');
        } else if (settings.side === 'right') {
            segments.push(`(single standalone right ${genderTerm} foot:1.6)`);
            segments.push('anatomically correct right foot: big toe on left side, pinky toe on right side');
            segments.push('exactly one foot, no second foot, solitary foot');
        } else {
            segments.push(`(pair of ${genderTerm} feet:1.5)`);
            segments.push('left and right foot, two feet, symmetrical composition');
        }

        segments.push(`size ${settings.footSize}`);

        // A. ANATOMY ENFORCEMENT (Positive)
        segments.push('perfect anatomy, exactly 5 toes per foot (1 big toe + 4 small toes), natural arch, realistic proportions, no extra digits');

        // 2. CORE ATTRIBUTES
        segments.push(`(${settings.skinTone.value})`);

        // 3. PERSPECTIVE / ANGLE
        // Check for Sole Focus overrides
        const isSoleFocus = settings.visualDetails?.includes('Flache Sohlen') || settings.visualDetails?.includes('Faltige Sohlen') || settings.angle?.value?.toLowerCase().includes('sole');

        if (isSoleFocus) {
            segments.push('(sole view:1.5), (bottom of foot:1.5), showing sole patterns, heel and ball of foot, textured skin');
            segments.push('toes curling away from camera');
        } else {
            segments.push(settings.angle.value);
        }

        // 4. FEATURES (Strict Positive Mapping)
        const details = settings.visualDetails || [];
        const featurePrompts: string[] = [];

        details.forEach(detail => {
            const rules = STRICT_FEATURES[detail];
            if (rules) {
                featurePrompts.push(rules.pos);
            }
        });

        if (featurePrompts.length > 0) {
            segments.push(featurePrompts.join(', '));
        }

        // 5. SCENE & LIGHTING
        segments.push(`Scene: ${translateScene(settings.scene)}`);
        segments.push(`Lighting: ${translateLighting(settings.lighting)}`);

        // 6. STYLE VIBE & ACTION (New)
        if (settings.styleVibe) {
            const vibe = STYLE_VIBES.find(v => v.id === settings.styleVibe);
            if (vibe) segments.push(vibe.diff);
        }

        if (settings.actionMoment) {
            const action = ACTION_MOMENTS.find(a => a.id === settings.actionMoment);
            if (action) segments.push(action.prompt);
        }

        // 7. QUALITY BOOSTERS
        segments.push('8k resolution, highly detailed skin texture, realistic toes, masterpiece, dslr, macro photography, raw output');

        return segments.join(', ');
    },

    /**
     * Builds the negative prompt, handling conflicts and strict exclusions.
     */
    buildNegativePrompt: (settings: PromptSettings): string => {
        const negs: string[] = [];

        // 1. Base Quality & Anatomy
        negs.push(NEGATIVE_PROMPTS.base);
        negs.push('extra toes, missing toes, fused toes, mutated toes, more than 5 toes, less than 5 toes');
        negs.push('double big toe, wrong toe order, impossible anatomy, twisted toes, deformed shape, unnatural arch, bad proportions');
        negs.push('claws, animal feet, paw');

        // 2. Strict Foot Count Logic
        if (settings.side === 'left' || settings.side === 'right') {
            negs.push(NEGATIVE_PROMPTS.singleFoot);
            negs.push('mirror image, reflection, two legs, partner, twin');
        } else {
            // If 'both', we generally don't want 'one foot' or 'missing foot'
            negs.push('missing foot, amputee, single foot');
        }

        // 3. Perspective Logic
        const isSoleFocus = settings.visualDetails?.includes('Flache Sohlen') || settings.visualDetails?.includes('Faltige Sohlen') || settings.angle?.value?.toLowerCase().includes('sole');
        if (isSoleFocus) {
            negs.push(NEGATIVE_PROMPTS.soleFocus);
            negs.push('frontal toes, tops of toes, toe nails'); // Strict exclusion for sole view
        }

        // 4. Feature Exclusion Logic (The "UI = Truth" rule)
        // We iterate over ALL defined special features. 
        // If it is NOT in settings.visualDetails, we add its NEGATIVE rule.
        const activeDetails = settings.visualDetails || [];

        Object.keys(STRICT_FEATURES).forEach(featureName => {
            const rules = STRICT_FEATURES[featureName];

            // Check if this feature is "Style/Texture" that should be excluded if not present.
            // Some features like "Shape" (Long/Short toes) are mutually exclusive but 'normal' is default.
            // We focus on optional additions: Polish, Jewelry, Tattoos, Oil, Wrinkles (if smooth preferred), etc.

            // Logic: Is this feature active?
            const isActive = activeDetails.includes(featureName);

            // Special Handling per Group to avoid logic errors (e.g. don't negate "short toes" just because "long toes" not selected, unless "short toes" also not selected, leading to "normal")
            // BUT: For "Add-ons" like Polish, Tattoo, Jewelry -> STRICT EXCLUDE.

            if (featureName === 'Lackierte Nägel' || featureName === 'French Tips') {
                if (!isActive && !activeDetails.includes('Lackierte Nägel') && !activeDetails.includes('French Tips')) {
                    // Only add no-polish if NEITHER is selected
                    // We avoid duplicates by checking if we already added it? No, Set handles that or we just add.
                    // simpler: if current key is Lackierte Nägel and it's missing, check if French is there.
                }
            }

        });

        // Simpler Manual Exclusion based on categories (Robust)

        // Polish
        if (!activeDetails.includes('Lackierte Nägel') && !activeDetails.includes('French Tips')) {
            negs.push(STRICT_FEATURES['Lackierte Nägel'].neg); // 'painted nails, nail polish'
            negs.push(STRICT_FEATURES['French Tips'].neg);
        }

        // Jewelry
        if (!activeDetails.includes('Fußkettchen')) {
            negs.push(STRICT_FEATURES['Fußkettchen'].neg);
        }

        // Tattoos
        if (!activeDetails.includes('Tätowiert')) {
            negs.push(STRICT_FEATURES['Tätowiert'].neg);
        }

        // Wet/Oil
        if (!activeDetails.includes('Nass/Ölig')) {
            negs.push(STRICT_FEATURES['Nass/Ölig'].neg);
        }

        // Veins (If not requested, prefer smooth? Or just don't force it? User said "Was nicht ausgewählt ist, darf NICHT erscheinen")
        // If "Aderig" not selected, we add "veiny" to negative?
        // Maybe too strict for "Natural Look", but let's try to follow "UI = Truth".
        if (!activeDetails.includes('Aderig')) {
            // Careful: Don't make them plastic. But prevent "Excessive veins".
            // negs.push('excessive veins, bulging veins'); 
        }

        // Shoes (Always exclude unless we add shoe option)
        negs.push(NEGATIVE_PROMPTS.shoes);

        // Deduping
        const uniqueNegs = Array.from(new Set(negs.join(', ').split(',').map(s => s.trim()).filter(s => s.length > 0)));

        // 5. Action Constraints (Strict Exclusion of Interactors unless requested)
        // If action implies hands (Washing, Painting, Oiling, Touching), we allow them.
        // Otherwise, we strictly forbid random hands appearing.
        const handsAllowed = ['painting', 'washing', 'oiling', 'touching'].includes(settings.actionMoment || '');

        if (!handsAllowed) {
            // Strict NO HANDS
            // We append to result to ensure it's at the end or begin? Order matters less for negatives usually, but we append.
            uniqueNegs.push('hands, fingers, palms, human hands, holding foot, touching foot, people in background');
        }

        return uniqueNegs.join(', ');
    },

    /**
     * Debug function to return the full payload snapshot
     */
    debug: (settings: PromptSettings) => {
        return {
            prompt: PromptBuilder.buildPrompt(settings),
            negative_prompt: PromptBuilder.buildNegativePrompt(settings),
            active_features: settings.visualDetails.map(d => `${d} -> ${STRICT_FEATURES[d] ? 'MAPPED' : 'MISSING'}`),
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
