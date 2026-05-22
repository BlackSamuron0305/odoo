# Sprint 3 — List & Kanban Modernization

> Sprint Goal: Modernize list and kanban views with card elevation, hover states, subtle animations, and a cleaner grouping design — no logic changes.
> Branch: `feature/sprint-3`
> Depends on: Sprint 0 (tokens), Sprint 1 (navbar)

---

## Context

List and Kanban are the two primary "browse" views in Odoo. The list view is dense and functional. The kanban view is card-based. Both need visual polish that makes them feel modern without sacrificing information density. Key principle: **don't reduce information density** — improve clarity and hierarchy.

Key files:
- `addons/web/static/src/views/list/list_renderer.scss`
- `addons/web/static/src/views/kanban/kanban_controller.scss`
- `addons/web/static/src/views/kanban/kanban_record.scss`
- `addons/web/static/src/views/kanban/kanban.variables.scss`

---

## Prioritized Task List

| # | Task | Owner | Description |
|---|------|-------|-------------|
| 1 | List view row hover state | Milo | Smooth background transition on row hover: `background: var(--o-gray-100)`, `transition: background 100ms`. Remove zebra striping |
| 2 | List view header polish | Milo | Sticky header with subtle bottom border, bolder column labels (font-weight: 600), sort indicator icon refinement |
| 3 | List view optional columns indicator | Milo | Optional column toggle button polish — cleaner icon, tooltip on hover |
| 4 | Kanban card elevation | Milo | Card: `border-radius: 8px`, `box-shadow: var(--o-shadow-sm)`. On hover: `box-shadow: var(--o-shadow-md)`, subtle `translateY(-1px)` lift. `transition: all 150ms` |
| 5 | Kanban column header redesign | Milo | Pill-shaped count badge, column title font-weight 600, fold/unfold button more visible |
| 6 | Kanban drag ghost redesign | Milo | Dragged card rotates `-2deg` (already exists), improve ghost opacity and shadow for clearer drag feedback |
| 7 | Kanban progress bar modernization | Milo | Taller progress bar (6 px → 8 px), rounded ends, smooth color transitions between stages |
| 8 | Kanban color ribbons modernization | Milo | Rounder ribbon (existing `Ribbon-wrapper`), softer colors using tint of `$o-colors` |
| 9 | Control panel / search bar polish | Milo | Search input: rounded pill shape, clearer filter chip design, group-by chips with close button |
| 10 | Mobile list: card layout | Nova + Milo | On mobile (<md), list rows become card-like tiles (full width, 12px padding, shadow). Existing mobile kanban scroll-snap stays |
| 11 | Regression test: all list + kanban variants | Ivy | Test grouped/ungrouped, folded columns, drag+drop, multi-select, optional columns, inline edit |

---

## Work Schedule

### Phase 1: List View (Tasks 1–3)
- Row hover, header sticky, optional columns
- **Checkpoint commit**: `sprint-3: list view visual modernization`

### Phase 2: Kanban Cards & Columns (Tasks 4–8)
- Card elevation, column header, drag ghost, progress bars, ribbons
- **Checkpoint commit**: `sprint-3: kanban cards and columns modernization`

### Phase 3: Control Panel & Mobile (Tasks 9–11)
- Search/filter bar redesign
- Mobile list card layout
- Ivy QA pass
- **Final commit**: `sprint-3: list kanban and control panel modernization complete`

---

## Design Specifications

### List Row
```
Height:           40px (unchanged)
Hover background: var(--o-gray-100) — transition 100ms
Zebra striping:   REMOVED (cleaner, modern)
Selected row:     var(--o-component-active-bg) with left 3px brand accent border
Border:           only bottom border, 1px var(--o-gray-200)
```

### Kanban Card
```
Border-radius:    8px
Background:       white
Box-shadow:       var(--o-shadow-sm) = 0 1px 2px rgba(0,0,0,0.06)
Hover shadow:     var(--o-shadow-md) = 0 2px 8px rgba(0,0,0,0.10)
Hover transform:  translateY(-1px)
Transition:       box-shadow 150ms, transform 150ms
Padding:          12px 14px (was $o-kanban-inside-vgutter/hgutter)
```

### Control Panel Search
```
Input shape:      border-radius: 999px (pill)
Filter chips:     border-radius: 999px, background: var(--o-gray-200), × button on right
Active filter:    background: var(--o-brand-primary) at 15% opacity, border: 1px var(--o-brand-primary)
```

---

## Success Criteria

- [ ] List rows have smooth hover highlight (no zebra striping)
- [ ] List header is sticky with border separation
- [ ] Kanban cards have elevated hover effect with `translateY` lift
- [ ] Kanban drag ghost has clear visual feedback
- [ ] Progress bars are 8 px rounded
- [ ] Search bar is pill-shaped with chip-style filter tags
- [ ] Mobile list renders as card tiles on <md breakpoint
- [ ] Kanban mobile scroll-snap remains functional
- [ ] Drag-and-drop works correctly across all kanban variants
- [ ] Ivy sign-off: all list/kanban variants pass

---

## What's NOT in This Sprint

| Feature | Reason |
|---------|--------|
| Kanban column reordering UI | Logic is in JS — only SCSS changes this sprint |
| List inline editing redesign | Risky — field widgets involved, defer |
| Graph/Pivot view | Sprint 4 scope |
| Dashboard tiles | Sprint 4 scope |

---

## Agent Prompt

> Read `PROJECT_BRIEF.md`, then read `doc/sprint-3-plan.md`. You are the dev team: **Milo** (CSS), **Nova** (frontend for mobile card layout task).
>
> Execute Sprint 3: List & Kanban Modernization.
>
> First: `git pull origin main && git checkout -b feature/sprint-3`
>
> **Critical**: Only SCSS changes. No JS or XML modifications. Use CSS custom properties from Sprint 0 throughout.
>
> Test every kanban variant (grouped, ungrouped, folded, drag) before committing.
>
> Update `doc/sprint-3-progress.md` after each phase.
> When done: `git push origin feature/sprint-3` and open a PR.

---

## Progress Tracker

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | List row hover | ⬜ Not started | |
| 2 | List header polish | ⬜ Not started | |
| 3 | Optional columns indicator | ⬜ Not started | |
| 4 | Kanban card elevation | ⬜ Not started | |
| 5 | Kanban column header | ⬜ Not started | |
| 6 | Kanban drag ghost | ⬜ Not started | |
| 7 | Kanban progress bar | ⬜ Not started | |
| 8 | Kanban ribbons | ⬜ Not started | |
| 9 | Control panel search | ⬜ Not started | |
| 10 | Mobile list card layout | ⬜ Not started | |
| 11 | Regression test | ⬜ Not started | |
