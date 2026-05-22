# Sprint 1 — Navbar & App Switcher Modernization

> Sprint Goal: Deliver a modernized top navbar and desktop sidebar app-switcher that is slimmer, more polished, and animation-smooth — while keeping all existing navigation logic intact.
> Branch: `feature/sprint-1`
> Depends on: Sprint 0 complete (CSS custom properties available)

---

## Context

The current Odoo navbar is 46 px tall with a flat purple background. The mobile experience shows a burger menu sidebar. On desktop, there is no persistent sidebar — apps are accessed via a dropdown from the grid icon. This sprint ships:

- **Slim navbar** (40 px, refined padding, frosted-glass effect on scroll)
- **Icon-rail sidebar** for desktop (collapsible, 56 px wide icon-only → 240 px expanded on hover/click)
- **Refined burger menu** for mobile (improved animation, backdrop blur)
- **Active indicator** animation on nav items
- All navigation JS logic (OWL components, menu service) left completely unchanged

---

## Prioritized Task List

| # | Task | Owner | Description |
|---|------|-------|-------------|
| 1 | Slim down navbar height | Milo | `$o-navbar-height: 40px`, adjust all dependent spacing calculations. Update `navbar.variables.scss` |
| 2 | Frosted-glass effect on scroll | Milo | Add `backdrop-filter: blur(12px)` + semi-transparent bg when page has scrolled. Implement via `scroll` event listener on the navbar OWL component |
| 3 | Active section indicator animation | Milo | Add `::after` sliding underline indicator on active nav section. CSS only, `transition: transform 0.2s`. Respects `prefers-reduced-motion` |
| 4 | Desktop icon-rail sidebar | Nova + Milo | New OWL component `AppRailSidebar` alongside existing navbar. Shows app icons in a vertical strip. Collapsed → icon only; hover/click → slides to 240 px with app names. Replaces the apps dropdown on ≥ lg breakpoint |
| 5 | Mobile burger menu polish | Milo | Smoother slide-in animation (CSS `transform` instead of JS width), backdrop blur on overlay, haptic-style active state on touch |
| 6 | Navbar breadcrumb modernization | Milo | Slim separator, text overflow ellipsis on small screens, consistent font weight |
| 7 | Systray icon spacing and hover state | Milo | More breathing room between systray icons, consistent 32 px hit targets, smooth hover bg transition |
| 8 | Visual regression & cross-browser test | Ivy | Test on Chrome, Firefox, Safari, Edge. Test mobile (iOS Safari, Android Chrome). File bugs. |

---

## Work Schedule

### Phase 1: Navbar Styling (Tasks 1–3)
- Reduce height to 40 px, update all dependent variables
- Add frosted-glass scroll effect
- Add active indicator animation
- **Checkpoint commit**: `sprint-1: slim navbar with scroll effect and active indicator`

### Phase 2: Icon-Rail Sidebar (Tasks 4–5)
- Build `AppRailSidebar` OWL component (template + SCSS + JS)
- Wire to existing `menuService.getApps()` — no logic changes
- Hide existing apps dropdown on desktop when sidebar is visible
- Mobile burger menu animation improvements
- **Checkpoint commit**: `sprint-1: icon-rail sidebar and mobile burger improvements`

### Phase 3: Polish (Tasks 6–8)
- Breadcrumb and systray refinements
- Ivy full test pass
- Fix any regressions
- **Final commit**: `sprint-1: navbar and sidebar modernization complete`

---

## Design Specifications

### Navbar
```
Height:          40px (was 46px)
Background:      var(--o-brand-primary) with backdrop-filter on scroll
Font size:       13px (was 14px for tighter feel)
Brand text:      font-weight: 600, letter-spacing: -0.01em
Active indicator: 2px bottom border, brand-lighter color, slides with CSS transition
```

### Icon-Rail Sidebar (desktop ≥ lg only)
```
Collapsed width:  56px
Expanded width:   240px
Transition:       width 200ms cubic-bezier(0.05, 0.7, 0.1, 1.0) (using $o-easing-enter)
Icon size:        24px, centered
App name:         14px, font-weight: 500, appears on expand
Active app:       background: rgba(--o-brand-primary, 0.15), left 3px border accent
Z-index:          above content, below modals
```

### Mobile Sidebar
```
Slide-in:  transform: translateX(-100%) → translateX(0), 200ms ease-out
Backdrop:  backdrop-filter: blur(4px), background: rgba(0,0,0,0.4)
Close:     swipe left or tap backdrop (existing logic, improved animation)
```

---

## Success Criteria

- [ ] Navbar renders at 40 px height across all breakpoints
- [ ] Frosted-glass effect activates when page scrolls > 0
- [ ] Active nav item has animated underline indicator
- [ ] Icon-rail sidebar appears on desktop (≥ lg) and collapses to icon-only
- [ ] Icon-rail expands on hover or click, shows app names
- [ ] Existing apps dropdown hidden on desktop when sidebar is visible
- [ ] Mobile burger menu has smooth transform animation (no layout jank)
- [ ] All existing navigation keyboard shortcuts continue to work
- [ ] `prefers-reduced-motion` respected for all animations
- [ ] No console errors
- [ ] Ivy sign-off: passes on Chrome, Firefox, Safari, iOS, Android

---

## What's NOT in This Sprint

| Feature | Reason |
|---------|--------|
| Custom sidebar icons per app | Odoo app icons already in `webIconData` — use those |
| Sidebar pinned/unpinned user preference | Sprint 4 (settings/persistence) |
| Dark navbar variant | Sprint 4 (dark mode) |
| Notification bell redesign | Sprint 2 scope |
| Search redesign | Sprint 2 scope |

---

## Agent Prompt

> Read `PROJECT_BRIEF.md`, then read `doc/sprint-1-plan.md`. You are the dev team: **Nova** (frontend), **Milo** (CSS/art director).
>
> Execute Sprint 1: Navbar & App Switcher Modernization.
>
> First: `git pull origin main && git checkout -b feature/sprint-1`
>
> **Critical**: Only modify SCSS and the new OWL sidebar component. Do NOT modify menu_service.js, action_service.js, or any business logic. The icon-rail sidebar must call the exact same `menuService.getApps()` and `menuService.selectMenu()` APIs as the existing navbar.
>
> Take your time. Animations must respect `prefers-reduced-motion`. All changes must be tested on mobile breakpoints.
>
> Update `doc/sprint-1-progress.md` after each phase.
> When done: `git push origin feature/sprint-1` and open a PR targeting `main`.
> Follow Sections 12–14 of `PROJECT_BRIEF.md`.

---

## Progress Tracker

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Slim navbar height | ⬜ Not started | |
| 2 | Frosted-glass scroll effect | ⬜ Not started | |
| 3 | Active section indicator | ⬜ Not started | |
| 4 | Desktop icon-rail sidebar | ⬜ Not started | |
| 5 | Mobile burger menu polish | ⬜ Not started | |
| 6 | Breadcrumb modernization | ⬜ Not started | |
| 7 | Systray spacing | ⬜ Not started | |
| 8 | Visual regression test | ⬜ Not started | |
