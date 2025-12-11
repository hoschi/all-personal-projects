# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: [e.g., Python 3.11, Swift 5.9, Rust 1.75 or NEEDS CLARIFICATION]  
**Primary Dependencies**: [e.g., FastAPI, UIKit, LLVM or NEEDS CLARIFICATION]  
**Storage**: [if applicable, e.g., PostgreSQL, CoreData, files or N/A]  
**Testing**: [e.g., pytest, XCTest, cargo test or NEEDS CLARIFICATION]  
**Target Platform**: [e.g., Linux server, iOS 15+, WASM or NEEDS CLARIFICATION]
**Project Type**: [single/web/mobile - determines source structure]  
**Performance Goals**: [domain-specific, e.g., 1000 req/s, 10k lines/sec, 60 fps or NEEDS CLARIFICATION]  
**Constraints**: [domain-specific, e.g., <200ms p95, <100MB memory, offline-capable or NEEDS CLARIFICATION]  
**Scale/Scope**: [domain-specific, e.g., 10k users, 1M LOC, 50 screens or NEEDS CLARIFICATION]

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- [ ] **Principle I (Functional Core/Imperative Shell):** Is there a clear separation between pure `core` logic and side-effectful `shell`/`apps`?
- [ ] **Principle II (Opinionated Frameworks):** Does the plan leverage the standard stack (Effect, Next.js, Prisma) or provide justification for deviation?
- [ ] **Principle III (Unified Tech Stack):** Does the plan adhere to using TypeScript, Bun, and Turbopack?
- [ ] **Principle IV (AI-Centric & Quality Gates):** Does the plan include tasks for achieving 100% test coverage for the core logic?
- [ ] **Principle V (Schema-Driven):** Are all data structures defined as shareable Effect Schemas? Is OpenAPI generation planned for?
- [ ] **Principle VI (Monorepo Structure):** Does the proposed file structure fit within the established monorepo (`packages/`, `apps/`) or separate private repo conventions?

## Project Structure

### Documentation (this feature)

```
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

<!--
  ACTION REQUIRED: The following structure is the default based on the constitution.
  Confirm the package and application names and update the paths accordingly.
-->

```
# Monorepo Structure (DEFAULT)
apps/
└── [your-app-name]/         # Imperative Shell: Next.js frontend, API routes, etc.
    ├── src/
    └── tests/

packages/
├── core/                    # Functional Core: Pure business logic, types, and functions.
│   ├── src/
│   └── tests/
├── shell/                   # Imperative Shell: DB access, external clients, side effects.
│   ├── src/
│   └── tests/
└── shared-schemas/          # Effect Schemas for end-to-end type safety.
    └── src/
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

_Fill ONLY if Constitution Check has violations that must be justified_

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |
