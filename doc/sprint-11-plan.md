# Sprint 11 — Micro-animations & Motion System

> Sprint Goal: Give the entire Odoo UI a "premium feel" by adding a cohesive, purposeful motion system — view transitions, skeleton loaders, hover micro-interactions, and OWL enter/leave animations — while fully respecting `prefers-reduced-motion`.
> Branch: `feature/sprint-11`
> Depends on: Sprints 0–5b (all tokens and base component styles must be in place)

---

## Context

After the visual refresh of Sprints 0–5b, the UI looks modern but still feels static. Every interaction is instantaneous with no motion feedback. This makes the interface feel less responsive and less alive than competitors like Linear or Notion. This sprint adds the motion layer — the difference between "looks good" and "feels great".

**Guiding principles:**
1. Every animation must serve a purpose (guide attention, confirm action, indicate loading)
2. No animation should add perceived latency — only perceived responsiveness
3. `@media (prefers-reduced-motion: reduce)` must disable ALL transitions and animations globally
4. Duration budget: enters ≤ 200ms, exits ≤ 150ms, page transitions ≤ 250ms

**Files to understand before starting:**
- `addons/web/static/src/scss/primary_variables.scss` — `--o-*` token system
- `addons/web/static/src/webclient/webclient.scss` — global layout
- `addons/web/static/src/views/view.scss` — view container
- `addons/web/static/src/views/list/list_renderer.scss` — Sprint 3 list styles
- `addons/web/static/src/views/kanban/` — Sprint 3 kanban styles

---

## Prioritized Task List

| # | Task | Owner | Description |
|---|------|-------|-------------|
| 1 | Global motion tokens | Milo | Add to `primary_variables.scss`: `--o-duration-fast: 100ms`, `--o-duration-base: 200ms`, `--o-duration-slow: 300ms`, `--o-ease-standard: cubic-bezier(0.4, 0, 0.2, 1)`, `--o-ease-decelerate: cubic-bezier(0, 0, 0.2, 1)`, `--o-ease-accelerate: cubic-bezier(0.4, 0, 1, 1)`. Also add `tokens/tokens.json` motion section |
| 2 | `prefers-reduced-motion` global rule | Milo | Add to `bootstrap_overridden.scss`: `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; } }` |
| 3 | Skeleton loader component | Nova | Create OWL component `addons/web/static/src/core/skeleton/skeleton.js + skeleton.xml + skeleton.scss`. Skeleton renders animated shimmer placeholders. Props: `lines`, `width`, `height`, `circle`. Shimmer: CSS `@keyframes` gradient sweep, brand-aware colors |
| 4 | Skeleton in List view | Nova | Wrap list renderer loading state with skeleton rows. Show 10 skeleton rows (matching current column widths) while `records` is empty + loading. Remove once data arrives |
| 5 | Skeleton in Kanban view | Nova | Show skeleton cards (2 per column) while column data loads. Match card height. Column header still shows real data |
| 6 | Skeleton in Form view | Nova | Show skeleton fields (label + input-height block) during `isNew` + initial load. 3-5 rows depending on view |
| 7 | View enter animation | Milo | `.o_view_controller` enter: `opacity: 0 → 1`, `transform: translateY(4px) → translateY(0)`, duration: `var(--o-duration-base)`, easing: `var(--o-ease-decelerate)`. Apply via CSS class `.o_view_entering` added by OWL mount lifecycle |
| 8 | Row stagger in List view | Milo | List rows: `animation-delay: calc(var(--row-index, 0) * 20ms)` on initial load only. Max delay cap: 200ms. Use CSS custom property `--row-index` set by JS inline style. Stagger only on first load, not sort/filter |
| 9 | Kanban card hover lift | Milo | Upgrade Sprint 3 kanban hover: `transform: translateY(-2px)`, `box-shadow: var(--o-shadow-lg)`, duration: `var(--o-duration-fast)`. Card drag-start: `transform: scale(1.02)`, `box-shadow: 0 8px 32px rgba(0,0,0,0.18)` |
| 10 | Button press feedback | Milo | All `.btn` elements: `transform: scale(0.97)` on `:active`, duration: `50ms`. Disabled buttons: no transform. Primary buttons: subtle `box-shadow` pulse on focus |
| 11 | Sidebar expand/collapse animation | Milo | AppRailSidebar from Sprint 1: width transition `56px → 240px` with `var(--o-duration-slow)` and `var(--o-ease-standard)`. Icon labels fade in with slight delay after width transition starts |
| 12 | Dialog enter/exit animation | Milo | Modal: backdrop `opacity: 0 → 0.4` + modal content `opacity: 0, translateY(12px) → visible`. Exit reverses. Duration: `var(--o-duration-base)`. Respect existing Bootstrap modal classes |
| 13 | Toast slide-in animation | Milo | Refine Sprint 2b notification toasts: use `@keyframes o-toast-enter` — `transform: translateX(100%) → translateX(0)` + `opacity: 0 → 1`. Exit: `translateX(100%)`. Hardware-accelerated (transform only, no layout props) |
| 14 | Dropdown scale animation | Milo | Refine Sprint 2b dropdowns: `transform-origin: top left`, `transform: scale(0.95) → scale(1)` + `opacity: 0 → 1`. Duration: `var(--o-duration-fast)`. No layout shift |
| 15 | Chatter message appear | Milo | New messages sent/received: `animation: o-message-appear 200ms var(--o-ease-decelerate)`. Keyframe: `opacity: 0, translateY(8px) → visible`. Only for new messages, not initial load |
| 16 | Navigation breadcrumb transition | Nova | Breadcrumb item changes: outgoing item fades left, incoming fades in from right. Duration: `var(--o-duration-base)`. Use `CSSTransition`-style class toggling on the breadcrumb OWL component |
| 17 | Switch view animation (list ↔ kanban ↔ graph) | Nova | View type switching: outgoing view fades out `opacity → 0` simultaneously with incoming view fading in. No slide (avoids content shift). Duration: `var(--o-duration-base)` |
| 18 | Focus ring animation | Milo | All interactive elements: focus ring appears with `animation: o-focus-ring-appear 100ms` — `box-shadow` scales from `0 0 0 0px` to `0 0 0 3px`. Brand color ring |
| 19 | Regression QA | Ivy | Test all animations on Chrome, Firefox, Safari, Edge. Verify `prefers-reduced-motion` disables everything. Test on slow devices (CPU throttle 4x). No jank on list scroll. No layout shifts |

---

## Work Schedule

### Phase 1: Foundation (Tasks 1–2)
- Add motion tokens to design system
- Global `prefers-reduced-motion` safety net
- **Checkpoint commit**: `sprint-11: motion tokens and reduced-motion foundation`

### Phase 2: Loading States (Tasks 3–6)
- Skeleton component + integrate into List, Kanban, Form
- **Checkpoint commit**: `sprint-11: skeleton loader component integrated in all major views`

### Phase 3: View & Layout Animations (Tasks 7–8, 11, 16–17)
- View enter, row stagger, sidebar, breadcrumb, view switching
- **Checkpoint commit**: `sprint-11: view and navigation animations`

### Phase 4: Component Micro-interactions (Tasks 9–10, 12–15)
- Kanban hover, button press, dialog, toast, dropdown, chatter, focus ring
- **Checkpoint commit**: `sprint-11: component micro-interactions`

### Phase 5: QA (Task 19)
- Full animation regression + performance check
- **Final commit**: `sprint-11: QA signoff, motion system complete`

---

## Design Specifications

### Motion Tokens
```scss
--o-duration-fast:     100ms;
--o-duration-base:     200ms;
--o-duration-slow:     300ms;
--o-ease-standard:     cubic-bezier(0.4, 0, 0.2, 1);   // material standard
--o-ease-decelerate:   cubic-bezier(0, 0, 0.2, 1);      // enter elements
--o-ease-accelerate:   cubic-bezier(0.4, 0, 1, 1);      // exit elements
```

### Skeleton Shimmer
```scss
@keyframes o-skeleton-shimmer {
  from { background-position: -200% 0; }
  to   { background-position:  200% 0; }
}
.o_skeleton {
  background: linear-gradient(
    90deg,
    var(--o-gray-200) 25%,
    var(--o-gray-100) 50%,
    var(--o-gray-200) 75%
  );
  background-size: 200% 100%;
  animation: o-skeleton-shimmer 1.5s var(--o-ease-standard) infinite;
  border-radius: var(--o-border-radius);
}
[data-bs-theme="dark"] .o_skeleton {
  background: linear-gradient(
    90deg,
    var(--o-gray-800) 25%,
    var(--o-gray-700) 50%,
    var(--o-gray-800) 75%
  );
  background-size: 200% 100%;
}
```

### View Enter
```scss
@keyframes o-view-enter {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0);   }
}
.o_view_controller {
  animation: o-view-enter var(--o-duration-base) var(--o-ease-decelerate);
}
```

---

## Success Criteria

- [ ] Motion tokens added to `tokens/tokens.json` and exposed as CSS custom properties
- [ ] `prefers-reduced-motion` disables all animations globally (verified with browser setting)
- [ ] Skeleton component exists at `addons/web/static/src/core/skeleton/`
- [ ] List, Kanban, Form views show skeletons during initial load
- [ ] View enter animation plays on app navigation
- [ ] List rows stagger on first load with capped 200ms max delay
- [ ] Kanban card lifts on hover with shadow elevation
- [ ] Buttons scale on press (`:active` state)
- [ ] Sidebar expand/collapse is smooth (not instant)
- [ ] Dialogs animate in and out
- [ ] Toasts slide in from right
- [ ] Dropdowns scale open
- [ ] No animation causes layout shift (CLS = 0)
- [ ] All animations run at 60fps on CPU throttle 4x (Ivy verified)
- [ ] Ivy QA sign-off

---

## What's NOT in This Sprint

| Feature | Reason |
|---------|--------|
| Page-level route transition (app switching) | Requires OWL router integration — Sprint 22 polish |
| Drag-and-drop physics | Kanban drag is functional; physics over-engineering |
| Animated charts/graphs | Graph view is Sprint 15 |
| Lottie/SVG illustrations | Empty states are Sprint 16 |
| Video/GIF support in chatter | Not a motion system concern |

---

## Agent Prompt

> Read `PROJECT_BRIEF.md`, then read `doc/sprint-11-plan.md`. You are the dev team: **Nova** (frontend), **Milo** (CSS/art director).
>
> Execute Sprint 11: Micro-animations & Motion System.
>
> First: `git pull origin 19.0 && git checkout -b feature/sprint-11`
>
> **Milo** leads all SCSS work (tokens, keyframes, transitions). **Nova** leads the Skeleton OWL component and JS integration (row stagger via inline style, view lifecycle hooks).
>
> CRITICAL: Every animation must have a `prefers-reduced-motion` fallback. Test this as you build — not at the end.
>
> Performance rule: Only animate `opacity` and `transform` (GPU-composited). Never animate `height`, `width`, `padding`, `margin`, or `box-shadow` in `@keyframes` — only in `transition`.
>
> Work through phases sequentially. Commit after each phase. Update `doc/sprint-11-progress.md` after each commit.
>
> When done: `git push origin feature/sprint-11` and open a PR. Tag Ivy for QA.

---

## Progress Tracker

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Motion tokens | ⬜ Not started | |
| 2 | prefers-reduced-motion global | ⬜ Not started | |
| 3 | Skeleton component | ⬜ Not started | |
| 4 | Skeleton — List view | ⬜ Not started | |
| 5 | Skeleton — Kanban view | ⬜ Not started | |
| 6 | Skeleton — Form view | ⬜ Not started | |
| 7 | View enter animation | ⬜ Not started | |
| 8 | Row stagger — List | ⬜ Not started | |
| 9 | Kanban card hover lift | ⬜ Not started | |
| 10 | Button press feedback | ⬜ Not started | |
| 11 | Sidebar animation | ⬜ Not started | |
| 12 | Dialog animation | ⬜ Not started | |
| 13 | Toast slide-in | ⬜ Not started | |
| 14 | Dropdown scale | ⬜ Not started | |
| 15 | Chatter message appear | ⬜ Not started | |
| 16 | Breadcrumb transition | ⬜ Not started | |
| 17 | View switch animation | ⬜ Not started | |
| 18 | Focus ring animation | ⬜ Not started | |
| 19 | Regression QA | ⬜ Not started | |
