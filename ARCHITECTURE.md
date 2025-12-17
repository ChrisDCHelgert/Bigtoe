# BigToe System Architecture

## 1. High-Level Design

BigToe follows a **Serverless Modular Monolith** pattern, primarily driven by a React SPA (Single Page Application) with strict client-side enforcement boundaries and Firebase backend services.

### Core Components
*   **Web Client (PWA):** React 18 / Vite. Handles UI, Input Validation, and API Orchestration.
*   **Auth Service:** Firebase Auth. Manages Identity (Guest -> Registered) and Claims (Age Verified).
*   **Data Store:** Firestore. Stores Users, Job State, Tickets, and Audit Logs.
*   **Object Store:** Firebase Storage. Private buckets for generated Assets.
*   **AI Gateway:** Client-side orchestration calling Cloud Functions (future) or direct APIs (prototype) for Gemini/Pollinations.

---

## 2. Compliance Architecture

The system is built around a "Guardrails First" philosophy.

1.  **Input Vector:** User Prompt -> `PromptGuard` (Regex/Blacklist) -> `Gemini` (System Prompt Safety) -> `Image Gen`.
2.  **Output Vector:** Image URL -> `Library` (Private). No public feed prevents mass distribution of violations.
3.  **Audit Trail:** Every blocked attempt is logged to `audit_logs` (Write-Only).

---

## 3. Data Flow (Generation)

1.  **Quota Check:** `Wallet` checks balance > 5 credits.
2.  **Validation:** `Guard` checks policy compliance.
3.  **Enhancement:** `Gemini` expands prompt (with safety instructions).
4.  **Synthesis:** `Pollinations` generates pixel data.
5.  **Persistence:** Result saved to `Storage` (Bucket) + `Firestore` (Index).

---

## 4. Key Decisions

*   **PWA over Native:** Bypasses Store App Review friction while maintaining 100% Policy Control.
*   **No Social Features:** Deliberate decision to reduce moderation burden and risk.
*   **Entitlements as Code:** Billing logic is decoupled from content logic to ensure privacy.
