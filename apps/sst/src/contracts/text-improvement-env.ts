import { z } from "zod"

export const textImprovementEnvSchema = z.object({
  SST_WHISPER_ENDPOINT: z.string().trim().url(),
  SST_OLLAMA_ENDPOINT: z.string().trim().url(),
  SST_OLLAMA_MODEL_ID: z.string().trim().min(1),
})

export type TextImprovementEnv = z.infer<typeof textImprovementEnvSchema>
