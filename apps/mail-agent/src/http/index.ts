export type HttpRuntimeState = {
  enabled: false
  reason: string
}

export function createHttpRuntimePlaceholder(): HttpRuntimeState {
  return {
    enabled: false,
    reason: "HTTP runtime will be introduced in later implementation steps.",
  }
}
