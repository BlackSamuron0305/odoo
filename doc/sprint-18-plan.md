# Sprint 18 — eCommerce Shop Frontend

> Sprint Goal: Modernize the Odoo eCommerce customer-facing shop — product grid, product detail, shopping cart, checkout flow, and category navigation — creating a conversion-optimized, visually polished storefront that matches the quality of dedicated eCommerce platforms.
> Branch: `feature/sprint-18`
> Depends on: Sprint 17 (portal foundation, token integration, login page)

---

## Context

Odoo eCommerce (`addons/website_sale/`) is a standalone module that adds a full online shop to an Odoo website. It is distinct from the portal (Sprint 17) — it's the public-facing shop that anonymous visitors see, browse, and buy from.

Key pages:
- `/shop` — product grid (homepage of the shop)
- `/shop/[product-slug]` — product detail page
- `/shop/cart` — shopping cart
- `/shop/checkout` — checkout form
- `/web/login?redirect=/shop/cart` — the login-to-checkout flow

These pages are rendered via Jinja2 templates with Bootstrap. The SCSS is in `addons/website_sale/static/src/scss/`. The goal is a modern, trust-building retail experience.

**Files in scope:**
- `addons/website_sale/static/src/scss/website_sale.scss` — main shop stylesheet
- `addons/website_sale/static/src/scss/website_sale_frontend.scss` — frontend-specific
- `addons/website_sale/static/src/scss/product_tile.scss` — product card
- `addons/website_sale/static/src/scss/kanban_record.scss` — alternative product grid
- `addons/website_sale/static/src/scss/primary_variables.scss` — shop variables
- `addons/website_sale/static/src/scss/website_sale.editor.scss` — editor styles

---

## Prioritized Task List

| # | Task | Owner | Description |
|---|------|-------|-------------|
| 1 | Shop audit | Milo | Map all SCSS selectors, identify which pages each selector affects. Identify hardcoded colors and non-token values. Document in `doc/sprint-18-audit.md` |
| 2 | Shop token integration | Milo | `website_sale/static/src/scss/primary_variables.scss`: import web token system, expose `--o-*` CSS custom properties. Override shop-specific values: `--o-shop-card-radius: 12px`, `--o-shop-accent: var(--o-brand-action)` (using the teal action color `#017e84` as shop accent instead of purple — more commercial feel) |
| 3 | Product tile / card | Milo | `product_tile.scss`: full redesign. Card: `border-radius: var(--o-shop-card-radius)`, `border: 1px solid var(--o-gray-200)`, no shadow (shadow appears on hover). Product image: fills card top, `aspect-ratio: 4/3`, `object-fit: cover`, `border-radius: var(--o-shop-card-radius) var(--o-shop-card-radius) 0 0`. Product name: 14px/500, 2-line clamp. Price: 16px/700, shop-accent color. Old price: line-through gray. "Add to Cart" button: appears on hover with Sprint 11 animation, full-width at card bottom |
| 4 | Product card hover state | Milo | On card hover: `box-shadow: var(--o-shadow-md)`, `transform: translateY(-2px)` (Sprint 11 pattern), border-color → `var(--o-gray-300)`. "Add to Cart" button slides up from bottom (overflow hidden on card). Image zooms subtly: `transform: scale(1.04)` with Sprint 11 duration |
| 5 | Product badge overlays | Milo | On product image: badges (New, Sale, Out of Stock, Low Stock). Position: top-left, `8px` from edges. Style: pill badge, `border-radius: 999px`, `font-size: 11px`, `font-weight: 600`. Sale: red. New: green. Out of stock: gray with diagonal CSS striping overlay on image |
| 6 | Product grid layout | Milo | Shop grid: `display: grid`, `grid-template-columns: repeat(auto-fill, minmax(240px, 1fr))`, `gap: 24px`. 4 columns on desktop, 3 on tablet, 2 on mobile, 1 on small mobile. Category sidebar: 240px, sticky. Products area: fills remaining width |
| 7 | Category sidebar | Milo | Left sidebar: category tree with indentation per level. Active category: brand-tinted background. Expand/collapse categories: animated chevron (Sprint 11). Price range slider: brand-primary track color. Attribute filters (Color, Size, etc.): swatch circles for colors, pill buttons for sizes |
| 8 | Product detail page | Milo | Product detail: two-column layout. Left: image gallery (main image 480px × 480px + thumbnail strip below). Right: product name (h1), price (large + bold, shop-accent), availability badge, description, variants (size/color as pill/swatch selectors), quantity input (sprint 2b numeric field), "Add to Cart" + "Buy Now" buttons |
| 9 | Product image gallery | Milo | Image gallery: main image with zoom on hover (magnifier cursor). Thumbnails: horizontal strip, active = brand border. Mobile: swipe-able carousel. `border-radius: 8px` on all images |
| 10 | Variant selector | Milo | Color variants: circular swatches (32px), border on selected, tooltip with color name. Size variants: pill buttons (sprint 2b field widget style). Out-of-stock variant: diagonal strikethrough CSS on the swatch/pill. Selected summary: "Selected: Red, Size M" text below selectors |
| 11 | Quantity input | Milo | Quantity stepper: `−` button + number input + `+` button in a horizontal group. Buttons: 36px × 36px, `border-radius: 6px`. Input: 60px wide, centered text. Brand-primary on hover |
| 12 | Add to Cart button | Milo | Primary CTA: full-width, 48px height (touch-safe), shop-accent color, cart icon + "Add to Cart" text. Click animation: Sprint 11 scale press. Loading state: spinner replaces text while adding. Success state: `✓ Added` with brief green flash before reverting to "Add to Cart" |
| 13 | Shopping cart | Milo | Cart page: line items table (product thumbnail 64px + name + variant + quantity stepper + unit price + line total). Sticky order summary sidebar (right, 320px): subtotal, estimated tax, "Proceed to Checkout" button. Empty cart: Sprint 16 empty state with shopping bag illustration |
| 14 | Checkout form | Milo | Multi-step checkout (or single-page). Steps indicator: numbered pills at top (1 Address, 2 Shipping, 3 Payment, 4 Confirm). Input fields: Sprint 12 form inputs (44px height for touch). Section headings: Sprint 12 h3. Address block: card with `border-radius: 8px`, selection radio on left. Shipping methods: card selection. Payment: card form styled like Sprint 17 payment |
| 15 | Order confirmation page | Milo | `/shop/confirmation`: success illustration (Sprint 16 — checkmark in brand circle). "Your order is confirmed!" heading. Order number: monospace pill. Estimated delivery date. "Continue Shopping" button. Links to track order in portal |
| 16 | Search results in shop | Milo | Shop search bar: wider than the general Odoo search (full-width on mobile), positioned in shop header. Results page: same product grid. "Results for: 'office chair'" heading. Zero results: Sprint 16 empty state with search illustration |
| 17 | Mobile shop experience | Milo | Mobile-first for the shop (unlike the backend). Product grid: 2-column, cards 160px wide. Product detail: single column, image full-width. Cart: simplified single column. Bottom bar on product detail: sticky "Add to Cart" button. Swipe gestures on image gallery |
| 18 | Shop dark mode | Milo | The shop should respect `prefers-color-scheme` like portal (Sprint 17). Product cards in dark mode: `var(--o-gray-800)` background. Images look fine. Price/badge colors maintained for readability. White-text on dark-image badges |
| 19 | Regression QA | Ivy | Test complete shop flow: browse products, filter by category + attribute, view product detail, select variants, add to cart, checkout, order confirmation. Test on mobile. Test dark mode via system preference |

---

## Work Schedule

### Phase 1: Tokens & Product Card (Tasks 1–5)
- Audit, token integration, product tile design, hover, badges
- **Checkpoint commit**: `sprint-18: product card and badge design`

### Phase 2: Grid & Navigation (Tasks 6–7)
- Product grid layout, category sidebar, filters
- **Checkpoint commit**: `sprint-18: product grid and category navigation`

### Phase 3: Product Detail (Tasks 8–12)
- Detail page, gallery, variants, quantity, cart button
- **Checkpoint commit**: `sprint-18: product detail page`

### Phase 4: Cart & Checkout (Tasks 13–15)
- Cart, checkout form, order confirmation
- **Checkpoint commit**: `sprint-18: cart and checkout flow`

### Phase 5: Polish & QA (Tasks 16–19)
- Search, mobile, dark mode, QA
- **Final commit**: `sprint-18: ecommerce QA signoff`

---

## Design Specifications

### Product Card
```
Border-radius: 12px
Border:        1px solid var(--o-gray-200), hover: var(--o-gray-300)
Shadow:        none (light), var(--o-shadow-md) on hover
Image ratio:   4:3
Name:          14px / 500 / 2-line clamp / overflow hidden
Price:         16px / 700 / var(--o-shop-accent)
CTA button:    40px height, appears on hover, full card width
```

### Checkout Step Indicator
```
Step circle:  28px, border-radius: 50%
Active:       var(--o-brand-primary) fill, white text
Completed:    var(--o-brand-primary) fill, white checkmark
Upcoming:     var(--o-gray-300) fill, var(--o-gray-500) text
Connector:    2px line between steps, brand-primary when completed
```

---

## Success Criteria

- [ ] Shop uses `--o-*` CSS custom properties and shop-specific token overrides
- [ ] Product cards have image, name, price, and hover "Add to Cart" CTA
- [ ] Product card hover has elevation and image zoom
- [ ] Product badges (Sale, New, Out of Stock) appear on image
- [ ] Product grid is responsive (1-4 columns depending on viewport)
- [ ] Category sidebar with filter controls is sticky
- [ ] Product detail has two-column layout with gallery and variant selectors
- [ ] Color swatches and size pill buttons show out-of-stock state
- [ ] Add to Cart shows loading → success state
- [ ] Cart page has line items table and sticky summary
- [ ] Checkout has step indicator and card-based form sections
- [ ] Order confirmation has success illustration
- [ ] Mobile shop is 2-column grid with sticky cart button on product detail
- [ ] Dark mode via `prefers-color-scheme` works throughout
- [ ] Ivy QA sign-off

---

## What's NOT in This Sprint

| Feature | Reason |
|---------|--------|
| Product configurator | Complex JS, separate concern |
| Wishlist UI | Feature, not visual system |
| Product comparison | Feature, not visual system |
| Website builder block editing | Sprint 19 |
| eCommerce backend views | Covered by Sprint 3 (list/kanban) already |

---

## Agent Prompt

> Read `PROJECT_BRIEF.md`, then read `doc/sprint-18-plan.md`. You are **Milo** (CSS/art director).
>
> Execute Sprint 18: eCommerce Shop Frontend.
>
> First: `git pull origin 19.0 && git checkout -b feature/sprint-18`
>
> This sprint is SCSS-only. No JS, no XML template changes.
>
> The shop has its own token system that must be integrated with the web token system (Task 2). Do this before any other styling work — otherwise you'll hard-code values you'll need to clean up.
>
> The product card (Tasks 3–5) is the hero component — it appears on every page of the shop. Spend the most time here. Get the hover animation right.
>
> Use `--o-shop-accent: var(--o-brand-action)` (`#017e84` teal) as the primary action color in the shop, not the purple brand-primary. This is a deliberate product decision — teal reads as "commercial/trust" better than purple for eCommerce.
>
> Commit after each phase. Update `doc/sprint-18-progress.md` after each commit.
> When done: `git push origin feature/sprint-18` and open a PR. Tag Ivy for QA.

---

## Progress Tracker

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Shop audit | ⬜ Not started | |
| 2 | Shop token integration | ⬜ Not started | |
| 3 | Product tile / card | ⬜ Not started | |
| 4 | Product card hover | ⬜ Not started | |
| 5 | Product badge overlays | ⬜ Not started | |
| 6 | Product grid layout | ⬜ Not started | |
| 7 | Category sidebar | ⬜ Not started | |
| 8 | Product detail page | ⬜ Not started | |
| 9 | Product image gallery | ⬜ Not started | |
| 10 | Variant selector | ⬜ Not started | |
| 11 | Quantity input | ⬜ Not started | |
| 12 | Add to Cart button | ⬜ Not started | |
| 13 | Shopping cart | ⬜ Not started | |
| 14 | Checkout form | ⬜ Not started | |
| 15 | Order confirmation page | ⬜ Not started | |
| 16 | Search results in shop | ⬜ Not started | |
| 17 | Mobile shop experience | ⬜ Not started | |
| 18 | Shop dark mode | ⬜ Not started | |
| 19 | Regression QA | ⬜ Not started | |
