# MileWise Engineering Handbook

## Purpose

This document serves as the single source of truth for the engineering, architecture, and development standards of the MileWise project. All contributors, whether human or AI, should consult this handbook before making architectural or implementation decisions.

---

# 1. Project Vision

MileWise aims to become the definitive offline-first vehicle expense and maintenance management platform. It empowers drivers to understand, manage, and optimize the true cost of vehicle ownership through intelligent tracking, predictive maintenance, and actionable insights.

---

# 2. Engineering Philosophy

The project is built on the following principles:

- Documentation First
- Architecture Before Code
- Offline First
- Progressive Complexity
- Human-Led AI Development
- Production Quality
- Maintainability Over Cleverness

---

# 3. System Architecture

MileWise follows a modular, feature-oriented architecture with clear separation between presentation, business logic, state management, persistence, and external services.

Core architectural goals:

- Scalability
- Maintainability
- Testability
- Predictable data flow
- Loose coupling
- High cohesion

---

# 4. Technology Stack

- React Native
- Expo
- TypeScript
- Expo Router
- SQLite
- Supabase
- Zustand
- Expo Secure Store

Technology choices are documented in the `docs/ADR/` directory.

---

# 5. Project Structure

Each top-level folder has a single, well-defined responsibility.

- `app/` — Routing and navigation.
- `src/components/` — Reusable UI components.
- `src/database/` — Local SQLite layer.
- `src/services/` — External integrations and business services.
- `src/state/` — Global application state.
- `src/theme/` — Design tokens and styling.
- `docs/` — Engineering and project documentation.

---

# 6. Design System

The UI follows Material Design 3 with a programmer-centric dark theme.

Design goals:

- High information density
- Accessibility
- Consistency
- Minimal visual noise
- Reusable components

---

# 7. State Management

Global application state is managed with Zustand.

Local component state should remain local whenever possible.

Persistent application data belongs in SQLite.

Cloud synchronization must never become the primary source of truth.

---

# 8. Database Architecture

SQLite is the authoritative data store.

Supabase provides authentication, synchronization, and cloud backup.

The application must remain fully functional while offline.

---

# 9. Navigation Architecture

Navigation is implemented using Expo Router with file-based routing.

Navigation groups should separate:

- Authentication
- Onboarding
- Core application
- Modal flows (when introduced)

---

# 10. Coding Standards

- TypeScript strict mode
- No `any`
- Absolute imports (`@/`)
- Small focused components
- Descriptive naming
- Reusable logic
- Minimal duplication

---

# 11. Naming Conventions

Use clear, descriptive names.

Examples:

- `FuelExpenseCard`
- `VehicleRepository`
- `calculateFuelEconomy()`
- `useVehicleStore()`

Avoid abbreviations unless universally understood.

---

# 12. Git Workflow

- One milestone per feature branch.
- One logical change per commit.
- Merge only after testing.
- Tag stable releases using Semantic Versioning.

---

# 13. Documentation Standards

Architecture changes must be reflected in documentation.

Major technical decisions should be recorded as ADRs.

Documentation evolves alongside the codebase.

---

# 14. Milestone Development Workflow

Every milestone follows:

Requirements → Architecture → Documentation → Planning → Approval → Implementation → Review → Testing → Documentation Update → Commit → Version Tag

---

# 15. Testing Strategy

Each milestone must:

- Compile successfully
- Pass TypeScript validation
- Be tested on a physical Android device
- Preserve existing functionality

Testing automation may be introduced in future milestones.

---

# 16. Versioning Strategy

The project follows Semantic Versioning.

- Major — Breaking architectural changes
- Minor — New features
- Patch — Fixes and documentation updates

---

# 17. Performance Principles

- Avoid unnecessary renders.
- Lazy load when appropriate.
- Keep startup time fast.
- Optimize database queries.
- Measure before optimizing.

---

# 18. Future Expansion

MileWise is designed to evolve without requiring fundamental architectural rewrites.

Potential future capabilities include:

- Fleet management
- Cross-device synchronization
- OBD-II integration
- AI-assisted maintenance insights
- OCR receipt scanning
- Android Auto support
- Wear OS integration
- Multi-language localization

These ideas guide long-term architecture but should not influence implementation until explicitly planned.
