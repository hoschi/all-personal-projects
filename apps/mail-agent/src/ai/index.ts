import Debug from "debug"
import OpenAI from "openai"
import { z } from "zod"

import type { BootstrapConfig } from "../config"

let openAiClientSingleton: OpenAI | null = null
let openAiClientApiKey: string | null = null

const NEWSLETTER_INDICATORS = [
  "unsubscribe",
  "newsletter",
  "promotion",
  "no-reply",
  "noreply",
  "marketing",
] as const

const PERSONAL_MAIL_PROVIDER_MARKERS = [
  "@gmail.",
  "@outlook.",
  "@hotmail.",
  "@icloud.",
  "@proton.",
  "@gmx.",
  "@yahoo.",
] as const

const classifierDecisionSchema = z.object({
  deleteIt: z.boolean(),
  summary: z.string().trim().min(1),
  subject: z.string().trim().min(1),
  reason: z.string().trim().min(1),
})

function formatRulesAsBulletList(rules: string[]): string {
  return rules.map((rule) => `- ${rule}`).join("\n")
}

function buildClassifierSystemPrompt(config: BootstrapConfig): string {
  const deleteRules = formatRulesAsBulletList(config.aiPromptRules.delete)
  const keepRules = formatRulesAsBulletList(config.aiPromptRules.keep)
  const summaryRules = formatRulesAsBulletList(config.aiPromptRules.summary)

  return `=# Rolle
Du bist ein hilfreicher Assistent für Emails und antwortest immer auf deutsch.

# Aufgabe
Du schaust dir die Email Daten an und bearbeitest sie in diesen Schritten:
1. behalten oder löschen
2. Inhalt zusammenfassen
3. JSON Ausgabe konstruieren

# Schritt: Behalten oder Löschen
Triff die Entscheidung mit einer Abwägung, nicht mit nur einer Einzelregel.

## Generelle Regeln

### Löschen
${deleteRules}

### Behalten
${keepRules}

# Schritt: Zusammenfassung
${summaryRules}

# Schritt: Ausgabe
Konstruiere ein JSON, das exakt diese Felder enthält:
- deleteIt
- summary
- subject
- reason

Regeln für Felder:
- deleteIt: true oder false
- subject: prägnante Tagline mit Absender oder Marke
- summary: Zusammenfassung nach den Regeln oben
- reason: kurze, stichhaltige Begründung für die Entscheidung

Wichtig:
- Gib ausschließlich JSON zurück, ohne erklärenden Zusatztext.
- Die Felder summary, subject und reason müssen auf Deutsch sein.`
}

export type ClassifierDecision = z.infer<typeof classifierDecisionSchema>

export type AiClassificationInput = {
  sender: string
  subject: string
  bodyText: string
  labels: string[]
  threadParticipants: string[]
}

export type AiClassificationPath = "private_bypass" | "ai_model"

export type AiClassificationResult = {
  path: AiClassificationPath
  decision: ClassifierDecision
}

function stringifyInputForModel(input: AiClassificationInput): string {
  return JSON.stringify(
    {
      sender: input.sender,
      subject: input.subject,
      bodyText: input.bodyText,
      labels: input.labels,
      threadParticipants: input.threadParticipants,
    },
    null,
    2,
  )
}

function containsAny(value: string, markers: readonly string[]): boolean {
  const normalized = value.toLowerCase()
  return markers.some((marker) => normalized.includes(marker))
}

function isLikelyPrivateMessage(input: AiClassificationInput): boolean {
  const sender = input.sender.trim().toLowerCase()
  const subject = input.subject.trim().toLowerCase()
  const body = input.bodyText.trim().toLowerCase()
  const labels = input.labels.map((label) => label.toUpperCase())

  if (labels.includes("CATEGORY_PERSONAL")) {
    return true
  }

  const senderLooksPersonal = containsAny(
    sender,
    PERSONAL_MAIL_PROVIDER_MARKERS,
  )
  const looksLikeNewsletter =
    containsAny(sender, NEWSLETTER_INDICATORS) ||
    containsAny(subject, NEWSLETTER_INDICATORS) ||
    containsAny(body, NEWSLETTER_INDICATORS)

  return senderLooksPersonal && !looksLikeNewsletter
}

function buildPrivateBypassDecision(
  input: AiClassificationInput,
): ClassifierDecision {
  const sender = input.sender.trim() || "Unbekannter Absender"
  const subject = input.subject.trim() || "Private Nachricht"
  const bodyPreview = input.bodyText.trim().slice(0, 180)

  const summary = bodyPreview.length
    ? `Private Nachricht von ${sender}: ${bodyPreview}`
    : `Private Nachricht von ${sender} mit Betreff "${subject}".`

  return {
    deleteIt: false,
    subject,
    summary,
    reason:
      "Als private Kommunikation erkannt. AI-Klassifikation wurde übersprungen.",
  }
}

function parseModelJson(rawContent: string): unknown {
  try {
    return JSON.parse(rawContent)
  } catch {
    throw new Error(
      `Model output is not valid JSON: ${rawContent.slice(0, 400)}`,
    )
  }
}

export function parseClassifierDecision(raw: unknown): ClassifierDecision {
  const result = classifierDecisionSchema.safeParse(raw)

  if (result.success) {
    return result.data
  }

  const details = result.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("; ")

  throw new Error(`Invalid classifier model output: ${details}`)
}

function getOpenAiClient(openAiApiKeyRaw: string): OpenAI {
  const openAiApiKey = openAiApiKeyRaw.trim()

  if (openAiApiKey.length === 0) {
    throw new Error("MAIL_AGENT_OPENAI_API_KEY is required.")
  }

  if (!openAiClientSingleton || openAiClientApiKey !== openAiApiKey) {
    openAiClientSingleton = new OpenAI({ apiKey: openAiApiKey })
    openAiClientApiKey = openAiApiKey
  }

  return openAiClientSingleton
}

export function createAiPipeline(config: BootstrapConfig) {
  const debug = Debug("app:action:createAiPipeline")
  const openAiApiKey = config.openAiApiKey.trim()
  const classifierSystemPrompt = buildClassifierSystemPrompt(config)
  debug(
    "Creating AI pipeline: hasApiKey=%s, hasModel=%s",
    openAiApiKey.length > 0,
    config.openAiModel.trim().length > 0,
  )

  const openAiClient = getOpenAiClient(openAiApiKey)

  return {
    async classify(
      input: AiClassificationInput,
    ): Promise<AiClassificationResult> {
      const debug = Debug("app:action:classifyEmail")
      debug(
        "Classification started: sender=%s, subject=%s, labelCount=%d, threadParticipantCount=%d",
        input.sender,
        input.subject,
        input.labels.length,
        input.threadParticipants.length,
      )

      if (isLikelyPrivateMessage(input)) {
        debug("Classification path selected: private_bypass")

        return {
          path: "private_bypass",
          decision: buildPrivateBypassDecision(input),
        }
      }

      if (config.openAiModel.trim().length === 0) {
        debug("Classification blocked: missing OpenAI runtime configuration")

        throw new Error("MAIL_AGENT_OPENAI_MODEL is required.")
      }

      debug("Classification path selected: ai_model")

      const completion = await openAiClient.chat.completions.create({
        model: config.openAiModel,
        //temperature: 0.1,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: classifierSystemPrompt },
          {
            role: "user",
            content: `Heutiger Zeitpunkt: ${new Date().toISOString()}\n\n# Email Daten\n${stringifyInputForModel(input)}\n\nGib ausschließlich JSON zurück.`,
          },
        ],
      })

      const rawContent = completion.choices.at(0)?.message.content

      debug("OpenAI completion received: hasContent=%s", !!rawContent)

      if (!rawContent) {
        throw new Error("OpenAI returned empty classification output.")
      }

      const modelOutputUnknown = parseModelJson(rawContent)
      const decision = parseClassifierDecision(modelOutputUnknown)

      debug(
        "Classification finished: deleteIt=%s, subject=%s",
        decision.deleteIt,
        decision.subject,
      )

      return {
        path: "ai_model",
        decision,
      }
    },
  }
}
