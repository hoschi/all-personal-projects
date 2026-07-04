import { prisma as ytPrisma } from "@repo/yt-notes-scripts/db"

export interface YtContext {
  displayTitle: string
  descriptionShort: string
  channelName: string
  namedEntities: string[]
}

export async function loadYtContext(youtubeId: string): Promise<YtContext> {
  const video = await ytPrisma.video.findUniqueOrThrow({
    where: { youtubeId },
    select: {
      displayTitle: true,
      descriptionShort: true,
      title: true,
      channel: { select: { name: true } },
      transcript: { select: { namedEntities: true } },
    },
  })
  return {
    displayTitle: video.displayTitle ?? video.title,
    descriptionShort: video.descriptionShort ?? "(noch nicht enriched)",
    channelName: video.channel?.name ?? "(unbekannt)",
    namedEntities: (video.transcript?.namedEntities as string[] | null) ?? [],
  }
}
