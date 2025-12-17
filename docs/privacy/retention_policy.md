# Retention Policy

**Version:** 1.0
**Context:** Lifecycle Management of User Data

---

## 1. General Principles

1.  **Minimization:** Store only what is needed.
2.  **Right to Erasure:** User deletion requests are honored within 30 days.
3.  **Legal Hold:** Certain data (payments) must be kept strictly for tax/legal reasons.

---

## 2. Retention Schedule

| Data Category | Retention Period | Action | Reason |
| :--- | :--- | :--- | :--- |
| **Guest Accounts** | 90 days of inactivity | Hard Delete | Clean up unused IDs. |
| **Deleted Accounts** | 30 days (Grace Period) | Hard Delete | Allow for recovery / mistake correction. |
| **Payment Records** | 10 years | Archival | Tax Law. |
| **Audit Logs** | 1 year | Hard Delete | Security Governance. |
| **Job History** | 90 days | Soft Delete | Performance / Cost. |
| **Generated Assets** | Indefinite (User controlled) | N/A | User property until account deletion. |

---

## 3. Automated Processes

### A. The Sweeper (Daily Job)
*   **Query:** `users` where `status == 'deleted'` AND `deletedAt < NOW - 30 days`.
*   **Action:**
    1.  Delete Auth User.
    2.  Delete Firestore User Doc.
    3.  Delete Storage Folder `originals/{uid}`.
    4.  **Keep** Payment Transaction Logs (Anonymized foreign key).

### B. The Guest Reaper (Weekly Job)
*   **Query:** `users` where `isAnonymous == true` AND `lastLogin < NOW - 90 days`.
*   **Action:** Hard Delete.

---

## 4. User Rights Implementation

### A. Export Data (Art. 20)
*   User triggers "Download My Data".
*   System bundles:
    *   Profile JSON (`users/{uid}`)
    *   Assets (Zipped URLs)
    *   Entitlement Balance
*   Delivered via Signed URL (Expires in 24h).

### B. Delete Account
*   User triggers "Delete Account".
*   System sets `status: 'deleted'`, `deletedAt: serverTimestamp()`.
*   Auth Token Revoked.
*   Data enters 30-day "Coffin" state before final incineration.
