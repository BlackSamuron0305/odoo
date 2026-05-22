# Sprint 6 — Mobile App: Foundation & Architecture

> Sprint Goal: Bootstrap the React Native / Expo project, establish the architecture, implement authentication against a live Odoo server, and deliver a working navigation shell with the Odoo design tokens applied.
> Branch: `feature/mobile-sprint-6` (separate repo: `odoo-mobile-app`)

---

## Context

This sprint creates the mobile app repository from scratch. The web UI sprints (0–5) run in the Odoo core repo. The mobile app lives in a **separate GitHub repository** (`odoo-mobile-app`) to keep the Odoo core clean. This sprint delivers a working authenticated shell — not yet all screens, but the scaffolding that all subsequent sprints build on.

Technology choices locked in:
- **Expo SDK 52+** (managed workflow — no native Xcode/Android Studio required until EAS build)
- **Expo Router** (file-based routing, handles deep links and native back navigation)
- **Zustand** (state management, < 1 KB, no boilerplate)
- **NativeWind v4** (Tailwind CSS for React Native, compile-time, no runtime overhead)
- **TypeScript strict mode**

---

## Prioritized Task List

| # | Task | Owner | Description |
|---|------|-------|-------------|
| 1 | Init Expo project | Nova | `npx create-expo-app odoo-mobile-app --template expo-template-blank-typescript`. Set up ESLint (Expo config), Prettier, `tsconfig.json` strict |
| 2 | Install & configure Expo Router | Nova | Install `expo-router`, set up `app/` directory structure, configure `app.json` scheme, add root `_layout.tsx` with stack navigator |
| 3 | Install NativeWind + design tokens | Milo | Install `nativewind`, configure `tailwind.config.js` with Odoo design token values from `tokens/tokens.json` (colors, spacing, radius, fonts) |
| 4 | Odoo JSON-RPC client | Sage | Create `lib/odoo-rpc/`: `client.ts` (fetch wrapper), `auth.ts` (authenticate, get session), `types.ts` (common Odoo response types). Handle session cookies, CSRF, error codes |
| 5 | Auth store (Zustand) | Nova | `stores/auth.ts`: `{ serverUrl, database, uid, sessionId, userName, userAvatar }`. Actions: `login`, `logout`, `restoreSession`. Persist to `expo-secure-store` |
| 6 | Server setup screen | Nova + Milo | Screen: URL input + "Connect" button → fetches `/web/database/list` → shows database picker. Validation: URL format, reachability test |
| 7 | Login screen | Nova + Milo | Screen: email + password fields, logo top-center (`odoo_logo.svg`), "Sign In" button, loading state. Calls `web/session/authenticate`. Brand colors from NativeWind tokens |
| 8 | Root navigation shell | Nova + Milo | Authenticated shell: bottom tab navigator (Home, CRM, Contacts, Calendar, More). Each tab has its own stack. Matches the PWA bottom nav from Sprint 5 |
| 9 | User profile & settings screen | Nova + Milo | Basic profile screen: avatar, name, email. Settings: server URL (read-only), dark/light mode toggle, language (read-only, shows current), log out button |
| 10 | Error handling & loading states | Nova | Global error boundary, network error toast, session-expired auto-logout, skeleton loading placeholder component |
| 11 | EAS project setup | Dash | Create EAS account, `eas.json` with development/preview/production profiles, GitHub Action for PR previews (Expo preview link) |
| 12 | Architecture review | Remy | Review PR: folder structure, naming conventions, security (no credentials in AsyncStorage unencrypted), token flow |

---

## Work Schedule

### Phase 1: Project Bootstrap (Tasks 1–4)
- Init Expo, Router, NativeWind
- JSON-RPC client
- **Checkpoint commit**: `sprint-6: expo project scaffold with rpc client`

### Phase 2: Auth Flow (Tasks 5–8)
- Auth store, server setup screen, login screen, navigation shell
- **Checkpoint commit**: `sprint-6: authentication flow and navigation shell`

### Phase 3: Settings, Error Handling & DevOps (Tasks 9–12)
- Settings screen, error handling, EAS setup
- Remy architecture review
- **Final commit**: `sprint-6: mobile app foundation complete`

---

## Folder Structure

```
odoo-mobile-app/
├── app/                    # Expo Router screens
│   ├── _layout.tsx         # Root layout (auth gate)
│   ├── (auth)/             # Unauthenticated routes
│   │   ├── setup.tsx       # Server URL setup
│   │   └── login.tsx       # Login screen
│   └── (app)/              # Authenticated routes
│       ├── _layout.tsx     # Bottom tab navigator
│       ├── index.tsx       # Home/Dashboard
│       ├── crm.tsx         # CRM Pipeline (Sprint 7)
│       ├── contacts.tsx    # Contacts (Sprint 7)
│       ├── calendar.tsx    # Calendar (Sprint 7)
│       └── more.tsx        # More / Settings
├── components/             # Shared UI components
│   ├── OdooButton.tsx
│   ├── OdooInput.tsx
│   ├── SkeletonLoader.tsx
│   └── ErrorBoundary.tsx
├── lib/
│   └── odoo-rpc/           # JSON-RPC client
│       ├── client.ts
│       ├── auth.ts
│       └── types.ts
├── stores/
│   └── auth.ts             # Zustand auth store
├── hooks/
│   └── useOdooQuery.ts     # Data-fetching hook
├── constants/
│   └── tokens.ts           # Design tokens (from tokens/tokens.ts)
├── tailwind.config.js
├── app.json
├── eas.json
└── package.json
```

---

## API Endpoints Used This Sprint

| Endpoint | Purpose |
|----------|---------|
| `GET /web/database/list` | Fetch available databases |
| `POST /web/session/authenticate` | Login with credentials |
| `POST /web/session/destroy` | Logout |
| `GET /web/session/get_session_info` | Restore persisted session |

---

## Design Tokens (NativeWind `tailwind.config.js`)

```js
colors: {
  brand: {
    primary:   '#71639e',  // o-brand-primary (community)
    secondary: '#8f8f8f',
    action:    '#017e84',
  },
  status: {
    success: '#28a745',
    warning: '#ffac00',
    danger:  '#dc3545',
    info:    '#17a2b8',
  },
  gray: { 100: '#f8f9fa', 200: '#e9ecef', /* ... */ 900: '#212529' }
},
borderRadius: {
  sm: '3px', DEFAULT: '4px', lg: '6px', xl: '8px', full: '9999px'
},
```

---

## Success Criteria

- [ ] `npx expo start` launches without errors
- [ ] Server setup screen validates URL and fetches database list from a real Odoo server
- [ ] Login screen authenticates and navigates to the app shell
- [ ] Session persists across app restarts (via `expo-secure-store`)
- [ ] Bottom tab navigator renders all 5 tabs
- [ ] Logout clears secure storage and returns to login
- [ ] EAS build produces a working `.apk` / `.ipa` for internal testing
- [ ] Remy architecture sign-off on PR

---

## What's NOT in This Sprint

| Feature | Reason |
|---------|--------|
| Actual screen content (CRM, Contacts, etc.) | Sprints 7–8 |
| Biometric auth | Sprint 9 |
| Push notifications | Sprint 9 |
| Offline support | Sprint 9 |
| App Store submission | Sprint 10 |

---

## Agent Prompt

> You are creating a brand new React Native / Expo app. Read `PROJECT_BRIEF.md`, then read `doc/sprint-6-plan.md`.
>
> You are: **Nova** (frontend/RN), **Milo** (design/NativeWind), **Sage** (backend/RPC client), **Dash** (DevOps/EAS).
>
> Create the `odoo-mobile-app` repository. Initialize with Expo SDK 52, TypeScript strict, Expo Router, NativeWind v4.
>
> The JSON-RPC client must handle: session cookies, CSRF token, Odoo error format `{ "error": { "code": -32000, "data": {...} } }`. Never store credentials in plain AsyncStorage.
>
> Apply Odoo design tokens from `tokens/tokens.json` in the Odoo repo to the `tailwind.config.js`.
>
> When done: push to `odoo-mobile-app` repo, open PR, ping Remy for architecture review.

---

## Progress Tracker

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Init Expo project | ⬜ Not started | |
| 2 | Expo Router setup | ⬜ Not started | |
| 3 | NativeWind + tokens | ⬜ Not started | |
| 4 | Odoo JSON-RPC client | ⬜ Not started | |
| 5 | Auth store | ⬜ Not started | |
| 6 | Server setup screen | ⬜ Not started | |
| 7 | Login screen | ⬜ Not started | |
| 8 | Navigation shell | ⬜ Not started | |
| 9 | Settings screen | ⬜ Not started | |
| 10 | Error handling | ⬜ Not started | |
| 11 | EAS setup | ⬜ Not started | |
| 12 | Architecture review | ⬜ Not started | |
