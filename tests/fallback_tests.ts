// tests/fallback_tests.ts
// Tests for fallback behavior and Legacy Mode

import { imageService } from '../services/image/ImageService';

describe('Fallback Logic Tests', () => {

    test('Policy violation does NOT trigger fallback', async () => {
        const policyViolation = {
            prompt: "blood gore violence", // Forbidden words
            width: 1024,
            height: 1024,
            params: {} as any
        };

        // Should throw without attempting fallback
        await expect(
            imageService.generate(policyViolation, false)
        ).rejects.toThrow('Policy Violation');
    });

    test('Technical error triggers fallback in production mode', async () => {
        // This test would require mocking the Vertex provider to fail
        // then verify fallback to Pollinations occurs

        // Mock setup:
        // - Vertex throws technical error
        // - Pollinations succeeds

        // Expected: Result comes from Pollinations with status 'fallback'

        console.log("⚠️  Test requires mock setup - implement when providers are real");
    });

    test('Legacy Mode always uses Pollinations', async () => {
        // Verify environment flag is respected
        const request = {
            prompt: "Test prompt",
            width: 1024,
            height: 1024,
            params: {} as any
        };

        const result = await imageService.generate(request, true); // Even premium user

        // In legacy mode (ENABLE_VERTEX=false), should use Pollinations
        // Note: This test depends on .env configuration
        if (!import.meta.env.VITE_ENABLE_VERTEX) {
            expect(result.provider).toBe('pollinations-flux');
        }
    });

    test('Telemetry logs policy failures correctly', async () => {
        const consoleSpy = jest.spyOn(console, 'log');

        try {
            await imageService.generate({
                prompt: "forbidden content",
                width: 1024,
                height: 1024,
                params: {} as any
            }, false);
        } catch (e) {
            // Expected to throw
        }

        // Check telemetry was logged
        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining('[Telemetry]')
        );
        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining('policy')
        );

        consoleSpy.mockRestore();
    });

    test('Latency is tracked in telemetry', async () => {
        const consoleSpy = jest.spyOn(console, 'log');

        await imageService.generate({
            prompt: "Valid test prompt",
            width: 1024,
            height: 1024,
            params: {} as any
        }, false);

        // Verify latency was logged
        const telemetryCall = consoleSpy.mock.calls.find(call =>
            call[0].includes('[Telemetry]') && call[0].includes('latencyMs')
        );

        expect(telemetryCall).toBeDefined();

        consoleSpy.mockRestore();
    });
});

// Manual smoke test for Legacy Mode
export async function smokeTestLegacyMode() {
    console.log("=== LEGACY MODE SMOKE TEST ===");
    console.log(`ENABLE_VERTEX: ${import.meta.env.VITE_ENABLE_VERTEX}`);

    const result = await imageService.generate({
        prompt: "A professional photo of feet on the beach, sunset lighting",
        width: 1024,
        height: 1024,
        params: {
            gender: "female",
            footSize: 38
        } as any
    }, false);

    console.log("✅ Legacy Mode generation successful!");
    console.log(`Provider: ${result.provider}`);
    console.log(`URL: ${result.url}`);
    console.log(`Expected: pollinations-flux`);

    if (result.provider === 'pollinations-flux') {
        console.log("✅ PASS: Running in Legacy Mode correctly");
    } else {
        console.log("❌ FAIL: Not using expected provider");
    }
}
