# Sprint 10 — QA, Testing & App Store Deployment

> Sprint Goal: Final QA pass on both the web UI upgrade and mobile app, automated test coverage, and submission to App Store and Google Play.
> Branch: `feature/sprint-10` (web) + `feature/mobile-sprint-10` (mobile)
> Depends on: All previous sprints complete + QA signed off

---

## Context

This is the final sprint. Both workstreams (web UI upgrade and mobile app) converge here for final QA, performance audits, and production release. No new features are added — only fixes for issues raised during QA.

---

## Prioritized Task List

### Web UI Upgrade — Final QA

| # | Task | Owner | Description |
|---|------|-------|-------------|
| W1 | Hoot test suite for new SCSS | Ivy + Nova | Write Hoot unit tests covering: CSS custom properties exist, dark mode toggle works, navbar renders at correct height, form sheet has correct shadow, kanban card has correct border-radius |
| W2 | Cross-browser final audit | Ivy | Chrome 120+, Firefox 120+, Safari 17+, Edge 120+. Mobile: iOS 15 Safari, Android Chrome 120. Document any remaining issues as GitHub Issues |
| W3 | Accessibility WCAG 2.1 AA audit (web) | Ivy + Milo | Run axe DevTools on: Login, main Kanban, Form view, List view, dark mode. Fix any AA violations (contrast, ARIA labels, focus indicators) |
| W4 | Performance audit | Ivy | Lighthouse performance on web: target 90+ performance score. Check for unnecessary repaints from new SCSS transitions |
| W5 | RTL (right-to-left) regression | Ivy | Test Arabic layout with new navbar, form, kanban, list. Odoo has full RTL support — must not be broken |
| W6 | Print layout regression | Ivy | Test print view of form and list. The `@media print` rules must render correctly after all SCSS changes |

### Mobile App — Final QA & Deployment

| # | Task | Owner | Description |
|---|------|-------|-------------|
| M1 | Maestro E2E test suite | Ivy | Write Maestro flows: login flow, CRM create opportunity, mark activity done, create calendar event, send message. Run on iOS simulator + Android emulator |
| M2 | Jest unit tests | Nova | Unit tests for: `useOdooQuery` hook, auth store, JSON-RPC client error handling, design token constants |
| M3 | EAS production build | Dash | `eas build --platform all --profile production`. Verify bundle size (target <50 MB). Sign with production certificates |
| M4 | TestFlight beta distribution | Dash | Submit iOS build to TestFlight. Invite internal testers (Ivy + stakeholders). 1-week beta period |
| M5 | Google Play Internal Testing | Dash | Upload Android AAB to Play Console internal testing track. Invite testers |
| M6 | Beta tester bug fixes | Nova + Milo | Fix all blocker and major bugs from TestFlight/Play internal feedback. No new features |
| M7 | App Store submission (iOS) | Dash | Prepare metadata: screenshots (6.7", 6.1", iPad), description, keywords, privacy policy URL. Submit for App Store review |
| M8 | Google Play submission | Dash | Prepare Play Store listing: feature graphic, screenshots, description. Submit for review |
| M9 | OTA update configuration | Dash | Configure `expo-updates` for over-the-air updates. Allows JS-only fixes without store re-submission. Emergency fix channel configured |

---

## Work Schedule

### Phase 1: Automated Tests (Tasks W1, M1, M2)
- Hoot tests for web CSS infrastructure
- Maestro E2E flows for mobile
- Jest unit tests
- **Checkpoint commit on each branch**: `sprint-10: automated test suite`

### Phase 2: Audits & Bug Fixes (Tasks W2–W6, M3–M6)
- Cross-browser, accessibility, performance, RTL, print audits
- EAS production build + beta distribution
- Bug fixes from audit and beta testers
- **Checkpoint commit**: `sprint-10: audit findings fixed`

### Phase 3: Store Submission (Tasks M7–M9)
- App Store + Play Store submissions
- OTA update config
- **Final commits**: `sprint-10: app store submission ready`

---

## App Store Metadata

### iOS App Store
```
App name:    Odoo Mobile
Subtitle:    ERP for iPhone & iPad
Category:    Business
Keywords:    odoo, erp, crm, business, contacts, calendar, pos
Description: [To be written by Kira — product designer]
Screenshots: Required: 6.7" (iPhone 15 Pro Max), 6.1" (iPhone 15), iPad Pro 12.9"
Privacy:     https://www.odoo.com/privacy
```

### Google Play
```
App name:     Odoo Mobile
Short desc:   Access your Odoo ERP on the go
Full desc:    [To be written by Kira]
Category:     Business
Content rating: Everyone
Screenshots:  Phone + 7" tablet + 10" tablet
```

---

## Success Criteria

### Web
- [ ] Hoot tests pass for CSS custom properties and component rendering
- [ ] Zero WCAG 2.1 AA violations on main views (axe DevTools)
- [ ] Lighthouse web performance score ≥ 90
- [ ] RTL layout not broken (Arabic test pass)
- [ ] Print layout renders correctly
- [ ] Cross-browser test pass (Chrome, Firefox, Safari, Edge)

### Mobile
- [ ] Maestro E2E: all 5 core flows pass on iOS + Android
- [ ] Jest unit tests: 80%+ coverage on hooks and stores
- [ ] EAS production build succeeds for both platforms
- [ ] App Store submission accepted (no metadata rejections)
- [ ] Google Play submission accepted
- [ ] OTA updates configured and tested
- [ ] Zero blocker bugs in Ivy's final QA report

---

## What's NOT in This Sprint

| Feature | Reason |
|---------|--------|
| New features of any kind | Feature freeze — Sprint 10 is QA + ship only |
| Performance micro-optimizations | Already addressed in Sprint 9 |
| Marketing site | Out of scope |
| Localization beyond existing Odoo translations | v2 |

---

## Agent Prompts

### Web QA Agent Prompt
> Read `PROJECT_BRIEF.md`, then read `doc/sprint-10-plan.md`. You are **Ivy** (QA).
>
> Execute the web UI upgrade final QA (Tasks W1–W6).
>
> First: `git pull origin main && git checkout -b feature/sprint-10-web-qa`
>
> Run the full accessibility audit with axe DevTools. Any WCAG AA violation is a blocker. File all bugs as GitHub Issues with label `bug severity:blocker` or `severity:major`.
>
> Write `doc/sprint-10-web-signoff.md` when complete.

### Mobile Deployment Agent Prompt
> Read `PROJECT_BRIEF.md`, then read `doc/sprint-10-plan.md`. You are **Dash** (DevOps) + **Ivy** (QA).
>
> Execute mobile app final deployment (Tasks M1–M9).
>
> Maestro tests must run in CI (GitHub Actions) on every push to `mobile-main`.
> `eas build` must use production profile with proper code signing.
> Do NOT submit to stores until Ivy's QA sign-off document exists.

---

## Progress Tracker

| # | Task | Owner | Status | Notes |
|---|------|-------|--------|-------|
| W1 | Hoot tests for SCSS | Ivy + Nova | ⬜ | |
| W2 | Cross-browser audit | Ivy | ⬜ | |
| W3 | WCAG 2.1 AA audit | Ivy + Milo | ⬜ | |
| W4 | Performance audit | Ivy | ⬜ | |
| W5 | RTL regression | Ivy | ⬜ | |
| W6 | Print layout regression | Ivy | ⬜ | |
| M1 | Maestro E2E tests | Ivy | ⬜ | |
| M2 | Jest unit tests | Nova | ⬜ | |
| M3 | EAS production build | Dash | ⬜ | |
| M4 | TestFlight beta | Dash | ⬜ | |
| M5 | Play internal testing | Dash | ⬜ | |
| M6 | Beta bug fixes | Nova + Milo | ⬜ | |
| M7 | App Store submission | Dash | ⬜ | |
| M8 | Play Store submission | Dash | ⬜ | |
| M9 | OTA updates config | Dash | ⬜ | |
