export type NotificationInput = {
  subject: string
  summary: string
  undoUrl: string
}

export type NotificationResult = {
  providerMessageId: string
}

export interface Notifier {
  sendNotification(input: NotificationInput): Promise<NotificationResult>
}

export function createNoopNotifier(): Notifier {
  return {
    async sendNotification() {
      return {
        providerMessageId: "noop-provider-message-id",
      }
    },
  }
}
