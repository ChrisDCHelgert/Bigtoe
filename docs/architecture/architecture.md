# BigToe Target Architecture

**Version:** 1.0 (Draft)
**Compliance Level:** Strict (Policy v1.0)
**Platform:** Web / PWA Only

---

## 1. Architectural Principles

1.  **Compliance First:** Every module must strictly adhere to the Content Policy.
2.  **Privacy by Design:** No social features, private libraries, strict separation of billing and content.
3.  **Unidirectional Data Flow:** Data flows down, events bubble up. No circular dependencies.
4.  **Guardails:** Input must pass through entities (Prompt Guard) before reaching Core (Generation).

---

## 2. Module Definitions

### 1. AgeGate & Consent
*   **Responsibility:** Enforce 18+ access and manage legal consent.
*   **Entities:** `ConsentRecord`, `PolicyVersion`.
*   **Use-Cases:**
    *   Show Age Gate Overlay on first visit.
    *   Block access until explicitly accepted.
    *   Store consent timestamp and version.
    *   Re-trigger on Policy Update.
*   **Public Interface:** `checkAccess()`, `grantConsent()`, `revokeConsent()`.
*   **Dependencies:** `Logging & Audit`.

### 2. Auth (Identity)
*   **Responsibility:** Manage user identity and sessions.
*   **Entities:** `User`, `Session`, `DeviceToken`.
*   **Use-Cases:**
    *   Anonymous "Guest" session (device-bound).
    *   Upgrade to "Account" (Email/Pass).
    *   Token refresh.
*   **Public Interface:** `getCurrentUser()`, `login()`, `logout()`, `upgradeAccount()`.
*   **Dependencies:** `Logging & Audit`.

### 3. Prompt Guard & Moderation (Security Layer)
*   **Responsibility:** Sanitize and validate all user inputs BEFORE generation.
*   **Entities:** `Blacklist`, `SanitizationRule`, `ValidationResult`.
*   **Use-Cases:**
    *   Validate prompt parameters against Policy §4.
    *   Sanitize free-text (if allowed).
    *   Reject forbidden patterns.
*   **Public Interface:** `validateRequest(params)`, `sanitize(text)`.
*   **Dependencies:** `Remote Config` (for dynamic blocklists).

### 4. Generation Core (Engine)
*   **Responsibility:** Orchestrate image generation jobs.
*   **Entities:** `GenerationJob`, `JobStatus`, `GenerationResult`.
*   **Use-Cases:**
    *   Create Job (Parameter-based).
    *   Poll Job Status.
    *   Retrieve Result URL.
*   **Public Interface:** `createJob(params)`, `getJob(id)`.
*   **Dependencies:** `Prompt Guard` (MUST be called before execution), `Monetization` (Check/Deduct credits), `Logging`.

### 5. Library (Asset Management)
*   **Responsibility:** Store and serve user's generated private assets.
*   **Entities:** `Asset`, `Album`, `AccessControl`.
*   **Use-Cases:**
    *   Save generated image.
    *   Delete image.
    *   Download image.
*   **Public Interface:** `saveAsset(jobResult)`, `getAssets()`, `deleteAsset()`.
*   **Dependencies:** `Auth` (Owner check). **NO Sharing features.**

### 6. Monetization (Entitlements)
*   **Responsibility:** Manage credits, subscriptions, and billing separation.
*   **Entities:** `Wallet`, `Transaction`, `Product`, `Entitlement`.
*   **Use-Cases:**
    *   Check Balance.
    *   Deduct Credits (Atomic).
    *   Purchas Pack/Sub.
*   **Public Interface:** `hasBalance(amount)`, `deduct(amount)`, `purchase(sku)`.
*   **Dependencies:** `Auth`, `Logging`.

### 7. Logging & Audit
*   **Responsibility:** Compliance logging and error tracking.
*   **Entities:** `AuditLog`, `ErrorEntry`.
*   **Use-Cases:**
    *   Log AgeConsent.
    *   Log Failed/Blocked Prompts (Security).
    *   Log Purchases.
*   **Public Interface:** `logEvent(type, payload)`, `logViolation(context)`.
*   **Dependencies:** None (Infrastructure level).

### 8. Remote Config / Feature Flags
*   **Responsibility:** Dynamic control of features and policy constraints.
*   **Entities:** `FeatureFlag`, `ConfigParam`.
*   **Use-Cases:**
    *   Update Blacklist remotely.
    *   Disable Generation globally (Killswitch).
    *   Enable/Disable Models.
*   **Public Interface:** `getConfig(key)`, `isFeatureEnabled(flag)`.
*   **Dependencies:** None.

---

## 3. Strict Rules & Prohibitions

### "NEVER DO" Rules (Architectural Barriers)

1.  **Prompt Guard Bypass:**
    *   `Generation Core` must **NEVER** accept input directly from UI without passing through `Prompt Guard`.
    *   *Enforcement:* The `createJob` interface requires a `ValidationToken` signed by `Prompt Guard`.

2.  **Billing / Content Separation:**
    *   `Monetization` must **NEVER** know the content of a `GenerationJob`. It only knows "SKU: Image_Gen_Standard" and cost.
    *   *Reason:* Privacy & Policy §9.

3.  **No Social Graph:**
    *   `Library` must **NEVER** have methods like `share()`, `publish()`, or `getPublicFeed()`.
    *   *Reason:* Policy §6 & §7.

4.  **Log Sanitization:**
    *   `Logging` must **NEVER** store the actual prompt text of *successful* generations (Privacy). It SHOULD store *blocked* prompts for security analysis.

5.  **Age Gate Permanence:**
    *   `Auth` must **NEVER** issue a session token if `AgeGate` consent is missing or expired.
