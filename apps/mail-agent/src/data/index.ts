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
  return {
    async hasProcessedMessage(gmailMessageId: string): Promise<boolean> {
      const existing = await prisma.processedEmail.findUnique({
        where: { gmailMessageId },
        select: { id: true },
      })

      return existing !== null
    },

    async insert(input: ProcessedEmailInsertInput): Promise<void> {
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
    },
  }
}
