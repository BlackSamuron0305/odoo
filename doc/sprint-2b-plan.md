# Sprint 2b — Global Components: Dialogs, Fields, Chatter & Calendar

> Sprint Goal: Apply the modern design language to every shared UI component that appears across ALL views — dialogs, field widgets, chatter, date pickers, notifications, and calendar view — so no screen is left un-upgraded.
> Branch: `feature/sprint-2b`
> Depends on: Sprint 0 (tokens), Sprint 1 (navbar), Sprint 2 (form views)

---

## Context

After the form view modernization in Sprint 2, many UI components that appear *inside* or *alongside* forms still use the old visual language. This sprint is a **horizontal pass** — these components are shared across the entire Odoo UI and must be done before Sprint 4's dark mode can be comprehensive.

**Files in scope:**
- `addons/web/static/src/core/dialog/dialog.scss`
- `addons/web/static/src/core/notifications/notification.scss`
- `addons/web/static/src/core/datetime/datetime_picker.scss`
- `addons/web/static/src/core/dropdown/*.scss` + `accordion_item.scss`
- `addons/web/static/src/core/notebook/notebook.scss`
- `addons/web/static/src/core/popover/`
- `addons/web/static/src/views/fields/fields.scss` (and per-field `*.scss` files)
- `addons/web/static/src/search/` (search bar, search panel, control panel breadcrumbs)
- `addons/mail/static/src/scss/composer.scss`
- `addons/mail/static/src/scss/mail_activity.scss`
- `addons/mail/static/src/core/web/activity.scss`
- `addons/mail/static/src/core/web/activity_menu.scss`
- `addons/mail/static/src/core/web/mention_list.scss`
- `addons/mail/static/src/core/web/messaging_menu_patch.scss`
- `addons/mail/static/src/core/web/discuss_patch.scss`
- `addons/mail/static/src/core/web/recipients_input.scss`
- `addons/web/static/src/views/calendar/calendar_controller.scss`
- `addons/web/static/src/views/calendar/calendar_renderer.scss`
- `addons/web/static/src/views/calendar/calendar_renderer.dark.scss`

---

## Prioritized Task List

| # | Task | Owner | Description |
|---|------|-------|-------------|
| 1 | Dialog / Modal modernization | Milo | `border-radius: 12px` on modal content. Softer backdrop (`rgba(0,0,0,0.4)` + `backdrop-filter: blur(2px)`). Modal header: bolder title (600), cleaner close button (×). Footer: right-aligned by default, consistent button spacing. Mobile: slide-up animation (`.modal-content { transform: translateY }`) |
| 2 | Notification / Toast modernization | Milo | Pill-shaped toasts: `border-radius: 999px` for single-line, `12px` for multi-line. Left-colored border per type (success=green, warning=amber, danger=red, info=teal). Subtle shadow. Slide-in from top-right animation |
| 3 | DateTime picker modernization | Milo | Calendar grid: rounder day cells (circular selected day), cleaner month/year header, `var(--o-brand-primary)` for selected date, `var(--o-component-active-bg)` for today. Time picker: stepper-style inputs |
| 4 | Dropdown modernization | Milo | Dropdown menus: `border-radius: 8px`, `box-shadow: var(--o-shadow-lg)`, subtle animation (scale + opacity, 100ms). Dropdown items: 36 px height, 12 px horizontal padding, smooth hover background |
| 5 | Popover modernization | Milo | Popovers: `border-radius: 8px`, `box-shadow: var(--o-shadow-lg)`, clean arrow, `12px` padding. Tooltip: dark background, small `border-radius: 4px`, max-width 250 px |
| 6 | Field widgets — status/badge fields | Milo | `state_selection`, `statusbar`, `priority` stars, `badge`, `label_selection` — ensure pill/badge shape is consistent with Sprint 2's pill statusbar. Use `var(--o-*)` tokens throughout |
| 7 | Field widgets — relational fields | Milo | `many2one`, `many2many_tags`, `one2many` — tag chips: `border-radius: 999px`, close button refinement, hover state. Many2one dropdown: matches Task 4 dropdown style |
| 8 | Field widgets — binary/image fields | Milo | `image`, `binary`, `signature`, `pdf_viewer` — consistent upload zone design: dashed border, hover highlight, centered icon + label |
| 9 | Field widgets — boolean & toggle fields | Milo | `boolean_toggle`, `boolean_favorite` (star) — toggle: smooth CSS transition. Favorite star: `var(--o-main-favorite-color)` filled animation on click |
| 10 | Chatter composer modernization | Milo | `composer.scss`: pill input bar at bottom of chatter, send button integrated into the bar. Attachment chip design. "Log note" / "Send message" toggle: subtle tab-style not separate buttons |
| 11 | Activity widget modernization | Milo | `mail_activity.scss`: activity pills in form view — cleaner, color-coded by type. Overdue activities: red tint. Upcoming: amber. Done: green. Schedule button: matches Sprint 2 button style |
| 12 | Notebook / Tabs | Milo | `notebook.scss`: active tab gets 2px brand-color bottom border (not filled background). Inactive tabs: gray-600 text. Horizontal scroll indicator for many tabs |
| 13 | Search bar & panel | Milo | `search/`: search input pill-shaped (already in Sprint 3 control panel). Search panel (left sidebar in views): section headers 11px uppercase, filter checkboxes use branded toggle style, section dividers 0.5px |
| 14 | Messaging menu (systray bell) | Milo | `messaging_menu_patch.scss`: dropdown panel 360px wide, 12px radius, message preview rows with avatar + bold sender + truncated preview + relative timestamp. Unread dot: brand color |
| 15 | Mention list & recipients | Milo | `mention_list.scss`, `recipients_input.scss`, `recipients_input_tags_list_popover.scss`: avatar + name + email format. Keyboard-highlighted row: brand tinted. Recipient tags: pill-shaped with avatar |
| 16 | Calendar view modernization | Milo | `calendar_controller.scss`, `calendar_renderer.scss`: event pills rounder (6px radius), more vibrant event colors, day cell hover state, today cell highlight with brand color. Week/day view: time slots cleaner. Month view: event count badge pill |
| 17 | Calendar dark mode integration | Milo | `calendar_renderer.dark.scss` already exists — update it to use the `--o-*` CSS custom properties from Sprint 0 instead of hardcoded values |
| 18 | Regression QA — global components | Ivy | Test every component in context: open a dialog, receive a notification, use a datetime picker, send a chatter message, schedule an activity, view calendar. Both light and dark modes |

---

## Work Schedule

### Phase 1: System Overlays (Tasks 1–5)
- Dialogs, notifications, datetime picker, dropdowns, popovers
- These are the "floating layer" — same layer of depth, same design language
- **Checkpoint commit**: `sprint-2b: system overlays modernized (dialogs, notifications, pickers, dropdowns)`

### Phase 2: Field Widgets (Tasks 6–9)
- All field widget SCSS: status, relational, binary, boolean
- **Checkpoint commit**: `sprint-2b: field widgets modernized`

### Phase 3: Mail Ecosystem (Tasks 10–15)
- Chatter composer, activity widget, messaging menu, mention list, recipients
- **Checkpoint commit**: `sprint-2b: mail and messaging components modernized`

### Phase 4: Calendar + QA (Tasks 16–18)
- Calendar view + dark mode token integration
- Ivy regression QA
- **Final commit**: `sprint-2b: calendar modernized and regression QA complete`

---

## Design Specifications

### Dialogs
```
Border-radius:   12px (desktop), full-screen on mobile
Backdrop:        rgba(0,0,0,0.4) + backdrop-filter: blur(2px)
Header padding:  16px 20px
Title:           font-weight: 600, font-size: 16px
Close button:    24px × 24px, border-radius: 50%, hover: gray-200 bg
Footer:          border-top: 1px solid var(--o-gray-200), 12px padding
Mobile:          slide-up from bottom, border-radius top only (12px top, 0 bottom)
```

### Notifications / Toasts
```
Border-radius:   999px (single-line) / 12px (multi-line)
Left border:     4px solid {type-color}
Shadow:          var(--o-shadow-md)
Enter animation: slide in from top-right, 200ms ease
Exit animation:  fade + slide out, 150ms ease
Position:        top-right, 16px from edge, 8px between toasts
```

### DateTime Picker
```
Selected day:    circular highlight, var(--o-brand-primary) bg, white text
Today:           var(--o-component-active-bg) bg, brand color text
Day hover:       var(--o-gray-100) bg, border-radius: 50%
Header buttons:  chevron arrows, not text, consistent with icon system
```

### Chatter Composer
```
Layout:          single bar at bottom of chatter region
Input:           border-radius: 999px, 40px height
Send button:     integrated right side of bar, brand color
Mode toggle:     "Message" / "Note" tabs above the bar, small font
Attachments:     chips appear above the input bar
```

---

## Success Criteria

- [ ] All dialogs render with new border-radius, backdrop blur, and mobile slide-up
- [ ] Notification toasts have left-color-border and slide-in animation
- [ ] DateTime picker shows circular day selection with brand color
- [ ] Dropdown menus have rounded corners, shadow, and scale animation
- [ ] Many2many tags render as rounded pills with consistent close button
- [ ] Chatter composer is a single pill-shaped input bar
- [ ] Activity pills are color-coded by type/urgency
- [ ] Notebook tabs have brand-color bottom-border active state (not filled bg)
- [ ] Search panel section headers are 11px uppercase with branded checkboxes
- [ ] Messaging menu dropdown is 360px with avatar+preview message rows
- [ ] Mention list shows avatar + name + email with brand-tinted keyboard highlight
- [ ] Recipient tags are pill-shaped with avatar
- [ ] Calendar events are rounder and more vibrant
- [ ] Calendar dark mode uses CSS custom properties (no hardcoded colors)
- [ ] All components pass in both light and dark mode
- [ ] Ivy regression sign-off

---

## What's NOT in This Sprint

| Feature | Reason |
|---------|--------|
| Discuss / full messaging app | Separate concern — different layout entirely, added to Sprint 4 |
| Chatter attachment preview gallery | Over-scope |
| Video call UI | Not in core scope |
| Emoji picker redesign | Low priority, complex |
| Full calendar event edit dialog | Covered by dialog modernization (Task 1) generically |

---

## Agent Prompt

> Read `PROJECT_BRIEF.md`, then read `doc/sprint-2b-plan.md`. You are **Milo** (CSS/art director).
>
> Execute Sprint 2b: Global Components modernization.
>
> First: `git pull origin main && git checkout -b feature/sprint-2b`
>
> **Scope discipline**: This sprint is SCSS-only. No JS, no XML, no Python. Every change must use `var(--o-*)` CSS custom properties established in Sprint 0.
>
> Work systematically — do not skip to interesting tasks. Complete each phase fully before moving on. The system overlays (Phase 1) set the visual language for everything else.
>
> Update `doc/sprint-2b-progress.md` after each phase.
> When done: `git push origin feature/sprint-2b` and open a PR. Tag Ivy for QA.

---

## Progress Tracker

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Dialog / modal | ⬜ Not started | |
| 2 | Notifications / toasts | ⬜ Not started | |
| 3 | DateTime picker | ⬜ Not started | |
| 4 | Dropdown menus | ⬜ Not started | |
| 5 | Popovers / tooltips | ⬜ Not started | |
| 6 | Status/badge fields | ⬜ Not started | |
| 7 | Relational fields | ⬜ Not started | |
| 8 | Binary/image fields | ⬜ Not started | |
| 9 | Boolean/toggle fields | ⬜ Not started | |
| 10 | Chatter composer | ⬜ Not started | |
| 11 | Activity widget | ⬜ Not started | |
| 12 | Notebook / Tabs | ⬜ Not started | |
| 13 | Search bar & panel | ⬜ Not started | |
| 14 | Messaging menu (systray) | ⬜ Not started | |
| 15 | Mention list & recipients | ⬜ Not started | |
| 16 | Calendar view | ⬜ Not started | |
| 17 | Calendar dark mode | ⬜ Not started | |
| 18 | Regression QA | ⬜ Not started | |
