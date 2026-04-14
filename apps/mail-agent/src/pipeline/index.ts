const PIPELINE_STAGES = [
  "loadCursor",
  "fetchChanges",
  "normalizeMessages",
  "classify",
  "applyAction",
  "notifyUser",
] as const

export type PipelineStage = (typeof PIPELINE_STAGES)[number]

export type PipelineStageDescriptor = {
  name: PipelineStage
  description: string
}

const PIPELINE_STAGE_DESCRIPTIONS: Record<PipelineStage, string> = {
  loadCursor: "Load last Gmail history cursor from state.",
  fetchChanges: "Fetch incremental Gmail history changes.",
  normalizeMessages: "Build normalized mail payloads for processing.",
  classify: "Run private-check and AI decision pipeline.",
  applyAction: "Apply keep/delete label mutations idempotently.",
  notifyUser: "Send one user notification with one undo URL.",
}

export function createPipelineStageDescriptors(): PipelineStageDescriptor[] {
  return PIPELINE_STAGES.map((name) => ({
    name,
    description: PIPELINE_STAGE_DESCRIPTIONS[name],
  }))
}
