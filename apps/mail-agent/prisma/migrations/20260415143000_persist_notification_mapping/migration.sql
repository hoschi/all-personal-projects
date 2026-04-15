ALTER TABLE "processed_emails"
ADD COLUMN "notification_provider" TEXT,
ADD COLUMN "notification_provider_message_id" TEXT,
ADD COLUMN "notification_subject" TEXT,
ADD COLUMN "notification_summary" TEXT,
ADD COLUMN "notification_undo_url" TEXT;
