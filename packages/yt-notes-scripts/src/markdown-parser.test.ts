import { describe, expect, test } from "bun:test"
import {
  parseStub,
  findH2Sections,
  getBodyBetweenH1AndFirstH2OrEnd,
} from "./markdown-parser"

describe("parseStub", () => {
  test("trennt Frontmatter und Body", () => {
    const md = `---\ntitle: Foo\nyoutubeId: abc\n---\n\n# H1\n\nBody-Inhalt`
    const result = parseStub(md)
    expect(result.frontmatter).toEqual({ title: "Foo", youtubeId: "abc" })
    expect(result.body).toBe("# H1\n\nBody-Inhalt")
  })

  test("liefert leeres Frontmatter wenn nicht vorhanden", () => {
    const md = `# H1\n\nBody`
    const result = parseStub(md)
    expect(result.frontmatter).toEqual({})
    expect(result.body).toBe("# H1\n\nBody")
  })
})

describe("findH2Sections", () => {
  test("findet H2-Sektionen mit Range", () => {
    const body = `# H1\n\nIntro\n\n## Sektion A\n\nA-Inhalt\n\n## Sektion B\n\nB-Inhalt`
    const sections = findH2Sections(body)
    expect(sections).toHaveLength(2)
    expect(sections[0]?.heading).toBe("Sektion A")
    expect(sections[1]?.heading).toBe("Sektion B")
  })

  test("liefert leeres Array wenn keine H2", () => {
    const body = `# H1\n\nNur Intro, kein H2`
    expect(findH2Sections(body)).toEqual([])
  })
})

describe("getBodyBetweenH1AndFirstH2OrEnd", () => {
  test("Inhalt zwischen H1 und erster H2", () => {
    const body = `# H1\n\nIntro-Text\n\n## Sektion A\n\nA-Inhalt`
    expect(getBodyBetweenH1AndFirstH2OrEnd(body).trim()).toBe("Intro-Text")
  })

  test("Inhalt bis EOF wenn keine H2", () => {
    const body = `# H1\n\nNur Intro, kein H2`
    expect(getBodyBetweenH1AndFirstH2OrEnd(body).trim()).toBe(
      "Nur Intro, kein H2",
    )
  })

  test("leerer String wenn nichts zwischen H1 und H2", () => {
    const body = `# H1\n## Sektion A\n\nA`
    expect(getBodyBetweenH1AndFirstH2OrEnd(body).trim()).toBe("")
  })
})
