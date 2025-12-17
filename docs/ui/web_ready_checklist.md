# Web-Ready UI Checklist

---

## 1. Structure & Meta
- [ ] **Favicons:** PWA Manifest updated.
- [ ] **Title Tags:** Dynamic `<title>` per route (e.g. "Gallery - BigToe").
- [ ] **Viewport:** Correct meta tags for mobile scaling.
- [ ] **404 Page:** Custom error page for invalid routes.

## 2. Navigation
- [ ] **Desktop:** Top Navigation bar is functional.
- [ ] **Mobile:** Hamburger menu works.
- [ ] **Links:** All internal transitions use `<Link>` (no full reloads).
- [ ] **Active State:** Current nav item is visually highlighted.

## 3. Layouts
- [ ] **Responsiveness:** No horizontal scrolling on mobile (overflow-x hidden).
- [ ] **AppShell:** Content stays within bounds on ultrawide screens.
- [ ] **Z-Index:** Header stays on top of content.
- [ ] **Scroll:** "Sticky" elements behave correctly.

## 4. Forms (Generator)
- [ ] **Inputs:** Labels are visible (Accessibility).
- [ ] **Validation:** Error messages appear inline.
- [ ] **Keyboard:** Submit on 'Enter' key where appropriate.
- [ ] **Focus:** Tab navigation works sequence.

## 5. Interactions
- [ ] **Hover States:** Buttons/Links have `:hover` styles (for mouse users).
- [ ] **Loading States:** Skeletons or Spinners for async data.
- [ ] **Empty States:** "No Images Found" message in Library.

## 6. Compliance
- [ ] **Footer:** Imprint / Privacy Policy accessible from every page.
- [ ] **Cookie Banner:** Visible on first visit.
- [ ] **Age Gate:** Blocks content until verified.
