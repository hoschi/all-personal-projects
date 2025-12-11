---
description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: Per the constitution, Test-Driven Development (TDD) is **MANDATORY** for all logic in the `packages/core` directory. Tests for the `shell` and `apps` are highly encouraged.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Functional Core**: `packages/core/src/`, `packages/core/tests/`
- **Imperative Shell**: `packages/shell/src/`, `packages/shell/tests/`
- **Shared Schemas**: `packages/shared-schemas/src/`
- **Applications**: `apps/[app-name]/src/`, `apps/[app-name]/tests/`
- Paths shown below assume this monorepo structure.

<!--
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.

  The /speckit.tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md
  - Data contracts from spec.md
  - Technical approach from plan.md

  Tasks MUST be organized by user story and follow the constitution's workflow.
  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create/update package structures per implementation plan in `packages/` and `apps/`
- [ ] T002 Initialize dependencies in relevant `package.json` files
- [ ] T003 [P] Configure linting, formatting, and tsconfig paths for new packages

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [ ] T004 Setup Prisma schema and initial migration in `packages/shell/prisma/`
- [ ] T005 Implement shared services (e.g., Logger, Config) in `packages/shell/src/`
- [ ] T006 Configure API server and routing structure in `apps/[app-name]/src/`
- [ ] T007 Configure error handling and logging infrastructure

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Schemas & Core Logic (TDD) for User Story 1

**NOTE: Write tests FIRST, ensure they FAIL before implementation**

- [ ] T010 [P] [US1] Define Effect Schemas for [Entities] in `packages/shared-schemas/src/[entity].ts`
- [ ] T011 [P] [US1] Write failing unit/property tests for business logic in `packages/core/tests/[feature].test.ts`
- [ ] T012 [P] [US1] Implement pure functions in `packages/core/src/[feature].ts` to make tests pass (100% coverage required)

### Shell & Application for User Story 1

- [ ] T013 [US1] Implement database interaction service in `packages/shell/src/services/[db-service].ts`
- [ ] T014 [US1] Write failing integration tests for the API endpoint in `apps/[app-name]/tests/[feature].test.ts`
- [ ] T015 [US1] Implement API endpoint in `apps/[app-name]/src/routes/[feature].ts` (depends on T012, T013)
- [ ] T016 [US1] Add validation, error handling, and logging to the endpoint

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Schemas & Core Logic (TDD) for User Story 2

- [ ] T020 [P] [US2] Define/update Effect Schemas in `packages/shared-schemas/src/`
- [ ] T021 [P] [US2] Write failing unit/property tests in `packages/core/tests/`
- [ ] T022 [P] [US2] Implement pure functions in `packages/core/src/` to make tests pass

### Shell & Application for User Story 2

- [ ] T023 [US2] Implement/update services in `packages/shell/src/`
- [ ] T024 [US2] Write failing integration tests in `apps/[app-name]/tests/`
- [ ] T025 [US2] Implement API endpoint in `apps/[app-name]/src/`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] TXXX [P] Documentation updates for new packages/apis
- [ ] TXXX Code cleanup and refactoring
- [ ] TXXX Performance optimization across all stories
- [ ] TXXX Security hardening

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup. BLOCKS all user stories.
- **User Stories (Phase 3+)**: Depend on Foundational. Can proceed in parallel or by priority.
- **Polish (Final Phase)**: Depends on all desired user stories being complete.

### Within Each User Story

- **Schemas first.**
- **Core logic (TDD) second**: Tests MUST be written and FAIL before implementation.
- **Shell/App logic third**: Services, then endpoints.
- Story complete before moving to next priority.

### Parallel Opportunities

- All tasks marked [P] can run in parallel.
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows).
- Within a story, schema definition and core test writing can often be done in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (Schemas -> Core TDD -> Shell)
4. **STOP and VALIDATE**: Test User Story 1 independently.
5. Deploy/demo if ready.

### Incremental Delivery

1. Complete Setup + Foundational.
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!).
3. Add User Story 2 → Test independently → Deploy/Demo.
4. Each story adds value without breaking previous stories.

---

## Notes

- [P] tasks = different files, no dependencies.
- [Story] label maps task to specific user story for traceability.
- Each user story should be independently completable and testable.
- Verify core logic tests fail before implementing.
- Commit after each logical group of tasks.
- Stop at any checkpoint to validate story independently.
