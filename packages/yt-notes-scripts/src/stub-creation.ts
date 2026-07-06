import { existsSync, mkdirSync } from "node:fs"
import { readFile, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import type { PrismaClient } from "./generated/prisma/client"
import { sanitizeFilename } from "./utils/file"

export interface CreateStubInput {
  prisma: PrismaClient
  video: {
    youtubeId: string
    title: string
    channel: { name: string }
    publishedAt?: Date | null
  }
  vaultRoot: string
  vaultName: string // z.B. "stefans-vault/shared"
  templatePath: string // absolut, z.B. "<vaultRoot>/templates/youtube.md"
}

export interface CreateStubResult {
  relPath: string
  absPath: string
}

/**
 * Erzeugt eine Stub-MD-Datei aus dem User-Template und schreibt einen
 * note_link-Eintrag in die yt-DB. Idempotent — zweiter Aufruf macht nichts.
 */
export async function createStubFile(
  input: CreateStubInput,
): Promise<CreateStubResult> {
  const filename = sanitizeFilename(input.video.title)
  const channelDir = sanitizeFilename(input.video.channel.name)
  const baseRelPath = `youtube/${channelDir}/${filename}.md`

  // Two videos with different youtubeId can sanitize to the same
  // title + channel, and thus the same basename. Without disambiguation the
  // second video would find the first video's stub already on disk
  // (existsSync short-circuits the write) yet still upsert a note_link row at
  // that shared filePath — pointing the second video's DB record at the first
  // video's content. Detect that collision against the note_link table and,
  // only then, embed the youtubeId in the basename. A unique basename (or a
  // re-run for the same youtubeId) keeps the unsuffixed path, so existing
  // on-disk files are never renamed and the result stays idempotent.
  const existingLink = await input.prisma.noteLink.findFirst({
    where: { vault: input.vaultName, filePath: baseRelPath },
  })
  const relPath =
    existingLink && existingLink.youtubeId !== input.video.youtubeId
      ? `youtube/${channelDir}/${filename}-${input.video.youtubeId}.md`
      : baseRelPath
  const absPath = join(input.vaultRoot, relPath)

  if (!existsSync(absPath)) {
    const template = await readFile(input.templatePath, "utf-8")
    const content = renderTemplate(template, {
      title: input.video.title,
      channelName: input.video.channel.name,
      youtubeUrl: `https://www.youtube.com/watch?v=${input.video.youtubeId}`,
      youtubeId: input.video.youtubeId,
      publishDate: input.video.publishedAt
        ? input.video.publishedAt.toISOString().slice(0, 10)
        : "",
    })
    mkdirSync(dirname(absPath), { recursive: true })
    await writeFile(absPath, content, "utf-8")
  }

  await input.prisma.noteLink.upsert({
    where: {
      youtubeId_vault_filePath: {
        youtubeId: input.video.youtubeId,
        vault: input.vaultName,
        filePath: relPath,
      },
    },
    create: {
      youtubeId: input.video.youtubeId,
      vault: input.vaultName,
      filePath: relPath,
      title: input.video.title,
    },
    update: {},
  })

  return { relPath, absPath }
}

function renderTemplate(
  template: string,
  fields: Record<string, string>,
): string {
  // Unknown placeholders (e.g. a typo in the user-editable vault template) are
  // left untouched so they stay visible in the output instead of silently
  // collapsing to an empty string. A key that is present but empty (like
  // publishDate for videos without a publish date) still renders as "".
  return template.replace(/\{\{(\w+)\}\}/g, (placeholder, key) =>
    Object.prototype.hasOwnProperty.call(fields, key)
      ? fields[key]
      : placeholder,
  )
}
