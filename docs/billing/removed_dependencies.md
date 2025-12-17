# Removed Dependencies & Patterns

**Version:** 1.0
**Context:** App-to-Web Migration

---

## 1. Libraries to Uninstall

*   `react-native-iap`: **REMOVE**. No StoreKit needed.
*   `expo-in-app-purchases`: **REMOVE**.
*   `expo-store-review`: **REMOVE**. (No "Rate Us" popups).

---

## 2. Code Patterns to Prune

### A. Restore Purchases
*   **Pattern:** "Restore Purchases" button in Settings.
*   **Reason:** Web Billing is Account-based, not Device-based. Login restores everything automatically.
*   **Action:** Delete UI element.

### B. Store Listeners
*   **Pattern:** `usageEffect` listening for IAP transaction updates.
*   **Reason:** Transactions happen on Server via Webhook.
*   **Action:** Delete all client-side transaction listeners.

### C. Price Localization
*   **Pattern:** Fetching localized strings from App Store.
*   **Reason:** Web uses Stripe Checkout. Localization handled by Stripe Hosted Page.
*   **Action:** Hardcode base currency (USD/EUR) or fetch from internal API.

---

## 3. Compliance Check (Apple/Google)

*   **Rule:** "Apps cannot link to external payment."
*   **Status:** **IRRELEVANT**. This is a PWA/Web App. We are not distributing via App Store.
*   **Benefit:** 30% Fee -> 2.9% Fee.
