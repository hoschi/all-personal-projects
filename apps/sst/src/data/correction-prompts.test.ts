import { test, expect } from "bun:test"
import { buildPrivatePrompt, buildWorkPrompt } from "./correction-prompts"

test("buildPrivatePrompt enthält Regel-Block, contextText und Transkript", () => {
  const prompt = buildPrivatePrompt({
    transcriptionText: "das ist ki",
    contextText: "PydanticAI ist ein Framework",
  })
  expect(prompt).toContain("KI")
  expect(prompt).toContain("PydanticAI")
  expect(prompt).toContain("das ist ki")
})

test("buildPrivatePrompt enthält keine statische Eigennamen-Liste (Quelle: User-Vorgabe)", () => {
  const prompt = buildPrivatePrompt({
    transcriptionText: "test",
    contextText: "",
  })
  expect(prompt).not.toContain("LangChain")
  expect(prompt).not.toContain("Hugging Face")
  expect(prompt).not.toContain("Qdrant")
})

test("buildPrivatePrompt fallback bei leerem contextText", () => {
  const prompt = buildPrivatePrompt({
    transcriptionText: "test",
    contextText: "",
  })
  expect(prompt).toContain("(noch nichts)")
})

const baseInput = {
  transcriptionText: "claude code ist super",
  bottomTextContext: "vorher schon notes",
  ytContext: {
    displayTitle: "Claude Code Tutorial",
    channelName: "Anthropic",
    descriptionShort: "Erklärt Claude-Code-CLI in 3 Minuten.",
    namedEntities: ["Claude Code", "Anthropic", "TanStack Start"],
  },
}

test("buildWorkPrompt enthält YT-Kontext-Sektion vor bisherigen-Notizen-Sektion", () => {
  const prompt = buildWorkPrompt(baseInput)
  const ytIdx = prompt.indexOf("YT-KONTEXT")
  const notesIdx = prompt.indexOf("BISHERIGE ASR-NOTIZEN")
  expect(ytIdx).toBeGreaterThan(0)
  expect(notesIdx).toBeGreaterThan(ytIdx)
})

test("buildWorkPrompt listet alle namedEntities", () => {
  const prompt = buildWorkPrompt(baseInput)
  expect(prompt).toContain("- Claude Code")
  expect(prompt).toContain("- Anthropic")
  expect(prompt).toContain("- TanStack Start")
})

test("buildWorkPrompt fallback bei leerem bottomTextContext", () => {
  const prompt = buildWorkPrompt({ ...baseInput, bottomTextContext: "" })
  expect(prompt).toContain("(noch nichts)")
})
