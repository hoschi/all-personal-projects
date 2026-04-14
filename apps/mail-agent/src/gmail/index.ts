export type NormalizedGmailMessage = {
  gmailMessageId: string
  gmailThreadId: string
  sender: string
  subject: string
  bodyText: string
  labels: string[]
}

export function createGmailSyncPlaceholder() {
  return {
    async poll(): Promise<NormalizedGmailMessage[]> {
      return []
    },
  }
}
