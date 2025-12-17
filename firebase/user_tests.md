# User Management Test Cases

**Version:** 1.0
**Target:** Firestore Emulator

---

## 1. Lifecycle Transition Tests

### Test 1.1: Guest Creation
*   **Action:** Create user with `status: 'guest'`, `isAnonymous: true`.
*   **Expect:** Success.
*   **Verify:** Role defaults to `undefined` (rules handle generic user) or `user`.

### Test 1.2: Upgrade to Registered
*   **Setup:** Guest user exists.
*   **Action:** Update `status: 'registered'`, `isAnonymous: false` as Owner.
*   **Expect:** Success (Owner allowed to update specific fields).

### Test 1.3: Admin Suspend User
*   **Setup:** Active user `user_A`. Admin `admin_1`.
*   **Action:** `admin_1` updates `user_A` doc -> `status: 'suspended'`.
*   **Expect:** Success.
*   **Verify:** `user_A` cannot write to `jobs` anymore.

---

## 2. Role Enforcement Tests

### Test 2.1: User cannot promote self
*   **Setup:** Standard User.
*   **Action:** Update own doc `role: 'admin'`.
*   **Expect:** **DENIED**. (Rules limit allowed keys for Owner update).

### Test 2.2: Moderator Access
*   **Setup:** Moderator `mod_1`. Flagged Job `job_X`.
*   **Action:** `mod_1` reads `jobs/job_X`.
*   **Expect:** Success.

### Test 2.3: Moderator Privacy Limit
*   **Setup:** Moderator `mod_1`. Private Asset `asset_Y` (not flagged).
*   **Action:** `mod_1` reads `assets/asset_Y`.
*   **Expect:** **DENIED**. (Strict privacy).

---

## 3. Compliance Enforcement

### Test 3.1: Suspended User Block
*   **Setup:** Suspended user `suspended_1`.
*   **Action:** Create new Job.
*   **Expect:** **DENIED** (`isNotSuspended()` check).

### Test 3.2: Age Gate Block
*   **Setup:** User `minor_1`, `ageVerified: false`.
*   **Action:** Create new Job.
*   **Expect:** **DENIED** (`isAgeVerified()` check).

### Test 3.3: Delete Retention (Soft Delete)
*   **Setup:** User `deleted_1`, `status: 'deleted'`.
*   **Action:** User tries to read own assets.
*   **Expect:** **DENIED** (Status check fails).
