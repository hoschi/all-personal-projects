CREATE TABLE IF NOT EXISTS youtube_history (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    youtube_id VARCHAR(20) NOT NULL,
    watched_time TIMESTAMP NOT NULL,
    details JSONB,
    activity_controls JSONB DEFAULT '[]'::jsonb,
    UNIQUE (youtube_id, watched_time)
);

CREATE INDEX IF NOT EXISTS idx_youtube_history_watched_time ON youtube_history(watched_time DESC);
CREATE INDEX IF NOT EXISTS idx_youtube_history_youtube_id ON youtube_history(youtube_id);
CREATE INDEX IF NOT EXISTS idx_youtube_history_activity_controls ON youtube_history USING GIN (activity_controls);

