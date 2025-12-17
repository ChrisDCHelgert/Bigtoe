// services/image/providers/PollinationsProvider.ts

import { ImageProvider, GenerationRequest, GenerationResult, ValidationResult, ProviderCapabilities } from '../types';
import { FORBIDDEN_WORDS } from '../../../constants';

export class PollinationsProvider implements ImageProvider {
    readonly id = 'pollinations-flux';

    async validatePrompt(prompt: string): Promise<ValidationResult> {
        const lower = prompt.toLowerCase();
        const flagged = FORBIDDEN_WORDS.filter(w => lower.includes(w));

        if (flagged.length > 0) {
            return { allowed: false, reason: 'Policy Violation', flaggedTerms: flagged };
        }
        return { allowed: true };
    }

    async generateImage(request: GenerationRequest): Promise<GenerationResult> {
        // Artificial Delay to simulate heavy processing
        await new Promise(r => setTimeout(r, 3000));

        // Pollinations URL Construction
        const basePrompt = encodeURIComponent(request.prompt + " ,realistic vision, highly detailed, 8k");
        const seed = Math.floor(Math.random() * 100000);
        const width = request.width || 1024;
        const height = request.height || 768;

        const url = `https://image.pollinations.ai/prompt/${basePrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true&state=flux`;

        return {
            url,
            provider: this.id,
            metadata: {
                fullPrompt: request.prompt,
                seed,
                model: 'flux'
            },
            costEstimate: 0
        };
    }

    getCapabilities(): ProviderCapabilities {
        return {
            canGenerate: true,
            canInpaint: false,
            maxResolution: 2048,
            costPerImage: 0,
            requiresAuth: false
        };
    }
}
