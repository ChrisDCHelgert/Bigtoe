// services/image/providers/StabilityAIProvider.ts

import { ImageProvider, GenerationRequest, GenerationResult, ValidationResult, ProviderCapabilities, GenerationError } from '../types';

export class StabilityAIProvider implements ImageProvider {
    readonly id = 'stability-sdxl';
    private apiKey: string;
    private baseUrl = 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image';

    constructor() {
        this.apiKey = import.meta.env.VITE_STABILITY_API_KEY || '';
        if (!this.apiKey) {
            console.warn("[StabilityAIProvider] No API Key found in environment variables.");
        }
    }

    async validatePrompt(prompt: string): Promise<ValidationResult> {
        // Stability has its own filters, but we can do a local pass if needed.
        // For now, allow everything and let the API decide.
        return { allowed: true };
    }

    async generateImage(request: GenerationRequest): Promise<GenerationResult> {
        if (!this.apiKey) {
            throw new GenerationError("Missing Stability API Key", 'AUTH_ERROR', this.id, false);
        }

        const prompts = [
            {
                text: request.prompt + ", realistic, detailed, 8k",
                weight: 1
            }
        ];

        if (request.negativePrompt) {
            prompts.push({
                text: request.negativePrompt,
                weight: -1
            });
        }

        const body = {
            text_prompts: prompts,
            cfg_scale: 7,
            height: 1024,
            width: 1792, // 16:9ish aspect ratio (1024 * 1024 = 1M pixels, 1024x1024 is standard, let's try 16:9 supported res)
            // Stability SDXL supports specifc resolutions. 1024x1024 is safest default.
            // Let's stick to 1024x1024 or 16:9 approximate.
            // 1536x640, 1344x768, 1216x832, 1152x896, 1024x1024
            // User asked for "16:9" in Generator.tsx often.
            // Let's us 1344x768 (7:4 ~ 16:9) or 1216x832. 
            // But for now, let's stick to the generated aspect ratio logic or default to 1024x1024 if not specified.
            // Actually Generator.tsx sends '16:9'. 
            // Let's map '16:9' to 1344x768.
            samples: 1,
            steps: 30,
        };

        // Manual Aspect Ratio mapping for SDXL allowed dimensions
        if (request.aspectRatio === '16:9') {
            body.width = 1344;
            body.height = 768;
        } else if (request.aspectRatio === '9:16') {
            body.width = 768;
            body.height = 1344;
        } else {
            body.width = 1024;
            body.height = 1024;
        }

        console.log(`[StabilityAIProvider] Generating with resolution: ${body.width}x${body.height}`);

        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[StabilityAIProvider] API Error: ${response.status} - ${errorText}`);

            let code: any = 'SERVER_ERROR';
            if (response.status === 401 || response.status === 403) code = 'AUTH_ERROR';
            if (response.status === 429) code = 'RATE_LIMIT';

            throw new GenerationError(
                `Stability API Error: ${response.status}`,
                code,
                this.id,
                response.status === 429 || response.status >= 500 // retryable
            );
        }

        const data = await response.json();

        // data.artifacts[0].base64
        if (!data.artifacts || data.artifacts.length === 0) {
            throw new GenerationError("No artifacts returned", 'SERVER_ERROR', this.id, true);
        }

        const imageBase64 = data.artifacts[0].base64;
        // The service usually expects a URL or b64_json.
        // We can return the base64 directly as a data URL or just the raw base64.
        // Generator.tsx handles `result.b64_json` logic.
        // Let's pass it as b64_json in the raw result or construct a data URL.

        return {
            url: `data:image/png;base64,${imageBase64}`, // Convenience
            provider: this.id,
            metadata: {
                seed: data.artifacts[0].seed,
                finishReason: data.artifacts[0].finishReason
            },
            costEstimate: 0.2 // Rough estimate for Credit system
        };
    }

    getCapabilities(): ProviderCapabilities {
        return {
            canGenerate: true,
            canInpaint: false,
            maxResolution: 1024,
            costPerImage: 1,
            requiresAuth: true
        };
    }
}
