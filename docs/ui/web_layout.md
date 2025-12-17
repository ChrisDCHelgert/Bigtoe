# Web Layout - Responsive Breakpoints & Navigation

**Version:** 2.0
**Last Updated:** 2025-12-17

---

## Overview

BigToe has been transformed from a mobile-first phone shell design to a **responsive web-first PWA** that adapts seamlessly across all device sizes while maintaining mobile usability.

---

## Breakpoint Strategy

Using Tailwind's default breakpoints with mobile-first approach:

| Breakpoint | Min Width | Target Devices | Layout Behavior |
|------------|-----------|----------------|-----------------|
| `sm` | 640px | Small tablets | Minor adjustments |
| `md` | 768px | **Tablets** | **Navigation switch point** |
| `lg` | 1024px | Laptops | Multi-column layouts |
| `xl` | 1280px | Desktops | Maximum content width |
| `2xl` | 1536px | Large screens | Same as xl |

---

## Navigation Behavior

### Desktop (≥768px)
- **Header Navigation**: Horizontal nav bar at top
  - Brand logo (left)
  - Nav items: Home, Generate, Gallery, Plans, Profile (center)
  - Credits display + User badge (right)
- **Bottom Navigation**: Hidden (`md:hidden`)

### Mobile (<768px)
- **Header**: Minimal or hidden (depends on screen)
- **Bottom Navigation**: Visible fixed tabbar
  - 5 items: Home, Generate, Gallery, Plans, Profile
  - Active state highlighting

---

## Container Widths

**Before (Phone Shell):**
```tsx
<div className="max-w-md"> {/* 448px fixed */}
```

**After (Responsive Web):**
```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* 1280px max, responsive padding */}
</div>
```

---

## Screen-Specific Layouts

### Home
- **Desktop (lg+)**: 2-column grid (Status card | Gallery preview)
- **Mobile**: Stacked single column
- **Gallery Teaser**: 2-col mobile, 4-col desktop

### Generator
- **All Sizes**: Single column form (complexity requires vertical flow)
- **Container**: Responsive max-w-7xl
- **Future**: Could split controls |  preview on ultra-wide screens

### Gallery
- **Mobile**: 2 columns
- **Tablet (md)**: 3 columns
- **Laptop (lg)**: 4 columns
- **Desktop (xl)**: 5 columns

### Plans
- Already optimized: `max-w-6xl`, 3-column grid on desktop

---

## Component Structure

```
App
└── Layout (user prop)
    ├── Header (Desktop Nav, ≥md)
    ├── Main Content (responsive containers)
    └── BottomNav (Mobile Nav, <md)
```

---

## Key CSS Patterns

### Responsive Show/Hide
```tsx
{/* Desktop only */}
<div className="hidden md:block">...</div>

{/* Mobile only */}
<div className="md:hidden">...</div>
```

### Responsive Grids
```tsx
{/* Home: 1 col mobile, 2 col desktop */}
<div className="grid lg:grid-cols-2 gap-6">

{/* Gallery: Progressive columns */}
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
```

---

## Acceptance Criteria ✅

- [x] Desktop (1200px+) uses >500px width
- [x] Bottom nav hidden on desktop
- [x] Header nav visible on desktop
- [x] Mobile (<768px) remains fully functional
- [x] No phone shell constraints (max-w-md removed)
- [x] Gallery uses multi-column grid
- [x] Home has 2-column desktop layout

---

## Testing Checklist

**Desktop (1440px+)**
- [ ] Header navigation functional
- [ ] Content uses full width (respecting max-w-7xl)
- [ ] Gallery shows 5 columns
- [ ] No bottom navigation visible

**Tablet (768-1024px)**
- [ ] Header navigation visible
- [ ] Gallery shows 3-4 columns
- [ ] Touch-friendly targets

**Mobile (375-767px)**
- [ ] Bottom navigation functional
- [ ] Single/double column layouts
- [ ] No horizontal scroll
- [ ] Touch targets ≥44px
