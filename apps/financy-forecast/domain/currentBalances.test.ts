import { describe, expect, test } from "bun:test"
import {
  parseCurrentBalanceValue,
  tryParseCurrentBalanceValue,
} from "./currentBalances"

describe("parseCurrentBalanceValue", () => {
  test("parses decimal values with dot and comma", () => {
    expect(parseCurrentBalanceValue("12.34")).toBe(1234)
    expect(parseCurrentBalanceValue("12,34")).toBe(1234)
  })

  test("parses de/en thousands and decimal separators", () => {
    expect(parseCurrentBalanceValue("1.234,56")).toBe(123456)
    expect(parseCurrentBalanceValue("1,234.56")).toBe(123456)
  })

  test("parses grouped thousand values", () => {
    expect(parseCurrentBalanceValue("1.000")).toBe(100000)
    expect(parseCurrentBalanceValue("1,000")).toBe(100000)
    expect(parseCurrentBalanceValue("1.000.000")).toBe(100000000)
    expect(parseCurrentBalanceValue("1,000,000")).toBe(100000000)
  })

  test("throws for invalid input", () => {
    expect(() => parseCurrentBalanceValue("")).toThrow(
      "Balance value is required",
    )
    expect(() => parseCurrentBalanceValue("abc")).toThrow(
      "Invalid balance value: abc",
    )
    expect(() => parseCurrentBalanceValue("1,234,56")).toThrow(
      "Invalid balance value: 1,234,56",
    )
  })
})

describe("tryParseCurrentBalanceValue", () => {
  test("returns null for invalid values", () => {
    expect(tryParseCurrentBalanceValue("abc")).toBeNull()
  })
})
