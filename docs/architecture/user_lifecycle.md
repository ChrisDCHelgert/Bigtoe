# User Lifecycle Definition

**Version:** 1.0
**Compliance:** GDPR & BigToe Policy

---

## 1. Lifecycle States

The `status` field in the `users` collection dictates the user's standing.

1.  **Guest (`guest`)**
    *   **Trigger:** First app launch (Anonymous Auth).
    *   **Rights:** Can view public pages, limited generation (demo), accept Age Gate.
    *   **Data:** Device-bound.
    *   **Compliance:** Must accept Age Gate to proceed to generation.

2.  **Registered (`registered`)**
    *   **Trigger:** User links Email/Password or Social Auth.
    *   **Rights:** Full generation features, library persistence across devices.
    *   **Data:** Linked to persistent ID. Entitlements preserved from Guest session.

3.  **Active (`active`)**
    *   **Trigger:** Email verified (optional enforcement) or immediate post-registration.
    *   **Rights:** Standard operating mode.

4.  **Suspended (`suspended`)**
    *   **Trigger:** Violation of Content Policy (e.g., attempt to generate blocked content repeatedly).
    *   **Rights:** Read-only access to Settings (to request data export). **NO generation.** **NO library access** (if content is under review).
    *   **Restoration:** Manual review by Moderator.

5.  **Deleted (`deleted`)**
    *   **Trigger:** User request (GDPR) or Permanent Ban.
    *   **Mechanism:**
        *   **Soft Delete:** Flag `isDeleted: true`. Data retained for 30 days for legal hold.
        *   **Hard Delete:** Permanent scrubbing of PII after 30 days.
    *   **Rights:** None. Auth token revoked.

---

## 2. State Transitions & Rules

| From | To | Trigger | Action Required |
| :--- | :--- | :--- | :--- |
| `guest` | `registered` | Login / Link Account | Merge Entitlements, Copy Assets to new Owner ID (if changed) |
| `registered` | `active` | Verification | Enable full limits |
| `active` | `suspended` | Policy Violation | Kill current jobs, Revoke Session |
| `suspended` | `active` | Appeal Accepted | Restore permissions |
| *Any* | `deleted` | User Request / Ban | Trigger Retention Timer |

---

## 3. Account Linking (Guest -> Registered)

*   **Goal:** No data loss during upgrade.
*   **Process:**
    1.  User starts as Anonymous. Assets created under `uid_A`.
    2.  User clicks "Sign Up".
    3.  Frontend calls `firebase.auth().currentUser.linkWithCredential(cred)`.
    4.  UID remains `uid_A` (Ideal) OR assets must be migrated if UID changes (unlikely with Link).
    5.  Update User Doc: `isAnonymous: false`, `status: 'registered'`.

---

## 4. Consent Versioning

*   **Requirement:** Users must re-accept terms if Policy changes.
*   **Implementation:**
    *   `policy_version`: Stored in Remote Config (e.g., "1.2").
    *   User Doc: `consentVersion`: "1.1".
    *   **Check:** If `config.policy_version > user.consentVersion` -> Show Blocking Overlay.
