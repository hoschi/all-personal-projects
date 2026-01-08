# YouTube / Note Scripts

A collection of TypeScript scripts for importing and processing YouTube data into a PostgreSQL database. Includes history import, note link extraction, transcript downloading, and video details retrieval.

## ⚙️ How It Works

### History Import Script ([`import_youtube_history.ts`](src/import_youtube_history.ts))

- **Validation**: Zod schema checks raw data structure
- **ID Extraction**: Regex pattern extracts YouTube ID from URLs
- **Batch Processing**: 8 entries per batch (optimized for performance)
- **Duplicate Detection**: `ON CONFLICT` clause skips existing entries
- **Error Logging**: Detailed error logs with original data

### Note-Link Script ([`import_youtube_note_links.ts`](src/import_youtube_note_links.ts))

- **Markdown Scanning**: Recursively searches .md files for YouTube links
- **ID Extraction**: Supports various YouTube URL formats (Video, Shorts, Embed)
- **Database Logic**:
  - Duplicate check on (youtube_id, title, file_name)
  - Title conflict detection for same video ID
- **Error Collection**: Aggregates all errors for bundled output

### Transcript Script ([`import_youtube_transcript.ts`](src/import_youtube_transcript.ts))

- **yt-dlp Integration**: Downloads subtitles in SRT format
- **Effect.ts**: Robust error handling with retry logic
- **Database Operations**:
  - Upsert transcripts with language detection
  - Error message storage for failed downloads
- **Cleanup**: Automatic deletion of temporary files

### Video Details Script ([`get_video_details.ts`](src/get_video_details.ts))

- **YouTube API Integration**: Fetches video metadata via YouTube Data API v3
- **Chapter Extraction**: Parses timestamps from video descriptions
- **Duration Formatting**: Converts ISO 8601 duration to human-readable format
- **Output**: Console-based formatted output with full video details

**Usage:**

```bash
bun run get_video_details.ts <VIDEO_ID>
# Example: bun run get_video_details.ts wkTHCRSNhYo
```

## Lib

### Subtitle Processors ([`subtitle_processors.ts`](src/subtitle-processors.ts))

Pure functions for subtitle format conversion using `@aj-archipelago/subvibe`:

- **[`parseSRT()`](src/subtitle-processors.ts:20)**: Parse and normalize SRT content
- **[`toPlainText()`](src/subtitle-processors.ts:58)**: Convert SRT to plain text (removes timestamps)
- **[`toLLMFormat()`](src/subtitle-processors.ts:72)**: Convert SRT to LLM-optimized format with time intervals (default: 20s)

## 📋 Prerequisites

- Node.js ≥18.x
- PostgreSQL ≥15
- yt-dlp (`brew install yt-dlp` or `pip install yt-dlp`)
- `.env` file with:
  ```env
  DATABASE_URL="postgres://user:pass@host:port/db"
  YOUTUBE_API_KEY="your_api_key"  # For get_video_details.ts
  ```
- **For transcripts**: Chrome browser with logged-in YouTube account (for cookie access)

## 🛠️ Installation

```bash
bun install
cd packages/yt-takeout-extractor
cp .env.example .env
dotenv -f .env run -- zsh
psql $DATABASE_URL -f src/create_youtube_history.sql
psql $DATABASE_URL -f src/create_youtube_note_links.sql
psql $DATABASE_URL -f src/create_youtube_transcript.sql
```

## 🚀 Usage

```bash
# History import
bun src/import_youtube_history.ts path/to/history.json

# Note-link import
bun src/import_youtube_note_links.ts /path/to/notes

# Transcript download
bun src/import_youtube_transcript.ts main.youtube_videos

# Get video details (requires YOUTUBE_API_KEY)
bun run get_video_details.ts <VIDEO_ID>
```

## 🗃️ Database Schema Documentation

### youtube_history

| Column            | Type        | Description              |
| ----------------- | ----------- | ------------------------ |
| id                | SERIAL      | Primary key              |
| youtube_id        | VARCHAR(20) | Unique YouTube video ID  |
| watched_time      | TIMESTAMP   | Exact playback timestamp |
| details           | JSONB       | Additional metadata      |
| activity_controls | JSONB       | User interactions        |

### youtube_note_links

| Column     | Type        | Description                 |
| ---------- | ----------- | --------------------------- |
| youtube_id | VARCHAR(20) | Video ID (foreign key)      |
| title      | TEXT        | Optional user-defined title |
| file_name  | TEXT        | Full path to Markdown file  |
| created_at | TIMESTAMP   | Creation timestamp          |

### youtube_transcript

| Column              | Type        | Description                        |
| ------------------- | ----------- | ---------------------------------- |
| youtube_id          | VARCHAR(20) | Primary key                        |
| transcript_original | TEXT        | Raw transcript in SRT format       |
| lang                | VARCHAR(10) | Language code (e.g., 'en', 'de')   |
| error               | TEXT        | Error message for failed downloads |
| updated_at          | TIMESTAMP   | Last update                        |

## 🚨 Error Handling

- **General**:
  - Console output with error statistics
  - Detailed original data for severe errors
  - Transaction safety for database operations

- **Transcript-specific**:
  - Handling of private/locked videos
  - Cookie-based authentication errors
  - Error log storage in database

- **Note-link-specific**:
  - Title conflict detection for same video ID
  - YouTube link format validation
  - Batch processing of Markdown files
