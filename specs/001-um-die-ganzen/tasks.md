---
description: "Task list for implementing the Pragmatic TypeScript Boilerplate"
---

# Tasks: Boilerplate Demo - Video & Note Management

**Input**: Design documents from `/specs/001-um-die-ganzen/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/openapi.yml

**Tests**: Per the constitution, Test-Driven Development (TDD) is **MANDATORY** for all logic in `packages/core`. Tests for `shell` and `apps` are also required to ensure quality.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)

## Path Conventions

- **Public Monorepo**: `public-monorepo/`
- **Private Project**: `private-project/`
- **Functional Core**: `public-monorepo/packages/core/`
- **Imperative Shell**: `public-monorepo/packages/shell/`
- **Shared Schemas**: `public-monorepo/packages/shared-api/`
- **Web App**: `public-monorepo/apps/web/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Monorepo and core tooling initialization.

- [x] T001 [P] Initialize the `public-monorepo` using `bun create turbo`.
- [x] T003 Configure `turbo.json` in `public-monorepo` to use `bun` as the package manager and define basic pipelines (build, test, lint).
- [x] T008 [P] Set up Prettier for code formatting, separate from ESLint.
- [x] T005 [P] Create a shared `tsconfig` package in `public-monorepo` for consistent TypeScript settings.
- [x] T004 [P] Create a custom ESLint package `eslint-config-custom` in `public-monorepo`.
- [ ] T015 [P] Create core Project `public-monorepo/packages/core/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented.

- [ ] T009 Set up the Prisma schema in `public-monorepo/packages/shell/prisma/schema.prisma` based on `data-model.md`.
- [ ] T010 Create the initial database migration using `prisma migrate dev`.
- [ ] T011 Implement the Effect `PrismaService` layer in `public-monorepo/packages/shell/src/db.ts` to manage the Prisma client.
- [ ] T013 Define the core Effect Schemas (`Video`, `Note`, etc.) in `public-monorepo/packages/shared-api/src/schemas.ts`.

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Import Video URLs (Priority: P1) 🎯 MVP

**Goal**: Implement the CLI tool to scan Markdown files and import YouTube URLs.

**Independent Test**: Run the CLI on a test directory and verify database state.

### Core Logic (TDD) for User Story 1

- [ ] T014 [P] [US1] Write failing tests in `public-monorepo/packages/core/tests/url-extractor.test.ts` for URL extraction logic.
- [ ] T015 [P] [US1] Implement the pure function `extractYouTubeUrls` in `public-monorepo/packages/core/src/url-extractor.ts` to make tests pass.

### Shell & CLI Implementation for User Story 1

- [ ] T016 [US1] Implement file system interaction (scanning files) in `public-monorepo/packages/shell/src/fs.ts` using Effect.
- [ ] T017 [US1] Implement database logic for upserting videos and creating notes/relationships in `public-monorepo/packages/shell/src/video-db.ts`.
- [ ] T018 [US1] Create the `cli-importer` package structure in `public-monorepo/packages/`.
- [ ] T019 [US1] Implement the main CLI command in `public-monorepo/packages/cli-importer/src/index.ts`, composing the core and shell services.

**Checkpoint**: User Story 1 is fully functional and testable.

---

## Phase 4: User Story 2 - Manage Notes via Web (Priority: P2)

**Goal**: Implement the web application for full CRUD management of notes and video titles.

**Independent Test**: Interact with the web UI at `localhost:3000` to create, edit, and delete notes and videos.

### API Services for User Story 2

- [ ] T020 [P] [US2] Implement `video-service` endpoints (`getVideos`, `getVideo`) in `public-monorepo/packages/video-service/`.
- [ ] T021 [P] [US2] Implement `notes-service` endpoints (CRUD operations) in `public-monorepo/packages/notes-service/`.
- [ ] T022 [US2] Implement API endpoint for updating a video's title in `video-service`.

### Web App Implementation for User Story 2

- [ ] T023 [US2] Set up the Next.js application in `public-monorepo/apps/web/`.
- [ ] T024 [P] [US2] Create React components for displaying lists of notes and videos.
- [ ] T025 [P] [US2] Create the note editor form component, including a multi-select for video associations.
- [ ] T026 [US2] Implement client-side logic to fetch data from and send data to the API, using the shared Effect Schemas.
- [ ] T027 [US2] Add an editable title field to the video display component.

**Checkpoint**: User Story 2 is fully functional.

---

## Phase 5: User Story 3 - View Collections (Priority: P3)

**Goal**: Implement the UI for viewing relationships between videos and notes.

**Independent Test**: Navigate the web UI to see which notes are linked to a video and vice-versa.

### API Services for User Story 3

- [ ] T028 [P] [US3] Implement `getNotesForVideo(id)` endpoint in `video-service`.
- [ ] T029 [P] [US3] Implement `getVideosForNote(id)` endpoint in `notes-service`.

### Web App Implementation for User Story 3

- [ ] T030 [US3] In the web app's video detail view, display a list of all associated notes.
- [ ] T031 [US3] In the web app's note detail view, display a list of all associated videos.

**Checkpoint**: User Story 3 is fully functional.

---

## Phase 6: User Story 4 - Offline Sync CLI (Priority: P4)

**Goal**: Implement the private CLI for local-first note synchronization.

**Independent Test**: Run the sync CLI, make local changes, and run it again to verify server state.

- [ ] T032 [US4] Set up the `notes-manager-cli` in the `private-project` repository.
- [ ] T033 [US4] Implement the "download" sync logic to fetch all notes from the API and save them as local Markdown files.
- [ ] T034 [US4] Implement the "upload" sync logic to detect local file changes (creations, updates, deletions) and push them to the API.
- [ ] T035 [US4] Implement the "Server Wins" conflict resolution strategy.
- [ ] T036 [US4] Configure a pre-push Git hook in the private project to ensure it builds without `bun link`.

**Checkpoint**: All user stories are now implemented.

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Finalize documentation, QA, and developer experience features.

- [ ] T037 [P] Write documentation for developers (first-time setup, daily work, creating projects).
- [ ] T038 [P] Write documentation for the AI coding assistant (rules, guardrails, stack-specific Do's and Don'ts).
- [ ] T039 Set up GitHub Actions workflow for CI (lint, test, build).
- [ ] T040 Configure Renovate Bot for automated dependency updates.
- [ ] T041 Implement automated checks for unused code (`knip`) and circular dependencies (`dpdm`).

## Additional Stuff, implement when needed

- [ ] T002 [P] Initialize the `private-project` with a `notes-manager-cli` package.
- [ ] T006 Configure ESLint rules in `eslint-config-custom` to enforce the "Functional Core, Imperative Shell" import restrictions.
- [ ] T007 [P] Configure VS Code workspace settings (`.vscode/settings.json`) for ESLint, Prettier, and hiding `console.log` errors.
- [ ] T012 Implement a configurable Effect `FileLogger` service in `public-monorepo/packages/shell/src/logger.ts`.

---

## Dependencies & Execution Order

- **Setup (Phase 1)** -> **Foundational (Phase 2)**
- **Foundational (Phase 2)** -> **All User Stories (Phase 3-6)**
- **User Stories**: Can be implemented sequentially (P1 -> P2 -> P3 -> P4) or in parallel after Phase 2 is complete.
- **Polish (Phase N)**: Can be worked on in parallel after Phase 2, but must be completed after all user stories.

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: The core data import mechanism is functional.
