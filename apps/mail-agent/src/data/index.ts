import Debug from "debug"

import { prisma } from "./prisma"

export type AppliedAction = "keep" | "delete"
export type UserAction = "undo_keep" | "undo_delete"

export type ProcessedEmailInsertInput = {
  gmailMessageId: string
  gmailThreadId: string
  deleteIt: boolean
  summary: string
  subject: string
  reason: string
  appliedAction: AppliedAction
  classifierOutput: {
    deleteIt: boolean
    summary: string
    subject: string
    reason: string
  }
}

export type ProcessedEmailUndoTarget = {
  gmailMessageId: string
  appliedAction: AppliedAction
  userAction: string | null
}

export function createProcessedEmailStore() {
  const debug = Debug("app:db:createProcessedEmailStore")
  debug("Creating processed email store adapter")

  return {
    async hasProcessedMessage(gmailMessageId: string): Promise<boolean> {
      const debug = Debug("app:db:hasProcessedMessage")
      debug(
        "Checking processed email existence: gmailMessageId=%s",
        gmailMessageId,
      )

      const existing = await prisma.processedEmail.findUnique({
        where: { gmailMessageId },
        select: { id: true },
      })

      debug(
        "Processed email existence result: gmailMessageId=%s, exists=%s",
        gmailMessageId,
        existing !== null,
      )

      return existing !== null
    },

    async insert(input: ProcessedEmailInsertInput): Promise<void> {
      const debug = Debug("app:db:insertProcessedEmail")
      debug(
        "Persisting processed email: gmailMessageId=%s, gmailThreadId=%s, deleteIt=%s, appliedAction=%s",
        input.gmailMessageId,
        input.gmailThreadId,
        input.deleteIt,
        input.appliedAction,
      )

      await prisma.processedEmail.create({
        data: {
          gmailMessageId: input.gmailMessageId,
          gmailThreadId: input.gmailThreadId,
          deleteIt: input.deleteIt,
          summary: input.summary,
          subject: input.subject,
          reason: input.reason,
          appliedAction: input.appliedAction,
          classifierOutput: input.classifierOutput,
        },
      })

      debug(
        "Persisted processed email: gmailMessageId=%s",
        input.gmailMessageId,
      )
    },

    async findUndoTarget(
      gmailMessageId: string,
    ): Promise<ProcessedEmailUndoTarget | null> {
      const debug = Debug("app:db:findUndoTarget")
      debug("Loading undo target: gmailMessageId=%s", gmailMessageId)

      const processedEmail = await prisma.processedEmail.findUnique({
        where: { gmailMessageId },
        select: {
          gmailMessageId: true,
          appliedAction: true,
          userAction: true,
        },
      })

      if (!processedEmail) {
        debug("Undo target not found: gmailMessageId=%s", gmailMessageId)
        return null
      }

      const appliedAction =
        processedEmail.appliedAction === "delete" ? "delete" : "keep"

      debug(
        "Undo target loaded: gmailMessageId=%s, appliedAction=%s, hasUserAction=%s",
        gmailMessageId,
        appliedAction,
        !!processedEmail.userAction,
      )

      return {
        gmailMessageId: processedEmail.gmailMessageId,
        appliedAction,
        userAction: processedEmail.userAction,
      }
    },

    async markUserAction(
      gmailMessageId: string,
      userAction: UserAction,
    ): Promise<void> {
      const debug = Debug("app:db:markUserAction")
      debug(
        "Persisting user action override: gmailMessageId=%s, userAction=%s",
        gmailMessageId,
        userAction,
      )

      await prisma.processedEmail.update({
        where: { gmailMessageId },
        data: { userAction },
      })

      debug(
        "Persisted user action override: gmailMessageId=%s, userAction=%s",
        gmailMessageId,
        userAction,
      )
    },
  }
}
