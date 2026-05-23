# Sprint 15 — Data Views: Graph, Pivot, Activity & Cohort

> Sprint Goal: Modernize all data visualization views — graph (bar/line/pie), pivot table, activity timeline, and cohort heatmap — applying brand tokens to Chart.js theming, improving pivot table readability, and making the activity view actionable and beautiful.
> Branch: `feature/sprint-15`
> Depends on: Sprints 0–5b (tokens, dark mode infrastructure), Sprint 12 (tabular-nums)

---

## Context

Odoo has four data visualization view types beyond List/Kanban/Form:
1. **Graph view** — Bar, Line, Pie charts powered by Chart.js
2. **Pivot view** — Cross-tabulation table with drag-drop dimensions
3. **Activity view** — Kanban-style board showing activities per record per type
4. **Cohort view** (Enterprise) — Retention/churn heatmap table

These views are among the most-used by managers and analysts. Chart.js colors are hardcoded. Pivot tables are visually indistinct from a spreadsheet. The Activity view has no visual upgrade since Odoo 14. This sprint makes data views as polished as the record views.

**Files in scope:**
- `addons/web/static/src/views/graph/graph_view.scss` + `graph_renderer.js` (Chart.js config)
- `addons/web/static/src/views/pivot/pivot_view.scss` + `pivot_renderer.js` (header classes)
- `addons/mail/static/src/views/activity_view.scss` (if exists) or locate the activity view SCSS
- `addons/web_cohort/static/src/` (Enterprise module — check if present)

---

## Prioritized Task List

| # | Task | Owner | Description |
|---|------|-------|-------------|
| 1 | Graph view audit | Milo | Read `graph_view.scss` and `graph_renderer.js`. Identify where Chart.js `datasets[*].backgroundColor`, `borderColor`, chart font config, grid color, tooltip styles are set. Document all hardcoded values |
| 2 | Chart.js color palette | Nova | In `graph_renderer.js`, replace hardcoded dataset colors with brand-derived palette. Create a `getChartColors(isDark)` helper that returns 8 colors based on `var(--o-brand-primary)` as anchor + harmonious hues. In dark mode (check `document.body.dataset.bsTheme === 'dark'`): use lightened palette. Re-run color computation when theme toggles |
| 3 | Chart.js typography config | Nova | Set Chart.js global defaults: `font.family: getComputedStyle(document.body).getPropertyValue('--o-font-family-sans')`, `font.size: 12`, `color: getComputedStyle(document.body).getPropertyValue('--o-gray-600')`. Re-apply when dark mode toggles |
| 4 | Chart.js grid lines | Nova | Chart grid lines: `color: rgba(0,0,0,0.06)` (light) / `rgba(255,255,255,0.08)` (dark). Chart border: none. Tick color: `var(--o-gray-500)`. Remove Chart.js default borders |
| 5 | Chart.js tooltip styling | Nova | Custom tooltip: `background: var(--o-gray-900)` (dark pill, light mode) / `var(--o-gray-100)` (dark mode). `border-radius: 8px`, `padding: 8px 12px`. Title: medium weight. Values: tabular-nums. No border. Drop shadow |
| 6 | Graph view SCSS | Milo | `graph_view.scss`: control panel area (uses shared control panel from Sprint 3). Chart container: centered, max-height 480px, adds `var(--o-shadow-sm)` card container around the canvas. View type switcher (bar/line/pie): icon button group matching Sprint 3 control panel style |
| 7 | Graph loading state | Milo | While chart data loads: show a skeleton placeholder (Sprint 11 skeleton) matching the chart dimensions. Fade-in the chart canvas when data is ready |
| 8 | Pivot view SCSS | Milo | `pivot_view.scss`: full modernization. Table: no outer border (`border-collapse: collapse`). Header row: `background: var(--o-gray-50)`, `font-weight: 600`, sticky. Row header (leftmost column): sticky, white background (light) / `var(--o-gray-900)` (dark), `border-right: 2px solid var(--o-gray-200)`. Cell: `padding: 8px 12px`. Numeric cells: `text-align: right`, monospace |
| 9 | Pivot expandable rows | Milo | Expandable row chevron: `var(--o-brand-primary)` color, 16px, rotates on expand (Sprint 11 motion). Expanded rows: left-indented by 16px per level. Totals row: `font-weight: 600`, `background: var(--o-gray-50)`, top border |
| 10 | Pivot cell highlighting | Milo | Cell hover: `background: var(--o-brand-primary)` at 5% opacity. Selected cell: 10% opacity. Cells with values: color intensity based on value magnitude (optional heat coloring — configurable, off by default) |
| 11 | Pivot dark mode | Milo | Dark pivot: header `var(--o-gray-800)`, cells `var(--o-gray-900)` / `var(--o-gray-800)` alternating, sticky headers `var(--o-gray-900)` with border. Text colors from Sprint 12 dark type adjustments |
| 12 | Activity view audit | Milo | Locate the Activity view SCSS (search `o_activity` in `addons/mail/` and `addons/web/`). Map all selectors. The activity view is a table: rows are records, columns are activity types |
| 13 | Activity view table | Milo | Activity table: header row with activity type icons (24px colored circles matching activity type color). Column width: equal distribution with `table-layout: fixed`. Row height: 48px. First column (record name): link style from Sprint 12, sticky, 240px |
| 14 | Activity cell states | Milo | Activity cells: empty (dotted circle with `+` on hover → schedule activity). Overdue: red filled circle with `!` icon. Due today: amber. Planned: green. Done: gray. Icon size: 28px circle. Hover tooltip shows activity summary |
| 15 | Activity view — schedule button | Milo | "Schedule activity" modal trigger: `+` button in empty cell, 28px circle, brand color on hover with Sprint 11 scale animation. Consistent with Sprint 2b activity pill style |
| 16 | Cohort view (if Enterprise module present) | Milo | `web_cohort`: heatmap table. Cell background intensity: from `var(--o-gray-100)` (low) to `var(--o-brand-primary)` (high) interpolated as percentage. Cell value: white text when background is dark. Header row/column: sticky. Cohort period selector: matches Sprint 3 control panel |
| 17 | View switcher control panel | Milo | The control panel group that switches between List/Kanban/Graph/Pivot/Activity views: ensure icon button group is visually consistent across all view types. Sprint 3 styled this for list/kanban — extend to all view types |
| 18 | Dark mode — all data views | Milo | Full dark pass: Graph (re-render Chart.js colors), Pivot (dark table), Activity (dark cells and headers), Cohort (dark heatmap). All must toggle correctly when user switches dark mode without page reload |
| 19 | Regression QA | Ivy | Test all four view types: verify chart colors update on dark mode toggle, pivot table sorts/expands correctly with new styles, activity cells show correct state colors, cohort heatmap is readable. Snapshot screenshot all views |

---

## Work Schedule

### Phase 1: Graph View (Tasks 1–7)
- Audit, Chart.js theming, typography, grid, tooltip, SCSS, skeleton
- **Checkpoint commit**: `sprint-15: graph view chart.js theming and modernization`

### Phase 2: Pivot View (Tasks 8–11)
- Full pivot table modernization and dark mode
- **Checkpoint commit**: `sprint-15: pivot view modernization`

### Phase 3: Activity View (Tasks 12–15)
- Activity table layout and cell states
- **Checkpoint commit**: `sprint-15: activity view modernization`

### Phase 4: Cohort + System (Tasks 16–18)
- Cohort heatmap, view switcher, full dark mode pass
- **Checkpoint commit**: `sprint-15: cohort view and dark mode`

### Phase 5: QA (Task 19)
- **Final commit**: `sprint-15: data views QA signoff`

---

## Design Specifications

### Chart.js Brand Palette (8 colors, anchored to brand-primary)
```
Color 0: #714B67 (brand-enterprise)
Color 1: #017e84 (brand-action)
Color 2: #71639e (brand-community)
Color 3: #f59e0b (amber)
Color 4: #22c55e (green)
Color 5: #ef4444 (red)
Color 6: #3b82f6 (blue)
Color 7: #8b5cf6 (violet)
Dark mode: all colors lightened by 20% luminosity
```

### Activity Cell States
```
Empty:   dashed circle outline, var(--o-gray-300), + on hover
Overdue: filled circle, #ef4444 (red), ! icon, white
Today:   filled circle, #f59e0b (amber), clock icon, white
Planned: filled circle, #22c55e (green), checkmark, white
Done:    filled circle, var(--o-gray-400), checkmark, white
```

---

## Success Criteria

- [ ] Chart.js colors use brand-derived palette (no hardcoded colors)
- [ ] Chart.js fonts use `--o-font-family-sans` from CSS custom properties
- [ ] Chart updates colors/fonts when dark mode toggles (no page reload needed)
- [ ] Pivot table has sticky headers (row + column)
- [ ] Pivot expandable rows indent and animate
- [ ] Pivot totals row is visually distinct
- [ ] Activity view columns are activity types with colored circle headers
- [ ] Activity cells show correct state color (empty/overdue/today/planned/done)
- [ ] Cohort heatmap (if present) uses brand color intensity scale
- [ ] All views have skeleton loading states (Sprint 11)
- [ ] Full dark mode on all data views
- [ ] Ivy QA sign-off

---

## What's NOT in This Sprint

| Feature | Reason |
|---------|--------|
| Chart type changes (new chart types) | Functionality, not UI |
| Pivot drag-drop behavior changes | JS complexity |
| Data export/download button redesign | Minor; covered by button styles from Sprint 2 |
| Dashboard widgets | Covered in Sprint 4; fine-tuning is Sprint 22 |
| Map view | Separate mapping library, own sprint |

---

## Agent Prompt

> Read `PROJECT_BRIEF.md`, then read `doc/sprint-15-plan.md`. You are the dev team: **Milo** (CSS/art director) and **Nova** (frontend engineer).
>
> Execute Sprint 15: Data Views — Graph, Pivot, Activity, Cohort.
>
> First: `git pull origin 19.0 && git checkout -b feature/sprint-15`
>
> **Nova** owns all Chart.js JS configuration (tasks 2–5) — these require JS changes to `graph_renderer.js`. **Milo** owns all SCSS work (tasks 1, 6–16, 18).
>
> IMPORTANT: Chart.js config is JS, not SCSS. When modifying `graph_renderer.js`, read the existing code carefully before changing. The goal is to inject CSS custom property values into Chart.js — use `getComputedStyle()` to read them.
>
> The dark mode toggle must re-render charts. Look for where the dark mode class is applied and observe it with a `MutationObserver` if needed.
>
> Commit after each phase. Update `doc/sprint-15-progress.md` after each commit.
> When done: `git push origin feature/sprint-15` and open a PR. Tag Ivy for QA.

---

## Progress Tracker

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Graph view audit | ⬜ Not started | |
| 2 | Chart.js color palette | ⬜ Not started | |
| 3 | Chart.js typography | ⬜ Not started | |
| 4 | Chart.js grid lines | ⬜ Not started | |
| 5 | Chart.js tooltip | ⬜ Not started | |
| 6 | Graph view SCSS | ⬜ Not started | |
| 7 | Graph loading state | ⬜ Not started | |
| 8 | Pivot view SCSS | ⬜ Not started | |
| 9 | Pivot expandable rows | ⬜ Not started | |
| 10 | Pivot cell highlighting | ⬜ Not started | |
| 11 | Pivot dark mode | ⬜ Not started | |
| 12 | Activity view audit | ⬜ Not started | |
| 13 | Activity view table | ⬜ Not started | |
| 14 | Activity cell states | ⬜ Not started | |
| 15 | Activity schedule button | ⬜ Not started | |
| 16 | Cohort view | ⬜ Not started | |
| 17 | View switcher control panel | ⬜ Not started | |
| 18 | Dark mode — all data views | ⬜ Not started | |
| 19 | Regression QA | ⬜ Not started | |
