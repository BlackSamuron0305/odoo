# Sprint Plans — Odoo UI Upgrade & Mobile App

See `PROJECT_BRIEF.md` at the repo root for the full project brief, tech stack decisions, and out-of-scope areas.

## Web UI Upgrade Sprints (Odoo core repo)

> **UI Stack: OWL + Bootstrap 5.3 + SCSS + CSS Custom Properties. NOT React.**
> Only `.scss` files and design token infrastructure change. All OWL JS + XML is untouched.

| Sprint | Name | File | Status |
|--------|------|------|--------|
| 0 | Design Tokens & Bootstrap 5.3 | [sprint-0-plan.md](./sprint-0-plan.md) | ⬜ Planned |
| 1 | Navbar & App Switcher | [sprint-1-plan.md](./sprint-1-plan.md) | ⬜ Planned |
| 2 | Form Views | [sprint-2-plan.md](./sprint-2-plan.md) | ⬜ Planned |
| **2b** | **Global Components: Dialogs, Fields, Chatter, Calendar** | [sprint-2b-plan.md](./sprint-2b-plan.md) | ⬜ Planned |
| 3 | List & Kanban | [sprint-3-plan.md](./sprint-3-plan.md) | ⬜ Planned |
| 4 | Dashboards, Graphs & Dark Mode | [sprint-4-plan.md](./sprint-4-plan.md) | ⬜ Planned |
| 5 | PWA Enhancement | [sprint-5-plan.md](./sprint-5-plan.md) | ⬜ Planned |
| **5b** | **Point of Sale App Modernization** | [sprint-5b-plan.md](./sprint-5b-plan.md) | ⬜ Planned |

## Mobile App Sprints (separate `odoo-mobile-app` repo)

> **Mobile Stack: React Native (Expo SDK 52+) + TypeScript + NativeWind + Expo Router + Zustand**

| Sprint | Name | File | Status |
|--------|------|------|--------|
| 6 | Foundation & Auth Shell | [sprint-6-plan.md](./sprint-6-plan.md) | ⬜ Planned |
| 7 | Core Screens (Dashboard, CRM, Contacts) | [sprint-7-plan.md](./sprint-7-plan.md) | ⬜ Planned |
| 8 | Business Screens (Calendar, Activities, Messages, POS) | [sprint-8-plan.md](./sprint-8-plan.md) | ⬜ Planned |
| 9 | Polish, Dark Mode, Accessibility & Offline | [sprint-9-plan.md](./sprint-9-plan.md) | ⬜ Planned |
| 10 | QA, Testing & App Store Deployment | [sprint-10-plan.md](./sprint-10-plan.md) | ⬜ Planned |

## Explicitly Out of Scope (v2)

- Website Builder / HTML Editor (`html_builder`, `html_editor`)
- Spreadsheet (`spreadsheet`) — canvas-based, not CSS
- Portal / eCommerce public pages (`portal`, `website_sale`)
- Live Chat embed widget (`im_livechat`)
- Self-order / kiosk POS (`pos_self_order`)
- Restaurant table map (`pos_restaurant`)

