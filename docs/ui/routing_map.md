# Routing Map (Web Architecture)

**Version:** 1.0
**Context:** URL-Based Routing for PWA

---

## 1. Route Key

| Path | Component | Auth Required? | Layout | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/` | `LandingPage` | No | Public | Marketing / Login entry. |
| `/home` | `Dashboard` | Yes | AppShell | Redirects to `/generate`. |
| `/generate` | `Generator` | Yes | AppShell | Main tool. URL params optional (`?template=xyz`). |
| `/library` | `Library` | Yes | AppShell | Private Assets Grid. |
| `/library/:id` | `AssetDetail` | Yes | AppShell | Single Asset View (Deep linkable). |
| `/plans` | `Pricing` | Yes | AppShell | Credits & Subscription. |
| `/account` | `AccountLayout` | Yes | AppShell | Settings Root. |
| `/account/profile` | `ProfileSettings` | Yes | AppShell | User info. |
| `/account/billing` | `BillingHistory` | Yes | AppShell | Invoices. |
| `/support` | `SupportCenter` | Yes | AppShell | FAQ & Tickets. |
| `/auth/login` | `Login` | No | Blank | |
| `/auth/verify` | `VerifyEmail` | No | Blank | |

---

## 2. Dynamic Routing Rules

*   **Deep Linking:** All "Detail" views MUST have a unique URL.
    *   *Bad:* Opening a modal for image details without URL change.
    *   *Good:* `/library/123` can be bookmarked or refreshed.
*   **Redirects:**
    *   Guest accessing `/library` -> `/auth/login?redirect=/library`
    *   Logged-in user hitting `/` -> `/generate`

---

## 3. Navigation Structure (Top Nav)

*   **Brand:** Left aligned.
*   **Links:** Center (Desktop) or Sidebar (Mobile).
    *   Generate
    *   Library
    *   Plans
*   **User Menu:** Right aligned (Avatar Dropdown).
    *   Account
    *   Support
    *   Logout
