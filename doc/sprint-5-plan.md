# Sprint 5 — PWA Enhancement

> Sprint Goal: Upgrade the existing Odoo PWA from basic install prompt to a first-class installable app with offline support, push notifications, and a mobile-native bottom navigation bar.
> Branch: `feature/sprint-5`
> Depends on: Sprints 0–4 complete (design system in place)

---

## Context

Odoo 19 already has a PWA service (`pwa_service.js`), service worker, and install prompt. However, the offline experience is non-existent (blank screen), there are no push notifications, and the mobile web layout is a scaled-down version of the desktop UI rather than a mobile-native experience. This sprint elevates the PWA to match native app expectations.

Key files:
- `addons/web/static/src/service_worker.js` — needs offline cache strategy
- `addons/web/static/src/core/pwa/pwa_service.js` — install prompt logic
- `addons/web/static/src/core/pwa/install_prompt.*` — install UI
- `addons/web/controllers/` — web manifest endpoint
- `addons/bus/` — bus/notification service (for push notifications)

---

## Prioritized Task List

| # | Task | Owner | Description |
|---|------|-------|-------------|
| 1 | Offline shell cache | Nova + Sage | Update service worker to cache-first strategy for Odoo's static assets (JS bundles, CSS, fonts, icons). Network-first for API calls with 3 s timeout fallback to cache |
| 2 | Offline fallback screen | Nova + Milo | Design and implement a branded offline screen: Odoo logo, "You're offline" message, retry button. Cached in service worker |
| 3 | Web app manifest enhancement | Sage | Update manifest: `display: standalone`, `theme_color: #71639e`, proper `shortcuts` (CRM, Contacts, Calendar), `screenshots` for store-quality install |
| 4 | iOS icon + splash screen | Milo | Ensure all `apple-touch-icon` sizes correct, generate iOS splash screens (portrait + landscape) for common device sizes |
| 5 | Push notification infrastructure | Sage | Implement Web Push API: VAPID key generation, subscription endpoint in Odoo, store subscriptions in `res.users`. Backend sends notifications via existing `bus` module |
| 6 | Push notification UI | Nova | Permission request dialog (custom, not browser default prompt). Notification preference in user menu. Show notification count badge on PWA icon |
| 7 | Bottom navigation bar (mobile web) | Nova + Milo | On mobile (<md) in PWA standalone mode: show a bottom tab bar (Home, CRM, Contacts, Calendar, Menu). Fixed bottom, safe-area-inset aware. Hides on keyboard open |
| 8 | Pull-to-refresh | Nova | On mobile PWA: swipe down to refresh current view. Uses `TouchEvent` + CSS transform. Shows loading spinner. Native-feeling |
| 9 | Haptic feedback (where supported) | Nova | On mobile PWA: `navigator.vibrate()` on button press and on pull-to-refresh trigger. Respects `prefers-reduced-motion` |
| 10 | PWA install flow improvement | Milo + Nova | Replace generic install prompt with branded modal: app icon, name, "Add to home screen" benefits list, CTA button |
| 11 | QA: PWA audit | Ivy | Run Lighthouse PWA audit (target score: 90+). Test offline mode. Test install on iOS Safari and Android Chrome. Test push notifications |

---

## Work Schedule

### Phase 1: Offline & Manifest (Tasks 1–4)
- Service worker cache strategy
- Offline fallback screen
- Manifest enhancement + iOS splash
- **Checkpoint commit**: `sprint-5: offline support and enhanced manifest`

### Phase 2: Push Notifications (Tasks 5–6)
- Backend VAPID + subscription storage
- Frontend permission UI + notification display
- **Checkpoint commit**: `sprint-5: push notification infrastructure`

### Phase 3: Mobile UX (Tasks 7–11)
- Bottom nav bar
- Pull-to-refresh
- Haptic feedback
- Install flow polish
- Ivy Lighthouse audit
- **Final commit**: `sprint-5: pwa enhancement complete`

---

## Service Worker Cache Strategy

```
Static assets (JS, CSS, fonts, icons):
  → Cache-first, version-busted by Odoo asset hash

API calls (/web/dataset/*, /web/action/*):
  → Network-first, 3s timeout, fall back to last cached response
  → Show stale badge if serving cached data

Images (/web/image/*, /web/static/img/*):
  → Cache-first, 30-day expiry

Offline fallback:
  → /offline.html — always cached, served when network fails
```

## Bottom Navigation Bar Spec

```
Height:     56px + safe-area-inset-bottom
Tabs:       Home | CRM | Contacts | Calendar | ≡ Menu
Active tab: brand color icon + label, 2px top border
Inactive:   gray-500 icon, no label
Show:       only in PWA standalone mode (display-mode: standalone)
           + only on <md breakpoint
Hide:       when virtual keyboard is open (visual viewport height < 60% window height)
```

---

## Success Criteria

- [ ] Lighthouse PWA score ≥ 90
- [ ] App works in offline mode (shows cached data or offline screen — no blank white page)
- [ ] App installs on Android Chrome (Play Store-quality install sheet)
- [ ] App installs on iOS Safari (Add to Home Screen flow works)
- [ ] Push notification permission request uses custom branded dialog
- [ ] Push notifications delivered from Odoo server to installed PWA
- [ ] Bottom navigation bar shows on mobile in standalone mode
- [ ] Pull-to-refresh works on iOS and Android
- [ ] Web app manifest has shortcuts to CRM, Contacts, Calendar
- [ ] Ivy Lighthouse audit sign-off

---

## What's NOT in This Sprint

| Feature | Reason |
|---------|--------|
| Background sync (offline writes) | Complex conflict resolution — defer |
| Rich push notifications with images | Phase 2 mobile sprint |
| App Store PWA listing | Native app covers this (Sprint 6–10) |
| Custom PWA splash screen animation | Nice-to-have, not worth the complexity |

---

## Agent Prompt

> Read `PROJECT_BRIEF.md`, then read `doc/sprint-5-plan.md`. You are the dev team: **Nova** (frontend/PWA), **Sage** (backend/push infra), **Milo** (CSS/mobile UX).
>
> Execute Sprint 5: PWA Enhancement.
>
> First: `git pull origin main && git checkout -b feature/sprint-5`
>
> The bottom navigation bar must ONLY show in `display-mode: standalone` AND on mobile breakpoints. Use `@media (display-mode: standalone)` + `@media (max-width: md)` together.
>
> The service worker cache must NOT break Odoo's asset versioning system. Test thoroughly that hard reloads still get fresh assets.
>
> Update `doc/sprint-5-progress.md` after each phase.
> When done: `git push origin feature/sprint-5` and open a PR.

---

## Progress Tracker

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Offline shell cache | ⬜ Not started | |
| 2 | Offline fallback screen | ⬜ Not started | |
| 3 | Web manifest enhancement | ⬜ Not started | |
| 4 | iOS icon + splash | ⬜ Not started | |
| 5 | Push notification backend | ⬜ Not started | |
| 6 | Push notification UI | ⬜ Not started | |
| 7 | Bottom navigation bar | ⬜ Not started | |
| 8 | Pull-to-refresh | ⬜ Not started | |
| 9 | Haptic feedback | ⬜ Not started | |
| 10 | Install flow improvement | ⬜ Not started | |
| 11 | Lighthouse PWA audit | ⬜ Not started | |
