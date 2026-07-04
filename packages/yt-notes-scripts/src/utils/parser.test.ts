// Logic derived from sundevista/youtube-template@7470a90dfab61fde318b2b03d471c54932faacb2, MIT License
// https://github.com/sundevista/youtube-template/blob/master/LICENSE

import { describe, test, expect } from "bun:test"
import { parseVideoId, parseChapters, parseISODuration } from "./parser"

describe("parseVideoId", () => {
  test.each([
    ["https://www.youtube.com/watch?v=abc12345xyz", "abc12345xyz"],
    ["https://youtu.be/abc12345xyz", "abc12345xyz"],
    ["https://www.youtube.com/embed/abc12345xyz", "abc12345xyz"],
    ["https://www.youtube.com/v/abc12345xyz", "abc12345xyz"],
    ["https://www.youtube.com/shorts/abc12345xyz", "abc12345xyz"],
    ["https://youtu.be/abc12345xyz?t=42", "abc12345xyz"],
    ["https://www.youtube.com/watch?v=abc12345xyz&list=PL123", "abc12345xyz"],
  ])("extracts video id from %s", (url, expected) => {
    expect(parseVideoId(url)).toBe(expected)
  })

  test("returns null for garbage input", () => {
    expect(parseVideoId("not-a-url")).toBeNull()
  })

  test("returns null for empty string", () => {
    expect(parseVideoId("")).toBeNull()
  })

  test("returns null for non-youtube url", () => {
    expect(parseVideoId("https://vimeo.com/123456")).toBeNull()
  })
})

describe("parseChapters", () => {
  test("returns empty array for empty description", () => {
    expect(parseChapters("")).toEqual([])
  })

  test("parses single chapter at 0:00", () => {
    expect(parseChapters("0:00 Intro")).toEqual([
      { timestamp: "0:00", title: "Intro" },
    ])
  })

  test("parses HH:MM:SS format", () => {
    expect(parseChapters("1:23:45 Late chapter")).toEqual([
      { timestamp: "1:23:45", title: "Late chapter" },
    ])
  })

  test("parses M:SS format", () => {
    expect(parseChapters("5:30 Topic")).toEqual([
      { timestamp: "5:30", title: "Topic" },
    ])
  })

  test("preserves multiple spaces in title", () => {
    expect(parseChapters("5:30 Multiple   spaces here")).toEqual([
      { timestamp: "5:30", title: "Multiple   spaces here" },
    ])
  })

  test("parses multiple chapters across lines", () => {
    const desc = "0:00 Intro\n2:30 Body\n5:00 Outro"
    expect(parseChapters(desc)).toEqual([
      { timestamp: "0:00", title: "Intro" },
      { timestamp: "2:30", title: "Body" },
      { timestamp: "5:00", title: "Outro" },
    ])
  })
})

describe("parseISODuration", () => {
  test("PT1H30M5S → 5405s formatted 1:30:05", () => {
    expect(parseISODuration("PT1H30M5S")).toEqual({
      totalSeconds: 5405,
      formatted: "1:30:05",
    })
  })

  test("PT45M → 2700s formatted 45:00", () => {
    expect(parseISODuration("PT45M")).toEqual({
      totalSeconds: 2700,
      formatted: "45:00",
    })
  })

  test("PT15S → 15s formatted 0:15", () => {
    expect(parseISODuration("PT15S")).toEqual({
      totalSeconds: 15,
      formatted: "0:15",
    })
  })

  test("PT0S → 0s formatted 0:00", () => {
    expect(parseISODuration("PT0S")).toEqual({
      totalSeconds: 0,
      formatted: "0:00",
    })
  })
})
