// Logic derived from sundevista/youtube-template@7470a90dfab61fde318b2b03d471c54932faacb2, MIT License
// https://github.com/sundevista/youtube-template/blob/master/LICENSE

import { describe, test, expect } from "bun:test"
import { encodeObsidianPath, buildObsidianUrl } from "./obsidian-url"

describe("encodeObsidianPath", () => {
  test("spaces become %20", () => {
    expect(encodeObsidianPath("My Notes/My File.md")).toBe(
      "My%20Notes/My%20File.md",
    )
  })

  test("slashes remain as path separators", () => {
    expect(encodeObsidianPath("a/b/c.md")).toBe("a/b/c.md")
  })

  test("unicode lookalike (U+2024) is percent-encoded", () => {
    expect(encodeObsidianPath("foo․bar.md")).toBe("foo%E2%80%A4bar.md")
  })

  test("empty path → empty string", () => {
    expect(encodeObsidianPath("")).toBe("")
  })

  test("single segment path", () => {
    expect(encodeObsidianPath("README.md")).toBe("README.md")
  })

  test("literal percent character is encoded (input is raw)", () => {
    expect(encodeObsidianPath("name 50%.md")).toBe("name%2050%25.md")
  })
})

describe("buildObsidianUrl", () => {
  test("basic call with vault and path", () => {
    expect(buildObsidianUrl("test", "shared/notes/Hello World.md")).toBe(
      "obsidian://open?vault=test&file=shared/notes/Hello%20World.md",
    )
  })
})
