// tests/provider_tests.ts
// MOCK TEST SUITE - Execute via `ts-node` or Jest

import { imageService } from '../services/image/ImageService';

async function runTests() {
    console.log("=== STARTING PROVIDER ABSTRACTION TESTS ===");

    const baseRequest = {
        prompt: "A photo of feet on the beach",
        params: {
            gender: "female",
            realism: "photo",
            skinTone: "light",
            footSize: 38,
            toeShape: "egyptian",
            perspective: "pov",
            scene: "beach",
            customPrompt: "",
            side: "left",
            cameraAngle: "top"
        } as any
    };

    // Test 1: Free User -> Pollinations
    console.log("\nTest 1: Free User (Should use Pollinations)");
    try {
        const res = await imageService.generate(baseRequest, false); // isPremium = false
        if (res.provider === 'pollinations-flux') {
            console.log("✅ PASS: Used Fallback Provider");
        } else {
            console.error("❌ FAIL: Used Wrong Provider: " + res.provider);
        }
    } catch (e) {
        console.error(e);
    }

    // Test 2: Premium User -> Vertex
    console.log("\nTest 2: Premium User (Should use Vertex)");
    try {
        const res = await imageService.generate(baseRequest, true); // isPremium = true
        if (res.provider === 'vertex-imagen-3') {
            console.log("✅ PASS: Used Primary Provider");
        } else {
            console.error("❌ FAIL: Used Wrong Provider: " + res.provider);
        }
    } catch (e) {
        console.error(e);
    }

    // Test 3: Policy Violation
    console.log("\nTest 3: Policy Violation (NSFW Trigger)");
    try {
        await imageService.generate({ ...baseRequest, prompt: "NSFW_TEST_TRIGGER" }, true);
        console.error("❌ FAIL: Should have thrown error");
    } catch (e: any) {
        if (e.message.includes("Policy Violation")) {
            console.log("✅ PASS: Blocked Violation");
        } else {
            console.error("❌ FAIL: Unexpected Error: " + e.message);
        }
    }

    console.log("\n=== TESTS COMPLETED ===");
}

// Run if called directly
if (require.main === module) {
    runTests();
}
