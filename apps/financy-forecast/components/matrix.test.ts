import { describe, test, expect } from "bun:test";
import { calculateApprovable } from "./matrix";
import { addMonths, isAfter, isEqual } from "date-fns";

describe("calculateApprovable", () => {
    test("returns true: last snapshot is for january. current month is february and can only be approved when it is march", () => {
        const lastDate = new Date("2023-01-01");
        const approvableDate = new Date("2023-03-01");

        expect(calculateApprovable(lastDate, () => approvableDate)).toBe(true);
    });

    test("returns true when today is more than 2 months after lastDate", () => {
        const lastDate = new Date("2023-01-01");
        const today = new Date("2023-04-01"); // 3 months after

        expect(calculateApprovable(lastDate, () => today)).toBe(true);
    });

    test("returns true when lastDate is in the past (more than 2 months ago)", () => {
        const lastDate = new Date("2023-01-01");
        const today = new Date("2023-12-15"); // Much more than 2 months after

        expect(calculateApprovable(lastDate, () => today)).toBe(true);
    });

    test("returns false when today is less than 2 months after lastDate", () => {
        const lastDate = new Date("2023-01-01");
        const today = new Date("2023-02-01"); // 1 month after

        expect(calculateApprovable(lastDate, () => today)).toBe(false);
    });

    test("returns false when today is in the future relative to lastDate (less than 2 months)", () => {
        const lastDate = new Date("2023-01-01");
        const today = new Date("2023-01-15"); // 15 days after

        // Manually verify the logic:
        const approvableDate = addMonths(lastDate, 2); // 2023-03-01
        const isAfterResult = isAfter(today, approvableDate); // false
        const isEqualResult = isEqual(today, approvableDate); // false
        const expectedResult = isAfterResult || isEqualResult; // false

        expect(calculateApprovable(lastDate, () => today)).toBe(expectedResult);
    });

    test("returns false when lastDate is exactly the same as today's date", () => {
        const today = new Date("2023-01-01");

        expect(calculateApprovable(today, () => today)).toBe(false);
    });
});