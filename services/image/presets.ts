// services/image/presets.ts

export type QualityPresetId = 'standard' | 'high_quality' | 'ultra';

export interface QualityPreset {
    id: QualityPresetId;
    label: string;
    description: string;
    creditCost: number;
    minPlan: 'Free' | 'Pro' | 'Premium';

    // Technical Overrides (Provider Agnostic)
    width: number;
    height: number;
    realismMode: 'photo' | 'anime'; // Maps to provider models
}

export const QUALITY_PRESETS: QualityPreset[] = [
    {
        id: 'standard',
        label: 'Standard',
        description: 'Fast generation. Good for drafts.',
        creditCost: 1,
        minPlan: 'Free',
        width: 1024,
        height: 1024,
        realismMode: 'photo'
    },
    {
        id: 'high_quality',
        label: 'High Quality',
        description: 'Enhanced details & lighting. 16:9.',
        creditCost: 3,
        minPlan: 'Pro', // Requires Pro plan
        width: 1280,
        height: 720,
        realismMode: 'photo'
    },
    {
        id: 'ultra',
        label: 'Ultra (Print)',
        description: 'Maximum resolution. 4k detail.',
        creditCost: 5,
        minPlan: 'Premium', // Requires Premium plan
        width: 2048,
        height: 1536,
        realismMode: 'photo'
    }
];

export const getPreset = (id: QualityPresetId): QualityPreset => {
    return QUALITY_PRESETS.find(p => p.id === id) || QUALITY_PRESETS[0];
};

/**
 * Maps a generic preset to technical parameters for a specific provider.
 */
export const mapPresetToProviderParams = (presetId: QualityPresetId, provider: 'vertex' | 'pollinations') => {
    const preset = getPreset(presetId);

    if (provider === 'vertex') {
        return {
            width: preset.width,
            height: preset.height,
            sampleCount: preset.id === 'ultra' ? 4 : (preset.id === 'high_quality' ? 2 : 1),
            model: preset.id === 'ultra' ? 'imagen-3.0-ultra' : 'imagen-3.0'
        };
    } else {
        // Pollinations
        return {
            width: preset.width,
            height: preset.height,
            state: 'flux' // Always use flux for now, maybe flux-pro for ultra if available
        };
    }
};
