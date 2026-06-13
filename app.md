# Odoo Mobile App — Product & Technical Plan

> **Target:** Flutter app for Android and iOS, connected to this Odoo 19 Community instance (`ui-rebuild` branch).
> **Backend:** Self-hosted Odoo at `{server_url}` with PostgreSQL.
> **Status:** Planning document — not yet implemented.

---

## 1. Executive Summary

Build a **native mobile companion** for Odoo Community that replaces the paid Odoo Enterprise mobile app for our use case. The app will use Odoo's public APIs (JSON/2, JSON-RPC, Portal routes, Bus/WebSocket) rather than embedding the web client in a WebView.

**Goals**
- Fast, mobile-first UX for daily field/warehouse/sales workflows
- Visual alignment with the `ui-rebuild` design tokens (purple-indigo brand `#6358a5`, warm gray scale, modern shadows/radius)
- Secure multi-database login
- Push notifications for Discuss, approvals, and assigned tasks

**Non-goals (v1)**
- Full parity with the Odoo web backend (Studio, every report, every settings screen)
- Offline write sync for all modules (scoped offline in Phase 3 only)
- Replacing Odoo Enterprise proprietary modules by copying their code

---

## 2. Current UI Context (Backend Web Client)

| Question | Answer |
|----------|--------|
| Is there an "old UI" and "new UI" running in parallel? | **No.** There is one OWL web client (`WebClient`). The `ui-rebuild` branch changes **865 SCSS files only** — design tokens, colors, shadows, module-specific styles. No second JS framework or alternate web client. |
| What UI does a running server use? | Whichever code is on the checked-out branch. On `ui-rebuild`, the server serves the **new token-based styling** via compiled asset bundles (`web.assets_web`, `web.assets_frontend`). |
| Can two UIs appear at once? | Only if you run **two servers** on different branches, or use **different databases** with **cached old asset attachments**. Clear assets (`debug=assets` or regenerate bundles) to avoid stale CSS. |
| Enterprise web UI? | Enterprise adds `web_enterprise` (subclass of `WebClient`). **Not present** in this repo. Community web client only. |

The mobile app should **mirror the new design tokens** from `addons/web/static/src/scss/primary_variables.scss`, not replicate the full web layout.

---

## 3. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Flutter App (Dart)                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────┐ │
│  │   UI     │ │  State   │ │  Local   │ │  Push (FCM/APNs)│ │
│  │ Material3│ │ Riverpod │ │  Hive/   │ │               │ │
│  │ + tokens │ │ or Bloc  │ │  Drift   │ │               │ │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └───────┬───────┘ │
│       └────────────┴────────────┴───────────────┘         │
│                         │                                    │
│              OdooApiClient (dio + interceptors)              │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTPS
          ┌───────────────┼───────────────┐
          │               │               │
    POST /json/2/…   POST /jsonrpc    GET /websocket
    (Bearer API key)  (session)       (Bus notifications)
          │               │               │
          └───────────────┴───────────────┘
                          │
              Odoo 19 Community Server
              (d:\odoo, ui-rebuild branch)
                          │
                     PostgreSQL
```

### Recommended stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | **Flutter 3.x** | Single codebase for Android + iOS |
| HTTP | **dio** | Interceptors, retries, cookie jar |
| State | **Riverpod** or **Bloc** | Predictable async API state |
| Routing | **go_router** | Deep links, auth guards |
| Local DB | **Drift** (SQLite) | Offline cache, outbox queue |
| Secure storage | **flutter_secure_storage** | API keys, session tokens |
| Push | **firebase_messaging** | FCM + APNs via Firebase |
| i18n | **flutter_localizations** + ARB | Match Odoo `res.lang` |
| Barcode | **mobile_scanner** | Warehouse/POS scanning |

---

## 4. Odoo Integration — API Strategy

### 4.1 Authentication options

| Method | Endpoint / mechanism | Mobile use |
|--------|---------------------|------------|
| **API Key (recommended)** | `Authorization: Bearer {token}` on `/json/2/<model>/<method>` | Stateless, secure, revocable per device |
| **Session + JSON-RPC** | `POST /web/session/authenticate` then cookie session | Works but fragile on mobile (cookie expiry, CSRF) |
| **Portal user** | Limited `auth='user'` portal routes | Customer/supplier self-service only |

**Implementation plan**
1. User enters server URL + database name + email + password (first login only).
2. App calls authenticate once to verify credentials.
3. User generates an **API key** in Odoo (Settings → Account → API Keys) or admin pre-provisions device keys.
4. App stores key in secure storage; all subsequent calls use Bearer auth.

API keys are built into Odoo 19 base (`res.users.api_key_ids`). The JSON/2 controller explicitly supports `auth='bearer'` (`addons/rpc/controllers/json2.py`).

### 4.2 Primary API: JSON/2 (Odoo 19+)

```
POST /json/2/res.partner/search_read
Authorization: Bearer {api_key}
Content-Type: application/json

{
  "domain": [["customer_rank", ">", 0]],
  "fields": ["name", "email", "phone"],
  "limit": 20,
  "context": {"lang": "en_US"}
}
```

**Use for:** CRUD on models where methods are public and exposed.

### 4.3 Secondary API: JSON-RPC

```
POST /jsonrpc
{
  "jsonrpc": "2.0",
  "method": "call",
  "params": {
    "service": "object",
    "method": "execute_kw",
    "args": [db, uid, password_or_key, "sale.order", "search_read", [], {"fields": [...]}]
  }
}
```

**Use for:** Legacy compatibility, web client parity endpoints, `call_kw` on any permitted model method.

### 4.4 Real-time: Bus / WebSocket

```
GET /websocket?version=19.0-2
```

**Use for:** Discuss messages, notification badges, live updates. Mirror `bus` module subscription channels for the logged-in partner/user.

### 4.5 Custom backend extensions (recommended)

Create a **custom Community addon** `mobile_api` (outside core, in a separate addons path) to expose mobile-optimized endpoints:

| Route | Purpose |
|-------|---------|
| `POST /mobile/v1/bootstrap` | User profile, allowed apps, menu tree, unread counts |
| `POST /mobile/v1/dashboard` | KPIs aggregated server-side (fewer round trips) |
| `POST /mobile/v1/sync` | Delta sync for offline (Phase 3) |
| `POST /mobile/v1/push/register` | Store FCM token on `res.users` or device model |

This avoids over-fetching via generic `search_read` and keeps mobile logic out of the core fork.

---

## 5. Design System (aligned with ui-rebuild)

Extract tokens from `addons/web/static/src/scss/primary_variables.scss`:

| Token | Value | Flutter usage |
|-------|-------|---------------|
| Brand primary | `#6358a5` | `ColorScheme.primary` |
| Brand secondary | `#00d09c` (teal accent in style guide) | Accent, success CTAs |
| Gray 100 (bg) | `#f7f7f9` | Scaffold background |
| Gray 900 (text) | `#14141f` | Headings |
| Border radius sm / base / lg | 4 / 6 / 10 px | `BorderRadius` |
| Shadows xs → lg | SCSS shadow ramp | `BoxShadow` presets |
| Font | System UI stack | `ThemeData(fontFamily: ...)` |

### UI principles
- **Bottom navigation** for 4–5 top-level areas (not Odoo's sidebar)
- **Cards** with `--o-color-surface` white on gray-100 background
- **List → Detail** navigation pattern (mobile native, not spreadsheet views)
- **FAB** for primary create actions (lead, task, expense, picking)
- **Pull-to-refresh** on all list screens
- **Skeleton loaders** during API fetch

### Screen density
- Touch targets ≥ 48dp
- Single-column forms; group fields in expandable sections
- Use chips for states (draft, confirmed, done) matching Odoo `state` fields

---

## 6. Feature Matrix

### Phase 1 — MVP (8–10 weeks)

| Module | Features | Odoo models / methods |
|--------|----------|----------------------|
| **Auth & shell** | Login, DB picker, API key, app lock (biometric) | `res.users`, session authenticate |
| **Discuss** | Inbox, channels, send message, attachments | `mail.message`, `discuss.channel`, bus |
| **CRM** | Pipeline kanban (swipe stages), lead form, log call/note | `crm.lead`, `crm.stage` |
| **Contacts** | Search, view, create, call/email actions | `res.partner` |
| **Calendar** | Agenda view, event detail, RSVP | `calendar.event` |
| **Notifications** | Push + in-app notification center | `mail.notification`, bus |

### Phase 2 — Operations (6–8 weeks)

| Module | Features | Notes |
|--------|----------|-------|
| **Sales** | Quotations list, order detail, confirm SO | `sale.order` — no full PDF editor |
| **Project** | My tasks, timesheet timer, task chatter | `project.task`, `account.analytic.line` |
| **Inventory** | Pickings list, barcode scan validate, qty edit | Replaces need for `stock_barcode` Enterprise |
| **Approvals** | Expense / leave / SO approval queue | Custom or `approvals`-like OCA module |
| **Documents** | View/download attachments linked to records | `ir.attachment` |

### Phase 3 — Advanced (8+ weeks)

| Module | Features | Notes |
|--------|----------|-------|
| **Offline mode** | Read cache + outbox for timesheets, stock moves, CRM notes | Conflict resolution on reconnect |
| **Expenses** | Photo receipt, create expense, submit | `hr.expense` — OCR via third-party API optional |
| **Helpdesk** | Ticket list, assign, reply (requires custom/OCA helpdesk) | Not in Community core |
| **Field service** | Job list, signature capture, parts used | Custom module |
| **Dashboards** | Role-based KPI widgets | Server aggregated |

---

## 7. What Should Be Possible vs Not

### ✅ Should be possible (Community + this app)

- Login to self-hosted Odoo with multi-DB support
- Real-time messaging (Discuss)
- CRM pipeline on mobile
- Sales order viewing and basic confirmation (with ACL)
- Warehouse picking with camera barcode scan
- Project tasks and timesheets
- Push notifications (via custom `mobile_api` + FCM)
- Portal-style customer access (orders, invoices) for portal users
- Biometric app lock, dark mode (using prepared CSS vars from ui-rebuild)

### ⚠️ Possible with extra Community/OCA/custom modules

- Helpdesk tickets → need OCA `helpdesk` or custom module
- Accounting reports → basic list views yes; full PDF report engine no
- Marketing automation → not in Community
- Quality control workflows → OCA or custom QMS module
- Subscription billing → custom recurring invoice logic
- OCR expense scanning → integrate external OCR API (Google Vision, etc.)

### ❌ Should NOT be in scope (v1 / legally or technically blocked)

- Copying Odoo Enterprise proprietary modules (`web_enterprise`, `account_reports`, `stock_barcode` source)
- Full Odoo Studio equivalent in mobile
- Complete accounting backend (reconciliation UI, tax report builder)
- VoIP dialer integration (Enterprise)
- IoT box direct pairing (Enterprise hardware stack)
- Offline bi-directional sync for all 625 modules
- Embedding full Odoo web backend in WebView as the primary UX ( poor UX, not native)

---

## 8. Enterprise Features — Legitimate Community Strategy

Odoo Enterprise modules are **proprietary (OEEL)**. Do not copy their source. Instead:

| Enterprise feature | Community approach | Module / effort |
|-------------------|-------------------|-----------------|
| Mobile app | **This Flutter app** | `app.md` implementation |
| Barcode app (`stock_barcode`) | Custom barcode validation UI + `stock.picking` API | Medium — Phase 2 |
| Accounting reports (`account_reports`) | Export PDF via QWeb reports + simple P&L/BS wizard | High — custom reporting addon |
| Bank sync (`account_online_sync`) | Manual import + optional open banking API (Plaid/Tink) | Medium — integration addon |
| OCR bills (`account_extract`) | Third-party OCR + `account.move` create | Medium |
| Helpdesk | OCA Helpdesk or custom `helpdesk` addon | Medium |
| Marketing automation | OCA `marketing_automation` or Mautic integration | High |
| Studio | Custom modules in separate `custom_addons/` path | Ongoing dev |
| Sign (`sign`) | DocuSign / OpenSign integration | Medium |
| Quality control | OCA `quality_control` | Medium |
| MRP scheduler (`mrp_mps`) | Custom planning views or spreadsheet dashboards | High |
| VoIP | Asterix/3CX via SIP SDK (separate from Odoo VoIP) | High |
| Live currency rates (`currency_rate_live`) | Free ECB/OpenExchangeRates cron | Low |

Settings toggles marked `widget="upgrade_boolean"` in Community **intentionally block** Enterprise module installation and show an upgrade dialog (`upgrade_boolean_field.js`).

---

## 9. Security Model

| Concern | Mitigation |
|---------|------------|
| API key theft | Secure enclave storage, key rotation, per-device keys, short expiry |
| MITM | Certificate pinning optional; HTTPS only |
| ACL bypass | Never bypass Odoo ORM; all calls respect `ir.model.access` and record rules |
| Session fixation | Prefer Bearer API keys over long-lived cookies |
| Push token privacy | Store hashed; tie to user + device ID |
| Biometric lock | Re-prompt after 5 min background |
| Logout | Revoke API key server-side + wipe local DB |

---

## 10. Project Structure (Flutter)

```
odoo_mobile/
├── lib/
│   ├── main.dart
│   ├── app.dart                    # MaterialApp, theme, router
│   ├── core/
│   │   ├── theme/                  # Design tokens from ui-rebuild
│   │   ├── network/odoo_client.dart
│   │   ├── auth/auth_repository.dart
│   │   └── storage/secure_store.dart
│   ├── features/
│   │   ├── auth/
│   │   ├── discuss/
│   │   ├── crm/
│   │   ├── sales/
│   │   ├── inventory/
│   │   ├── project/
│   │   └── settings/
│   └── shared/
│       ├── widgets/                # OdooCard, StateChip, Avatar
│       └── models/                 # Freezed/json_serializable DTOs
├── test/
├── android/
├── ios/
└── pubspec.yaml
```

---

## 11. Backend Prerequisites (Odoo server)

Before mobile QA:

- [ ] Odoo 19 Community running on HTTPS (reverse proxy: nginx/Caddy)
- [ ] CORS configured if needed for web debugging (mobile native bypasses CORS)
- [ ] `mobile_api` custom addon installed (recommended)
- [ ] API keys enabled for mobile user group
- [ ] Modules installed: `crm`, `sale`, `stock`, `project`, `hr_timesheet`, `mail`, `portal`
- [ ] Push notification cron / webhook endpoint for FCM
- [ ] Rate limiting at proxy layer

### Suggested nginx location block

```nginx
location / {
    proxy_pass http://127.0.0.1:8069;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

location /websocket {
    proxy_pass http://127.0.0.1:8069;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

---

## 12. Development Phases & Milestones

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| **0 — Spike** | 1 week | Auth + one `search_read` screen + API key flow |
| **1 — MVP** | 8 weeks | Discuss, CRM, Contacts, Calendar, push |
| **2 — Ops** | 6 weeks | Sales, Project, Inventory barcode |
| **3 — Offline** | 8 weeks | Cache, outbox, conflict UI |
| **4 — Store** | 2 weeks | Play Store + App Store submission |

### Definition of Done (MVP)
- Login works on Android 12+ and iOS 16+
- CRM pipeline draggable between stages
- Discuss sends/receives messages in real time
- Push notification on new message
- Matches ui-rebuild color tokens
- Security review passed (no plaintext passwords stored)

---

## 13. Testing Strategy

| Type | Scope |
|------|-------|
| Unit | Repositories, JSON parsing, token refresh |
| Widget | Login form, pipeline card, message bubble |
| Integration | Against `ui_rebuild_local` test database |
| E2E | Patrol or integration_test: login → create lead → move stage |
| Manual | Barcode scan on physical devices (warehouse) |

---

## 14. Open Questions

1. **Single company or multi-company?** Affects dashboard and record rules.
2. **Portal users vs internal users?** Different nav and ACL.
3. **Which modules are installed on production DB?** Scope Phase 2 accordingly.
4. **Self-hosted only or also Odoo.sh / SaaS?** API key policy may differ.
5. **Branding:** App name, icon, splash — align with ui-rebuild purple brand?

---

## 15. References (in this repo)

| Resource | Path |
|----------|------|
| JSON/2 RPC controller | `addons/rpc/controllers/json2.py` |
| JSON-RPC controller | `addons/rpc/controllers/jsonrpc.py` |
| HTTP auth (Bearer) | `odoo/http.py` — `@route(auth='bearer')` |
| Web client entry | `addons/web/static/src/main.js` |
| Design tokens | `addons/web/static/src/scss/primary_variables.scss` |
| CSS custom properties | `addons/web/static/src/webclient/webclient.scss` |
| Enterprise gate widget | `addons/web/static/src/webclient/settings_form_view/fields/upgrade_boolean_field.js` |
| Portal API examples | `addons/portal/controllers/portal.py` |

---

## 16. Next Steps

1. Create `custom_addons/mobile_api` module with bootstrap and push endpoints.
2. Initialize Flutter project `odoo_mobile/` (separate repo or monorepo subfolder).
3. Implement auth spike against `ui_rebuild_local` database.
4. Define user roles → mobile nav mapping workshop with stakeholders.
5. Prioritize which Enterprise gaps (barcode, helpdesk, reports) get custom Community addons first.

---

*Document version: 1.0 — 2026-06-13*
*Branch context: `ui-rebuild` @ Odoo 19.0 Community*
