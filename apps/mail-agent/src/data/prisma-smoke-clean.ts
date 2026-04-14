import { prisma } from "./prisma"

const AGENT_STATE_ID = "mail-agent-state" as const
const SMOKE_MESSAGE_PREFIX = "smoke-message-" as const
const SMOKE_THREAD_ID = "smoke-thread" as const

async function main() {
  const deletedProcessedEmails = await prisma.processedEmail.deleteMany({
    where: {
      OR: [
        { gmailThreadId: SMOKE_THREAD_ID },
        { gmailMessageId: { startsWith: SMOKE_MESSAGE_PREFIX } },
      ],
    },
  })

  const deletedAgentState = await prisma.agentState.deleteMany({
    where: {
      id: AGENT_STATE_ID,
    },
  })

  console.log(
    JSON.stringify({
      deletedProcessedEmailCount: deletedProcessedEmails.count,
      deletedAgentStateCount: deletedAgentState.count,
    }),
  )
}

main()
  .catch((error: unknown) => {
    throw new Error("smoke clean failed", { cause: error })
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
