# AGENTS.md

## Purpose

This document defines the engineering standards and operating procedures for all AI agents contributing to the MileWise project.

Every AI assistant working on this repository must follow these instructions before generating, modifying, or refactoring code.

---

# Project Overview

MileWise is an offline-first vehicle expense and maintenance management application built using React Native, Expo, and TypeScript.

The application focuses on helping drivers understand the true cost of vehicle ownership through intelligent expense tracking, predictive maintenance, and actionable analytics.

This repository is developed as a long-term production-quality software project.

---

# Development Philosophy

The project follows these principles:

- Documentation before implementation.
- Architecture before coding.
- Simplicity over cleverness.
- Readability over brevity.
- Modularity over monolithic files.
- Incremental milestone-based development.

AI agents should prioritize maintainability over rapid implementation.

---

# Engineering Principles

Always produce:

- Type-safe code
- Modular architecture
- Reusable components
- Predictable state management
- Clear separation of concerns

Never sacrifice maintainability for short-term convenience.

---

# Architecture Principles

Follow these architectural guidelines:

- Offline-first design
- Local database as the primary source of truth
- Cloud synchronization as a secondary layer
- Feature-oriented architecture
- Component-driven UI
- Material Design 3
- TypeScript strict mode

---

# Coding Standards

Always:

- Use TypeScript.
- Avoid the `any` type.
- Prefer composition over inheritance.
- Use descriptive names.
- Keep components focused on a single responsibility.
- Use absolute imports beginning with `@/`.
- Reuse existing utilities before creating new ones.

Never duplicate logic.

---

# Project Structure

Respect the established folder hierarchy.

Do not reorganize folders unless explicitly instructed.

Create new modules only when they clearly improve maintainability.

---

# AI Responsibilities

Before implementation:

1. Read the project documentation.
2. Understand the requested milestone.
3. Produce an implementation plan when requested.
4. Ask questions if requirements are ambiguous.

During implementation:

- Implement only the requested milestone.
- Avoid feature creep.
- Keep changes isolated.
- Preserve existing architecture.

After implementation:

- Verify TypeScript compilation.
- Remove unused imports.
- Ensure the application builds successfully.
- Summarize completed work.

---

# Implementation Workflow

Every milestone follows this workflow:

Requirements

↓

Architecture Review

↓

Implementation Planning

↓

Approval

↓

Code Implementation

↓

Testing

↓

Documentation Updates

↓

Git Commit

---

# Rules

AI agents must NOT:

- Implement future milestones.
- Introduce unnecessary dependencies.
- Modify unrelated files.
- Rewrite stable architecture without approval.
- Replace documented design decisions.
- Remove documentation.

When uncertain, stop and ask for clarification.

The AI is an implementation partner, not the product owner.

If the prompt specifies exact values (colors, file names, folder names, APIs, database tables, constants, etc.), reproduce them exactly without substitution, optimization, or interpretation.

---

# Definition of Done

A milestone is complete only when:

- The requested functionality is implemented.
- The application builds successfully.
- No TypeScript errors exist.
- Documentation has been updated.
- Code follows project standards.
- The milestone summary has been produced.

---

# Non-Goals

AI agents should not:

- Optimize prematurely.
- Invent new features.
- Change UI designs without approval.
- Introduce breaking architectural changes.
- Ignore project documentation.
