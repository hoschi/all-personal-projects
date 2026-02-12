import { describe, expect, test } from "bun:test"
import { Either } from "effect"
import { parseCurrentBalanceValue } from "./currentBalances"

describe("parseCurrentBalanceValue", () => {
  test("parses decimal values with dot and comma", () => {
    const parsedDot = parseCurrentBalanceValue("12.34")
    const parsedComma = parseCurrentBalanceValue("12,34")
    expect(Either.isRight(parsedDot)).toBe(true)
    expect(Either.isRight(parsedComma)).toBe(true)
    if (Either.isRight(parsedDot)) {
      expect(parsedDot.right).toBe(1234)
    }
    if (Either.isRight(parsedComma)) {
      expect(parsedComma.right).toBe(1234)
    }
  })

  test("parses de/en thousands and decimal separators", () => {
    const parsedDe = parseCurrentBalanceValue("1.234,56")
    const parsedEn = parseCurrentBalanceValue("1,234.56")
    expect(Either.isRight(parsedDe)).toBe(true)
    expect(Either.isRight(parsedEn)).toBe(true)
    if (Either.isRight(parsedDe)) {
      expect(parsedDe.right).toBe(123456)
    }
    if (Either.isRight(parsedEn)) {
      expect(parsedEn.right).toBe(123456)
    }
  })

  test("parses grouped thousand values", () => {
    const parsed1 = parseCurrentBalanceValue("1.000")
    const parsed2 = parseCurrentBalanceValue("1,000")
    const parsed3 = parseCurrentBalanceValue("1.000.000")
    const parsed4 = parseCurrentBalanceValue("1,000,000")
    expect(Either.isRight(parsed1)).toBe(true)
    expect(Either.isRight(parsed2)).toBe(true)
    expect(Either.isRight(parsed3)).toBe(true)
    expect(Either.isRight(parsed4)).toBe(true)
    if (Either.isRight(parsed1)) {
      expect(parsed1.right).toBe(100000)
    }
    if (Either.isRight(parsed2)) {
      expect(parsed2.right).toBe(100000)
    }
    if (Either.isRight(parsed3)) {
      expect(parsed3.right).toBe(100000000)
    }
    if (Either.isRight(parsed4)) {
      expect(parsed4.right).toBe(100000000)
    }
  })

  test("returns Left for invalid input", () => {
    const requiredError = parseCurrentBalanceValue("")
    const invalidError = parseCurrentBalanceValue("abc")
    const malformedError = parseCurrentBalanceValue("1,234,56")

    expect(Either.isLeft(requiredError)).toBe(true)
    expect(Either.isLeft(invalidError)).toBe(true)
    expect(Either.isLeft(malformedError)).toBe(true)

    if (Either.isLeft(requiredError)) {
      expect(requiredError.left).toBe("Balance value is required")
    }
    if (Either.isLeft(invalidError)) {
      expect(invalidError.left).toBe("Invalid balance value: abc")
    }
    if (Either.isLeft(malformedError)) {
      expect(malformedError.left).toBe("Invalid balance value: 1,234,56")
    }
  })
})
