# Continue Project Rules

These rules define how Continue must behave while contributing to the MileWise project.

---

# Primary Directive

Always treat the human developer as the Product Owner and Technical Lead.

Continue is responsible for implementation, not product decisions.

When requirements are unclear, stop and ask questions instead of making assumptions.

---

# Documentation First

Before implementing any milestone, read the following project documentation:

1. README.md
2. AGENTS.md
3. docs/PROJECT_GUIDE.md
4. docs/ADR/\*
5. docs/ui/\*
6. .continue/rules.md

Never ignore documented architecture decisions.

---

# Milestone Workflow

Unless explicitly instructed otherwise:

1. Analyze the requested milestone.
2. Produce an implementation plan.
3. Wait for approval.
4. Implement only the approved work.
5. Verify compilation.
6. Summarize completed work.
7. Stop.

Do not continue into future milestones.

---

# Scope Control

Only modify files directly related to the current milestone.

Do not:

- Implement future features.
- Add experimental functionality.
- Refactor unrelated modules.
- Introduce breaking architectural changes.

Keep pull requests focused and easy to review.

---

# Coding Standards

Always:

- Use TypeScript strict mode.
- Avoid the `any` type.
- Use absolute imports beginning with `@/`.
- Prefer reusable components.
- Follow React Native best practices.
- Follow Expo Router conventions.
- Follow Material Design 3 principles.

---

# Architecture Rules

Respect the established project architecture.

Prefer:

- Composition over inheritance.
- Small reusable components.
- Feature-oriented organization.
- Separation of UI, business logic, services, and data layers.

Never bypass documented architectural decisions.

---

# File Management

Before creating a new file:

- Check whether an existing file should be extended.
- Avoid unnecessary duplication.
- Keep modules focused on a single responsibility.

Never create placeholder files that serve no immediate purpose.

---

# Error Handling

If compilation errors occur:

- Explain the cause.
- Fix only the relevant issue.
- Avoid broad refactoring.
- Preserve existing functionality.

---

# Code Reviews

After implementation, verify:

- No TypeScript errors.
- No unused imports.
- No dead code.
- No unnecessary dependencies.
- Consistent formatting.
- Successful Expo compilation.

---

# Communication Style

Be concise.

Explain important architectural decisions.

When proposing alternatives:

- Explain the trade-offs.
- Recommend one approach.
- Wait for approval before major changes.

Never overwhelm the developer with unnecessary information.

---

# Stop Conditions

After completing the approved milestone:

- Summarize completed work.
- Identify any known limitations.
- Suggest logical next steps.

Then stop and wait for further instructions.

## **Progressive Complexity**

Continue should never jump to advanced solutions if a simpler one satisfies the current milestone.

For example:

- Don't build an abstract repository pattern if SQLite is only being initialized.
- Don't create a generic service framework before a second service exists.
- Don't introduce custom hooks before they're actually needed.
- Don't optimize for hypothetical future features.

Instead, evolve the architecture as the project grows.
