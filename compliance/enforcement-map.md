# Technical Enforcement Map

**Version:** 1.0
**Link to Policy:** `compliance/policy.md`

This document maps the Compliance Policy to specific technical enforcement points within the codebase and defines strictly prohibited behaviors.

---

## 1. Enforcement Points

### A. Prompt Input (Pre-Generation)
*   **Component:** `screens/Generator.tsx` -> `validatePrompt()`
*   **Policy Section:** 4 (Hard Block), 5 (Preventive)
*   **Mechanism:**
    *   Frontend Input Sanitization: Block forbidden characters/patterns.
    *   Client-side Filter: Check against `FORBIDDEN_WORDS` (defined in `constants.ts`).
    *   Rejection: Stop process immediately if violation detected.
*   **Status:** Implemented (Basic keyword list). Needs expansion based on Policy Section 4 keywords.

### B. System Prompt / AI Context (Generation Layer)
*   **Component:** `services/geminiService.ts` -> `enhancePrompt()`
*   **Policy Section:** 1 (Positioning), 3 (Allowed Content), 4 (Hard Block)
*   **Mechanism:**
    *   System Instruction injection: "You are a prompt engineer... CRITICAL RULES: ...".
    *   Explicit Negation: "NO sexual context, NO minors, NO fetish terms".
    *   Esthetic Enforcment: "Focus on photorealistic, anatomical, artistic view".
*   **Status:** Implemented (Anatomy/Optics rules). Needs specific "No Fetish/Minor" safety block in system prompt.

### C. Generation Output (Post-Generation)
*   **Component:** `services/geminiService.ts` / Backend Proxy (Future)
*   **Policy Section:** 5 (Consequence)
*   **Mechanism:**
    *   If using an API provided rejection (e.g., Gemini Safety Ratings), handle gracefully.
    *   Do not return "blurred" or "unsafe" images; return Error.

### D. UI Components (UI/UX Guardrails)
*   **Component:** `screens/Generator.tsx` (Options, Sliders)
*   **Policy Section:** 6 (UI/UX Guardrails)
*   **Mechanism:**
    *   Predefined lists (constants.ts) for `CAMERA_ANGLES`, `FOOT_SIDES`.
    *   No free-text fields for "Action" or "Interaction" (only "Lighting/Atmosphere" allows free text, which creates risk -> MUST be filtered).
    *   No "Social Sharing" buttons for public feeds.
*   **Status:** Partially Implemented. Free text field exists -> Requires strict validation.

### E. Database / Persistence
*   **Component:** `App.tsx` (Local State / Mock DB)
*   **Policy Section:** 2 (Age-Gate)
*   **Mechanism:**
    *   `UserProfile` needs `ageVerified: boolean` and `consentTimestamp`.
    *   No storage of generated images on public servers without access control.

### F. Logging & Monitoring
*   **Component:** Custom Logger service (To be implemented)
*   **Policy Section:** 2 (Age-Gate), 5 (Reactive)
*   **Mechanism:**
    *   Log failed prompts (security audit).
    *   Log Age-Gate acceptance.

---

## 2. "NEVER DO" - Code Prohibitions

**The code MUST NEVER:**

1.  **Bypass Filters:** Never allow a prompt to reach the image generation API without passing through `validatePrompt()` first.
2.  **Auto-Correct to Erotica:** Never "interpret" a blocked sexual term into a "safe" synonym. Block it outright.
3.  **Store Fetish Metadata:** Never create database fields or tags for specific fetishes (e.g., `crushing`, `giantess`).
4.  **Target Minors:** Never accept `age` parameters < 18 or keywords implying youth (`teen`, `girl`, `boy`) in the prompt generator.
5.  **Expose Raw Prompt Injection:** Never allow user input to directly replace the *entire* system prompt; always sandwich it between safety constraints.
6.  **Enable App Store Features:** Never implement "Rate on App Store" or "In-App Purchase" (IAP) native modules that violate the "Web-App Only" policy constraints regarding Adult content guidelines of Apple/Google.
7.  **Social Feed:** Never implement a public "Community Feed" of recent generations without 100% human pre-moderation (Risk of illegal content distribution).

---

## 3. Immediate Action Items (Code) to align with Policy

1.  **Update `constants.ts`**: Expand `FORBIDDEN_WORDS` to include the specific list from Policy Section 4 (`horny`, `domination`, `submission`, `fluids`, `teen`, `school`, etc.).
2.  **Update `types.ts`**: Add `ageVerified` to UserProfile.
3.  **Update `geminiService.ts`**: Add negative prompts specifically matching Policy Section 4 to the AI instruction.
