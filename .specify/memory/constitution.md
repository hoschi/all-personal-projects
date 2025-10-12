<!--
Sync Impact Report:
- Version change: 1.0.0 -> 2.0.0
- Rationale: Major architectural shift to adopt the Effect library as the core framework for application development. This change replaces the previous FCIS model with Effect's structured effects, context management, and integrated error handling.
- Modified Principles:
  - "Functional Core, Imperative Shell" -> "I. Effect-Driven Architecture"
  - "Strict Typing & Immutability" -> "II. Type-Safe & Immutable Data Models"
  - "Explicit Error Handling" -> "III. Structured Error & Defect Handling"
  - "Validated Data Boundaries" -> "IV. Schema-Driven Data Boundaries"
  - "Comprehensive & Robust Testing" -> "V. Testable Effects & Services"
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md (Updated Constitution Check section)
- Follow-up TODOs: None
-->
# TypeScript Project Constitution

## Core Principles

### I. Effect-Driven Architecture
All application logic, including asynchronous operations, side effects, and dependencies, MUST be modeled as `Effect` types. The application is composed by building and combining these effects. Business logic is encapsulated in services that are managed and provided to the application via `Layer` and `Context`, ensuring a clean separation of concerns and declarative dependency management.

### II. Type-Safe & Immutable Data Models
All data structures MUST be defined as immutable types. All code must pass TypeScript's `strict` mode, and the `any` type is forbidden. Use `effect/Schema` for defining and validating all data models, ensuring they are correct by construction.

### III. Structured Error & Defect Handling
All recoverable errors MUST be modeled as the failure type `E` in an `Effect<A, E, R>`. Unrecoverable errors (defects) will cause an `Effect` to die. This distinction is critical. Business logic should handle known failure cases explicitly, leveraging the type system to ensure all errors are accounted for at compile time.

### IV. Schema-Driven Data Boundaries
All external data entering or leaving the application (e.g., API requests/responses, database queries) MUST be parsed and validated using `effect/Schema`. This ensures that all data flowing into the system's core is guaranteed to conform to the expected types, eliminating an entire class of runtime errors.

### V. Testable Effects & Services
Business logic must be written as testable services. Dependencies required by these services MUST be provided via `Context`. For testing, provide mock or test implementations of these services using `Layer`. This allows for isolated, deterministic, and comprehensive testing of application logic without requiring real external systems.

## Development Workflow

The development process is centered around composing `Effect` data types. All new features must be implemented as effects and services, with corresponding tests that validate their behavior. Code reviews must explicitly check for adherence to these principles, particularly the proper use of `Effect`, `Layer`, `Context`, and `Schema`.

## Governance

This constitution is the source of truth for architectural and coding standards in this project. All development practices and code reviews must align with it.

- **Compliance**: All pull requests must be reviewed for compliance with these principles.
- **Amendments**: Changes to this constitution require a pull request, team review, and justification. The version must be incremented according to semantic versioning rules (MAJOR for breaking changes, MINOR for new principles, PATCH for clarifications).

**Version**: 2.0.0 | **Ratified**: 2025-10-12 | **Last Amended**: 2025-10-12