export type ClassifierDecision = {
  deleteIt: boolean
  summary: string
  subject: string
  reason: string
}

export function createAiPipelinePlaceholder() {
  return {
    async classify(): Promise<ClassifierDecision> {
      return {
        deleteIt: false,
        summary: "Scaffold placeholder summary.",
        subject: "Scaffold placeholder subject",
        reason: "Classification is not implemented in step 1.",
      }
    },
  }
}
