import { spawn } from "node:child_process"
import { join } from "node:path"

export interface CommitResult {
  committed: boolean
  reason?: string // Nur gesetzt wenn committed=false (warum nicht committed)
}

const GIT_TIMEOUT_MS = 30_000

async function runGit(
  args: string[],
  cwd: string,
  timeoutMs = GIT_TIMEOUT_MS,
): Promise<{ exitCode: number; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    const proc = spawn("git", ["-C", cwd, ...args], {
      stdio: ["ignore", "pipe", "pipe"],
    })
    let stdout = ""
    let stderr = ""
    let settled = false

    const settle = (result: {
      exitCode: number
      stdout: string
      stderr: string
    }) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      resolve(result)
    }

    const timer = setTimeout(() => {
      proc.kill()
      settle({
        exitCode: 1,
        stdout,
        stderr: `git timed out after ${timeoutMs}ms`,
      })
    }, timeoutMs).unref()

    proc.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString("utf-8")
    })
    proc.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString("utf-8")
    })
    proc.on("close", (code) => {
      settle({ exitCode: code ?? 1, stdout, stderr })
    })
    proc.on("error", (err) => {
      settle({
        exitCode: 1,
        stdout: "",
        stderr: err.message,
      })
    })
  })
}

/**
 * Committet eine einzelne Datei wenn dirty oder untracked. Best-effort:
 * jeder Fehler (kein git-Repo, git nicht installiert, commit fehlgeschlagen)
 * wird als reason zurückgegeben, nie thrown.
 */
export async function commitFile(
  vaultRoot: string,
  relPath: string,
  message: string,
): Promise<CommitResult> {
  try {
    const absPath = join(vaultRoot, relPath)
    const status = await runGit(
      ["status", "--porcelain", "--", absPath],
      vaultRoot,
    )
    if (status.exitCode !== 0)
      return {
        committed: false,
        reason: `git status exit ${status.exitCode}: ${status.stderr.slice(0, 200)}`,
      }
    if (status.stdout.trim() === "")
      return { committed: false, reason: "no changes" }

    const add = await runGit(["add", "--", absPath], vaultRoot)
    if (add.exitCode !== 0)
      return {
        committed: false,
        reason: `git add exit ${add.exitCode}: ${add.stderr.slice(0, 200)}`,
      }

    const commit = await runGit(
      ["commit", "-m", message, "--", absPath],
      vaultRoot,
    )
    if (commit.exitCode !== 0)
      return {
        committed: false,
        reason: `git commit exit ${commit.exitCode}: ${commit.stderr.slice(0, 200)}`,
      }

    return { committed: true }
  } catch (e) {
    return {
      committed: false,
      reason: e instanceof Error ? e.message : String(e),
    }
  }
}

/**
 * Committet alle dirty/untracked Files unter pathSpec (relativ zum vaultRoot).
 * Best-effort wie commitFile. Pre-Run-Cleanup-Pattern: vor einem Pipeline-Lauf
 * einmal aufrufen, damit Pipeline-Commits sich nicht mit fremden Edits
 * vermischen. pathSpec ist Pflicht, damit der Aufrufer den Cleanup-Scope
 * explizit auf Pipeline-relevante Files (z.B. "youtube/**") einschränken muss
 * und nicht versehentlich Repo-weit committet.
 */
export async function commitAllInVault(
  vaultRoot: string,
  message: string,
  pathSpec: string,
): Promise<CommitResult> {
  try {
    const status = await runGit(
      ["status", "--porcelain", "--", pathSpec],
      vaultRoot,
    )
    if (status.exitCode !== 0)
      return {
        committed: false,
        reason: `git status exit ${status.exitCode}: ${status.stderr.slice(0, 200)}`,
      }
    if (status.stdout.trim() === "")
      return { committed: false, reason: "no changes" }

    const add = await runGit(["add", "--", pathSpec], vaultRoot)
    if (add.exitCode !== 0)
      return {
        committed: false,
        reason: `git add exit ${add.exitCode}: ${add.stderr.slice(0, 200)}`,
      }

    const commit = await runGit(
      ["commit", "-m", message, "--", pathSpec],
      vaultRoot,
    )
    if (commit.exitCode !== 0)
      return {
        committed: false,
        reason: `git commit exit ${commit.exitCode}: ${commit.stderr.slice(0, 200)}`,
      }

    return { committed: true }
  } catch (e) {
    return {
      committed: false,
      reason: e instanceof Error ? e.message : String(e),
    }
  }
}
