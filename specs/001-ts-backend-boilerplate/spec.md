# Feature Specification: TypeScript Backend Boilerplate 2025

**Feature Branch**: `001-ts-backend-boilerplate`
**Created**: 2025-10-12
**Status**: Revised
**Input**: User description: "Spezifikation: TypeScript Backend Boilerplate 2025..."

## User Scenarios & Testing *(mandatory)*

The primary user of this boilerplate is a developer building a new TypeScript application. The boilerplate will include a demo implementation (a video/note manager) to illustrate its features and patterns.

### User Story 1 - Understand CLI Tool Development (Priority: P1)

As a developer using this boilerplate, I want to see a working example of a CLI command (e.g., importing videos from notes), so that I can quickly understand the established patterns for building, testing, and structuring my own command-line tools.

**Why this priority**: Showcases how to handle tasks and side effects outside of an API context, a common requirement.

**Independent Test**: The sample CLI command can be executed, and its effects (e.g., database entries) can be verified, confirming the pattern is functional.

**Acceptance Scenarios**:

1.  **Given** the boilerplate is set up, **When** a developer inspects the `packages/cli` directory, **Then** they find a clear, documented example of a command.
2.  **Given** the developer runs the sample command, **Then** it executes successfully and produces the expected outcome as described in its documentation.

---

### User Story 2 - Build Type-Safe CRUD APIs (Priority: P1)

As a developer using this boilerplate, I want a complete example of a type-safe CRUD API (e.g., for managing notes), so that I can use it as a template to build endpoints for my own data models with confidence.

**Why this priority**: This is the most common use case for a backend boilerplate and demonstrates the core value proposition.

**Independent Test**: The sample API endpoints can be called, and their responses and side effects can be verified against the OpenAPI specification.

**Acceptance Scenarios**:

1.  **Given** the boilerplate is running, **When** a developer sends requests to the sample `/notes` CRUD endpoints, **Then** the API behaves as documented in the auto-generated OpenAPI spec.
2.  **Given** a developer wants to add a new entity, **Then** they can copy the `notes` service and schema files, modify them, and have a new, working CRUD endpoint in minutes.

---

### User Story 3 - Integrate a Frontend Application (Priority: P2)

As a developer using this boilerplate, I want a sample web application (e.g., a video overview) that consumes the backend API, so that I can understand how to use the shared API schema and build a full-stack application.

**Why this priority**: Demonstrates the end-to-end workflow and the benefits of the shared, type-safe API layer.

**Independent Test**: The sample web application can be run, and it will successfully fetch and display data from the backend API.

**Acceptance Scenarios**:

1.  **Given** the backend is running, **When** a developer starts the sample Next.js application, **Then** it successfully fetches and displays a list of videos from the API.
2.  **Given** a developer inspects the frontend code, **Then** they find that it imports types directly from the `shared-api` package, ensuring type safety between client and server.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The boilerplate MUST provide a sample CLI application to demonstrate command-line task patterns.
- **FR-002**: The boilerplate MUST provide a sample REST API with full CRUD operations to demonstrate API patterns.
- **FR-003**: The sample API MUST demonstrate data integrity enforcement (e.g., preventing notes from linking to non-existent videos).
- **FR-004**: The boilerplate MUST automatically generate an OpenAPI 3.0 specification from the sample API definition.
- **FR-005**: The API definitions and data schemas MUST be structured in a `shared-api` package, demonstrating a pattern for client-server type sharing.
- **FR-006**: The boilerplate MUST be pre-configured to support multi-tenancy via PostgreSQL schemas.
- **FR-007**: The boilerplate MUST include a complete and functional database migration setup using Prisma Migrate.
- **FR-008**: The boilerplate MUST include a sample Next.js web application to demonstrate full-stack integration.
- **FR-009**: The project MUST be structured as a monorepo using Turborepo and Bun Workspaces.
- **FR-010**: The testing framework MUST be configured to generate both human-readable (HTML) and machine-readable (LCOV/JSON) coverage reports.

### Key Entities (for Demo Content)

- **Video**: Represents a YouTube video.
- **Note**: Represents a Markdown note.
- **NoteVideo**: Represents the many-to-many relationship between Notes and Videos.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer MUST be able to clone the repository, install dependencies, and run the entire test suite with a single command.
- **SC-002**: Hot-reloading cycles for both backend and frontend during development MUST complete in under 5 seconds.
- **SC-003**: The boilerplate code itself MUST maintain a minimum of 95% test coverage.
- **SC-004**: The generated OpenAPI specification MUST be 100% consistent with the sample API's behavior.
- **SC-005**: A developer using the boilerplate MUST be able to add a new, fully-tested CRUD endpoint for a new entity by following the provided patterns in under 1 hour.