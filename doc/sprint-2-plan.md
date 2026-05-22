# Sprint 2 — Form Views Modernization

> Sprint Goal: Modernize the form view's visual design — floating labels, refined sheet layout, sticky action bar, and polished field states — without changing any OWL component logic or XML arch.
> Branch: `feature/sprint-2`
> Depends on: Sprint 0 (design tokens), Sprint 1 (navbar height adjustment)

---

## Context

The Odoo form view is the most-used interface in the ERP. It uses a "sheet" metaphor (white card on gray background) with a fixed header statusbar and a scrollable body. The current design is functional but dense. This sprint modernizes the visual feel without touching any business logic, validators, field widgets, or XML view definitions.

Key files:
- `addons/web/static/src/views/form/form_controller.scss` (31 KB)
- `addons/web/static/src/views/form/form_controller.xml`
- `addons/web/static/src/views/form/form.variables.scss`
- `addons/web/static/src/scss/primary_variables.scss` (for `$o-input-*` variables)

---

## Prioritized Task List

| # | Task | Owner | Description |
|---|------|-------|-------------|
| 1 | Refine form sheet design | Milo | More generous padding (24 px), softer drop shadow (`--o-shadow-md`), border-radius 8 px on the sheet card. Update `form.variables.scss` |
| 2 | Modernize input fields | Milo | Increase `$o-input-padding-y` to 5 px, `$o-input-padding-x` to 8 px. Subtle border on focus (`2px solid var(--o-brand-primary)` at 60% opacity), smooth transition 150 ms |
| 3 | Required field indicator modernization | Milo | Replace current indicator with left-border accent (`3px solid var(--o-brand-primary)`) on required fields in edit mode. Less visual noise than current |
| 4 | Statusbar modernization | Milo | Pill-shaped stage buttons instead of flat text. Active stage: filled pill with brand color. Completed stages: subtle filled. Current: brand-colored border + bold text |
| 5 | Sticky form action bar (save/discard) | Nova + Milo | When form sheet scrolls, the save/discard button bar sticks to the bottom of the viewport. Uses `position: sticky` + CSS. No JS required |
| 6 | Stat buttons (smart buttons) redesign | Milo | More card-like, subtle box-shadow, hover elevation effect. Current `$o-statbutton-height: 44px` → increase to 52 px for better touch target |
| 7 | Field label refinement | Milo | Smaller font (12 px), medium weight (500), uppercase tracking on group headers. Better vertical alignment with field values |
| 8 | Empty/placeholder state styling | Milo | Dash-styled placeholder in read mode, subtle italic text. Consistent across all field types |
| 9 | Full-form regression + QA | Ivy | Test all common field widgets: Char, Many2one, One2many, Binary, Date, Selection, Tags. Test create/edit/save flows |

---

## Work Schedule

### Phase 1: Sheet & Input Baseline (Tasks 1–3)
- Sheet card redesign (padding, shadow, radius)
- Input field padding and focus states
- Required field indicator
- **Checkpoint commit**: `sprint-2: form sheet and input field modernization`

### Phase 2: Statusbar & Actions (Tasks 4–5)
- Pill statusbar
- Sticky action bar
- **Checkpoint commit**: `sprint-2: pill statusbar and sticky action bar`

### Phase 3: Stat Buttons, Labels & Polish (Tasks 6–9)
- Smart button card redesign
- Label and placeholder polish
- Ivy QA pass
- **Final commit**: `sprint-2: form view modernization complete`

---

## Design Specifications

### Form Sheet
```
Background:         white (unchanged)
Outer background:   var(--o-gray-100) (unchanged)
Padding:            24px (was $o-horizontal-padding = 16px)
Border-radius:      8px
Box-shadow:         0 2px 8px rgba(0,0,0,0.08), 0 0 1px rgba(0,0,0,0.04)
Max-width:          1024px (was $o-form-sheet-min-width: 990px — minimal change)
```

### Input Fields (edit mode)
```
Padding:            5px 8px (was 2px 4px)
Border:             1px solid var(--o-gray-300)
Border-radius:      6px
Focus border:       2px solid rgba(var(--o-brand-primary-rgb), 0.6)
Focus shadow:       0 0 0 3px rgba(var(--o-brand-primary-rgb), 0.12)
Transition:         border 150ms, box-shadow 150ms
```

### Statusbar Pills
```
Stage pill:         border-radius: 999px, padding: 4px 14px
Active/current:     background: var(--o-brand-primary), color: white
Done stages:        background: var(--o-gray-200), color: var(--o-gray-700)
Blocked:            background: var(--o-danger) light tint, color: var(--o-danger)
```

---

## Success Criteria

- [ ] Form sheet has 24 px padding and soft box-shadow
- [ ] Input focus state has branded ring effect
- [ ] Required fields show left-border accent in edit mode
- [ ] Statusbar shows pill-shaped stage buttons
- [ ] Action bar (save/discard) sticks to viewport bottom when scrolling
- [ ] Smart buttons have card elevation on hover
- [ ] No regressions on any field widget type (Ivy sign-off)
- [ ] Tested on mobile (form layout adapts correctly)
- [ ] `prefers-reduced-motion` respected for all hover/focus transitions

---

## What's NOT in This Sprint

| Feature | Reason |
|---------|--------|
| Floating/animated labels | Complex, risks breaking field widget rendering. Deferred |
| Chatter / messaging redesign | Separate sprint (too large) |
| Attachment widget redesign | Out of scope |
| New field types | Not in scope — this is styling only |
| Form view XML changes | Never — only SCSS changes |

---

## Agent Prompt

> Read `PROJECT_BRIEF.md`, then read `doc/sprint-2-plan.md`. You are the dev team: **Milo** (CSS/art director), **Nova** (frontend).
>
> Execute Sprint 2: Form Views Modernization.
>
> First: `git pull origin main && git checkout -b feature/sprint-2`
>
> **Critical**: Only modify SCSS files. Do NOT touch any `.js`, `.xml`, or Python files. The OWL form component logic must remain 100% unchanged.
>
> All spacing changes must use the CSS custom properties established in Sprint 0 (`var(--o-*)`).
>
> Update `doc/sprint-2-progress.md` after each phase.
> When done: `git push origin feature/sprint-2` and open a PR.

---

## Progress Tracker

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Form sheet design | ⬜ Not started | |
| 2 | Input field modernization | ⬜ Not started | |
| 3 | Required field indicator | ⬜ Not started | |
| 4 | Statusbar pills | ⬜ Not started | |
| 5 | Sticky action bar | ⬜ Not started | |
| 6 | Stat buttons redesign | ⬜ Not started | |
| 7 | Field label refinement | ⬜ Not started | |
| 8 | Empty state styling | ⬜ Not started | |
| 9 | QA regression | ⬜ Not started | |
