// services/image/ImageService.ts

import { ImageProvider, GenerationRequest, GenerationResult, GenerationError, GenerationErrorCode } from './types';
import { PollinationsProvider } from './providers/PollinationsProvider';
import { StabilityAIProvider } from './providers/StabilityAIProvider';

// Configuration / Feature Flags
const FLAGS = {
    ENABLE_STABILITY: true, // Always on for now as per user request
    ENABLE_FALLBACK: true,
    MAX_RETRIES: 2,
    INITIAL_RETRY_DELAY_MS: 1000
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
    private primary: StabilityAIProvider;
    private fallback: PollinationsProvider;

    constructor() {
        this.primary = new StabilityAIProvider();
        this.fallback = new PollinationsProvider();
        console.log(`[ImageService] Initialized - Primary: Stability SDXL`);
    }

    private getProvider(userIsPremium: boolean): ImageProvider {
        // SDXL is now default for everyone (or at least for this user session)
        return this.primary;
    }

    private async sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Executes generation with Automatic Retries (Exponential Backoff)
     */
    private async executeWithRetry(
        provider: ImageProvider,
        request: GenerationRequest
    ): Promise<GenerationResult> {
        let attempt = 0;
        let lastError: any;

        while (attempt <= FLAGS.MAX_RETRIES) {
            try {
                return await provider.generateImage(request);
            } catch (error: any) {
                lastError = error;
                const isRetryable = error.retryable ||
                    (error.message && (error.message.includes('timeout') || error.message.includes('50')));

                // Never retry Policy Violations
                if (error instanceof GenerationError && error.code === 'POLICY_VIOLATION') {
                    throw error;
                }

                if (!isRetryable || attempt === FLAGS.MAX_RETRIES) {
                    throw error;
                }

                attempt++;
                const delay = FLAGS.INITIAL_RETRY_DELAY_MS * Math.pow(2, attempt - 1);
                console.log(`[ImageService] Retry ${attempt}/${FLAGS.MAX_RETRIES} for ${provider.id} in ${delay}ms...`);
                await this.sleep(delay);
            }
        }
        throw lastError;
    }

    async generateImage(request: GenerationRequest, userIsPremium: boolean): Promise<GenerationResult> {
        const startTime = Date.now();
        const provider = this.getProvider(userIsPremium);

        console.log(`[ImageService] Selected Provider: ${provider.id} (Premium: ${userIsPremium})`);

        // ENFORCE REALISM (V5.0)
        // We append strong keywords to ensure the model doesn't drift into "artistic/cartoon" territory
        // SDXL handles this well, but we keep the structure.
        const enhancedRequest = {
            ...request,
            // SDXL needs less "magic words", but 'photorealistic' helps.
            prompt: request.prompt // We let the provider/promptBuilder handle the main keywords.
        };

        // 1. Validation check
        const validation = await provider.validatePrompt(enhancedRequest.prompt);
        if (!validation.allowed) {
            this.logTelemetry({
                timestamp: new Date().toISOString(),
                provider: provider.id,
                status: 'error',
                errorReason: validation.reason,
                failureType: 'policy'
            });
            throw new GenerationError(
                validation.reason || "Policy Violation",
                'POLICY_VIOLATION',
                provider.id,
                false
            );
        }

        // 2. Execution with Fallback Logic
        try {
            // Try Primary
            const result = await this.executeWithRetry(provider, request);

            this.logTelemetry({
                timestamp: new Date().toISOString(),
                provider: result.provider,
                status: 'success',
                latencyMs: Date.now() - startTime,
                cost: result.costEstimate
            });
            return result;

        } catch (error: any) {
            // If error is Policy Violation, do NOT fallback
            const isPolicy = (error instanceof GenerationError && error.code === 'POLICY_VIOLATION')
                || error.message?.includes('Policy')
                || error.message?.includes('Safety');

            if (isPolicy) {
                this.logTelemetry({
                    timestamp: new Date().toISOString(),
                    provider: provider.id,
                    status: 'error',
                    failureType: 'policy',
                    errorReason: error.message
                });
                // Ensure it is typed correctly for UI
                throw new GenerationError(error.message, 'POLICY_VIOLATION', provider.id, false);
            }

            // Technical Failure -> Attempt Fallback
            if (FLAGS.ENABLE_FALLBACK && provider.id !== this.fallback.id) {
                console.warn(`[ImageService] Primary failed, attempting fallback to ${this.fallback.id}`);

                try {
                    const fallbackResult = await this.executeWithRetry(this.fallback, request);

                    this.logTelemetry({
                        timestamp: new Date().toISOString(),
                        provider: this.fallback.id,
                        status: 'fallback',
                        latencyMs: Date.now() - startTime,
                        cost: fallbackResult.costEstimate
                    });
                    return fallbackResult;

                } catch (fallbackError: any) {
                    console.error("[ImageService] Fallback also failed.");
                    throw new GenerationError(
                        fallbackError.message || "All providers failed",
                        'SERVER_ERROR',
                        this.fallback.id,
                        false
                    );
                }
            }

            // No Fallback available
            throw new GenerationError(
                error.message || "Generation failed",
                'SERVER_ERROR',
                provider.id,
                false
            );
        }
    }

    private logTelemetry(event: TelemetryEvent) {
        // In prod: send to backend
        if (import.meta.env.DEV) {
            console.debug(`[Telemetry]`, event);
        }
    }
}

export const imageService = new ImageService();
