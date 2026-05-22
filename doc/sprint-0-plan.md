# Sprint 0 — Design Tokens & Bootstrap 5.3 Upgrade

> Sprint Goal: Establish a shared design token foundation and upgrade Bootstrap to 5.3, enabling CSS custom properties for dynamic theming across web and mobile.
> Branch: `feature/sprint-0`

---

## Context

Odoo 19 currently uses Bootstrap 5.2.x and a flat `$o-*` SCSS variable system. Bootstrap 5.3 introduces first-class CSS custom properties for color modes and a `color-scheme` API that aligns perfectly with Odoo's existing `$o-webclient-color-scheme` variable. This sprint sets the foundational layer that every subsequent sprint builds upon.

**Do NOT change any visual output in this sprint.** The goal is infrastructure only — same look, new architecture underneath.

Key files to understand before starting:
- `addons/web/static/src/scss/primary_variables.scss` — all `$o-*` tokens
- `addons/web/static/src/scss/secondary_variables.scss` — derived tokens
- `addons/web/static/src/scss/bootstrap_overridden.scss` — BS overrides
- `addons/web/static/lib/bootstrap/scss/_variables.scss` — Bootstrap source

---

## Prioritized Task List

| # | Task | Owner | Description |
|---|------|-------|-------------|
| 1 | Audit all `$o-*` SCSS tokens | Milo | Catalogue every `$o-brand-*`, `$o-gray-*`, `$o-*-color` variable with value, purpose, usage count. Output: `doc/sprint-0-token-audit.md` |
| 2 | Create `tokens/tokens.json` | Milo | Single JSON file with all design tokens: colors, spacing, radius, shadows, typography, breakpoints |
| 3 | Create `tokens/build.js` | Nova | Script: `tokens.json` → `tokens/_tokens.scss` (SCSS vars + `:root` custom props) + `tokens/tokens.ts` (typed TS constants for mobile) |
| 4 | Upgrade Bootstrap 5.2 → 5.3 | Nova | Swap `addons/web/static/lib/bootstrap/` to Bootstrap 5.3.x; check dist CSS; audit breaking changes in SCSS API |
| 5 | Add CSS custom properties to `primary_variables.scss` | Milo | After each `$o-*` declaration, expose as `:root { --o-*: #{$o-*} }`. Namespace: `--o-brand-primary`, `--o-gray-500`, etc. |
| 6 | Update `bootstrap_overridden.scss` for BS 5.3 | Milo | Map BS 5.3 new variables (`--bs-body-color`, `--bs-body-bg`, CSS mode variables) to existing Odoo override values |
| 7 | Dark mode baseline scaffold | Milo | Add `[data-bs-theme="dark"]` block in `secondary_variables.scss` with inverted `$o-*` values — toggle does nothing visible yet |
| 8 | Regression test all views | Ivy | Visual diff pass on: Form view, List view, Kanban view, Navbar, Dialogs/Modals, Calendar, Graph — confirm zero visual regressions |

---

## Work Schedule

### Phase 1: Audit & Token File (Tasks 1–3)
- Milo audits all SCSS variables → `doc/sprint-0-token-audit.md`
- Create `tokens/tokens.json` with full token set (colors, spacing, radius, shadows, type)
- Nova writes `tokens/build.js` → generates `.scss` + `.ts` outputs
- **Checkpoint commit**: `sprint-0: add design token foundation`

### Phase 2: Bootstrap 5.3 Upgrade (Tasks 4–6)
- Replace Bootstrap lib directory contents with 5.3.x
- Run Odoo asset bundler, fix any compilation errors
- Update all `bootstrap_overridden*.scss` files for BS 5.3 API changes
- **Checkpoint commit**: `sprint-0: upgrade bootstrap to 5.3`

### Phase 3: CSS Custom Properties & Dark Baseline (Tasks 7–8)
- Expose key tokens as `:root` CSS custom properties
- Add dark mode `[data-bs-theme="dark"]` selector block
- Ivy runs full visual regression pass
- **Final commit**: `sprint-0: css custom properties baseline and dark mode scaffold`

---

## Token File Structure (tokens/tokens.json)

```json
{
  "color": {
    "brand": {
      "community":  { "value": "#71639e", "scss": "$o-community-color" },
      "enterprise": { "value": "#714B67", "scss": "$o-enterprise-color" },
      "action":     { "value": "#017e84", "scss": "$o-enterprise-action-color" },
      "primary":    { "value": "#71639e", "scss": "$o-brand-primary" },
      "secondary":  { "value": "#8f8f8f", "scss": "$o-brand-secondary" }
    },
    "status": {
      "success": { "value": "#28a745", "scss": "$o-success" },
      "warning": { "value": "#ffac00", "scss": "$o-warning" },
      "danger":  { "value": "#dc3545", "scss": "$o-danger" },
      "info":    { "value": "#17a2b8", "scss": "$o-info" }
    },
    "gray": {
      "100": { "value": "#f8f9fa" }, "200": { "value": "#e9ecef" },
      "300": { "value": "#dee2e6" }, "400": { "value": "#ced4da" },
      "500": { "value": "#adb5bd" }, "600": { "value": "#6c757d" },
      "700": { "value": "#495057" }, "800": { "value": "#343a40" },
      "900": { "value": "#212529" }
    }
  },
  "spacing": {
    "spacer": { "value": "16px", "scss": "$o-spacer" },
    "form-unit": { "value": "5px", "scss": "$o-form-spacing-unit" },
    "horizontal-padding": { "value": "16px", "scss": "$o-horizontal-padding" }
  },
  "radius": {
    "sm": { "value": "3px", "scss": "$o-border-radius-sm" },
    "md": { "value": "4px", "scss": "$o-border-radius" },
    "lg": { "value": "6px", "scss": "$o-border-radius-lg" }
  },
  "shadow": {
    "sm": { "value": "0 1px 2px rgba(0,0,0,0.06)" },
    "md": { "value": "0 2px 8px rgba(0,0,0,0.10)" },
    "lg": { "value": "0 4px 20px rgba(0,0,0,0.14)" }
  },
  "typography": {
    "size-base":        { "value": "14px", "scss": "$o-font-size-base" },
    "size-base-touch":  { "value": "16px", "scss": "$o-font-size-base-touch" },
    "size-sm":          { "value": "13px", "scss": "$o-font-size-base-small" },
    "size-xs":          { "value": "12px", "scss": "$o-font-size-base-smaller" },
    "weight-normal":    { "value": "400",  "scss": "$o-font-weight-normal" },
    "weight-medium":    { "value": "500",  "scss": "$o-font-weight-medium" },
    "weight-bold":      { "value": "700",  "scss": "$o-font-weight-bold" },
    "line-height-base": { "value": "1.5",  "scss": "$o-line-height-base" }
  },
  "navbar": {
    "height": { "value": "46px", "scss": "$o-navbar-height" }
  }
}
```

---

## Success Criteria

- [ ] `tokens/tokens.json` exists and contains all color, spacing, radius, shadow, and typography tokens matching existing `$o-*` values exactly
- [ ] `tokens/tokens.ts` is generated with typed constants
- [ ] `tokens/_tokens.scss` is generated and imports cleanly into the Odoo SCSS pipeline
- [ ] Bootstrap version in `addons/web/static/lib/bootstrap/` is 5.3.x
- [ ] All CSS custom property names follow `--o-*` namespace
- [ ] `[data-bs-theme="dark"]` selector block scaffolded in `secondary_variables.scss`
- [ ] Odoo asset bundler compiles without errors or warnings
- [ ] All views render visually identical to pre-sprint baseline (Ivy sign-off)

---

## What's NOT in This Sprint

| Feature | Reason |
|---------|--------|
| Any visible design changes | Infrastructure only |
| Dark mode enabled for users | Scaffold only — Sprint 4 enables it |
| Mobile app | Starts Sprint 6 |
| New components or layouts | Starts Sprint 1 |
| jQuery removal | Separate effort, not this sprint |

---

## Agent Prompt

> Read `PROJECT_BRIEF.md`, then read `doc/sprint-0-plan.md`. You are the dev team: **Nova** (frontend engineer), **Milo** (CSS/art director), **Sage** (backend engineer).
>
> Execute Sprint 0: Design Tokens & Bootstrap 5.3 Upgrade.
>
> First: `git pull origin main && git checkout -b feature/sprint-0`
>
> **Milo** leads tasks 1, 2, 5, 6, 7. **Nova** leads tasks 3, 4. **Ivy** handles task 8.
>
> CRITICAL CONSTRAINT: Do NOT change any visual output. Infrastructure only. If Bootstrap 5.3 introduces any visual change, override it back to match baseline.
>
> Take your time and do it right — this is the foundation for 9 more sprints.
>
> Checkpoint commits after each phase. When done: `git push origin feature/sprint-0` and open a PR.
> Follow Sections 12–14 of `PROJECT_BRIEF.md`.

---

## Progress Tracker

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Audit `$o-*` SCSS tokens | ⬜ Not started | |
| 2 | Create `tokens/tokens.json` | ⬜ Not started | |
| 3 | Create `tokens/build.js` | ⬜ Not started | |
| 4 | Upgrade Bootstrap 5.2 → 5.3 | ⬜ Not started | |
| 5 | Add CSS custom properties | ⬜ Not started | |
| 6 | Update `bootstrap_overridden.scss` | ⬜ Not started | |
| 7 | Dark mode baseline | ⬜ Not started | |
| 8 | Regression test | ⬜ Not started | |
