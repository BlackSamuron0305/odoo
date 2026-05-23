# Sprint 19 — Website Builder Editor Chrome

> Sprint Goal: Modernize the Website Builder's editing interface — the builder toolbar, sidebar panels, block library, theme customizer, and all editor chrome — so that the editing experience is as modern and intuitive as Webflow or Squarespace.
> Branch: `feature/sprint-19`
> Depends on: Sprint 18 (eCommerce shop styles), Sprint 12 (typography), Sprint 14 (settings sidebar pattern)

---

## Context

Odoo's Website Builder (`addons/html_builder/`) is the drag-and-drop editor used to build website pages. It is a complex, standalone application layered on top of the website view. The "editor chrome" refers to the UI that surrounds the editable canvas — not the website content itself.

Editor chrome surfaces:
1. **Top toolbar** — Save/Discard/Preview/Publish bar
2. **Left panel** — Block library (drag blocks onto page)
3. **Right panel** — Properties panel (selected element options)
4. **Theme customizer** — Colors, fonts, spacing
5. **Mobile preview toggle** — Switch between desktop/tablet/mobile
6. **Context menus** — Right-click on elements, inline toolbar

This is SCSS-only — no changes to editor JS logic or functionality.

**Files in scope:**
- `addons/html_builder/static/src/` — builder SCSS and JS
- Look for: `o_we_*` CSS class prefix (Website Editor)
- Key SCSS files to find: builder sidebar, toolbar, option panels

---

## Prioritized Task List

| # | Task | Owner | Description |
|---|------|-------|-------------|
| 1 | HTML builder audit | Milo | Map all `o_we_*` selectors. Identify: toolbar (top bar), sidebar left (block lib), sidebar right (properties), theme panel, context toolbars. Document structure in `doc/sprint-19-audit.md`. Note any JS-injected styles |
| 2 | Builder top toolbar | Milo | Top toolbar: 48px height (slightly taller than backend navbar for breathing room). Left: Odoo logo + website name (editable on click). Center: undo/redo buttons (icon buttons, 36px, Sprint 11 hover). Right: "Mobile Preview" toggle (icon button group), "Preview" button (secondary), "Discard" (secondary), "Publish" / "Save" (brand primary). All buttons match Sprint 2 button system |
| 3 | Builder toolbar state — unsaved changes | Milo | When changes are pending: "Save" button pulses (subtle box-shadow animation) and an "unsaved changes" dot appears next to website name. "Discard" becomes more prominent (secondary-danger style). This mirrors the Settings save bar pattern from Sprint 14 |
| 4 | Block library sidebar (left) | Milo | Left panel: 280px. Header: "Blocks" title + search input (40px, Sprint 12 styled). Block category tabs: horizontal scroll tabs, small pills. Block thumbnails: image tiles (aspect ratio 16:10), `border-radius: 8px`, hover: blue outline + "Drag to add" label overlay. Section headers: Sprint 12 11px uppercase |
| 5 | Block library drag indicator | Milo | While dragging a block: source block gets `opacity: 0.5`. Drop zone on canvas: brand-tinted dashed outline (`2px dashed var(--o-brand-primary)`), `border-radius: 4px`. "Drop here" label in the zone. Sprint 11 motion for appearance |
| 6 | Properties panel (right sidebar) | Milo | Right panel: 280px, opens when element is selected. Header: element type icon + element name. Sections: collapsible (Sprint 14 settings-card style). Options: label left + control right (Sprint 14 settings-row pattern). Controls: color pickers, font selectors, spacing sliders, border inputs. All inputs match Sprint 12 form inputs |
| 7 | Color picker component | Milo | Color picker used throughout the builder: swatch grid (brand palette + custom), hex input with `#` prefix, opacity slider. Current color: large swatch at top. Tabs: "Palette" / "Custom". Recent colors row. Popover container: `border-radius: 8px`, `box-shadow: var(--o-shadow-lg)` |
| 8 | Theme customizer panel | Milo | Theme customizer (colors, fonts, spacing presets): full-height right panel with sections. Color scheme: 5 color swatches (Primary, Secondary, Body text, Background, Accents). Font pairing: select from brand-approved font pairings. Spacing density: matches Sprint 12 density toggle. Preview updates live |
| 9 | Mobile preview toggle | Milo | Device preview toggle: icon button group (Desktop / Tablet / Mobile icons). Active device: brand-tinted button. Canvas scales to show device viewport outline with a subtle device frame (not a phone image — a rounded rectangle outline). Transition: Sprint 11 motion |
| 10 | Element selection outline | Milo | When element is selected on canvas: `outline: 2px solid var(--o-brand-primary)`, `border-radius: 2px`. Resize handles: 6px circles at corners and midpoints, white fill with brand border. Drag handle: top-center, grab cursor. Blue dashed outline for hover (not selected) |
| 11 | Inline context toolbar | Milo | The floating toolbar that appears when text is selected (Bold/Italic/Link/Color/Size): pill container, `border-radius: 999px`, white background (light) / dark background (dark), `box-shadow: var(--o-shadow-lg)`. Button icons: 20px. Sprint 11 entrance animation (scale + opacity) |
| 12 | Right-click context menu | Milo | Right-click menu in builder: same Sprint 2b dropdown style (8px radius, shadow, 36px item height). Items: Move Up, Move Down, Duplicate, Delete, Copy Style. Destructive (Delete): red text |
| 13 | Snippet options — spacing | Milo | Spacing control in properties panel: 4-directional padding/margin inputs (top/right/bottom/left) arranged in box model diagram. Active side highlights in brand color. Inputs: 40px height, compact font (Sprint 12 small) |
| 14 | Image crop & resize tool | Milo | Image crop overlay: dark backdrop over cropped area. Crop handles: white squares, 8px. Action bar: "Apply Crop" (brand primary) + "Cancel". Image resize: drag handles on corners. Resize indicator: tooltip showing current dimensions in px |
| 15 | Builder dark mode | Milo | The builder chrome (not the canvas) should have a dark theme option. Since editors typically prefer dark chrome with light canvas, add a "Dark editor" toggle in the builder toolbar. In dark editor mode: toolbar, left panel, right panel all use `var(--o-gray-900)` backgrounds. Canvas remains white (simulating real website) |
| 16 | Builder mobile responsive | Milo | On tablet viewport (builder used on a larger tablet): left sidebar collapses to icon-only (40px wide). Right sidebar slides in as overlay. Top toolbar remains full-width |
| 17 | Regression QA | Ivy | Test full builder workflow: open website editor, drag a block, edit text, change colors in theme customizer, preview on mobile, save. Verify context toolbars appear on element selection. Test dark editor mode |

---

## Work Schedule

### Phase 1: Foundation & Layout (Tasks 1–2)
- Audit and top toolbar
- **Checkpoint commit**: `sprint-19: website builder top toolbar`

### Phase 2: Block Library & Properties (Tasks 3–6)
- Left sidebar, drag indicator, right panel
- **Checkpoint commit**: `sprint-19: block library and properties panel`

### Phase 3: Controls & Tools (Tasks 7–10)
- Color picker, theme customizer, device toggle, element selection
- **Checkpoint commit**: `sprint-19: builder controls and editing tools`

### Phase 4: Context UI & Polish (Tasks 11–16)
- Inline toolbar, context menu, spacing control, image tool, dark chrome, mobile
- **Checkpoint commit**: `sprint-19: context UI and polish`

### Phase 5: QA (Task 17)
- **Final commit**: `sprint-19: website builder QA signoff`

---

## Design Specifications

### Builder Toolbar
```
Height:        48px
Background:    white (light) / var(--o-gray-900) (dark editor)
Border-bottom: 1px solid var(--o-gray-200)
Z-index:       1050 (above canvas content)
```

### Left Sidebar Panel
```
Width:         280px
Background:    var(--o-gray-50) (light) / var(--o-gray-900) (dark)
Border-right:  1px solid var(--o-gray-200)
Block tile:    border-radius: 8px, aspect-ratio: 16/10, border: 1px solid var(--o-gray-200)
```

### Element Selection
```
Outline:       2px solid var(--o-brand-primary)
Outline-offset: 2px
Resize handle: 8px × 8px circle, white fill, brand border
```

---

## Success Criteria

- [ ] Top toolbar is 48px with Save/Discard/Publish buttons using Sprint 2 button system
- [ ] Unsaved changes indicator shows on toolbar
- [ ] Block library sidebar has search, categories, thumbnail grid
- [ ] Block drag-and-drop shows brand-tinted drop zone
- [ ] Properties panel has collapsible sections with Sprint 14 settings pattern
- [ ] Color picker has palette swatches + hex input + opacity slider
- [ ] Theme customizer shows color/font/spacing in one panel
- [ ] Device preview toggle shows correct viewport frame on canvas
- [ ] Selected element has brand-color outline with resize handles
- [ ] Inline text toolbar appears as pill with Sprint 11 animation
- [ ] Right-click context menu uses Sprint 2b dropdown style
- [ ] Dark editor mode available (chrome goes dark, canvas stays white)
- [ ] Ivy QA sign-off

---

## What's NOT in This Sprint

| Feature | Reason |
|---------|--------|
| Website content blocks styling | This sprint is chrome only; block content is separate |
| New blocks or block functionality | Feature work — not in scope |
| AI content generation UI | Product feature, not UI system |
| SEO panel redesign | Low priority for v2 |
| Multilingual editor UI | Out of scope |

---

## Agent Prompt

> Read `PROJECT_BRIEF.md`, then read `doc/sprint-19-plan.md`. You are **Milo** (CSS/art director).
>
> Execute Sprint 19: Website Builder Editor Chrome.
>
> First: `git pull origin 19.0 && git checkout -b feature/sprint-19`
>
> The Website Builder is complex. The audit (Task 1) is mandatory — do not skip it. The `o_we_*` class prefix is how you find all relevant selectors.
>
> **SCOPE DISCIPLINE**: This sprint is the editor CHROME — the toolbars, panels, and overlays. Do NOT style the website blocks or content inside the canvas. Those are website content, not editor UI.
>
> The color picker (Task 7) is a reusable component. Build it well — it appears in multiple contexts (theme customizer, element properties, gradient editor).
>
> Commit after each phase. Update `doc/sprint-19-progress.md` after each commit.
> When done: `git push origin feature/sprint-19` and open a PR. Tag Ivy for QA.

---

## Progress Tracker

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | HTML builder audit | ⬜ Not started | |
| 2 | Builder top toolbar | ⬜ Not started | |
| 3 | Builder toolbar state | ⬜ Not started | |
| 4 | Block library sidebar | ⬜ Not started | |
| 5 | Block library drag indicator | ⬜ Not started | |
| 6 | Properties panel | ⬜ Not started | |
| 7 | Color picker component | ⬜ Not started | |
| 8 | Theme customizer panel | ⬜ Not started | |
| 9 | Mobile preview toggle | ⬜ Not started | |
| 10 | Element selection outline | ⬜ Not started | |
| 11 | Inline context toolbar | ⬜ Not started | |
| 12 | Right-click context menu | ⬜ Not started | |
| 13 | Snippet options — spacing | ⬜ Not started | |
| 14 | Image crop & resize tool | ⬜ Not started | |
| 15 | Builder dark mode | ⬜ Not started | |
| 16 | Builder mobile responsive | ⬜ Not started | |
| 17 | Regression QA | ⬜ Not started | |
