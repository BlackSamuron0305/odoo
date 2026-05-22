# Sprint 0 — Design Token Audit

## All `$o-*` SCSS Variables (from `primary_variables.scss`)

| Variable | Value | CSS Custom Property | Category |
|----------|-------|---------------------|----------|
| `$o-frontend-min-contrast-ratio` | `2.9` | — | Accessibility |
| `$o-webclient-color-scheme` | `bright` | `--o-webclient-color-scheme` | Color scheme |
| `$o-root-font-size` | `1rem` | — | Typography |
| `$o-font-size-base` | `o-to-rem(14px)` | `--o-font-size-base` | Typography |
| `$o-font-size-base-touch` | `o-to-rem(16px)` | `--o-font-size-base-touch` | Typography |
| `$o-font-size-base-small` | `o-to-rem(13px)` | `--o-font-size-base-small` | Typography |
| `$o-font-size-base-smaller` | `o-to-rem(12px)` | `--o-font-size-base-smaller` | Typography |
| `$o-line-height-base` | `1.5` | `--o-line-height-base` | Typography |
| `$o-line-height-sm` | `1.25` | — | Typography |
| `$o-line-height-lg` | `2` | — | Typography |
| `$o-font-weight-normal` | `400` | `--o-font-weight-normal` | Typography |
| `$o-font-weight-medium` | `500` | `--o-font-weight-medium` | Typography |
| `$o-font-weight-bold` | `700` | `--o-font-weight-bold` | Typography |
| `$o-white` | `#FFFFFF` | — | Color |
| `$o-black` | `#000000` | — | Color |
| `$o-gray-100` | `#f8f9fa` | `--o-gray-100` | Gray scale |
| `$o-gray-200` | `#e9ecef` | `--o-gray-200` | Gray scale |
| `$o-gray-300` | `#dee2e6` | `--o-gray-300` | Gray scale |
| `$o-gray-400` | `#ced4da` | `--o-gray-400` | Gray scale |
| `$o-gray-500` | `#adb5bd` | `--o-gray-500` | Gray scale |
| `$o-gray-600` | `#6c757d` | `--o-gray-600` | Gray scale |
| `$o-gray-700` | `#495057` | `--o-gray-700` | Gray scale |
| `$o-gray-800` | `#343a40` | `--o-gray-800` | Gray scale |
| `$o-gray-900` | `#212529` | `--o-gray-900` | Gray scale |
| `$o-community-color` | `#71639e` | `--o-community-color` | Brand |
| `$o-enterprise-color` | `#714B67` | `--o-enterprise-color` | Brand |
| `$o-enterprise-action-color` | `#017e84` | `--o-enterprise-action-color` | Brand |
| `$o-brand-odoo` | `$o-community-color` | `--o-brand-odoo` | Brand |
| `$o-brand-primary` | `$o-community-color` | `--o-brand-primary` | Brand |
| `$o-brand-secondary` | `#8f8f8f` | `--o-brand-secondary` | Brand |
| `$o-brand-lightsecondary` | `$o-gray-100` | — | Brand |
| `$o-action` | `$o-brand-primary` | `--o-action-color` | Brand |
| `$o-success` | `#28a745` | `--o-success` | Status |
| `$o-info` | `#17a2b8` | `--o-info` | Status |
| `$o-warning` | `#ffac00` | `--o-warning` | Status |
| `$o-danger` | `#dc3545` | `--o-danger` | Status |
| `$o-opacity-disabled` | `0.5` | — | Opacity |
| `$o-opacity-muted` | `0.76` | — | Opacity |
| `$o-main-text-color` | `$o-gray-900` | `--o-main-text-color` | UI |
| `$o-main-color-muted` | `rgba($o-gray-700, 0.76)` | — | UI |
| `$o-main-headings-color` | `$o-black` | — | UI |
| `$o-main-link-color` | `darken($o-brand-primary, 5%)` | `--o-main-link-color` | UI |
| `$o-main-favorite-color` | `#f3cc00` | `--o-main-favorite-color` | UI |
| `$o-main-code-color` | `#d2317b` | — | UI |
| `$o-component-active-color` | `$o-black` | — | UI |
| `$o-component-active-bg` | `mix($o-action, $o-gray-100, 20%)` | `--o-component-active-bg` | UI |
| `$o-component-active-border` | `$o-action` | `--o-component-active-border` | UI |
| `$o-view-background-color` | `white` | `--o-view-background-color` | UI |
| `$o-shadow-color` | `#303030` | — | UI |
| `$o-input-padding-y` | `2px` | — | Forms |
| `$o-input-padding-x` | `4px` | — | Forms |
| `$o-input-bg` | `transparent` | — | Forms |
| `$o-input-border-required` | `$o-brand-primary` | — | Forms |
| `$o-spacer` | `16px` | `--o-spacer` | Spacing |
| `$o-form-spacing-unit` | `5px` | `--o-form-spacing-unit` | Spacing |
| `$o-horizontal-padding` | `$o-spacer` | `--o-horizontal-padding` | Spacing |
| `$o-dropdown-hpadding` | `20px` | `--o-dropdown-hpadding` | Spacing |
| `$o-dropdown-vpadding` | `3px` | — | Spacing |
| `$o-dropdown-max-height` | `70vh` | — | Spacing |
| `$o-statbutton-height` | `44px` | — | Components |
| `$o-statbutton-spacing` | `6px` | — | Components |
| `$o-modal-lg` | `980px` | — | Components |
| `$o-modal-md` | `650px` | — | Components |
| `$o-statusbar-height` | `33px` | — | Components |
| `$o-border-radius` | `o-to-rem(4px)` | `--o-border-radius` | Radius |
| `$o-border-radius-sm` | `o-to-rem(3px)` | `--o-border-radius-sm` | Radius |
| `$o-border-radius-lg` | `o-to-rem(6px)` | `--o-border-radius-lg` | Radius |
| `$o-easing-enter` | `cubic-bezier(0.05,0.7,0.1,1)` | `--o-easing-enter` | Animation |
| `$o-easing-exit` | `cubic-bezier(0.3,0.0,0.8,0.15)` | `--o-easing-exit` | Animation |

## New tokens added in Sprint 0 (no SCSS equivalent)

| CSS Custom Property | Value | Purpose |
|---------------------|-------|---------|
| `--o-border-radius-xl` | `0.5rem (8px)` | Larger radius for cards/sheets |
| `--o-border-radius-full` | `9999px` | Pill shapes |
| `--o-shadow-sm` | `0 1px 2px rgba(0,0,0,0.06)` | Card resting shadow |
| `--o-shadow-md` | `0 2px 8px rgba(0,0,0,0.10)` | Hover elevation |
| `--o-shadow-lg` | `0 4px 20px rgba(0,0,0,0.14)` | Dialogs/modals |
| `--o-transition-fast` | `100ms` | Quick interactions |
| `--o-transition-base` | `150ms` | Standard transitions |
| `--o-transition-slow` | `200ms` | Panel slides |
| `--o-navbar-height-slim` | `40px` | Sprint 1 slim navbar |
| `--o-zindex-navbar` | `1000` | Z-index scale |
| `--o-zindex-sidebar` | `1010` | Z-index scale |
| `--o-zindex-dropdown` | `1020` | Z-index scale |
| `--o-zindex-modal` | `1050` | Z-index scale |
| `--o-zindex-popover` | `1070` | Z-index scale |
| `--o-zindex-tooltip` | `1080` | Z-index scale |

## Bootstrap Version

Bootstrap 5.3 is already installed in the repo (`addons/web/static/lib/bootstrap/`).
`$enable-dark-mode: false` is set in `bootstrap_overridden.scss` — dark mode will be enabled in Sprint 4.

## Notes

- All `$o-*` variables preserved exactly — zero visual change this sprint
- Dark mode `[data-bs-theme="dark"]` block scaffolded but INERT until Sprint 4
- `tokens/_tokens.scss` and `tokens/tokens.ts` generated by `node tokens/build.js`
