# abuse_prevention.md

**Version:** 1.0
**Focus:** Spam, Fraud, Content Policy

---

## 1. Rate Limiting Strategy

We implement a multi-layer rate limiting approach to prevent resource exhaustion and abuse.

### A. Layer 1: Client-Side (UX)
*   **Mechanism:** `debounce` on Generate button (2s).
*   **Visuals:** Cooldown timer after 3 rapid requests.
*   **Goal:** Prevent accidental double-clicks and basic script loops.

### B. Layer 2: Firestore Rules (Quota)
*   **Mechanism:** Check `user.credits` before `jobs.create`.
*   **Enforcement:**
    ```javascript
    function hasCredits() {
       return get(/databases/$(database)/documents/users/$(request.auth.uid)/entitlements/wallet).data.balance >= 5;
    }
    ```
*   **Goal:** Hard stop on generation when funds are low.

### C. Layer 3: Backend Throttling (Cloud Functions / Edge)
*   **Mechanism:** Sliding Window Counter via Redis or Firestore.
*   **Limits:**
    *   **Guest:** 5 req / hour.
    *   **User:** 50 req / hour.
    *   **Pro:** 500 req / hour.
*   **Action:** Return HTTP 429 if exceeded.

---

## 2. Prompt Prevention

### A. Keyword Blacklist
*   **Source:** Policy §4 (`forbidden_words`).
*   **Action:** Immediate rejection with generic error "Policy Violation".
*   **Logging:** Log strict violations to `audit_logs` for analysis.

### B. Semantic Analysis (AI Guard)
*   **Mechanism:** Before generation, run a cheap LLM call (Gemini Flash) with prompt:
    > "Classify this prompt as SAFE or UNSAFE based on [Policy Rules]. return JSON { safe: boolean, reason: string }"
*   **Threshold:** If UNSAFE probability > 90% -> Block.

---

## 3. Job Quota Enforcement

*   **Concurrency:** Max 1 active job per user.
*   **Implementation:**
    *   Check `jobs` collection for `status: 'processing' && creatorId == auth.uid`.
    *   If count > 0 -> Reject new job.

---

## 4. Admin Audit Logs

All sensitive actions must be logged immutably.

| Event | Payload | Sensitivity | Retention |
| :--- | :--- | :--- | :--- |
| `JOB_CREATED` | prompt_hash, credit_cost, timestamp | Low | 90 days |
| `JOB_BLOCKED` | prompt_text, reason, user_id | High | 1 year |
| `AGE_GATE_OK` | version, timestamp, ip_hash | Medium | Indefinite |
| `PAYMENT` | transaction_id, amount, sku | High | 10 years |

**Immutability:** Controlled via Firestore Rules (`allow update: if false; allow delete: if false;`).

---

## 5. Secrets Management

*   **Client Side:** `VITE_FIREBASE_API_KEY` (Public, restricted by domain).
*   **Server Side:** `GEMINI_API_KEY`, `STRIPE_SECRET` (Strictly Env Variables).
*   **Rule:** Never commit `.env` files. Use Secret Manager for production.
