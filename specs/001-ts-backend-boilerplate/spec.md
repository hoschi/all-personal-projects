# Feature Specification: TypeScript Backend Boilerplate 2025

**Feature Branch**: `001-ts-backend-boilerplate`
**Created**: 2025-10-12
**Status**: Draft
**Input**: User description: "Spezifikation: TypeScript Backend Boilerplate 2025..."

## User Scenarios & Testing *(mandatory)*

This boilerplate will be delivered with a fully functional demo scenario that implements a system for managing YouTube videos and Markdown notes.

### User Story 1 - Video Import from Notes (Private Project) (Priority: P1)

As a user of a private project, I want to execute a CLI tool that searches my local Markdown notes for YouTube URLs, so that video entries are automatically created in the database and linked to the corresponding notes.

**Why this priority**: This demonstrates the core functionality of linking external content within the system and showcases the CLI capabilities.

**Independent Test**: This can be tested by running the CLI command with a sample directory of Markdown files and verifying that the correct `Video` and `Note` entries are created in the database.

**Acceptance Scenarios**:

1.  **Given** a directory with Markdown files containing YouTube URLs, **When** the CLI import tool is run, **Then** new `Video` records are created for each unique URL.
2.  **Given** the same directory, **When** the CLI import tool is run, **Then** `Note` records are created for each Markdown file and correctly linked to the corresponding `Video` records.

---

### User Story 2 - Note Management via API (Priority: P1)

As a user, I want to be able to create, read, update, and delete notes via an API, so that I can manage my content and the system ensures that all referenced videos exist.

**Why this priority**: This establishes the core CRUD functionality and data integrity rules of the backend.

**Independent Test**: This can be tested by making API calls to the respective CRUD endpoints for notes and verifying the operations in the database.

**Acceptance Scenarios**:

1.  **Given** valid note data, **When** a POST request is made to the `/notes` endpoint, **Then** a new `Note` record is created.
2.  **Given** an existing note ID, **When** a GET request is made to `/notes/{id}`, **Then** the corresponding note data is returned.
3.  **Given** an attempt to create a note with a non-existent `videoId`, **When** a POST request is made, **Then** the API returns an error.

---

### User Story 3 - Video Overview in Web App (Priority: P2)

As a user, I want to see a list of all videos in a web application, so that I can quickly see which notes belong to which video.

**Why this priority**: This demonstrates the consumption of the backend API by a frontend client.

**Independent Test**: This can be tested by launching the web application and navigating to the video list page, then verifying the list matches the data in the database.

**Acceptance Scenarios**:

1.  **Given** several videos exist in the database, **When** the user opens the video overview page, **Then** a list of all videos is displayed.

---

### User Story 4 - Note Detail and Editing in Web App (Priority: P2)

As a user, I want to view and edit a single note, including the association of videos, so that I can manage the relationships between my notes and videos.

**Why this priority**: This provides the full loop for content management from the frontend.

**Independent Test**: This can be tested by navigating to a specific note's page, editing its content or video associations, and verifying the changes are persisted in the database.

**Acceptance Scenarios**:

1.  **Given** an existing note, **When** the user navigates to its detail page, **Then** the note's content and associated videos are displayed.
2.  **Given** the user is on the note detail page, **When** they edit the content and save, **Then** the `Note` record is updated in the database.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a command-line interface for importing videos from Markdown files.
- **FR-002**: The system MUST expose a REST API for CRUD operations on notes.
- **FR-003**: The API MUST enforce data integrity, preventing notes from being linked to non-existent videos.
- **FR-004**: The system MUST automatically generate an OpenAPI 3.0 specification from the API definitions.
- **FR-005**: The API definitions and data schemas MUST be encapsulated in a shared package consumable by both server and client projects.
- **FR-006**: The database schema MUST support logical separation of tenants using PostgreSQL schemas.
- **FR-007**: All database migrations MUST be managed via Prisma Migrate.
- **FR-008**: The system MUST include a sample Next.js web application to demonstrate API consumption.
- **FR-009**: The project MUST be structured as a monorepo managed by Turborepo and Bun Workspaces.
- **FR-010**: The system MUST generate dual test coverage reports (HTML and LCOV/JSON).

### Key Entities *(include if feature involves data)*

- **Video**: Represents a YouTube video with a unique URL and an optional title.
- **Note**: Represents a Markdown note with a file path, content, and associations to one or more videos.
- **NoteVideo**: Represents the many-to-many relationship between Notes and Videos.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can set up the entire development environment and run all tests successfully with a single command.
- **SC-002**: Changes made in the `shared-api` package are reflected in both the backend and frontend applications in under 5 seconds during development.
- **SC-003**: The boilerplate achieves a test coverage of at least 95% for the core business logic.
- **SC-004**: The generated OpenAPI specification is 100% consistent with the implemented API behavior.
- **SC-005**: A new developer can add a new API endpoint and corresponding frontend component for a new entity within 2 hours by following the existing patterns.
