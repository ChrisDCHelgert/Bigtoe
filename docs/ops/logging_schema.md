# Structured Logging Schema

**Version:** 1.0
**Format:** JSON (NDJSON)

---

## 1. Standard Fields (All Logs)

Every log entry MUST contain these fields:

```json
{
  "timestamp": "ISO-8601",
  "level": "INFO" | "WARN" | "ERROR",
  "service": "bigtoe-backend",
  "env": "dev" | "prod",
  "trace_id": "uuid",
  "user_id": "uid" | "anonymous",
  "context": {} 
}
```

---

## 2. Event Types & Schemas

### A. Job Lifecycle (`JOB_*`)

**Event:** `JOB_CREATED`
```json
{
  "event_type": "JOB_CREATED",
  "job_id": "job_123",
  "params": {
    "style": "photorealistic",
    "model": "sdxl"
  },
  "cost": 5
}
```

**Event:** `JOB_COMPLETED`
```json
{
  "event_type": "JOB_COMPLETED",
  "job_id": "job_123",
  "duration_ms": 4500,
  "provider": "pollinations"
}
```

**Event:** `JOB_FAILED`
```json
{
  "event_type": "JOB_FAILED",
  "job_id": "job_123",
  "error_code": "API_TIMEOUT",
  "retry_count": 2
}
```

### B. Policy & Abuse (`POLICY_*`)

**Event:** `POLICY_VIOLATION`
```json
{
  "event_type": "POLICY_VIOLATION",
  "severity": "high",
  "violation_type": "keyword_block",
  "blocked_term": "fetish",
  "input_hash": "sha256(prompt)" // PII Protection: Never log raw forbidden prompt
}
```

### C. System & Auth (`SYS_*`)

**Event:** `AUTH_LOGIN`
```json
{
  "event_type": "AUTH_LOGIN",
  "auth_method": "google",
  "is_new_user": false
}
```

---

## 3. PII & Compliance Rules

1.  **No Raw Prompts:** Never log user prompt text if it was flagged as unsafe.
2.  **IP Anonymization:** Truncate last octet before logging if not required for security investigation.
3.  **Retention:**
    *   Operational Logs: 30 days.
    *   Security/Audit Logs: 1 year (Immutable).
