# Alerting Rules

**Version:** 1.0
**Channel:** Email (Ops Team) / PagerDuty (Critical)

---

## 1. Critical Alerts (P0 - Immediate Action)

### A. High Failure Rate
*   **Condition:** `job_failure_rate > 10%` for 5 minutes.
*   **Meaning:** Vendor API is down or breaking change deployed.
*   **Action:** Check Vendor Status Page, check recent deployments.

### B. Payment Anomaly
*   **Condition:** `purchase_failed_rate > 20%` for 10 minutes.
*   **Meaning:** Payment Gateway issue.
*   **Action:** Verify Stripe Webhooks.

### C. Security Spike (Bot Attack)
*   **Condition:** `POLICY_VIOLATION` count > 100/min from single IP/User.
*   **Meaning:** Active script trying to bypass filters.
*   **Action:** Auto-ban IP, Trigger Cloudflare challenge.

---

## 2. Warning Alerts (P1 - investigate)

### A. Latency Degredation
*   **Condition:** `api_latency_p95 > 20s` for 15 minutes.
*   **Meaning:** Models are slow or cold starts.
*   **Action:** Monitor for user complaints.

### B. DLQ Accumulation
*   **Condition:** `dlq_depth > 10`.
*   **Meaning:** Several jobs permanently failed.
*   **Action:** Manual review of DLQ items.

---

## 3. Severity Levels

*   **SEV-1 (Critical):** Service Down, Data Loss, Security Breach. (Wake up team)
*   **SEV-2 (Major):** Partial degradation, High Latency in one region.
*   **SEV-3 (Minor):** Non-critical bugs, cosmetic issues.
