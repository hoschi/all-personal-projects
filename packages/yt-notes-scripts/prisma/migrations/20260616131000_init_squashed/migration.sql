-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "yt";

-- CreateEnum
CREATE TYPE "ChannelClass" AS ENUM ('privat', 'arbeit', 'mixed', 'unknown');

-- CreateEnum
CREATE TYPE "AuditStatus" AS ENUM ('pending', 'ok', 'critical_ok', 'error_llm', 'error_empty_output', 'error_pass1', 'error_pass2', 'error_pass3_display_title', 'error_pass4_description', 'error_pass5_summary_long', 'error_stub_write', 'skip_too_long', 'skip_classification_mismatch', 'transcript_missing', 'transcript_error_upstream');

-- CreateTable
CREATE TABLE "channel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "classification" "ChannelClass" NOT NULL DEFAULT 'unknown',
    "subscribers" INTEGER,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "video" (
    "youtube_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "display_title" TEXT,
    "description" TEXT,
    "description_short" TEXT,
    "published_at" TIMESTAMP(3),
    "duration_sec" INTEGER,
    "chapters" JSONB,
    "hashtags" JSONB NOT NULL DEFAULT '[]',
    "thumbnail_url" TEXT,
    "channel_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "video_pkey" PRIMARY KEY ("youtube_id")
);

-- CreateTable
CREATE TABLE "watch_history" (
    "id" BIGSERIAL NOT NULL,
    "youtube_id" TEXT NOT NULL,
    "watched_at" TIMESTAMP(3) NOT NULL,
    "details" JSONB,
    "activity_controls" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "watch_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "note_link" (
    "id" BIGSERIAL NOT NULL,
    "youtube_id" TEXT NOT NULL,
    "vault" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "title" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "note_link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transcript" (
    "youtube_id" TEXT NOT NULL,
    "srt" TEXT,
    "plain" TEXT,
    "llmFormatted" TEXT,
    "lang" TEXT,
    "error" TEXT,
    "named_entities" JSONB,
    "audited_md" TEXT,
    "audited_at" TIMESTAMP(3),
    "audit_diff_pct" DOUBLE PRECISION,
    "audit_status" "AuditStatus" NOT NULL DEFAULT 'pending',
    "audit_error" TEXT,
    "audit_model" TEXT,
    "audit_run_id" TEXT,
    "consecutive_failure_count" INTEGER NOT NULL DEFAULT 0,
    "first_errored_at" TIMESTAMP(3),
    "last_errored_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transcript_pkey" PRIMARY KEY ("youtube_id")
);

-- CreateTable
CREATE TABLE "enrich_run" (
    "id" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" TIMESTAMP(3),
    "trigger" TEXT NOT NULL,
    "classification" TEXT NOT NULL,
    "count_total" INTEGER NOT NULL DEFAULT 0,
    "count_ok" INTEGER NOT NULL DEFAULT 0,
    "count_skipped" INTEGER NOT NULL DEFAULT 0,
    "count_errored" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "enrich_run_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vault" (
    "name" TEXT NOT NULL,
    "root_path" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vault_pkey" PRIMARY KEY ("name")
);

-- CreateIndex
CREATE INDEX "video_published_at_idx" ON "video"("published_at");

-- CreateIndex
CREATE INDEX "video_channel_id_idx" ON "video"("channel_id");

-- CreateIndex
CREATE UNIQUE INDEX "watch_history_youtube_id_watched_at_key" ON "watch_history"("youtube_id", "watched_at");

-- CreateIndex
CREATE INDEX "note_link_vault_idx" ON "note_link"("vault");

-- CreateIndex
CREATE UNIQUE INDEX "note_link_youtube_id_vault_file_path_key" ON "note_link"("youtube_id", "vault", "file_path");

-- AddForeignKey
ALTER TABLE "video" ADD CONSTRAINT "video_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "watch_history" ADD CONSTRAINT "watch_history_youtube_id_fkey" FOREIGN KEY ("youtube_id") REFERENCES "video"("youtube_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note_link" ADD CONSTRAINT "note_link_youtube_id_fkey" FOREIGN KEY ("youtube_id") REFERENCES "video"("youtube_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note_link" ADD CONSTRAINT "note_link_vault_fkey" FOREIGN KEY ("vault") REFERENCES "vault"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transcript" ADD CONSTRAINT "transcript_youtube_id_fkey" FOREIGN KEY ("youtube_id") REFERENCES "video"("youtube_id") ON DELETE RESTRICT ON UPDATE CASCADE;
