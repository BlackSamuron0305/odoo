# Sprint 4 — Dashboards, Graphs & Dark Mode

> Sprint Goal: Theme the dashboard tiles and charts to the modern design language, then activate full dark mode using the CSS custom properties infrastructure from Sprint 0.
> Branch: `feature/sprint-4`
> Depends on: Sprints 0–3 complete

---

## Context

Sprint 0 scaffolded the dark mode `[data-bs-theme="dark"]` selector block. This sprint completes it. Dark mode requires a thorough pass across every component styled in sprints 1–3 plus the existing dashboard, graph, and pivot views. Charts (Chart.js) require a JavaScript theming pass since they don't respond to CSS.

Key files:
- `addons/spreadsheet_dashboard/` — dashboard tiles
- `addons/web/static/src/views/graph/`
- `addons/web/static/src/views/pivot/`
- `addons/web/static/lib/Chart/` — Chart.js config
- `addons/web/static/src/scss/secondary_variables.scss` — dark mode block

---

## Prioritized Task List

| # | Task | Owner | Description |
|---|------|-------|-------------|
| 1 | Complete dark mode CSS custom properties | Milo | Fill in the `[data-bs-theme="dark"]` block from Sprint 0 with inverted values for every `--o-*` property. All backgrounds, text, borders, shadows |
| 2 | Dark mode toggle in user menu | Nova | Add toggle switch to user menu dropdown. Persists to `localStorage`. Sets `data-bs-theme` attribute on `<html>`. Reads system preference (`prefers-color-scheme`) as default |
| 3 | Dark mode navbar | Milo | Navbar in dark mode: slightly lighter background from dark base, frosted glass effect adapts to dark |
| 4 | Dark mode form sheet | Milo | Form sheet in dark mode: `--o-view-background-color` → dark neutral, inputs with dark border |
| 5 | Dark mode list & kanban | Milo | Card backgrounds, hover states, column backgrounds — full dark pass |
| 6 | Chart.js dark theme | Nova + Milo | Graph/pivot JS: detect `data-bs-theme` attribute, swap Chart.js config: grid lines, tick labels, tooltip background, dataset default colors. Use `MutationObserver` to react to theme changes |
| 7 | Dashboard tile modernization | Milo | KPI tiles: larger number typography (2 rem), subtle trend arrow, more padding, rounded corners. Light/dark variants |
| 8 | Spreadsheet dashboard theming | Milo | Match spreadsheet UI chrome (toolbar, sheet tabs) to new design tokens. Minimal changes — spreadsheet content itself untouched |
| 9 | User preference persistence | Sage | Persist dark mode preference to `res.users` settings (optional: if localStorage is sufficient, skip server-side) |
| 10 | Full dark mode QA pass | Ivy | Test every view in dark mode. File any contrast issues as GitHub Issues with `a11y` label. Verify WCAG 2.1 AA contrast ratios |

---

## Work Schedule

### Phase 1: Dark Mode Core (Tasks 1–3)
- Complete CSS custom properties dark values
- User menu toggle
- Navbar dark variant
- **Checkpoint commit**: `sprint-4: dark mode core with toggle`

### Phase 2: Component Dark Passes (Tasks 4–6)
- Form, list, kanban dark variants
- Chart.js dark theming
- **Checkpoint commit**: `sprint-4: all views dark mode themed`

### Phase 3: Dashboards & Polish (Tasks 7–10)
- Dashboard tile redesign
- Spreadsheet chrome theming
- Preference persistence
- Ivy QA pass
- **Final commit**: `sprint-4: dashboards and dark mode complete`

---

## Dark Mode Color Mappings

| Light token | Dark value | Usage |
|-------------|------------|-------|
| `--o-view-background-color: white` | `#1a1a2e` | Sheet backgrounds |
| `--o-webclient-background-color: #f8f9fa` | `#0f0f1a` | Page background |
| `--o-gray-100` | `#1e1e2e` | Surface 1 |
| `--o-gray-200` | `#252535` | Surface 2 / borders |
| `--o-gray-300` | `#2e2e40` | Borders |
| `--o-gray-600` | `#9999bb` | Muted text |
| `--o-gray-700` | `#bbbbdd` | Secondary text |
| `--o-gray-900` | `#e8e8f0` | Primary text |
| `--o-brand-primary` | `#9b8ec4` | Lightened for dark bg contrast |
| `--o-shadow-md` | `0 2px 8px rgba(0,0,0,0.4)` | Deeper shadows on dark |

---

## Success Criteria

- [ ] Dark mode toggle in user menu, persists between sessions
- [ ] System preference (`prefers-color-scheme: dark`) respected on first visit
- [ ] Navbar renders correctly in dark mode
- [ ] Form view, list, kanban all pass dark mode visual check
- [ ] Chart.js charts re-theme when dark mode toggled (without page reload)
- [ ] Dashboard KPI tiles have modernized layout (large number, trend indicator)
- [ ] All text/background combinations meet WCAG 2.1 AA contrast (4.5:1 for body text)
- [ ] Ivy dark mode QA sign-off

---

## What's NOT in This Sprint

| Feature | Reason |
|---------|--------|
| Per-app dark mode theming | Too complex — one global toggle |
| High-contrast accessibility mode | Separate a11y sprint in mobile sprint 9 |
| Spreadsheet content dark mode | Spreadsheet cells untouched |
| Auto-refresh charts on theme change | Nice-to-have, defer if complex |

---

## Agent Prompt

> Read `PROJECT_BRIEF.md`, then read `doc/sprint-4-plan.md`. You are the dev team: **Milo** (CSS), **Nova** (frontend JS), **Sage** (backend for user preference).
>
> Execute Sprint 4: Dashboards, Graphs & Dark Mode.
>
> First: `git pull origin main && git checkout -b feature/sprint-4`
>
> Dark mode MUST pass WCAG 2.1 AA contrast. Use the browser's accessibility panel to check contrast ratios. If a color fails, adjust the dark value — do not relax the standard.
>
> Update `doc/sprint-4-progress.md` after each phase.
> When done: `git push origin feature/sprint-4` and open a PR.

---

## Progress Tracker

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Complete dark mode CSS | ⬜ Not started | |
| 2 | Dark mode toggle | ⬜ Not started | |
| 3 | Dark navbar | ⬜ Not started | |
| 4 | Dark form | ⬜ Not started | |
| 5 | Dark list & kanban | ⬜ Not started | |
| 6 | Chart.js dark theme | ⬜ Not started | |
| 7 | Dashboard tile redesign | ⬜ Not started | |
| 8 | Spreadsheet chrome | ⬜ Not started | |
| 9 | User preference persist | ⬜ Not started | |
| 10 | Dark mode QA | ⬜ Not started | |
