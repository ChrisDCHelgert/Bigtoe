
import { PromptBuilder, PromptSettings } from '../services/image/PromptBuilder';
import { SKIN_TONE_PRESETS, CAMERA_ANGLES } from '../constants';

const mockSettings: PromptSettings = {
    gender: 'female',
    side: 'both',
    footSize: 38,
    skinTone: SKIN_TONE_PRESETS[1],
    angle: CAMERA_ANGLES[1],
    visualDetails: [],
    scene: 'Studio Weiß',
    lighting: 'Softbox Studio',
    quality: 'standard'
};

const assertContains = (text: string, fragment: string) => {
    if (!text.toLowerCase().includes(fragment.toLowerCase())) {
        console.error(`FAIL: Expected prompt to include "${fragment}", got:`, text);
        process.exit(1);
    } else {
        console.log(`PASS: Prompt includes "${fragment}"`);
    }
};

const assertNotContains = (text: string, fragment: string) => {
    if (text.toLowerCase().includes(fragment.toLowerCase())) {
        console.error(`FAIL: Expected prompt NOT to include "${fragment}", got:`, text);
        process.exit(1);
    } else {
        console.log(`PASS: Prompt does NOT include "${fragment}"`);
    }
};

console.log("Running PromptBuilder Tests...");

// TEST 1: Painted Nails ON
{
    const settings = { ...mockSettings, visualDetails: ['Lackierte Nägel'] };
    const prompt = PromptBuilder.buildPrompt(settings);
    assertContains(prompt, 'painted toenails');
}

// TEST 2: Tattooed ON
{
    const settings = { ...mockSettings, visualDetails: ['Tätowiert'] };
    const prompt = PromptBuilder.buildPrompt(settings);
    assertContains(prompt, 'tattoo on foot');
}

// TEST 3: Anklet ON
{
    const settings = { ...mockSettings, visualDetails: ['Fußkettchen'] };
    const prompt = PromptBuilder.buildPrompt(settings);
    assertContains(prompt, 'wearing anklet');
}

// TEST 4: Painted Nails + Natural Look (Conflict?)
// Requirement: Both strings must be present, no exclusion.
{
    const settings = { ...mockSettings, visualDetails: ['Lackierte Nägel', 'Natürlicher Look'] };
    const prompt = PromptBuilder.buildPrompt(settings);
    assertContains(prompt, 'painted toenails');
    assertContains(prompt, 'natural skin texture'); // Mapped from 'Natürlicher Look'

    const neg = PromptBuilder.buildNegativePrompt(settings);
    assertNotContains(neg, 'nail polish'); // Should NOT forbid polish if we asked for it
}

// TEST 5: Anklet + "No Jewelry" Negative Prompt Check
{
    const settings = { ...mockSettings, visualDetails: ['Fußkettchen'] };
    const neg = PromptBuilder.buildNegativePrompt(settings);
    assertNotContains(neg, 'jewelry'); // Should NOT forbid jewelry if we asked for it
}

// TEST 6: Wrinkled Soles + Smooth (Conflict?)
// Assuming simply both are added if user selects both, leaving model to blend or fail.
{
    const settings = { ...mockSettings, visualDetails: ['Faltige Sohlen', 'Glatt & Weich'] };
    const prompt = PromptBuilder.buildPrompt(settings);
    assertContains(prompt, 'wrinkled soles');
    assertContains(prompt, 'smooth skin');
}

console.log("All PromptBuilder tests passed!");
