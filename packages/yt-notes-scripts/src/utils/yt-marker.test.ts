import { describe, test, expect } from "bun:test"
import {
  timestampToSeconds,
  buildMarkerUrl,
  linkifyTimestamps,
  TimestampParseError,
  YoutubeIdError,
} from "./yt-marker"

describe("timestampToSeconds", () => {
  test("M:SS", () => {
    expect(timestampToSeconds("0:00")).toBe(0)
    expect(timestampToSeconds("3:24")).toBe(204)
    expect(timestampToSeconds("9:59")).toBe(599)
  })

  test("MM:SS", () => {
    expect(timestampToSeconds("13:24")).toBe(804)
    expect(timestampToSeconds("59:59")).toBe(3599)
  })

  test("H:MM:SS", () => {
    expect(timestampToSeconds("1:23:45")).toBe(5025)
  })

  test("HH:MM:SS", () => {
    expect(timestampToSeconds("12:03:24")).toBe(43404)
  })

  test("wirft bei Sekunden > 59", () => {
    expect(() => timestampToSeconds("3:60")).toThrow(TimestampParseError)
    expect(() => timestampToSeconds("1:23:99")).toThrow(TimestampParseError)
  })

  test("wirft bei Minuten > 59 in H:MM:SS", () => {
    expect(() => timestampToSeconds("1:60:00")).toThrow(TimestampParseError)
  })

  test("wirft bei Format-Fehler", () => {
    expect(() => timestampToSeconds("3")).toThrow(TimestampParseError)
    expect(() => timestampToSeconds("324")).toThrow(TimestampParseError)
    expect(() => timestampToSeconds("3.24")).toThrow(TimestampParseError)
    expect(() => timestampToSeconds("")).toThrow(TimestampParseError)
  })
})

describe("buildMarkerUrl", () => {
  test("happy path", () => {
    expect(buildMarkerUrl("wv779vmyPVY", "3:24")).toBe(
      "https://www.youtube.com/watch?v=wv779vmyPVY&t=204s",
    )
    expect(buildMarkerUrl("dQw4w9WgXcQ", "1:23:45")).toBe(
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=5025s",
    )
    expect(buildMarkerUrl("dQw4w9WgXcQ", "0:00")).toBe(
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=0s",
    )
  })

  test("wirft bei ungültiger Video-ID", () => {
    expect(() => buildMarkerUrl("abc", "3:24")).toThrow(YoutubeIdError)
    expect(() => buildMarkerUrl("toolongvideoid", "3:24")).toThrow(
      YoutubeIdError,
    )
    expect(() => buildMarkerUrl("invalid!id$", "3:24")).toThrow(YoutubeIdError)
  })
})

describe("linkifyTimestamps", () => {
  const VID = "wv779vmyPVY"
  const URL_204 = `https://www.youtube.com/watch?v=${VID}&t=204s`
  const URL_0 = `https://www.youtube.com/watch?v=${VID}&t=0s`
  const URL_312 = `https://www.youtube.com/watch?v=${VID}&t=312s`

  test("verlinkt Sektion-Header mit em-dash", () => {
    const input = "### 3:24 — Intro"
    const expected = `### [3:24](${URL_204}) — Intro`
    expect(linkifyTimestamps(input, VID)).toBe(expected)
  })

  test("verlinkt Sektion-Header mit en-dash und doppeltem Bindestrich", () => {
    expect(linkifyTimestamps("### 0:00 – Intro", VID)).toBe(
      `### [0:00](${URL_0}) – Intro`,
    )
    expect(linkifyTimestamps("### 0:00 -- Intro", VID)).toBe(
      `### [0:00](${URL_0}) -- Intro`,
    )
  })

  test("lässt Sektion-Header ohne TS unverändert", () => {
    expect(linkifyTimestamps("### Inhalt", VID)).toBe("### Inhalt")
    expect(linkifyTimestamps("### Demo — Schritt 1", VID)).toBe(
      "### Demo — Schritt 1",
    )
  })

  test("idempotent: zweiter Lauf ändert nichts", () => {
    const input = "### 3:24 — Intro\n\nText.\n\n### 5:12 — Body"
    const once = linkifyTimestamps(input, VID)
    const twice = linkifyTimestamps(once, VID)
    expect(twice).toBe(once)
  })

  test("verlinkt Werbung-Marker-Range", () => {
    const input =
      '> [!info] Werbung ausgeschnitten (3:24–5:12, ~Sponsor "Notion")'
    const expected = `> [!info] Werbung ausgeschnitten ([3:24](${URL_204})–[5:12](${URL_312}), ~Sponsor "Notion")`
    expect(linkifyTimestamps(input, VID)).toBe(expected)
  })

  test("verlinkt Pass-5-Behauptungs-TS in Klammern", () => {
    const input = "- Sprecher empfiehlt X für Y (3:24)"
    const expected = `- Sprecher empfiehlt X für Y ([3:24](${URL_204}))`
    expect(linkifyTimestamps(input, VID)).toBe(expected)
  })

  test("Klammer-TS ist auch idempotent", () => {
    const input = "- Punkt A (3:24)\n- Punkt B (5:12)"
    const once = linkifyTimestamps(input, VID)
    const twice = linkifyTimestamps(once, VID)
    expect(twice).toBe(once)
  })

  test("ganzer Pass-1-Auszug — gemischte Sektion-Header + Werbung", () => {
    const input = [
      "### 0:00 — Intro",
      "",
      "Hallo Leute, heute geht es um …",
      "",
      '> [!info] Werbung ausgeschnitten (3:24–5:12, ~Sponsor "Notion")',
      "",
      "### 5:12 — Hauptthema",
      "",
      "Jetzt zum eigentlichen Inhalt.",
    ].join("\n")
    const out = linkifyTimestamps(input, VID)
    expect(out).toContain(`### [0:00](${URL_0}) — Intro`)
    expect(out).toContain(`### [5:12](${URL_312}) — Hauptthema`)
    expect(out).toContain(
      `([3:24](${URL_204})–[5:12](${URL_312}), ~Sponsor "Notion")`,
    )
  })

  test("ungültige Video-ID → Input bleibt unverändert (robust)", () => {
    // safeLinkify fängt buildMarkerUrl-Fehler pro Timestamp ab.
    expect(linkifyTimestamps("### 3:24 — Intro", "abc")).toBe(
      "### 3:24 — Intro",
    )
  })

  test("ungültiger TS in Sektion-Header bleibt unverändert (robust)", () => {
    // 99:99 ist syntaktisch M:SS aber Sekunden > 59
    const input = "### 99:99 — Bug"
    expect(linkifyTimestamps(input, VID)).toBe("### 99:99 — Bug")
  })

  test("ignoriert Datumsangabe im Fließtext (kein Match ohne Klammern oder ###-Prefix)", () => {
    // "12:34" im Fließtext ohne Klammern und ohne ### wird NICHT verlinkt
    const input = "Treffen heute um 12:34 Uhr."
    expect(linkifyTimestamps(input, VID)).toBe("Treffen heute um 12:34 Uhr.")
  })
})
