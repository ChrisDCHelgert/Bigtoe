# Support System Flow

**Version:** 1.0
**Compliance:** Strict Bot Limitations & Content Filtering

---

## 1. Entry Points

### A. Global Help Center
*   **Access:** Profile > "Help & Support".
*   **UI Components:**
    1.  **FAQ Search:** Instant answers for "Refunds", "Credits", "Style Guide".
    2.  **Support Bot:** "Ask Helper" (Strict Scope).
    3.  **My Tickets:** View status of open/closed inquiries.

### B. Contextual Actions
*   **Result Screen:** "Report Image" (Strictly Content Moderation).
*   **Purchase Screen:** "Billing Help" (Direct to Billing Category).

---

## 2. Interaction Flows

### Flow 1: The Support Bot (First Line)
1.  **User Input:** Typed query.
2.  **Filter Check:** Input validated against `PromptGuard.blacklist`.
    *   *Violation:* "Input contains forbidden terms." -> Block.
3.  **Intent Classification:** Bot analyzes intent.
    *   *Allowed:* Billing, How-to, Policy, FAQ.
    *   *Forbidden:* General Chat, Roleplay, Creative Writing. -> "I can only answer support questions."
4.  **Response:** Pre-defined snippets or strict RAG based on Documentation.

### Flow 2: Ticket Creation (Escalation)
1.  **Trigger:** Bot cannot solve issue OR User selects "Contact Human".
2.  **Category Selection:** `Billing`, `Technical`, `Policy`, `Account`.
    *   *Constraint:* No `Other` category to prevent unclassified spam.
3.  **Form Input:**
    *   Subject (Dropdown preferred).
    *   Description (Sanitized Text Area).
4.  **Submission:**
    *   Creates Doc in `tickets`.
    *   Auto-reply: "Received. Response in 24h."

### Flow 3: Content Reporting
1.  **Trigger:** User views an Asset (Own or System Template) -> "Report".
2.  **Reason:** `Illegal`, `Minor`, `Non-Consensual`, `Glitch`.
3.  **Action:**
    *   Creates Doc in `moderation_flags`.
    *   Asset hidden from User immediately.
    *   Alert sent to Mods.

---

## 3. Safety Enforcement

*   **No Free Chat:** The Support Bot is NOT a conversational partner. It is a Retrieval System.
*   **Input Sanitization:** All text fields in Support Forms run through the **same** `validatePrompt` regex/logic as the Generator.
*   **Audit:** All Support Interactions are logged.
