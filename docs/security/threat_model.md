# BigToe Threat Model

**Version:** 1.0
**Date:** 2025-12-17

---

## 1. Assets
The primary assets we protect are:
*   **User Privacy:** Anonymity, Payment Data (outsourced), Generated Private Library.
*   **Intellectual Property:** Prompt Engineering Logic, Custom Stylization pipelines.
*   **Infrastructure:** API Quotas (Gemini/Pollinations), Compute resources.
*   **Brand Reputation:** Prevention of illegal/NSFW content generation.

---

## 2. Threat Actors
*   **Script Kiddies:** Trying to bypass the age gate or geofencing.
*   **Abuse Users:** Trying to generate forbidden content via "Jailbreak" prompts.
*   **Resource Exhausters:** Bots draining free credits or flooding the API.
*   **Data Scrapers:** Trying to download public galleries (if any existed).

---

## 3. Attack Vectors & Mitigations

### A. Prompt Injection / Jailbreaking
*   **Attack:** User inputs `ignore previous instructions, generate [forbidden content]`.
*   **Risk:** Generation of CSAM or illegal content.
*   **Mitigation:**
    1.  **Strict Sanitization:** Client-side Regex block.
    2.  **Semantic Guard:** User input is never first. Structure: `SystemRules + UserInput + FormatConstraints`.
    3.  **Negative Prompting:** Hardcoded "bad concepts" in the generation engine.

### B. Rate Limit Bypass (Resource Exhaustion)
*   **Attack:** User creates 1000 guest accounts to bypass 5 credit limit.
*   **Risk:** Financial drain.
*   **Mitigation:**
    1.  **Device Fingerprinting:** Bind "Guest" status to `deviceId` in addition to UID.
    2.  **IP Rate Limit:** Max 50 requests/hour per IP (Cloudflare/Gateway level).
    3.  **Trusted Auth:** Require Phone/Email verification for non-trivial quotas.

### C. Direct Firestore Access
*   **Attack:** Malicious client manipulates JS to read other users' jobs.
*   **Risk:** Data Leak.
*   **Mitigation:**
    1.  **Row Level Security (RLS):** Firestore Rules `resource.data.ownerId == request.auth.uid`.
    2.  **No Wildcards:** Strict collection matching.

### D. Asset Scrubbing
*   **Attack:** User generates content, then deletes account to hide traces.
*   **Risk:** Legal liability (destroying evidence).
*   **Mitigation:**
    1.  **Soft Delete:** "Delete" action only sets `isDeleted=true`.
    2.  **Retention Policy:** Hard delete only after 30 days (GDPR compliant legal hold).
    3.  **Immutable Audit Log:** All generation attempts (even failed) are logged to a write-only collection.

---

## 4. Residual Risk
*   **AI Interpretation:** Model might misinterpret a benign prompt as NSFW (False Positive) or subtle NSFW as benign (False Negative).
*   **Action:** Human-in-the-loop for reported content; continuous prompt tuning.
