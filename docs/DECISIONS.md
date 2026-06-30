# Architecture Decisions

---

## ADR-001 — Navigation Framework

**Status:** Accepted

Expo Router will be used as the application's navigation framework.

Reason:

- File-based routing
- Native Expo integration
- Deep linking support
- Simplified maintenance

---

## ADR-002 — Bottom Navigation

**Status:** Accepted

A reusable BottomNavigation component will not be implemented.

Reason:

Expo Router already provides tab navigation.

Only the visual appearance of the tab bar should be customized.

---

## ADR-003 — Design Tokens

**Status:** Accepted

The theme is the single source of truth for:

- Colors
- Typography
- Spacing
- Radius
- Sizes
- Navigation
- Motion

Hardcoded visual values should be avoided.

---

## ADR-004 — Corner Radius Standard

**Status:** Accepted

MileWise uses four radius values:

- Small — 8px
- Medium — 12px
- Large — 20px
- Pill — 999px

Usage:

- Medium → Buttons and controls
- Large → Cards
- Pill → Badges, chips and special navigation elements

---

## ADR-005 — Incremental Development

**Status:** Accepted

The project follows milestone-based development.

Infrastructure is completed before feature implementation.

Future milestones must not be implemented prematurely.

---

## ADR-006 — Design System First Development

**Status:** Accepted

MileWise follows a Design System First development strategy.

All reusable UI components are implemented before application screens.

Reasons:

- Consistent user experience
- Faster screen development
- Improved maintainability
- Reduced duplicated UI code
- Easier future redesigns

Application screens must reuse the Design System wherever possible.
