# Legacy Mode - Internal Testing Guide

**Version:** 1.0
**Purpose:** Run BigToe for internal testing without Vertex AI or Stripe integration

---

## Overview

"Legacy Mode" allows the application to run with minimal external dependencies, using only:
- ✅ Pollinations.ai (Free image generation)
- ✅ Local state management (No real billing)
- ✅ Firebase Auth (Optional, can use anonymous)

**What's Disabled:**
- ❌ Vertex AI Imagen (Primary provider)
- ❌ Stripe payments (Real billing)
- ❌ Cloud Functions (Server-side jobs)

---

## Quick Start

### 1. Environment Setup

Create or update your `.env` file:

```bash
# Legacy Mode Configuration
VITE_ENABLE_VERTEX=false
VITE_ENABLE_FALLBACK=true
VITE_VERTEX_ROLLOUT=0

# Gemini API (for prompt enhancement - optional)
VITE_GOOGLE_API_KEY=your_key_here_or_leave_empty

# Firebase (for auth/storage - optional for pure local testing)
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_PROJECT_ID=your_project_id
```

### 2. Install & Run

```bash
npm install
npm run dev
```

The app will start at `http://localhost:5173` in Legacy Mode.

---

## Feature Behavior in Legacy Mode

### Image Generation
- **Provider:** Pollinations.ai (always)
- **Quality Presets:** All functional, resolution changes work
- **Cost:** 0 credits (no real billing)
- **Latency:** 3-8 seconds

### Credits System
- **Display:** Shows credit balance from local state
- **Consumption:** Decrements locally but doesn't affect real billing
- **Upgrade:** "Buy Credits" buttons are visible but non-functional

### Safety & Compliance
- ✅ **Prompt Guard:** Fully active (client-side blocking)
- ✅ **Age Gate:** Functional
- ⚠️ **AI Safety Filters:** Limited to Pollinations' filters (less strict than Vertex)

---

## Testing Checklist

### Basic Flow
- [ ] Open app, pass age gate
- [ ] Select "Standard" preset
- [ ] Enter a safe prompt (e.g., "feet on beach")
- [ ] Click Generate
- [ ] Image loads successfully from Pollinations
- [ ] Save to gallery works

### Preset Testing
- [ ] Standard: Generates 1024x1024
- [ ] High Quality: Generates 1280x720
- [ ] Ultra: Generates 2048x1536 (if user has enough "credits")

### Error Handling
- [ ] Enter forbidden word → Blocked client-side
- [ ] Network failure → Shows error, allows retry
- [ ] Fallback works if primary fails (N/A in legacy mode)

---

## Limitations

### What Won't Work
1. **Real Payments:** Stripe integration is disabled
2. **Premium Features:** Vertex AI quality improvements unavailable
3. **Cloud Storage:** Assets stored in browser only (unless Firebase configured)
4. **Analytics:** Telemetry logs to console only

### Known Issues
- Image quality varies on Pollinations (no consistency guarantees)
- No NSFW filtering beyond client-side keyword blocking
- No persistent credit balance (resets on refresh)

---

## Switching to Production Mode

To enable Vertex AI and Stripe:

1. Update `.env`:
```bash
VITE_ENABLE_VERTEX=true
VITE_VERTEX_ROLLOUT=100
```

2. Deploy Cloud Functions for:
   - Vertex AI proxy (`/api/generate`)
   - Stripe webhooks (`/api/webhooks/stripe`)

3. Configure Firebase Remote Config for gradual rollout

---

## Troubleshooting

### "No images generating"
- Check browser console for errors
- Verify Pollinations.ai is accessible
- Try a simpler prompt

### "Presets locked"
- In legacy mode, presets are unlocked by default
- Check `user.plan` in local state

### "Prompt blocked"
- Review `constants.ts` → `FORBIDDEN_WORDS`
- Ensure prompt doesn't contain policy violations

---

## Support

For internal testing questions:
- Check `docs/integration_notes.md` for architecture
- Review `release_readiness_report.md` for known gaps
- Run smoke tests: `ts-node tests/generator_integration_tests.ts`
