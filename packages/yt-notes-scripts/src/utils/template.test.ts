// Logic derived from sundevista/youtube-template@7470a90dfab61fde318b2b03d471c54932faacb2, MIT License
// https://github.com/sundevista/youtube-template/blob/master/LICENSE

import { describe, test, expect } from "bun:test"
import { processTemplate, type TemplateSettings } from "./template"

const SETTINGS: TemplateSettings = {
  chapterFormat: ' - "{{chapter}}"\n',
  hashtagFormat: ' - "#{{hashtag}}"\n',
}

describe("processTemplate", () => {
  test("simple key replacement", () => {
    expect(
      processTemplate("Hello {{name}}!", { name: "world" }, SETTINGS),
    ).toBe("Hello world!")
  })

  test("unknown key → empty string", () => {
    expect(processTemplate("X={{missing}}", {}, SETTINGS)).toBe("X=")
  })

  test("multiple replacements", () => {
    expect(
      processTemplate("{{a}} and {{b}}", { a: "one", b: "two" }, SETTINGS),
    ).toBe("one and two")
  })

  test("chapters as string[] → format applied per item", () => {
    const data = { chapters: ["0:00 Intro", "1:00 Body"] }
    const out = processTemplate("Chapters:\n{{chapters}}", data, SETTINGS)
    expect(out).toBe('Chapters:\n - "0:00 Intro"\n - "1:00 Body"\n')
  })

  test("hashtags as string[] → format applied per item", () => {
    const data = { hashtags: ["typescript", "bun"] }
    const out = processTemplate("Tags:\n{{hashtags}}", data, SETTINGS)
    expect(out).toBe('Tags:\n - "#typescript"\n - "#bun"\n')
  })

  test("empty chapter array → empty string", () => {
    expect(processTemplate("X:{{chapters}}", { chapters: [] }, SETTINGS)).toBe(
      "X:",
    )
  })

  test("empty data object → all keys become empty", () => {
    expect(processTemplate("{{x}}-{{y}}", {}, SETTINGS)).toBe("-")
  })
})
