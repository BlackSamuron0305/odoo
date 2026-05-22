# Sprint 5b — Point of Sale App Modernization

> Sprint Goal: Modernize the POS application's visual design to match the new Odoo design language — the POS is a standalone OWL app with its own full SCSS stack that is entirely separate from the main webclient.
> Branch: `feature/sprint-5b`
> Depends on: Sprints 0–5 complete (full design system in place)

---

## Context

The Point of Sale application in Odoo is **not** the standard webclient. It is a separate, fullscreen OWL application with its own SCSS entrypoint (`pos_app.scss`), its own component hierarchy, its own screen states, and its own interaction patterns (designed for touchscreens and cashier hardware).

The POS currently uses:
- Raw `$gray-*` Bootstrap variables directly (not always `$o-*` prefixed)
- Hardcoded `background-color: #f0eeee` in root (bypassing design tokens)
- Its own modal animation (`@keyframes popUp`)
- `--btn-height-size: 54px` custom property (already partially modernized)
- Touch-optimized layout (`touch-action: pan-x pan-y`)

**Key constraint**: POS runs on touchscreen hardware, often on tablets in portrait mode, sometimes in kiosk mode. Design changes must prioritize **large tap targets, high contrast, and speed** over desktop aesthetics.

**Files in scope:**
```
addons/point_of_sale/static/src/
├── app/
│   ├── pos_app.scss           ← root styles
│   ├── components/            ← all POS UI components
│   │   ├── navbar/
│   │   ├── numpad/
│   │   ├── product_card/
│   │   ├── orderline/
│   │   ├── payment_method_breakdown/
│   │   ├── buttons/
│   │   ├── inputs/
│   │   └── ...
│   └── screens/
│       ├── product_screen/
│       ├── payment_screen/
│       ├── receipt_screen/
│       ├── ticket_screen/
│       └── login_screen/
└── scss/                      ← shared POS SCSS
```

---

## Prioritized Task List

| # | Task | Owner | Description |
|---|------|-------|-------------|
| 1 | Connect POS to design tokens | Milo | Replace hardcoded POS root colors (`#f0eeee`, direct `$gray-*` usage) with `var(--o-*)` custom properties from Sprint 0. Ensure `tokens/_tokens.scss` is imported in POS asset bundle |
| 2 | POS navbar modernization | Milo | POS top bar: cleaner height (56 px), brand primary color, customer display area modernized. Session info (cashier name, open time) better typographic hierarchy |
| 3 | Product grid modernization | Milo | Product cards: `border-radius: 12px`, elevation shadow on hover, better product image aspect-ratio handling, category pill nav instead of flat list |
| 4 | Product search bar | Milo | Pill-shaped search (matching web Sprint 3 control panel), clear button, search icon integrated into the pill |
| 5 | Numpad modernization | Milo | Numpad keys: larger `border-radius` (8px), subtle shadow on press (`:active` state), clearer numeric vs function key distinction (quantity/discount/price keys: different bg tint). `--btn-height-size: 56px` (was 54px) |
| 6 | Order line items | Milo | Order lines in cart: cleaner row design, better quantity badge, discount badge (amber pill), price column right-aligned with monospace font |
| 7 | Payment screen modernization | Milo | Payment method buttons: card-style layout, larger tap targets (minimum 64px height). Amount display: large numeral typography. Paid/change display: clear color distinction (paid=green, change=brand) |
| 8 | Receipt screen modernization | Milo | Receipt layout: cleaner header (logo top-center), better line item table, footer with total in large type. Print/Email/New Order buttons: full-width, consistent height |
| 9 | Login/employee screen | Milo | Employee selection: grid of avatar cards, PIN entry screen modernized (circular PIN dots like iOS). Better session open/close confirmation dialogs |
| 10 | POS modals/dialogs | Milo | POS uses its own modal slide-up animation (`@keyframes popUp`). Update to match Sprint 2b dialog design language while keeping the mobile-appropriate slide-up behavior |
| 11 | Ticket / order history screen | Milo | Order list: matches web List view design from Sprint 3. Filter chips at top. Order cards with status badge |
| 12 | Dark mode for POS | Milo | POS is often used in dimly-lit environments (restaurants, bars). Add `[data-bs-theme="dark"]` support. Dark POS: deep gray background, high-contrast product cards, backlit numpad feel |
| 13 | Regression QA — POS flows | Ivy | Test full POS session: login → select products → apply discount → payment → receipt → close session. Test on tablet viewport (portrait + landscape). Test dark mode |

---

## Work Schedule

### Phase 1: Token Integration & Navigation (Tasks 1–2)
- Wire POS into the design token system
- POS navbar modernization
- **Checkpoint commit**: `sprint-5b: pos connected to design tokens, navbar modernized`

### Phase 2: Core POS UI (Tasks 3–7)
- Product grid, search, numpad, order lines, payment screen
- These are the screens used 100% of the time in every POS session
- **Checkpoint commit**: `sprint-5b: core pos screens modernized`

### Phase 3: Secondary Screens & Dark Mode (Tasks 8–13)
- Receipt, login, tickets, modals, dark mode
- Ivy QA
- **Final commit**: `sprint-5b: pos modernization complete`

---

## POS Design Constraints (MUST NOT CHANGE)

| Constraint | Reason |
|------------|--------|
| Minimum tap target: 54px | Touchscreen hardware requirement |
| High contrast text on all backgrounds | Retail lighting conditions |
| `touch-action: pan-x pan-y` on all elements | Required for touchscreen hardware |
| `-webkit-user-select: none` | Prevents accidental text selection on touchscreen |
| `popUp` slide-up animation on mobile modals | Keep — it's the correct UX pattern for this context |
| Numpad layout and key positions | NEVER change — muscle memory for cashiers |

---

## Design Specifications

### Product Cards
```
Border-radius:   12px
Background:      white
Shadow:          var(--o-shadow-sm)
Hover shadow:    var(--o-shadow-md)
Image area:      aspect-ratio: 1/1, object-fit: cover, top of card
Name:            font-weight: 600, 14px, max 2 lines, ellipsis
Price:           font-weight: 700, 16px, brand primary color
Size:            minimum 100×120px cell in grid
```

### Numpad
```
Key height:       56px (via --btn-height-size)
Key border-radius: 8px
Key background:   var(--o-gray-100)
Key :active:      var(--o-gray-300), translateY(1px)
Function keys:    var(--o-brand-primary) at 10% opacity tint
Delete key:       var(--o-danger) at 10% opacity tint
Font:             font-weight: 600, 20px monospace for numbers
```

---

## Success Criteria

- [ ] POS root styles use `var(--o-*)` tokens, no hardcoded hex colors in root
- [ ] Product cards have `12px` border-radius with elevation
- [ ] Numpad has per-key `:active` press feedback
- [ ] Payment screen method buttons are minimum 64px height
- [ ] Receipt screen renders cleanly with logo centered
- [ ] POS dark mode works via `[data-bs-theme="dark"]`
- [ ] All tap targets ≥ 54px (existing constraint preserved)
- [ ] Full POS session flow works without errors (Ivy sign-off)
- [ ] Tested on 768px × 1024px tablet portrait viewport

---

## What's NOT in This Sprint

| Feature | Reason |
|---------|--------|
| POS business logic changes | Never — SCSS only |
| Self-order / kiosk screen | Separate module (`pos_self_order`) — v2 |
| Customer display screen | Separate module — v2 |
| Restaurant table map | `pos_restaurant` module — v2 |
| Hardware integration changes | Not UI scope |

---

## Agent Prompt

> Read `PROJECT_BRIEF.md`, then read `doc/sprint-5b-plan.md`. You are **Milo** (CSS/art director).
>
> Execute Sprint 5b: Point of Sale App Modernization.
>
> First: `git pull origin main && git checkout -b feature/sprint-5b`
>
> **CRITICAL**: The POS is touchscreen hardware. Never reduce tap targets below 54px. Never change the numpad key positions or layout. Never remove `touch-action` or `user-select` rules.
>
> The POS asset bundle is SEPARATE from the webclient bundle. Verify that `tokens/_tokens.scss` is imported correctly in the POS SCSS entrypoint before making any other changes.
>
> Phase 2 (core POS UI) is the highest priority. Complete it even if Phase 3 must be deferred.
>
> Update `doc/sprint-5b-progress.md` after each phase.
> When done: `git push origin feature/sprint-5b` and open a PR. Tag Ivy for QA.

---

## Progress Tracker

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Connect POS to design tokens | ⬜ Not started | |
| 2 | POS navbar | ⬜ Not started | |
| 3 | Product grid | ⬜ Not started | |
| 4 | Product search bar | ⬜ Not started | |
| 5 | Numpad | ⬜ Not started | |
| 6 | Order line items | ⬜ Not started | |
| 7 | Payment screen | ⬜ Not started | |
| 8 | Receipt screen | ⬜ Not started | |
| 9 | Login / employee screen | ⬜ Not started | |
| 10 | POS modals | ⬜ Not started | |
| 11 | Ticket screen | ⬜ Not started | |
| 12 | POS dark mode | ⬜ Not started | |
| 13 | Regression QA | ⬜ Not started | |
