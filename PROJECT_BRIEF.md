# PROJECT_BRIEF.md — Odoo UI Upgrade & Mobile App

> Last updated: 2026-05-22 | Sprint 0 | Status: Planning

---

## 1. Project Overview

This project delivers two parallel workstreams on top of the existing **Odoo 19.0** ERP codebase:
(1) a full **UI modernization** that refreshes the visual design language while keeping all functionality, processes, brand colors, logos, and existing OWL/Bootstrap architecture intact; and
(2) a new **cross-platform mobile application** (React Native / Expo) that exposes the most-used Odoo business flows as a native iOS + Android experience, consuming the existing Odoo JSON-RPC API.

Target users are Odoo end-users (employees, sales reps, field workers) who need a modern, fast, mobile-friendly interface for daily operations.

---

## 2. Concept / Product Description

### 2a — UI Upgrade (Web)

The goal is to make Odoo 19 look and feel like a contemporary enterprise SaaS product (comparable to Linear, Notion, or Vercel's design aesthetic) **without replacing** the underlying OWL component framework or breaking any existing Odoo module.

What changes:
- **Bootstrap 5.2 → 5.3**: unlocks CSS custom properties for color modes (dark/light), fewer SCSS variable overrides needed
- **Design tokens**: centralized CSS custom properties layer wrapping the existing `$o-*` SCSS variables
- **Typography**: tighten the type scale, add a modern `font-feature-settings`, refine heading weights
- **Spacing & radius**: slightly more generous whitespace, rounder corners (`border-radius: 8px` default, `6px` small)
- **Shadows**: replace hard `box-shadow` with layered, soft elevation system
- **Navbar**: slim height (40 px), frosted-glass on scroll, smooth active-indicator animation
- **Sidebar / App Menu**: icon-rail sidebar (collapsible), replacing the overlay burger on desktop
- **Forms**: floating labels on inputs, cleaner sheet background, sticky action bar
- **Kanban**: card elevation on hover, smoother drag, color-coded progress bars
- **Lists**: zebra-free design, row hover highlight, inline quick-edit
- **Dark mode**: proper CSS custom properties–based dark scheme (color-scheme: dark)
- **Micro-animations**: OWL `Transition` components, respects `prefers-reduced-motion`
- **Accessibility**: WCAG 2.1 AA contrast audit on all components

What does NOT change:
- OWL component structure and JS logic
- All `$o-brand-*` / `$o-enterprise-*` color values (preserved exactly)
- All logos, icons, and image assets
- All Odoo module business logic
- URL structure, menu hierarchy, access rights

### 2b — Mobile App (React Native)

A native iOS + Android app built with **React Native (Expo SDK 52+)** that connects to any Odoo 19 instance via JSON-RPC.

Key screens:
1. **Login / Server Setup** — URL, database, credentials; remember server
2. **Home Dashboard** — Activity feed, quick-access tiles per user role
3. **CRM Pipeline** — Kanban columns of opportunities, swipe to move stages
4. **Contacts** — Search/filter partners, call/email tap actions
5. **Calendar** — Monthly + agenda view, create/edit events
6. **Activities** — Today's to-dos, mark done, schedule new
7. **Messages / Chatter** — Inbox, compose, attachment upload
8. **Point of Sale (lite)** — Session open/close, quick order entry
9. **Settings** — Profile, notifications, dark/light mode toggle, language

Design tokens shared with the web upgrade (same color values, same border-radius, same spacing scale).

---

## 3. Tech Stack

### Web (UI Upgrade) — **NOT React. Framework stays OWL.**

> **Why not React/Vue/Svelte?**
> Odoo uses **OWL (Odoo Web Library)** — a proprietary reactive component framework built and maintained by Odoo S.A. It is deeply integrated into 300+ modules, the asset bundler, the templating system (QWeb/XML), and the ORM field widget system. Replacing OWL with React would mean rewriting every module from scratch — years of work, not a UI upgrade. The upgrade here is **purely visual (SCSS + CSS Custom Properties)** — the OWL component tree, all JS logic, all XML templates remain unchanged.

- **Frontend framework**: OWL (Odoo Web Library) — **keep as-is, never replace**
- **CSS framework**: Bootstrap 5.3 (upgrade from 5.2 — unlocks CSS custom properties color mode API)
- **Styling**: SCSS, `$o-*` SCSS variables + new `--o-*` CSS custom properties layer on top
- **Icons**: Odoo UI Icons (`oi`) + FontAwesome 4 — keep as-is
- **Build**: Odoo asset bundler (proprietary — no Webpack/Vite)
- **Testing**: Hoot (Odoo's built-in test runner, already in repo)
- **What changes**: Only `.scss` files and one new `tokens/tokens.json` file + build script

### Mobile App
- **Framework**: React Native via **Expo SDK 52+**
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **State**: Zustand (lightweight, no boilerplate)
- **API**: Odoo JSON-RPC client (custom hook wrapping `fetch`)
- **UI components**: NativeWind (Tailwind CSS for RN) + custom Odoo-branded components
- **Charts**: Victory Native
- **Testing**: Jest + React Native Testing Library + Maestro (E2E)
- **CI/CD**: EAS Build (Expo Application Services) + GitHub Actions
- **Distribution**: App Store (iOS) + Google Play Store (Android)

### Shared
- **Design tokens**: `tokens/` folder — JSON → SCSS (web) + TS constants (mobile)
- **Brand colors**: Preserved — `#71639e` (community), `#714B67` (enterprise), `#017e84` (action)

---

## 4. Architecture

```
┌───────────────────────────────────────────────────────────────────────┐
│                         Odoo 19 Server (Python)                       │
│  ┌──────────────────────┐   ┌──────────────────────────────────────┐  │
│  │   ORM / Business     │   │   JSON-RPC API  (/web/dataset/call_kw│  │
│  │   Logic (models/)    │   │    /web/dataset/search_read, etc.)   │  │
│  └──────────────────────┘   └──────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │   PostgreSQL 13+                                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────┘
          ▲  JSON-RPC/HTTPS                  ▲  JSON-RPC/HTTPS
          │                                  │
┌─────────┴──────────────┐       ┌───────────┴──────────────────────────┐
│   Odoo Web Client       │       │   React Native Mobile App            │
│  (addons/web/static/)  │       │  (mobile-app/ folder, new repo)      │
│                         │       │                                      │
│  OWL Components         │       │  Expo Router (screens/)             │
│  Bootstrap 5.3 SCSS     │       │  Zustand stores (stores/)           │
│  $o-* design tokens     │       │  JSON-RPC hooks (api/)              │
│  Service Worker (PWA)   │       │  NativeWind (design tokens)         │
└─────────────────────────┘       └──────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│   Shared Design Tokens (tokens/)            │
│   tokens.json → SCSS vars + TS constants    │
└─────────────────────────────────────────────┘
```

---

## 5. Key Files Map

| Area | Path | Contents |
|------|------|----------|
| Primary SCSS vars | `addons/web/static/src/scss/primary_variables.scss` | All `$o-*` brand/color tokens |
| Secondary SCSS vars | `addons/web/static/src/scss/secondary_variables.scss` | Derived tokens, color palettes |
| Bootstrap overrides | `addons/web/static/src/scss/bootstrap_overridden.scss` | BS variable overrides |
| Navbar component | `addons/web/static/src/webclient/navbar/` | Template, SCSS, JS, variables |
| Webclient layout | `addons/web/static/src/webclient/webclient_layout.scss` | Root layout flex rules |
| Webclient styles | `addons/web/static/src/webclient/webclient.scss` | Global component styles |
| Form view | `addons/web/static/src/views/form/` | Form controller, renderer, SCSS |
| Kanban view | `addons/web/static/src/views/kanban/` | Kanban controller, renderer, SCSS |
| List view | `addons/web/static/src/views/list/` | List controller, renderer, SCSS |
| PWA service | `addons/web/static/src/core/pwa/pwa_service.js` | PWA install prompt logic |
| Bottom sheet | `addons/web/static/src/core/bottom_sheet/` | Mobile bottom-sheet component |
| Bootstrap lib | `addons/web/static/lib/bootstrap/` | Bootstrap 5 source (scss + dist) |
| OWL lib | `addons/web/static/lib/owl/` | OWL runtime |
| Odoo release | `odoo/release.py` | Version info (19.0.0.final) |
| POS static | `addons/point_of_sale/static/src/` | POS app (OWL-based) |
| Web manifest | `addons/web/` | PWA manifest (controllers) |
| Mobile app | `mobile-app/` *(new)* | React Native / Expo project |
| Design tokens | `tokens/` *(new)* | Shared JSON design tokens |
| Sprint docs | `doc/sprint-N-plan.md` | Plans, progress, done files (in existing `doc/` directory) |

---

## 6. Team Roles

| Agent | Name | Role |
|-------|------|------|
| Producer | **Remy** | Sprint plans, coordination, merging PRs, issue triage |
| Product Designer | **Kira** | UX flows, mobile screen specs, interaction design |
| Art / CSS Director | **Milo** | SCSS, design tokens, animations, dark mode, accessibility |
| Frontend Engineer | **Nova** | OWL component upgrades, mobile RN screens, JS logic |
| Backend Engineer | **Sage** | JSON-RPC API layer, mobile auth, server-side manifest |
| QA Engineer | **Ivy** | E2E tests (Hoot + Maestro), bug filing, sign-off |
| DevOps Engineer | **Dash** | EAS builds, GitHub Actions, App Store pipeline |

---

## 7. Sprint Status

| Sprint | Name | Status | Scope |
|--------|------|--------|-------|
| 0 | Design Tokens & Bootstrap 5.3 Upgrade | ⬜ Planned | Shared tokens file, BS 5.3 swap, CSS custom properties baseline |
| 1 | Navbar & App Switcher Modernization | ⬜ Planned | Slim navbar, icon-rail sidebar, frosted glass, animations |
| 2 | Form Views Modernization | ⬜ Planned | Floating labels, sticky action bar, sheet redesign |
| 2b | Global Components: Dialogs, Fields, Chatter, Calendar | ⬜ Planned | All shared UI components across every view |
| 3 | List & Kanban Modernization | ⬜ Planned | Card elevation, row hover, drag polish, control panel |
| 4 | Dashboards, Graphs, Dark Mode & Discuss | ⬜ Planned | Dark mode full pass, chart theming, dashboard tiles, Discuss/Inbox |
| 5 | PWA Enhancement | ⬜ Planned | Offline support, push notifications, bottom nav bar |
| 5b | Point of Sale App Modernization | ⬜ Planned | POS is a standalone OWL app — separate full SCSS pass |
| 6 | Mobile App — Foundation | ⬜ Planned | Expo project, auth, JSON-RPC client, navigation shell |
| 7 | Mobile App — Core Screens | ⬜ Planned | Dashboard, CRM, Contacts, Calendar |
| 8 | Mobile App — Business Screens | ⬜ Planned | Activities, Messages, POS lite, Settings |
| 9 | Mobile App — Polish & Accessibility | ⬜ Planned | Animations, dark mode, a11y, offline |
| 10 | QA, Testing & App Store Deployment | ⬜ Planned | Hoot tests, Maestro E2E, EAS build, store submission |

### Out of Scope (v2)

| Area | Reason |
|------|--------|
| **Website Builder** (`addons/html_builder/`, `addons/html_editor/`) | Semi-independent product. Full WYSIWYG canvas with its own design system. Requires dedicated multi-sprint effort |
| **Spreadsheet** (`addons/spreadsheet/`) | Canvas-based renderer, own Odoo-Spreadsheet library. Not a CSS/SCSS problem |
| **Portal / eCommerce public pages** (`addons/portal/`, `addons/website_sale/`) | Public-facing, different audience, different design system (frontend vs backend) |
| **Live Chat embed widget** (`addons/im_livechat/`) | Embedded widget with strict CSS isolation requirements |
| **Self-order / kiosk** (`addons/pos_self_order/`) | Separate POS module — v2 after Sprint 5b |
| **Restaurant table map** (`addons/pos_restaurant/`) | Specialized POS module — v2 |

---

## 8. Current State (rewrite every sprint)

**What works (baseline Odoo 19):**
- Full ERP functionality across all 300+ modules
- OWL-based UI: Form, List, Kanban, Calendar, Graph, Pivot views
- Bootstrap 5 responsive layout with touch device detection
- Basic PWA support (service worker, install prompt, iOS/Android icons)
- Bottom sheet component for mobile interactions
- Navbar with burger menu sidebar for mobile
- Dark mode infrastructure (color-scheme variable exists)

**What doesn't exist yet:**
- Modern CSS custom properties design token layer
- Bootstrap 5.3 (currently 5.2.x)
- Icon-rail sidebar navigation on desktop
- Dark mode fully implemented across all components
- Native mobile app
- Shared design token file (web ↔ mobile)
- Offline-capable PWA with push notifications
- Bottom navigation bar for mobile web

**What's next (Sprint 0):**
- Audit and document all existing `$o-*` SCSS variables
- Create `tokens/tokens.json` as shared source of truth
- Upgrade Bootstrap library to 5.3
- Add CSS custom properties baseline to `primary_variables.scss`

---

## 9. Security Rules

1. **Secrets live in environment variables only** — never hardcoded in code or git.
2. **Mobile app**: Odoo credentials stored in device Keychain (iOS) / Keystore (Android) via `expo-secure-store`. Never in AsyncStorage unencrypted.
3. **JSON-RPC**: All calls over HTTPS in production. Session cookie managed by the mobile app's `fetch` instance.
4. **CSRF**: Odoo's built-in CSRF token handling respected in all API calls.
5. **No `sudo()` escalations**: Mobile API calls respect the logged-in user's access rights exactly.
6. **App signing**: EAS Build handles iOS provisioning profiles and Android keystore. Keys stored in EAS secrets, not in repo.
7. **No third-party analytics**: No user behavior tracking without explicit consent.

---

## 10. How to Run Locally

### Web (Odoo)
```bash
# Install Python deps
pip install -r requirements.txt

# Start Odoo server
python odoo-bin -d <your_db> --addons-path=addons

# Access at http://localhost:8069
```

### Mobile App (Sprint 6+)
```bash
cd mobile-app
npm install
cp .env.example .env       # fill in ODOO_URL
npx expo start             # starts Metro bundler
# Scan QR with Expo Go app on your device
```

### Design Tokens
```bash
cd tokens
npm install
npm run build              # generates SCSS + TS outputs
```

---

## 11. How to Deploy

### Web (Odoo)
- Standard Odoo deployment (WSGI via Gunicorn, Nginx reverse proxy)
- No changes to deployment pipeline from the UI upgrade — only static assets change
- Static assets are compiled by Odoo's asset bundler on first request or via `odoo-bin --dev=assets`

### Mobile App
```bash
cd mobile-app
eas build --platform all --profile production   # builds iOS + Android
eas submit --platform all                       # submits to stores
```
- GitHub Actions CI runs on every PR: lint, type-check, Jest tests
- EAS builds triggered on merge to `main`
- TestFlight (iOS) and Internal Test Track (Android) for QA before store release

---

## 12. Cross-Chat Handoff Protocol

Every sprint chat must do these before finishing:

1. Write `doc/sprint-N-done.md` — what was built, what's not done, what needs manual setup, files changed/created
2. Update `PROJECT_BRIEF.md`: Section 7 (mark sprint done) + Section 8 (rewrite current state)
3. Commit all changes: `sprint-N: <summary>`

Context recovery prompt:
```
Read PROJECT_BRIEF.md and doc/sprint-N-plan.md (check progress tracker at the bottom).
You are the dev team (Nova + Milo + Sage). Continue from where it left off.
```

---

## 13. Bug & Fix Tracking

Bugs are tracked as **GitHub Issues** on the repo. Single source of truth for all teams.

**For QA (Ivy):** File bugs as GitHub Issues with labels (`bug`, `severity:blocker`, `severity:major`, `severity:minor`). Include: component, steps to reproduce, expected vs actual. When no blockers: write `docs/qa/sprint-N-signoff.md`.

**For Dev Team:** Check GitHub Issues before starting work. Fix blockers and majors before polish. Use closing keywords in commits: `fix: description (Fixes #42)`.

**For UI bugs:** label with `ui`, `mobile`, or `web` as appropriate.

**For feature ideas:** add to `docs/ideas-backlog.md`.

**Label taxonomy:**
- `bug` + `severity:blocker` — blocks sprint merge
- `bug` + `severity:major` — fix before next sprint
- `bug` + `severity:minor` — fix when possible
- `ui` — visual/styling issue
- `mobile` — mobile app issue
- `web` — web client issue
- `a11y` — accessibility issue
- `perf` — performance issue

---

## 14. Multi-Repo Setup

Each team works in a **separate VS Code window with its own clone**:

```bash
git clone https://github.com/BlackSamuron0305/odoo odoo-producer    # Remy
git clone https://github.com/BlackSamuron0305/odoo odoo-dev         # Nova/Milo/Sage
git clone https://github.com/BlackSamuron0305/odoo odoo-qa          # Ivy
```

**Branch strategy:**
- `main` — protected, Remy merges here
- `feature/sprint-N` — dev team works here
- `feature/qa-N` — QA verification branch
- `feature/mobile-sprint-N` — mobile app sprints

**Rules:**
- Regular merge only (never squash, never rebase feature branches)
- PR required for every merge to main
- QA sign-off required before Remy merges critical UI sprints
- One PR per sprint; checkpoint commits within the sprint branch

**Mobile app repo** (Sprint 6+): separate repo `odoo-mobile-app` to keep the Odoo core repo clean.
