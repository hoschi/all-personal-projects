ALTER TABLE video."Video" RENAME COLUMN "titel" TO "title";
ALTER INDEX video."Video_titel_key" RENAME TO "Video_title_key";
