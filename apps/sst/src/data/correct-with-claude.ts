import { callClaudeCli } from "@repo/yt-notes-scripts/llm-caller"

export interface CorrectWithClaudeInput {
  prompt: string
}

export interface CorrectWithClaudeResult {
  text: string
  modelId: string
}

export async function correctWithClaude(
  input: CorrectWithClaudeInput,
): Promise<CorrectWithClaudeResult> {
  const text = await callClaudeCli({
    prompt: input.prompt,
    allowedTools: "", // STT-Korrektur braucht keine Tools
    model: "sonnet",
    effort: "medium",
  })
  return {
    text: text.trim(),
    // CLI nutzt den im claude-CLI-Setup konfigurierten Default (Sonnet 4.6).
    modelId: "claude-cli-default",
  }
}
