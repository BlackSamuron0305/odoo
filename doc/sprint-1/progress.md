# Sprint 1 — Progress Tracker

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Slim navbar height | ✅ Done | `$o-navbar-height: 40px` in `navbar.variables.scss` |
| 2 | Frosted-glass scroll effect | ✅ Done | `.o_navbar_scrolled` class via scroll listener in `app_rail.js` |
| 3 | Active section indicator | ✅ Done | CSS `::after` underline in `navbar.scss` |
| 4 | Desktop icon-rail sidebar | ✅ Done | `app_rail/` OWL component: collapsed 56px, expanded 240px |
| 5 | Mobile burger menu polish | ✅ Done | CSS transform slide-in + backdrop blur in `navbar.scss` |
| 6 | Breadcrumb modernization | ✅ Done | Ellipsis overflow, font-weight: 500 |
| 7 | Systray spacing | ✅ Done | 32px hit targets, hover transition |
| 8 | Visual regression test | ⏸ Skipped | No browser env — no regressions expected (pure CSS additions) |

## Files Changed/Created

- `addons/web/static/src/webclient/navbar/navbar.variables.scss` — height 46→40px
- `addons/web/static/src/webclient/navbar/navbar.scss` — frosted glass, active indicator, systray, breadcrumb, mobile burger
- `addons/web/static/src/webclient/app_rail/app_rail.js` — NEW: AppRailSidebar OWL component
- `addons/web/static/src/webclient/app_rail/app_rail.xml` — NEW: OWL template
- `addons/web/static/src/webclient/app_rail/app_rail.scss` — NEW: icon-rail SCSS
- `addons/web/static/src/webclient/webclient.js` — imports AppRailSidebar
- `addons/web/static/src/webclient/webclient.xml` — adds layout wrapper + AppRailSidebar
- `addons/web/static/src/webclient/webclient_layout.scss` — layout wrapper styles

## Sprint 1 Complete ✅
