import Debug from "debug"

import { createAiPipeline } from "./ai"
import { createBootstrapConfig } from "./config"
import { createProcessedEmailStore } from "./data"
import { createGmailSync } from "./gmail"
import { createHttpRuntimePlaceholder } from "./http"
import { createNoopNotifier } from "./notify"
import { createPipelineStageDescriptors } from "./pipeline"

async function main() {
  const debug = Debug("app:action:main")
  debug("Starting mail-agent bootstrap")

  const config = createBootstrapConfig()
  debug(
    "Config loaded: pollIntervalMs=%d, labels=%O, telegramParseMode=%s",
    config.pollIntervalMs,
    config.labels,
    config.telegram.parseMode,
  )

  const processedEmailStore = createProcessedEmailStore()
  const gmail = createGmailSync(config)
  const ai = createAiPipeline(config)
  const notifier = createNoopNotifier()
  const pipeline = createPipelineStageDescriptors()
  const http = createHttpRuntimePlaceholder()
  debug("Adapters initialized: pipelineStageCount=%d", pipeline.length)

  const gmailPollResult = await gmail.poll()
  debug(
    "Gmail poll completed: mode=%s, cursorBefore=%s, cursorAfter=%s, candidateMessageCount=%d, normalizedMessageCount=%d",
    gmailPollResult.mode,
    gmailPollResult.cursorBefore,
    gmailPollResult.cursorAfter,
    gmailPollResult.candidateMessageIds.length,
    gmailPollResult.normalizedMessages.length,
  )

  const firstMessage = gmailPollResult.normalizedMessages.at(0)

  let classification: Awaited<ReturnType<typeof ai.classify>> | null = null
  let aiClassificationError: string | null = null
  let actionResult: Awaited<ReturnType<typeof gmail.applyAction>> | null = null
  let actionError: string | null = null
  let persistenceError: string | null = null
  let idempotencySkipped = false

  if (firstMessage) {
    const debug = Debug("app:action:main")
    debug(
      "First normalized message selected: gmailMessageId=%s, gmailThreadId=%s, sender=%s",
      firstMessage.gmailMessageId,
      firstMessage.gmailThreadId,
      firstMessage.sender,
    )

    const alreadyProcessed = await processedEmailStore.hasProcessedMessage(
      firstMessage.gmailMessageId,
    )

    if (alreadyProcessed) {
      idempotencySkipped = true
      debug(
        "Idempotency skip: gmailMessageId=%s already processed",
        firstMessage.gmailMessageId,
      )
    } else {
      try {
        classification = await ai.classify({
          sender: firstMessage.sender,
          subject: firstMessage.subject,
          bodyText: firstMessage.bodyText,
          labels: firstMessage.labels,
          threadParticipants: firstMessage.threadParticipants,
        })

        debug(
          "Classification succeeded: path=%s, deleteIt=%s, subject=%s",
          classification.path,
          classification.decision.deleteIt,
          classification.decision.subject,
        )
      } catch (error: unknown) {
        aiClassificationError =
          error instanceof Error ? error.message : String(error)

        debug(
          "Classification failed: gmailMessageId=%s, error=%s",
          firstMessage.gmailMessageId,
          aiClassificationError,
        )
      }

      if (classification) {
        try {
          actionResult = await gmail.applyAction(
            firstMessage.gmailMessageId,
            classification.decision.deleteIt,
          )

          debug(
            "Action applied: gmailMessageId=%s, appliedAction=%s, addedLabelIds=%O, removedLabelIds=%O",
            firstMessage.gmailMessageId,
            actionResult.appliedAction,
            actionResult.addedLabelIds,
            actionResult.removedLabelIds,
          )
        } catch (error: unknown) {
          actionError = error instanceof Error ? error.message : String(error)

          debug(
            "Action failed: gmailMessageId=%s, error=%s",
            firstMessage.gmailMessageId,
            actionError,
          )
        }
      }

      if (classification && actionResult) {
        try {
          await processedEmailStore.insert({
            gmailMessageId: firstMessage.gmailMessageId,
            gmailThreadId: firstMessage.gmailThreadId,
            deleteIt: classification.decision.deleteIt,
            summary: classification.decision.summary,
            subject: classification.decision.subject,
            reason: classification.decision.reason,
            appliedAction: actionResult.appliedAction,
            classifierOutput: classification.decision,
          })

          debug(
            "Persistence succeeded: gmailMessageId=%s",
            firstMessage.gmailMessageId,
          )
        } catch (error: unknown) {
          persistenceError =
            error instanceof Error ? error.message : String(error)

          debug(
            "Persistence failed: gmailMessageId=%s, error=%s",
            firstMessage.gmailMessageId,
            persistenceError,
          )
        }
      }
    }
  } else {
    const debug = Debug("app:action:main")
    debug("No normalized message available for this run")
  }

  if (classification && firstMessage && actionResult && !persistenceError) {
    await notifier.sendNotification({
      subject: classification.decision.subject,
      summary: classification.decision.summary,
      undoUrl: "step-1-placeholder-undo-url",
    })

    debug(
      "Notification emitted: gmailMessageId=%s, subject=%s",
      firstMessage.gmailMessageId,
      classification.decision.subject,
    )
  }

  debug(
    "Run finished: idempotencySkipped=%s, hasClassification=%s, hasActionResult=%s, hasPersistenceError=%s",
    idempotencySkipped,
    classification !== null,
    actionResult !== null,
    persistenceError !== null,
  )

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
      actionResult,
      actionError,
      persistenceError,
      idempotencySkipped,
      pipeline,
      http,
    }),
  )
}

main().catch((error: unknown) => {
  throw new Error("mail-agent bootstrap failed", { cause: error })
})
