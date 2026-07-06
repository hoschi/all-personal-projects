import { test, expect } from "bun:test"
import { planMove } from "./relocator-planner"

test("planMove: shared+privat → move to private", () => {
  const result = planMove("stefans-vault/shared", "privat")
  expect(result).toEqual({
    targetVault: "stefans-vault/private",
    reason: "plugin-output-to-private",
  })
})

test("planMove: private+arbeit → reverse-move to shared", () => {
  const result = planMove("stefans-vault/private", "arbeit")
  expect(result).toEqual({
    targetVault: "stefans-vault/shared",
    reason: "reverse-reclassification",
  })
})

test("planMove: shared+arbeit → null (already correct)", () => {
  expect(planMove("stefans-vault/shared", "arbeit")).toBeNull()
})

test("planMove: private+privat → null (already correct)", () => {
  expect(planMove("stefans-vault/private", "privat")).toBeNull()
})

test("planMove: silent-skip mixed", () => {
  expect(planMove("stefans-vault/shared", "mixed")).toBeNull()
  expect(planMove("stefans-vault/private", "mixed")).toBeNull()
})

test("planMove: silent-skip null classification", () => {
  expect(planMove("stefans-vault/shared", null)).toBeNull()
  expect(planMove("stefans-vault/private", null)).toBeNull()
})

test("planMove: silent-skip unknown-string classification", () => {
  expect(planMove("stefans-vault/shared", "unknown")).toBeNull()
})

test("planMove: hard-skip user-kb-vault", () => {
  expect(planMove("user-kb-vault", "privat")).toBeNull()
  expect(planMove("user-kb-vault", "arbeit")).toBeNull()
})
