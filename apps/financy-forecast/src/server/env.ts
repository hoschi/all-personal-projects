import { config as dotenvConfig } from "dotenv"
import { z } from "zod"

export const DATABASE_SCHEMA_NAME = "financy_forecast" as const

dotenvConfig({ path: ".env.base", quiet: true })
dotenvConfig({ path: ".env", override: true, quiet: true })

type ServerEnv = {
  databaseUrl: string
}

function readServerEnv(): ServerEnv {
  const envSchema = z.object({
    DATABASE_URL: z
      .string()
      .trim()
      .min(1)
      .superRefine((value, context) => {
        try {
          const parsedUrl = new URL(value)
          if (parsedUrl.searchParams.has("schema")) {
            context.addIssue({
              code: "custom",
              message:
                "DATABASE_URL must not include ?schema=. Use SET search_path after connecting.",
            })
          }
        } catch {
          context.addIssue({
            code: "custom",
            message: "DATABASE_URL must be a valid URL.",
          })
        }
      }),
  })

  const result = envSchema.safeParse(process.env)

  if (result.success) {
    return {
      databaseUrl: result.data.DATABASE_URL,
    }
  }

  const details = result.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("; ")

  throw new Error(
    `Invalid financy-forecast server environment configuration: ${details}`,
  )
}

export const serverEnv = readServerEnv()
