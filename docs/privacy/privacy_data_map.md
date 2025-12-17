# Privacy Data Map & Classification

**Version:** 1.0
**Compliance:** GDPR / DSGVO

---

## 1. Data Inventory

| Collection / Field | Classification | Description | PII? | Encrypted? |
| :--- | :--- | :--- | :--- | :--- |
| **`users`** | | | | |
| `email` | **Confidential** | User Email (Auth). | YES | At Rest |
| `displayName` | **Confidential** | User Profile Name. | YES | No |
| `lastLogin` | Internal | Timestamp. | No | No |
| `ageVerified` | Legal | Compliance Flag. | No | No |
| **`jobs`** | | | | |
| `prompt` | **Sensitive** | User creativity input. | Possible | No |
| `resultUrl` | **Sensitive** | Link to generated content. | No | No |
| `creatorId` | Internal | Foreign Key to User. | No | No |
| **`assets`** | | | | |
| `image_blob` | **Private** | The actual image file. | Possible | Yes (ACL) |
| **`audit_logs`** | | | | |
| `ip_address` | **Confidential** | User IP (Anonymized). | YES | No |
| `user_id` | Internal | Pseudonymized ID. | No | No |

---

## 2. Handling Rules

### A. PII (Personally Identifiable Information)
*   **Storage:** Must be isolated or protected by strict ACLs.
*   **Access:** Only User (Owner) and specific Admin processes (GDPR Request).
*   **Retention:** Must be deleted upon "Right to be Forgotten" request.

### B. Sensitive Content (Prompts/Assets)
*   **Storage:** Private Buckets.
*   **Access:** Strictly Owner-only. No public sharing.
*   **Retention:** Soft-delete allowed, but must be scrubbed eventually.

### C. Technical Meta-Data (Logs)
*   **Handling:** IP Addresses must be truncated or hashed after 7 days.
*   **Access:** DevOps/Security Team.

---

## 3. Data Processing Agreements (DPA)

*   **Google Firebase:** Auth, DB, Hosting.
*   **Google Gemini:** Processor (Prompt Enhancement). State: Stateless (No training).
*   **Pollinations.ai:** Processor (Image Gen). State: Transient.
