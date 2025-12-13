import { GOOGLE_API_KEY } from '../config';

// This service would normally interface with the Gemini API or a backend proxy.
// For the prototype, we simulate the async nature of generation.

export const enhancePrompt = async (currentPrompt: string): Promise<string> => {
  if (!GOOGLE_API_KEY) return `${currentPrompt}, masterpiece, best quality, ultra-realistic, 8k, raw photo, highly detailed skin texture, soft lighting, depth of field, f1.8, 85mm lens`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a prompt engineer for Stable Diffusion XL. Enhance this prompt to generate a hyper-realistic, anatomically correct image of feet.
        
        CRITICAL RULES:
        - MUST specify "perfectly anatomically correct feet, 5 toes per foot, natural toe alignment".
        - MUST specify "Canon EOS 5D Mark IV, 85mm f/1.8 lens, incredible detail".
        - Focus on skin texture (pores, wrinkles, natural veins), realistic lighting (subsurface scattering), and depth of field.
        - NO plastic skin, NO blurry joints, NO extra toes.

        Original Input: "${currentPrompt}"
        
        Output ONLY the enhanced prompt string. No explanations.` }]
        }]
      })
    });

    const data = await response.json();
    const enhanced = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return enhanced || currentPrompt;
  } catch (error) {
    console.error("Gemini enhance failed:", error);
    return currentPrompt;
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  return new Promise(async (resolve) => {
    // 1. Enhance Prompt using Google Gemini
    const finalPrompt = await enhancePrompt(prompt);
    console.log(`[AI] Enhanced Prompt: ${finalPrompt}`);

    // 2. Artificial Delay (maintained for UX)
    setTimeout(() => {
      // 3. Use Pollinations.ai with SDXL Params
      // URL Encoding: Essential for complex prompts
      // Params:
      // - width=1024, height=768 (Requested)
      // - model=flux (High realism) or generic (Pollinations defaults to high quality)
      // - seed: Random for variety
      // - nologo: Clean image
      const basePrompt = encodeURIComponent(finalPrompt + " ,realistic vision, chilloutmix, hyperrealistic, 8k, raw photo");
      const seed = Math.floor(Math.random() * 10000);
      const imageUrl = `https://image.pollinations.ai/prompt/${basePrompt}?width=1024&height=768&seed=${seed}&nologo=true&state=flux`;

      resolve(imageUrl);
    }, 8000); // Slightly reduced delay
  });
};
