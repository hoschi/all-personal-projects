import Debug from "debug"

import type { BootstrapConfig } from "../config"
import type {
  GmailUndoPort,
  NotificationStatusPort,
  ProcessedEmailStoreUndoPort,
} from "./contracts"
import { createUndoService } from "./undo-service"
import { createUndoToken } from "./undo-token"

export type {
  GmailUndoPort,
  NotificationStatusPort,
  ProcessedEmailStoreUndoPort,
} from "./contracts"

const UNDO_PATH = "/mail-agent/undo" as const

export type HttpRuntimeState = {
  enabled: true
  undoUrlBase: string
}

export function createHttpRuntime(
  config: BootstrapConfig,
  processedEmailStore: ProcessedEmailStoreUndoPort,
  gmail: GmailUndoPort,
  notifier: NotificationStatusPort,
): {
  state: HttpRuntimeState
  createUndoUrl(gmailMessageId: string): string
} {
  const debug = Debug("app:action:createHttpRuntime")
  const undoUrlBase = new URL(UNDO_PATH, config.publicBaseUrl).toString()
  const undoService = createUndoService(
    config,
    processedEmailStore,
    gmail,
    notifier,
  )

  const server = Bun.serve({
    hostname: config.http.host,
    port: config.http.port,
    async fetch(request) {
      const requestUrl = new URL(request.url)

      if (requestUrl.pathname !== UNDO_PATH) {
        return new Response("Not Found", { status: 404 })
      }

      const requestDebug = Debug("app:action:handleUndoRequest")
      const token = requestUrl.searchParams.get("token")

      if (!token) {
        requestDebug("Undo request missing token")
        return new Response("Missing undo token.", { status: 400 })
      }

      try {
        const result = await undoService.execute(token)

        if (result.outcome === "not_found") {
          return new Response("Undo target not found.", { status: 404 })
        }

        if (result.outcome === "applied") {
          return new Response("Undo applied.", { status: 200 })
        }

        return new Response("Undo reverted to original action.", {
          status: 200,
        })
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error)
        requestDebug("Undo request failed: error=%s", message)
        return new Response(`Undo failed: ${message}`, { status: 400 })
      }
    },
  })

  debug(
    "HTTP runtime started: url=%s, hostname=%s, port=%d, publicBaseUrl=%s",
    server.url.toString(),
    config.http.host,
    server.port,
    config.publicBaseUrl,
  )

  return {
    state: {
      enabled: true,
      undoUrlBase,
    },
    createUndoUrl(gmailMessageId: string): string {
      const token = createUndoToken(gmailMessageId, config.undoTokenSecret)

      const undoUrl = new URL(UNDO_PATH, config.publicBaseUrl)
      undoUrl.searchParams.set("token", token)

      const tokenDebug = Debug("app:action:createUndoUrl")
      tokenDebug(
        "Undo URL created: gmailMessageId=%s, undoUrlBase=%s",
        gmailMessageId,
        undoUrl,
      )

      return undoUrl.toString()
    },
  }
}
