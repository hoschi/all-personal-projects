import Debug from "debug"

import { createAiPipeline } from "./ai"
import { createBootstrapConfig } from "./config"
import { createProcessedEmailStore } from "./data"
import { createGmailSync, persistCursor } from "./gmail"
import { createHttpRuntime } from "./http"
import { createNotifier } from "./notify"
import { createPipelineStageDescriptors } from "./pipeline"

async function main() {
  const debug = Debug("app:action:main")
  debug("Starting mail-agent bootstrap")

  const config = createBootstrapConfig()
  debug(
    "Config loaded: pollIntervalMs=%d, labels=%O",
    config.pollIntervalMs,
    config.labels,
  )

  const processedEmailStore = createProcessedEmailStore()
  const gmail = createGmailSync(config)
  const ai = createAiPipeline(config)
  const notifier = createNotifier(config, processedEmailStore)
  const pipeline = createPipelineStageDescriptors()
  const httpRuntime = createHttpRuntime(
    config,
    processedEmailStore,
    gmail,
    notifier,
  )
  debug("Adapters initialized: pipelineStageCount=%d", pipeline.length)

  const processingSummary = {
    totalNormalizedMessages: 0,
    totalCandidateMessages: 0,
    pollCycles: 0,
    idempotencySkippedCount: 0,
    classificationSuccessCount: 0,
    classificationErrorCount: 0,
    actionSuccessCount: 0,
    actionErrorCount: 0,
    persistenceSuccessCount: 0,
    persistenceErrorCount: 0,
    notificationSuccessCount: 0,
    notificationErrorCount: 0,
  }
  const mutableProcessingSummary = {
    ...processingSummary,
  }

  let pollCycle = 0
  let repeatedFullSyncBatchCount = 0
  let previousFullSyncBatchSignature: string | null = null

  while (true) {
    pollCycle += 1
    const gmailPollResult = await gmail.poll()
    const currentBatchSignature = gmailPollResult.candidateMessageIds.join(",")

    mutableProcessingSummary.pollCycles = pollCycle
    mutableProcessingSummary.totalCandidateMessages +=
      gmailPollResult.candidateMessageIds.length
    mutableProcessingSummary.totalNormalizedMessages +=
      gmailPollResult.normalizedMessages.length

    debug(
      "Gmail poll completed: cycle=%d, mode=%s, cursorBefore=%s, cursorAfter=%s, candidateMessageCount=%d, normalizedMessageCount=%d",
      pollCycle,
      gmailPollResult.mode,
      gmailPollResult.cursorBefore,
      gmailPollResult.cursorAfter,
      gmailPollResult.candidateMessageIds.length,
      gmailPollResult.normalizedMessages.length,
    )

    // Log all candidate messages before processing
    if (gmailPollResult.candidateMessageIds.length > 0) {
      debug(
        "Candidate messages to process: cycle=%d, candidateCount=%d, candidateMessageIds=%O",
        pollCycle,
        gmailPollResult.candidateMessageIds.length,
        gmailPollResult.candidateMessageIds,
      )
    }

    if (gmailPollResult.normalizedMessages.length === 0) {
      debug(
        "No normalized message available for this cycle: cycle=%d",
        pollCycle,
      )
    }

    for (const message of gmailPollResult.normalizedMessages) {
      const processingMessage = `Processing normalized message: gmailMessageId=${message.gmailMessageId}, gmailThreadId=${message.gmailThreadId}, sender=${message.sender}`

      // Add labels to processing log if LIST_LABELS is enabled
      if (config.listLabels && message.labels.length > 0) {
        debug(`${processingMessage}, labels=${JSON.stringify(message.labels)}`)
      } else {
        debug(processingMessage)
      }

      const alreadyProcessed = await processedEmailStore.hasProcessedMessage(
        message.gmailMessageId,
      )

      if (alreadyProcessed) {
        mutableProcessingSummary.idempotencySkippedCount += 1
        debug(
          "Idempotency skip: gmailMessageId=%s already processed",
          message.gmailMessageId,
        )
        continue
      }

      let classification: Awaited<ReturnType<typeof ai.classify>>

      try {
        classification = await ai.classify({
          sender: message.sender,
          subject: message.subject,
          bodyText: message.bodyText,
          labels: message.labels,
          threadParticipants: message.threadParticipants,
        })
        mutableProcessingSummary.classificationSuccessCount += 1

        debug(
          "Classification succeeded: gmailMessageId=%s, path=%s, deleteIt=%s, subject=%s",
          message.gmailMessageId,
          classification.path,
          classification.decision.deleteIt,
          classification.decision.subject,
        )
      } catch (error: unknown) {
        const classificationError =
          error instanceof Error ? error.message : String(error)
        mutableProcessingSummary.classificationErrorCount += 1

        debug(
          "Classification failed: gmailMessageId=%s, error=%s",
          message.gmailMessageId,
          classificationError,
        )
        continue
      }

      let actionResult: Awaited<ReturnType<typeof gmail.applyAction>>

      try {
        actionResult = await gmail.applyAction(
          message.gmailMessageId,
          classification.decision,
        )
        mutableProcessingSummary.actionSuccessCount += 1

        debug(
          "Action applied: gmailMessageId=%s, appliedAction=%s, addedLabelIds=%O, removedLabelIds=%O",
          message.gmailMessageId,
          actionResult.appliedAction,
          actionResult.addedLabelIds,
          actionResult.removedLabelIds,
        )
      } catch (error: unknown) {
        const actionError =
          error instanceof Error ? error.message : String(error)
        mutableProcessingSummary.actionErrorCount += 1

        debug(
          "Action failed: gmailMessageId=%s, error=%s",
          message.gmailMessageId,
          actionError,
        )
        continue
      }

      try {
        await processedEmailStore.insert({
          gmailMessageId: message.gmailMessageId,
          gmailThreadId: message.gmailThreadId,
          deleteIt: classification.decision.deleteIt,
          summary: classification.decision.summary,
          subject: classification.decision.subject,
          reason: classification.decision.reason,
          appliedAction: actionResult.appliedAction,
          classifierOutput: classification.decision,
        })
        mutableProcessingSummary.persistenceSuccessCount += 1

        debug(
          "Persistence succeeded: gmailMessageId=%s",
          message.gmailMessageId,
        )
      } catch (error: unknown) {
        const persistenceError =
          error instanceof Error ? error.message : String(error)
        mutableProcessingSummary.persistenceErrorCount += 1

        debug(
          "Persistence failed: gmailMessageId=%s, error=%s",
          message.gmailMessageId,
          persistenceError,
        )
        continue
      }

      const undoUrl = httpRuntime.createUndoUrl(message.gmailMessageId)

      try {
        const notificationResult = await notifier.sendNotification({
          gmailMessageId: message.gmailMessageId,
          appliedAction: actionResult.appliedAction,
          subject: classification.decision.subject,
          reason: classification.decision.reason,
          summary: classification.decision.summary,
          undoUrl,
        })
        mutableProcessingSummary.notificationSuccessCount += 1

        debug(
          "Notification emitted: gmailMessageId=%s, subject=%s, providerMessageId=%s",
          message.gmailMessageId,
          classification.decision.subject,
          notificationResult.providerMessageId,
        )
      } catch (error: unknown) {
        const notificationError =
          error instanceof Error ? error.message : String(error)
        mutableProcessingSummary.notificationErrorCount += 1

        debug(
          "Notification failed: gmailMessageId=%s, error=%s",
          message.gmailMessageId,
          notificationError,
        )
      }
    }

    // Handle full sync specific logic
    if (gmailPollResult.mode === "full_sync") {
      if (gmailPollResult.candidateMessageIds.length === 0) {
        debug(
          "Full sync completed: no more candidates left after cycle=%d",
          pollCycle,
        )
        // Don't break - continue with history polling
      }

      if (currentBatchSignature === previousFullSyncBatchSignature) {
        repeatedFullSyncBatchCount += 1
      } else {
        repeatedFullSyncBatchCount = 0
      }

      previousFullSyncBatchSignature = currentBatchSignature

      if (repeatedFullSyncBatchCount >= 1) {
        debug(
          "Detected repeated full-sync batch without progress, forcing history mode: cycle=%d, candidateMessageIds=%O",
          pollCycle,
          gmailPollResult.candidateMessageIds,
        )

        // Force history mode by persisting current cursor as history ID
        if (gmailPollResult.cursorAfter) {
          await persistCursor(gmailPollResult.cursorAfter)
          debug(
            "Forced history mode by persisting cursor: cursorAfter=%s",
            gmailPollResult.cursorAfter,
          )
        }

        // Reset counter to avoid repeated forcing
        repeatedFullSyncBatchCount = 0
      } else {
        debug(
          "Continuing with next full-sync page: completedCycle=%d, candidateMessageCount=%d",
          pollCycle,
          gmailPollResult.candidateMessageIds.length,
        )
      }
    }

    // Persist cursor after successful processing
    if (gmailPollResult.cursorAfter) {
      await persistCursor(gmailPollResult.cursorAfter)
      debug(
        "Cursor persisted after processing: cursorAfter=%s, processedMessageCount=%d",
        gmailPollResult.cursorAfter,
        gmailPollResult.normalizedMessages.length,
      )
    }

    // Wait for next poll cycle
    debug("Waiting %d ms until next poll cycle...", config.pollIntervalMs)
    await new Promise((resolve) => setTimeout(resolve, config.pollIntervalMs))
  }

  debug("Loop finished: processingSummary=%O", mutableProcessingSummary)
}

main().catch((error: unknown) => {
  throw new Error("mail-agent bootstrap failed", { cause: error })
})
