import { test, expect, mock, beforeEach } from "bun:test"
import { formatMonthNumericYYMM } from "./formatting"

// Mock the now function from lib/utils
const TEST_DATE = new Date("2025-01-15T10:30:00Z")
const mockNow = mock(() => TEST_DATE)

mock.module("../lib/utils", () => ({
  now: mockNow,
}))

beforeEach(() => {
  mockNow.mockClear()
})

// =============================================================================
// formatMonthNumericYYMM Tests
// =============================================================================

test("formatMonthNumericYYMM - should return correct format for current month (offset 0)", () => {
  const result = formatMonthNumericYYMM(0)
  expect(result).toBe("25-01") // 2025 January
})

test("formatMonthNumericYYMM - should return correct format for next month (offset 1)", () => {
  const result = formatMonthNumericYYMM(1)
  expect(result).toBe("25-02") // 2025 February
})

test("formatMonthNumericYYMM - should return correct format for 12 months ahead (offset 12)", () => {
  const result = formatMonthNumericYYMM(12)
  expect(result).toBe("26-01") // 2026 January
})

test("formatMonthNumericYYMM - should return correct format for 24 months ahead (offset 24)", () => {
  const result = formatMonthNumericYYMM(24)
  expect(result).toBe("27-01") // 2027 January
})

test("formatMonthNumericYYMM - should handle negative offsets correctly", () => {
  const result = formatMonthNumericYYMM(-1)
  expect(result).toBe("24-12") // 2024 December (previous month)
})

test("formatMonthNumericYYMM - should handle year boundary crossing", () => {
  const result = formatMonthNumericYYMM(11) // From Jan 2025 to Dec 2025
  expect(result).toBe("25-12") // 2025 December
})

test("formatMonthNumericYYMM - should handle multiple year boundaries", () => {
  const result = formatMonthNumericYYMM(36) // 3 years ahead
  expect(result).toBe("28-01") // 2028 January
})

test("formatMonthNumericYYMM - should always return 2-digit year and 2-digit month", () => {
  const result1 = formatMonthNumericYYMM(0)
  const result2 = formatMonthNumericYYMM(1)
  const result3 = formatMonthNumericYYMM(11)

  expect(result1).toMatch(/^\d{2}-\d{2}$/)
  expect(result2).toMatch(/^\d{2}-\d{2}$/)
  expect(result3).toMatch(/^\d{2}-\d{2}$/)
})

test("formatMonthNumericYYMM - should handle month validation", () => {
  const result = formatMonthNumericYYMM(0)
  const month = parseInt(result.split("-")[1])

  expect(month).toBeGreaterThanOrEqual(1)
  expect(month).toBeLessThanOrEqual(12)
})

test("formatMonthNumericYYMM - should be consistent for same offset", () => {
  const result1 = formatMonthNumericYYMM(5)
  const result2 = formatMonthNumericYYMM(5)

  expect(result1).toBe(result2)
})
