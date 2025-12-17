# Web Billing Architecture

**Version:** 1.0
**Provider:** Stripe (Assumed Standard)
**Model:** Entitlements-First

---

## 1. Core Principles

1.  **Source of Truth:** Firestore `users/{uid}/entitlements/wallet`. The Frontend NEVER trusts local state for access.
2.  **Decoupling:** The Billing System knows `Processing`, `Success`, `Failed`. It does NOT know what images are generated.
3.  **No Stores:** Apple/Google policies are ignored. We use direct credit card processing.

---

## 2. Checkout Flow

### A. One-Time Purchase (Credit Pack)
1.  **User Trigger:** Select "Starter Pack" -> Click "Buy".
2.  **API Call:** `POST /api/create-checkout-session { sku: 'pack_starter' }`.
3.  **Redirect:** App redirects to `stripe.com` (Hosted Checkout).
4.  **Completion:**
    *   Success: Redirect to `/account/billing?status=success`.
    *   Cancel: Redirect to `/plans?status=canceled`.
5.  **Fulfillment (Async):** Webhook `checkout.session.completed` -> Backend adds Credits -> Updates Firestore.

### B. Subscription (Pro Plan)
1.  **User Trigger:** Select "Pro Plan" -> Click "Subscribe".
2.  **API Call:** `POST /api/create-subscription { priceId: 'price_pro' }`.
3.  **Redirect:** Stripe Hosted Checkout.
4.  **Completion:** Same as above.
5.  **Lifecycle:**
    *   `invoice.paid` -> Extend validity date.
    *   `customer.subscription.deleted` -> Set status to `expired`.

---

## 3. Customer Portal

*   **Access:** `/account/billing` -> "Manage Subscription".
*   **Action:** Redirect to Stripe Portal.
*   **Capabilities:**
    *   Update Payment Method.
    *   Download PDF Invoices (Compliance).
    *   Cancel Plan (Downgrade at period end).

---

## 4. UI Integration

### A. Billing Page (`/account/billing`)
*   **Current Plan:** Badges (Free / Pro).
*   **Credit Balance:** Giant Counter.
*   **History Table:**
    *   `Date` | `Item` | `Amount` | `Status` | `Invoice`
    *   *Note:* Neutral descriptions "Credit Pack", not "Feet Pics".

### B. Plan Selection (`/plans`)
*   **Layout:** 3-Column Pricing Table.
*   **Compliance:** "Safe" copy. No promises of specific content, just "High Resolution Generation".

---

## 5. Security Enforcements

*   **No Client-Side Upgrades:** Frontend simply polls Firestore. "Success" page is just UX sugar.
*   **Invoice Privacy:** Invoices stored in Stripe, linked via Portal. Not stored in app DB.
