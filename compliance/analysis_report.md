# Project Analysis Report: Technical & Compliance

**Date:** 2025-12-17
**Scope:** Technical Audit & Compliance Policy Gap Analysis

---

## Part A: Technical Analysis

### 1. Technology Stack
*   **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide Icons.
*   **Build System:** Vite.
*   **Routing:** React Router DOM (HashRouter).
*   **State Management:** Local React State (`useState` in `App.tsx` prop-drilled to screens). **Technical Debt:** Scalability issue if app grows.
*   **Backend / AI:** No dedicated backend. "Serverless" architecture relying on client-side API calls to Google Gemini (Prompt Enhancement) and Pollinations.ai (Image Generation).
*   **Environment:** Configuration via `config.ts` loading `import.meta.env`.

### 2. Module Structure
*   `screens/`: Feature logic (Generator, Result, Gallery). Flat structure.
*   `components/`: Reusable UI (Button, Layout).
*   `services/`: external API integration (`geminiService.ts`).
*   `constants.ts`: Global configuration and static lists.

### 3. Deployment
*   **Status:** Reference to Vercel deployment (`vercel.json` exists).
*   **Build:** `npm run build` is functional. Project is SPA-ready.

---

## Part B: Compliance Analysis (vs. Policy v1.0)

### 1. Age-Gate (Policy §2)
*   **Current State:** Weak. "Soft Gate" in `Onboarding.tsx` -> "18+ Only" text with a simple "Start" button.
*   **Gap:** No extensive self-declaration checkbox, no logging of consent time/IP.
*   **Risk:** **High**. Fails specific requirement "Verbindliche Ü18-Selbsterklärung".

### 2. Content Hard Blocks (Policy §4)
*   **Current State:** Basic. `FORBIDDEN_WORDS` in `constants.ts` includes 'blood', 'wound', 'gore', 'kid'.
*   **Gap:** Missing specific Policy terms: `fetish`, `arousing`, `sexual`, `domination`, `submission`, `fluids`.
*   **Risk:** **Critical**. Easy to bypass for forbidden content.

### 3. Prompt & Output Moderation (Policy §5)
*   **Current State:**
    *   **Preventive:** Frontend check in `Generator.tsx` via `validatePrompt()`.
    *   **System Prompt:** `geminiService.ts` focuses on "anatomy" and "optics" but lacks explicit negative constraints for "sexual/fetish content".
    *   **Reactive:** No "Report Image" button in `Result.tsx`.
*   **Risk:** **Medium-High**. Reliance on frontend validation is insecure; System Prompt needs robustness.

### 4. UI/UX Guardrails (Policy §6)
*   **Current State:** Generally good. Sliders and Presets are technical/neutral.
*   **Gap:** **Free Text Inputs**. The "Custom Prompt" and "Lighting/Atmosphere" fields allow user injection of non-compliant terms if validaton fails.
*   **Risk:** **High**. Free text is the primary attack vector.

---

## 2. Compliance Risk List

| Risk Level | Area | Issue | Policy Ref |
| :--- | :--- | :--- | :--- |
| 🔴 **CRITICAL** | **Hard Block** | Incomplete keyword list (fetish terms missing) | §4 |
| 🔴 **CRITICAL** | **Free Text** | User can inject unrestricted context in Generator | §6 |
| 🟠 **HIGH** | **Age Gate** | No explicit checkbox/logging, just a button | §2 |
| 🟠 **HIGH** | **System Prompt**| AI not explicitly instructed to reject NSFW | §5 |
| 🟡 **MEDIUM** | **Moderation** | No "Report Image" function for users | §5 |
| 🟡 **MEDIUM** | **State** | User consent not persisted (Age-Gate resets on strict reload) | §2 |

---

## 3. Recommended Refactor Zones

1.  **`constants.ts` (Immediate):**
    *   Action: Massively expand `FORBIDDEN_WORDS` to match Policy §4 verbatim.

2.  **`services/geminiService.ts` (Safety Layer):**
    *   Action: Update `enhancePrompt` system instructions to include a "Safety Shell" that explicitly forbids generating sexual/fetish descriptions, even if anatomy is correct.

3.  **`screens/Onboarding.tsx` (Legal):**
    *   Action: Convert "Start" button to a form with an explicit Checkbox: "I am over 18 and accept the Content Policy." Block access until checked.

4.  **`screens/Generator.tsx` (Input Sanitization):**
    *   Action: Implement a robust `sanitizeInput()` function that runs *before* `validatePrompt()`.
    *   Action: Consider removing "Custom Prompt" entirely if risk is too high, or restrict it to a "Select Mood" dropdown.

---

## 4. Proposal: Safe Evolution (High-Level)

To align with the "Product Positioning" (Aesthetic/Design tool, NOT Fetish tool), we should move from **Open Generation** to **Curated Generation**.

**Phase 1: Lockdown (Now)**
*   Implement full Blocklist.
*   Hard-code Safety Rules into Gemini Prompt.
*   Add explicit Age Checkbox.

**Phase 2: UI Guardrails (Next)**
*   Replace "Custom Prompt" textarea with "Style Selectors" (e.g., Lighting: [Studio, Sun, Neon]).
*   Remove "Free Text" input entirely to ensure 100% Policy adherence ($6 "UI only with neutral, predefined options").

**Phase 3: Backend Verification (Future)**
*   Move validation to a server-side proxy to prevent client-side bypass.
