import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"

import { textImprovementEnvSchema } from "@/contracts/text-improvement-env"
import {
  type ImproveTextResult,
  processTabRecordingInputSchema,
} from "@/contracts/tab-sync"

const DEFAULT_WHISPER_MODEL_ID = "whisper-unknown" as const
const DEFAULT_LANGUAGE = "de" as const
const WAV_FILE_NAME = "recording.wav" as const

const whisperVerboseJsonResponseSchema = z.object({
  text: z.string().optional(),
  model: z.string().optional(),
  error: z.string().optional(),
})

const ollamaGenerateResponseSchema = z.object({
  model: z.string().optional(),
  response: z.string().optional(),
  error: z.string().optional(),
})

function readTextImprovementEnv() {
  return textImprovementEnvSchema.parse({
    SST_WHISPER_ENDPOINT: process.env.SST_WHISPER_ENDPOINT,
    SST_OLLAMA_ENDPOINT: process.env.SST_OLLAMA_ENDPOINT,
    SST_OLLAMA_MODEL_ID: process.env.SST_OLLAMA_MODEL_ID,
  })
}

function decodeAudioBlob(input: {
  audioBase64: string
  audioMimeType: string
}) {
  const bytes = Buffer.from(input.audioBase64, "base64")

  if (bytes.length === 0) {
    throw new Error("Audio payload is empty.")
  }

  return new Blob([bytes], {
    type: input.audioMimeType,
  })
}

function normalizeWhisperText(text: string) {
  const withoutSplitWords = text.replace(
    /([A-Za-zÄÖÜäöüß])\r?\n([A-Za-zÄÖÜäöüß])/g,
    "$1$2",
  )

  return withoutSplitWords.replace(/\s+/g, " ").trim()
}

function buildCorrectionPrompt(input: {
  transcriptionText: string
  contextText: string
}) {
  return [
    "You are a strict transcript correction assistant.",
    "Fix spelling, punctuation, and grammar while preserving the meaning.",
    "Use the context section to resolve named entities and domain-specific terms.",
    "Return only the corrected text without explanations.",
    "",
    "Context terms and hints:",
    input.contextText.trim().length > 0 ? input.contextText : "(no context)",
    "",
    "Transcript:",
    input.transcriptionText,
  ].join("\n")
}

async function transcribeWithWhisper(input: {
  whisperEndpoint: string
  audioBlob: Blob
  language: string
}): Promise<{ text: string; modelId: string }> {
  const formData = new FormData()

  formData.append("file", input.audioBlob, WAV_FILE_NAME)
  formData.append("response_format", "verbose_json")
  formData.append("language", input.language)
  formData.append("temperature", "0.0")

  const response = await fetch(input.whisperEndpoint, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const responseText = await response.text()
    throw new Error(
      `Whisper request failed (${response.status}): ${responseText}`,
    )
  }

  const rawResponseData: unknown = await response.json()
  const data = whisperVerboseJsonResponseSchema.parse(rawResponseData)
  const rawText = data.text?.trim()

  if (!rawText) {
    throw new Error(data.error ?? "Whisper response does not include text.")
  }

  return {
    text: normalizeWhisperText(rawText),
    modelId: data.model ?? DEFAULT_WHISPER_MODEL_ID,
  }
}

async function correctWithOllama(input: {
  ollamaEndpoint: string
  ollamaModelId: string
  transcriptionText: string
  contextText: string
}): Promise<{ text: string; modelId: string }> {
  const modelId = input.ollamaModelId
  const prompt = buildCorrectionPrompt(input)

  const response = await fetch(input.ollamaEndpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: modelId,
      prompt,
      stream: false,
    }),
  })

  if (!response.ok) {
    const responseText = await response.text()
    throw new Error(
      `Ollama request failed (${response.status}): ${responseText}`,
    )
  }

  const rawResponseData: unknown = await response.json()
  const data = ollamaGenerateResponseSchema.parse(rawResponseData)
  const correctedText = data.response?.trim()

  if (!correctedText) {
    throw new Error(data.error ?? "Ollama response does not include text.")
  }

  return {
    text: correctedText,
    modelId: data.model ?? modelId,
  }
}

export const improveTabRecordingFn = createServerFn({ method: "POST" })
  .inputValidator((data) => processTabRecordingInputSchema.parse(data))
  .handler(async ({ data }) => {
    const env = readTextImprovementEnv()

    const audioBlob = decodeAudioBlob({
      audioBase64: data.audioBase64,
      audioMimeType: data.audioMimeType,
    })

    const transcriptionStartAtMs = Date.now()
    const transcriptionResult = await transcribeWithWhisper({
      whisperEndpoint: env.SST_WHISPER_ENDPOINT,
      audioBlob,
      language: data.language ?? DEFAULT_LANGUAGE,
    })
    const transcriptionDurationMs = Date.now() - transcriptionStartAtMs

    const correctionStartAtMs = Date.now()
    const correctionResult = await correctWithOllama({
      ollamaEndpoint: env.SST_OLLAMA_ENDPOINT,
      ollamaModelId: env.SST_OLLAMA_MODEL_ID,
      transcriptionText: transcriptionResult.text,
      contextText: data.contextText,
    })
    const correctionDurationMs = Date.now() - correctionStartAtMs

    const improveTextResult: ImproveTextResult = {
      tabId: data.tabId,
      rawTranscriptionText: transcriptionResult.text,
      correctedText: correctionResult.text,
      whisperModelId: transcriptionResult.modelId,
      ollamaModelId: correctionResult.modelId,
      transcriptionDurationMs,
      correctionDurationMs,
      totalDurationMs: transcriptionDurationMs + correctionDurationMs,
    }

    return improveTextResult
  })
