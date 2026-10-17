import { z } from "zod"
import { callLlmCli } from "@repo/yt-notes-scripts/llm-caller"

export interface CorrectWithCodexInput {
  prompt: string
}

export interface CorrectWithCodexResult {
  text: string
  modelId: string
}

const correctWithCodexEnvSchema = z.object({
  SST_CODEX_MODEL: z.string().trim().min(1),
  SST_CODEX_EFFORT: z.enum(["low", "medium", "high", "xhigh"]),
})

function readCorrectWithCodexEnv() {
  return correctWithCodexEnvSchema.parse({
    SST_CODEX_MODEL: process.env.SST_CODEX_MODEL,
    SST_CODEX_EFFORT: process.env.SST_CODEX_EFFORT,
  })
}

// Obere Zeitgrenze für den Codex-CLI-Call — schützt den Server-Fn-Handler
// vor unendlichem Hängen falls die CLI steckt.
const CODEX_CLI_TIMEOUT_MS = 120_000

export async function correctWithCodex(
  input: CorrectWithCodexInput,
): Promise<CorrectWithCodexResult> {
  const env = readCorrectWithCodexEnv()

  const callPromise = callLlmCli({
    channel: "codex-cli",
    prompt: input.prompt,
    model: env.SST_CODEX_MODEL,
    effort: env.SST_CODEX_EFFORT,
  })

  let timer: ReturnType<typeof setTimeout>
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () =>
        reject(
          new Error(
            `correctWithCodex timed out after ${CODEX_CLI_TIMEOUT_MS}ms`,
          ),
        ),
      CODEX_CLI_TIMEOUT_MS,
    )
  })

  let text: Awaited<typeof callPromise>
  try {
    text = await Promise.race([callPromise, timeoutPromise])
  } finally {
    clearTimeout(timer!)
  }

  return {
    text: text.trim(),
    modelId: env.SST_CODEX_MODEL,
  }
}
