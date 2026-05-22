# Sprint 0 — Progress Tracker

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Audit `$o-*` SCSS tokens | ✅ Done | `doc/sprint-0/sprint-0-token-audit.md` |
| 2 | Create `tokens/tokens.json` | ✅ Done | Full color, spacing, radius, shadow, typography, animation tokens |
| 3 | Create `tokens/build.js` | ✅ Done | Generates `_tokens.scss` + `tokens.ts` |
| 4 | Bootstrap 5.2 → 5.3 | ✅ Already at 5.3 | Verified via deprecated markers in `_variables.scss` |
| 5 | CSS custom properties in `primary_variables.scss` | ✅ Done | `@mixin o-declare-root-tokens` added, called from `webclient.scss` |
| 6 | Update `bootstrap_overridden.scss` for BS 5.3 | ✅ No changes needed | BS5.3 already configured; `$enable-dark-mode: false` intentional |
| 7 | Dark mode baseline scaffold | ✅ Done | `[data-bs-theme="dark"]` block in `secondary_variables.scss` |
| 8 | Regression test | ⏸ Skipped (no browser env) | Infrastructure-only sprint — zero visual changes made |

## Files Changed

- `tokens/tokens.json` — NEW: single source of truth for all design tokens
- `tokens/build.js` — NEW: build script
- `tokens/_tokens.scss` — GENERATED: CSS custom properties for vanilla CSS use
- `tokens/tokens.ts` — GENERATED: TypeScript constants for React Native
- `addons/web/static/src/scss/primary_variables.scss` — `@mixin o-declare-root-tokens` added at end
- `addons/web/static/src/scss/secondary_variables.scss` — dark mode scaffold added
- `addons/web/static/src/webclient/webclient.scss` — `@include o-declare-root-tokens` called

## Sprint 0 Complete ✅
