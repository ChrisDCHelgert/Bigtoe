# Metrics Dashboard & KPIs

**Version:** 1.0
**Tools:** Cloud Monitoring / Grafana

---

## 1. Product KPIs (Business Logic)

| Metric | Type | Description | Goal |
| :--- | :--- | :--- | :--- |
| **`total_revenue`** | Counter | Sum of all pack/subscription purchases. | Growth |
| **`jobs_completed`** | Counter | Successfull image generations. | Engagement |
| **`active_users_daily`** | Gauge | Unique `user_id` hitting API in 24h. | Retention |
| **`churn_rate`** | Gauge | % of Subs cancelled vs renewed. | < 5% |
| **`abuse_rate`** | Ratio | `POLICY_VIOLATION` / `JOB_CREATED`. | < 1% |

---

## 2. Technical Metrics (Reliability)

| Metric | unit | Description | SLA Target |
| :--- | :--- | :--- | :--- |
| **`api_latency_p95`** | ms | 95th Percentile generation time. | < 15s |
| **`job_failure_rate`** | % | % of Jobs ending in `failed`. | < 2% |
| **`api_error_5xx`** | Rate | API Server Errors. | 0 |
| **`dlq_depth`** | Gauge | Jobs stuck in Dead Letter Queue. | 0 |

---

## 3. Visualization Layout

### Panel 1: Health Overview
*   [Graph] Job Success Rate (Last 1h)
*   [Graph] API Latency (p50, p95)
*   [Number] Active Users Now

### Panel 2: Moderation & Safety
*   [Graph] Blocked Prompts per Minute
*   [Table] Top Violation Categories (e.g. "Keyword: fetish", "AI: unsafe")
*   [Number] Suspended Users today

### Panel 3: Business
*   [Bar] Revenue by Pack Type (Starter, Pro, Sub)
*   [Line] Credit Consumption Rate
