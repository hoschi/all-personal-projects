import { describe, test, expect, mock, spyOn } from "bun:test";
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
// Mock Database Services (Dependency Injection Pattern)
// ============================================================================

interface DatabaseServices {
    getSnapshotDetails: (limit: number) => Promise<Option.Option<SnapshotDetails[]>>;
    getAccounts: () => Promise<ReturnType<typeof createMockAccount>[]>;
}

// Factory für verschiedene Test-Scenarios
const createMockServices = {
    empty: (): DatabaseServices => ({
        getSnapshotDetails: mock(async () => Option.none()),
        getAccounts: mock(async () => [])
    }),

    singleSnapshot: (): DatabaseServices => ({
        getSnapshotDetails: mock(async () => Option.some([
            createMockSnapshotDetails(
                createMockSnapshot(new Date("2023-01-01")),
                { "account-1": 450000 }
            )
        ])),
        getAccounts: mock(async () => [createMockAccount()])
    }),

    multipleSnapshots: (): DatabaseServices => ({
        getSnapshotDetails: mock(async () => Option.some([
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
        ])),
        getAccounts: mock(async () => [createMockAccount()])
    }),

    multipleAccounts: (): DatabaseServices => ({
        getSnapshotDetails: mock(async () => Option.some([
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
        ])),
        getAccounts: mock(async () => [
            createMockAccount({ id: "account-1", name: "Girokonto" }),
            createMockAccount({ id: "account-2", name: "Tagesgeld", currentBalance: 250000 })
        ])
    })
};

// ============================================================================
// Tests
// ============================================================================

describe("getMatrixData", () => {
    // ========================================================================
    // Error Handling Tests
    // ========================================================================

    test("should return Option.none when no snapshot details found", async () => {
        const services = createMockServices.empty();
        const result = await getMatrixData(4, services);
        expect(Option.isNone(result)).toBe(true);
    });

    test("should return Option.none when only single snapshot exists", async () => {
        const services = createMockServices.singleSnapshot();
        const result = await getMatrixData(4, services);
        expect(Option.isNone(result)).toBe(true);
    });

    test("should return Option.none when database throws error", async () => {
        const errorServices: DatabaseServices = {
            getSnapshotDetails: mock(async () => {
                throw new Error("Database connection failed");
            }),
            getAccounts: mock(async () => {
                throw new Error("Database connection failed");
            })
        };

        await expect(getMatrixData(4, errorServices)).rejects.toThrow("Database connection failed");
    });

    // ========================================================================
    // Happy Path Tests
    // ========================================================================

    test("should return MatrixData with correct structure for multiple snapshots", async () => {
        const services = createMockServices.multipleSnapshots();
        const result = await getMatrixData(4, services);

        expect(Option.isSome(result)).toBe(true);
        const matrixData = Option.getOrThrow(result);

        // Verify structure
        expect(matrixData.rows).toHaveLength(1); // One account
        expect(matrixData.header).toHaveLength(4); // 3 snapshots + "Current"
        expect(matrixData.lastDate).toBeInstanceOf(Date);

        //TODO expect the correct array instead of "contain" 
        expect(matrixData.header).toContain("2023-01");
        expect(matrixData.header).toContain("2023-02");
        expect(matrixData.header).toContain("2023-03");
        expect(matrixData.header).toContain("Current");

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
    });

    test("should handle multiple accounts correctly", async () => {
        const services = createMockServices.multipleAccounts();
        const result = await getMatrixData(4, services);

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
    });

    // ========================================================================
    // Edge Case Tests
    // ========================================================================

    test("should handle zero limit gracefully", async () => {
        const services = createMockServices.empty();
        const result = await getMatrixData(0, services);
        expect(Option.isNone(result)).toBe(true);
    });

    test("should handle negative limit gracefully", async () => {
        const services = createMockServices.empty();
        // Mock services should handle negative limits gracefully
        const result = await getMatrixData(-1, services);
        expect(Option.isNone(result)).toBe(true);
    });

    test("should handle decimal limit gracefully", async () => {
        const services = createMockServices.empty();
        // Mock services should handle decimal limits gracefully
        const result = await getMatrixData(3.14, services);
        expect(Option.isNone(result)).toBe(true);
    });

    // TODO this is a good point! the function should fail with invalid data! we expect data for each account in each snapshot!
    test("should handle missing account balances (null values)", async () => {
        const servicesWithMissingBalances: DatabaseServices = {
            getSnapshotDetails: mock(async () => Option.some([
                createMockSnapshotDetails(
                    createMockSnapshot(new Date("2023-01-01")),
                    {
                        "account-1": 450000,
                        // account-2 has no balance in this snapshot
                    }
                )
            ])),
            getAccounts: mock(async () => [
                createMockAccount({ id: "account-1", name: "Account 1" }),
                createMockAccount({ id: "account-2", name: "Account 2", currentBalance: 0 })
            ])
        };

        const result = await getMatrixData(4, servicesWithMissingBalances);
        // Should return Option.none because only one snapshot
        expect(Option.isNone(result)).toBe(true);
    });

});