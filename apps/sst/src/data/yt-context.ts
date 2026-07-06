import { prisma as ytPrisma } from "@repo/yt-notes-scripts/db"
import { z } from "zod"

export interface YtContext {
  displayTitle: string
  descriptionShort: string
  channelName: string
  namedEntities: string[]
}

const namedEntitiesSchema = z.array(z.string())

const FALLBACK_YT_CONTEXT: YtContext = {
  displayTitle: "(nicht verfügbar)",
  descriptionShort: "(nicht verfügbar)",
  channelName: "(unbekannt)",
  namedEntities: [],
}

export async function loadYtContext(youtubeId: string): Promise<YtContext> {
  const video = await ytPrisma.video.findUnique({
    where: { youtubeId },
    select: {
      displayTitle: true,
      descriptionShort: true,
      title: true,
      channel: { select: { name: true } },
      transcript: { select: { namedEntities: true } },
    },
  })
  if (video === null) {
    return FALLBACK_YT_CONTEXT
  }
  return {
    displayTitle: video.displayTitle ?? video.title,
    descriptionShort: video.descriptionShort ?? "(noch nicht enriched)",
    channelName: video.channel?.name ?? "(unbekannt)",
    namedEntities: video.transcript?.namedEntities
      ? namedEntitiesSchema.parse(video.transcript.namedEntities)
      : [],
  }
}
