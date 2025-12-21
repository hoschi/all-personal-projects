import { test, expect, mock, beforeEach } from "bun:test";
import { calculateApprovable } from "./snapshots";

// Mock the now function from lib/utils
const TEST_DATE = new Date("2025-01-15T10:30:00Z");
const mockNow = mock(() => TEST_DATE);

mock.module("../lib/utils", () => ({
    now: mockNow
}));

beforeEach(() => {
    mockNow.mockClear();
});

// Test with mocked date to ensure consistent behavior

test("calculateApprovable - should return true when today is after approvable date", () => {
    // TEST_DATE is 2025-01-15, so dates before 2024-10-15 should be true (3 months)
    const oldDate = new Date("2024-10-01"); // More than 3 months before TEST_DATE
    const result = calculateApprovable(oldDate);
    expect(result).toBe(true);
});

test("calculateApprovable - should return true when today equals approvable date", () => {
    // TEST_DATE is 2025-01-15, so exactly 3 months before is 2024-10-15
    const exactlyThreeMonths = new Date("2024-10-15");
    const result = calculateApprovable(exactlyThreeMonths);
    expect(result).toBe(true);
});

test("calculateApprovable - should return false when today is before approvable date", () => {
    // TEST_DATE is 2025-01-15, so dates after 2024-10-15 should be false (less than 3 months)
    const recentDate = new Date("2024-12-01"); // Less than 3 months before TEST_DATE
    const result = calculateApprovable(recentDate);
    expect(result).toBe(false);
});

test("calculateApprovable - should return false for future dates", () => {
    // TEST_DATE is 2025-01-15, so future dates should be false
    const futureDate = new Date("2025-02-01");
    const result = calculateApprovable(futureDate);
    expect(result).toBe(false);
});

test("calculateApprovable - should handle 1 day before 3-month boundary", () => {
    // TEST_DATE is 2025-01-15, so 1 day before 3-month boundary would be 2024-10-14
    const oneDayBefore = new Date("2024-10-14");
    const result = calculateApprovable(oneDayBefore);
    // Should be false since it's less than 3 months from TEST_DATE
    expect(result).toBe(false);
});

test("calculateApprovable - should handle same day dates", () => {
    // Same day as TEST_DATE should not be approvable (not 2 months old)
    const sameDay = new Date("2025-01-15");
    const result = calculateApprovable(sameDay);
    expect(result).toBe(false);
});

test("calculateApprovable - should handle very old dates", () => {
    // TEST_DATE is 2025-01-15, so very old dates should be true
    const veryOldDate = new Date("2020-01-01");
    const result = calculateApprovable(veryOldDate);
    expect(result).toBe(true);
});

test("calculateApprovable - should handle edge case with end of month dates", () => {
    // TEST_DATE is 2025-01-15, so 3 months back would be 2024-10-15
    // Test with end of month dates
    const endOfMonth = new Date("2024-10-31"); // End of October
    const result = calculateApprovable(endOfMonth);
    // Should be true since it's more than 3 months from TEST_DATE
    expect(result).toBe(true);
});

test("calculateApprovable - should handle leap years correctly", () => {
    // TEST_DATE is 2025-01-15, leap year dates should still work
    const leapYearDate = new Date("2024-01-15"); // Leap year
    const result = calculateApprovable(leapYearDate);
    // Should be true as it's more than 3 months before TEST_DATE
    expect(result).toBe(true);
});