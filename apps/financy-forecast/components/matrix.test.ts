import { describe, test, expect, mock, beforeEach } from "bun:test";
import { calculateApprovable } from "../domain/snapshots";

// Mock the now() function to make tests deterministic
const mockNow = mock();

// Setup mock module for lib/utils.ts
mock.module("@/lib/utils", () => ({
    now: mockNow
}));

describe("calculateApprovable", () => {
    beforeEach(() => {
        // Clear mock state before each test
        mockNow.mockClear();
    });

    test("returns true: last snapshot is more than 2 months ago from fixed test date", () => {
        // Mock the current date to be 2023-03-15 (March 15, 2023)
        mockNow.mockImplementation(() => new Date("2023-03-15"));

        const lastDate = new Date("2023-01-01"); // January 1, 2023

        // January 1st to March 15th is more than 2 months
        expect(calculateApprovable(lastDate)).toBe(true);
        expect(mockNow).toHaveBeenCalled();
    });

    test("returns true when lastDate is more than 2 months ago", () => {
        // Mock the current date to be 2023-04-01 (April 1, 2023)
        mockNow.mockImplementation(() => new Date("2023-04-01"));

        const lastDate = new Date("2023-01-01"); // January 1, 2023

        // January 1st to April 1st is exactly 3 months
        expect(calculateApprovable(lastDate)).toBe(true);
        expect(mockNow).toHaveBeenCalled();
    });

    test("returns true when lastDate is in the distant past", () => {
        // Mock the current date to be 2023-01-15 (January 15, 2023)
        mockNow.mockImplementation(() => new Date("2023-01-15"));

        const lastDate = new Date("2020-01-01"); // January 1, 2020

        // 2020 to 2023 is definitely more than 2 months
        expect(calculateApprovable(lastDate)).toBe(true);
        expect(mockNow).toHaveBeenCalled();
    });

    test("returns false when lastDate is recent (within 2 months)", () => {
        // Mock the current date to be 2023-03-15 (March 15, 2023)
        mockNow.mockImplementation(() => new Date("2023-03-15"));

        const lastDate = new Date("2023-02-01"); // February 1, 2023

        // February 1st to March 15th is about 1.5 months (within 2 months)
        expect(calculateApprovable(lastDate)).toBe(false);
        expect(mockNow).toHaveBeenCalled();
    });

    test("returns false when lastDate is very recent (within 2 months)", () => {
        // Mock the current date to be 2023-03-15 (March 15, 2023)
        mockNow.mockImplementation(() => new Date("2023-03-15"));

        const lastDate = new Date("2023-03-01"); // March 1, 2023

        // March 1st to March 15th is 15 days (within 2 months)
        expect(calculateApprovable(lastDate)).toBe(false);
        expect(mockNow).toHaveBeenCalled();
    });

    test("returns false when lastDate is exactly the same as today's date", () => {
        // Mock the current date to be 2023-01-15 (January 15, 2023)
        mockNow.mockImplementation(() => new Date("2023-01-15"));

        const lastDate = new Date("2023-01-15"); // Same date as "today"

        // Same date should return false (not more than 2 months ago)
        expect(calculateApprovable(lastDate)).toBe(false);
        expect(mockNow).toHaveBeenCalled();
    });
});