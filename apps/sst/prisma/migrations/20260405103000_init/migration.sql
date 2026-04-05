-- CreateEnum
CREATE TYPE "ModelRunStage" AS ENUM ('transcription', 'correction');

-- CreateEnum
CREATE TYPE "ModelProvider" AS ENUM ('whisper', 'ollama', 'unknown');

-- CreateTable
CREATE TABLE "tabs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "topText" TEXT NOT NULL DEFAULT '',
    "bottomText" TEXT NOT NULL DEFAULT '',
    "titleVersion" INTEGER NOT NULL DEFAULT 1,
    "topTextVersion" INTEGER NOT NULL DEFAULT 1,
    "bottomTextVersion" INTEGER NOT NULL DEFAULT 1,
    "titleUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "topTextUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bottomTextUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tabs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tab_sync_states" (
    "id" TEXT NOT NULL,
    "tabId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "knownTitleVersion" INTEGER NOT NULL DEFAULT 1,
    "knownTopTextVersion" INTEGER NOT NULL DEFAULT 1,
    "knownBottomTextVersion" INTEGER NOT NULL DEFAULT 1,
    "lastPulledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastPushedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tab_sync_states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "model_run_logs" (
    "id" TEXT NOT NULL,
    "tabId" TEXT,
    "stage" "ModelRunStage" NOT NULL,
    "provider" "ModelProvider" NOT NULL,
    "modelId" TEXT NOT NULL,
    "modelInput" TEXT NOT NULL,
    "modelOutput" TEXT NOT NULL,
    "durationMs" INTEGER,
    "gitCommitHash" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "model_run_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tabs_updatedAt_idx" ON "tabs"("updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "tab_sync_states_tabId_clientId_key" ON "tab_sync_states"("tabId", "clientId");

-- CreateIndex
CREATE INDEX "tab_sync_states_clientId_idx" ON "tab_sync_states"("clientId");

-- CreateIndex
CREATE INDEX "tab_sync_states_updatedAt_idx" ON "tab_sync_states"("updatedAt");

-- CreateIndex
CREATE INDEX "model_run_logs_tabId_createdAt_idx" ON "model_run_logs"("tabId", "createdAt");

-- CreateIndex
CREATE INDEX "model_run_logs_stage_createdAt_idx" ON "model_run_logs"("stage", "createdAt");

-- CreateIndex
CREATE INDEX "model_run_logs_modelId_idx" ON "model_run_logs"("modelId");

-- AddForeignKey
ALTER TABLE "tab_sync_states" ADD CONSTRAINT "tab_sync_states_tabId_fkey" FOREIGN KEY ("tabId") REFERENCES "tabs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "model_run_logs" ADD CONSTRAINT "model_run_logs_tabId_fkey" FOREIGN KEY ("tabId") REFERENCES "tabs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
