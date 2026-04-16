import Debug from "debug"
import { z } from "zod"

import type { BootstrapConfig } from "../config"
import type { StoredNotificationMapping } from "../data"
import type { GmailAppliedAction } from "../gmail"

export type NotificationInput = {
  gmailMessageId: string
  appliedAction: GmailAppliedAction
  subject: string
  summary: string
  undoUrl: string
}

export type NotificationStatusUpdateInput = {
  gmailMessageId: string
  appliedAction: GmailAppliedAction
}

export type NotificationResult = {
  providerMessageId: string
}

export interface Notifier {
  sendNotification(input: NotificationInput): Promise<NotificationResult>
  updateNotificationStatus(input: NotificationStatusUpdateInput): Promise<void>
}

export type NotificationMappingStorePort = {
  storeNotificationMapping(input: {
    gmailMessageId: string
    provider: string
    providerMessageId: string
    subject: string
    summary: string
    undoUrl: string
  }): Promise<void>
  findNotificationMapping(
    gmailMessageId: string,
  ): Promise<StoredNotificationMapping | null>
}

const TELEGRAM_ENTITY_SCHEMA = z.object({
  type: z.string(),
  offset: z.number().int(),
  length: z.number().int(),
  url: z.string().optional(),
})

const TELEGRAM_MESSAGE_SCHEMA = z.object({
  message_id: z.number().int(),
  text: z.string().optional(),
  entities: z.array(TELEGRAM_ENTITY_SCHEMA).optional(),
})

const TELEGRAM_RESPONSE_SCHEMA = z.object({
  ok: z.boolean(),
  result: TELEGRAM_MESSAGE_SCHEMA.optional(),
  description: z.string().optional(),
  parameters: z
    .object({
      retry_after: z.number().int().positive().optional(),
    })
    .optional(),
})

const TELEGRAM_EDIT_RESPONSE_SCHEMA = z.object({
  ok: z.boolean(),
  description: z.string().optional(),
  parameters: z
    .object({
      retry_after: z.number().int().positive().optional(),
    })
    .optional(),
  result: z.unknown().optional(),
})

const TELEGRAM_MAX_MESSAGE_LENGTH = 4096 as const
const TELEGRAM_MAX_ATTEMPTS = 3 as const
const TELEGRAM_NOTIFICATION_PROVIDER = "telegram" as const
const TELEGRAM_SUMMARY_MAX_LENGTH = 800 as const
const MARKDOWN_V2_SPECIAL_CHARACTERS = new Set([
  "_",
  "*",
  "[",
  "]",
  "(",
  ")",
  "~",
  "`",
  ">",
  "#",
  "+",
  "-",
  "=",
  "|",
  "{",
  "}",
  ".",
  "!",
  "\\",
])

function escapeMarkdownV2(value: string): string {
  let escapedValue = ""

  for (const character of value) {
    escapedValue += MARKDOWN_V2_SPECIAL_CHARACTERS.has(character)
      ? `\\${character}`
      : character
  }

  return escapedValue
}

function escapeMarkdownV2LinkUrl(value: string): string {
  return value.replaceAll("\\", "\\\\").replaceAll(")", "\\)")
}

function escapeMarkdown(value: string): string {
  return value
    .replaceAll("\\", "\\\\")
    .replaceAll("`", "\\`")
    .replaceAll("*", "\\*")
    .replaceAll("_", "\\_")
    .replaceAll("[", "\\[")
    .replaceAll("]", "\\]")
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
}

function escapeHtmlAttribute(value: string): string {
  return escapeHtml(value).replaceAll('"', "&quot;")
}

function sanitizeSubjectForNotification(value: string): string {
  const normalizedSubject = value.replace(/\s+/g, " ").trim()

  return normalizedSubject.length > 0 ? normalizedSubject : "Ohne Betreff"
}

function sanitizeSummaryForNotification(value: string): string {
  const normalizedSummary = value
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()

  if (normalizedSummary.length === 0) {
    return "Keine Zusammenfassung verfügbar."
  }

  if (normalizedSummary.length > TELEGRAM_SUMMARY_MAX_LENGTH) {
    return `${normalizedSummary.slice(0, TELEGRAM_SUMMARY_MAX_LENGTH)}…`
  }

  return normalizedSummary
}

function normalizeNotificationInput(
  input: NotificationInput,
): NotificationInput {
  return {
    ...input,
    subject: sanitizeSubjectForNotification(input.subject),
    summary: sanitizeSummaryForNotification(input.summary),
  }
}

function formatTelegramMessage(
  input: NotificationInput,
  parseMode: BootstrapConfig["telegram"]["parseMode"],
): string {
  const statusLabel = input.appliedAction === "delete" ? "❌" : "☑️"

  if (parseMode === "HTML") {
    const escapedStatusLabel = escapeHtml(statusLabel)
    const subject = escapeHtml(input.subject)
    const summary = escapeHtml(input.summary)
    const undoUrl = escapeHtmlAttribute(input.undoUrl)

    return `${escapedStatusLabel} ${subject}\n${summary}\n<a href="${undoUrl}">UNDO</a>`
  }

  if (parseMode === "Markdown") {
    const escapedStatusLabel = escapeMarkdown(statusLabel)
    const subject = escapeMarkdown(input.subject)
    const summary = escapeMarkdown(input.summary)
    const undoUrl = escapeMarkdownV2LinkUrl(input.undoUrl)

    return `${escapedStatusLabel} ${subject}\n${summary}\n[UNDO](${undoUrl})`
  }

  const subject = escapeMarkdownV2(input.subject)
  const summary = escapeMarkdownV2(input.summary)
  const escapedStatusLabel = escapeMarkdownV2(statusLabel)
  const undoUrl = escapeMarkdownV2LinkUrl(input.undoUrl)

  return `${escapedStatusLabel} ${subject}\n${summary}\n[UNDO](${undoUrl})`
}

export const TEST_ONLY = {
  formatTelegramMessage,
} as const

function chunkText(value: string, chunkSize: number): string[] {
  if (value.length <= chunkSize) {
    return [value]
  }

  const chunks: string[] = []

  let startIndex = 0

  while (startIndex < value.length) {
    let endIndex = Math.min(startIndex + chunkSize, value.length)

    if (endIndex < value.length && value.at(endIndex - 1) === "\\") {
      endIndex -= 1
    }

    if (endIndex <= startIndex) {
      endIndex = Math.min(startIndex + chunkSize, value.length)
    }

    chunks.push(value.slice(startIndex, endIndex))
    startIndex = endIndex
  }

  return chunks
}

async function sendTelegramMessage(
  config: BootstrapConfig,
  messageText: string,
): Promise<string> {
  const debug = Debug("app:action:sendTelegramMessage")

  const endpoint = `https://api.telegram.org/bot${config.telegram.botToken}/sendMessage`
  let attempt = 1

  while (attempt <= TELEGRAM_MAX_ATTEMPTS) {
    debug(
      "Sending Telegram message: attempt=%d, parseMode=%s, textLength=%d, text=%s",
      attempt,
      config.telegram.parseMode,
      messageText.length,
      messageText,
    )

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: config.telegram.chatId,
        text: messageText,
        parse_mode: config.telegram.parseMode,
        disable_web_page_preview: true,
      }),
    })

    const responseBodyUnknown: unknown = await response.json()
    const responseBody = TELEGRAM_RESPONSE_SCHEMA.parse(responseBodyUnknown)

    debug(
      "Telegram sendMessage response: status=%d, ok=%s, body=%O",
      response.status,
      response.ok,
      responseBodyUnknown,
    )

    if (response.ok && responseBody.ok && responseBody.result) {
      const providerMessageId = String(responseBody.result.message_id)
      debug(
        "Telegram message sent: providerMessageId=%s, renderedText=%s, renderedEntities=%O",
        providerMessageId,
        responseBody.result.text ?? "",
        responseBody.result.entities ?? [],
      )
      return providerMessageId
    }

    const retryAfterSeconds = responseBody.parameters?.retry_after

    if (
      response.status === 429 &&
      retryAfterSeconds &&
      attempt < TELEGRAM_MAX_ATTEMPTS
    ) {
      debug(
        "Telegram rate limited: attempt=%d, retryAfterSeconds=%d",
        attempt,
        retryAfterSeconds,
      )
      await Bun.sleep(retryAfterSeconds * 1000)
      attempt += 1
      continue
    }

    const description = responseBody.description ?? "unknown Telegram API error"
    throw new Error(`Telegram sendMessage failed: ${description}`)
  }

  throw new Error("Telegram sendMessage failed after retries.")
}

async function editTelegramMessage(
  config: BootstrapConfig,
  providerMessageId: string,
  messageText: string,
): Promise<void> {
  const debug = Debug("app:action:editTelegramMessage")
  const endpoint = `https://api.telegram.org/bot${config.telegram.botToken}/editMessageText`
  let attempt = 1

  const telegramMessageId = Number(providerMessageId)

  if (!Number.isInteger(telegramMessageId) || telegramMessageId <= 0) {
    throw new Error(
      `Telegram editMessageText requires numeric message id, received "${providerMessageId}".`,
    )
  }

  while (attempt <= TELEGRAM_MAX_ATTEMPTS) {
    debug(
      "Editing Telegram message: providerMessageId=%s, attempt=%d, parseMode=%s, textLength=%d, text=%s",
      providerMessageId,
      attempt,
      config.telegram.parseMode,
      messageText.length,
      messageText,
    )

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: config.telegram.chatId,
        message_id: telegramMessageId,
        text: messageText,
        parse_mode: config.telegram.parseMode,
        disable_web_page_preview: true,
      }),
    })

    const responseBodyUnknown: unknown = await response.json()
    const responseBody =
      TELEGRAM_EDIT_RESPONSE_SCHEMA.parse(responseBodyUnknown)

    debug(
      "Telegram editMessageText response: status=%d, ok=%s, body=%O",
      response.status,
      response.ok,
      responseBodyUnknown,
    )

    if (response.ok && responseBody.ok) {
      debug("Telegram message edited: providerMessageId=%s", providerMessageId)
      return
    }

    const retryAfterSeconds = responseBody.parameters?.retry_after

    if (
      response.status === 429 &&
      retryAfterSeconds &&
      attempt < TELEGRAM_MAX_ATTEMPTS
    ) {
      debug(
        "Telegram edit rate limited: providerMessageId=%s, attempt=%d, retryAfterSeconds=%d",
        providerMessageId,
        attempt,
        retryAfterSeconds,
      )
      await Bun.sleep(retryAfterSeconds * 1000)
      attempt += 1
      continue
    }

    const description = responseBody.description ?? "unknown Telegram API error"
    throw new Error(`Telegram editMessageText failed: ${description}`)
  }

  throw new Error("Telegram editMessageText failed after retries.")
}

export function createNotifier(
  config: BootstrapConfig,
  notificationMappingStore: NotificationMappingStorePort,
): Notifier {
  const debug = Debug("app:action:createNotifier")

  debug(
    "Using telegram notifier: chatIdConfigured=%s, parseMode=%s",
    true,
    config.telegram.parseMode,
  )

  const sentNotificationsByGmailMessageId = new Map<
    string,
    {
      providerMessageId: string
      subject: string
      summary: string
      undoUrl: string
    }
  >()

  return {
    async sendNotification(
      input: NotificationInput,
    ): Promise<NotificationResult> {
      const debug = Debug("app:action:sendNotification")
      const normalizedInput = normalizeNotificationInput(input)
      const formattedMessage = formatTelegramMessage(
        normalizedInput,
        config.telegram.parseMode,
      )
      const chunks = chunkText(formattedMessage, TELEGRAM_MAX_MESSAGE_LENGTH)

      debug(
        "Sending notification: gmailMessageId=%s, parseMode=%s, chunkCount=%d, firstChunkLength=%d, formattedMessage=%s",
        input.gmailMessageId,
        config.telegram.parseMode,
        chunks.length,
        chunks.at(0)?.length ?? 0,
        formattedMessage,
      )

      let providerMessageId = ""
      let firstProviderMessageId = ""

      for (const [chunkIndex, chunk] of chunks.entries()) {
        debug(
          "Sending chunk: gmailMessageId=%s, parseMode=%s, chunkIndex=%d/%d, chunkLength=%d, chunkText=%s",
          input.gmailMessageId,
          config.telegram.parseMode,
          chunkIndex + 1,
          chunks.length,
          chunk.length,
          chunk,
        )

        providerMessageId = await sendTelegramMessage(config, chunk)

        if (!firstProviderMessageId) {
          firstProviderMessageId = providerMessageId
        }
      }

      sentNotificationsByGmailMessageId.set(input.gmailMessageId, {
        providerMessageId: firstProviderMessageId,
        subject: normalizedInput.subject,
        summary: normalizedInput.summary,
        undoUrl: normalizedInput.undoUrl,
      })

      await notificationMappingStore.storeNotificationMapping({
        gmailMessageId: input.gmailMessageId,
        provider: TELEGRAM_NOTIFICATION_PROVIDER,
        providerMessageId: firstProviderMessageId,
        subject: normalizedInput.subject,
        summary: normalizedInput.summary,
        undoUrl: normalizedInput.undoUrl,
      })

      debug(
        "Stored telegram notification mapping: gmailMessageId=%s, provider=%s, providerMessageId=%s",
        input.gmailMessageId,
        TELEGRAM_NOTIFICATION_PROVIDER,
        firstProviderMessageId,
      )

      return {
        providerMessageId: firstProviderMessageId,
      }
    },
    async updateNotificationStatus(
      input: NotificationStatusUpdateInput,
    ): Promise<void> {
      const debug = Debug("app:action:updateNotificationStatus")
      let sentNotification = sentNotificationsByGmailMessageId.get(
        input.gmailMessageId,
      )

      if (!sentNotification) {
        const persistedNotification =
          await notificationMappingStore.findNotificationMapping(
            input.gmailMessageId,
          )

        if (!persistedNotification) {
          debug(
            "Skipping status update: no persisted telegram mapping for gmailMessageId=%s",
            input.gmailMessageId,
          )
          return
        }

        if (persistedNotification.provider !== TELEGRAM_NOTIFICATION_PROVIDER) {
          debug(
            "Skipping status update: unsupported provider=%s for gmailMessageId=%s",
            persistedNotification.provider,
            input.gmailMessageId,
          )
          return
        }

        sentNotification = {
          providerMessageId: persistedNotification.providerMessageId,
          subject: persistedNotification.subject,
          summary: persistedNotification.summary,
          undoUrl: persistedNotification.undoUrl,
        }

        sentNotificationsByGmailMessageId.set(
          input.gmailMessageId,
          sentNotification,
        )

        debug(
          "Loaded telegram mapping from persistence: gmailMessageId=%s, providerMessageId=%s",
          input.gmailMessageId,
          persistedNotification.providerMessageId,
        )
      }

      if (!sentNotification) {
        debug(
          "Skipping status update: no telegram mapping for gmailMessageId=%s",
          input.gmailMessageId,
        )
        return
      }

      const updatedMessage = formatTelegramMessage(
        {
          gmailMessageId: input.gmailMessageId,
          appliedAction: input.appliedAction,
          subject: sentNotification.subject,
          summary: sentNotification.summary,
          undoUrl: sentNotification.undoUrl,
        },
        config.telegram.parseMode,
      )
      const updatedFirstChunk = chunkText(
        updatedMessage,
        TELEGRAM_MAX_MESSAGE_LENGTH,
      ).at(0)

      debug(
        "Updating notification status message: gmailMessageId=%s, parseMode=%s, updatedMessage=%s",
        input.gmailMessageId,
        config.telegram.parseMode,
        updatedMessage,
      )

      if (!updatedFirstChunk) {
        throw new Error("Updated Telegram message text is empty.")
      }

      await editTelegramMessage(
        config,
        sentNotification.providerMessageId,
        updatedFirstChunk,
      )

      debug(
        "Updated telegram status emoji: gmailMessageId=%s, providerMessageId=%s, appliedAction=%s",
        input.gmailMessageId,
        sentNotification.providerMessageId,
        input.appliedAction,
      )
    },
  }
}
