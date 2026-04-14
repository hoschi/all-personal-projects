import { expect, test } from "bun:test"
import { createPipelineStageDescriptors } from "."

test("pipeline scaffold exposes all planned stages", () => {
  const stageNames = createPipelineStageDescriptors().map((stage) => stage.name)

  expect(stageNames).toEqual([
    "loadCursor",
    "fetchChanges",
    "normalizeMessages",
    "classify",
    "applyAction",
    "notifyUser",
  ])
})
