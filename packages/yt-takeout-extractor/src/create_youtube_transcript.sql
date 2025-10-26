CREATE SCHEMA IF NOT EXISTS main;

CREATE TABLE IF NOT EXISTS main.youtube_transcript (
    youtube_id TEXT PRIMARY KEY,
    transcript_original TEXT,
    transcript_without_times TEXT,
    lang TEXT,
    error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    description TEXT
);

CREATE INDEX IF NOT EXISTS idx_youtube_transcript_lang ON main.youtube_transcript (lang);

CREATE INDEX IF NOT EXISTS idx_youtube_transcript_created_at ON main.youtube_transcript (created_at);

-- Trigger-Funktion für updated_at
CREATE OR REPLACE FUNCTION main.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger auf youtube_transcript
DROP TRIGGER IF EXISTS update_youtube_transcript_updated_at ON main.youtube_transcript;

CREATE TRIGGER update_youtube_transcript_updated_at
    BEFORE UPDATE ON main.youtube_transcript
    FOR EACH ROW
    EXECUTE FUNCTION main.update_updated_at_column();