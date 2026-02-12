import { describe, test, expect, mock, beforeEach } from "bun:test"
import { getMatrixData, getForecastData } from "./data"
import { Option } from "effect"
import {
  AccountCategory,
  SnapshotDetails,
  RecurringItemInterval,
  RecurringItem,
  ScenarioItem,
  Settings,
} from "./schemas"

// ============================================================================
// Factory Functions für Mock-Daten (Erweitert für getForecastData)
// ============================================================================

const createMockAccount = (overrides = {}) => ({
  id: "account-1",
  name: "Test Account",
  category: AccountCategory.LIQUID,
  currentBalance: 500000, // 5000.00 EUR in Cents
  ...overrides,
})

const createMockSnapshot = (date: Date, overrides = {}) => ({
  id: "snapshot-1",
  date,
  totalLiquidity: 1000000, // 10000.00 EUR in Cents
  ...overrides,
})

const createMockSnapshotDetails = (
  snapshots: ReturnType<typeof createMockSnapshot>,
  accountBalances: Record<string, number>,
): SnapshotDetails => ({
  snapshot: snapshots,
  accountBalances,
})

// Factory Functions für getForecastData() Tests
const createMockAssetSnapshot = (date: Date = new Date(), overrides = {}) => ({
  id: "snapshot-1",
  date,
  totalLiquidity: 1000000, // 10000.00 EUR in Cents
  ...overrides,
})

const createMockRecurringItem = (overrides = {}): RecurringItem => ({
  id: "recurring-1",
  name: "Miete",
  amount: -120000, // -1200.00 EUR in Cents
  interval: RecurringItemInterval.MONTHLY,
  dueMonth: null,
  ...overrides,
})

const createMockScenarioItem = (
  date: Date = new Date(),
  overrides = {},
): ScenarioItem => ({
  id: "scenario-1",
  name: "Urlaub",
  amount: -500000, // -5000.00 EUR in Cents
  date,
  isActive: true,
  ...overrides,
})

const createMockSettings = (overrides = {}): Settings => ({
  estimatedMonthlyVariableCosts: 50000, // 500.00 EUR in Cents
  ...overrides,
})

// ============================================================================
// Mock Module Setup mit Bun's Native Mock System (Erweitert)
// ============================================================================

// Mock das gesamte db Modul mit Bun's mock() Funktion
const mockGetSnapshotDetails = mock()
const mockGetAccounts = mock()

// Neue Mocks für getForecastData()
const mockGetLatestAssetSnapshot = mock()
const mockGetRecurringItems = mock()
const mockGetScenarioItems = mock()
const mockGetSettings = mock()

// Mock module implementation für db.ts
mock.module("./db", () => ({
  getSnapshotDetails: mockGetSnapshotDetails,
  getAccounts: mockGetAccounts,
  getLatestAssetSnapshot: mockGetLatestAssetSnapshot,
  getRecurringItems: mockGetRecurringItems,
  getScenarioItems: mockGetScenarioItems,
  getSettings: mockGetSettings,
}))

// ============================================================================
// Tests mit Bun's Mock System
// ============================================================================

describe("getMatrixData", () => {
  beforeEach(() => {
    // Clear mock state before each test
    mockGetSnapshotDetails.mockClear()
    mockGetAccounts.mockClear()
  })

  // ========================================================================
  // Error Handling Tests
  // ========================================================================

  test("should return Option.none when no snapshot details found", async () => {
    // Setup mock return values
    mockGetSnapshotDetails.mockImplementation(async () => Option.none())
    mockGetAccounts.mockImplementation(async () => [])

    const result = await getMatrixData(4)

    expect(Option.isNone(result)).toBe(true)
    expect(mockGetSnapshotDetails).toHaveBeenCalledWith(4)
    expect(mockGetAccounts).toHaveBeenCalled()
  })

  test("should return current-only matrix when snapshots are missing but accounts exist", async () => {
    mockGetSnapshotDetails.mockImplementation(async () => Option.none())
    mockGetAccounts.mockImplementation(async () => [createMockAccount()])

    const result = await getMatrixData(4)

    expect(Option.isSome(result)).toBe(true)
    const matrixData = Option.getOrThrow(result)

    expect(matrixData.header).toEqual(["Current"])
    expect(matrixData.lastDate).toBeNull()
    expect(matrixData.isInitialState).toBe(true)
    expect(matrixData.isApprovable).toBe(true)

    expect(matrixData.rows).toHaveLength(2)

    const accountRow = matrixData.rows[0]
    expect(accountRow?.cells).toHaveLength(1)
    expect(accountRow?.cells[0]?.amount).toBe(500000)

    const sumRow = matrixData.rows[1]
    expect(sumRow?.id).toBe("sum")
    expect(sumRow?.cells).toHaveLength(1)
    expect(sumRow?.cells[0]?.amount).toBe(500000)

    expect(matrixData.changes).toHaveLength(1)
    expect(matrixData.changes[0]?.delta).toBeNull()
    expect(matrixData.totalChange).toBeNull()
  })

  test("should return Option.none when database throws error", async () => {
    // Setup mock to throw error
    mockGetSnapshotDetails.mockImplementation(async () => {
      throw new Error("Database connection failed")
    })
    mockGetAccounts.mockImplementation(async () => {
      throw new Error("Database connection failed")
    })

    await expect(getMatrixData(4)).rejects.toThrow("Database connection failed")
  })

  // ========================================================================
  // Happy Path Tests
  // ========================================================================

  test("should return MatrixData with correct structure for multiple snapshots", async () => {
    // Setup mock return values
    mockGetSnapshotDetails.mockImplementation(async () =>
      Option.some([
        createMockSnapshotDetails(createMockSnapshot(new Date("2023-01-01")), {
          "account-1": 450000,
        }),
        createMockSnapshotDetails(createMockSnapshot(new Date("2023-02-01")), {
          "account-1": 475000,
        }),
        createMockSnapshotDetails(createMockSnapshot(new Date("2023-03-01")), {
          "account-1": 500000,
        }),
      ]),
    )
    mockGetAccounts.mockImplementation(async () => [createMockAccount()])

    const result = await getMatrixData(4)

    expect(Option.isSome(result)).toBe(true)
    const matrixData = Option.getOrThrow(result)

    // Verify structure
    expect(matrixData.rows).toHaveLength(2) // One account + one sum row
    expect(matrixData.changes).toHaveLength(4) // 3 snapshots + current
    expect(matrixData.header).toHaveLength(4) // 3 snapshots + "Current"
    expect(matrixData.lastDate).toBeInstanceOf(Date)
    expect(matrixData.isInitialState).toBe(false)
    expect(matrixData.isApprovable).toBe(true)

    // Verify exact header array (data is reversed, so newest comes first)
    expect(matrixData.header).toEqual([
      "2023-03",
      "2023-02",
      "2023-01",
      "Current",
    ])

    // Verify row structure
    const row = matrixData.rows[0]
    expect(row.id).toBe("account-1")
    expect(row.name).toBe("Test Account")
    expect(row.cells).toHaveLength(4) // 3 historical + current

    // Verify cell amounts (note: data is reversed, so newest comes first)
    expect(row.cells[0].amount).toBe(500000) // newest snapshot (2023-03-01)
    expect(row.cells[1].amount).toBe(475000) // middle snapshot (2023-02-01)
    expect(row.cells[2].amount).toBe(450000) // oldest snapshot (2023-01-01)
    expect(row.cells[3].amount).toBe(500000) // current balance

    // Verify sum row structure
    const sumRow = matrixData.rows[1]
    expect(sumRow.id).toBe("sum")
    expect(sumRow.name).toBe("")
    expect(sumRow.cells).toHaveLength(4) // 3 snapshots + current

    // Verify sum calculations (note: data is reversed, so newest comes first)
    // Sum row uses snapshot.totalLiquidity and current balance sum
    expect(sumRow.cells[0].amount).toBe(1000000) // newest snapshot (2023-03-01) totalLiquidity
    expect(sumRow.cells[1].amount).toBe(1000000) // middle snapshot (2023-02-01) totalLiquidity
    expect(sumRow.cells[2].amount).toBe(1000000) // oldest snapshot (2023-01-01) totalLiquidity
    expect(sumRow.cells[3].amount).toBe(500000) // current balance sum (one account with 500000)
    expect(matrixData.changes[0]?.delta).toBeNull()
    expect(matrixData.changes[1]?.delta).toBe(0)
    expect(matrixData.changes[2]?.delta).toBe(0)
    expect(matrixData.changes[3]?.delta).toBe(-500000)
    expect(matrixData.totalChange).toBe(-500000)

    expect(mockGetSnapshotDetails).toHaveBeenCalledWith(4)
    expect(mockGetAccounts).toHaveBeenCalled()
  })

  test("should handle multiple accounts correctly", async () => {
    // Setup mock return values
    mockGetSnapshotDetails.mockImplementation(async () =>
      Option.some([
        createMockSnapshotDetails(createMockSnapshot(new Date("2023-01-01")), {
          "account-1": 450000,
          "account-2": 250000,
        }),
        createMockSnapshotDetails(createMockSnapshot(new Date("2023-02-01")), {
          "account-1": 475000,
          "account-2": 275000,
        }),
      ]),
    )
    mockGetAccounts.mockImplementation(async () => [
      createMockAccount({ id: "account-1", name: "Girokonto" }),
      createMockAccount({
        id: "account-2",
        name: "Tagesgeld",
        currentBalance: 250000,
      }),
    ])

    const result = await getMatrixData(4)

    expect(Option.isSome(result)).toBe(true)
    const matrixData = Option.getOrThrow(result)

    // Should have 3 rows for 2 accounts + 1 sum row
    expect(matrixData.rows).toHaveLength(3)
    expect(matrixData.changes).toHaveLength(3)
    expect(matrixData.isInitialState).toBe(false)
    expect(matrixData.isApprovable).toBe(true)

    // First account (Girokonto) - data is reversed
    const girokonto = matrixData.rows[0]
    expect(girokonto.name).toBe("Girokonto")
    expect(girokonto.cells[0].amount).toBe(475000) // newest snapshot (2023-02-01)
    expect(girokonto.cells[1].amount).toBe(450000) // oldest snapshot (2023-01-01)
    expect(girokonto.cells[2].amount).toBe(500000) // current

    // Second account (Tagesgeld) - data is reversed
    const tagesgeld = matrixData.rows[1]
    expect(tagesgeld.name).toBe("Tagesgeld")
    expect(tagesgeld.cells[0].amount).toBe(275000) // newest snapshot (2023-02-01)
    expect(tagesgeld.cells[1].amount).toBe(250000) // oldest snapshot (2023-01-01)
    expect(tagesgeld.cells[2].amount).toBe(250000) // current

    // Verify sum row structure
    const sumRow = matrixData.rows[2]
    expect(sumRow.id).toBe("sum")
    expect(sumRow.name).toBe("")
    expect(sumRow.cells).toHaveLength(3) // 2 snapshots + current

    // Verify sum calculations (snapshot totalLiquidity + current balance sum)
    expect(sumRow.cells[0].amount).toBe(1000000) // newest snapshot totalLiquidity
    expect(sumRow.cells[1].amount).toBe(1000000) // oldest snapshot totalLiquidity
    expect(sumRow.cells[2].amount).toBe(750000) // current balance sum (500000 + 250000)
    expect(matrixData.changes[0]?.delta).toBeNull()
    expect(matrixData.changes[1]?.delta).toBe(0)
    expect(matrixData.changes[2]?.delta).toBe(-250000)
    expect(matrixData.totalChange).toBe(-250000)

    expect(mockGetSnapshotDetails).toHaveBeenCalledWith(4)
    expect(mockGetAccounts).toHaveBeenCalled()
  })

  // ========================================================================
  // Edge Case Tests
  // ========================================================================

  test("should handle zero limit gracefully", async () => {
    // Setup mock return values
    mockGetSnapshotDetails.mockImplementation(async () => Option.none())
    mockGetAccounts.mockImplementation(async () => [])

    const result = await getMatrixData(0)

    expect(Option.isNone(result)).toBe(true)
    expect(mockGetSnapshotDetails).toHaveBeenCalledWith(0)
    expect(mockGetAccounts).toHaveBeenCalled()
  })

  test("should handle negative limit gracefully", async () => {
    // Setup mock return values
    mockGetSnapshotDetails.mockImplementation(async () => Option.none())
    mockGetAccounts.mockImplementation(async () => [])

    const result = await getMatrixData(-1)

    expect(Option.isNone(result)).toBe(true)
    expect(mockGetSnapshotDetails).toHaveBeenCalledWith(-1)
    expect(mockGetAccounts).toHaveBeenCalled()
  })

  test("should handle decimal limit gracefully", async () => {
    // Setup mock return values
    mockGetSnapshotDetails.mockImplementation(async () => Option.none())
    mockGetAccounts.mockImplementation(async () => [])

    const result = await getMatrixData(3.14)

    expect(Option.isNone(result)).toBe(true)
    expect(mockGetSnapshotDetails).toHaveBeenCalledWith(3.14)
    expect(mockGetAccounts).toHaveBeenCalled()
  })

  test("should handle missing account balances correctly", async () => {
    // Setup mock with missing account balance
    mockGetSnapshotDetails.mockImplementation(async () =>
      Option.some([
        createMockSnapshotDetails(createMockSnapshot(new Date("2023-01-01")), {
          "account-1": 450000,
          // account-2 has no balance in this snapshot
        }),
        createMockSnapshotDetails(createMockSnapshot(new Date("2023-02-01")), {
          "account-1": 475000,
          "account-2": 275000, // account-2 has balance in second snapshot
        }),
      ]),
    )
    mockGetAccounts.mockImplementation(async () => [
      createMockAccount({ id: "account-1", name: "Account 1" }),
      createMockAccount({
        id: "account-2",
        name: "Account 2",
        currentBalance: 0,
      }),
    ])

    const result = await getMatrixData(4)

    // The function should still work, but we should verify that missing balances are handled correctly
    // Missing balances should default to 0
    expect(Option.isSome(result)).toBe(true)

    if (Option.isSome(result)) {
      const matrixData = Option.getOrThrow(result)
      // Account 2 should have correct values: newest first, then oldest
      const account2Row = matrixData.rows.find((row) => row.id === "account-2")
      expect(account2Row).toBeDefined()
      // cells[0] = newest snapshot (2023-02-01) = 275000
      // cells[1] = oldest snapshot (2023-01-01) = 0 (missing balance defaults to 0)
      expect(account2Row?.cells[0].amount).toBe(275000) // Has balance in newest snapshot
      expect(account2Row?.cells[1].amount).toBe(0) // Missing balance in oldest snapshot defaults to 0

      // Verify sum row calculations
      const sumRow = matrixData.rows.find((row) => row.id === "sum")
      expect(sumRow).toBeDefined()
      // Sum row should contain snapshot.totalLiquidity values
      expect(sumRow?.cells[0].amount).toBe(1000000) // newest snapshot totalLiquidity
      expect(sumRow?.cells[1].amount).toBe(1000000) // oldest snapshot totalLiquidity
      expect(sumRow?.cells[2].amount).toBe(500000) // current balance sum (500000 + 0)
    }

    expect(mockGetSnapshotDetails).toHaveBeenCalledWith(4)
    expect(mockGetAccounts).toHaveBeenCalled()
  })
})

// ============================================================================
// Neue Tests für getForecastData()
// ============================================================================

describe("getForecastData", () => {
  beforeEach(() => {
    // Clear mock state before each test
    mockGetLatestAssetSnapshot.mockClear()
    mockGetRecurringItems.mockClear()
    mockGetScenarioItems.mockClear()
    mockGetSettings.mockClear()
  })

  // ========================================================================
  // Happy Path Tests
  // ========================================================================

  test("should return ForecastTimelineData with complete data availability", async () => {
    // Setup mock return values - alle DB-Funktionen liefern gültige Daten
    const mockSnapshot = createMockAssetSnapshot(new Date("2023-12-01"))
    const mockRecurringItems = [
      createMockRecurringItem({ name: "Miete", amount: -120000 }),
      createMockRecurringItem({
        name: "Gehalt",
        amount: 3000000,
        interval: RecurringItemInterval.MONTHLY,
      }),
      createMockRecurringItem({
        name: "Versicherung",
        amount: -80000,
        interval: RecurringItemInterval.QUARTERLY,
        dueMonth: 3,
      }),
      createMockRecurringItem({
        name: "Kfz-Steuer",
        amount: -30000,
        interval: RecurringItemInterval.YEARLY,
        dueMonth: 7,
      }),
    ]
    const mockScenarioItems = [
      createMockScenarioItem(new Date("2024-06-15"), {
        name: "Urlaub",
        amount: -200000,
      }),
      createMockScenarioItem(new Date("2024-12-01"), {
        name: "Weihnachtsgeld",
        amount: 1000000,
      }),
      createMockScenarioItem(new Date("2024-08-01"), {
        name: "Neues Auto",
        amount: -2500000,
        isActive: false,
      }), // inaktives Szenario
    ]

    mockGetLatestAssetSnapshot.mockImplementation(async () =>
      Option.some(mockSnapshot),
    )
    mockGetRecurringItems.mockImplementation(async () => mockRecurringItems)
    mockGetScenarioItems.mockImplementation(async () => mockScenarioItems)
    mockGetSettings.mockImplementation(async () =>
      Option.some(createMockSettings()),
    )

    const result = await getForecastData()

    expect(Option.isSome(result)).toBe(true)
    const forecastData = Option.getOrThrow(result)

    // Verify structure
    expect(forecastData.startAmount).toBe(1000000) // 10000.00 EUR in Cents
    expect(forecastData.recurringItems).toHaveLength(4)
    expect(forecastData.scenarios).toHaveLength(3)

    // Verify RecurringItemInterval types
    expect(forecastData.recurringItems[0].interval).toBe(
      RecurringItemInterval.MONTHLY,
    )
    expect(forecastData.recurringItems[2].interval).toBe(
      RecurringItemInterval.QUARTERLY,
    )
    expect(forecastData.recurringItems[3].interval).toBe(
      RecurringItemInterval.YEARLY,
    )

    // Verify scenario isActive handling (both active and inactive scenarios are included)
    expect(forecastData.scenarios[0].isActive).toBe(true)
    expect(forecastData.scenarios[1].isActive).toBe(true)
    expect(forecastData.scenarios[2].isActive).toBe(false)

    expect(mockGetLatestAssetSnapshot).toHaveBeenCalled()
    expect(mockGetRecurringItems).toHaveBeenCalled()
    expect(mockGetScenarioItems).toHaveBeenCalled()
    expect(mockGetSettings).toHaveBeenCalled()
  })

  test("should handle various RecurringItemInterval types correctly", async () => {
    // Setup mock return values - verschiedene Intervalle
    const mockSnapshot = createMockAssetSnapshot(new Date("2023-12-01"))
    const mockRecurringItems = [
      createMockRecurringItem({
        name: "Monatliche Zahlung",
        interval: RecurringItemInterval.MONTHLY,
        dueMonth: null,
      }),
      createMockRecurringItem({
        name: "Quartalszahlung",
        interval: RecurringItemInterval.QUARTERLY,
        dueMonth: 3,
      }),
      createMockRecurringItem({
        name: "Jährliche Zahlung",
        interval: RecurringItemInterval.YEARLY,
        dueMonth: 12,
      }),
    ]

    mockGetLatestAssetSnapshot.mockImplementation(async () =>
      Option.some(mockSnapshot),
    )
    mockGetRecurringItems.mockImplementation(async () => mockRecurringItems)
    mockGetScenarioItems.mockImplementation(async () => [])
    mockGetSettings.mockImplementation(async () =>
      Option.some(createMockSettings()),
    )

    const result = await getForecastData()

    expect(Option.isSome(result)).toBe(true)
    const forecastData = Option.getOrThrow(result)

    // Verify all interval types are preserved
    expect(forecastData.recurringItems[0].interval).toBe(
      RecurringItemInterval.MONTHLY,
    )
    expect(forecastData.recurringItems[1].interval).toBe(
      RecurringItemInterval.QUARTERLY,
    )
    expect(forecastData.recurringItems[2].interval).toBe(
      RecurringItemInterval.YEARLY,
    )

    // Verify dueMonth handling
    expect(forecastData.recurringItems[0].dueMonth).toBeNull() // MONTHLY
    expect(forecastData.recurringItems[1].dueMonth).toBe(3) // QUARTERLY
    expect(forecastData.recurringItems[2].dueMonth).toBe(12) // YEARLY
  })

  test("should distinguish between active and inactive scenarios", async () => {
    // Setup mock return values - aktive vs. inaktive Szenarien
    const mockSnapshot = createMockAssetSnapshot(new Date("2023-12-01"))
    const mockRecurringItems = [createMockRecurringItem()]
    const mockScenarioItems = [
      createMockScenarioItem(new Date("2024-06-01"), { isActive: true }),
      createMockScenarioItem(new Date("2024-07-01"), { isActive: false }),
      createMockScenarioItem(new Date("2024-08-01"), { isActive: true }),
    ]

    mockGetLatestAssetSnapshot.mockImplementation(async () =>
      Option.some(mockSnapshot),
    )
    mockGetRecurringItems.mockImplementation(async () => mockRecurringItems)
    mockGetScenarioItems.mockImplementation(async () => mockScenarioItems)
    mockGetSettings.mockImplementation(async () =>
      Option.some(createMockSettings()),
    )

    const result = await getForecastData()

    expect(Option.isSome(result)).toBe(true)
    const forecastData = Option.getOrThrow(result)

    // Verify all scenarios are included (function doesn't filter by isActive)
    expect(forecastData.scenarios).toHaveLength(3)

    // Verify isActive flags are preserved
    expect(forecastData.scenarios[0].isActive).toBe(true)
    expect(forecastData.scenarios[1].isActive).toBe(false)
    expect(forecastData.scenarios[2].isActive).toBe(true)
  })

  // ========================================================================
  // Edge Case Tests
  // ========================================================================

  test("should return Option.none when no latest snapshot available", async () => {
    // Setup mock return values - kein Latest Snapshot
    mockGetLatestAssetSnapshot.mockImplementation(async () => Option.none())
    mockGetRecurringItems.mockImplementation(async () => [
      createMockRecurringItem(),
    ])
    mockGetScenarioItems.mockImplementation(async () => [
      createMockScenarioItem(),
    ])
    mockGetSettings.mockImplementation(async () =>
      Option.some(createMockSettings()),
    )

    const result = await getForecastData()

    expect(Option.isNone(result)).toBe(true)
    expect(mockGetLatestAssetSnapshot).toHaveBeenCalled()
    expect(mockGetRecurringItems).toHaveBeenCalled()
    expect(mockGetScenarioItems).toHaveBeenCalled()
    expect(mockGetSettings).toHaveBeenCalled()
  })

  test("should return Option.none when recurring items array is empty", async () => {
    // Setup mock return values - leere Recurring Items
    mockGetLatestAssetSnapshot.mockImplementation(async () =>
      Option.some(createMockAssetSnapshot()),
    )
    mockGetRecurringItems.mockImplementation(async () => []) // Leeres Array
    mockGetScenarioItems.mockImplementation(async () => [
      createMockScenarioItem(),
    ])
    mockGetSettings.mockImplementation(async () =>
      Option.some(createMockSettings()),
    )

    const result = await getForecastData()

    expect(Option.isNone(result)).toBe(true)
    expect(mockGetLatestAssetSnapshot).toHaveBeenCalled()
    expect(mockGetRecurringItems).toHaveBeenCalled()
    expect(mockGetScenarioItems).toHaveBeenCalled()
    expect(mockGetSettings).toHaveBeenCalled()
  })

  test("should return Option.none when recurring items array length is 0", async () => {
    // Setup mock return values - explizit leere Recurring Items
    mockGetLatestAssetSnapshot.mockImplementation(async () =>
      Option.some(createMockAssetSnapshot()),
    )
    mockGetRecurringItems.mockImplementation(async () => []) // Array.length = 0
    mockGetScenarioItems.mockImplementation(async () => [])
    mockGetSettings.mockImplementation(async () =>
      Option.some(createMockSettings()),
    )

    const result = await getForecastData()

    expect(Option.isNone(result)).toBe(true)
    expect(mockGetSettings).toHaveBeenCalled()
  })

  test("should handle empty scenario items array gracefully", async () => {
    // Setup mock return values - leere Scenario Items
    mockGetLatestAssetSnapshot.mockImplementation(async () =>
      Option.some(createMockAssetSnapshot()),
    )
    mockGetRecurringItems.mockImplementation(async () => [
      createMockRecurringItem(),
    ])
    mockGetScenarioItems.mockImplementation(async () => []) // Leeres Array
    mockGetSettings.mockImplementation(async () =>
      Option.some(createMockSettings()),
    )

    const result = await getForecastData()

    expect(Option.isSome(result)).toBe(true)
    const forecastData = Option.getOrThrow(result)

    expect(forecastData.startAmount).toBe(1000000)
    expect(forecastData.recurringItems).toHaveLength(1)
    expect(forecastData.scenarios).toHaveLength(0)

    expect(mockGetLatestAssetSnapshot).toHaveBeenCalled()
    expect(mockGetRecurringItems).toHaveBeenCalled()
    expect(mockGetScenarioItems).toHaveBeenCalled()
    expect(mockGetSettings).toHaveBeenCalled()
  })

  test("should handle combination of edge cases - no snapshot and empty recurring items", async () => {
    // Setup mock return values - Kombination aus Edge Cases
    mockGetLatestAssetSnapshot.mockImplementation(async () => Option.none())
    mockGetRecurringItems.mockImplementation(async () => [])
    mockGetScenarioItems.mockImplementation(async () => [])
    mockGetSettings.mockImplementation(async () =>
      Option.some(createMockSettings()),
    )

    const result = await getForecastData()

    expect(Option.isNone(result)).toBe(true)
    expect(mockGetSettings).toHaveBeenCalled()
  })

  test("should handle edge case - empty recurring items with snapshot and scenarios", async () => {
    // Setup mock return values - Kombination aus Edge Cases
    mockGetLatestAssetSnapshot.mockImplementation(async () =>
      Option.some(createMockAssetSnapshot()),
    )
    mockGetRecurringItems.mockImplementation(async () => []) // empty recurring items
    mockGetScenarioItems.mockImplementation(async () => [
      createMockScenarioItem(),
    ]) // has scenarios
    mockGetSettings.mockImplementation(async () =>
      Option.some(createMockSettings()),
    )

    const result = await getForecastData()

    expect(Option.isNone(result)).toBe(true) // Still returns none because recurring items are empty
    expect(mockGetSettings).toHaveBeenCalled()
  })

  test("should return Option.none when getSettings returns Option.none", async () => {
    mockGetLatestAssetSnapshot.mockImplementation(async () =>
      Option.some(createMockAssetSnapshot()),
    )
    mockGetRecurringItems.mockImplementation(async () => [
      createMockRecurringItem(),
    ])
    mockGetScenarioItems.mockImplementation(async () => [
      createMockScenarioItem(),
    ])
    mockGetSettings.mockImplementation(async () => Option.none())

    const result = await getForecastData()

    expect(Option.isNone(result)).toBe(true)
    expect(mockGetLatestAssetSnapshot).toHaveBeenCalled()
    expect(mockGetRecurringItems).toHaveBeenCalled()
    expect(mockGetScenarioItems).toHaveBeenCalled()
    expect(mockGetSettings).toHaveBeenCalled()
  })

  // ========================================================================
  // Error Handling Tests
  // ========================================================================

  test("should handle database connection error in getLatestAssetSnapshot", async () => {
    // Setup mock to throw error in getLatestAssetSnapshot
    mockGetLatestAssetSnapshot.mockImplementation(async () => {
      throw new Error("Database connection failed")
    })
    mockGetRecurringItems.mockImplementation(async () => [
      createMockRecurringItem(),
    ])
    mockGetScenarioItems.mockImplementation(async () => [
      createMockScenarioItem(),
    ])
    mockGetSettings.mockImplementation(async () =>
      Option.some(createMockSettings()),
    )

    await expect(getForecastData()).rejects.toThrow(
      "Database connection failed",
    )
  })

  test("should handle database connection error in getRecurringItems", async () => {
    mockGetLatestAssetSnapshot.mockImplementation(async () =>
      Option.some(createMockAssetSnapshot()),
    )
    mockGetRecurringItems.mockImplementation(async () => {
      throw new Error("Database connection failed")
    })
    mockGetScenarioItems.mockImplementation(async () => [
      createMockScenarioItem(),
    ])
    mockGetSettings.mockImplementation(async () =>
      Option.some(createMockSettings()),
    )

    await expect(getForecastData()).rejects.toThrow(
      "Database connection failed",
    )
  })

  test("should handle database connection error in getScenarioItems", async () => {
    mockGetLatestAssetSnapshot.mockImplementation(async () =>
      Option.some(createMockAssetSnapshot()),
    )
    mockGetRecurringItems.mockImplementation(async () => [
      createMockRecurringItem(),
    ])
    mockGetScenarioItems.mockImplementation(async () => {
      throw new Error("Database connection failed")
    })
    mockGetSettings.mockImplementation(async () =>
      Option.some(createMockSettings()),
    )

    await expect(getForecastData()).rejects.toThrow(
      "Database connection failed",
    )
  })

  test("should handle database connection error in getSettings", async () => {
    mockGetLatestAssetSnapshot.mockImplementation(async () =>
      Option.some(createMockAssetSnapshot()),
    )
    mockGetRecurringItems.mockImplementation(async () => [
      createMockRecurringItem(),
    ])
    mockGetScenarioItems.mockImplementation(async () => [
      createMockScenarioItem(),
    ])
    mockGetSettings.mockImplementation(async () => {
      throw new Error("Database connection failed")
    })

    await expect(getForecastData()).rejects.toThrow(
      "Database connection failed",
    )
  })

  // ========================================================================
  // TypeScript Type Validation Tests
  // ========================================================================

  test("should validate ForecastTimelineData structure", async () => {
    // Setup mock return values
    const mockSnapshot = createMockAssetSnapshot(new Date("2023-12-01"), {
      totalLiquidity: 2500000,
    }) // 25000.00 EUR
    const mockRecurringItems = [createMockRecurringItem({ amount: -150000 })]
    const mockScenarioItems = [
      createMockScenarioItem(new Date("2024-03-01"), { amount: -500000 }),
    ]

    mockGetLatestAssetSnapshot.mockImplementation(async () =>
      Option.some(mockSnapshot),
    )
    mockGetRecurringItems.mockImplementation(async () => mockRecurringItems)
    mockGetScenarioItems.mockImplementation(async () => mockScenarioItems)
    mockGetSettings.mockImplementation(async () =>
      Option.some(createMockSettings()),
    )

    const result = await getForecastData()

    expect(Option.isSome(result)).toBe(true)
    const forecastData = Option.getOrThrow(result)

    // Type validation for startAmount (number in cents)
    expect(typeof forecastData.startAmount).toBe("number")
    expect(forecastData.startAmount).toBe(2500000)
    expect(Number.isInteger(forecastData.startAmount)).toBe(true)

    // Type validation for recurringItems (Array of RecurringItem)
    expect(Array.isArray(forecastData.recurringItems)).toBe(true)
    expect(forecastData.recurringItems[0]).toHaveProperty("id")
    expect(forecastData.recurringItems[0]).toHaveProperty("name")
    expect(forecastData.recurringItems[0]).toHaveProperty("amount")
    expect(forecastData.recurringItems[0]).toHaveProperty("interval")
    expect(forecastData.recurringItems[0]).toHaveProperty("dueMonth")

    // Type validation for scenarios (Array of ScenarioItem)
    expect(Array.isArray(forecastData.scenarios)).toBe(true)
    expect(forecastData.scenarios[0]).toHaveProperty("id")
    expect(forecastData.scenarios[0]).toHaveProperty("name")
    expect(forecastData.scenarios[0]).toHaveProperty("amount")
    expect(forecastData.scenarios[0]).toHaveProperty("date")
    expect(forecastData.scenarios[0]).toHaveProperty("isActive")

    // Verify months property is optional (not present)
    expect(forecastData.months).toBeUndefined()
  })

  test("should handle Option.fromNullable() and Option.getOrThrow() correctly", async () => {
    // Setup mock return values
    mockGetLatestAssetSnapshot.mockImplementation(async () =>
      Option.some(createMockAssetSnapshot()),
    )
    mockGetRecurringItems.mockImplementation(async () => [
      createMockRecurringItem(),
    ])
    mockGetScenarioItems.mockImplementation(async () => [
      createMockScenarioItem(),
    ])
    mockGetSettings.mockImplementation(async () =>
      Option.some(createMockSettings()),
    )

    const result = await getForecastData()

    // Ensure Option.getOrThrow() doesn't fail with valid data
    expect(Option.isSome(result)).toBe(true)
    expect(() => Option.getOrThrow(result)).not.toThrow()

    const forecastData = Option.getOrThrow(result)
    expect(forecastData).toBeDefined()
    expect(forecastData.startAmount).toBeDefined()
  })
})

// Cleanup after all tests - Bun doesn't have clearAllMocks, individual mocks are cleared in beforeEach
