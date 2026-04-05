import { createServerFn } from "@tanstack/react-start"

import {
  improveTextResultSchema,
  processTabRecordingInputSchema,
} from "@/contracts/tab-sync"

type WhisperVerboseJsonResponse = {
  text?: string
  model?: string
  error?: string
}

type OllamaGenerateResponse = {
  model?: string
  response?: string
  error?: string
}

const DEFAULT_WHISPER_ENDPOINT = "http://localhost:9100/inference" as const
const DEFAULT_OLLAMA_ENDPOINT = "http://localhost:11434/api/generate" as const
const DEFAULT_OLLAMA_MODEL_ID = "gemma3:latest" as const
const DEFAULT_WHISPER_MODEL_ID = "whisper-unknown" as const
const DEFAULT_LANGUAGE = "de" as const

function getWhisperEndpoint() {
  return process.env.SST_WHISPER_ENDPOINT ?? DEFAULT_WHISPER_ENDPOINT
}

function getOllamaEndpoint() {
  return process.env.SST_OLLAMA_ENDPOINT ?? DEFAULT_OLLAMA_ENDPOINT
}

function getOllamaModelId() {
  return process.env.SST_OLLAMA_MODEL_ID ?? DEFAULT_OLLAMA_MODEL_ID
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
  audioBlob: Blob
  language: string
}): Promise<{ text: string; modelId: string }> {
  const formData = new FormData()

  formData.append("file", input.audioBlob, "recording.webm")
  formData.append("response_format", "verbose_json")
  formData.append("language", input.language)
  formData.append("temperature", "0.0")

  const response = await fetch(getWhisperEndpoint(), {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const responseText = await response.text()
    throw new Error(
      `Whisper request failed (${response.status}): ${responseText}`,
    )
  }

  const data = (await response.json()) as WhisperVerboseJsonResponse
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
  transcriptionText: string
  contextText: string
}): Promise<{ text: string; modelId: string }> {
  const modelId = getOllamaModelId()
  const prompt = buildCorrectionPrompt(input)

  const response = await fetch(getOllamaEndpoint(), {
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

  const data = (await response.json()) as OllamaGenerateResponse
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
    const audioBlob = decodeAudioBlob({
      audioBase64: data.audioBase64,
      audioMimeType: data.audioMimeType,
    })

    const transcriptionStartAtMs = Date.now()
    const transcriptionResult = await transcribeWithWhisper({
      audioBlob,
      language: data.language ?? DEFAULT_LANGUAGE,
    })
    const transcriptionDurationMs = Date.now() - transcriptionStartAtMs

    const correctionStartAtMs = Date.now()
    const correctionResult = await correctWithOllama({
      transcriptionText: transcriptionResult.text,
      contextText: data.contextText,
    })
    const correctionDurationMs = Date.now() - correctionStartAtMs

    return improveTextResultSchema.parse({
      tabId: data.tabId,
      rawTranscriptionText: transcriptionResult.text,
      correctedText: correctionResult.text,
      whisperModelId: transcriptionResult.modelId,
      ollamaModelId: correctionResult.modelId,
      transcriptionDurationMs,
      correctionDurationMs,
      totalDurationMs: transcriptionDurationMs + correctionDurationMs,
    })
  })
