// tests/preset_tests.ts
import { QUALITY_PRESETS, getPreset, mapPresetToProviderParams } from '../services/image/presets';

async function runTests() {
    console.log("=== PRESET MAPPING TESTS ===");

    // Test 1: Defaults
    const std = getPreset('standard');
    if (std.creditCost === 1 && std.width === 1024) {
        console.log("✅ PASS: Standard attributes correct");
    } else {
        console.error("❌ FAIL: Standard attributes mismatch");
    }

    // Test 2: Vertex Mapping
    const ultraVertex = mapPresetToProviderParams('ultra', 'vertex');
    if (ultraVertex.model === 'imagen-3.0-ultra' && ultraVertex.width === 2048) {
        console.log("✅ PASS: Vertex Ultra mapping correct");
    } else {
        console.error("❌ FAIL: Vertex Ultra mapping mismatch", ultraVertex);
    }

    // Test 3: Pollinations Mapping
    const hqPoll = mapPresetToProviderParams('high_quality', 'pollinations');
    if (hqPoll.width === 1280) {
        console.log("✅ PASS: Pollinations HQ mapping correct");
    } else {
        console.error("❌ FAIL: Pollinations HQ mapping mismatch");
    }

    console.log("=== TESTS FINISHED ===");
}

if (require.main === module) {
    runTests();
}
