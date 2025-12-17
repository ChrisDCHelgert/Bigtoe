# Privacy & Retention Test Scenarios

**Version:** 1.0
**Context:** Compliance Verification

---

## 1. Deletion Tests

### Test 1.1: Request Deletion (Soft Delete)
*   **Action:** User clicks "Delete Account".
*   **Expect:**
    *   Auth Token revoked (User logged out).
    *   Firestore Doc `status` = 'deleted'.
    *   Data **remains** in storage (for now).

### Test 1.2: The Sweeper (Hard Delete)
*   **Setup:** User `del_1` marked deleted 31 days ago.
*   **Action:** Run `runRetentionSweep()`.
*   **Expect:**
    *   Firestore Doc `del_1` -> Gone.
    *   Storage `originals/del_1/` -> Gone.
    *   Auth User `del_1` -> Gone.

### Test 1.3: Grace Period Protection
*   **Setup:** User `del_2` marked deleted 10 days ago.
*   **Action:** Run `runRetentionSweep()`.
*   **Expect:** User `del_2` is **NOT** deleted.

---

## 2. Export Tests

### Test 2.1: Data Portability
*   **Action:** Request Export.
*   **Expect:**
    *   Receive secure URL.
    *   Download contains JSON of Profile + Credits.
    *   Download contains images from Library.

### Test 2.2: Access Control
*   **Action:** User A requests export for User B.
*   **Expect:** **DENIED** (Auth Check).
