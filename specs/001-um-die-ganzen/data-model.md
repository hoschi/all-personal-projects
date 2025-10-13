# Data Model & Schemas

**Purpose**: To define the canonical data structures for the application, serving as the single source of truth for the database, API, and frontend. These are implemented as Effect Schemas per Constitution Principle V.

## Prisma Schema (`packages/shell/prisma/schema.prisma`)

This is the ground truth for the database structure.

```prisma
// This model represents a YouTube video, identified by its unique URL.
// The title is optional and managed by the user via the web UI.
model Video {
  id    Int    @id @default(autoincrement())
  url   String @unique
  title String?
  notes Note[] @relation("NoteVideos")
}

// This model represents a user's Markdown note, identified by its local file path.
model Note {
  id       Int     @id @default(autoincrement())
  filePath String  @unique
  content  String
  videos   Video[] @relation("NoteVideos")
}

// This is a join table to create the many-to-many relationship
// between Notes and Videos.
model NoteVideo {
  note   Note @relation(fields: [noteId], references: [id])
  noteId Int
  video  Video @relation(fields: [videoId], references: [id])
  videoId Int

  @@id([noteId, videoId])
}
```

## Effect Schemas (`packages/shared-api/src/schemas.ts`)

These schemas define the data contracts used across the entire application stack, from API request/response validation to frontend type safety.

```typescript
import { Schema } from "effect";

// Represents a video entity. Used in API responses.
export const Video = Schema.Struct({
  id: Schema.Number,
  url: Schema.String,
  title: Schema.optional(Schema.String).pipe(Schema.nullable),
});
export type Video = Schema.Schema.Type<typeof Video>;

// Represents a note entity, including the IDs of all associated videos.
export const Note = Schema.Struct({
  id: Schema.Number,
  filePath: Schema.String,
  content: Schema.String,
  videoIds: Schema.Array(Schema.Number),
});
export type Note = Schema.Schema.Type<typeof Note>;

// Schema for creating a new note. `id` is omitted.
export const CreateNote = Schema.omit(Note, "id");
export type CreateNote = Schema.Schema.Type<typeof CreateNote>;

// Schema for the many-to-many relationship.
export const NoteVideo = Schema.Struct({
  noteId: Schema.Number,
  videoId: Schema.Number,
});
export type NoteVideo = Schema.Schema.Type<typeof NoteVideo>;
```
