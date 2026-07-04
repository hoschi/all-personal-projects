import * as readline from "readline/promises"
import { stdin, stdout } from "process"
import { Command } from "commander"
import { prisma } from "./db"
import { fetchVideo, writeVideo, HttpError } from "./get_video_details"
import { autoClassify, formatAutoNote } from "./utils/channel-classifier"
import type { ChannelClass } from "./generated/prisma/enums"

interface Summary {
  channelsBackfilled: number
  channelsAutoClassified: { arbeit: number; privat: number }
  channelsHitlClassified: number
  channelsRemainingUnknown: number
}

const confirmYesNo = async (question: string): Promise<boolean> => {
  const rl = readline.createInterface({ input: stdin, output: stdout })
  try {
    const ans = (await rl.question(`${question} [y/n]: `)).trim().toLowerCase()
    return ans === "y" || ans === "yes"
  } finally {
    rl.close()
  }
}

const runPhaseA_Backfill = async (reviewAuto: boolean): Promise<number> => {
  if (reviewAuto) return 0

  const unresolved = await prisma.video.findMany({
    where: { channelId: null, unavailable: false },
    select: { youtubeId: true },
  })
  if (unresolved.length === 0) {
    console.log(
      "[phase-a] no videos with channel_id IS NULL — skipping backfill",
    )
    return 0
  }

  console.log(
    `[phase-a] ${unresolved.length} videos without channel_id → ~${
      unresolved.length * 2
    } API units (default quota 10000/day)`,
  )
  if (unresolved.length > 500) {
    const ok = await confirmYesNo(
      "Continue with backfill? (n exits gracefully — try --include <ids> for a subset)",
    )
    if (!ok) {
      console.log("[phase-a] user declined — exiting without changes")
      process.exit(0)
    }
  }

  let backfilled = 0
  for (const v of unresolved) {
    try {
      const item = await fetchVideo(v.youtubeId)
      await writeVideo(item)
      backfilled++
    } catch (e) {
      // Nur bei echtem 404 (Video gelöscht/privat) als unavailable markieren,
      // damit es beim nächsten Lauf nicht erneut Quota verbrennt. Bei 403
      // (Quota erschöpft) und Netzwerk-/Timeout-Fehlern NICHT markieren —
      // sonst würden bei Quota-Ende fälschlich tausende Videos abgestempelt.
      if (e instanceof HttpError && e.status === 404) {
        await prisma.video.update({
          where: { youtubeId: v.youtubeId },
          data: { unavailable: true },
        })
        console.warn(`[phase-a] mark unavailable ${v.youtubeId}: ${e.message}`)
      } else {
        console.warn(`[phase-a] skip ${v.youtubeId}: ${(e as Error).message}`)
      }
    }
  }
  console.log(
    `[phase-a] backfilled ${backfilled} videos / ${unresolved.length}`,
  )
  return backfilled
}

const runPhaseB_Auto = async (
  reviewAuto: boolean,
  includeIds: string[] | undefined,
): Promise<{ arbeit: number; privat: number }> => {
  if (reviewAuto) return { arbeit: 0, privat: 0 }

  const channels = await prisma.channel.findMany({
    where: {
      classification: "unknown",
      ...(includeIds ? { id: { in: includeIds } } : {}),
    },
  })
  let arbeit = 0
  let privat = 0

  for (const ch of channels) {
    // Hinweis: kein `distinct: ["vault"]` — bei mehreren Note-Links pro Vault
    // kann Prisma sonst einen Bestandslink (nicht-Stub) zurückgeben und die
    // Stub-Erkennung schlägt fehl. Dedup geschieht in JS via Set<vault>.
    const noteLinks = await prisma.noteLink.findMany({
      where: { video: { channelId: ch.id } },
      include: { vaultRef: true },
    })
    const stubVaults = new Set<string>()
    for (const nl of noteLinks) {
      // Stub-Erkennung: filePath startsWith vaultRoot/youtube/
      const root = nl.vaultRef.rootPath
      const prefix = root.endsWith("/") ? `${root}youtube/` : `${root}/youtube/`
      if (nl.filePath.startsWith(prefix)) {
        stubVaults.add(nl.vault)
      }
    }

    const result = autoClassify(stubVaults)
    if (!result) continue

    await prisma.channel.update({
      where: { id: ch.id },
      data: {
        classification: result,
        notes: formatAutoNote(stubVaults),
      },
    })
    if (result === "arbeit") arbeit++
    if (result === "privat") privat++
  }

  console.log(
    `[phase-b] auto-classified ${arbeit + privat} channels (arbeit=${arbeit}, privat=${privat})`,
  )
  return { arbeit, privat }
}

const askChoice = async (
  question: string,
  validChoices: string[],
): Promise<string> => {
  const rl = readline.createInterface({ input: stdin, output: stdout })
  try {
    while (true) {
      const ans = (await rl.question(question)).trim().toLowerCase()
      if (validChoices.includes(ans)) return ans
      console.log(`(valid: ${validChoices.join(", ")})`)
    }
  } finally {
    rl.close()
  }
}

const askLine = async (prompt: string): Promise<string> => {
  const rl = readline.createInterface({ input: stdin, output: stdout })
  try {
    return (await rl.question(prompt)).trim()
  } finally {
    rl.close()
  }
}

const runPhaseC_HITL = async (
  autoOnly: boolean,
  reviewAuto: boolean,
  includeIds: string[] | undefined,
): Promise<{ hitl: number; remainingUnknown: number }> => {
  if (autoOnly || reviewAuto) {
    const remaining = await prisma.channel.count({
      where: {
        classification: "unknown",
        ...(includeIds ? { id: { in: includeIds } } : {}),
      },
    })
    return { hitl: 0, remainingUnknown: remaining }
  }

  // Listet Channels mit count(watch_history) — zwei Query-Varianten je nach Filter
  type Row = {
    id: string
    name: string
    subscribers: number | null
    watchEvents: number
  }
  const rows: Row[] =
    includeIds && includeIds.length > 0
      ? await prisma.$queryRaw<Row[]>`
        SELECT c.id, c.name, c.subscribers, COUNT(wh.id)::int AS "watchEvents"
        FROM yt.channel c
        LEFT JOIN yt.video v ON v.channel_id = c.id
        LEFT JOIN yt.watch_history wh ON wh.youtube_id = v.youtube_id
        WHERE c.classification = 'unknown' AND c.id = ANY(${includeIds})
        GROUP BY c.id, c.name, c.subscribers
        ORDER BY "watchEvents" DESC
      `
      : await prisma.$queryRaw<Row[]>`
        SELECT c.id, c.name, c.subscribers, COUNT(wh.id)::int AS "watchEvents"
        FROM yt.channel c
        LEFT JOIN yt.video v ON v.channel_id = c.id
        LEFT JOIN yt.watch_history wh ON wh.youtube_id = v.youtube_id
        WHERE c.classification = 'unknown'
        GROUP BY c.id, c.name, c.subscribers
        ORDER BY "watchEvents" DESC
      `

  let hitl = 0
  for (let i = 0; i < rows.length; i++) {
    const ch = rows[i]
    const lastTitles = await prisma.video.findMany({
      where: { channelId: ch.id },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: { title: true },
    })
    console.log(`\n[${i + 1}/${rows.length}] Channel: ${ch.name}  (${ch.id})`)
    if (ch.subscribers) console.log(`Subscribers: ${ch.subscribers}`)
    console.log(`Watch events: ${ch.watchEvents}`)
    console.log(`Last 3 video titles:`)
    for (const t of lastTitles) console.log(`  - "${t.title}"`)

    const choice = await askChoice(
      `[p]rivat / [a]rbeit / [m]ixed / [s]kip / [n]ote (then resume) / [q]uit: `,
      ["p", "a", "m", "s", "n", "q"],
    )

    if (choice === "q") {
      const remaining = await prisma.channel.count({
        where: { classification: "unknown" },
      })
      return { hitl, remainingUnknown: remaining }
    }
    if (choice === "s") continue
    if (choice === "n") {
      const note = await askLine("Note: ")
      await prisma.channel.update({
        where: { id: ch.id },
        data: { notes: note },
      })
      i-- // gleichen Channel nochmal zeigen für Klassifikations-Wahl
      continue
    }
    const map: Record<string, ChannelClass> = {
      p: "privat",
      a: "arbeit",
      m: "mixed",
    }
    await prisma.channel.update({
      where: { id: ch.id },
      data: { classification: map[choice] },
    })
    hitl++
  }

  const remaining = await prisma.channel.count({
    where: { classification: "unknown" },
  })
  return { hitl, remainingUnknown: remaining }
}

const runReviewAuto = async (): Promise<number> => {
  const rows = await prisma.channel.findMany({
    where: {
      notes: { startsWith: "auto:" },
    },
    orderBy: { name: "asc" },
  })
  let overrides = 0
  for (let i = 0; i < rows.length; i++) {
    const ch = rows[i]
    console.log(
      `\n[${i + 1}/${rows.length}] Channel: ${ch.name} (${ch.notes ?? ""})`,
    )
    const lastTitles = await prisma.video.findMany({
      where: { channelId: ch.id },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: { title: true },
    })
    console.log(`Last 3 watched videos:`)
    for (const t of lastTitles) console.log(`  - "${t.title}"`)
    const choice = await askChoice(`[k]eep / [o]verride / [q]uit: `, [
      "k",
      "o",
      "q",
    ])
    if (choice === "q") return overrides
    if (choice === "k") continue
    const newChoice = await askChoice(
      `New class — [p]rivat / [a]rbeit / [m]ixed: `,
      ["p", "a", "m"],
    )
    const map: Record<string, ChannelClass> = {
      p: "privat",
      a: "arbeit",
      m: "mixed",
    }
    await prisma.channel.update({
      where: { id: ch.id },
      data: {
        classification: map[newChoice],
        notes: `manual override (was: ${ch.notes})`,
      },
    })
    overrides++
  }
  return overrides
}

const program = new Command()
  .name("classify_channels")
  .description(
    "Classifies YouTube channels as privat | arbeit | mixed | unknown. Auto-classification uses stub presence per vault (R11); HITL loop for the rest.",
  )
  .option(
    "--auto-only",
    "Skip the HITL loop (Phase A API-backfill + auto-classification still run)",
    false,
  )
  .option(
    "--review-auto",
    "Show already-auto-classified channels for confirm/override",
    false,
  )
  .option(
    "--include <list>",
    "Only process channels matching listed IDs (comma-separated)",
  )
  .option(
    "--reset",
    "Reset all classifications to 'unknown' first (DEV only)",
    false,
  )
  .addHelpText(
    "after",
    `
Environment:
  DATABASE_URL               Postgres connection string
  YOUTUBE_API_KEY            YouTube Data API key

Examples:
  bun run src/classify_channels.ts --auto-only
  bun run src/classify_channels.ts                       # auto + HITL
  bun run src/classify_channels.ts --review-auto

Exit codes:
  0  success
  1  input error
  2  DB error
  3  API error / quota exhausted
`,
  )
  .action(
    async (opts: {
      autoOnly: boolean
      reviewAuto: boolean
      include?: string
      reset: boolean
    }) => {
      try {
        const summary = await run(opts)
        printSummary(summary)
      } catch (e) {
        console.error((e as Error).message)
        process.exit(2)
      } finally {
        await prisma.$disconnect()
      }
    },
  )

const run = async (opts: {
  autoOnly: boolean
  reviewAuto: boolean
  include?: string
  reset: boolean
}): Promise<Summary> => {
  if (opts.reset) {
    await prisma.channel.updateMany({
      data: { classification: "unknown", notes: null },
    })
    console.log("[reset] all classifications → unknown")
  }

  if (opts.reviewAuto) {
    const overrides = await runReviewAuto()
    console.log(`\n[review-auto] ${overrides} overrides applied`)
    return {
      channelsBackfilled: 0,
      channelsAutoClassified: { arbeit: 0, privat: 0 },
      channelsHitlClassified: 0,
      channelsRemainingUnknown: await prisma.channel.count({
        where: { classification: "unknown" },
      }),
    }
  }

  const channelsBackfilled = await runPhaseA_Backfill(opts.reviewAuto)

  const includeIds = opts.include
    ?.split(",")
    .map((s) => s.trim())
    .filter(Boolean)
  const channelsAutoClassified = await runPhaseB_Auto(
    opts.reviewAuto,
    includeIds,
  )

  const { hitl, remainingUnknown } = await runPhaseC_HITL(
    opts.autoOnly,
    opts.reviewAuto,
    includeIds,
  )

  return {
    channelsBackfilled,
    channelsAutoClassified,
    channelsHitlClassified: hitl,
    channelsRemainingUnknown: remainingUnknown,
  }
}

const printSummary = (s: Summary) => {
  console.log(`\n=== Summary ===`)
  console.log(`channels backfilled (API):     ${s.channelsBackfilled}`)
  console.log(
    `channels auto-classified:      ${
      s.channelsAutoClassified.arbeit + s.channelsAutoClassified.privat
    }`,
  )
  console.log(`  arbeit:    ${s.channelsAutoClassified.arbeit}`)
  console.log(`  privat:    ${s.channelsAutoClassified.privat}`)
  console.log(`  mixed:      0   (mixed never auto — only HITL)`)
  console.log(`channels HITL-classified:      ${s.channelsHitlClassified}`)
  console.log(`channels remaining unknown:    ${s.channelsRemainingUnknown}`)
}

if (import.meta.main) {
  await program.parseAsync(process.argv)
}
