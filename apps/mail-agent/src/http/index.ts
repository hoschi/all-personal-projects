import { createHmac, timingSafeEqual } from "node:crypto"

import Debug from "debug"

import type { BootstrapConfig } from "../config"
import type { UserAction } from "../data"
import type { GmailAppliedAction } from "../gmail"

const UNDO_PATH = "/mail-agent/undo" as const
const UNDO_TOKEN_VERSION = 1 as const

type UndoTokenPayload = {
  v: typeof UNDO_TOKEN_VERSION
  gmailMessageId: string
}

export type HttpRuntimeState = {
  enabled: true
  undoUrlBase: string
}

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

function toBase64Url(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url")
}

function fromBase64Url(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8")
}

function createSignature(payloadBase64Url: string, secret: string): string {
  return createHmac("sha256", secret)
    .update(payloadBase64Url)
    .digest("base64url")
}

function createUndoToken(
  gmailMessageId: string,
  undoTokenSecret: string,
): string {
  const payload: UndoTokenPayload = {
    v: UNDO_TOKEN_VERSION,
    gmailMessageId,
  }

  const payloadBase64Url = toBase64Url(JSON.stringify(payload))
  const signature = createSignature(payloadBase64Url, undoTokenSecret)

  return `${payloadBase64Url}.${signature}`
}

function verifyUndoToken(
  token: string,
  undoTokenSecret: string,
): UndoTokenPayload {
  const [payloadBase64Url, signature] = token.split(".")

  if (!payloadBase64Url || !signature) {
    throw new Error("Undo token has invalid format.")
  }

  const expectedSignature = createSignature(payloadBase64Url, undoTokenSecret)

  const receivedBuffer = Buffer.from(signature, "utf8")
  const expectedBuffer = Buffer.from(expectedSignature, "utf8")

  if (
    receivedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(receivedBuffer, expectedBuffer)
  ) {
    throw new Error("Undo token signature is invalid.")
  }

  const payloadUnknown: unknown = JSON.parse(fromBase64Url(payloadBase64Url))

  if (typeof payloadUnknown !== "object" || payloadUnknown === null) {
    throw new Error("Undo token payload is invalid.")
  }

  const payload = payloadUnknown as {
    v?: unknown
    gmailMessageId?: unknown
  }

  if (
    payload.v !== UNDO_TOKEN_VERSION ||
    typeof payload.gmailMessageId !== "string" ||
    payload.gmailMessageId.length === 0
  ) {
    throw new Error("Undo token payload schema mismatch.")
  }

  return {
    v: UNDO_TOKEN_VERSION,
    gmailMessageId: payload.gmailMessageId,
  }
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
  const baseUrl = new URL(config.publicBaseUrl)
  const undoUrlBase = new URL(UNDO_PATH, config.publicBaseUrl).toString()

  const server = Bun.serve({
    hostname: baseUrl.hostname,
    port:
      baseUrl.port.length > 0
        ? Number(baseUrl.port)
        : baseUrl.protocol === "https:"
          ? 443
          : 80,
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
        const payload = verifyUndoToken(token, config.undoTokenSecret)
        requestDebug(
          "Undo token accepted: gmailMessageId=%s",
          payload.gmailMessageId,
        )

        const undoTarget = await processedEmailStore.findUndoTarget(
          payload.gmailMessageId,
        )

        if (!undoTarget) {
          requestDebug(
            "Undo target missing: gmailMessageId=%s",
            payload.gmailMessageId,
          )
          return new Response("Undo target not found.", { status: 404 })
        }

        if (!undoTarget.userAction) {
          const undoResult = await gmail.applyUndoAction(
            undoTarget.gmailMessageId,
            undoTarget.appliedAction,
          )

          await processedEmailStore.markUserAction(
            undoTarget.gmailMessageId,
            undoResult.userAction,
          )

          requestDebug(
            "Undo applied: gmailMessageId=%s, userAction=%s",
            payload.gmailMessageId,
            undoResult.userAction,
          )

          const appliedActionAfterUndo: GmailAppliedAction =
            undoTarget.appliedAction === "delete" ? "keep" : "delete"

          try {
            await notifier.updateNotificationStatus({
              gmailMessageId: undoTarget.gmailMessageId,
              appliedAction: appliedActionAfterUndo,
            })
          } catch (error: unknown) {
            const notificationMessage =
              error instanceof Error ? error.message : String(error)
            requestDebug(
              "Undo notification status update failed: gmailMessageId=%s, error=%s",
              undoTarget.gmailMessageId,
              notificationMessage,
            )
          }

          return new Response("Undo applied.", { status: 200 })
        }

        const deleteIt = undoTarget.appliedAction === "delete"
        const reapplyResult = await gmail.applyAction(
          undoTarget.gmailMessageId,
          deleteIt,
        )

        await processedEmailStore.markUserAction(
          undoTarget.gmailMessageId,
          null,
        )

        requestDebug(
          "Undo reverted to original action: gmailMessageId=%s, appliedAction=%s",
          undoTarget.gmailMessageId,
          reapplyResult.appliedAction,
        )

        try {
          await notifier.updateNotificationStatus({
            gmailMessageId: undoTarget.gmailMessageId,
            appliedAction: undoTarget.appliedAction,
          })
        } catch (error: unknown) {
          const notificationMessage =
            error instanceof Error ? error.message : String(error)
          requestDebug(
            "Undo notification status update failed: gmailMessageId=%s, error=%s",
            undoTarget.gmailMessageId,
            notificationMessage,
          )
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
    "HTTP runtime started: url=%s, hostname=%s, port=%d",
    server.url.toString(),
    baseUrl.hostname,
    server.port,
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
        undoUrlBase,
      )

      return undoUrl.toString()
    },
  }
}
