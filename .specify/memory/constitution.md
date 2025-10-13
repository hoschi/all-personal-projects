<!--
Sync Impact Report:
- Version change: 0.1.0 → 1.0.0
- List of modified principles: All principles defined from scratch.
- Added sections: All sections populated with initial content.
- Removed sections: Generic template sections removed.
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md (updated to check against new principles)
  - ✅ .specify/templates/spec-template.md (updated for schema-driven approach)
  - ✅ .specify/templates/tasks-template.md (updated to reflect testing/schema tasks)
- Follow-up TODOs: None.
-->
# Pragmatic Functional TypeScript Boilerplate Constitution

## Core Principles

### I. Pragmatic Functional Programming
The "Functional Core, Imperative Shell" pattern is MANDATORY. A `core` package MUST contain pure, side-effect-free, and independently testable functions and types. A `shell` package and all `apps` packages MUST handle all side effects, including I/O, database access, and external API calls. ESLint rules MUST be configured to enforce that `shell` and `apps` can import from `core`, but `core` cannot import from `shell` or `apps`.
*Rationale: This separation isolates complex business logic from the unpredictable nature of the outside world, making the core logic highly robust, composable, and easy to test. It provides a pragmatic balance between functional purity and the necessity of integrating with a largely imperative ecosystem.*

### II. Opinionated Frameworks for Speed
Development MUST prioritize well-established, opinionated frameworks to minimize boilerplate and accelerate progress. The default stack includes the Effect platform for the application backend, Next.js for the frontend, and Prisma for the ORM. Choosing to build components from scratch instead of using these frameworks requires explicit justification.
*Rationale: As a solo developer working on private projects, velocity is paramount. "Simple things must be simple." Frameworks provide proven solutions to common problems, allowing focus to remain on delivering features rather than reinventing infrastructure.*

### III. Unified & Performant Tech Stack
The entire ecosystem MUST be built on TypeScript. Bun MUST be used as the runtime, test runner, and package manager for its performance benefits. The project MUST be structured as a monorepo managed by Turbopack. Effect MUST be used as the foundational platform for managing asynchronicity, dependencies, and errors, ensuring a consistent and type-safe approach across the board.
*Rationale: A homogenous stack reduces cognitive load and context-switching. The chosen tools are optimized for a fast developer feedback loop, which is critical for maintaining momentum.*

### IV. AI-Centric Development & Rigorous Quality Gates
The codebase MUST be structured for effective collaboration with AI coding assistants. This is supported by MANDATORY quality gates: 100% unit test coverage for the functional core (setup, scripts, and shell are excluded), automated detection of unused code and circular dependencies, and consistent code formatting. Tests are the primary mechanism for validating AI-generated code.
*Rationale: AI assistants are treated as core team members. A clear structure, comprehensive tests, and automated quality checks are non-negotiable for leveraging AI safely and effectively, ensuring that generated code is correct and maintainable.*

### V. Schema-Driven End-to-End Type Safety
Data structures MUST be defined using Effect Schemas. These schemas serve as the single source of truth and MUST be shared between the backend API, frontend applications, and for validating data models used by Prisma. The Effect platform's API layer MUST be used to ensure type safety is preserved across network boundaries. OpenAPI specifications MUST be automatically generated from these schemas for consumption by non-TypeScript clients.
*Rationale: This approach eliminates an entire class of data-related bugs by guaranteeing consistency from the database to the user interface. It makes refactoring safer and provides a clear, enforceable contract for all data interactions.*

### VI. Structured Monorepo & Project Separation
The project MUST be organized as a Turbopack monorepo containing shared packages, public APIs, and public frontends. Private projects MUST reside in separate, standalone Git repositories. For local development, private projects SHOULD use `bun link` to consume shared packages from the monorepo. A pre-push git hook MUST be implemented in private repositories to ensure they build and test correctly without the presence of linked packages.
*Rationale: This strategy provides a clean separation of concerns, promotes code reuse for common infrastructure, and maintains the strict isolation and privacy of independent projects without the complexity of nested git repositories.*

## Development Workflow & Quality Assurance

This section outlines the key processes and standards that govern development.
- **Testing:** Unit and property tests are the foundation of quality. All new features in the `core` package must be developed using Test-Driven Development (TDD). E2E tests are deferred but may be introduced later. Test coverage reports (HTML for humans, simple text/JSON for CI/AI) must be generated on every run.
- **Linting & Formatting:** Linting (ESLint) and formatting (Prettier) are configured separately and run automatically via Git hooks and CI. `console.log` statements are disallowed by the linter in production code but are permissible during development and in tests.
- **CI/CD:** GitHub Actions MUST be used to run all QA checks (linting, testing, dependency analysis) on every pull request.
- **Dependency Management:** Renovate Bot MUST be configured to automatically create pull requests for dependency updates. It is authorized to auto-merge patch and minor version updates for dependencies if all CI checks pass.

## Governance

This Constitution is the supreme source of truth for project architecture and development standards. It overrides any conflicting conventions or ad-hoc decisions. Amendments to this document require a clear rationale and an update to the version number according to Semantic Versioning. All development activities and code reviews must ensure compliance with these principles.

**Version**: 1.0.0 | **Ratified**: 2025-10-13 | **Last Amended**: 2025-10-13
