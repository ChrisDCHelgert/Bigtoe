// services/image/ImageService.ts

import { ImageProvider, GenerationRequest, GenerationResult, ValidationResult } from './types';
import { PollinationsProvider } from './providers/PollinationsProvider';
import { VertexProvider } from './providers/VertexProvider';

// Configuration / Feature Flags
// Read from environment variables with safe defaults for Legacy Mode
const FLAGS = {
    // LEGACY MODE: Defaults to false for internal testing without Vertex/Stripe
    ENABLE_VERTEX: import.meta.env.VITE_ENABLE_VERTEX === 'true' || false,
    VERTEX_ROLLOUT_PERCENT: parseInt(import.meta.env.VITE_VERTEX_ROLLOUT || '0'),
    COST_GUARDRAIL_MAX_DAILY: parseFloat(import.meta.env.VITE_MAX_DAILY_COST || '10.00'),
    ENABLE_FALLBACK: import.meta.env.VITE_ENABLE_FALLBACK !== 'false' // Default true
};

interface TelemetryEvent {
    timestamp: string;
    provider: string;
    status: 'success' | 'error' | 'fallback';
    latencyMs?: number;
    cost?: number;
    errorReason?: string;
    failureType?: 'technical' | 'policy';
}

export class ImageService {
    private primary: VertexProvider;
    private fallback: PollinationsProvider;

    constructor() {
        this.primary = new VertexProvider();
        this.fallback = new PollinationsProvider();

        console.log(`[ImageService] Initialized - Legacy Mode: ${!FLAGS.ENABLE_VERTEX}`);
    }

    /**
     * Router Logic: Decides which provider to use based on Policy & Availability
     */
    private getProvider(userIsPremium: boolean): ImageProvider {
        // 1. Hard Fallback if feature disabled (LEGACY MODE)
        if (!FLAGS.ENABLE_VERTEX) {
            console.log('[ImageService] Running in Legacy Mode - using Pollinations');
            return this.fallback;
        }

        // 2. Entitlement Check (Vertex is expensive, only for Pro)
        if (userIsPremium && FLAGS.VERTEX_ROLLOUT_PERCENT > 0) {
            return this.primary;
        }

        // 3. Default for Free Users
        return this.fallback;
    }

    /**
     * Main Entry Point with Fallback Support
     */
    async generateImage(request: GenerationRequest, userIsPremium: boolean): Promise<GenerationResult> {
        const startTime = Date.now();
        const provider = this.getProvider(userIsPremium);

        console.log(`[ImageService] Selected Provider: ${provider.id} for User (Premium: ${userIsPremium})`);

        // 1. Validate (Provider Specific)
        const validation = await provider.validatePrompt(request.prompt);
        if (!validation.allowed) {
            // COMPLIANCE FIRST: Policy violations are NEVER retried with fallback
            this.logTelemetry({
                timestamp: new Date().toISOString(),
                provider: provider.id,
                status: 'error',
                errorReason: validation.reason,
                failureType: 'policy'
            });
            throw new Error(`Policy Violation: ${validation.reason}`);
        }

        // 2. Generate with fallback support
        try {
            const result = await provider.generateImage(request);
            const latencyMs = Date.now() - startTime;

            // 3. Success Telemetry
            this.logTelemetry({
                timestamp: new Date().toISOString(),
                provider: result.provider,
                status: 'success',
                latencyMs,
                cost: result.costEstimate
            });

            return result;
        } catch (error: any) {
            const latencyMs = Date.now() - startTime;
            console.error(`[ImageService] Provider ${provider.id} failed:`, error);

            // Determine if this is a technical failure (retriable) or policy (not retriable)
            const isPolicyError = error.message?.includes('Policy') || error.message?.includes('Safety');

            if (isPolicyError) {
                // Policy error: Do NOT fallback
                this.logTelemetry({
                    timestamp: new Date().toISOString(),
                    provider: provider.id,
                    status: 'error',
                    latencyMs,
                    errorReason: error.message,
                    failureType: 'policy'
                });
                throw error;
            }

            // Technical error: Try fallback if enabled and we're not already on fallback
            if (FLAGS.ENABLE_FALLBACK && provider.id !== this.fallback.id) {
                console.log(`[ImageService] Technical failure, attempting fallback to ${this.fallback.id}`);

                this.logTelemetry({
                    timestamp: new Date().toISOString(),
                    provider: provider.id,
                    status: 'error',
                    latencyMs,
                    errorReason: error.message,
                    failureType: 'technical'
                });

                try {
                    const fallbackResult = await this.fallback.generateImage(request);
                    const fallbackLatency = Date.now() - startTime;

                    this.logTelemetry({
                        timestamp: new Date().toISOString(),
                        provider: this.fallback.id,
                        status: 'fallback',
                        latencyMs: fallbackLatency,
                        cost: fallbackResult.costEstimate
                    });

                    return fallbackResult;
                } catch (fallbackError) {
                    console.error(`[ImageService] Fallback also failed:`, fallbackError);
                    this.logTelemetry({
                        timestamp: new Date().toISOString(),
                        provider: this.fallback.id,
                        status: 'error',
                        latencyMs: Date.now() - startTime,
                        errorReason: (fallbackError as Error).message,
                        failureType: 'technical'
                    });
                    throw fallbackError;
                }
            }

            // No fallback available or disabled
            this.logTelemetry({
                timestamp: new Date().toISOString(),
                provider: provider.id,
                status: 'error',
                latencyMs,
                errorReason: error.message,
                failureType: 'technical'
            });
            throw error;
        }
    }

    private logTelemetry(event: TelemetryEvent) {
        // Enhanced Telemetry Logger
        // In production, this would send to Google Analytics, Cloud Logging, or similar
        console.log(`[Telemetry] ${JSON.stringify(event)}`);

        // TODO: Send to analytics backend
        // analytics.track('image_generation', event);
    }
}

// Singleton Instance
export const imageService = new ImageService();
