import Debug from "debug"

import { prisma } from "./prisma"

export type AppliedAction = "keep" | "delete"

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
  }
}
