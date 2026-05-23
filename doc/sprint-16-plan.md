# Sprint 16 — Empty States, Error Pages & Feedback UI

> Sprint Goal: Design and implement a complete feedback UI system — empty states for all major views, error pages (404, 403, 500, offline), onboarding nudges, and consistent loading/success/failure patterns — so Odoo communicates clearly to users at every transition and edge case.
> Branch: `feature/sprint-16`
> Depends on: Sprint 11 (motion/skeleton), Sprint 12 (typography), Sprint 13 (Discuss)

---

## Context

Currently in Odoo, an empty list view shows a blank table. An empty kanban shows empty columns. A permission error shows a bare system dialog. There are no onboarding nudges when a user opens CRM for the first time with no deals. This "empty screen" problem makes the product feel broken or abandoned rather than guiding users to take action.

This sprint implements the **feedback layer** — the connective tissue between data states.

Key files to find and extend:
- `addons/web/static/src/views/no_content_helpers.xml` — existing empty state templates
- `addons/web/static/src/views/action_helper.js + action_helper.xml` — action-level helper
- `addons/web/static/src/core/errors/` — error handling components
- `addons/web/static/src/core/browser/router.js` — for 404 handling

---

## Prioritized Task List

| # | Task | Owner | Description |
|---|------|-------|-------------|
| 1 | Empty state component | Nova + Milo | Create OWL component: `addons/web/static/src/core/empty_state/empty_state.js + xml + scss`. Props: `icon` (class string), `title`, `description`, `actionLabel`, `onAction`. Renders: large icon (48px, brand-primary tinted), heading, subtext, optional CTA button. Centered vertically in parent container |
| 2 | Empty state illustrations | Milo | Create 8 SVG inline illustrations for common empty states (no CSS images — pure SVG embedded in OWL XML). Scenes: no records (empty box), no search results (magnifying glass), no messages (speech bubble), no activities (calendar), no notifications (bell), no files (folder), access denied (lock), server error (cloud with lightning). Brand colors, minimal line style |
| 3 | Empty state — List view | Nova | Replace the blank table with `EmptyState` component when `records.length === 0` and not loading. Use `no_content_helper` data from view arch if present, else generic icon + "No [model name] found" + "Create one" button (if user has create access) |
| 4 | Empty state — Kanban view | Nova | When all kanban columns are empty (filtered/no records): overlay the kanban area with `EmptyState`. Do not show empty columns — collapse them. Show "No [model name] match your filters" with "Clear filters" action |
| 5 | Empty state — Form view (new record) | Nova | When opening a new record form (no ID), show a brief "Getting started" banner at the top of the form for configurable models (those with `onboarding` action defined). Banner: dismissible, brand-tinted, with link to documentation |
| 6 | Empty state — Discuss inbox | Nova | When Discuss inbox is empty: centered illustration (bell icon) with "You're all caught up!" heading and "No new notifications" subtext. Brand-tinted illustration, celebratory tone |
| 7 | Empty state — Search results | Nova | When search produces 0 results: `EmptyState` with magnifying glass illustration, "No results for '[query]'", suggestions: "Try a different keyword" + "Clear search" button |
| 8 | Error page — 404 Not Found | Nova + Milo | Create `addons/web/static/src/core/errors/not_found_page.js + xml + scss`. Full-page layout: large `404` number in brand color, "Page not found" heading, "The page you're looking for doesn't exist or has been moved." body, "Go to Home" button (brand primary). Log error to console |
| 9 | Error page — 403 Access Denied | Nova + Milo | Create `access_denied_page.js + xml + scss`. Lock icon illustration, "You don't have permission to view this" heading, "Contact your administrator if you think this is a mistake." body, "Go Back" button |
| 10 | Error page — 500 Server Error | Nova + Milo | Create `server_error_page.js + xml + scss`. Cloud/lightning illustration, "Something went wrong" heading, "Our team has been notified. Try refreshing the page." body, "Refresh" + "Go Home" buttons. Include request ID if available (for support) |
| 11 | Error page — Offline | Nova + Milo | Create `offline_page.js + xml + scss`. Disconnected plug illustration, "You're offline" heading, "Check your internet connection." body, auto-retry indicator (Sprint 11 animation: pulsing dot). Auto-redirect when connection restored (using `useNetworkStatus` pattern from mobile Sprint 9 adapted for web) |
| 12 | Error boundary component | Nova | OWL equivalent of React ErrorBoundary: `error_boundary.js + xml`. Wraps view controllers. On JS error: shows `ServerError` page instead of blank white screen. Reports error to server error service |
| 13 | Toast / feedback message improvements | Milo | Add two new notification types: `loading` (spinner + message, no auto-dismiss) and `progress` (progress bar 0–100%). Used for bulk operations: "Importing 45/200 records..." with animated progress bar. Style matches Sprint 2b notification design |
| 14 | Onboarding banner component | Nova + Milo | Create `onboarding_banner.js + xml + scss`. A dismissible info bar at the top of a view (below control panel). Uses: "You're viewing your first CRM pipeline →  Watch the tutorial". Brand-tinted background, close button, persists dismissed state to `localStorage` per banner ID |
| 15 | Confirmation dialog pattern | Milo | Standardize destructive action confirmation dialogs. "Delete 5 records?" dialog: warning icon (amber), record count in bold, consequence text in gray, "Cancel" (secondary) + "Delete" (danger red) buttons. Match Sprint 2b dialog style. Apply to: bulk delete, record delete, sign out |
| 16 | Operation progress dialog | Milo | Long-running operations (bulk email send, export, import): modal with progress bar, animated (Sprint 11), operation name, percentage + count. Cancel button. On completion: auto-dismiss after 2s + success toast |
| 17 | Dark mode — feedback components | Milo | All new components (empty states, error pages, banners, progress dialogs) must fully support dark mode. SVG illustrations: use `currentColor` for lines, CSS custom property fills |
| 18 | Regression QA | Ivy | Test: navigate to nonexistent URL (404), open record with no access (403), trigger a server error, go offline. Check all major views in empty state. Trigger a progress dialog with a bulk export. Verify all dark mode variants |

---

## Work Schedule

### Phase 1: Empty State Component + Illustrations (Tasks 1–2)
- Core component + all 8 SVG illustrations
- **Checkpoint commit**: `sprint-16: empty state component and illustrations`

### Phase 2: View Integration (Tasks 3–7)
- Wire EmptyState into List, Kanban, Form, Discuss, Search
- **Checkpoint commit**: `sprint-16: empty states integrated in all major views`

### Phase 3: Error Pages (Tasks 8–12)
- 404, 403, 500, Offline pages + ErrorBoundary
- **Checkpoint commit**: `sprint-16: error pages and error boundary`

### Phase 4: Operation Feedback (Tasks 13–16)
- Progress toasts, onboarding banner, confirmation dialog, progress modal
- **Checkpoint commit**: `sprint-16: operation feedback components`

### Phase 5: Dark Mode & QA (Tasks 17–18)
- **Final commit**: `sprint-16: dark mode and QA signoff`

---

## Design Specifications

### Empty State Component
```
Container:    display: flex; flex-direction: column; align-items: center;
              justify-content: center; min-height: 300px; padding: 48px 24px
Icon:         48px × 48px, color: var(--o-brand-primary) at 70% opacity
Title:        h3 from Sprint 12 scale, margin-top: 16px, text-align: center
Description:  14px, var(--o-gray-500), margin-top: 8px, max-width: 360px, text-align: center
CTA button:   brand primary, margin-top: 24px
```

### Error Page Layout
```
Full viewport: display: flex; align-items: center; justify-content: center
Content box:   max-width: 480px, text-align: center
Error code:    72px, font-weight: 800, color: var(--o-brand-primary) at 20% opacity (background effect)
Heading:       h2 from Sprint 12
Body:          14px, var(--o-gray-500), margin: 12px 0 28px
```

---

## Success Criteria

- [ ] `EmptyState` OWL component created with all 8 SVG illustrations
- [ ] List view shows empty state (not blank table) when no records
- [ ] Kanban view shows empty state (not empty columns) when filtered to 0 records
- [ ] Discuss inbox shows celebratory empty state
- [ ] Search 0-results shows empty state with clear action
- [ ] 404 page renders for unknown routes
- [ ] 403 page renders for access denied
- [ ] 500 page renders for server errors (via ErrorBoundary)
- [ ] Offline page renders + auto-reconnects
- [ ] `loading` and `progress` toast notification types work
- [ ] Onboarding banner is dismissible and persists dismiss state
- [ ] Destructive confirmations use warning icon + red button pattern
- [ ] All new components support dark mode
- [ ] Ivy QA sign-off

---

## What's NOT in This Sprint

| Feature | Reason |
|---------|--------|
| Animated Lottie illustrations | SVG inline is sufficient and lighter weight |
| Per-module onboarding tours | Product feature, not visual layer |
| Error reporting to Sentry/external | Infrastructure change, not in scope |
| Empty state content copy | Product/Kira provides; use placeholders |
| Map view empty state | Map view sprint not scheduled yet |

---

## Agent Prompt

> Read `PROJECT_BRIEF.md`, then read `doc/sprint-16-plan.md`. You are the dev team: **Milo** (CSS/art director) and **Nova** (frontend engineer).
>
> Execute Sprint 16: Empty States, Error Pages & Feedback UI.
>
> First: `git pull origin 19.0 && git checkout -b feature/sprint-16`
>
> **Nova** leads component architecture (tasks 1, 3–12). **Milo** leads illustration design and all styling (tasks 2, 13–15, 17). Overlap on tasks 1, 8–11 (pair on these).
>
> The SVG illustrations (Task 2) are critical — they define the tone. Keep them minimal: single-color line art using brand colors. Use `currentColor` for dark mode compatibility. Max complexity: 20 SVG elements per illustration.
>
> The empty state component (Task 1) is a foundation — get it right before wiring into views (Tasks 3–7). Test it in isolation first.
>
> Commit after each phase. Update `doc/sprint-16-progress.md` after each commit.
> When done: `git push origin feature/sprint-16` and open a PR. Tag Ivy for QA.

---

## Progress Tracker

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Empty state component | ⬜ Not started | |
| 2 | Empty state illustrations | ⬜ Not started | |
| 3 | Empty state — List view | ⬜ Not started | |
| 4 | Empty state — Kanban view | ⬜ Not started | |
| 5 | Empty state — Form view (new record) | ⬜ Not started | |
| 6 | Empty state — Discuss inbox | ⬜ Not started | |
| 7 | Empty state — Search results | ⬜ Not started | |
| 8 | Error page — 404 | ⬜ Not started | |
| 9 | Error page — 403 | ⬜ Not started | |
| 10 | Error page — 500 | ⬜ Not started | |
| 11 | Error page — Offline | ⬜ Not started | |
| 12 | Error boundary component | ⬜ Not started | |
| 13 | Toast / feedback improvements | ⬜ Not started | |
| 14 | Onboarding banner component | ⬜ Not started | |
| 15 | Confirmation dialog pattern | ⬜ Not started | |
| 16 | Operation progress dialog | ⬜ Not started | |
| 17 | Dark mode — feedback components | ⬜ Not started | |
| 18 | Regression QA | ⬜ Not started | |
