# Job State Machine

**Version:** 1.0
**Context:** Image Generation Workflow

---

## 1. States

| State | Description | Next Allowed States |
| :--- | :--- | :--- |
| **`queued`** | Job created, validated, and awaiting worker. | `running`, `rejected` |
| **`running`** | Worker has picked up the job. API called. | `completed`, `failed` |
| **`completed`** | Generation successful. Asset URL stored. | *Final State* |
| **`failed`** | Generation failed (API Error). Retriable? | `queued` (Retry), `dead_letter` |
| **`rejected`** | Blocked by Moderation/Safety during exec. | *Final State* |
| **`dead_letter`** | Max retries exceeded. Manual review? | *Final State* |

---

## 2. Transitions & Triggers

### A. Creation (`null` -> `queued`)
*   **Trigger:** User calls `createJob`.
*   **Guard:**
    *   `PromptGuard.validate()` == True
    *   `Quota.check()` == True
    *   `Idempotency.check(promptHash)` == True
*   **Action:** Deduct Credits (Reserved).

### B. Execution (`queued` -> `running`)
*   **Trigger:** Async Worker pickup.
*   **Action:** Update timestamp `startedAt`. Send heartbeat.

### C. Success (`running` -> `completed`)
*   **Trigger:** API returns image URL.
*   **Action:**
    1.  Download Image to private buckets (`/originals`).
    2.  Create Asset entry in Library.
    3.  Update Job `resultUrl`.

### D. Failure (`running` -> `failed`)
*   **Trigger:** API Timeout / 500 error.
*   **Action:**
    *   Increment `retryCount`.
    *   Calculate Backoff (Exponential).
    *   If `retryCount < MAX_RETRIES`: Schedule Re-queue.
    *   Else: Transition to `dead_letter`.

### E. Rejection (`running` -> `rejected`)
*   **Trigger:** API Safety Filter triggers (NSFW detected).
*   **Action:**
    *   **Refund:** NO (Policy violation penalty).
    *   **Log:** Audit Log `SAFE_BLOCK`.

---

## 3. Idempotency

*   **Key:** `idempotencyKey` = Hash(`userId` + `prompt` + `params` + `timestamp_minute`).
*   **Logic:** If a job with same key exists and is not `failed`, return existing Job ID instead of creating new one.
*   **Goal:** Prevent accidental double-deduction on UI network retry.
