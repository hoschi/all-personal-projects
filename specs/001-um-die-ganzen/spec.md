# Feature Specification: Boilerplate Demo - Video & Note Management

**Feature Branch**: `001-um-die-ganzen`
**Created**: 2025-10-13
**Status**: Draft
**Input**: User description: "Demonstrate boilerplate capabilities using a video and note management scenario."

## Clarifications
### Session 2025-10-13
- Q: What should happen if a note was changed both locally and on the server while the user was offline? → A: Server Wins: The local changes at this specific note will be overwritten.

- Q: Where exactly should the validation for video references occur? → A: API-side: The notes-service is solely responsible for validation before writing to the database.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Import Video URLs from Local Notes (Priority: P1)

As a user, I want to run a command-line tool that scans my local Markdown notes, extracts all YouTube URLs, and interactively prompts me to import them into a central video library. This allows me to quickly populate my video collection from my existing knowledge base.

**Why this priority**: This is the primary data ingestion mechanism and the foundation for all other features.

**Independent Test**: The CLI tool can be run on a directory of sample Markdown files. The successful creation of `Video` records in the database and the `NoteVideo` associations can be verified independently.

**Acceptance Scenarios**:

1. **Given** a directory containing Markdown files with YouTube URLs, **When** the user runs the import CLI, **Then** the system identifies all unique URLs and prompts for confirmation for each.
2. **Given** the user confirms a URL for import, **When** the URL does not exist in the database, **Then** a new `Video` record is created with a null title.
3. **Given** the user confirms a URL for import, **When** the URL already exists, **Then** the existing `Video` record is used (upsert).
4. **Given** a note file is processed, **When** new videos are imported from it, **Then** a many-to-many relationship is created between the `Note` and the newly created `Video` records.
5. **Given** the user denies a URL for import, **When** the process completes, **Then** no `Video` or `NoteVideo` record is created for that URL.
6. **Given** a note file contains a URL for a `Video` that already exists, **When** the user confirms the import, **Then** a new many-to-many relationship is created linking the current `Note` to the *existing* `Video` record.

---

### User Story 2 - Manage Notes via Web Interface (Priority: P2)

As a user, I want a web application where I can create, view, update, and delete my notes. When editing a note, I want to be able to associate it with multiple videos from my library using a multi-select picker. I also want to be able to edit the titles of my videos.

**Why this priority**: This provides the core user-facing interface for managing the primary content and its metadata.

**Independent Test**: The web app's note management section can be tested by creating a new note, associating it with mock video data, updating it, and then deleting it. Video title editing can be tested similarly.

**Acceptance Scenarios**:

1. **Given** I am on the web app, **When** I create a new note with content and select several existing videos, **Then** a new `Note` record is created and linked to the selected `Video` records.
2. **Given** an existing note, **When** I edit its content and change the video associations, **Then** the `Note` record and its `NoteVideo` relationships are updated accordingly.
3. **Given** I try to save a note that references a non-existent video ID, **When** I submit the form, **Then** the system shows a validation error and does not save the note.
4. **Given** an existing note, **When** I delete it, **Then** the `Note` record and its corresponding `NoteVideo` entries are removed.
5. **Given** I am viewing a video in the web app, **When** I edit its title and save, **Then** the `title` field of the `Video` record is updated.

---

### User Story 3 - View Video & Note Collections (Priority: P3)

As a user, I want to browse my entire collection of videos and notes through the web interface. I need to see which notes are linked to a specific video and, conversely, which videos are referenced in a specific note.

**Why this priority**: This enables discovery and navigation of the interconnected knowledge base.

**Independent Test**: The video and note list components can be tested independently by providing them with mock data and verifying that they render the correct relationships.

**Acceptance Scenarios**:

1. **Given** I am viewing the list of all videos, **When** I select a video, **Then** I can see its title and a list of all notes that reference it.
2. **Given** I am viewing the list of all notes, **When** I select a note, **Then** I can see a list of all videos referenced within it.

---

### User Story 4 - Offline Note Synchronization via Private CLI (Priority: P4)

As a user of a private CLI tool, I want to be able to download all my notes and their video relationships for offline viewing and editing directly in my local Markdown files. When I'm back online, I want to run a command to sync any changes I made back to the server.

**Why this priority**: This provides a "local-first" experience for managing notes, demonstrating a different application type that integrates with a user's local file system.

**Independent Test**: The sync mechanism can be tested by running the CLI, performing an initial sync, disconnecting, making local file changes, reconnecting, and running the sync again, then verifying the data on the server.

**Acceptance Scenarios**:

1. **Given** I run the initial sync command in the private CLI, **When** the sync completes, **Then** all notes and their video relationships are stored as local Markdown files.
2. **Given** I am offline and edit a note file locally, **When** I reconnect and run the sync command, **Then** the changes are pushed to the remote server.
3. **Given** a note was updated on the server while I was offline, **When** I run the sync command, **Then** the local version of the note file is updated with the server's changes.
4. **Given** a note was updated both locally and on the server while offline, **When** I run the sync command, **Then** the local version of the note file is overwritten by the server's version ("Server Wins").
5. **Given** a note file that was previously synced is deleted locally, **When** I run the sync command, **Then** the corresponding `Note` record and its `NoteVideo` relationships are deleted from the server.

### Edge Cases

- What happens if a Markdown file contains duplicate YouTube URLs? (The system should treat them as a single instance for that file).
- How does the system handle non-YouTube URLs or malformed URLs? (They should be ignored by the importer).
- What happens if the database is unavailable during an import? (The CLI should report a clear error and exit gracefully).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a CLI to scan a directory for Markdown files.
- **FR-002**: The CLI MUST extract all unique YouTube URLs from the content of the scanned files.
- **FR-003**: The CLI MUST prompt the user for confirmation before importing each URL.
- **FR-004**: The system MUST persist `Video` and `Note` entities with a many-to-many relationship.
- **FR-005**: The system MUST provide API endpoints for full CRUD (Create, Read, Update, Delete) operations on notes.
- **FR-006**: The note creation/update process MUST validate that all referenced video IDs exist in the database.
- **FR-007**: The system MUST provide API endpoints to list all videos and all notes.
- **FR-008**: The API MUST allow fetching all notes for a given video and all videos for a given note.
- **FR-009**: A public web application MUST be provided to display and manage notes and videos.
- **FR-010**: A private CLI tool MUST be able to synchronize note and video relationship data for offline use, storing them as local files.
- **FR-011**: The private CLI tool MUST be able to push local file changes back to the server API.
- **FR-012**: The web application MUST provide an interface for users to edit the title of a video.
- **FR-013**: The private CLI tool's sync process MUST detect the deletion of local note files and delete the corresponding `Note` on the server.
- **FR-014**: The notes-service API MUST be the single source of truth for validating the existence of video IDs during note creation or updates.

### Data Contracts & Schemas *(include if feature involves data)*
<!--
  Per Constitution Principle V (Schema-Driven), these entities MUST be defined
  as Effect Schemas. They are the single source of truth for API contracts,
  database models, and frontend types.
-->

- **Video**: Represents a YouTube video with a unique URL and an optional, user-managed title.
- **Note**: Represents a Markdown note with a file path, content, and relationships to multiple videos.
- **NoteVideo**: A join table representing the many-to-many relationship between Notes and Videos.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The CLI successfully processes all Markdown files in a directory, correctly identifying and prompting for all unique YouTube URLs.
- **SC-002**: The web application's note editor loads and displays notes and their associated videos promptly, ensuring a fluid user experience.
- **SC-003**: The API provides timely responses for fetching collections of data, supporting a responsive user interface.
- **SC-004**: The offline sync for the private desktop app reliably synchronizes a large volume of notes and their relationships.