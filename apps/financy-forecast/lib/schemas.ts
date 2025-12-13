import { z } from "zod";

// -----------------------------------------------------------------------------
// Enums
// -----------------------------------------------------------------------------

/**
 * Kategorie eines Accounts.
 * - LIQUID: Flüssige Mittel (Girokonto, Tagesgeld).
 * - RETIREMENT: Altersvorsorge/Anlagen (Depot, Festgeld), zählen nicht zur unmittelbaren Liquidität.
 */
export enum AccountCategory {
    LIQUID = "LIQUID",
    RETIREMENT = "RETIREMENT",
}

/**
 * Zahlungsintervall für wiederkehrende Posten.
 */
export enum RecurringItemInterval {
    MONTHLY = "MONTHLY",
    QUARTERLY = "QUARTERLY",
    YEARLY = "YEARLY",
}

// Zod Schemas für Enums
export const accountCategorySchema = z.enum(Object.values(AccountCategory));
export const recurringItemIntervalSchema = z.enum(Object.values(RecurringItemInterval));

// -----------------------------------------------------------------------------
// Datenmodelle
// -----------------------------------------------------------------------------

/**
 * A. Account (Konten)
 * Repräsentiert ein Bankkonto oder Depot.
 */
export const accountSchema = z.object({
    /** Eindeutige ID des Accounts (UUID) */
    id: z.uuid(),
    /** Name des Accounts (z.B. "Sparkasse") */
    name: z.string().min(1, "Name ist erforderlich"),
    /** Kategorie des Accounts (LIQUID oder RETIREMENT) */
    category: accountCategorySchema,
    /** Aktueller Kontostand in Cents (Integer) zur Performance-Optimierung */
    currentBalance: z.number().int(),
});

export type Account = z.infer<typeof accountSchema>;

/**
 * B. AssetSnapshot (Monatliche Ist-Stände)
 * Repräsentiert den Status am 1. eines Monats.
 * Dient als Historie und Basis für Prognosen.
 */
export const assetSnapshotSchema = z.object({
    /** Eindeutige ID des Snapshots (UUID) */
    id: z.uuid(),
    /** Datum des Snapshots (Immer der 1. des Monats) */
    date: z.date(),
    /** Gesamte Liquidität in Cents (Summe aller LIQUID Accounts zum Zeitpunkt des Snapshots) */
    totalLiquidity: z.number().int(),
    /** True, wenn das Datum in der Zukunft liegt (Prognose), False für historische Daten */
    isProvisional: z.boolean(),
});

export type AssetSnapshot = z.infer<typeof assetSnapshotSchema>;

/**
 * C. AccountBalanceDetail
 * Verknüpfungstabelle für den Kontostand eines Accounts innerhalb eines Snapshots.
 * Ermöglicht die detaillierte Aufschlüsselung der Vermögenswerte pro Monat.
 */
export const accountBalanceDetailSchema = z.object({
    /** Eindeutige ID des Details (UUID) */
    id: z.uuid(),
    /** Referenz auf den Snapshot (FK) */
    snapshotId: z.uuid(),
    /** Referenz auf den Account (FK) */
    accountId: z.uuid(),
    /** Betrag in Cents (Integer) zu diesem Zeitpunkt */
    amount: z.number().int(),
});

export type AccountBalanceDetail = z.infer<typeof accountBalanceDetailSchema>;

/**
 * D. RecurringItem (Fixkosten & Regelmäßige Einnahmen)
 * Definition von wiederkehrenden Zahlungen wie Miete, Gehalt, Abos.
 */
export const recurringItemSchema = z.object({
    /** Eindeutige ID des Items (UUID) */
    id: z.uuid(),
    /** Name der Position (z.B. "Miete", "Gehalt") */
    name: z.string().min(1, "Name ist erforderlich"),
    /** Betrag in Cents (Integer). Positiv für Einnahmen, negativ für Ausgaben. */
    amount: z.number().int(),
    /** Zahlungsintervall (MONTHLY, QUARTERLY, YEARLY) */
    interval: recurringItemIntervalSchema,
    /**
     * Fälligkeitsmonat (1-12).
     * Relevant für QUARTERLY (Startmonat des Quartals) und YEARLY (Monat der Zahlung).
     * Kann bei MONTHLY ignoriert werden.
     */
    dueMonth: z.number().int().min(1).max(12).optional().nullable(),
});

export type RecurringItem = z.infer<typeof recurringItemSchema>;

/**
 * E. ScenarioItem (Szenarien / Einmalzahlungen)
 * Einmalige Zahlungen oder geplante Szenarien für die Prognose (z.B. "Urlaub", "Steuerrückzahlung").
 */
export const scenarioItemSchema = z.object({
    /** Eindeutige ID des Szenarios (UUID) */
    id: z.uuid(),
    /** Name des Szenarios (z.B. "Urlaub Sommer") */
    name: z.string().min(1, "Name ist erforderlich"),
    /** Betrag in Cents (Integer). Positiv für Einnahmen, negativ für Ausgaben. */
    amount: z.number().int(),
    /** Datum der Zahlung. Szenarien sind immer einem Monat zugeordnet. Pflichtfeld! */
    date: z.date(),
    /**
     * Status des Szenarios.
     * Wenn true, wird es in der Prognose einberechnet.
     * Wenn false, wird es ignoriert (Szenario inaktiv).
     * Default: true.
     */
    isActive: z.boolean().default(true),
});

export type ScenarioItem = z.infer<typeof scenarioItemSchema>;

/**
 * F. Settings
 * Globale Einstellungen für die Anwendung.
 */
export const settingsSchema = z.object({
    /** Geschätzte monatliche variable Kosten in Cents (Integer). Wird für die Prognose verwendet. */
    estimatedMonthlyVariableCosts: z.number().int(),
});

export type Settings = z.infer<typeof settingsSchema>;
