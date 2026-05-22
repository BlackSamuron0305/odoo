# Sprint 8 — Mobile App: Business Screens

> Sprint Goal: Build the Calendar, Activities scheduler, Messages/Chatter, and a lite POS session screen — completing the core business workflow coverage.
> Branch: `feature/mobile-sprint-8`
> Depends on: Sprint 7 (core screens, useOdooQuery)

---

## Prioritized Task List

| # | Task | Owner | Description |
|---|------|-------|-------------|
| 1 | Calendar screen — month view | Nova + Milo | `calendar.event` fetched for current month. Monthly grid view (RN `react-native-calendars` or custom). Events shown as colored dots on day cells. Tap day → event list for that day |
| 2 | Calendar screen — agenda view | Nova + Milo | Toggle button: switch to agenda (list) view. Events grouped by day. Each event: title, time range, attendees avatars, location |
| 3 | Calendar event detail & edit | Nova | Tap event → detail sheet. Fields: title, start/end datetime, attendees, location, description. Edit button → inline edit bottom sheet. Save via `calendar.event` write |
| 4 | Calendar event quick-create | Nova + Milo | FAB → bottom sheet: Title, Date + Time, Duration, Attendees (Many2one search). One-tap create |
| 5 | Activities screen | Nova + Milo | Dedicated "Activities" tab content: grouped by model (Leads, Contacts, etc.). Each activity: icon, summary, due date, overdue badge. Mark done → API call + refresh |
| 6 | Schedule activity bottom sheet | Nova + Milo | Reusable bottom sheet: Activity Type picker, Summary, Due Date, Assigned To, Note. Used from Home, CRM, Contacts, Calendar |
| 7 | Messages / Inbox screen | Nova + Milo | Fetch `mail.message` for current user's inbox. List: sender avatar, subject preview, timestamp, unread badge. Pull-to-refresh |
| 8 | Message thread view | Nova + Milo | Tap message → thread view showing chatter. Displays messages + note entries + activity logs. Compose reply at bottom (text only + send). Attachments shown as file chips |
| 9 | POS lite — session overview | Nova + Milo | For POS users: active sessions list, open/close session button, basic order summary. Fetches `pos.session`, `pos.order`. No full order entry (too complex for v1) |
| 10 | POS lite — quick order entry | Nova + Milo | Simple product grid (fetches `product.product` from active POS config). Add to order, set quantity, select payment, post order. Minimal but functional |
| 11 | Deep link handling | Nova | `odoo://app/crm/lead/42` → opens CRM opportunity detail. `odoo://app/contacts/partner/7` → opens contact. Uses Expo Router deep link handling |
| 12 | QA: business screens | Ivy | Full flow test: create calendar event, mark activity done, send message reply, open/close POS session |

---

## Work Schedule

### Phase 1: Calendar (Tasks 1–4)
- Month + agenda views, event detail, quick-create
- **Checkpoint commit**: `sprint-8: calendar screen complete`

### Phase 2: Activities & Messages (Tasks 5–8)
- Activities tab, schedule sheet, inbox, thread view
- **Checkpoint commit**: `sprint-8: activities and messages complete`

### Phase 3: POS Lite & Deep Links (Tasks 9–12)
- POS session + quick order entry
- Deep link routing
- Ivy QA
- **Final commit**: `sprint-8: business screens complete`

---

## API Models Used

| Model | Purpose |
|-------|---------|
| `calendar.event` | Calendar events |
| `res.partner` (attendees) | Event attendees |
| `mail.activity` | Activities |
| `mail.activity.type` | Activity types |
| `mail.message` | Inbox messages |
| `mail.thread` | Chatter thread |
| `pos.session` | POS sessions |
| `pos.order` | POS orders |
| `product.product` | POS product grid |

---

## Success Criteria

- [ ] Calendar shows events for current month, switches to agenda view
- [ ] New calendar event created and appears immediately
- [ ] Activity marked done via swipe action
- [ ] Schedule activity bottom sheet works from all entry points (Home, CRM, Contacts)
- [ ] Messages inbox loads and shows unread count badge
- [ ] Reply sent from thread view appears in chatter
- [ ] POS session opens/closes correctly
- [ ] Deep links navigate to correct screens
- [ ] Ivy QA sign-off

---

## What's NOT in This Sprint

| Feature | Reason |
|---------|--------|
| Full POS order management | Scope too large for v1 — basic session only |
| Video calls / VoIP | Not in Odoo core scope |
| Attachment upload from mobile camera | Sprint 9 (polish) |
| Multi-company calendar | v2 feature |

---

## Agent Prompt

> Read `PROJECT_BRIEF.md`, then read `doc/sprint-8-plan.md`. You are: **Nova** (RN frontend), **Milo** (design).
>
> Execute Sprint 8: Mobile App Business Screens.
>
> First: `git pull origin mobile-main && git checkout -b feature/mobile-sprint-8`
>
> The "Schedule Activity" bottom sheet (Task 6) must be a reusable component used from 4+ places. Build it once in `components/ScheduleActivitySheet.tsx`.
>
> POS lite is intentionally minimal — do not over-scope. Open/close session + simple order entry only.
>
> Update `doc/sprint-8-progress.md` after each phase.
> When done: push and open PR. Tag Ivy for QA.

---

## Progress Tracker

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Calendar month view | ⬜ Not started | |
| 2 | Calendar agenda view | ⬜ Not started | |
| 3 | Event detail & edit | ⬜ Not started | |
| 4 | Event quick-create | ⬜ Not started | |
| 5 | Activities screen | ⬜ Not started | |
| 6 | Schedule activity sheet | ⬜ Not started | |
| 7 | Messages inbox | ⬜ Not started | |
| 8 | Message thread view | ⬜ Not started | |
| 9 | POS session overview | ⬜ Not started | |
| 10 | POS quick order | ⬜ Not started | |
| 11 | Deep link handling | ⬜ Not started | |
| 12 | QA pass | ⬜ Not started | |
