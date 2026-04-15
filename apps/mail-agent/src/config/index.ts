import { config as dotenvConfig } from "dotenv"
import { z } from "zod"

export const APP_NAME = "mail-agent" as const

const TELEGRAM_PARSE_MODES = ["MarkdownV2", "Markdown", "HTML"] as const

const optionalRuntimeSecretSchema = z.string().trim().optional().default("")

dotenvConfig({ path: ".env.base", quiet: true })
dotenvConfig({ path: ".env", override: true, quiet: true })

const bootstrapEnvSchema = z.object({
  DATABASE_URL: z.string().trim().min(1),
  DATABASE_SCHEMA_NAME: z.literal("mail"),
  MAIL_AGENT_OPENAI_API_KEY: z.string().trim().min(1),
  MAIL_AGENT_OPENAI_MODEL: z.string().trim().min(1),
  MAIL_AGENT_PUBLIC_BASE_URL: z.string().trim().url(),
  MAIL_AGENT_GMAIL_CLIENT_ID: z.string().trim().min(1),
  MAIL_AGENT_GMAIL_CLIENT_SECRET: z.string().trim().min(1),
  MAIL_AGENT_GMAIL_REFRESH_TOKEN: z.string().trim().min(1),
  MAIL_AGENT_GMAIL_FILTER_QUERY: z.string().trim().min(1),
  MAIL_AGENT_POLL_INTERVAL_MS: z.coerce.number().int().positive(),
  MAIL_AGENT_LABEL_AI_LABEL_PREFIX: z.string().trim().min(1),
  MAIL_AGENT_LABEL_KEEP: z.string().trim().min(1),
  MAIL_AGENT_LABEL_DELETE: z.string().trim().min(1),
  MAIL_AGENT_LABEL_HIDDEN: z.string().trim().min(1),
  MAIL_AGENT_UNDO_TOKEN_SECRET: z.string().trim().min(1),
  MAIL_AGENT_TELEGRAM_BOT_TOKEN: optionalRuntimeSecretSchema,
  MAIL_AGENT_TELEGRAM_CHAT_ID: optionalRuntimeSecretSchema,
  MAIL_AGENT_TELEGRAM_ALLOWED_USER_IDS: z.string().trim().min(1).optional(),
  MAIL_AGENT_TELEGRAM_PARSE_MODE: z
    .enum(TELEGRAM_PARSE_MODES)
    .default("MarkdownV2"),
})

type BootstrapEnv = z.infer<typeof bootstrapEnvSchema>

export type BootstrapConfig = {
  appName: typeof APP_NAME
  startedAtIso: string
  pollIntervalMs: number
  databaseUrl: string
  databaseSchemaName: "mail"
  openAiApiKey: string
  openAiModel: string
  publicBaseUrl: string
  gmailClientId: string
  gmailClientSecret: string
  gmailRefreshToken: string
  gmailFilterQuery: string
  labels: {
    aiLabelPrefix: string
    keep: string
    delete: string
    hidden: string
  }
  undoTokenSecret: string
  telegram: {
    botToken: string
    chatId: string
    allowedUserIds: string[]
    parseMode: (typeof TELEGRAM_PARSE_MODES)[number]
  }
}

function readBootstrapEnv(): BootstrapEnv {
  const result = bootstrapEnvSchema.safeParse(process.env)

  if (result.success) {
    return result.data
  }

  const details = result.error.issues
    .map((issue) => {
      const envKey = issue.path.join(".")
      return `${envKey}: ${issue.message}`
    })
    .join("; ")

  throw new Error(`Invalid mail-agent environment configuration: ${details}`)
}

function parseAllowedUserIds(raw: string | undefined): string[] {
  if (!raw) {
    return []
  }

  return raw
    .split(",")
    .map((id) => id.trim())
    .filter((id) => id.length > 0)
}

function buildManagedLabelName(prefix: string, suffixOrLabel: string): string {
  const normalizedPrefix = prefix.trim().replace(/\/+$/g, "")
  const normalizedSuffixOrLabel = suffixOrLabel.trim().replace(/^\/+/g, "")

  if (
    normalizedSuffixOrLabel === normalizedPrefix ||
    normalizedSuffixOrLabel.startsWith(`${normalizedPrefix}/`)
  ) {
    return normalizedSuffixOrLabel
  }

  return `${normalizedPrefix}/${normalizedSuffixOrLabel}`
}

export function createBootstrapConfig(): BootstrapConfig {
  const env = readBootstrapEnv()

  return {
    appName: APP_NAME,
    startedAtIso: new Date().toISOString(),
    pollIntervalMs: env.MAIL_AGENT_POLL_INTERVAL_MS,
    databaseUrl: env.DATABASE_URL,
    databaseSchemaName: env.DATABASE_SCHEMA_NAME,
    openAiApiKey: env.MAIL_AGENT_OPENAI_API_KEY,
    openAiModel: env.MAIL_AGENT_OPENAI_MODEL,
    publicBaseUrl: env.MAIL_AGENT_PUBLIC_BASE_URL,
    gmailClientId: env.MAIL_AGENT_GMAIL_CLIENT_ID,
    gmailClientSecret: env.MAIL_AGENT_GMAIL_CLIENT_SECRET,
    gmailRefreshToken: env.MAIL_AGENT_GMAIL_REFRESH_TOKEN,
    gmailFilterQuery: env.MAIL_AGENT_GMAIL_FILTER_QUERY,
    labels: {
      aiLabelPrefix: env.MAIL_AGENT_LABEL_AI_LABEL_PREFIX,
      keep: buildManagedLabelName(
        env.MAIL_AGENT_LABEL_AI_LABEL_PREFIX,
        env.MAIL_AGENT_LABEL_KEEP,
      ),
      delete: buildManagedLabelName(
        env.MAIL_AGENT_LABEL_AI_LABEL_PREFIX,
        env.MAIL_AGENT_LABEL_DELETE,
      ),
      hidden: buildManagedLabelName(
        env.MAIL_AGENT_LABEL_AI_LABEL_PREFIX,
        env.MAIL_AGENT_LABEL_HIDDEN,
      ),
    },
    undoTokenSecret: env.MAIL_AGENT_UNDO_TOKEN_SECRET,
    telegram: {
      botToken: env.MAIL_AGENT_TELEGRAM_BOT_TOKEN,
      chatId: env.MAIL_AGENT_TELEGRAM_CHAT_ID,
      allowedUserIds: parseAllowedUserIds(
        env.MAIL_AGENT_TELEGRAM_ALLOWED_USER_IDS,
      ),
      parseMode: env.MAIL_AGENT_TELEGRAM_PARSE_MODE,
    },
  }
}
