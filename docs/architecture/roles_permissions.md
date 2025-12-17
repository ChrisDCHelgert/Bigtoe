# Roles & Permissions (RBAC)

**Version:** 1.0
**Principle:** Least Privilege

---

## 1. Roles

Roles are stored in the User Document (or Custom Claims for performance).
Default role: `user`.

### A. User (`user`)
*   **Scope:** Own Resources.
*   **Capabilities:**
    *   Generate Images (Rate limited).
    *   Read/Write Own Assets.
    *   Purchase Credits.
    *   Delete Self.

### B. Moderator (`moderator`)
*   **Scope:** Moderation Queue, Flagged Content.
*   **Capabilities:**
    *   Read `moderation_flags`.
    *   Read `jobs` flagged as suspicious.
    *   **Cannot** read private `assets` unless flagged.
    *   **Cannot** generate on behalf of users.
    *   Action: `suspendUser(uid)`, `resolveFlag(id)`.

### C. Admin (`admin`)
*   **Scope:** System Wide.
*   **Capabilities:**
    *   Configure System (Remote Config).
    *   View Aggregate Analytics.
    *   Manage Moderators.
    *   **Cannot** view user private assets without Audit Trail.

---

## 2. Permission Matrix

| Resource | Action | User | Moderator | Admin | Condition |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Job** | Create | ✅ | ❌ | ❌ | Age Verified, Status!=Suspended |
| **Job** | Read | Own | Flagged | All | |
| **Asset** | Read | Own | Flagged | Audit | Private by default |
| **User** | Read Profile | Own | Basic Info | Full | PII restricted |
| **User** | Suspend | ❌ | ✅ | ✅ | |
| **User** | Delete | Own | ❌ | ✅ | Hard Delete |
| **Audit** | Read | ❌ | ❌ | ✅ | Read Only |

---

## 3. Implementation in Firestore

**Field:** `role` (string) in `users/{uid}`.

**Security Rule Helper:**
```javascript
function hasRole(roleName) {
  return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == roleName;
}
```

**Critical Safety:**
*   Role field must be protected. Only `admin` can update `role`.
*   Users cannot upgrade themselves.
