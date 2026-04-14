export type ProcessedEmailRecord = {
  gmailMessageId: string
  gmailThreadId: string
  classifierReason: string
  processedAtIso: string
}

export function createInMemoryStore() {
  const processedEmails: ProcessedEmailRecord[] = []

  return {
    insert(record: ProcessedEmailRecord) {
      processedEmails.push(record)
    },
    list() {
      return processedEmails
    },
  }
}
