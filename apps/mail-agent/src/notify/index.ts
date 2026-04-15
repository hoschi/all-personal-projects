import Debug from "debug"
import { z } from "zod"

import type { BootstrapConfig } from "../config"

export type NotificationInput = {
  subject: string
  summary: string
  undoUrl: string
}

export type NotificationResult = {
  providerMessageId: string
}

export interface Notifier {
  sendNotification(input: NotificationInput): Promise<NotificationResult>
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
  const subject = escapeMarkdownV2(input.subject)
  const summary = escapeMarkdownV2(input.summary)
  const undoUrl = escapeMarkdownV2(input.undoUrl)

  return `*Mail Agent Decision*\n*Subject:* ${subject}\n*Summary:* ${summary}\n*Undo:* ${undoUrl}`
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

export function createNoopNotifier(): Notifier {
  return {
    async sendNotification() {
      return {
        providerMessageId: "noop-provider-message-id",
      }
    },
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

      for (const chunk of chunks) {
        providerMessageId = await sendTelegramMessage(config, chunk)
      }

      return {
        providerMessageId,
      }
    },
  }
}
