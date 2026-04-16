import { config as dotenvConfig } from "dotenv"
import { z } from "zod"

export const APP_NAME = "mail-agent" as const

const TELEGRAM_PARSE_MODES = ["MarkdownV2", "Markdown", "HTML"] as const

dotenvConfig({ path: ".env.base", quiet: true })
dotenvConfig({ path: ".env", override: true, quiet: true })

const bootstrapEnvSchema = z.object({
  DATABASE_URL: z.string().trim().min(1),
  DATABASE_SCHEMA_NAME: z.literal("mail"),
  MAIL_AGENT_OPENAI_API_KEY: z.string().trim().min(1),
  MAIL_AGENT_OPENAI_MODEL: z.string().trim().min(1),
  MAIL_AGENT_AI_RULES_DELETE: z.string().trim().min(1),
  MAIL_AGENT_AI_RULES_KEEP: z.string().trim().min(1),
  MAIL_AGENT_AI_RULES_SUMMARY: z.string().trim().min(1),
  MAIL_AGENT_HTTP_HOST: z.string().trim().min(1),
  MAIL_AGENT_HTTP_PORT: z.coerce.number().int().positive(),
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
  MAIL_AGENT_TELEGRAM_BOT_TOKEN: z.string().trim().min(1),
  MAIL_AGENT_TELEGRAM_CHAT_ID: z.string().trim().min(1),
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
  aiPromptRules: {
    delete: string[]
    keep: string[]
    summary: string[]
  }
  publicBaseUrl: string
  http: {
    host: string
    port: number
  }
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

function parsePromptRuleList(raw: string, envKey: string): string[] {
  const rules = raw
    .split("||")
    .map((rule) => rule.trim())
    .filter((rule) => rule.length > 0)

  if (rules.length === 0) {
    throw new Error(
      `Invalid mail-agent environment configuration: ${envKey} must contain at least one rule.`,
    )
  }

  return rules
}

function isIpv4Address(value: string): boolean {
  const octets = value.split(".")

  if (octets.length !== 4) {
    return false
  }

  for (const octet of octets) {
    if (!/^\d+$/.test(octet)) {
      return false
    }

    const octetNumber = Number(octet)

    if (
      !Number.isInteger(octetNumber) ||
      octetNumber < 0 ||
      octetNumber > 255
    ) {
      return false
    }
  }

  return true
}

function buildPublicBaseUrl(env: BootstrapEnv): string {
  const publicHost = env.MAIL_AGENT_HTTP_HOST.trim()

  if (!isIpv4Address(publicHost)) {
    throw new Error(
      "Invalid mail-agent environment configuration: MAIL_AGENT_HTTP_HOST must be an IPv4 address.",
    )
  }

  if (publicHost === "0.0.0.0") {
    throw new Error(
      "Invalid mail-agent environment configuration: MAIL_AGENT_HTTP_HOST=0.0.0.0 cannot be used for undo links. Use your LAN IPv4 address.",
    )
  }

  return `http://${publicHost}:${env.MAIL_AGENT_HTTP_PORT}`
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
    aiPromptRules: {
      delete: parsePromptRuleList(
        env.MAIL_AGENT_AI_RULES_DELETE,
        "MAIL_AGENT_AI_RULES_DELETE",
      ),
      keep: parsePromptRuleList(
        env.MAIL_AGENT_AI_RULES_KEEP,
        "MAIL_AGENT_AI_RULES_KEEP",
      ),
      summary: parsePromptRuleList(
        env.MAIL_AGENT_AI_RULES_SUMMARY,
        "MAIL_AGENT_AI_RULES_SUMMARY",
      ),
    },
    publicBaseUrl: buildPublicBaseUrl(env),
    http: {
      host: env.MAIL_AGENT_HTTP_HOST,
      port: env.MAIL_AGENT_HTTP_PORT,
    },
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
