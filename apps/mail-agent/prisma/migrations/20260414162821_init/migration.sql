-- CreateTable
CREATE TABLE "processed_emails" (
    "id" TEXT NOT NULL,
    "gmail_message_id" TEXT NOT NULL,
    "gmail_thread_id" TEXT NOT NULL,
    "delete_it" BOOLEAN NOT NULL,
    "summary" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "applied_action" TEXT NOT NULL,
    "user_action" TEXT,
    "processed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "classifier_output" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "processed_emails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_state" (
    "id" TEXT NOT NULL,
    "gmail_history_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agent_state_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "processed_emails_gmail_message_id_key" ON "processed_emails"("gmail_message_id");

-- CreateIndex
CREATE INDEX "processed_emails_gmail_thread_id_idx" ON "processed_emails"("gmail_thread_id");

-- CreateIndex
CREATE INDEX "processed_emails_processed_at_idx" ON "processed_emails"("processed_at");
