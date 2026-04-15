import Debug from "debug"
import { z } from "zod"

import type { BootstrapConfig } from "../config"
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

const TELEGRAM_RESPONSE_SCHEMA = z.object({
  ok: z.boolean(),
  result: z
    .object({
      message_id: z.number().int(),
    })
    .optional(),
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
const MARKDOWN_V2_SPECIAL_CHARACTERS = [
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
] as const

function escapeMarkdownV2(value: string): string {
  let escaped = value

  for (const specialCharacter of MARKDOWN_V2_SPECIAL_CHARACTERS) {
    escaped = escaped.replaceAll(specialCharacter, `\\${specialCharacter}`)
  }

  return escaped
}

function formatTelegramMessage(input: NotificationInput): string {
  const status = input.appliedAction === "delete" ? "deleted" : "keep"
  const statusEmoji = input.appliedAction === "delete" ? "🗑️" : "✅"
  const escapedStatus = escapeMarkdownV2(status)
  const subject = escapeMarkdownV2(input.subject)
  const summary = escapeMarkdownV2(input.summary)
  const undoUrl = escapeMarkdownV2(input.undoUrl)

  return `*Mail Agent Decision*\n*Status:* ${statusEmoji} ${escapedStatus}\n*Subject:* ${subject}\n*Summary:* ${summary}\n*Undo:* ${undoUrl}`
}

function chunkText(value: string, chunkSize: number): string[] {
  if (value.length <= chunkSize) {
    return [value]
  }

  const chunks: string[] = []

  for (let index = 0; index < value.length; index += chunkSize) {
    chunks.push(value.slice(index, index + chunkSize))
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
      "Sending Telegram message: attempt=%d, textLength=%d",
      attempt,
      messageText.length,
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

    if (response.ok && responseBody.ok && responseBody.result) {
      const providerMessageId = String(responseBody.result.message_id)
      debug("Telegram message sent: providerMessageId=%s", providerMessageId)
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
      "Editing Telegram message: providerMessageId=%s, attempt=%d, textLength=%d",
      providerMessageId,
      attempt,
      messageText.length,
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

export function createNoopNotifier(): Notifier {
  return {
    async sendNotification() {
      return {
        providerMessageId: "noop-provider-message-id",
      }
    },
    async updateNotificationStatus() {},
  }
}

export function createNotifier(config: BootstrapConfig): Notifier {
  const debug = Debug("app:action:createNotifier")

  if (!config.telegram.botToken || !config.telegram.chatId) {
    debug("Using noop notifier: missing telegram runtime credentials")
    return createNoopNotifier()
  }

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
      const formattedMessage = formatTelegramMessage(input)
      const chunks = chunkText(formattedMessage, TELEGRAM_MAX_MESSAGE_LENGTH)

      debug(
        "Sending notification: chunkCount=%d, firstChunkLength=%d",
        chunks.length,
        chunks.at(0)?.length ?? 0,
      )

      let providerMessageId = ""
      let firstProviderMessageId = ""

      for (const chunk of chunks) {
        providerMessageId = await sendTelegramMessage(config, chunk)

        if (!firstProviderMessageId) {
          firstProviderMessageId = providerMessageId
        }
      }

      sentNotificationsByGmailMessageId.set(input.gmailMessageId, {
        providerMessageId: firstProviderMessageId,
        subject: input.subject,
        summary: input.summary,
        undoUrl: input.undoUrl,
      })

      debug(
        "Stored telegram notification mapping: gmailMessageId=%s, providerMessageId=%s",
        input.gmailMessageId,
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
      const sentNotification = sentNotificationsByGmailMessageId.get(
        input.gmailMessageId,
      )

      if (!sentNotification) {
        debug(
          "Skipping status update: no telegram mapping for gmailMessageId=%s",
          input.gmailMessageId,
        )
        return
      }

      const updatedMessage = formatTelegramMessage({
        gmailMessageId: input.gmailMessageId,
        appliedAction: input.appliedAction,
        subject: sentNotification.subject,
        summary: sentNotification.summary,
        undoUrl: sentNotification.undoUrl,
      })
      const updatedFirstChunk = chunkText(
        updatedMessage,
        TELEGRAM_MAX_MESSAGE_LENGTH,
      ).at(0)

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
