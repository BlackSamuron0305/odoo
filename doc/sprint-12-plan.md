# Sprint 12 — Typography System & Reading Density

> Sprint Goal: Implement a complete, consistent typography system using CSS custom properties — covering the full type scale, heading hierarchy, reading density modes, and code/monospace field styling — so every text surface in Odoo is readable, branded, and systematically maintainable.
> Branch: `feature/sprint-12`
> Depends on: Sprint 11 (motion tokens in place)

---

## Context

Sprint 0 only added `--o-font-*` tokens as infrastructure. No visual changes were made to typography. The current Odoo type system is inherited from Bootstrap with minimal customization — heading sizes are inconsistent across views, body text line-height varies, there is no density mode, and code/technical fields use browser defaults. This sprint implements the full visual type system.

Additionally, enterprise users have very different density needs: accountants working in list views want compact rows, while sales reps reading CRM records want comfortable spacing. This sprint introduces a **density toggle** (compact / comfortable / spacious) persisted to user preferences.

**Files to understand before starting:**
- `addons/web/static/src/scss/primary_variables.scss` — current `$o-font-*` variables
- `addons/web/static/src/scss/secondary_variables.scss` — derived font variables
- `addons/web/static/src/views/form/form_controller.scss` — Sprint 2 form styles
- `addons/web/static/src/views/list/list_renderer.scss` — Sprint 3 list styles
- `addons/web/static/src/webclient/webclient.scss` — global app styles

---

## Prioritized Task List

| # | Task | Owner | Description |
|---|------|-------|-------------|
| 1 | Typography token expansion | Milo | Expand `tokens/tokens.json` typography section: add `font-family-sans`, `font-family-mono`, `line-height-tight` (1.25), `line-height-base` (1.5), `line-height-relaxed` (1.75), `letter-spacing-tight` (-0.01em), `letter-spacing-normal` (0), `letter-spacing-wide` (0.02em). Expose all as `--o-*` CSS custom properties |
| 2 | Type scale — headings | Milo | Define consistent heading scale in `primary_variables.scss`: h1=24px/700, h2=20px/600, h3=17px/600, h4=15px/600, h5=14px/500, h6=13px/500. Apply `font-feature-settings: "kern" 1, "liga" 1`. Apply across form sheets, dialog titles, kanban column headers, page titles |
| 3 | Type scale — body text | Milo | Standardize: base=14px/400/1.5, small=13px/400/1.5, xsmall=12px/400/1.4. Apply `text-rendering: optimizeLegibility`. Ensure consistent line-height in list rows, form field values, chatter messages, sidebar items |
| 4 | Font feature settings | Milo | Add to `body` selector: `font-feature-settings: "kern" 1, "liga" 1, "calt" 1`. Add `font-variant-numeric: tabular-nums` to all numeric fields (many2one IDs, monetary values, sequence numbers, date fields). This aligns numbers in list columns |
| 5 | Monospace / code field styling | Milo | All technical fields render with `font-family: var(--o-font-family-mono)`. Target: XML fields, Python code fields, `char` fields with `class="o_field_char"` on technical models, the developer mode technical keys display, `field[name="arch"]`, JSON fields. Style: `background: var(--o-gray-50)`, `border-radius: 4px`, `padding: 2px 6px`, `font-size: 13px` |
| 6 | Density system — tokens | Milo | Add density tokens to `primary_variables.scss`: three sets of `--o-density-*` variables. Compact: row-height=32px, cell-padding-v=4px, form-section-gap=12px. Comfortable (default): row-height=40px, cell-padding-v=8px, form-section-gap=20px. Spacious: row-height=48px, cell-padding-v=12px, form-section-gap=28px |
| 7 | Density CSS classes | Milo | Add `.o_density_compact`, `.o_density_comfortable`, `.o_density_spacious` to `webclient.scss`. Each class overrides the `--o-density-*` custom properties on the `body` element. List renderer uses `var(--o-density-row-height)` for row heights. Form uses `var(--o-density-form-section-gap)` for section margins |
| 8 | Density toggle in user preferences | Nova | Add density toggle to the User Preferences dialog (`addons/web/static/src/webclient/user_menu/`). Three-button toggle: Compact / Comfortable / Spacious (icons: dense rows, normal rows, loose rows). Persist selection to `localStorage` key `odoo.ui.density`. Apply class on `document.body` at startup |
| 9 | Density — List view integration | Nova | List renderer reads `--o-density-row-height` for `tr` height, `--o-density-cell-padding-v` for `td` vertical padding. Ensure column headers scale consistently. Optional rows checkbox stays vertically centered at all densities |
| 10 | Density — Form view integration | Nova | Form sheet section gaps, field label/value vertical rhythm, info blocks all use density tokens. Statusbar pill height scales with density |
| 11 | Link & text action styling | Milo | Standardize all inline text links across the app: `color: var(--o-brand-primary)`, `text-decoration: none`, `border-bottom: 1px solid transparent`, on hover: `border-bottom-color: var(--o-brand-primary)`. Remove `text-decoration: underline` where it currently appears inconsistently |
| 12 | Truncation patterns | Milo | Establish consistent text truncation: `.o_text_truncate` helper class = `overflow: hidden; text-overflow: ellipsis; white-space: nowrap`. Apply to: list cell text, kanban card titles, breadcrumb items, sidebar menu labels, many2one display values |
| 13 | Print typography | Milo | `@media print`: force `font-size: 11pt`, `line-height: 1.4`, no custom fonts (system serif fallback), remove `font-feature-settings`, ensure headings are readable in grayscale |
| 14 | Dark mode type adjustments | Milo | In `[data-bs-theme="dark"]`: reduce `font-weight` of light text on dark backgrounds by 1 step (400→300 for body, 600→500 for headings) to compensate for halation effect. Slightly increase `letter-spacing` on body text by `0.01em` |
| 15 | Regression QA | Ivy | Test type scale on all views. Test density at all three levels on list, kanban, form. Test code fields on technical pages. Verify tabular numbers in monetary list columns. RTL (Arabic) text rendering. Print preview |

---

## Work Schedule

### Phase 1: Token Foundation (Tasks 1–4)
- Expand typography tokens, type scale, font-feature-settings
- **Checkpoint commit**: `sprint-12: typography tokens and type scale`

### Phase 2: Special Cases (Tasks 5, 11–12)
- Monospace fields, link styling, truncation helpers
- **Checkpoint commit**: `sprint-12: code fields, links, truncation patterns`

### Phase 3: Density System (Tasks 6–10)
- Density tokens, CSS classes, UI toggle, List + Form integration
- **Checkpoint commit**: `sprint-12: density toggle system (compact/comfortable/spacious)`

### Phase 4: Dark & Print (Tasks 13–14)
- Dark mode type adjustments, print typography
- **Checkpoint commit**: `sprint-12: dark mode and print typography`

### Phase 5: QA (Task 15)
- **Final commit**: `sprint-12: QA signoff, typography system complete`

---

## Design Specifications

### Type Scale
```
h1: 24px / 700 / line-height 1.25
h2: 20px / 600 / line-height 1.25
h3: 17px / 600 / line-height 1.3
h4: 15px / 600 / line-height 1.4
h5: 14px / 500 / line-height 1.4  (same size as body but medium weight)
h6: 13px / 500 / line-height 1.4
body: 14px / 400 / line-height 1.5
small: 13px / 400 / line-height 1.5
xsmall: 12px / 400 / line-height 1.4
```

### Density Row Heights
```
Compact:     32px row height, 4px vertical cell padding
Comfortable: 40px row height, 8px vertical cell padding  (default)
Spacious:    48px row height, 12px vertical cell padding
```

### Monospace Token
```
--o-font-family-mono: ui-monospace, "SFMono-Regular", "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
```

---

## Success Criteria

- [ ] Typography tokens fully expanded in `tokens/tokens.json`
- [ ] Heading scale (h1–h6) consistent across all views
- [ ] `tabular-nums` applied to all numeric/date/monetary list columns
- [ ] Monospace fields render with `--o-font-family-mono` and light background badge
- [ ] Density toggle visible in User Preferences dialog
- [ ] Density persists across page refresh via `localStorage`
- [ ] List view row heights change correctly at all three density levels
- [ ] Form view section gaps change correctly at all three density levels
- [ ] Text links consistent (no mixed underline styles)
- [ ] `.o_text_truncate` applied to all appropriate text elements
- [ ] Print typography renders at 11pt with readable headings
- [ ] Dark mode type adjustments applied
- [ ] Ivy regression sign-off

---

## What's NOT in This Sprint

| Feature | Reason |
|---------|--------|
| Custom font loading / self-hosted fonts | Odoo uses system fonts — no font loading needed |
| Right-to-left full audit | That's Sprint 22 |
| Per-user font size preference | Over-scope; density covers most use cases |
| Rich text editor styling | HTML editor is out of scope (v2 separate effort) |
| Mobile app typography | Mobile app is done; not in scope for this sprint |

---

## Agent Prompt

> Read `PROJECT_BRIEF.md`, then read `doc/sprint-12-plan.md`. You are **Milo** (CSS/art director) and **Nova** (frontend engineer).
>
> Execute Sprint 12: Typography System & Reading Density.
>
> First: `git pull origin 19.0 && git checkout -b feature/sprint-12`
>
> **Milo** owns all SCSS changes (tasks 1–7, 11–14). **Nova** owns the JS/OWL density toggle and integration (tasks 8–10).
>
> Typography work is subtle — the goal is consistency and system, not dramatic visual change. Users should notice that text is "cleaner" not that it "changed". The density toggle is the most visible user-facing feature of this sprint.
>
> `tabular-nums` on monetary columns is a high-value low-effort win — do this early.
>
> Commit after each phase. Update `doc/sprint-12-progress.md` after each commit.
> When done: `git push origin feature/sprint-12` and open a PR. Tag Ivy for QA.

---

## Progress Tracker

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Typography token expansion | ⬜ Not started | |
| 2 | Type scale — headings | ⬜ Not started | |
| 3 | Type scale — body text | ⬜ Not started | |
| 4 | Font feature settings | ⬜ Not started | |
| 5 | Monospace / code fields | ⬜ Not started | |
| 6 | Density tokens | ⬜ Not started | |
| 7 | Density CSS classes | ⬜ Not started | |
| 8 | Density toggle in user prefs | ⬜ Not started | |
| 9 | Density — List integration | ⬜ Not started | |
| 10 | Density — Form integration | ⬜ Not started | |
| 11 | Link & text action styling | ⬜ Not started | |
| 12 | Truncation patterns | ⬜ Not started | |
| 13 | Print typography | ⬜ Not started | |
| 14 | Dark mode type adjustments | ⬜ Not started | |
| 15 | Regression QA | ⬜ Not started | |
