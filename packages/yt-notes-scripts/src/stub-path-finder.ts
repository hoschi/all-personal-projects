import { existsSync } from "node:fs"
import { join } from "node:path"
import type { PrismaClient } from "./generated/prisma/client"
import type { StubLocation } from "./enrich-pipeline"

/**
 * Findet den Stub-MD-Pfad für ein gegebenes YouTube-Video durch Lookup in
 * yt.note_link + yt.vault. Returnt den ersten Eintrag dessen Datei
 * tatsächlich im Filesystem existiert (verwaiste DB-Einträge — Datei
 * gelöscht/umbenannt — werden übersprungen), oder null wenn nichts passt.
 *
 * Erwartet relative file_paths (Format "youtube/<channel>/<title>.md")
 * gemäß filePath-Konsolidierungs-Migration 20260607115258. Drift-Cases
 * mit absoluten Pfaden, die die Migration nicht abgedeckt hat, werden
 * hier nicht mehr matched — Pipeline läuft dann DB-only durch, kein
 * Stub-Update. Solche Cases sind manuell zu bereinigen (siehe
 * Migration-Output).
 */
export async function findStubPath(
  prisma: PrismaClient,
  youtubeId: string,
): Promise<StubLocation | null> {
  const links = await prisma.noteLink.findMany({
    where: {
      youtubeId,
      filePath: { startsWith: "youtube/" },
    },
    include: { vaultRef: true },
  })
  for (const link of links) {
    if (!link?.vaultRef?.rootPath) continue
    const vaultRoot = link.vaultRef.rootPath
    const relPath = link.filePath
    const absPath = join(vaultRoot, relPath)
    if (existsSync(absPath)) return { vaultRoot, relPath, absPath }
  }
  return null
}
