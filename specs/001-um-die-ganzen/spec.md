# Feature Specification: Boilerplate Demo - Video & Note Management

**Feature Branch**: `001-um-die-ganzen`
**Created**: 2025-10-13
**Status**: Draft
**Input**: User description: "Demonstrate boilerplate capabilities using a video and note management scenario."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Import Video URLs from Local Notes (Priority: P1)

As a user, I want to run a command-line tool that scans my local Markdown notes, extracts all YouTube URLs, and interactively prompts me to import them into a central video library. This allows me to quickly populate my video collection from my existing knowledge base.

**Why this priority**: This is the primary data ingestion mechanism and the foundation for all other features.

**Independent Test**: The CLI tool can be run on a directory of sample Markdown files. The successful creation of `Video` records in the database and the `NoteVideo` associations can be verified independently.

**Acceptance Scenarios**:

1. **Given** a directory containing Markdown files with YouTube URLs, **When** the user runs the import CLI, **Then** the system identifies all unique URLs and prompts for confirmation for each.
2. **Given** the user confirms a URL for import, **When** the URL does not exist in the database, **Then** a new `Video` record is created.
3. **Given** the user confirms a URL for import, **When** the URL already exists, **Then** the existing `Video` record is used (upsert).
4. **Given** a note file is processed, **When** videos are imported from it, **Then** a many-to-many relationship is created between the `Note` and all confirmed `Video` records.
5. **Given** the user denies a URL for import, **When** the process completes, **Then** no `Video` or `NoteVideo` record is created for that URL.

---

### User Story 2 - Manage Notes via Web Interface (Priority: P2)

As a user, I want a web application where I can create, view, update, and delete my notes. When editing a note, I want to be able to associate it with multiple videos from my library using a multi-select picker.

**Why this priority**: This provides the core user-facing interface for managing the primary content.

**Independent Test**: The web app's note management section can be tested by creating a new note, associating it with mock video data, updating it, and then deleting it.

**Acceptance Scenarios**:

1. **Given** I am on the web app, **When** I create a new note with content and select several existing videos, **Then** a new `Note` record is created and linked to the selected `Video` records.
2. **Given** an existing note, **When** I edit its content and change the video associations, **Then** the `Note` record and its `NoteVideo` relationships are updated accordingly.
3. **Given** I try to save a note that references a non-existent video ID, **When** I submit the form, **Then** the system shows a validation error and does not save the note.
4. **Given** an existing note, **When** I delete it, **Then** the `Note` record and its corresponding `NoteVideo` entries are removed.

---

### User Story 3 - View Video & Note Collections (Priority: P3)

As a user, I want to browse my entire collection of videos and notes through the web interface. I need to see which notes are linked to a specific video and, conversely, which videos are referenced in a specific note.

**Why this priority**: This enables discovery and navigation of the interconnected knowledge base.

**Independent Test**: The video and note list components can be tested independently by providing them with mock data and verifying that they render the correct relationships.

**Acceptance Scenarios**:

1. **Given** I am viewing the list of all videos, **When** I select a video, **Then** I can see a list of all notes that reference it.
2. **Given** I am viewing the list of all notes, **When** I select a note, **Then** I can see a list of all videos referenced within it.

---

### User Story 4 - Offline Note Synchronization (Priority: P4)

As a user of a private desktop application, I want to be able to download all my notes and their video relationships for offline viewing and editing. When I'm back online, I want to sync any changes I made back to the server.

**Why this priority**: This provides a "local-first" experience for the private notes manager, demonstrating a different application type.

**Independent Test**: The sync mechanism can be tested by running the desktop client, performing an initial sync, disconnecting, making local changes, reconnecting, and running the sync again, then verifying the data on the server.

**Acceptance Scenarios**:

1. **Given** I run the initial sync on the desktop app, **When** the sync completes, **Then** all notes and their video relationships are stored locally.
2. **Given** I am offline and edit a note locally, **When** I reconnect and run the sync, **Then** the changes are pushed to the remote server.
3. **Given** a note was updated on the server while I was offline, **When** I run the sync, **Then** the local version of the note is updated with the server's changes (server wins).

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
- **FR-010**: A private desktop application MUST be able to synchronize note and video relationship data for offline use.
- **FR-011**: The private application MUST be able to push local changes back to the server API.

### Data Contracts & Schemas *(include if feature involves data)*
<!--
  Per Constitution Principle V (Schema-Driven), these entities MUST be defined
  as Effect Schemas. They are the single source of truth for API contracts,
  database models, and frontend types.
-->

- **Video**: Represents a YouTube video with a unique URL and an optional title.
- **Note**: Represents a Markdown note with a file path, content, and relationships to multiple videos.
- **NoteVideo**: A join table representing the many-to-many relationship between Notes and Videos.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The CLI can process a directory with 50 Markdown files and 100 unique URLs in under 60 seconds (excluding user interaction time).
- **SC-002**: The web application's note editor loads and displays a note with 20 associated videos in under 2 seconds.
- **SC-003**: API response time for fetching a list of 100 videos is less than 500ms.
- **SC-004**: The offline sync for the private desktop app successfully synchronizes 200 notes and their relationships within 30 seconds on a stable connection.