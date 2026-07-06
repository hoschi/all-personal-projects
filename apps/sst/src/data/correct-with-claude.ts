import { z } from "zod"
import { callClaudeCli } from "@repo/yt-notes-scripts/llm-caller"

export interface CorrectWithClaudeInput {
  prompt: string
}

export interface CorrectWithClaudeResult {
  text: string
  modelId: string
}

const correctWithClaudeEnvSchema = z.object({
  SST_CLAUDE_MODEL: z.string().trim().min(1),
  SST_CLAUDE_EFFORT: z.enum(["low", "medium", "high", "xhigh", "max"]),
})

function readCorrectWithClaudeEnv() {
  return correctWithClaudeEnvSchema.parse({
    SST_CLAUDE_MODEL: process.env.SST_CLAUDE_MODEL,
    SST_CLAUDE_EFFORT: process.env.SST_CLAUDE_EFFORT,
  })
}

// Obere Zeitgrenze für den Claude-CLI-Call — schützt den Server-Fn-Handler
// vor unendlichem Hängen falls die CLI steckt.
const CLAUDE_CLI_TIMEOUT_MS = 120_000

export async function correctWithClaude(
  input: CorrectWithClaudeInput,
): Promise<CorrectWithClaudeResult> {
  const env = readCorrectWithClaudeEnv()

  const callPromise = callClaudeCli({
    prompt: input.prompt,
    allowedTools: "", // STT-Korrektur braucht keine Tools
    model: env.SST_CLAUDE_MODEL,
    effort: env.SST_CLAUDE_EFFORT,
  })

  let timer: ReturnType<typeof setTimeout>
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () =>
        reject(
          new Error(
            `correctWithClaude timed out after ${CLAUDE_CLI_TIMEOUT_MS}ms`,
          ),
        ),
      CLAUDE_CLI_TIMEOUT_MS,
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
    // CLI nutzt den im claude-CLI-Setup konfigurierten Default (Sonnet 4.6).
    modelId: "claude-cli-default",
  }
}
