import Debug from "debug"

import type { BootstrapConfig } from "../config"
import type { GmailAppliedAction } from "../gmail"
import type {
  GmailUndoPort,
  NotificationStatusPort,
  ProcessedEmailStoreUndoPort,
  UndoServiceResult,
} from "./contracts"
import { verifyUndoToken } from "./undo-token"

export function createUndoService(
  config: BootstrapConfig,
  processedEmailStore: ProcessedEmailStoreUndoPort,
  gmail: GmailUndoPort,
  notifier: NotificationStatusPort,
): {
  execute(token: string): Promise<UndoServiceResult>
} {
  const debug = Debug("app:action:createUndoService")
  debug("Creating undo service")

  return {
    async execute(token: string): Promise<UndoServiceResult> {
      const serviceDebug = Debug("app:action:executeUndoService")
      const payload = verifyUndoToken(token, config.undoTokenSecret)
      serviceDebug(
        "Undo token accepted: gmailMessageId=%s",
        payload.gmailMessageId,
      )

      const undoTarget = await processedEmailStore.findUndoTarget(
        payload.gmailMessageId,
      )

      if (!undoTarget) {
        serviceDebug(
          "Undo target missing: gmailMessageId=%s",
          payload.gmailMessageId,
        )
        return { outcome: "not_found" }
      }

      if (!undoTarget.userAction) {
        const undoResult = await gmail.applyUndoAction(
          undoTarget.gmailMessageId,
          undoTarget.appliedAction,
        )

        await processedEmailStore.markUserAction(
          undoTarget.gmailMessageId,
          undoResult.userAction,
        )

        serviceDebug(
          "Undo applied: gmailMessageId=%s, userAction=%s",
          payload.gmailMessageId,
          undoResult.userAction,
        )

        const appliedActionAfterUndo: GmailAppliedAction =
          undoTarget.appliedAction === "delete" ? "keep" : "delete"

        try {
          await notifier.updateNotificationStatus({
            gmailMessageId: undoTarget.gmailMessageId,
            appliedAction: appliedActionAfterUndo,
          })
        } catch (error: unknown) {
          const notificationMessage =
            error instanceof Error ? error.message : String(error)
          serviceDebug(
            "Undo notification status update failed: gmailMessageId=%s, error=%s",
            undoTarget.gmailMessageId,
            notificationMessage,
          )
        }

        return { outcome: "applied" }
      }

      const deleteIt = undoTarget.appliedAction === "delete"
      const reapplyDecision = {
        deleteIt,
        summary: "", // Not used for reapply
        subject: "", // Not used for reapply
        reason: "undo_reapply",
      }
      const reapplyResult = await gmail.applyAction(
        undoTarget.gmailMessageId,
        reapplyDecision,
      )

      await processedEmailStore.markUserAction(undoTarget.gmailMessageId, null)

      serviceDebug(
        "Undo reverted to original action: gmailMessageId=%s, appliedAction=%s",
        undoTarget.gmailMessageId,
        reapplyResult.appliedAction,
      )

      try {
        await notifier.updateNotificationStatus({
          gmailMessageId: undoTarget.gmailMessageId,
          appliedAction: undoTarget.appliedAction,
        })
      } catch (error: unknown) {
        const notificationMessage =
          error instanceof Error ? error.message : String(error)
        serviceDebug(
          "Undo notification status update failed: gmailMessageId=%s, error=%s",
          undoTarget.gmailMessageId,
          notificationMessage,
        )
      }

      return { outcome: "reverted" }
    },
  }
}
