import { expect, test } from "bun:test"
import {
  eurFormatter,
  formatDelta,
  getDeltaColorClass,
  toInputValue,
} from "./format"

test("returns em dash for null", () => {
  expect(formatDelta(null)).toBe("—")
})

test("formats positive values with leading plus sign", () => {
  expect(formatDelta(123)).toBe(`+${eurFormatter.format(1.23)}`)
})

test("formats zero and negative values without plus sign", () => {
  expect(formatDelta(0)).toBe(eurFormatter.format(0))
  expect(formatDelta(-123)).toBe(eurFormatter.format(-1.23))
})

test("returns muted color for null and zero", () => {
  expect(getDeltaColorClass(null)).toBe("text-muted-foreground")
  expect(getDeltaColorClass(0)).toBe("text-muted-foreground")
})

test("returns positive/negative color classes", () => {
  expect(getDeltaColorClass(1)).toBe("text-emerald-700")
  expect(getDeltaColorClass(-1)).toBe("text-red-600")
})

test("formats input values with two decimals and comma", () => {
  expect(toInputValue(1010)).toBe("10,10")
  expect(toInputValue(1000)).toBe("10,00")
  expect(toInputValue(5)).toBe("0,05")
})
