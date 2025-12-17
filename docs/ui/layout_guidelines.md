# Layout Guidelines - Desktop-First Design System

**Version:** 2.0  
**Last Updated:** 2025-12-17

---

## Core Principles

1. **Desktop-First with Mobile Fallback** - Optimize for large screens, adapt for small
2. **Constrained Comfort** - Content never stretches beyond readable/usable widths
3. **Visual Hierarchy** - Primary content dominates, secondary supports
4. **Nested Constraints** - Containers within containers each apply max-widths

---

## Layout Token System

### Container Max-Widths

| Token | Value | Tailwind Class | Use Case |
|-------|-------|----------------|----------|
| Page Container | 1280px | `max-w-7xl` | Outer page wrapper |
| Content Section | 1024px | `max-w-5xl` | Content-heavy pages |
| Form Container | 672px | `max-w-2xl` | Multi-field forms |
| Card (standalone) | 512px | `max-w-lg` | Single feature cards |
| Form Group | 448px | `max-w-md` | Input clusters |
| Text Input | 384px | `max-w-sm` | Single form fields |
| Search/Filter Bar | 640px | `max-w-xl` | Search UI elements |

### Spacing Scale

Use Tailwind's default spacing with emphasis on:
- `gap-4` (16px) - Tight grouping
- `gap-6` (24px) - Standard separation
- `gap-8` (32px) - Section breaks
- `gap-12` (48px) - Major divisions

---

## Breakpoint Strategy

| Breakpoint | Width | Target | Layout Behavior |
|------------|-------|--------|-----------------|
| `sm` | 640px | Large phones | Minor adjustments |
| `md` | 768px | Tablets | Navigation switch |
| `lg` | 1024px | Laptops | Multi-column layouts |
| `xl` | 1280px | Desktops | Maximum columns |
| `2xl` | 1536px | Large screens | Same as xl |

**Critical Points:**
- `lg (1024px)`: Multi-column layouts activate
- `md (768px)`: Header vs BottomNav switch

---

## Layout Patterns

### 1. Page Wrapper Pattern
```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  {/* Page content */}
</div>
```
**Use:** Every screen's outer wrapper

### 2. Two-Column Workflow (Generator)
```tsx
<div className="lg:grid lg:grid-cols-[minmax(420px,520px)_1fr] gap-8">
  <div className="space-y-4">{/* Controls - Fixed width */}</div>
  <div>{/* Preview - Flexible */}</div>
</div>
```
**Use:** Input → Output workflows

### 3. Card Grid Pattern
```tsx
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div className="max-w-sm">{/* Individual cards constrained */}</div>
</div>
```
**Use:** Feature cards, plan cards

### 4. Form Pattern
```tsx
<div className="max-w-2xl mx-auto">
  <div className="space-y-4">
    <input className="w-full max-w-sm" /> {/* Input constrained */}
  </div>
</div>
```
**Use:** Settings, checkout forms

### 5. Constrained Filter Bar
```tsx
<div className="max-w-4xl mx-auto mb-6">
  <div className="flex gap-2">{/* Filters */}</div>
</div>
```
**Use:** Gallery, search pages

---

## Component-Specific Rules

### Inputs & Forms
- **Text inputs**: Always `max-w-sm` (384px) unless needs justify wider
- **Textareas**: Can be `max-w-md` (448px) or `max-w-lg` (512px)
- **Select dropdowns**: Match input width `max-w-sm`
- **Form containers**: `max-w-2xl` (672px) centered

### Cards
- **In grids**: Individual `max-w-sm` or `max-w-lg`
- **Standalone**: `max-w-lg` (512px)
- **Feature cards**: `max-w-md` (448px)

### Buttons
- **Primary CTA**: Full width of parent container (NOT full page)
- **Secondary buttons**: `w-auto` with padding
- **In forms**: Full width within form container

---

## Grid Systems

### Standard Content Grid
```tsx
<div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
```
**Use:** Gallery, product grids

### Content + Sidebar
```tsx
<div className="lg:grid lg:grid-cols-[1fr_320px] gap-8">
  <main>{/* Primary content */}</main>
  <aside>{/* Secondary sidebar */}</aside>
</div>
```

### Asymmetric Workflow (Generator)
```tsx
<div className="lg:grid lg:grid-cols-[420px_1fr] gap-8">
  <div>{/* Controls - Fixed 420px */}</div>
  <div>{/* Preview - Rest of space */}</div>
</div>
```

---

## Visual Hierarchy Rules

### Primary/Secondary Split
- **Primary Content**: 60-70% of available width
- **Secondary Content**: 30-40% of available width

### Nesting Constraints
Always apply max-width at each level:
```tsx
<div className="max-w-7xl mx-auto"> {/* Page */}
  <div className="lg:grid-cols-2 gap-6"> {/* Grid */}
    <div className="max-w-lg"> {/* Card constrained within grid */}
      {/* Content */}
    </div>
  </div>
</div>
```

---

## Mobile Considerations

### Stack Order
When columns stack on mobile:
1. Primary content first
2. Secondary content second
3. Actions/CTA last

### Touch Targets
- Minimum `py-2 px-3` for clickable elements
- Bottom nav: `py-2` minimum

### Spacing Adjustments
- Desktop: `gap-8` or `gap-12`
- Mobile: `gap-4` or `gap-6`

---

## Anti-Patterns (DON'T DO)

❌ **Full-width inputs on desktop**
```tsx
<input className="w-full" /> {/* Stretches 1280px+ */}
```

❌ **Cards without max-width in grids**
```tsx
<div className="grid grid-cols-2">
  <div className="bg-card"> {/* Stretches to fill grid cell */}
</div>
```

❌ **Filter bars at full page width**
```tsx
<div className="flex gap-2"> {/* Tabs stretch across 1280px */}
```

✅ **Correct versions:**
```tsx
<input className="w-full max-w-sm" />
<div className="grid grid-cols-2">
  <div className="max-w-lg bg-card">
</div>
<div className="max-w-4xl mx-auto">
  <div className="flex gap-2">
</div>
```

---

## Screen-Specific Applications

### Home
- Page: `max-w-7xl`
- Grid: `lg:grid-cols-2`
- Cards within grid: `max-w-lg`

### Generator
- Page: `max-w-7xl`
- Layout: `lg:grid-cols-[420px_1fr]`
- Controls: Fixed 420px
- Preview: Flexible remainder

### Gallery
- Page: `max-w-7xl`
- Filters: `max-w-4xl mx-auto`
- Grid: `grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`

### Profile/Settings
- Page: `max-w-7xl`
- Form: `max-w-2xl mx-auto`
- Sections: Stacked with spacing

---

## Testing Checklist

At each breakpoint, verify:
- ✅ Content doesn't stretch uncomfortably
- ✅ Visual hierarchy is clear
- ✅ Touch targets are adequate (mobile)
- ✅ No horizontal scroll
- ✅ Text remains readable

**Test Widths:** 375px, 768px, 1024px, 1440px, 1920px
