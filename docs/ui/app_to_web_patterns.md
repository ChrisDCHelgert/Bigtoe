# App-to-Web Pattern Migration

**Objective:** Remove native app "feeling" and specific store-banned patterns.

---

## 1. Navigation

| Native/App Pattern | Web/PWA Pattern | Action |
| :--- | :--- | :--- |
| **Bottom Navigation Bar** | Top Header or Side Navigation | **REPLACE** |
| **Swipe to Go Back** | Browser Back Button / Breadcrumbs | **REMOVE** Logic |
| **Stack Navigation (Push)** | URL Routing (Link) | **REFACTOR** Router |
| **Pull to Refresh** | "Refresh" Button / Auto-Updates | **REMOVE** Gesture |

---

## 2. UI Components

| Native/App Pattern | Web/PWA Pattern | Action |
| :--- | :--- | :--- |
| **Action Sheet (Bottom)** | Dropdown Menu / Popover | **REPLACE** |
| **Native Modal (Full Screen)** | Centered Dialog / Page Route | **REPLACE** |
| **Toggle Switch** | Checkbox or Switch (Style dependent) | **KEEP** |
| **Picker Wheel** | HTML `<select>` or `Combobox` | **REPLACE** |

---

## 3. Interaction

| Native/App Pattern | Web/PWA Pattern | Action |
| :--- | :--- | :--- |
| **Long Press** | Right Click / Context Menu | **REPLACE** |
| **Haptic Feedback** | Visual Feedback (Ripple/Color) | **REMOVE** |
| **Biometric Auth** | WebAuthn or Password | **REFACTOR** |
| **In-App Purchase (StoreKit)** | Stripe Checkout (Redirect) | **REPLACE** |

---

## 4. Specific BigToe Adjustments

1.  **Generator:** Convert "Swipeable Filters" to a robust **Side Panel form**.
2.  **Gallery:** Remove "Hold to Select". Add explict "Select" button or Hover actions.
3.  **Onboarding:** Remove "Paged Swipe". Use a scrollable Landing Page or Stepper.
