# Sprint 22 — Accessibility Audit, RTL Support & Final Polish

> Sprint Goal: Achieve WCAG 2.1 AA compliance across the entire UI, ensure full RTL (right-to-left) language support for Arabic/Hebrew locales, complete keyboard navigation for all interactive elements, and ship the final cross-browser and cross-device polish pass that closes out the v2 UI upgrade.
> Branch: `feature/sprint-22`
> Depends on: All previous sprints (11–21). This is the final sprint.

---

## Context

This is the **closing sprint** of the UI upgrade project. After 21 sprints of design system building, component redesigns, and surface coverage, this sprint audits everything and fixes what's left. It is deliberately broad and cross-cutting.

**Three main work areas:**

1. **Accessibility (a11y)**: Automated + manual audit of WCAG 2.1 AA across all upgraded surfaces. Fix contrast ratios, add missing ARIA attributes, ensure focus management, test with screen readers.

2. **RTL Support**: Odoo supports Arabic, Hebrew, Urdu, and other RTL locales. Every Sprint 11–21 visual change must work correctly in RTL. SCSS changes must use logical properties or explicit RTL overrides.

3. **Final Polish**: Typography micro-corrections, spacing consistency sweep, cross-browser regression, dark mode edge cases, and any quality issues filed by Ivy during previous sprints.

**Tools:**
- axe-core browser extension for automated a11y audit
- Chrome DevTools accessibility tree
- NVDA (Windows) + VoiceOver (macOS) for screen reader testing
- BrowserStack or local VMs for cross-browser testing
- Odoo lang setting → Arabic (`ar`) for RTL testing

---

## Prioritized Task List

| # | Task | Owner | Description |
|---|------|-------|-------------|
| 1 | Automated a11y audit — backend | Ivy + Milo | Run axe-core on all major backend views: Navbar, Form, List, Kanban, Settings, Discuss, Data views. Export violations list. Triage: each violation is Critical/Serious/Moderate/Minor. Create `doc/sprint-22-a11y-violations.md` with full list |
| 2 | Automated a11y audit — portal + shop | Ivy + Milo | Run axe-core on portal home, invoice detail, login page, shop product grid, product detail, checkout. Export violations. Add to `doc/sprint-22-a11y-violations.md` |
| 3 | Color contrast fixes | Milo | Fix all contrast violations found in Tasks 1–2. Common issues expected: gray text on white background below 4.5:1, brand-primary on white links (check if Sprint 12 link color meets contrast), placeholder text color, inactive tab text, disabled button text. Adjust only the values that fail — not a full redesign |
| 4 | Focus management — keyboard navigation | Nova | Audit: Tab through all major views. Issues expected: modal dialog does not trap focus (if unfixed), kanban drag-and-drop no keyboard alternative, date picker not keyboard accessible. Fix: modals must trap focus + restore on close. Skip-to-content link at top of page. Focus visible on all interactive elements |
| 5 | Skip navigation link | Nova | Add "Skip to main content" link as first focusable element in the page. Visually hidden until focused (CSS: `position: absolute; left: -999px; top: 0; transform: none` when focused). Links to `#o_main_content`. This is a WCAG 2.1 Level A requirement |
| 6 | ARIA attributes audit | Nova | Scan all OWL components added in Sprints 11–21 for missing ARIA. Checklist: icon buttons have `aria-label`, expandable sections have `aria-expanded`, loading states have `aria-busy`, alerts have `role="alert"`, modals have `role="dialog"` + `aria-modal="true"`, form inputs have `aria-describedby` for error messages |
| 7 | Screen reader testing — backend | Ivy + Nova | Test with NVDA+Chrome and VoiceOver+Safari: navigate the backend using only keyboard + screen reader. Target: Form view (fill and save), List view (navigate records), Kanban (understand board structure), Settings (change a toggle). File issues for any incomprehensible announcements |
| 8 | Screen reader testing — portal | Ivy + Nova | Test portal: view invoice, download PDF, sign quote. Verify all buttons have meaningful labels when announced |
| 9 | High contrast mode | Milo | Test all UI in Windows High Contrast Mode (black theme). Add `@media (forced-colors: active)` CSS rules for: focus rings (use `Highlight` system color), button borders (visible in forced colors), status badges (border visible). Icons: ensure they remain visible |
| 10 | RTL audit — backend core | Milo | Switch Odoo language to Arabic. Test: Navbar layout (logo right, actions left), AppRailSidebar (appears right side), Form sheet (text alignment, field layout), List (sort direction), Kanban (column order), Breadcrumb (reversed order), Dropdown (opens correctly) |
| 11 | RTL — new Sprint 11–16 components | Milo | Test all components added since Sprint 5b: Skeleton loader (neutral — OK), View enter animation (neutral), Discuss app sidebar (should be right side in RTL), Discuss message bubbles (sent = left, received = right in RTL), Empty state (neutral), Error pages (text alignment) |
| 12 | RTL — portal and shop | Milo | Test portal and shop in RTL: portal sidebar (right side), document detail (right-to-left reading), shop product grid (neutral), shop checkout (address form, input labels) |
| 13 | RTL SCSS fixes | Milo | Fix all RTL issues found in Tasks 10–12. Strategy: where possible use CSS logical properties (`margin-inline-start` instead of `margin-left`, `padding-inline-end` instead of `padding-right`, `inset-inline-start` instead of `left`). For complex cases, add `[dir="rtl"] .selector` overrides |
| 14 | Dark mode edge cases | Milo | Final dark mode sweep. Known edge case categories: images with white backgrounds look harsh in dark mode → add `mix-blend-mode: multiply` to product images in dark mode. CSS `background-image` gradients → check all sprint-added gradients have dark equivalents. Transparent overlays with wrong opacity |
| 15 | Cross-browser final check — Chrome | Ivy | Full visual regression in Chrome 120+: compare against screenshot baseline. Flag any regressions introduced in Sprints 11–21 |
| 16 | Cross-browser final check — Firefox | Ivy | Full visual regression in Firefox 120+. Note: Firefox renders `backdrop-filter` differently. Firefox font rendering differs slightly. Fix any regressions |
| 17 | Cross-browser final check — Safari | Ivy | Safari 17+: CSS Grid, `backdrop-filter`, `color-scheme`, `forced-colors` support differences. Test on real macOS (not just iOS). Fix any regressions |
| 18 | Mobile web final check | Ivy | Test all web surfaces at 375px (iPhone SE) and 430px (iPhone Pro Max): navbar, form view, list view, kanban, portal, shop, Discuss. Verify touch targets ≥ 44px on all views except POS (54px) |
| 19 | Typography micro-corrections | Milo | Final pass: visual scan of every screen looking for: inconsistent font weights, wrong heading levels, orphaned lines, line-height inconsistencies in form labels, monospace fields without background badge, truncation that's too aggressive |
| 20 | Spacing consistency sweep | Milo | Visual scan: inconsistent padding between sections, components that don't align to the 4px grid, cards with inconsistent padding, icon misalignment. Use browser DevTools to measure and correct |
| 21 | Sprint 11–21 cleanup | Milo + Nova | Review all sprint branches for: TODO comments not addressed, debug CSS left in, `!important` overrides that can be removed, duplicate selectors, unused CSS variables |
| 22 | Final Hoot tests | Nova | Add Hoot accessibility tests: assert all buttons have aria-label, assert modals trap focus, assert skip link exists. Add to `addons/web/static/tests/ui_upgrade/ui_upgrade.test.js` from Sprint 10 |
| 23 | v2 QA signoff document | Ivy | Write `doc/sprint-22/v2-final-signoff.md`. Includes: summary of all 12 sprints (11–22), a11y test results, RTL test results, cross-browser matrix, known remaining issues with severity, recommendation for production deployment |

---

## Work Schedule

### Phase 1: Accessibility Audit & Fixes (Tasks 1–9)
- Automated audits, contrast, focus, ARIA, screen readers, high contrast
- **Checkpoint commit**: `sprint-22: accessibility audit and WCAG 2.1 AA fixes`

### Phase 2: RTL Support (Tasks 10–13)
- Backend + new components + portal/shop RTL audit and SCSS fixes
- **Checkpoint commit**: `sprint-22: RTL support for all surfaces`

### Phase 3: Dark Mode & Cross-Browser (Tasks 14–18)
- Dark mode edge cases, Chrome/Firefox/Safari/Mobile regression
- **Checkpoint commit**: `sprint-22: dark mode and cross-browser final`

### Phase 4: Final Polish (Tasks 19–22)
- Typography micro-corrections, spacing sweep, cleanup, Hoot tests
- **Checkpoint commit**: `sprint-22: final polish and cleanup`

### Phase 5: Signoff (Task 23)
- Final signoff document
- **Final commit**: `sprint-22: v2 UI upgrade final QA signoff`

---

## WCAG 2.1 AA Checklist

| Criterion | Level | Test Method |
|-----------|-------|-------------|
| 1.4.3 Contrast (Normal text) | AA | 4.5:1 minimum — axe-core + manual |
| 1.4.11 Non-text contrast | AA | 3:1 for UI components — axe-core |
| 2.1.1 Keyboard | A | Tab through all views |
| 2.4.7 Focus Visible | AA | Visible outline on all interactive elements |
| 2.4.1 Bypass Blocks | A | Skip navigation link |
| 4.1.2 Name, Role, Value | A | ARIA audit — all interactive elements |
| 2.4.3 Focus Order | A | Logical tab order in modals/dialogs |
| 1.3.4 Orientation | AA | Works in portrait + landscape |
| 2.5.3 Label in Name | A | Button visual label matches accessible name |

---

## Success Criteria

- [ ] axe-core reports 0 Critical and 0 Serious violations across all major views
- [ ] All normal text meets 4.5:1 contrast ratio
- [ ] All interactive elements have visible focus indicator
- [ ] Skip-to-main-content link present and functional
- [ ] Modals trap focus and restore on close
- [ ] All icon buttons have `aria-label`
- [ ] Loading states have `aria-busy="true"`
- [ ] `@media (forced-colors: active)` rules applied
- [ ] Backend UI fully functional in Arabic (RTL) locale
- [ ] Portal and shop work correctly in RTL
- [ ] All Sprint 11–21 components verified in RTL
- [ ] Dark mode works correctly across all Sprint 11–21 surfaces
- [ ] Chrome, Firefox, Safari: 0 visual regressions
- [ ] Mobile web: all touch targets ≥ 44px
- [ ] Final Hoot a11y tests passing
- [ ] `doc/sprint-22/v2-final-signoff.md` exists and is approved by Ivy

---

## What's NOT in This Sprint

| Feature | Reason |
|---------|--------|
| WCAG 2.1 AAA compliance | AA is the target; AAA is aspirational |
| Screen reader optimization for data tables | Specialist work beyond general a11y |
| Right-to-left mirroring of SVG illustrations | Sprint 16 illustrations are conceptual — not arrow/direction-dependent |
| Automated screenshot diff CI | Infrastructure sprint (not planned for v2) |
| IE11 / legacy browser support | EOL browsers; not supported |

---

## Agent Prompt

> Read `PROJECT_BRIEF.md`, then read `doc/sprint-22-plan.md`. You are the dev team: **Milo** (CSS/art director), **Nova** (frontend engineer), and **Ivy** (QA engineer).
>
> Execute Sprint 22: Accessibility Audit, RTL & Final Polish.
>
> First: `git pull origin 19.0 && git checkout -b feature/sprint-22`
>
> **This is the closing sprint.** The goal is quality and completeness, not new features.
>
> **Ivy** leads Tasks 1–2 (axe-core audits) and 15–18 (cross-browser). File every violation as a GitHub Issue before fixing — this creates a paper trail of what was found and fixed.
>
> **Milo** leads Tasks 3, 9–14, 19–20 (contrast fixes, RTL, dark mode, polish).
>
> **Nova** leads Tasks 4–8, 21–22 (focus/ARIA/keyboard, cleanup, Hoot tests).
>
> Work through phases sequentially — do not skip to Phase 4 polish before Phase 1 a11y is complete.
>
> Document everything in `doc/sprint-22-a11y-violations.md` as you find it.
>
> The v2 signoff document (Task 23) is the final deliverable. It must be thorough — it will be used to communicate production readiness to stakeholders.
>
> Commit after each phase. Update `doc/sprint-22-progress.md` after each commit.
> When done: `git push origin feature/sprint-22` and open a PR. Tag Ivy for final QA signoff.

---

## Progress Tracker

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | a11y audit — backend | ⬜ Not started | |
| 2 | a11y audit — portal + shop | ⬜ Not started | |
| 3 | Color contrast fixes | ⬜ Not started | |
| 4 | Focus management | ⬜ Not started | |
| 5 | Skip navigation link | ⬜ Not started | |
| 6 | ARIA attributes audit | ⬜ Not started | |
| 7 | Screen reader testing — backend | ⬜ Not started | |
| 8 | Screen reader testing — portal | ⬜ Not started | |
| 9 | High contrast mode | ⬜ Not started | |
| 10 | RTL audit — backend core | ⬜ Not started | |
| 11 | RTL — Sprint 11–16 components | ⬜ Not started | |
| 12 | RTL — portal and shop | ⬜ Not started | |
| 13 | RTL SCSS fixes | ⬜ Not started | |
| 14 | Dark mode edge cases | ⬜ Not started | |
| 15 | Cross-browser — Chrome | ⬜ Not started | |
| 16 | Cross-browser — Firefox | ⬜ Not started | |
| 17 | Cross-browser — Safari | ⬜ Not started | |
| 18 | Mobile web final check | ⬜ Not started | |
| 19 | Typography micro-corrections | ⬜ Not started | |
| 20 | Spacing consistency sweep | ⬜ Not started | |
| 21 | Sprint 11–21 cleanup | ⬜ Not started | |
| 22 | Final Hoot tests | ⬜ Not started | |
| 23 | v2 QA signoff document | ⬜ Not started | |
