import type { UserAction } from "../data"
import type { GmailAppliedAction } from "../gmail"

export type ProcessedEmailStoreUndoPort = {
  findUndoTarget(gmailMessageId: string): Promise<{
    gmailMessageId: string
    appliedAction: GmailAppliedAction
    userAction: UserAction | null
  } | null>
  markUserAction(
    gmailMessageId: string,
    userAction: UserAction | null,
  ): Promise<void>
}

export type GmailUndoPort = {
  applyAction(
    gmailMessageId: string,
    deleteIt: boolean,
  ): Promise<{
    appliedAction: GmailAppliedAction
    addedLabelIds: string[]
    removedLabelIds: string[]
  }>
  applyUndoAction(
    gmailMessageId: string,
    previousAppliedAction: GmailAppliedAction,
  ): Promise<{
    userAction: UserAction
  }>
}

export type NotificationStatusPort = {
  updateNotificationStatus(input: {
    gmailMessageId: string
    appliedAction: GmailAppliedAction
  }): Promise<void>
}

export type UndoServiceResult =
  | { outcome: "applied" }
  | { outcome: "reverted" }
  | { outcome: "not_found" }
