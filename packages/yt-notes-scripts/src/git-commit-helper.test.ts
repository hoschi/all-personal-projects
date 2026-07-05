import { expect, test, beforeEach, afterEach } from "bun:test"
import { spawn } from "bun"
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from "node:fs"
import { join } from "node:path"
import { tmpdir } from "node:os"
import { commitFile, commitAllInVault } from "./git-commit-helper"

let repo: string

async function initRepo(): Promise<string> {
  const path = mkdtempSync(join(tmpdir(), "git-helper-test-"))
  await spawn(["git", "-C", path, "init", "-q", "-b", "main"]).exited
  await spawn(["git", "-C", path, "config", "user.email", "test@test.local"])
    .exited
  await spawn(["git", "-C", path, "config", "user.name", "Test"]).exited
  await spawn(["git", "-C", path, "config", "commit.gpgsign", "false"]).exited
  // Initial commit damit HEAD existiert
  writeFileSync(join(path, ".gitignore"), "")
  await spawn(["git", "-C", path, "add", ".gitignore"]).exited
  await spawn(["git", "-C", path, "commit", "-q", "-m", "init"]).exited
  return path
}

async function gitLog(repo: string): Promise<string[]> {
  const proc = spawn(["git", "-C", repo, "log", "--format=%s"], {
    stdout: "pipe",
  })
  await proc.exited
  const out = await new Response(proc.stdout).text()
  return out.trim().split("\n").filter(Boolean)
}

beforeEach(async () => {
  repo = await initRepo()
})
afterEach(() => {
  rmSync(repo, { recursive: true, force: true })
})

test("commitFile committet eine neue Datei", async () => {
  mkdirSync(join(repo, "youtube"), { recursive: true })
  writeFileSync(join(repo, "youtube/foo.md"), "hello")
  const result = await commitFile(repo, "youtube/foo.md", "test commit")
  expect(result.committed).toBe(true)
  const log = await gitLog(repo)
  expect(log[0]).toBe("test commit")
})

test("commitFile no-op wenn Datei nicht dirty", async () => {
  const result = await commitFile(repo, "youtube/foo.md", "test commit")
  expect(result.committed).toBe(false)
  expect(result.reason).toBe("no changes")
})

test("commitFile kein throw wenn vaultRoot kein git-Repo ist", async () => {
  const nonRepo = mkdtempSync(join(tmpdir(), "no-git-"))
  writeFileSync(join(nonRepo, "foo.md"), "hi")
  const result = await commitFile(nonRepo, "foo.md", "test")
  expect(result.committed).toBe(false)
  expect(result.reason).toContain("git status exit")
  rmSync(nonRepo, { recursive: true, force: true })
})

test("commitFile committet nur die spezifizierte Datei (nicht andere dirty Files)", async () => {
  writeFileSync(join(repo, "other.md"), "other")
  writeFileSync(join(repo, "target.md"), "target")
  const result = await commitFile(repo, "target.md", "only target")
  expect(result.committed).toBe(true)
  // other.md sollte noch untracked sein
  const status = spawn(["git", "-C", repo, "status", "--porcelain"], {
    stdout: "pipe",
  })
  await status.exited
  const out = await new Response(status.stdout).text()
  expect(out).toContain("other.md")
  expect(out).not.toContain("target.md")
})

test("commitAllInVault committet alle Files unter pathSpec, lässt andere dirty Files in Ruhe", async () => {
  mkdirSync(join(repo, "youtube"), { recursive: true })
  mkdirSync(join(repo, "sonstwas"), { recursive: true })
  writeFileSync(join(repo, "youtube/foo.md"), "foo")
  writeFileSync(join(repo, "sonstwas/bar.md"), "bar")

  const result = await commitAllInVault(repo, "cleanup youtube", "youtube/**")
  expect(result.committed).toBe(true)
  const log = await gitLog(repo)
  expect(log[0]).toBe("cleanup youtube")

  // sonstwas/ muss noch dirty/untracked sein, youtube/ nicht mehr
  const status = spawn(["git", "-C", repo, "status", "--porcelain", "-uall"], {
    stdout: "pipe",
  })
  await status.exited
  const out = await new Response(status.stdout).text()
  expect(out).toContain("sonstwas/bar.md")
  expect(out).not.toContain("youtube/foo.md")
})

test("commitAllInVault no-op wenn nichts unter pathSpec dirty ist (aber andere Files dirty sind)", async () => {
  mkdirSync(join(repo, "sonstwas"), { recursive: true })
  writeFileSync(join(repo, "sonstwas/bar.md"), "bar")

  const result = await commitAllInVault(repo, "cleanup youtube", "youtube/**")
  expect(result.committed).toBe(false)
  expect(result.reason).toBe("no changes")
})

test("commitAllInVault no-op wenn Vault komplett clean", async () => {
  const result = await commitAllInVault(repo, "cleanup youtube", "youtube/**")
  expect(result.committed).toBe(false)
  expect(result.reason).toBe("no changes")
})

test("commitAllInVault kein throw wenn vaultRoot kein git-Repo ist", async () => {
  const nonRepo = mkdtempSync(join(tmpdir(), "no-git-"))
  const result = await commitAllInVault(nonRepo, "test", "youtube/**")
  expect(result.committed).toBe(false)
  expect(result.reason).toContain("git status exit")
  rmSync(nonRepo, { recursive: true, force: true })
})
