# Sprint 9 — Mobile App: Polish, Accessibility & Offline

> Sprint Goal: Add dark mode, accessibility compliance, offline data caching, smooth animations, biometric auth, and camera/attachment support — making the app feel truly production-grade.
> Branch: `feature/mobile-sprint-9`
> Depends on: Sprint 8 (all screens built)

---

## Prioritized Task List

| # | Task | Owner | Description |
|---|------|-------|-------------|
| 1 | Dark mode — full app pass | Milo | Implement `useColorScheme` hook from NativeWind. Toggle in Settings screen. All screens must render correctly in dark + light. System preference as default |
| 2 | Smooth screen transitions | Nova + Milo | Expo Router shared-element transitions where supported. Stack push: slide right. Modal: slide up. Custom `FadeScale` transition for tab switches. Respects `reduceMotion` |
| 3 | Skeleton & loading state audit | Milo | All screens have consistent skeleton shape. Replace any remaining spinners with shimmer skeletons. Loading state never blocks interaction |
| 4 | Biometric authentication | Nova | After session restore: if biometric available, require Face ID / fingerprint before showing app data. Uses `expo-local-authentication`. Fallback to PIN/password |
| 5 | Offline data caching | Nova + Sage | Use `@tanstack/react-query` (or Zustand persist) to cache last-fetched data to device. Stale-while-revalidate. Show "Offline — showing cached data" banner when no network |
| 6 | Camera / photo attachment | Nova | In message compose and activity notes: attach photo from camera roll or camera. Uses `expo-image-picker`. Uploads via `ir.attachment` create + link to thread |
| 7 | Push notifications (mobile) | Nova + Sage | Receive push via `expo-notifications`. Tap notification → deep link to relevant screen (activity due, message received). Register device token with Odoo server |
| 8 | Accessibility audit | Milo + Nova | Full VoiceOver (iOS) and TalkBack (Android) pass. Add `accessibilityLabel` to all interactive elements. Ensure tap targets ≥ 44×44 pt. Sufficient contrast in both themes |
| 9 | Performance optimization | Nova | Profile with Flipper + React DevTools. Reduce re-renders with `React.memo` and `useCallback`. Lazy-load screens not in bottom nav. FlatList optimization (keyExtractor, getItemLayout) |
| 10 | Error & crash reporting | Dash | Integrate `expo-error-recovery` + Sentry React Native. Crash reports to Sentry. Error boundary on every screen. No crashes in any known user flow |
| 11 | App icon & splash screen | Milo | Final app icon (1024×1024, no transparency for iOS). Splash screen with Odoo logo centered on brand primary background. Use `expo-splash-screen` for controlled hide |
| 12 | Full regression QA | Ivy | End-to-end: Login → Home → CRM → Contacts → Calendar → Activities → Messages → Settings → Logout. Both light + dark. Both iOS + Android. File all bugs |

---

## Work Schedule

### Phase 1: Theme & Animations (Tasks 1–3)
- Dark mode full pass
- Screen transitions
- Skeleton audit
- **Checkpoint commit**: `sprint-9: dark mode and animations`

### Phase 2: Auth, Offline & Camera (Tasks 4–6)
- Biometric auth
- Offline caching
- Camera attachment
- **Checkpoint commit**: `sprint-9: biometric auth, offline cache, camera`

### Phase 3: Notifications, Accessibility & Polish (Tasks 7–12)
- Push notifications
- Accessibility
- Performance optimization
- Sentry setup
- App icon + splash
- Ivy regression QA
- **Final commit**: `sprint-9: app polished and production ready`

---

## Dark Mode Token Mappings (React Native)

```ts
// constants/theme.ts
export const lightTheme = {
  background:    '#ffffff',
  surface:       '#f8f9fa',
  text:          '#212529',
  textMuted:     '#6c757d',
  border:        '#dee2e6',
  brandPrimary:  '#71639e',
}

export const darkTheme = {
  background:    '#0f0f1a',
  surface:       '#1a1a2e',
  text:          '#e8e8f0',
  textMuted:     '#9999bb',
  border:        '#2e2e40',
  brandPrimary:  '#9b8ec4',   // lightened for dark bg contrast
}
```

---

## Success Criteria

- [ ] Dark mode works on all screens, system preference respected on first launch
- [ ] All screen transitions are smooth (60fps, no jank)
- [ ] Biometric auth prompts on app resume from background
- [ ] Offline mode shows cached data with "offline" banner instead of error screen
- [ ] Photo attachment uploads successfully to Odoo chatter
- [ ] Push notifications received and navigate correctly
- [ ] VoiceOver / TalkBack: all interactive elements have labels, logical tab order
- [ ] No tap target < 44pt
- [ ] Sentry captures crashes in production build
- [ ] App icon correct on iOS and Android home screens
- [ ] Ivy full regression sign-off

---

## What's NOT in This Sprint

| Feature | Reason |
|---------|--------|
| Background sync (offline writes) | Complex conflict resolution, v2 |
| App Clip / Instant App | Nice to have, not core |
| Widgets (iOS WidgetKit) | v2 |
| Apple Watch companion | Out of scope |

---

## Agent Prompt

> Read `PROJECT_BRIEF.md`, then read `doc/sprint-9-plan.md`. You are: **Nova** (RN), **Milo** (design), **Sage** (backend), **Dash** (DevOps/Sentry).
>
> Execute Sprint 9: Polish, Accessibility & Offline.
>
> First: `git pull origin mobile-main && git checkout -b feature/mobile-sprint-9`
>
> Accessibility is non-negotiable. Every interactive element needs `accessibilityLabel`. Run with VoiceOver before submitting.
>
> Dark mode: use the same color values as the web dark mode (Sprint 4) — same palette, adapted for React Native.
>
> Performance: the app must scroll at 60fps on an iPhone 11 (2019) and a mid-range Android (Pixel 4a). Profile before submitting.
>
> Update `doc/sprint-9-progress.md` after each phase.
> When done: push and open PR. Ivy does full regression.

---

## Progress Tracker

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Dark mode full pass | ⬜ Not started | |
| 2 | Screen transitions | ⬜ Not started | |
| 3 | Skeleton audit | ⬜ Not started | |
| 4 | Biometric auth | ⬜ Not started | |
| 5 | Offline caching | ⬜ Not started | |
| 6 | Camera attachment | ⬜ Not started | |
| 7 | Push notifications | ⬜ Not started | |
| 8 | Accessibility audit | ⬜ Not started | |
| 9 | Performance optimization | ⬜ Not started | |
| 10 | Sentry crash reporting | ⬜ Not started | |
| 11 | App icon + splash | ⬜ Not started | |
| 12 | Full regression QA | ⬜ Not started | |
