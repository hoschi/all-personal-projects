# Implementation Plan: Pragmatic TypeScript Boilerplate

**Branch**: `001-um-die-ganzen` | **Date**: 2025-10-13 | **Spec**: [specs/001-um-die-ganzen/spec.md](specs/001-um-die-ganzen/spec.md)
**Input**: Feature specification from `/Users/hoschi/repos/ts-boilerplate/specs/001-um-die-ganzen/spec.md`

## Summary

The goal is to create a comprehensive, opinionated TypeScript boilerplate for small to medium-sized private projects. It will be built on a foundation of pragmatic functional programming principles ("Functional Core, Imperative Shell") and optimized for rapid, AI-assisted development. The core technologies are Effect, Bun, Turbopack, Prisma, Next.js, and PostgreSQL. The boilerplate's features will be demonstrated through a video/note management application, including a public web app and a private offline-syncing CLI.

## Technical Context

**Language/Version**: TypeScript 5.x
**Runtime/Tooling**: Bun 1.x, Turbopack
**Primary Dependencies**: Effect (Platform, Schema), Prisma, Next.js 14+, React 18+, Material UI
**Storage**: PostgreSQL
**Testing**: Bun Test, `fast-check` for property testing
**Target Platform**: Node.js (via Bun) for backend/CLIs, Web for frontend
**Project Type**: Monorepo (`public-monorepo`) and a separate standalone private repository (`private-project`)
**Performance Goals**: Prioritize rapid development and a fast feedback loop.
**Constraints**: Strict adherence to "Functional Core, Imperative Shell" architecture, 100% test coverage for the functional core, schema-driven end-to-end type safety.
**Scale/Scope**: Designed for solo developers working on long-term private projects.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Principle I (Functional Core/Imperative Shell):** The plan explicitly includes `packages/core` and `packages/shell` to enforce this separation.
- [x] **Principle II (Opinionated Frameworks):** The plan adopts the specified stack (Effect, Next.js, Prisma) without deviation.
- [x] **Principle III (Unified Tech Stack):** The plan is built entirely on TypeScript, Bun, and Turbopack.
- [x] **Principle IV (AI-Centric & Quality Gates):** The plan includes tasks for 100% test coverage, linting, and automated QA.
- [x] **Principle V (Schema-Driven):** The plan mandates the use of Effect Schemas in `packages/shared-api` as the single source of truth.
- [x] **Principle VI (Monorepo Structure):** The plan outlines the specified public monorepo and separate private project structure.

**Result**: All constitutional gates are passed.

## Project Structure

### Documentation (this feature)

```
specs/001-um-die-ganzen/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── openapi.yml
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)
```
.
├── public-monorepo/
│   ├── apps/
│   │   └── web/                # Next.js Frontend
│   ├── packages/
│   │   ├── core/               # Functional Core (pure logic)
│   │   ├── shell/              # Imperative Shell (DB, external APIs)
│   │   ├── shared-api/         # Shared Effect Schemas
│   │   ├── video-service/      # Video API logic
│   │   ├── notes-service/      # Notes API logic
│   │   ├── cli-importer/       # Public CLI tool
│   │   ├── eslint-config-custom/
│   │   └── tsconfig/
│   └── turbo.json
└── private-project/
    └── notes-manager-cli/      # Private offline sync CLI
```

**Structure Decision**: The structure is implemented exactly as specified in the requirements and constitution, separating the public, reusable boilerplate in a monorepo from a standalone private project that consumes it.

## Complexity Tracking

No constitutional violations were identified that require justification.