import { describe, expect, it } from "bun:test"
import { autoClassify, formatAutoNote } from "./channel-classifier"

describe("autoClassify (R11)", () => {
  it("classifies as 'arbeit' when only shared-stub exists", () => {
    expect(autoClassify(new Set(["stefans-vault/shared"]))).toBe("arbeit")
  })

  it("classifies as 'privat' when only private-stub exists", () => {
    expect(autoClassify(new Set(["stefans-vault/private"]))).toBe("privat")
  })

  it("returns null when stubs in BOTH shared and private exist (HITL — ambig)", () => {
    expect(
      autoClassify(new Set(["stefans-vault/shared", "stefans-vault/private"])),
    ).toBeNull()
  })

  it("classifies as 'arbeit' when only user-kb-vault stub exists (non-private => arbeit)", () => {
    expect(autoClassify(new Set(["user-kb-vault"]))).toBe("arbeit")
  })

  it("returns null when private + non-private mix exists (HITL — ambig)", () => {
    expect(
      autoClassify(new Set(["stefans-vault/private", "user-kb-vault"])),
    ).toBeNull()
  })

  it("classifies as 'arbeit' when stubs in shared + user-kb-vault (no private)", () => {
    expect(
      autoClassify(new Set(["stefans-vault/shared", "user-kb-vault"])),
    ).toBe("arbeit")
  })

  it("returns null when the stub-vault set is empty (HITL Pflicht)", () => {
    expect(autoClassify(new Set())).toBeNull()
  })
})

describe("formatAutoNote", () => {
  it("emits a deterministic single-vault note", () => {
    expect(formatAutoNote(new Set(["stefans-vault/shared"]))).toBe(
      "auto: stubs in stefans-vault/shared",
    )
  })

  it("sorts multiple vaults alphabetically (idempotent reproduction)", () => {
    expect(
      formatAutoNote(
        new Set(["stefans-vault/shared", "stefans-vault/private"]),
      ),
    ).toBe("auto: stubs in stefans-vault/private, stefans-vault/shared")
  })
})
