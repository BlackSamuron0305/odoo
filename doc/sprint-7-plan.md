# Sprint 7 — Mobile App: Core Screens

> Sprint Goal: Build the three highest-value mobile screens: Home Dashboard (activity feed + KPIs), CRM Pipeline (kanban with swipe-to-move), and Contacts (search + detail + actions).
> Branch: `feature/mobile-sprint-7`
> Depends on: Sprint 6 (auth shell, RPC client)

---

## Context

Sprint 6 delivered the authenticated shell. This sprint populates three of the five bottom tabs with real Odoo data. These are the screens a sales rep or manager uses daily. The goal is native-feeling performance (no web-view) and correct data from the Odoo API.

---

## Prioritized Task List

| # | Task | Owner | Description |
|---|------|-------|-------------|
| 1 | `useOdooQuery` hook | Nova | Generic React hook: `useOdooQuery(model, domain, fields, options)`. Returns `{ data, isLoading, error, refetch }`. Built on Zustand + `odoo-rpc/client.ts`. Handles pagination |
| 2 | Home screen — activity feed | Nova + Milo | Fetch `mail.activity` for current user. Show: today's activities list (icon + title + due time), mark-done swipe action, quick schedule button. Pull-to-refresh |
| 3 | Home screen — KPI tiles | Nova + Milo | 2×2 grid of KPI cards: My Opportunities (count + total value), Today's Meetings, Open Tasks, Messages Unread. Each taps to respective section |
| 4 | CRM Pipeline screen | Nova + Milo | Horizontal scroll kanban columns of `crm.lead`. Each column = stage. Cards show: partner name, expected revenue, days in stage, salesperson avatar. Smooth horizontal scroll with momentum |
| 5 | CRM opportunity swipe-to-move | Nova | Swipe right on card → move to next stage (with confirmation). Swipe left → mark won/lost dialog. Uses `react-native-gesture-handler` |
| 6 | CRM opportunity quick-create | Nova + Milo | FAB (floating action button) → bottom sheet form: Name, Customer, Expected Revenue, Stage. One-tap create. Immediate list refresh |
| 7 | Contacts list screen | Nova + Milo | Fetch `res.partner` with search. Virtual list (`FlashList` for performance). Row: avatar (initials fallback), name, job title, company. Section index on right side (A–Z) |
| 8 | Contact detail screen | Nova + Milo | Full-screen card: avatar (large), name, job, company, phone (tap-to-call), email (tap-to-mail), address (tap-to-maps), activity timeline (mini version) |
| 9 | Contact actions | Nova | Action sheet on contact detail: Call, Email, Send WhatsApp, Schedule Activity, View in Browser (opens `res.partner` form via deep link) |
| 10 | Skeleton loading states | Milo | Shimmer placeholder skeletons for all three screens. Matches the actual card/row shapes |
| 11 | Error & empty states | Milo | "No opportunities in this stage", "No contacts found", proper empty-state illustrations (use existing Odoo `empty_folder.svg`) |
| 12 | QA: Core screens on iOS + Android | Ivy | Test with real Odoo 19 server. File bugs as GitHub Issues. Performance: list scroll at 60fps |

---

## Work Schedule

### Phase 1: Data Layer & Home (Tasks 1–3)
- `useOdooQuery` hook
- Home screen: activities + KPI tiles
- **Checkpoint commit**: `sprint-7: home screen with activities and kpis`

### Phase 2: CRM Pipeline (Tasks 4–6)
- Pipeline kanban screen
- Swipe-to-move, quick-create
- **Checkpoint commit**: `sprint-7: crm pipeline screen with gestures`

### Phase 3: Contacts (Tasks 7–11)
- Contacts list + detail + actions
- Skeleton loaders, empty states
- Ivy QA
- **Final commit**: `sprint-7: core screens complete`

---

## API Endpoints / Models Used

| Model | Fields | Purpose |
|-------|--------|---------|
| `mail.activity` | `activity_type_id`, `summary`, `date_deadline`, `res_model`, `res_id`, `user_id` | Home activity feed |
| `crm.lead` | `name`, `partner_id`, `stage_id`, `expected_revenue`, `date_deadline`, `user_id`, `probability`, `kanban_state` | CRM pipeline |
| `crm.stage` | `name`, `sequence`, `probability` | Pipeline columns |
| `res.partner` | `name`, `email`, `phone`, `mobile`, `image_128`, `job_position`, `company_id`, `street`, `city` | Contacts |

---

## Screen Specifications

### Home Screen
```
Header:       "Good morning, {name}" + date
Section 1:    2×2 KPI tiles, tap to navigate
Section 2:    "Today's Activities" list
Section 3:    "Recent Messages" (count only, taps to messages tab)
Bottom:       Pull-to-refresh
```

### CRM Pipeline
```
Layout:       Horizontal FlatList of columns, each column = vertical FlatList of cards
Column width: screen_width * 0.85 (gives peek of next column)
Card:         Partner avatar + name, revenue, days-in-stage badge, salesperson initials
Gesture:      Swipe right = advance stage, swipe left = won/lost
FAB:          Bottom right, brand color, "+" icon
```

### Contacts
```
Search:       Persistent search bar at top
List:         FlashList for performance, section headers A–Z
Row height:   64px: avatar (40px) + name + job title
Detail:       Full screen, actions at bottom in a row (call, email, schedule)
```

---

## Success Criteria

- [ ] `useOdooQuery` correctly fetches, paginates, and caches Odoo data
- [ ] Home screen shows live activity data from Odoo
- [ ] KPI tiles show correct counts from the server
- [ ] CRM pipeline renders all stages with opportunities
- [ ] Swipe-to-move updates stage on the server and refreshes the UI
- [ ] Contact list scrolls smoothly at 60 fps with 500+ contacts (FlashList)
- [ ] Contact detail shows all fields and actions work (tap-to-call, tap-to-email)
- [ ] Skeleton loaders show during data fetch
- [ ] All screens work on iOS 15+ and Android 11+
- [ ] Ivy QA sign-off

---

## What's NOT in This Sprint

| Feature | Reason |
|---------|--------|
| Offline caching for CRM | Sprint 9 |
| Full CRM opportunity edit form | Sprint 8 (complex form) |
| Calendar screen content | Sprint 8 |
| Contact create/edit | Sprint 8 |
| Notification-driven navigation | Sprint 9 |

---

## Agent Prompt

> Read `PROJECT_BRIEF.md`, then read `doc/sprint-7-plan.md`. You are: **Nova** (RN frontend), **Milo** (design/NativeWind).
>
> Execute Sprint 7: Mobile App Core Screens.
>
> First: `git pull origin mobile-main && git checkout -b feature/mobile-sprint-7`
>
> Use `FlashList` (not FlatList) for all list screens — it's 10× faster. Install `@shopify/flash-list`.
> Use `react-native-gesture-handler` for swipe actions.
> All API calls go through `useOdooQuery` — no direct RPC calls in components.
>
> Target: 60fps scrolling on a mid-range Android device. Profile with Flipper before submitting PR.
>
> Update `doc/sprint-7-progress.md` after each phase.
> When done: push and open PR. Tag Ivy for QA.

---

## Progress Tracker

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | `useOdooQuery` hook | ⬜ Not started | |
| 2 | Home activity feed | ⬜ Not started | |
| 3 | Home KPI tiles | ⬜ Not started | |
| 4 | CRM pipeline screen | ⬜ Not started | |
| 5 | CRM swipe-to-move | ⬜ Not started | |
| 6 | CRM quick-create | ⬜ Not started | |
| 7 | Contacts list | ⬜ Not started | |
| 8 | Contact detail | ⬜ Not started | |
| 9 | Contact actions | ⬜ Not started | |
| 10 | Skeleton loaders | ⬜ Not started | |
| 11 | Empty states | ⬜ Not started | |
| 12 | QA pass | ⬜ Not started | |
