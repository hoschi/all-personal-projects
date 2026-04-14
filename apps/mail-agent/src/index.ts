import { createAiPipeline } from "./ai"
import { createBootstrapConfig } from "./config"
import { createInMemoryStore } from "./data"
import { createGmailSync } from "./gmail"
import { createHttpRuntimePlaceholder } from "./http"
import { createNoopNotifier } from "./notify"
import { createPipelineStageDescriptors } from "./pipeline"

async function main() {
  const config = createBootstrapConfig()
  const dataStore = createInMemoryStore()
  const gmail = createGmailSync(config)
  const ai = createAiPipeline(config)
  const notifier = createNoopNotifier()
  const pipeline = createPipelineStageDescriptors()
  const http = createHttpRuntimePlaceholder()

  const gmailPollResult = await gmail.poll()
  const firstMessage = gmailPollResult.normalizedMessages.at(0)

  let classification: Awaited<ReturnType<typeof ai.classify>> | null = null
  let aiClassificationError: string | null = null

  if (firstMessage) {
    try {
      classification = await ai.classify({
        sender: firstMessage.sender,
        subject: firstMessage.subject,
        bodyText: firstMessage.bodyText,
        labels: firstMessage.labels,
        threadParticipants: firstMessage.threadParticipants,
      })
    } catch (error: unknown) {
      aiClassificationError =
        error instanceof Error ? error.message : String(error)
    }
  }

  if (classification && firstMessage) {
    dataStore.insert({
      gmailMessageId: firstMessage.gmailMessageId,
      gmailThreadId: firstMessage.gmailThreadId,
      classifierReason: classification.decision.reason,
      processedAtIso: new Date().toISOString(),
    })

    await notifier.sendNotification({
      subject: classification.decision.subject,
      summary: classification.decision.summary,
      undoUrl: "step-1-placeholder-undo-url",
    })
  }

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
      gmailSync: {
        mode: gmailPollResult.mode,
        cursorBefore: gmailPollResult.cursorBefore,
        cursorAfter: gmailPollResult.cursorAfter,
        candidateMessageCount: gmailPollResult.candidateMessageIds.length,
        normalizedMessageCount: gmailPollResult.normalizedMessages.length,
      },
      aiClassification: classification
        ? {
            path: classification.path,
            deleteIt: classification.decision.deleteIt,
            subject: classification.decision.subject,
          }
        : null,
      aiClassificationError,
      pipeline,
      http,
    }),
  )
}

main().catch((error: unknown) => {
  throw new Error("mail-agent bootstrap failed", { cause: error })
})
