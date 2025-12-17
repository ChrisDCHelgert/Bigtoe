# BigToe Firestore Data Schema

**Version:** 1.0
**Compliance:** Strict Separation of Duties, Privacy First

---

## 1. Collections

### `users` (Collection)
*   **Doc ID:** `uid` (Auth ID)
*   **Fields:**
    *   `createdAt`: Timestamp
    *   `status`: 'guest' | 'registered' | 'active' | 'suspended' | 'deleted'
    *   `role`: 'user' | 'moderator' | 'admin'
    *   `isAnonymous`: boolean
    *   `lastLogin`: Timestamp
    *   `ageVerified`: boolean (Must be TRUE to generate)
    *   `consentVersion`: string (e.g., "1.0")
    *   `consentHistory`: array of maps (timestamp, version, ip)
*   **Subcollections:**
    *   `private/profile`: Sensitive data (email, etc. if needed later)
    *   `entitlements/wallet`: Credit balance (Separated for security)

### `jobs` (Collection)
*   **Doc ID:** `jobId` (Auto-ID)
*   **Purpose:** Orchestration of generation requests.
*   **Fields:**
    *   `creatorId`: string (uid)
    *   `status`: 'pending' | 'processing' | 'completed' | 'failed' | 'flagged'
    *   `params`: map (The generation parameters)
        *   `prompt`: string (Sanitized)
        *   `style`: string
        *   `isTest`: boolean
    *   `resultUrl`: string (Temporary URL or Reference)
    *   `createdAt`: Timestamp
    *   `expiresAt`: Timestamp (TTL 24h)
*   **Security:**
    *   Create: Authenticated Users only.
    *   Read: `resource.data.creatorId == request.auth.uid`
    *   Update: Admin or Backend System only.

### `assets` (Collection)
*   **Doc ID:** `assetId` (Auto-ID)
*   **Purpose:** Long-term storage of user library.
*   **Fields:**
    *   `ownerId`: string (uid)
    *   `storagePath`: string (e.g., `originals/{uid}/{assetId}.png`)
    *   `thumbnailPath`: string
    *   `metadata`: map
        *   `resolution`: string
        *   `generatedAt`: Timestamp
    *   `isDeleted`: boolean
*   **Security:**
    *   Read: `resource.data.ownerId == request.auth.uid`
    *   Write: Backend System only (User cannot arbitarily create assets, must come from Job).
    *   Delete: `resource.data.ownerId == request.auth.uid` (Soft delete)

### `audit_logs` (Collection)
*   **Doc ID:** Auto-ID
*   **Purpose:** Compliance logging (Write-only for Client).
*   **Fields:**
    *   `userId`: string
    *   `event`: 'AGE_CONSENT' | 'PROMPT_BLOCK' | 'PURCHASE'
    *   `details`: map
        *   `reason`: string (e.g. "Blocked Term: fetish")
        *   `version`: string
    *   `timestamp`: ServerTimestamp
*   **Security:**
    *   Create: Authenticated Users.
    *   Read: NO ONE (Admin SDK only).
    *   Update/Delete: DENY.

### `moderation_flags` (Collection)
*   **Doc ID:** Auto-ID
*   **Purpose:** Queue for manual review of reported content.
*   **Fields:**
    *   `assetId`: string
    *   `reporterId`: string
    *   `reason`: string
    *   `status`: 'open' | 'resolved'
    *   `timestamp`: ServerTimestamp
*   **Security:**
    *   Create: Authenticated Users.
    *   Read: Moderators only.

---

## 2. Storage Paths

*   `/originals/{uid}/{assetId}.png`
    *   **Rule:** Read/Write only by Owner (and System).
*   `/thumbnails/{uid}/{assetId}_thumb.png`
    *   **Rule:** Read/Write only by Owner (and System).

---

## 3. Critical Enforcements

1.  **Immutability:** `audit_logs` cannot be tampered with.
2.  **Asset Ownership:** Strict checks on `ownerId` for all Library access.
3.  **Age Gate:** Jobs cannot be created if `request.auth.token.ageVerified` (Custom Claim) or User Doc `ageVerified` is false. (Rules implementations will check user doc).
