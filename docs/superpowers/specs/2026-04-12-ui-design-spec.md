# UI Design Specification

**Project:** School & Class Registry  
**Date:** 2026-04-12  
**Status:** Draft

---

## 1. Visual Style

| Element | Choice |
|---------|--------|
| Theme | Modern SaaS — clean, professional, premium feel |
| Primary color | Blue (`#0066CC` or similar) |
| Font family | Inter (fallback: system sans-serif) |
| Font scaling | System default (respects accessibility settings) |
| Spacing | 4px grid (compact, tight) |

---

## 2. Navigation & Layout

### Navigation
- **Structure:** Stack Navigator — Schools List → School Detail → back
- **No visible tab bar** — single screen fills the app
- **Header:** Standard sticky header with back button on detail screen

### List Cards
- **Style:** Full bleed — edge-to-edge with section dividers
- **Content hierarchy:** Balanced — title and subtitle similar size, different weight

---

## 3. Components

### Buttons

| Type | Style |
|------|-------|
| Primary | Solid fill — blue background, white text |
| Secondary | Outlined — blue border, blue text |
| Destructive | Red solid fill for delete actions |

### Form Inputs
- **Style:** Floating label — label inside input, moves up on focus
- **Behavior:** Clear focus states, validation feedback

### Interactive Elements

| Pattern | Implementation |
|---------|----------------|
| Filters | Bottom sheet (Actionsheet) — 50% snap point, handle bar, semi-transparent dark overlay |
| Create form | Bottom sheet (Actionsheet) — same as filter |
| Edit form | Bottom sheet (Actionsheet) — same as filter, pre-populated |
| Delete confirmation | Bottom sheet style with red destructive "Excluir" button |

### FAB (Floating Action Button)
- **Position:** Bottom-right corner, 16px margin from edges, safe area aware
- **Style:** Rounded square shape
- **Icon:** "+" icon, optionally with label "+ Nova"

---

## 4. Feedback States

| State | Implementation |
|-------|----------------|
| Loading | Skeleton placeholders — placeholder rectangles with shimmer animation |
| Empty | Illustration + text — friendly icon with descriptive message |
| Error | Inline banner — subtle error message at top of list |

---

## 5. Motion & Animations

- **Bottom sheet:** Slide up/down animation on open/close
- **Card press:** Subtle scale or opacity feedback on touch
- **Skeleton:** Shimmer animation during loading

---

## 6. Language

- UI strings in Brazilian Portuguese (pt-BR)
- Code identifiers in English

---

## 7. Components to Build

1. **GluestackUIProvider** — root provider with custom theme
2. **BottomSheet** — reusable Actionsheet wrapper
3. **ConfirmDialog** — reusable AlertDialog wrapper for delete
4. **FAB** — floating action button component
5. **SchoolListScreen** — static version with mock data
6. **SchoolDetailScreen** — static version with mock data