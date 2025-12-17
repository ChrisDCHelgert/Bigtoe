# Retry Policy & Dead Letter Queue (DLQ)

**Version:** 1.0
**Goal:** Resilience against transient failures (API timeouts, rate limits).

---

## 1. Retry Strategy

We use **Exponential Backoff with Jitter** to prevent thundering herd problems.

### Configuration
*   **Max Retries:** 3
*   **Base Delay:** 2 seconds
*   **Max Delay:** 30 seconds
*   **Multiplier:** 2x

### Algorithm
```typescript
delay = min(MAX_DELAY, BASE_DELAY * (2 ^ retryCount))
jitter = random(0, 1000ms)
nextRetryAt = now + delay + jitter
```

### Retriable Errors
*   HTTP 500/502/503/504
*   HTTP 429 (Rate Limit) -> Respect `Retry-After` header if present.
*   Timeout Exception.

### Non-Retriable Errors (Fail Fast)
*   HTTP 400 (Bad Request / Invalid Prompt)
*   HTTP 401/403 (Auth Error)
*   Policy Violation (Safety Block)

---

## 2. Dead Letter Queue (DLQ)

When a job exceeds `Max Retries`, it is moved to the DLQ State (`dead_letter`) instead of being lost.

### Lifecycle of a Dead Job
1.  **Transition:** `retryCount` > 3 -> Update status `dead_letter`.
2.  **Notification:** Alert sent to Admin Dashboard / Ops Channel.
3.  **Review:** Admin inspects failure reason (e.g. "Vendor API Outage").
4.  **Action:**
    *   **Replay:** Admin resets `retryCount=0` and moves back to `queued`.
    *   **Discard:** Admin refunds Credit (manually) and marks as `failed_final`.

### Data Retention
*   DLQ jobs retain full context (`params`, `errorLogs`).
*   Retention Period: 7 days.

---

## 3. Cost Protection

*   **Credit Reservation:** Credits are "held" when job is `queued` (Pending Balance).
*   **Refund on Failure:**
    *   If Job ends in `failed` (System Error) -> Release Hold (Refund).
    *   If Job ends in `rejected` (Policy) -> Capture Hold (Penalty).
