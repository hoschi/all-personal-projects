import { createAiPipelinePlaceholder } from "./ai"
import { createBootstrapConfig } from "./config"
import { createInMemoryStore } from "./data"
import { createGmailSyncPlaceholder } from "./gmail"
import { createHttpRuntimePlaceholder } from "./http"
import { createNoopNotifier } from "./notify"
import { createPipelineStageDescriptors } from "./pipeline"

async function main() {
  const config = createBootstrapConfig()
  const dataStore = createInMemoryStore()
  const gmail = createGmailSyncPlaceholder()
  const ai = createAiPipelinePlaceholder()
  const notifier = createNoopNotifier()
  const pipeline = createPipelineStageDescriptors()
  const http = createHttpRuntimePlaceholder()

  const decision = await ai.classify()
  dataStore.insert({
    gmailMessageId: "step-1-placeholder-message",
    gmailThreadId: "step-1-placeholder-thread",
    classifierReason: decision.reason,
    processedAtIso: "1970-01-01T00:00:00.000Z",
  })

  await notifier.sendNotification({
    subject: decision.subject,
    summary: decision.summary,
    undoUrl: "step-1-placeholder-undo-url",
  })

  await gmail.poll()

  console.log(
    JSON.stringify({
      appName: config.appName,
      startedAtIso: config.startedAtIso,
      pollIntervalMs: config.pollIntervalMs,
      databaseSchemaName: config.databaseSchemaName,
      publicBaseUrl: config.publicBaseUrl,
      labels: config.labels,
      telegram: {
        chatId: config.telegram.chatId,
        allowedUserIdsCount: config.telegram.allowedUserIds.length,
        parseMode: config.telegram.parseMode,
      },
      pipeline,
      http,
    }),
  )
}

main().catch((error: unknown) => {
  throw new Error("mail-agent bootstrap failed", { cause: error })
})
