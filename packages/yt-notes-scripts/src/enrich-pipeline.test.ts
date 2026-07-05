/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, test, mock, beforeEach } from "bun:test"

// WICHTIG: mock.module() in Bun patcht Module retroaktiv über bereits
// geladene Aufrufer hinweg. Diese Calls stehen vor den Imports von
// enrich-pipeline + den Pass-Funktionen, damit enrichVideo() die Mocks sieht.
mock.module("./enrich-passes/pass1-audit", () => ({
  runPass1: mock(async () => "pass1-out"),
  runPass1Extended: mock(async () => ({
    auditedMd: "pass1-extended-out",
    namedEntities: ["EntityA"],
  })),
}))
mock.module("./enrich-passes/pass2-asr-fix", () => ({
  runPass2: mock(async () => "pass2-out"),
}))
mock.module("./enrich-passes/pass3-display-title", () => ({
  runPass3: mock(async () => "display title"),
}))
mock.module("./enrich-passes/pass4-description", () => ({
  runPass4: mock(async () => "description three sentences"),
}))
mock.module("./enrich-passes/pass5-summary-long", () => ({
  runPass5: mock(async () => "summary long markdown"),
}))

import {
  enrichVideo,
  enrichVideoCritical,
  enrichVideoBackground,
  shouldSkip,
} from "./enrich-pipeline"
import { mkdtempSync, rmSync } from "node:fs"
import {
  readFile as fsReadFile,
  writeFile as fsWriteFile,
} from "node:fs/promises"
import { join } from "node:path"
import { tmpdir } from "node:os"
import { runPass1, runPass1Extended } from "./enrich-passes/pass1-audit"
import { runPass2 } from "./enrich-passes/pass2-asr-fix"
import { runPass3 } from "./enrich-passes/pass3-display-title"
import { runPass4 } from "./enrich-passes/pass4-description"
import { runPass5 } from "./enrich-passes/pass5-summary-long"

type MockFn = ReturnType<typeof mock>

function makeMockPrisma(video: any) {
  // findUniqueOrThrow für transcript gibt nach kritischer Phase auditStatus="critical_ok" zurück,
  // damit enrichVideoBackground die Pre-Condition erfüllt sieht und weiterläuft.
  return {
    video: {
      findUniqueOrThrow: mock(async () => video),
      update: mock(async () => ({})),
    },
    transcript: {
      findUniqueOrThrow: mock(async () => ({
        youtubeId: video.youtubeId ?? "test-id",
        auditStatus: "critical_ok",
        auditedMd: "pass1-extended-out",
      })),
      update: mock(async () => ({})),
    },
  } as any
}

function makeMockVideo(overrides: any = {}) {
  return {
    youtubeId: "test-id",
    title: "Test-Titel",
    description: "Test-Description",
    chapters: null,
    channel: { classification: "arbeit" },
    transcript: {
      plain: "transcript-text",
      error: null,
      auditStatus: "pending",
      auditedMd: null,
    },
    ...overrides,
  }
}

// Reset hilft, weil mock.module() globale Mock-Instances erzeugt, die
// Call-Counts über Tests hinweg akkumulieren würden.
function resetPassMocks() {
  ;(runPass1 as MockFn).mockReset().mockResolvedValue("pass1-out")
  ;(runPass1Extended as MockFn).mockReset().mockResolvedValue({
    auditedMd: "pass1-extended-out",
    namedEntities: ["EntityA"],
  })
  ;(runPass2 as MockFn).mockReset().mockResolvedValue("pass2-out")
  ;(runPass3 as MockFn).mockReset().mockResolvedValue("display title")
  ;(runPass4 as MockFn)
    .mockReset()
    .mockResolvedValue("description three sentences")
  ;(runPass5 as MockFn).mockReset().mockResolvedValue("summary long markdown")
}

describe("shouldSkip", () => {
  test("skip wenn duration > 2700", () => {
    const v = {
      durationSec: 3000,
      channel: { classification: "arbeit" } as const,
      transcript: {
        plain: "x",
        error: null,
        auditStatus: "pending" as const,
        auditedMd: null,
      },
    }
    expect(shouldSkip(v, "arbeit")).toBe("skip_too_long")
  })

  test("skip wenn classification mismatch", () => {
    const v = {
      durationSec: 600,
      channel: { classification: "privat" } as const,
      transcript: {
        plain: "x",
        error: null,
        auditStatus: "pending" as const,
        auditedMd: null,
      },
    }
    expect(shouldSkip(v, "arbeit")).toBe("skip_classification_mismatch")
  })

  test("skip wenn transcript fehlt", () => {
    const v = {
      durationSec: 600,
      channel: { classification: "arbeit" } as const,
      transcript: {
        plain: null,
        error: null,
        auditStatus: "pending" as const,
        auditedMd: null,
      },
    }
    expect(shouldSkip(v, "arbeit")).toBe("transcript_missing")
  })

  test("skip wenn transcript Upstream-Error", () => {
    const v = {
      durationSec: 600,
      channel: { classification: "arbeit" } as const,
      transcript: {
        plain: "x",
        error: "yt-dlp fail",
        auditStatus: "pending" as const,
        auditedMd: null,
      },
    }
    expect(shouldSkip(v, "arbeit")).toBe("transcript_error_upstream")
  })

  test("Idempotenz: schon ok mit audited_md → skip null = no-op", () => {
    const v = {
      durationSec: 600,
      channel: { classification: "arbeit" } as const,
      transcript: {
        plain: "x",
        error: null,
        auditStatus: "ok" as const,
        auditedMd: "audited",
      },
    }
    expect(shouldSkip(v, "arbeit")).toBe("idempotent")
  })

  test("nicht skippen wenn alles passt + noch pending", () => {
    const v = {
      durationSec: 600,
      channel: { classification: "arbeit" } as const,
      transcript: {
        plain: "x",
        error: null,
        auditStatus: "pending" as const,
        auditedMd: null,
      },
    }
    expect(shouldSkip(v, "arbeit")).toBeNull()
  })

  test("Nicht idempotent: error_pass3_display_title mit audited_md", () => {
    const v = {
      durationSec: 600,
      channel: { classification: "arbeit" } as const,
      transcript: {
        plain: "x",
        error: null,
        auditStatus: "error_pass3_display_title" as const,
        auditedMd: "audited",
      },
    }
    expect(shouldSkip(v, "arbeit")).toBeNull()
  })

  test("Nicht idempotent: error_pass4_description mit audited_md", () => {
    const v = {
      durationSec: 600,
      channel: { classification: "arbeit" } as const,
      transcript: {
        plain: "x",
        error: null,
        auditStatus: "error_pass4_description" as const,
        auditedMd: "audited",
      },
    }
    expect(shouldSkip(v, "arbeit")).toBeNull()
  })

  test("Nicht idempotent: error_pass5_summary_long mit audited_md", () => {
    const v = {
      durationSec: 600,
      channel: { classification: "arbeit" } as const,
      transcript: {
        plain: "x",
        error: null,
        auditStatus: "error_pass5_summary_long" as const,
        auditedMd: "audited",
      },
    }
    expect(shouldSkip(v, "arbeit")).toBeNull()
  })

  test("Nicht idempotent: error_stub_write mit audited_md", () => {
    const v = {
      durationSec: 600,
      channel: { classification: "arbeit" } as const,
      transcript: {
        plain: "x",
        error: null,
        auditStatus: "error_stub_write" as const,
        auditedMd: "audited",
      },
    }
    expect(shouldSkip(v, "arbeit")).toBeNull()
  })

  test("Regression: ok mit audited_md bleibt idempotent", () => {
    const v = {
      durationSec: 600,
      channel: { classification: "arbeit" } as const,
      transcript: {
        plain: "x",
        error: null,
        auditStatus: "ok" as const,
        auditedMd: "audited",
      },
    }
    expect(shouldSkip(v, "arbeit")).toBe("idempotent")
  })
})

describe("enrichVideo", () => {
  beforeEach(() => {
    resetPassMocks()
  })

  test("Critical-Phase ruft runPass1Extended auf (nicht mehr Smart-Partial über runPass1)", async () => {
    const video = makeMockVideo({
      transcript: {
        plain: "transcript-text",
        error: null,
        auditStatus: "pending",
        auditedMd: "existing audited markdown",
      },
    })
    const prisma = makeMockPrisma(video)

    const result = await enrichVideo({
      prisma,
      youtubeId: "test-id",
      classification: "arbeit",
      runId: "run-1",
      stubPath: async () => null,
    })

    // runPass1 wird nicht mehr verwendet — nur runPass1Extended in der Critical-Phase
    expect(runPass1).not.toHaveBeenCalled()
    expect(runPass1Extended).toHaveBeenCalled()
    // Pass 2 läuft jetzt in Background-Phase
    expect(runPass2).toHaveBeenCalled()
    // Pass 3 erhält das auditedMd aus runPass1Extended (nicht mehr das existierende)
    expect(runPass3).toHaveBeenCalledWith(
      "Test-Titel",
      "Test-Description",
      "pass1-extended-out",
    )
    expect(runPass4).toHaveBeenCalled()
    expect(runPass5).toHaveBeenCalled()
    expect(result.status).toBe("ok")
  })

  test("Voll-Pfad: Pass 1 Extended in Critical-Phase, Pass 2 in Background-Phase aufgerufen", async () => {
    const video = makeMockVideo()
    const prisma = makeMockPrisma(video)

    await enrichVideo({
      prisma,
      youtubeId: "test-id",
      classification: "arbeit",
      runId: "run-1",
      stubPath: async () => null,
    })

    // Critical-Phase: runPass1Extended (nicht runPass1)
    expect(runPass1Extended).toHaveBeenCalled()
    expect(runPass1).not.toHaveBeenCalled()
    // Background-Phase: runPass2 mit auditedMd aus Pass 1 Extended
    expect(runPass2).toHaveBeenCalledWith("pass1-extended-out")
  })

  test("Pass 3 wirft → status error_pass1 (Critical-Phase-Sammelbecken)", async () => {
    ;(runPass3 as MockFn).mockRejectedValue(new Error("p3 broke"))
    const video = makeMockVideo({
      transcript: {
        plain: "x",
        error: null,
        auditStatus: "pending",
        auditedMd: "md",
      },
    })
    const prisma = makeMockPrisma(video)
    const result = await enrichVideo({
      prisma,
      youtubeId: "test-id",
      classification: "arbeit",
      runId: "r1",
      stubPath: async () => null,
    })
    // Pass 3 ist jetzt im Critical-try-Block → Fehler wird als error_pass1 zurückgegeben
    expect(result.status).toBe("error_pass1")
    expect(prisma.transcript.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ auditStatus: "error_pass1" }),
      }),
    )
  })

  test("Pass 4 wirft → status error_pass1 (Critical-Phase-Sammelbecken)", async () => {
    ;(runPass4 as MockFn).mockRejectedValue(new Error("p4 broke"))
    const video = makeMockVideo({
      transcript: {
        plain: "x",
        error: null,
        auditStatus: "pending",
        auditedMd: "md",
      },
    })
    const prisma = makeMockPrisma(video)
    const result = await enrichVideo({
      prisma,
      youtubeId: "test-id",
      classification: "arbeit",
      runId: "r1",
      stubPath: async () => null,
    })
    // Pass 4 ist jetzt im Critical-try-Block → Fehler wird als error_pass1 zurückgegeben
    expect(result.status).toBe("error_pass1")
  })

  test("Pass 5 wirft → status error_pass5_summary_long (granularer Background-Status)", async () => {
    ;(runPass5 as MockFn).mockRejectedValue(new Error("p5 broke"))
    const video = makeMockVideo({
      transcript: {
        plain: "x",
        error: null,
        auditStatus: "pending",
        auditedMd: "md",
      },
    })
    const prisma = makeMockPrisma(video)
    const result = await enrichVideo({
      prisma,
      youtubeId: "test-id",
      classification: "arbeit",
      runId: "r1",
      stubPath: async () => null,
    })
    // Pass 5 ist in enrichVideoBackground → granularer Status error_pass5_summary_long
    expect(result.status).toBe("error_pass5_summary_long")
  })

  test("Stub-Fehler in Critical-Phase → status error_pass1", async () => {
    const video = makeMockVideo({
      transcript: {
        plain: "x",
        error: null,
        auditStatus: "pending",
        auditedMd: "md",
      },
    })
    const prisma = makeMockPrisma(video)
    const result = await enrichVideo({
      prisma,
      youtubeId: "test-id",
      classification: "arbeit",
      runId: "r1",
      stubPath: async () => {
        throw new Error("fs broke")
      },
    })
    // stubPath wird in enrichVideoCritical (Pass 0) aufgerufen — Fehler landet im critical-catch
    expect(result.status).toBe("error_pass1")
  })

  test("Finaler ok-Update setzt audit_error=NULL", async () => {
    const video = makeMockVideo({
      transcript: {
        plain: "x",
        error: null,
        auditStatus: "pending",
        auditedMd: "md",
      },
    })
    const prisma = makeMockPrisma(video)
    await enrichVideo({
      prisma,
      youtubeId: "test-id",
      classification: "arbeit",
      runId: "r1",
      stubPath: async () => null,
    })
    expect(prisma.transcript.update).toHaveBeenLastCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ auditStatus: "ok", auditError: null }),
      }),
    )
  })
})

describe("enrichVideoCritical", () => {
  beforeEach(() => {
    resetPassMocks()
  })

  test("setzt auditStatus auf critical_ok bei Erfolg", async () => {
    const video = makeMockVideo()
    const prisma = makeMockPrisma(video)

    const result = await enrichVideoCritical({
      prisma,
      youtubeId: "test-id",
      classification: "arbeit",
      runId: "run-1",
      stubPath: async () => null,
    })

    expect(result.status).toBe("critical_ok")
    expect(result.skipped).toBeNull()
    expect(result.displayTitle).toBe("display title")
    expect(result.descriptionShort).toBe("description three sentences")
    expect(result.namedEntities).toEqual(["EntityA"])
    expect(prisma.transcript.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          auditStatus: "critical_ok",
          namedEntities: ["EntityA"],
        }),
      }),
    )
    expect(prisma.video.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          displayTitle: "display title",
          descriptionShort: "description three sentences",
        }),
      }),
    )
  })

  test("respektiert bypassClassificationCheck — mixed-Channel läuft durch", async () => {
    const video = makeMockVideo({ channel: { classification: "mixed" } })
    const prisma = makeMockPrisma(video)

    const result = await enrichVideoCritical({
      prisma,
      youtubeId: "test-id",
      classification: "arbeit",
      runId: "run-1",
      stubPath: async () => null,
      bypassClassificationCheck: true,
    })

    expect(result.skipped).not.toBe("skip_classification_mismatch")
    expect(result.status).toBe("critical_ok")
  })

  test("ohne bypassClassificationCheck — mixed-Channel skipped wie heute", async () => {
    const video = makeMockVideo({ channel: { classification: "mixed" } })
    const prisma = makeMockPrisma(video)

    const result = await enrichVideoCritical({
      prisma,
      youtubeId: "test-id",
      classification: "arbeit",
      runId: "run-1",
      stubPath: async () => null,
    })

    expect(result.skipped).toBe("skip_classification_mismatch")
    expect(result.status).toBe("skip_classification_mismatch")
  })

  test("setzt error_pass1 wenn Pass 1 wirft", async () => {
    ;(runPass1Extended as MockFn).mockRejectedValue(new Error("pass1 broke"))
    const video = makeMockVideo()
    const prisma = makeMockPrisma(video)

    const result = await enrichVideoCritical({
      prisma,
      youtubeId: "test-id",
      classification: "arbeit",
      runId: "run-1",
      stubPath: async () => null,
    })

    expect(result.status).toBe("error_pass1")
    expect(prisma.transcript.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ auditStatus: "error_pass1" }),
      }),
    )
  })

  test("parallelisiert Pass 3 + Pass 4 via Promise.all", async () => {
    let pass3Started = false
    let pass3Finished = false
    let pass4Started = false
    let pass4StartedWhilePass3Running = false

    ;(runPass3 as MockFn).mockImplementation(async () => {
      pass3Started = true
      await new Promise<void>((r) => setTimeout(r, 20))
      pass3Finished = true
      return "display title"
    })
    ;(runPass4 as MockFn).mockImplementation(async () => {
      pass4Started = true
      // Bei echter Parallelisierung (Promise.all) wird Pass 4 dispatcht,
      // während Pass 3 noch läuft — nicht erst nachdem Pass 3 aufgelöst hat.
      if (pass3Started && !pass3Finished) {
        pass4StartedWhilePass3Running = true
      }
      await new Promise<void>((r) => setTimeout(r, 10))
      return "description three sentences"
    })

    const video = makeMockVideo()
    const prisma = makeMockPrisma(video)

    await enrichVideoCritical({
      prisma,
      youtubeId: "test-id",
      classification: "arbeit",
      runId: "run-1",
      stubPath: async () => null,
    })

    // Deterministischer Parallelitäts-Nachweis ohne fragile Wall-Clock-
    // Schwelle (die auf langsamer CI-Hardware flaky ist): Pass 4 lief an,
    // bevor Pass 3 fertig war. Bei serieller Ausführung wäre Pass 3 bereits
    // beendet, bevor Pass 4 überhaupt startet.
    expect(pass3Started).toBe(true)
    expect(pass4Started).toBe(true)
    expect(pass4StartedWhilePass3Running).toBe(true)
  })
})

describe("enrichVideoBackground", () => {
  beforeEach(() => {
    resetPassMocks()
  })

  function makeMockPrismaWithTranscript(transcript: any) {
    return {
      video: {
        findUniqueOrThrow: mock(async () => makeMockVideo()),
        update: mock(async () => ({})),
      },
      transcript: {
        findUniqueOrThrow: mock(async () => transcript),
        update: mock(async () => ({})),
      },
      vault: {
        findUnique: mock(async () => ({
          name: "user-kb-vault",
          rootPath: "/tmp/nonexistent-kb-vault",
        })),
      },
    } as any
  }

  test("setzt auditStatus auf ok bei Erfolg", async () => {
    const transcript = {
      youtubeId: "test-id",
      auditStatus: "critical_ok",
      auditedMd: "audited md content",
    }
    const prisma = makeMockPrismaWithTranscript(transcript)

    const result = await enrichVideoBackground({
      prisma,
      youtubeId: "test-id",
      classification: "arbeit",
      runId: "run-1",
      stubPath: async () => null,
    })

    expect(result.status).toBe("ok")
    expect(prisma.transcript.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ auditStatus: "ok" }),
      }),
    )
  })

  test("Pre-Condition: wenn nicht critical_ok → no-op", async () => {
    const transcript = {
      youtubeId: "test-id",
      auditStatus: "pending",
      auditedMd: null,
    }
    const prisma = makeMockPrismaWithTranscript(transcript)

    const result = await enrichVideoBackground({
      prisma,
      youtubeId: "test-id",
      classification: "arbeit",
      runId: "run-1",
      stubPath: async () => null,
    })

    expect(result.status).toBe("pending")
    expect(prisma.transcript.update).not.toHaveBeenCalled()
  })

  test("setzt error_pass2 wenn Pass 2 wirft", async () => {
    ;(runPass2 as MockFn).mockRejectedValue(new Error("pass2 broke"))
    const transcript = {
      youtubeId: "test-id",
      auditStatus: "critical_ok",
      auditedMd: "md",
    }
    const prisma = makeMockPrismaWithTranscript(transcript)

    const result = await enrichVideoBackground({
      prisma,
      youtubeId: "test-id",
      classification: "arbeit",
      runId: "run-1",
      stubPath: async () => null,
    })

    expect(result.status).toBe("error_pass2")
    expect(prisma.transcript.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ auditStatus: "error_pass2" }),
      }),
    )
  })

  test("setzt error_pass5_summary_long wenn Pass 5 wirft", async () => {
    ;(runPass5 as MockFn).mockRejectedValue(new Error("pass5 broke"))
    const transcript = {
      youtubeId: "test-id",
      auditStatus: "critical_ok",
      auditedMd: "md",
    }
    const prisma = makeMockPrismaWithTranscript(transcript)

    const result = await enrichVideoBackground({
      prisma,
      youtubeId: "test-id",
      classification: "arbeit",
      runId: "run-1",
      stubPath: async () => null,
    })

    expect(result.status).toBe("error_pass5_summary_long")
    expect(prisma.transcript.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          auditStatus: "error_pass5_summary_long",
        }),
      }),
    )
  })

  test("setzt error_stub_write wenn Stub-Update wirft", async () => {
    const transcript = {
      youtubeId: "test-id",
      auditStatus: "critical_ok",
      auditedMd: "md",
    }
    const prisma = makeMockPrismaWithTranscript(transcript)

    const result = await enrichVideoBackground({
      prisma,
      youtubeId: "test-id",
      classification: "arbeit",
      runId: "run-1",
      stubPath: async () => {
        throw new Error("fs broke")
      },
    })

    expect(result.status).toBe("error_stub_write")
    expect(prisma.transcript.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ auditStatus: "error_stub_write" }),
      }),
    )
  })

  test("Stub-Write setzt youtube_id ins Frontmatter", async () => {
    // Echtes tempdir (kein git-Repo) → commitFile failt non-fatal,
    // Mock von node:fs/promises würde globale Test-Suite stören.
    const tmp = mkdtempSync(join(tmpdir(), "enrich-fm-test-"))
    try {
      const absPath = join(tmp, "stub.md")
      await fsWriteFile(
        absPath,
        "---\ndisplay_title: Alt\n---\n\n# Alt Body\n",
        "utf-8",
      )
      const transcript = {
        youtubeId: "test-yt-id-fm",
        auditStatus: "critical_ok",
        auditedMd: "md",
      }
      const prisma = makeMockPrismaWithTranscript(transcript)
      ;(prisma.video.findUniqueOrThrow as MockFn).mockResolvedValue(
        makeMockVideo({
          youtubeId: "test-yt-id-fm",
          displayTitle: "Mein Display Title",
          descriptionShort: "Kurze Description.",
        }),
      )

      const result = await enrichVideoBackground({
        prisma,
        youtubeId: "test-yt-id-fm",
        classification: "arbeit",
        runId: "run-fm",
        stubPath: async () => ({
          absPath,
          vaultRoot: tmp,
          relPath: "stub.md",
        }),
      })

      expect(result.status).toBe("ok")
      const writtenContent = await fsReadFile(absPath, "utf-8")
      expect(writtenContent).toContain("youtube_id: test-yt-id-fm")
    } finally {
      rmSync(tmp, { recursive: true, force: true })
    }
  })
})

describe("enrichVideo (Public-API-Wrapper bleibt kompatibel)", () => {
  beforeEach(() => {
    resetPassMocks()
  })

  test("ruft Critical dann Background auf und returnt ok", async () => {
    const video = makeMockVideo()
    const prisma = {
      video: {
        findUniqueOrThrow: mock(async () => video),
        update: mock(async () => ({})),
      },
      transcript: {
        findUniqueOrThrow: mock(async () => ({
          youtubeId: "test-id",
          auditStatus: "critical_ok",
          auditedMd: "pass1-extended-out",
        })),
        update: mock(async () => ({})),
      },
    } as any

    const result = await enrichVideo({
      prisma,
      youtubeId: "test-id",
      classification: "arbeit",
      runId: "run-1",
      stubPath: async () => null,
    })

    expect(result).toHaveProperty("skipped")
    expect(result).toHaveProperty("status")
    expect(result.status).toBe("ok")
    expect(result.skipped).toBeNull()
  })

  test("returnt {skipped, status}-Form bei skip", async () => {
    const video = makeMockVideo({ channel: { classification: "privat" } })
    const prisma = makeMockPrisma(video)

    const result = await enrichVideo({
      prisma,
      youtubeId: "test-id",
      classification: "arbeit",
      runId: "run-1",
      stubPath: async () => null,
    })

    expect(result).toHaveProperty("skipped")
    expect(result).toHaveProperty("status")
    expect(result.skipped).toBe("skip_classification_mismatch")
  })
})
