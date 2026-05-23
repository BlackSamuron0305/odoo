# Sprint 20 — POS Restaurant & Self-Order Kiosk

> Sprint Goal: Modernize the Point of Sale Restaurant module (table map, floor plan, order routing) and the Self-Order kiosk (customer-facing ordering screen), applying brand tokens, improving touch ergonomics, and creating a professional hospitality experience.
> Branch: `feature/sprint-20`
> Depends on: Sprint 5b (POS core modernization), Sprint 11 (motion), Sprint 12 (typography)

---

## Context

Sprint 5b modernized the **core POS app** (session management, product grid, numpad, payment screen). This sprint covers two separate POS extension modules that were explicitly out of scope in v1:

1. **POS Restaurant** (`addons/pos_restaurant/`) — adds floor plan management (table map), split bill, kitchen display routing, and table-based ordering. This is what restaurant staff use on a tablet.

2. **POS Self-Order** (`addons/pos_self_order/`) — a completely separate customer-facing UI. Customers browse the menu, customize items, and place orders from their own device or a kiosk. This is a standalone app with its own Bootstrap configuration.

Both apps run fullscreen, often on tablets or dedicated kiosk hardware. Touch ergonomics are paramount (minimum 54px tap targets — same as Sprint 5b).

**Files in scope:**
- `addons/pos_restaurant/static/src/scss/restaurant.scss`
- `addons/pos_restaurant/static/src/app/` — OWL components
- `addons/pos_restaurant/static/src/xml/` — templates
- `addons/pos_self_order/static/src/app/` — self-order OWL components
- `addons/pos_self_order/static/src/scss/`
- `addons/pos_self_order/static/src/app/primary_variables.scss`
- `addons/pos_self_order/static/src/app/bootstrap_overridden.scss`

---

## Prioritized Task List

| # | Task | Owner | Description |
|---|------|-------|-------------|
| 1 | Restaurant module audit | Milo | Map all SCSS in `pos_restaurant/`. Identify: floor plan canvas, table objects, order status overlays, table detail panel, kitchen display. Note OWL component names. Document in `doc/sprint-20-audit.md` |
| 2 | Self-order audit | Milo | Map all SCSS in `pos_self_order/`. Identify: home/landing screen, menu categories, product grid, product detail (customizations), cart, order status. Note how it differs from backend POS |
| 3 | Floor plan — table objects | Milo | Restaurant table map tables: `border-radius: 8px` (square tables) or `border-radius: 50%` (round tables). Table status colors using brand tokens: Available = `var(--o-gray-200)`, Occupied = `var(--o-brand-action)` tinted, Bill requested = amber, Orders pending = brand-primary. Table number: bold, centered. Guest count: small text below number |
| 4 | Floor plan — layout | Milo | Floor plan canvas: dark background (`var(--o-gray-900)`) — this is the restaurant "floor". Tables are lighter blocks on dark background. Grid lines: subtle `var(--o-gray-800)` dots. Floor selector tabs (Floor 1, Floor 2...): pill tabs at top, white on dark |
| 5 | Floor plan — occupied table indicator | Milo | Occupied table: shows elapsed time since order opened (`1h 23m`). Sprint 11 motion: time counter pulses subtly at 30 min intervals. Orders pending: small order count badge on table corner. Bill requested: animated attention ring around table |
| 6 | Table detail panel | Milo | Sliding panel (right side, 320px) when table is selected: table name, guests count (editable), order items list, order total. Move table button. Split bill button. Close table button. Matches Sprint 5b POS order layout |
| 7 | Kitchen display styling | Milo | Kitchen Display System screen (fullscreen on kitchen monitor): ticket cards per table. Card: `border-radius: 8px`, high contrast (white on dark or dark on white). Item text: large (18px minimum for distance reading). Status: New (brand color border), In Progress (amber), Done (green). Timer: counts up from 0:00 |
| 8 | Restaurant order routing indicators | Milo | In the main POS order view (when in restaurant mode): each order line shows which "printer/kitchen" it's routed to. Small colored dot + kitchen name. Routes: kitchen colors from a predefined palette (5 colors). Consistent with activity view cell colors from Sprint 15 |
| 9 | Self-order landing / home screen | Milo | Self-order landing: full-screen welcome. Company logo + restaurant name (h1, centered). "Order Here" large CTA button (56px height, brand-primary, full-width on mobile). Table number selection (if applicable): large number buttons (80px × 80px) in a grid. Background: high-quality image overlay support (`background-image` with brand-color overlay) |
| 10 | Self-order menu categories | Milo | Category navigation: horizontal scroll tabs at top (56px, `border-radius: 999px` selected pill). Category icons (if set): 24px above text. Category item count badge: small pill. Scroll snaps to selected category section below |
| 11 | Self-order product grid | Milo | Product grid: 2 columns on mobile/portrait, 3 on landscape/tablet. Product card: image (aspect 4:3), name (2-line clamp, 15px/500), price (bold, brand-action color). "Add" button: circular `+` bottom-right corner of card (44px minimum). Out of stock: gray overlay with "Sold Out" label |
| 12 | Self-order product detail | Milo | Product customization sheet (slide-up bottom sheet on mobile): large product image (60vh max), name + price header. Customization groups (radio/checkbox): pill selector buttons (Sprint 2b field widget style), 48px minimum height. Quantity stepper. "Add to Cart" button: full-width 56px, sticky at bottom |
| 13 | Self-order cart | Milo | Cart page: line items with product name + customizations summary + quantity + price. Editable quantity (stepper). Subtotal, tax, total. "Place Order" button: full-width, 56px, brand-primary. "Continue Shopping" secondary |
| 14 | Self-order order status | Milo | Order placed confirmation: Sprint 16 success animation (checkmark). Order number large and prominent. Status timeline (Received → Preparing → Ready): horizontal step indicator with animated progress. "Your order is ready!" state: pulsing brand-color ring + notification |
| 15 | Kiosk mode optimizations | Milo | For kiosk (unattended) mode: larger fonts throughout (`font-size: 1.2rem` base). All touch targets minimum 64px (more generous than tablet). Inactivity timeout screen: "Tap to order" with idle animation (Sprint 11 pulsing). No scroll on category grid — everything visible at once on screen |
| 16 | Restaurant dark mode | Milo | Restaurant floor plan: already dark background — ensure the table status colors have sufficient contrast. Kitchen display: offer dark/light toggle in KDS settings. Self-order: supports `prefers-color-scheme` like portal/shop |
| 17 | Self-order token integration | Milo | `pos_self_order/static/src/app/primary_variables.scss`: import from shared web token system. Override self-order specific values for brand accent, font scale (larger), radius (more generous) |
| 18 | Regression QA | Ivy | Test: open restaurant POS, view floor plan, seat guests at table, send order to kitchen, view kitchen display, request bill. Open self-order on mobile, browse menu, customize item, place order, view status screen. Test kiosk mode |

---

## Work Schedule

### Phase 1: Audits (Tasks 1–2)
- Both module audits
- **Checkpoint commit**: `sprint-20: audit docs for restaurant and self-order`

### Phase 2: Restaurant Floor Plan (Tasks 3–8)
- Tables, layout, indicators, panel, kitchen display, routing
- **Checkpoint commit**: `sprint-20: restaurant floor plan and kitchen display`

### Phase 3: Self-Order App (Tasks 9–15)
- Landing, categories, product grid, detail, cart, order status, kiosk
- **Checkpoint commit**: `sprint-20: self-order kiosk app`

### Phase 4: Polish & QA (Tasks 16–18)
- Dark mode, token integration, QA
- **Final commit**: `sprint-20: POS restaurant and self-order QA signoff`

---

## Design Specifications

### Floor Plan Table States
```
Available:        var(--o-gray-200) bg, var(--o-gray-700) text
Occupied (order): var(--o-brand-action) at 20% opacity bg, var(--o-brand-action) text
Bill requested:   #f59e0b (amber) at 20% opacity bg, #92400e text
Tables + guests:  table-number: 20px/700, guest-count: 12px/400 below
```

### Self-Order Product Card
```
Border-radius: 12px
Image ratio:   4:3
Name:          15px / 500 / 2-line-clamp
Price:         16px / 700 / var(--o-brand-action)
Add button:    44px circle, brand-primary, bottom-right corner, absolute
```

### Kiosk Touch Targets
```
Minimum touch target: 64px × 64px (more generous than 54px for public kiosk)
Category tab height:  56px
CTA buttons:          64px height
Product cards:        minimum 200px wide
```

---

## Success Criteria

- [ ] Floor plan shows tables with correct status colors
- [ ] Floor plan has dark canvas background with subtle grid
- [ ] Occupied tables show elapsed time and order count badge
- [ ] Table detail panel slides in from right
- [ ] Kitchen display shows ticket cards with status colors and timer
- [ ] Self-order landing has large CTA and brand imagery support
- [ ] Self-order categories are horizontal scroll pills
- [ ] Self-order product grid is 2/3 column responsive
- [ ] Product customization is a bottom sheet with pill selectors
- [ ] Cart has line items + "Place Order" button
- [ ] Order status shows animated step timeline
- [ ] Kiosk mode has 64px touch targets and idle animation
- [ ] Self-order uses shared web design tokens
- [ ] Ivy QA sign-off

---

## What's NOT in This Sprint

| Feature | Reason |
|---------|--------|
| POS Customer Display (2nd screen) | Separate hardware output, own sprint scope |
| Loyalty / points UI | Feature, not UI system |
| Self-order payment integration UI | Complex, functional change |
| Kitchen Display functionality | UI only — routing logic unchanged |
| Table reservation / booking | Separate module |

---

## Agent Prompt

> Read `PROJECT_BRIEF.md`, then read `doc/sprint-20-plan.md`. You are **Milo** (CSS/art director).
>
> Execute Sprint 20: POS Restaurant & Self-Order Kiosk.
>
> First: `git pull origin 19.0 && git checkout -b feature/sprint-20`
>
> This sprint covers TWO separate modules. Start with BOTH audits (Tasks 1–2) before writing any SCSS.
>
> **Touch target rule is STRICT**: 64px minimum in kiosk mode, 54px everywhere else in POS. This is a safety requirement — do not compromise it.
>
> The floor plan (Tasks 3–5) uses a dark background with lighter table objects — this is inverted from the normal light UI. Design with this contrast in mind.
>
> The self-order app (Tasks 9–15) is essentially a mobile-first public-facing app. Think like the eCommerce sprint (Sprint 18) but even more touch-focused.
>
> Commit after each phase. Update `doc/sprint-20-progress.md` after each commit.
> When done: `git push origin feature/sprint-20` and open a PR. Tag Ivy for QA.

---

## Progress Tracker

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Restaurant module audit | ⬜ Not started | |
| 2 | Self-order audit | ⬜ Not started | |
| 3 | Floor plan — table objects | ⬜ Not started | |
| 4 | Floor plan — layout | ⬜ Not started | |
| 5 | Floor plan — occupied indicators | ⬜ Not started | |
| 6 | Table detail panel | ⬜ Not started | |
| 7 | Kitchen display styling | ⬜ Not started | |
| 8 | Order routing indicators | ⬜ Not started | |
| 9 | Self-order landing | ⬜ Not started | |
| 10 | Self-order menu categories | ⬜ Not started | |
| 11 | Self-order product grid | ⬜ Not started | |
| 12 | Self-order product detail | ⬜ Not started | |
| 13 | Self-order cart | ⬜ Not started | |
| 14 | Self-order order status | ⬜ Not started | |
| 15 | Kiosk mode optimizations | ⬜ Not started | |
| 16 | Dark mode (restaurant + self-order) | ⬜ Not started | |
| 17 | Self-order token integration | ⬜ Not started | |
| 18 | Regression QA | ⬜ Not started | |
