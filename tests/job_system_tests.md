# Job System Stability Tests

**Version:** 1.0
**Context:** Automated Integration Tests

---

## 1. Retry Logic Tests

### Test 1.1: Transient Failure Recovery
*   **Setup:** Mock API to fail 2 times with 503, then succeed.
*   **Action:** Create Job.
*   **Expect:**
    *   Attempt 1: Fail (Retry scheduled).
    *   Attempt 2: Fail (Backoff applied).
    *   Attempt 3: Success.
    *   **Verify:** Job Status `completed`, `retryCount` == 2.

### Test 1.2: Max Retries Exceeded (DLQ)
*   **Setup:** Mock API to fail permanently (503).
*   **Action:** Create Job.
*   **Expect:**
    *   3 Retries occur with increasing delays.
    *   Transition to `dead_letter` after 4th failure.
    *   **Verify:** Job Status `dead_letter`. Admin Alert triggered.

---

## 2. Idempotency Tests

### Test 2.1: Duplicate Submission
*   **Action:** Submit exact same payload (Prompt + Params) twice within 5 seconds.
*   **Expect:**
    *   Request 1: Returns Job ID `job_123`.
    *   Request 2: Returns Job ID `job_123` (No new job created).
    *   **Verify:** `jobs` collection has only 1 document. Credit deducted only once.

---

## 3. Cost Protection Tests

### Test 3.1: Refund on System Failure
*   **Setup:** Job fails with 500 error -> moves to `failed` (final).
*   **Expect:** `Wallet.refund(cost)` called automatically.

### Test 3.2: Penalty on Safety Block
*   **Setup:** Job fails with Safety Violation -> moves to `rejected`.
*   **Expect:** **NO Refund**. Penalty retained.
