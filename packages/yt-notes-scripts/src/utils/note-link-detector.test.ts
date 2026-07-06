import { describe, test, expect } from "bun:test"
import { isStubPath, extractChannelFromStubPath } from "./note-link-detector"

const SHARED_ROOT =
  "/Users/hoschi/Library/CloudStorage/Dropbox/obsidian-test/test/shared"

describe("isStubPath", () => {
  test("recognizes a stub path under <vaultRoot>/youtube/", () => {
    expect(
      isStubPath(`${SHARED_ROOT}/youtube/MyChannel/title.md`, SHARED_ROOT),
    ).toBe(true)
  })

  test("rejects a path outside <vaultRoot>", () => {
    expect(isStubPath("/some/other/place/youtube/x/y.md", SHARED_ROOT)).toBe(
      false,
    )
  })

  test("rejects a path inside <vaultRoot> but outside youtube/", () => {
    expect(
      isStubPath(`${SHARED_ROOT}/blog/2024/youtube-stuff.md`, SHARED_ROOT),
    ).toBe(false)
  })

  test("returns false on empty filePath", () => {
    expect(isStubPath("", SHARED_ROOT)).toBe(false)
  })

  test("rejects deeper-nested paths that don't have youtube/ as first segment", () => {
    expect(
      isStubPath(`${SHARED_ROOT}/projects/foo/youtube/bar/baz.md`, SHARED_ROOT),
    ).toBe(false)
  })
})

describe("extractChannelFromStubPath", () => {
  test("extracts plain channel-name from canonical stub path", () => {
    expect(
      extractChannelFromStubPath(
        `${SHARED_ROOT}/youtube/MyChannel/title.md`,
        SHARED_ROOT,
      ),
    ).toBe("MyChannel")
  })

  test("URL-decodes spaces in channel-name segment", () => {
    expect(
      extractChannelFromStubPath(
        `${SHARED_ROOT}/youtube/Channel%20With%20Spaces/title.md`,
        SHARED_ROOT,
      ),
    ).toBe("Channel With Spaces")
  })

  test("returns null when filePath is not a stub path", () => {
    expect(
      extractChannelFromStubPath(`${SHARED_ROOT}/blog.md`, SHARED_ROOT),
    ).toBeNull()
  })
})
