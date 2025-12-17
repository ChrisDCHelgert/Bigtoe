// services/image/types.ts

import { GeneratorParams } from '../../types';

export interface GenerationRequest {
    prompt: string;
    negativePrompt?: string;
    width?: number;
    height?: number;
    aspectRatio?: string; // e.g. "16:9"
    enhancePrompt?: boolean;
    params: GeneratorParams; // Pass through for logging/metadata
    identityToken?: string;
}

export interface GenerationResult {
    url: string;
    provider: string; // 'vertex' | 'pollinations'
    metadata: {
        fullPrompt: string;
        seed?: number;
        model?: string;
    };
    costEstimate: number; // e.g., 0.04
}

export interface ValidationResult {
    allowed: boolean;
    reason?: string;
    flaggedTerms?: string[];
}

export interface ProviderCapabilities {
    canGenerate: boolean;
    canInpaint: boolean;
    maxResolution: number;
    costPerImage: number;
    requiresAuth: boolean;
}


export type GenerationErrorCode = 'POLICY_VIOLATION' | 'TIMEOUT' | 'RATE_LIMIT' | 'SERVER_ERROR' | 'UNKNOWN';

export class GenerationError extends Error {
    constructor(
        public message: string,
        public code: GenerationErrorCode,
        public providerId?: string,
        public retryable: boolean = false
    ) {
        super(message);
        this.name = 'GenerationError';
    }
}

export interface ImageProvider {
    readonly id: string;

    validatePrompt(prompt: string): Promise<ValidationResult>;
    generateImage(request: GenerationRequest): Promise<GenerationResult>;
    getCapabilities(): ProviderCapabilities;
}
