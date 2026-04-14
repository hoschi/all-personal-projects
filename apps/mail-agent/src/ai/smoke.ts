import { createAiPipeline, parseClassifierDecision } from "./index"
import { createBootstrapConfig } from "../config"

const PRIVATE_SAMPLE = {
  sender: "friend@gmail.com",
  subject: "Dinner on Friday?",
  bodyText:
    "Hey, are you free on Friday evening for dinner? Let me know what time works best for you.",
  labels: ["INBOX", "CATEGORY_PERSONAL"],
  threadParticipants: ["friend@gmail.com"],
}

const NON_PRIVATE_SAMPLE = {
  sender: "news@shop.example.com",
  subject: "Spring sale: 25% on all tools today",
  bodyText:
    "Only today: 25% off selected tools. Final checkout by midnight. Shipping starts tomorrow.",
  labels: ["INBOX", "CATEGORY_PROMOTIONS"],
  threadParticipants: ["news@shop.example.com"],
}

const INVALID_MODEL_OUTPUT_SAMPLE: unknown = {
  deleteIt: "true",
  summary: 123,
  subject: "invalid",
  reason: "invalid",
}

async function main() {
  const config = createBootstrapConfig()
  const aiPipeline = createAiPipeline(config)

  const privateResult = await aiPipeline.classify(PRIVATE_SAMPLE)

  let nonPrivateResult: Awaited<ReturnType<typeof aiPipeline.classify>> | null =
    null
  let nonPrivateError: string | null = null

  try {
    nonPrivateResult = await aiPipeline.classify(NON_PRIVATE_SAMPLE)
  } catch (error: unknown) {
    nonPrivateError = error instanceof Error ? error.message : String(error)
  }

  let invalidParseError: string | null = null

  try {
    parseClassifierDecision(INVALID_MODEL_OUTPUT_SAMPLE)
  } catch (error: unknown) {
    invalidParseError = error instanceof Error ? error.message : String(error)
  }

  console.log(
    JSON.stringify(
      {
        privateSample: {
          path: privateResult.path,
          decision: privateResult.decision,
        },
        nonPrivateSample: nonPrivateResult
          ? {
              path: nonPrivateResult.path,
              decision: nonPrivateResult.decision,
            }
          : null,
        nonPrivateError,
        malformedModelOutputError: invalidParseError,
      },
      null,
      2,
    ),
  )
}

main().catch((error: unknown) => {
  throw new Error("ai smoke test failed", { cause: error })
})
