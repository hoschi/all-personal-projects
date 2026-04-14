import { prisma } from "./prisma"

const AGENT_STATE_ID = "mail-agent-state" as const

async function main() {
  await prisma.agentState.upsert({
    where: { id: AGENT_STATE_ID },
    update: { gmailHistoryId: "smoke-history-id" },
    create: {
      id: AGENT_STATE_ID,
      gmailHistoryId: "smoke-history-id",
    },
  })

  await prisma.processedEmail.create({
    data: {
      gmailMessageId: `smoke-message-${Date.now()}`,
      gmailThreadId: "smoke-thread",
      deleteIt: false,
      summary: "Smoke summary",
      subject: "Smoke subject",
      reason: "Smoke reason",
      appliedAction: "keep",
      classifierOutput: {
        deleteIt: false,
        summary: "Smoke summary",
        subject: "Smoke subject",
        reason: "Smoke reason",
      },
    },
  })

  const state = await prisma.agentState.findUnique({
    where: { id: AGENT_STATE_ID },
  })

  const latestProcessedEmail = await prisma.processedEmail.findFirst({
    where: { gmailThreadId: "smoke-thread" },
    orderBy: { createdAt: "desc" },
  })

  console.log(
    JSON.stringify({
      state,
      latestProcessedEmail: latestProcessedEmail
        ? {
            id: latestProcessedEmail.id,
            gmailMessageId: latestProcessedEmail.gmailMessageId,
            gmailThreadId: latestProcessedEmail.gmailThreadId,
          }
        : null,
    }),
  )
}

main()
  .catch((error: unknown) => {
    throw new Error("prisma smoke test failed", { cause: error })
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
