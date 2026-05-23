# Sprint 14 — Settings, Configuration & Technical Pages

> Sprint Goal: Modernize every Settings and configuration page in Odoo — the General Settings view, user preferences, company configuration, technical menu pages, and developer mode tooling — so that admin and developer workflows feel as polished as the end-user UI.
> Branch: `feature/sprint-14`
> Depends on: Sprints 0–5b, Sprint 12 (typography density system)

---

## Context

The Settings area is the second-most-visited surface for Odoo administrators and IT staff. It currently looks entirely untouched — using raw Bootstrap columns, dense input groups, and no visual hierarchy. The `res.config.settings` view is a special "settings page" view type in Odoo (not a standard form view) with its own component and SCSS.

Developer mode (debug mode) adds a Technical menu with database-level access. These pages (fields list, models list, views editor, access rights, etc.) are used daily by developers and have no modern styling at all.

This is a pure **SCSS + light OWL component** sprint. No changes to Settings functionality.

**Files to understand before starting:**
- `addons/base_setup/static/src/` — General settings component
- `addons/web/static/src/webclient/settings/` (if it exists) — settings shell
- `addons/web/static/src/views/form/` — settings use form view internally  
- `addons/web/static/src/webclient/user_menu/` — user preferences dialog (Sprint 1 + 12 work)
- Look for: `o_settings`, `o_setting_box`, `o_setting_group` selectors in SCSS

---

## Prioritized Task List

| # | Task | Owner | Description |
|---|------|-------|-------------|
| 1 | Settings view audit | Milo | Identify all CSS selectors used by `res.config.settings` view. Map: `.o_settings_container`, `.o_setting_box`, `.o_setting_group`, `.o_setting_left_pane`, `.o_setting_right_pane`, `.o_setting_tip`. Document in `doc/sprint-14-audit.md` |
| 2 | Settings page layout | Milo | Settings container: max-width 900px, centered. Left navigation panel: 220px sticky sidebar with section tabs. Right content area: scrollable. Each settings section: card-style container (`border-radius: 8px`, `border: 1px solid var(--o-gray-200)`, `padding: 24px`). Section title: h3 style from Sprint 12 scale |
| 3 | Settings section cards | Milo | Each setting group (e.g., "Email", "Integrations"): white card with header (section title + optional icon) and settings rows below. Settings row: label left (60% width), control right (40% width). Label: 14px/400 with description below in 12px/gray-500. Control: right-aligned |
| 4 | Settings toggle fields | Milo | Boolean setting toggles: use a consistent pill-style toggle switch component (CSS only, no JS changes). `background: var(--o-gray-300)` off, `var(--o-brand-primary)` on. `border-radius: 999px`. Knob: white circle with subtle shadow. Transition: `background var(--o-duration-fast)`, knob `transform` |
| 5 | Settings input fields | Milo | Text/number settings inputs: `height: 36px`, `border-radius: 6px`, `border: 1px solid var(--o-gray-300)`, focus: brand primary outline. Match density system from Sprint 12 |
| 6 | Settings navigation sidebar | Milo | Left settings nav: app icon (24px) + app name. Active: brand-tinted background. Hover: `var(--o-gray-100)`. Section items: 40px height, 14px, indented 12px from app name. Sticky scroll with `position: sticky; top: 0` |
| 7 | Settings save bar | Milo | The sticky "Save" / "Discard" bar at the top of settings that appears when changes are pending: full-width, `background: var(--o-brand-primary)`, white text, `box-shadow: 0 2px 8px rgba(0,0,0,0.15)`. Animate in from top when changes detected |
| 8 | User Preferences dialog | Milo | Modernize the user preferences dialog (triggered from user avatar menu). Sections: Profile, Notifications, Display (density from Sprint 12, dark mode). Avatar upload zone: dashed `border-radius: 50%` circle, hover overlay. Language/timezone dropdowns styled consistently |
| 9 | Company Settings | Milo | `res.company` form view styling: logo upload zone (square with dashed border, 120px × 120px), company colors preview swatches, address block in a clean card |
| 10 | Technical menu — list pages | Milo | Technical model/field/view list pages (developer mode): use Sprint 3 list styles. Column headers sticky. Technical badge for system fields: `border-radius: 4px`, `font-size: 11px`, gray background. Model name in monospace (Sprint 12) |
| 11 | Technical menu — form pages | Milo | Technical form pages (editing a field definition, access rule, etc.): use Sprint 2 form styles. Field `arch` (XML view definition): full-height code editor area with monospace font, `background: var(--o-gray-50)`, line numbers if present |
| 12 | Developer mode indicator | Nova | When developer mode is active: subtle indicator in the navbar (small `DEV` badge next to user avatar, or colored dot on the gear icon). Color: amber `#f59e0b`. Tooltip on hover: "Developer mode active". Disappears when dev mode is off |
| 13 | Access Rights grid | Milo | The access rights matrix (table of models × groups): `sticky` first column (model name), column headers rotated 45° for space efficiency. Grant: green checkmark icon. Deny: red cross. No access: empty cell |
| 14 | API Keys page | Milo | API keys list (`/odoo/settings/users/api-keys`): key preview in monospace pill. Created date + expiry date with Sprint 12 tabular-nums. Revoke button: destructive red, requires confirmation dialog |
| 15 | Dark mode — settings | Milo | Full dark mode pass on all settings and technical pages. Settings cards: `var(--o-gray-800)` background with `var(--o-gray-700)` border. Technical pages use same dark list/form token system as main views |
| 16 | Regression QA | Ivy | Test: open General Settings, change a toggle, save. Open User Preferences. Navigate all Technical menu pages in dev mode. Test in light + dark mode. Test at all three density levels |

---

## Work Schedule

### Phase 1: Settings Layout & Cards (Tasks 1–3)
- Audit, layout, section cards
- **Checkpoint commit**: `sprint-14: settings page layout and section cards`

### Phase 2: Settings Controls (Tasks 4–7)
- Toggles, inputs, sidebar nav, save bar
- **Checkpoint commit**: `sprint-14: settings controls and navigation`

### Phase 3: Preferences & Company (Tasks 8–9)
- User preferences dialog, company settings
- **Checkpoint commit**: `sprint-14: user preferences and company settings`

### Phase 4: Technical Pages (Tasks 10–14)
- List pages, form pages, dev mode indicator, access rights, API keys
- **Checkpoint commit**: `sprint-14: technical pages and developer tools`

### Phase 5: Dark Mode & QA (Tasks 15–16)
- **Final commit**: `sprint-14: dark mode and QA signoff`

---

## Design Specifications

### Settings Card
```
background:    white (light) / var(--o-gray-800) (dark)
border:        1px solid var(--o-gray-200) / var(--o-gray-700)
border-radius: 8px
padding:       24px
margin-bottom: 16px
box-shadow:    var(--o-shadow-sm)
```

### Toggle Switch
```
Width:         44px; Height: 24px; Border-radius: 999px
Off:           background: var(--o-gray-300)
On:            background: var(--o-brand-primary)
Knob:          20px circle, white, box-shadow: 0 1px 3px rgba(0,0,0,0.2)
Transition:    200ms ease
```

### Settings Save Bar
```
height:        48px
background:    var(--o-brand-primary)
color:         white
position:      sticky; top: 0; z-index: 100
animation:     slides down from top when changes pending
```

---

## Success Criteria

- [ ] Settings page has max-width 900px centered layout
- [ ] Settings sections render as cards with header + rows
- [ ] Toggle switches are pill-style with smooth on/off animation
- [ ] Settings save bar appears at top when changes pending
- [ ] Left settings navigation sidebar with app icons is sticky
- [ ] User Preferences dialog has Profile / Notifications / Display sections
- [ ] Technical list pages use Sprint 3 list styles
- [ ] Technical form pages use Sprint 2 form styles with monospace code fields
- [ ] Developer mode indicator visible in navbar
- [ ] Access rights grid has sticky first column
- [ ] Full dark mode on all settings surfaces
- [ ] All three density levels work on settings list pages
- [ ] Ivy QA sign-off

---

## What's NOT in This Sprint

| Feature | Reason |
|---------|--------|
| Settings functionality changes | UI only — no model/controller changes |
| New settings options | Product decision — out of scope |
| Audit log / activity log pages | Separate from settings; covered by list view styles |
| Reports configuration | Report views covered by Sprint 21 |
| Email template editor | HTML editor excluded from scope |

---

## Agent Prompt

> Read `PROJECT_BRIEF.md`, then read `doc/sprint-14-plan.md`. You are the dev team: **Milo** (CSS/art director) and **Nova** (frontend engineer).
>
> Execute Sprint 14: Settings, Configuration & Technical Pages.
>
> First: `git pull origin 19.0 && git checkout -b feature/sprint-14`
>
> Start with the audit (Task 1) — settings have unusual selectors and a custom view type. Understand the DOM structure before writing any SCSS.
>
> **Milo** owns all SCSS (tasks 1–11, 13–15). **Nova** owns the developer mode indicator OWL component (task 12).
>
> The toggle switch (Task 4) is CSS-only — no JS. Use `:checked` sibling combinator on the existing checkbox input. Do not change the HTML structure.
>
> Commit after each phase. Update `doc/sprint-14-progress.md` after each commit.
> When done: `git push origin feature/sprint-14` and open a PR. Tag Ivy for QA.

---

## Progress Tracker

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Settings view audit | ⬜ Not started | |
| 2 | Settings page layout | ⬜ Not started | |
| 3 | Settings section cards | ⬜ Not started | |
| 4 | Settings toggle fields | ⬜ Not started | |
| 5 | Settings input fields | ⬜ Not started | |
| 6 | Settings navigation sidebar | ⬜ Not started | |
| 7 | Settings save bar | ⬜ Not started | |
| 8 | User Preferences dialog | ⬜ Not started | |
| 9 | Company Settings | ⬜ Not started | |
| 10 | Technical menu — list pages | ⬜ Not started | |
| 11 | Technical menu — form pages | ⬜ Not started | |
| 12 | Developer mode indicator | ⬜ Not started | |
| 13 | Access Rights grid | ⬜ Not started | |
| 14 | API Keys page | ⬜ Not started | |
| 15 | Dark mode — settings | ⬜ Not started | |
| 16 | Regression QA | ⬜ Not started | |
