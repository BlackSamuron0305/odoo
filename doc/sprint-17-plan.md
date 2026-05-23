# Sprint 17 — Portal & Customer-Facing Pages

> Sprint Goal: Modernize the Odoo customer portal — the web interface that customers, vendors, and partners access to view their invoices, orders, projects, and documents — applying the same design token system as the backend while creating a clean, professional customer experience.
> Branch: `feature/sprint-17`
> Depends on: Sprint 0 (tokens), Sprint 12 (typography), Sprint 16 (empty states)

---

## Context

The Odoo portal (`/my/`) is a separate frontend surface that customers access without logging into the backend. It has its own Bootstrap-based layout and its own SCSS. Customers see this when they click "View Invoice" links in emails, access their quotes online, download delivery slips, or log into the customer portal.

This surface has had no visual update — it still looks like Bootstrap 3-era design. For B2B companies, this is what their customers and vendors see. It must look professional and trustworthy.

**Portal is different from the backend**: it uses different Bootstrap configurations, different SCSS entry points, and different OWL/widget infrastructure. Some parts are plain Jinja2 templates (not OWL).

**Files in scope:**
- `addons/portal/static/src/scss/portal.scss` — main portal stylesheet
- `addons/portal/static/src/scss/portal.edit.scss` — portal edit mode styles
- `addons/portal/static/src/scss/primary_variables.scss` — portal variables
- `addons/portal/static/src/scss/bootstrap_overridden.scss` — portal BS overrides
- `addons/portal/static/src/views/` — portal OWL views
- `addons/portal/static/src/chatter/` — portal chatter (subset of Discuss)

---

## Prioritized Task List

| # | Task | Owner | Description |
|---|------|-------|-------------|
| 1 | Portal audit | Milo | Catalogue all portal SCSS selectors, layout structure, and component patterns. Map which pages exist: Home (`/my/`), Documents, Invoices/Bills, Sales Orders, Purchase Orders, Projects, Tickets, Subscriptions. Document in `doc/sprint-17-audit.md` |
| 2 | Portal primary variables | Milo | `portal/static/src/scss/primary_variables.scss`: import from `web`'s token system. Ensure `--o-*` CSS custom properties are available in portal context. Set portal-specific token overrides if needed (portal may want slightly different brand presentation) |
| 3 | Portal Bootstrap overrides | Milo | `portal/static/src/scss/bootstrap_overridden.scss`: align with `web` overrides from Sprint 0. Ensure `$enable-dark-mode: true` and CSS custom property color modes work in portal context |
| 4 | Portal page layout | Milo | Portal shell: max-width 960px content area (centered). Two-column layout on desktop: left sidebar (portal navigation 220px) + right content area. Sidebar: sticky, portal user info at top (avatar + name + email). Top header: Odoo logo + company name + right-aligned user menu |
| 5 | Portal header & navigation | Milo | Portal sidebar nav: portal section links (Home, Documents, Invoices, etc.). Active: brand-tinted. Hover: `var(--o-gray-100)`. Mobile: collapsible hamburger → bottom drawer. Section headers: 11px uppercase matching settings nav (Sprint 14) |
| 6 | Portal home page | Milo | `/my/`: grid of portal section cards. Card: icon (48px brand-tinted) + section name + item count badge. `border-radius: 8px`, hover `box-shadow: var(--o-shadow-md)`. Card grid: 2-col mobile, 3-col desktop |
| 7 | Portal document lists | Milo | List of invoices, orders, etc.: table with clean Sprint 3 list styles. Status badge: pill with type color (Paid=green, Draft=gray, Overdue=red). Document reference: monospace (Sprint 12). Date: tabular-nums. Amount: right-aligned, tabular-nums, bold |
| 8 | Portal document detail | Milo | Invoice/order detail view: print-ready layout with company logo top-left, document title (large, h1 scale), reference number, status badge pill top-right. Item table: clean, alternating-subtle row shading. Totals section: right-aligned, subtotal / tax / total hierarchy |
| 9 | Portal PDF download button | Milo | "Download PDF" button: primary brand button, PDF icon left. "Print" secondary button. Position: sticky bottom bar on mobile, top-right on desktop. Consistent with Sprint 2 button styles |
| 10 | Portal payment flow | Milo | Payment page: clean card layout (credit card icon + card form fields). Payment methods list: radio-button selection cards with card brand logos. Amount display: large, bold. "Pay Now" button: full-width brand primary, 48px height |
| 11 | Portal sign & accept flow | Milo | Quote signing: signature pad (`border: 2px dashed var(--o-gray-300)`, rounded). "Accept & Sign" button: brand primary. Legal text: small gray below button. Signed state: shows signature image with timestamp |
| 12 | Portal chatter | Milo | Portal has a limited chatter for customer messages. Style: matches Sprint 2b chatter but lighter (no internal note toggle — customers see only message mode). Attachments use same Sprint 2b attachment chip style |
| 13 | Portal form inputs | Milo | Customer-editable fields in portal (shipping address edit, etc.): match Sprint 12 form input styles but with slightly larger touch targets (44px height) since portal users may be on mobile |
| 14 | Portal login / sign-up | Milo | Portal login page (`/web/login`): this is shared with the backend login. Modernize: centered card (480px max), company logo top, input fields Sprint 12 style, "Log In" button full-width brand primary. "Forgot password" link style from Sprint 12. Background: subtle gradient using brand colors at 5% opacity |
| 15 | Portal breadcrumb | Milo | Portal breadcrumb: "Home > Invoices > INV/2024/0001". Style: Sprint 2 breadcrumb with `>` separator (not `/`). Last item: current page, no link. Back button on mobile instead of breadcrumb |
| 16 | Portal empty states | Nova | Wire Sprint 16 `EmptyState` component into portal views. Each section has appropriate icon + message. "No invoices yet" → EmptyState with invoice icon. "No orders" → EmptyState with cart icon |
| 17 | Portal dark mode | Milo | Portal should respect `prefers-color-scheme` media query (not the backend toggle — portal users don't have that). Add `@media (prefers-color-scheme: dark)` block to portal SCSS using same `[data-bs-theme="dark"]` variable set |
| 18 | Portal mobile responsiveness | Milo | Test all portal pages at 375px, 768px, 1024px. Sidebar collapses to bottom drawer on mobile. Tables become card stacks on mobile (each row is a card). Payment form is single-column on mobile |
| 19 | Regression QA | Ivy | Test portal with a real Odoo demo: log in as portal user, view invoice, download PDF, sign a quote, send a message in chatter, check dark mode (`prefers-color-scheme`), test on mobile viewport |

---

## Work Schedule

### Phase 1: Foundation & Layout (Tasks 1–5)
- Audit, token integration, portal layout, header + nav
- **Checkpoint commit**: `sprint-17: portal layout, tokens, and navigation`

### Phase 2: Document Views (Tasks 6–9)
- Home page, document lists, document detail, download button
- **Checkpoint commit**: `sprint-17: portal document views`

### Phase 3: Interaction Flows (Tasks 10–13)
- Payment, sign/accept, chatter, form inputs
- **Checkpoint commit**: `sprint-17: portal interaction flows`

### Phase 4: Polish (Tasks 14–18)
- Login page, breadcrumb, empty states, dark mode, mobile
- **Checkpoint commit**: `sprint-17: portal polish and mobile responsiveness`

### Phase 5: QA (Task 19)
- **Final commit**: `sprint-17: portal QA signoff`

---

## Design Specifications

### Portal Layout
```
Max content width: 960px, centered (margin: 0 auto; padding: 0 24px)
Sidebar width:     220px (desktop), collapses on mobile
Header height:     60px (taller than backend 40px — portal users need more breathing room)
Background:        var(--o-gray-50) (light) / var(--o-gray-950) (dark)
```

### Portal Status Badges
```
Paid / Done / Confirmed: #22c55e (green)
Draft / Pending:         var(--o-gray-400)
Overdue / Cancelled:     #ef4444 (red)
In Progress / Sent:      #3b82f6 (blue)
```

### Login Card
```
Width:          480px max, centered
Background:     white (light) / var(--o-gray-800) (dark)
Border-radius:  12px
Box-shadow:     var(--o-shadow-lg)
Padding:        48px
```

---

## Success Criteria

- [ ] Portal uses `--o-*` CSS custom properties from the web token system
- [ ] Portal layout has max-960px content, sticky sidebar, responsive header
- [ ] Portal sidebar nav matches settings nav style (Sprint 14)
- [ ] Portal home page shows section cards with count badges
- [ ] Document lists show status badges and tabular-nums amounts
- [ ] Document detail page has print-ready layout with company logo
- [ ] Payment page is clean single-column card layout
- [ ] Quote signing has signature pad and legal text
- [ ] Portal login page is centered card with brand styling
- [ ] Sprint 16 empty states are wired into portal views
- [ ] Dark mode via `prefers-color-scheme` works on portal
- [ ] All portal pages responsive at 375px (mobile), 768px (tablet), 1024px+ (desktop)
- [ ] Ivy QA sign-off

---

## What's NOT in This Sprint

| Feature | Reason |
|---------|--------|
| eCommerce shop / product pages | That is Sprint 18 — separate module |
| Website builder integration | Sprint 19 |
| Portal feature changes (new sections) | Product decision — out of scope |
| Live chat on portal | Sprint 20 |
| Customer signup flow redesign | Scope too broad; login page only |

---

## Agent Prompt

> Read `PROJECT_BRIEF.md`, then read `doc/sprint-17-plan.md`. You are the dev team: **Milo** (CSS/art director) and **Nova** (frontend engineer).
>
> Execute Sprint 17: Portal & Customer-Facing Pages.
>
> First: `git pull origin 19.0 && git checkout -b feature/sprint-17`
>
> **IMPORTANT**: The portal is a different codebase from the backend. SCSS entry points are different. Bootstrap is configured separately. Start with the audit (Task 1) and token integration (Tasks 2–3) before touching any visual styles.
>
> **Milo** owns all SCSS. **Nova** owns empty state wiring (Task 16).
>
> The document detail page (Task 8) is the highest-value visual piece — invoices and orders are what customers see most. Prioritize this even if other tasks are incomplete.
>
> The portal login page (Task 14) is shared with the backend — changes here affect both. Be careful not to break the backend login visual when updating it.
>
> Commit after each phase. Update `doc/sprint-17-progress.md` after each commit.
> When done: `git push origin feature/sprint-17` and open a PR. Tag Ivy for QA.

---

## Progress Tracker

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Portal audit | ⬜ Not started | |
| 2 | Portal primary variables | ⬜ Not started | |
| 3 | Portal Bootstrap overrides | ⬜ Not started | |
| 4 | Portal page layout | ⬜ Not started | |
| 5 | Portal header & navigation | ⬜ Not started | |
| 6 | Portal home page | ⬜ Not started | |
| 7 | Portal document lists | ⬜ Not started | |
| 8 | Portal document detail | ⬜ Not started | |
| 9 | Portal PDF download button | ⬜ Not started | |
| 10 | Portal payment flow | ⬜ Not started | |
| 11 | Portal sign & accept flow | ⬜ Not started | |
| 12 | Portal chatter | ⬜ Not started | |
| 13 | Portal form inputs | ⬜ Not started | |
| 14 | Portal login / sign-up | ⬜ Not started | |
| 15 | Portal breadcrumb | ⬜ Not started | |
| 16 | Portal empty states | ⬜ Not started | |
| 17 | Portal dark mode | ⬜ Not started | |
| 18 | Portal mobile responsiveness | ⬜ Not started | |
| 19 | Regression QA | ⬜ Not started | |
