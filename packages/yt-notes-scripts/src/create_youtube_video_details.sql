CREATE SCHEMA IF NOT EXISTS main;

CREATE TABLE IF NOT EXISTS main.youtube_video_details (
    youtube_id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    published_at TIMESTAMPTZ,
    duration TEXT,
    chapters JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_youtube_video_details_published_at ON main.youtube_video_details (published_at);

CREATE INDEX IF NOT EXISTS idx_youtube_video_details_channel_title ON main.youtube_video_details (channel_title);

-- Trigger-Funktion für updated_at
CREATE OR REPLACE FUNCTION main.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger auf youtube_video_details
DROP TRIGGER IF EXISTS update_youtube_video_details_updated_at ON main.youtube_video_details;

CREATE TRIGGER update_youtube_video_details_updated_at
    BEFORE UPDATE ON main.youtube_video_details
    FOR EACH ROW
    EXECUTE FUNCTION main.update_updated_at_column();