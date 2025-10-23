CREATE TABLE IF NOT EXISTS youtube_note_links (
    id SERIAL PRIMARY KEY,
    youtube_id TEXT NOT NULL,
    titel TEXT,
    file_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (youtube_id, titel, file_name)
);

CREATE INDEX IF NOT EXISTS idx_youtube_id ON youtube_note_links(youtube_id);
CREATE INDEX IF NOT EXISTS idx_file_name ON youtube_note_links(file_name);
