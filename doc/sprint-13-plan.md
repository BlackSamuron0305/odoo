# Sprint 13 — Discuss App Full Redesign

> Sprint Goal: Fully modernize the Discuss app — Odoo's built-in messaging, channels, and direct messages system — applying the established design language to every surface: channel sidebar, message threads, message bubbles, composer toolbar, inbox, call UI, and voice messages.
> Branch: `feature/sprint-13`
> Depends on: Sprints 0–5b (tokens, components), Sprint 11 (motion), Sprint 12 (typography)

---

## Context

Sprint 2b touched the **chatter widget** — the embedded messaging component inside form views. The **Discuss app** is a completely different, standalone application (reachable via the messaging icon in the navbar). It has its own layout: a 3-column design (channel sidebar / message list / thread panel), its own state management, and extensive SCSS spread across `addons/mail/static/src/`.

This is one of the highest-traffic pages for teams that use Odoo for internal communication. It currently looks significantly older than the rest of the upgraded UI.

**Files in scope:**
- `addons/mail/static/src/scss/` — all files
- `addons/mail/static/src/discuss/` — component overrides, web patches
- `addons/mail/static/src/core/` — core messaging components
- `addons/mail/static/src/chatter/` — chatter in context of Discuss
- `addons/mail/static/src/webclient/` — webclient integration

**Key SCSS files to audit first:**
- `addons/mail/static/src/discuss/core/web/` — sidebar and thread patches
- `addons/mail/static/src/scss/composer.scss` (already touched in 2b — extend it)
- `addons/mail/static/src/scss/mail_activity.scss`

---

## Prioritized Task List

| # | Task | Owner | Description |
|---|------|-------|-------------|
| 1 | Discuss app audit | Milo | Map all CSS files, selectors, and component structure for the Discuss app. Document in `doc/sprint-13-audit.md`. Identify all hardcoded colors and replace candidates |
| 2 | Three-column layout | Milo | Discuss root layout: left sidebar 260px (collapsible to 0), main thread area fills remaining width, optional right panel. Use CSS Grid. Sidebar collapse animates with Sprint 11 motion tokens. Match AppRailSidebar visual language |
| 3 | Channel sidebar styling | Milo | Sidebar sections (Channels, Direct Messages, etc.): 11px uppercase labels matching Sprint 12 section header style. Channel items: 36px height, 12px horizontal padding, icon + name, unread count badge. Active channel: brand-primary tinted background, brand text. Hover: `var(--o-gray-100)`. New channel button: `+` icon right-aligned on section header hover |
| 4 | Direct message sidebar items | Milo | DM items: avatar (28px, `border-radius: 50%`) + display name + online status dot. Online: green `#22c55e`. Away: amber. Offline: no dot. Unread badge: brand color pill |
| 5 | Message thread container | Milo | Thread area: white (light) / `var(--o-gray-900)` (dark). Message list: `padding: 16px 20px`. Scroll: smooth, snaps to bottom for new messages. Date separator pills: centered, `border-radius: 999px`, `var(--o-gray-200)` background, small text |
| 6 | Message bubble layout — received | Milo | Received messages (others): avatar 32px left, name above in medium weight, message body right of avatar. Background: `var(--o-gray-50)` (light) / `var(--o-gray-800)` (dark). `border-radius: 4px 12px 12px 12px` |
| 7 | Message bubble layout — sent | Milo | Sent messages (own): no avatar, right-aligned bubble. Background: brand-primary at 10% opacity (light) / brand at 15% opacity (dark). `border-radius: 12px 4px 12px 12px` |
| 8 | Message hover actions | Milo | On message hover: action bar appears top-right of bubble. Actions: emoji reaction, reply, more (⋯). Icons 20px, `border-radius: 50%`, `background: var(--o-gray-100)` on hover. Appear with Sprint 11 fade animation |
| 9 | Emoji reactions display | Milo | Reaction pills below message: `border-radius: 999px`, `border: 1px solid var(--o-gray-200)`, emoji + count. If current user reacted: `background: var(--o-brand-primary-10)`, `border-color: var(--o-brand-primary)`. `+` button to add reaction |
| 10 | Message composer — Discuss context | Milo | Full-width composer at bottom of thread. Taller than chatter (Sprint 2b) — min-height 80px, grows to 200px max. Toolbar: Bold, Italic, Code, Link, List, Attach, Emoji, Mention. Toolbar icons 20px. Send button: brand color, right side. Border: `1px solid var(--o-gray-300)`, `border-radius: 12px` |
| 11 | Composer toolbar dark mode | Milo | All toolbar icons use `var(--o-gray-600)` (light) / `var(--o-gray-400)` (dark). Hover: `var(--o-brand-primary)`. Active formatting: `var(--o-brand-primary)` with tinted background pill |
| 12 | File attachment preview in thread | Milo | Attachments in messages: image thumbnails (160px × 120px, `border-radius: 8px`, hover overlay with expand icon). Non-image files: file type icon + name + size in a pill card (`border-radius: 8px`, `border: 1px solid var(--o-gray-200)`) |
| 13 | Voice message player | Milo | Voice message (`addons/mail/static/src/discuss/voice_message/`): waveform bars using brand color. Play button: brand color circle. Timestamp text: small. Duration pill. Dark mode compatible |
| 14 | Inbox view | Milo | Inbox (notification/starred/history tabs): tab bar matches Sprint 12 notebook tab style. Inbox items: sender avatar + model icon + preview text + timestamp. Unread: bold sender, brand-tinted left border. Action buttons (Mark read, Reply) appear on hover |
| 15 | Thread panel (right column) | Milo | Thread replies panel that slides in from right: 320px wide, `border-left: 1px solid var(--o-gray-200)`. Header: "Thread" label + close button. Message bubbles same style as main thread (Tasks 6–7) |
| 16 | Call overlay UI | Milo | `addons/mail/static/src/discuss/call/`: call bar at top of Discuss. Participant avatars: circles with speaking indicator (animated border). Mute/camera/hangup buttons: dark pill bar, 48px tap target. Match Sprint 9 mobile call design language |
| 17 | Online status system-wide | Nova | Extract online status CSS logic into a reusable pattern usable across Discuss sidebar and any avatar that shows presence. Status dot: 8px circle, `border: 2px solid` (white in light, dark bg in dark mode) positioned bottom-right of avatar |
| 18 | Discuss dark mode | Milo | Full dark mode pass: ensure all message bubbles, sidebar, composer, thread, inbox use `var(--o-*)` tokens. No hardcoded colors. Test all states: unread, active channel, typing indicator, attachment |
| 19 | Typing indicator animation | Milo | "User is typing…" indicator: three dots bouncing animation. Use CSS `@keyframes o-typing-bounce` with staggered delay. Brand-tinted dots. Respects `prefers-reduced-motion` (static dots with fade instead) |
| 20 | Regression QA | Ivy | Full Discuss app playthrough: send messages, file attachments, voice message, emoji reactions, create/join channel, DM, inbox, dark mode. Check all animations. RTL layout check |

---

## Work Schedule

### Phase 1: Layout & Sidebar (Tasks 1–4)
- Audit, three-column layout, channel + DM sidebar
- **Checkpoint commit**: `sprint-13: discuss layout and sidebar`

### Phase 2: Message Thread (Tasks 5–9)
- Thread container, message bubbles, hover actions, reactions
- **Checkpoint commit**: `sprint-13: message thread and bubble design`

### Phase 3: Composer & Attachments (Tasks 10–13)
- Full composer, voice message, file attachments
- **Checkpoint commit**: `sprint-13: composer toolbar and attachments`

### Phase 4: Inbox, Thread Panel & Call (Tasks 14–16)
- Inbox view, right thread panel, call overlay
- **Checkpoint commit**: `sprint-13: inbox, thread panel, call UI`

### Phase 5: System Polish & QA (Tasks 17–20)
- Online status, dark mode, typing indicator, regression QA
- **Final commit**: `sprint-13: discuss app full redesign complete`

---

## Design Specifications

### Message Bubbles
```
Received:  border-radius: 4px 12px 12px 12px; max-width: 70%; margin-bottom: 2px
Sent:      border-radius: 12px 4px 12px 12px; max-width: 70%; align-self: flex-end
Grouped:   consecutive messages from same sender get smaller top-left radius
```

### Sidebar Item Heights
```
Section header:  28px, 11px uppercase, letter-spacing 0.08em, gray-500
Channel item:    36px, 14px, font-weight 400 (500 if unread)
Unread badge:    min-width 20px, height 20px, border-radius 999px, brand color
```

### Composer
```
Min height:   80px
Max height:   200px (then scrolls)
Border:       1px solid var(--o-gray-300), focus: var(--o-brand-primary)
Border-radius: 12px
Toolbar:      border-bottom: 1px solid var(--o-gray-200), 40px height
```

---

## Success Criteria

- [ ] Discuss 3-column layout uses CSS Grid, sidebar collapses smoothly
- [ ] Channel sidebar items are 36px with unread count badges
- [ ] DM items show 28px avatar with online status dot
- [ ] Received messages: left-aligned bubble with avatar
- [ ] Sent messages: right-aligned bubble with brand-tinted background
- [ ] Message hover actions appear smoothly
- [ ] Emoji reactions display as pills with current-user tinting
- [ ] Full-width composer with formatting toolbar
- [ ] File attachments: image thumbnails + non-image file cards
- [ ] Voice message player with waveform
- [ ] Inbox items show avatar + model icon + preview + timestamp
- [ ] Right thread panel slides in at 320px
- [ ] Call overlay has animated speaking indicator
- [ ] Typing indicator has bouncing dots animation
- [ ] Full dark mode on all Discuss surfaces
- [ ] Ivy QA sign-off

---

## What's NOT in This Sprint

| Feature | Reason |
|---------|--------|
| Gif picker redesign | Low priority for v2 UI |
| Message translation UI | Content feature, not UI system |
| Video thumbnails | Requires media handling changes |
| Discuss mobile web optimizations | Mobile web is Sprint 22 polish |
| Chatbot designer UI | Separate complex product |

---

## Agent Prompt

> Read `PROJECT_BRIEF.md`, then read `doc/sprint-13-plan.md`. You are the dev team: **Milo** (CSS/art director) and **Nova** (frontend engineer).
>
> Execute Sprint 13: Discuss App Full Redesign.
>
> First: `git pull origin 19.0 && git checkout -b feature/sprint-13`
>
> **Critical**: Start with Task 1 — audit the Discuss SCSS files before writing any new code. Map every selector. This is a complex app with many nested components.
>
> **Milo** owns all SCSS (tasks 1–16, 18–19). **Nova** owns the online status reusable pattern (task 17).
>
> This sprint is SCSS-only. No JS logic changes, no XML template changes. Every change must use `var(--o-*)` tokens.
>
> The message bubble layout (tasks 6–7) is the hero feature — spend time getting the border-radius and spacing right. Sketch the left vs right alignment before coding.
>
> Commit after each phase. Update `doc/sprint-13-progress.md` after each commit.
> When done: `git push origin feature/sprint-13` and open a PR. Tag Ivy for QA.

---

## Progress Tracker

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Discuss app audit | ⬜ Not started | |
| 2 | Three-column layout | ⬜ Not started | |
| 3 | Channel sidebar styling | ⬜ Not started | |
| 4 | DM sidebar items | ⬜ Not started | |
| 5 | Message thread container | ⬜ Not started | |
| 6 | Message bubble — received | ⬜ Not started | |
| 7 | Message bubble — sent | ⬜ Not started | |
| 8 | Message hover actions | ⬜ Not started | |
| 9 | Emoji reactions | ⬜ Not started | |
| 10 | Composer — Discuss | ⬜ Not started | |
| 11 | Composer toolbar dark mode | ⬜ Not started | |
| 12 | File attachment preview | ⬜ Not started | |
| 13 | Voice message player | ⬜ Not started | |
| 14 | Inbox view | ⬜ Not started | |
| 15 | Thread panel | ⬜ Not started | |
| 16 | Call overlay UI | ⬜ Not started | |
| 17 | Online status system-wide | ⬜ Not started | |
| 18 | Discuss dark mode | ⬜ Not started | |
| 19 | Typing indicator | ⬜ Not started | |
| 20 | Regression QA | ⬜ Not started | |
