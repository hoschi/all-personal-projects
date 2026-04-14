export const APP_NAME = "mail-agent" as const

export type BootstrapConfig = {
  appName: typeof APP_NAME
  pollIntervalMs: number
  startedAtIso: string
}

export function createBootstrapConfig(): BootstrapConfig {
  return {
    appName: APP_NAME,
    pollIntervalMs: 60_000,
    startedAtIso: new Date().toISOString(),
  }
}
