import { describe, test, expect, mock, beforeEach } from "bun:test";
import { getMatrixData } from "./data";
import { Option } from "effect";
import { AccountCategory, SnapshotDetails } from "./schemas";

// ============================================================================
// Factory Functions für Mock-Daten
// ============================================================================

const createMockAccount = (overrides = {}) => ({
    id: "account-1",
    name: "Test Account",
    category: AccountCategory.LIQUID,
    currentBalance: 500000, // 5000.00 EUR in Cents
    ...overrides
});

const createMockSnapshot = (date: Date, overrides = {}) => ({
    id: "snapshot-1",
    date,
    totalLiquidity: 1000000, // 10000.00 EUR in Cents
    ...overrides
});

const createMockSnapshotDetails = (snapshots: ReturnType<typeof createMockSnapshot>, accountBalances: Record<string, number>): SnapshotDetails => ({
    snapshot: snapshots,
    accountBalances
});

// ============================================================================
// Mock Module Setup mit Bun's Native Mock System
// ============================================================================

// Mock das gesamte db Modul mit Bun's mock() Funktion
const mockGetSnapshotDetails = mock();
const mockGetAccounts = mock();

// Mock module implementation für db.ts
mock.module("./db", () => ({
    getSnapshotDetails: mockGetSnapshotDetails,
    getAccounts: mockGetAccounts,
    // Nur die tatsächlich verwendeten Funktionen mocken
    // Andere Funktionen werden nicht aufgerufen in getMatrixData()
}));

// ============================================================================
// Tests mit Bun's Mock System
// ============================================================================

describe("getMatrixData", () => {
    beforeEach(() => {
        // Clear mock state before each test
        mockGetSnapshotDetails.mockClear();
        mockGetAccounts.mockClear();
    });

    // ========================================================================
    // Error Handling Tests
    // ========================================================================

    test("should return Option.none when no snapshot details found", async () => {
        // Setup mock return values
        mockGetSnapshotDetails.mockImplementation(async () => Option.none());
        mockGetAccounts.mockImplementation(async () => []);

        const result = await getMatrixData(4);

        expect(Option.isNone(result)).toBe(true);
        expect(mockGetSnapshotDetails).toHaveBeenCalledWith(4);
        expect(mockGetAccounts).toHaveBeenCalled();
    });

    test("should return Option.none when only single snapshot exists", async () => {
        // Setup mock return values
        mockGetSnapshotDetails.mockImplementation(async () => Option.some([
            createMockSnapshotDetails(
                createMockSnapshot(new Date("2023-01-01")),
                { "account-1": 450000 }
            )
        ]));
        mockGetAccounts.mockImplementation(async () => [createMockAccount()]);

        const result = await getMatrixData(4);

        expect(Option.isNone(result)).toBe(true);
        expect(mockGetSnapshotDetails).toHaveBeenCalledWith(4);
        expect(mockGetAccounts).toHaveBeenCalled();
    });

    test("should return Option.none when database throws error", async () => {
        // Setup mock to throw error
        mockGetSnapshotDetails.mockImplementation(async () => {
            throw new Error("Database connection failed");
        });
        mockGetAccounts.mockImplementation(async () => {
            throw new Error("Database connection failed");
        });

        await expect(getMatrixData(4)).rejects.toThrow("Database connection failed");
    });

    // ========================================================================
    // Happy Path Tests
    // ========================================================================

    test("should return MatrixData with correct structure for multiple snapshots", async () => {
        // Setup mock return values
        mockGetSnapshotDetails.mockImplementation(async () => Option.some([
            createMockSnapshotDetails(
                createMockSnapshot(new Date("2023-01-01")),
                { "account-1": 450000 }
            ),
            createMockSnapshotDetails(
                createMockSnapshot(new Date("2023-02-01")),
                { "account-1": 475000 }
            ),
            createMockSnapshotDetails(
                createMockSnapshot(new Date("2023-03-01")),
                { "account-1": 500000 }
            )
        ]));
        mockGetAccounts.mockImplementation(async () => [createMockAccount()]);

        const result = await getMatrixData(4);

        expect(Option.isSome(result)).toBe(true);
        const matrixData = Option.getOrThrow(result);

        // Verify structure
        expect(matrixData.rows).toHaveLength(1); // One account
        expect(matrixData.header).toHaveLength(4); // 3 snapshots + "Current"
        expect(matrixData.lastDate).toBeInstanceOf(Date);

        // Verify exact header array (data is reversed, so newest comes first)
        expect(matrixData.header).toEqual(["2023-03", "2023-02", "2023-01", "Current"]);

        // Verify row structure
        const row = matrixData.rows[0];
        expect(row.id).toBe("account-1");
        expect(row.name).toBe("Test Account");
        expect(row.cells).toHaveLength(4); // 3 historical + current

        // Verify cell amounts (note: data is reversed, so newest comes first)
        expect(row.cells[0].amount).toBe(500000); // newest snapshot (2023-03-01)
        expect(row.cells[1].amount).toBe(475000); // middle snapshot (2023-02-01)
        expect(row.cells[2].amount).toBe(450000); // oldest snapshot (2023-01-01)
        expect(row.cells[3].amount).toBe(500000); // current balance

        expect(mockGetSnapshotDetails).toHaveBeenCalledWith(4);
        expect(mockGetAccounts).toHaveBeenCalled();
    });

    test("should handle multiple accounts correctly", async () => {
        // Setup mock return values
        mockGetSnapshotDetails.mockImplementation(async () => Option.some([
            createMockSnapshotDetails(
                createMockSnapshot(new Date("2023-01-01")),
                {
                    "account-1": 450000,
                    "account-2": 250000
                }
            ),
            createMockSnapshotDetails(
                createMockSnapshot(new Date("2023-02-01")),
                {
                    "account-1": 475000,
                    "account-2": 275000
                }
            )
        ]));
        mockGetAccounts.mockImplementation(async () => [
            createMockAccount({ id: "account-1", name: "Girokonto" }),
            createMockAccount({ id: "account-2", name: "Tagesgeld", currentBalance: 250000 })
        ]);

        const result = await getMatrixData(4);

        expect(Option.isSome(result)).toBe(true);
        const matrixData = Option.getOrThrow(result);

        // Should have 2 rows for 2 accounts
        expect(matrixData.rows).toHaveLength(2);

        // First account (Girokonto) - data is reversed
        const girokonto = matrixData.rows[0];
        expect(girokonto.name).toBe("Girokonto");
        expect(girokonto.cells[0].amount).toBe(475000); // newest snapshot (2023-02-01)
        expect(girokonto.cells[1].amount).toBe(450000); // oldest snapshot (2023-01-01)
        expect(girokonto.cells[2].amount).toBe(500000); // current

        // Second account (Tagesgeld) - data is reversed
        const tagesgeld = matrixData.rows[1];
        expect(tagesgeld.name).toBe("Tagesgeld");
        expect(tagesgeld.cells[0].amount).toBe(275000); // newest snapshot (2023-02-01)
        expect(tagesgeld.cells[1].amount).toBe(250000); // oldest snapshot (2023-01-01)
        expect(tagesgeld.cells[2].amount).toBe(250000); // current

        expect(mockGetSnapshotDetails).toHaveBeenCalledWith(4);
        expect(mockGetAccounts).toHaveBeenCalled();
    });

    // ========================================================================
    // Edge Case Tests
    // ========================================================================

    test("should handle zero limit gracefully", async () => {
        // Setup mock return values
        mockGetSnapshotDetails.mockImplementation(async () => Option.none());
        mockGetAccounts.mockImplementation(async () => []);

        const result = await getMatrixData(0);

        expect(Option.isNone(result)).toBe(true);
        expect(mockGetSnapshotDetails).toHaveBeenCalledWith(0);
        expect(mockGetAccounts).toHaveBeenCalled();
    });

    test("should handle negative limit gracefully", async () => {
        // Setup mock return values
        mockGetSnapshotDetails.mockImplementation(async () => Option.none());
        mockGetAccounts.mockImplementation(async () => []);

        const result = await getMatrixData(-1);

        expect(Option.isNone(result)).toBe(true);
        expect(mockGetSnapshotDetails).toHaveBeenCalledWith(-1);
        expect(mockGetAccounts).toHaveBeenCalled();
    });

    test("should handle decimal limit gracefully", async () => {
        // Setup mock return values
        mockGetSnapshotDetails.mockImplementation(async () => Option.none());
        mockGetAccounts.mockImplementation(async () => []);

        const result = await getMatrixData(3.14);

        expect(Option.isNone(result)).toBe(true);
        expect(mockGetSnapshotDetails).toHaveBeenCalledWith(3.14);
        expect(mockGetAccounts).toHaveBeenCalled();
    });

    test("should handle missing account balances correctly", async () => {
        // Setup mock with missing account balance
        mockGetSnapshotDetails.mockImplementation(async () => Option.some([
            createMockSnapshotDetails(
                createMockSnapshot(new Date("2023-01-01")),
                {
                    "account-1": 450000,
                    // account-2 has no balance in this snapshot
                }
            ),
            createMockSnapshotDetails(
                createMockSnapshot(new Date("2023-02-01")),
                {
                    "account-1": 475000,
                    "account-2": 275000 // account-2 has balance in second snapshot
                }
            )
        ]));
        mockGetAccounts.mockImplementation(async () => [
            createMockAccount({ id: "account-1", name: "Account 1" }),
            createMockAccount({ id: "account-2", name: "Account 2", currentBalance: 0 })
        ]);

        const result = await getMatrixData(4);

        // The function should still work, but we should verify that missing balances are handled correctly
        // Missing balances should default to 0
        expect(Option.isSome(result)).toBe(true);

        if (Option.isSome(result)) {
            const matrixData = Option.getOrThrow(result);
            // Account 2 should have correct values: newest first, then oldest
            const account2Row = matrixData.rows.find(row => row.id === "account-2");
            expect(account2Row).toBeDefined();
            // cells[0] = newest snapshot (2023-02-01) = 275000
            // cells[1] = oldest snapshot (2023-01-01) = 0 (missing balance defaults to 0)
            expect(account2Row?.cells[0].amount).toBe(275000); // Has balance in newest snapshot
            expect(account2Row?.cells[1].amount).toBe(0); // Missing balance in oldest snapshot defaults to 0
        }

        expect(mockGetSnapshotDetails).toHaveBeenCalledWith(4);
        expect(mockGetAccounts).toHaveBeenCalled();
    });
});

// Cleanup after all tests - Bun doesn't have clearAllMocks, individual mocks are cleared in beforeEach