# Web Layout System Structure

**Version:** 1.0
**Context:** Responsive Grid & Shell

---

## 1. App Shell Component

The `<AppShell />` is the persistent wrapper for all authenticated routes.

### Layout Grid (CSS Grid)

```css
.app-shell {
  display: grid;
  height: 100vh;
  grid-template-rows: auto 1fr; /* Header + Content */
  grid-template-areas: 
    "header"
    "content";
}

@media (min-width: 1024px) {
  .app-shell {
    grid-template-columns: 250px 1fr; /* Sidebar + Content */
    grid-template-rows: auto 1fr;
    grid-template-areas:
      "header header"
      "sidebar content";
  }
}
```

### Areas
1.  **Header (`header`):**
    *   **Mobile:** Brand + Burger Menu.
    *   **Desktop:** Brand + User Avatar.
2.  **Navigation (`sidebar` / `drawer`):**
    *   **Mobile:** Collapsible Drawer (shadcn `Sheet`).
    *   **Desktop:** Fixed Sidebar (Left).
3.  **Main Content (`content`):**
    *   Scrollable Area (`overflow-y: auto`).
    *   Bounded Max-Width (`max-w-7xl mx-auto`).
    *   Padding (`p-4` to `p-8`).

---

## 2. Responsive Breakpoints

| Breakpoint | Width | Behavior |
| :--- | :--- | :--- |
| **Mobile** | < 768px | Stacked Layout. 1 Column. Drawer Nav. |
| **Tablet** | 768 - 1024px | 2 Column Grid. Condensed Sidebar. |
| **Desktop** | > 1024px | Expanded Layout. Full Sidebar. |

---

## 3. Screen Templates

### A. Generator Layout (Split View)
*   **Desktop:**
    *   Left: Parameters Form (300px Fixed).
    *   Right: Preview / Result Area (Flex Grow).
*   **Mobile:**
    *   Tabs: [Controls] | [Preview].

### B. Library Layout (Responsive Grid)
*   `grid-cols-2` (Mobile) -> `grid-cols-4` (Tablet) -> `grid-cols-5` (Desktop).
*   Aspect Ratio Squares.

### C. Account Settings (Master-Detail)
*   **Desktop:** Left Vertical Tabs, Right Content.
*   **Mobile:** Full page list -> Full page detail (Breadcrumbs needed).
