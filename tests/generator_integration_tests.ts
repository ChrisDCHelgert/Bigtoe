// tests/generator_integration_tests.ts
// Integration tests for Generator using ImageService

import { imageService } from '../services/image/ImageService';
import { getPreset } from '../services/image/presets';

describe('Generator Integration with ImageService', () => {

    test('Generator uses ImageService for generation', async () => {
        const mockRequest = {
            prompt: "A photo of feet on the beach",
            width: 1024,
            height: 1024,
            params: {
                gender: "female",
                realism: "photo",
                skinTone: "#f8d9c3",
                footSize: 38,
                toeShape: "Egyptian",
                perspective: "POV",
                scene: "beach",
                customPrompt: "",
                side: "both",
                cameraAngle: "top"
            } as any
        };

        // Test with free user (should use Pollinations)
        const result = await imageService.generate(mockRequest, false);

        expect(result.provider).toBe('pollinations-flux');
        expect(result.url).toBeDefined();
        expect(result.costEstimate).toBe(0);
    });

    test('Premium user gets Vertex provider', async () => {
        const mockRequest = {
            prompt: "Test prompt",
            width: 1024,
            height: 1024,
            params: {} as any
        };

        const result = await imageService.generate(mockRequest, true);

        expect(result.provider).toBe('vertex-imagen-3');
    });

    test('Preset credit costs are correctly calculated', () => {
        const standard = getPreset('standard');
        const highQuality = getPreset('high_quality');
        const ultra = getPreset('ultra');

        expect(standard.creditCost).toBe(1);
        expect(highQuality.creditCost).toBe(3);
        expect(ultra.creditCost).toBe(5);
    });

    test('Preset dimensions are applied correctly', () => {
        const ultra = getPreset('ultra');

        expect(ultra.width).toBe(2048);
        expect(ultra.height).toBe(1536);
    });

    test('Policy violation blocks generation', async () => {
        const violationRequest = {
            prompt: "blood wound gore", // Contains forbidden words
            width: 1024,
            height: 1024,
            params: {} as any
        };

        await expect(
            imageService.generate(violationRequest, false)
        ).rejects.toThrow('Policy Violation');
    });
});

// Smoke test - can be run manually
export async function smokeTestStandardPreset() {
    console.log("=== SMOKE TEST: Standard Preset Generation ===");

    const result = await imageService.generate({
        prompt: "A professional photo of feet, natural lighting, 8k",
        width: 1024,
        height: 1024,
        params: {
            gender: "female",
            footSize: 38,
            scene: "studio"
        } as any
    }, false);

    console.log("✅ Generation successful!");
    console.log(`Provider: ${result.provider}`);
    console.log(`URL: ${result.url}`);
    console.log(`Cost: $${result.costEstimate}`);
}
