# Projekt-Spezifikation: FinanceForecast

Spec: https://aistudio.google.com/prompts/1w5u-FkSTDt0-sYugbmB9Lg3mzyZK090P
Mock: https://aistudio.google.com/apps/drive/1_0_TXcmelH7u4S926JuxcskajHI4LHUI?showAssistant=true&showPreview=true&resourceKey=

**Version:** 5.0 (Final)
**Ziel:** Ein Next.js Tool zur Verfolgung der privaten Finanzen mit Fokus auf Liquidität, Burn-Rate und interaktiver Runway-Simulation.

## 1. Technologie-Stack

*   **Framework:** Next.js (App Router).
*   **Sprache:** TypeScript.
*   **Styling:** Tailwind CSS + ShadCN UI (Components).
*   **Datenbank:** PostgreSQL (Lokal).
*   **ORM:** keins
*   **Interaktivität:** `dnd-kit` (für Drag & Drop).
*   **Währungslogik:** Speicherung als **Integer (Cents)**. Frontend-Anzeige in Euro (`/ 100`).

---

## 2. Datenmodell (Datenbank-Schema)

### A. `Account` (Konten)
*   `id`: UUID
*   `name`: String (z.B. "Sparkasse")
*   `category`: Enum (`LIQUID`, `RETIREMENT`)
*   `currentBalance`: Integer (Cents). *Zur Performance-Optimierung.*

### B. `AssetSnapshot` (Monatliche Ist-Stände)
Repräsentiert den Status am 1. eines Monats für vergangene Monate.
*   `id`: UUID
*   `date`: Date (Immer der 1. des Monats).
*   `totalLiquidity`: Integer (Cents, Summe LIQUID).
*   *Relation:* 1:n zu `AccountBalanceDetail`.

### C. `AccountBalanceDetail`
*   `id`: UUID
*   `snapshotId`: UUID (FK)
*   `accountId`: UUID (FK)
*   `amount`: Integer (Cents).

### D. `RecurringItem` (Fixkosten & Regelmäßige Einnahmen)
*   `id`: UUID
*   `name`: String
*   `amount`: Integer (Cents, +/-).
*   `interval`: Enum (`MONTHLY`, `QUARTERLY`, `YEARLY`).
*   `dueMonth`: Integer (1-12, relevant für Q/Y).

### E. `ScenarioItem` (Szenarien / Einmalzahlungen)
*   `id`: UUID
*   `name`: String
*   `amount`: Integer (Cents, +/-).
*   `date`: Date (**Pflichtfeld!** Szenarien sind immer einem Monat zugeordnet).
*   `isActive`: Boolean (Default: true).

### F. `Settings`
*   `estimatedMonthlyVariableCosts`: Integer (Cents).

---

## 3. Funktionale Module

### 3.1 Dashboard: Die Matrix-Ansicht
**Layout:**
*   Tabelle (Zeilen: Accounts, Spalten: Monate).
*   Zeile "Gesamtvermögen" (Summe der Spalte).
*   Zeile "Veränderung" (Delta zum Vormonat, farbig codiert).
*   Provisorischer Monat:
    *   Statt die Daten aus einem Snaphshot anzuzeigen, werden die aktuellen Daten aus der `account` Tabelle dargestellt, die die  nicht finalen Zahlen repräsentieren.
    *   "Est." = Label wenn der 1. des derauffolgenden Monats noch nicht erreicht ist, Daten sind provisorisch
    *   "✅" Emoji Button wenn der 1. des nächsten Monat erreicht ist und der Benutzer die richtigen Zahlen eingetragen hat. Durch den Button click wird ein Snapshot angelegt und die Details in der Entsprechenden Tabelle kopiert und mit dem Snapshot verlinkt. Jetzt kann wieder ein provisorischer Monat angelegt werden

**Interaktion:**
*   **Klick auf "+":** Provisorischen Monat anlegen. Öffnet Dialog "Werte für `Monat` eingeben", falls aktuell kein provisorischer Monat existiert
    *   Kein Datumswähler (Logik: `Letzter Snapshot + 1 Monat`).
    *   Eingabefelder für alle Konten.

### 3.2 Forecast Engine (Server-Side Logic)
**Berechnung:**
*   Iteriere Monat für Monat in die Zukunft (Zeitraum via URL-Parameter steuerbar, Default 24 Monate).
*   **Saldo-Logik pro Monat:**
    `Startkapital` (aus letztem Snapshot)
    `+` alle Recurring Items (die in diesem Monat fällig sind)
    `-` Variable Kosten (Wert aus Header)
    `+` alle **aktiven** Scenario Items (die auf diesen Monat datiert sind).

---

### 3.3 Forecast UI: Die interaktive Timeline

**A. Header Controls (Sticky Top):**
*   **Variable Kosten:** Input-Feld für "Geschätzte Variable Kosten (Monatlich)".
    *   Änderung löst sofortige Neuberechnung aus (Server Action).
*   **Zeitraum:** Input/Select für Anzahl der Monate.
*   **Szenarien:** Button "Alle Szenarien an/aus".
*   **Neues Szenario:** Button öffnet Modal.

**B. Eingabe-Logik (Modal für Szenarien):**
*   **Typ-Schalter:** Ein Toggle/Segmented Control ` **Einnahme (+)** | **Ausgabe (-)** `.
*   **Betrag:** Eingabefeld nimmt nur positive Zahlen entgegen.
*   **Speichern:** Backend speichert den Wert je nach Schalter als positiven oder negativen Integer.
*   **Datum:** Dropdown/Datepicker (Default: aktueller Monat).

**C. Layout der Timeline (Monats-Container):**

*   **Metriken & Status:**
    *   **Hauptzahl:** Prognostizierter Kontostand am Monatsende (Groß, Rot bei < 0).
    *   **Burn-Rate Block:**
        *   Zeile 1: "Ø Burn: -2.400 €" (Summe aus Fixkosten + Variablen Kosten).
        *   Zeile 2:
            *   "Fix: -1.200 €" -> **Klickbar!** Link scrollt zur Fixkosten-Verwaltung.
            *   "Var: -1.200 €" -> Statischer Text.

*   **Inhalt & Drop-Zone:**
    *   **Ebene 1 (Info - Fixkosten):**
        *   Textliche Auflistung von *fälligen* Jährlichen/Quartalsweisen Fixkosten.
        *   Monatliche Fixkosten werden ausgeblendet.
    *   **Ebene 2 (Interaktiv - Szenarien):**
        *   Liste der `ScenarioItems` als Cards/Chips.
        *   **Drag & Drop:** Verschieben in sichtbare Nachbarmonate möglich (via `dnd-kit`).
        *   **Klick auf Pencil Icon im Chip:** Öffnet Edit-Modal (siehe B, inkl. Möglichkeit das Datum weit in die Zukunft zu ändern).

---

### 3.4 Einstellungen & Fixkosten

**A. Variable Kosten Info:**
*   Anzeige: "Durchschnittliche Ausgaben der letzten 4 Monate: X €" (als Entscheidungshilfe für den Wert im Forecast-Header).

**B. Fixkosten-Liste (Recurring Items):**
*   Tabelle aller `RecurringItems`.
*   **Erstellen/Bearbeiten Dialog:**
    *   **Typ-Schalter:** [ **Einnahme** | **Ausgabe** ]. Ersetzt das manuelle Tippen von Minuszeichen.
    *   **Betrag:** Immer positive Zahl eingeben.
    *   **Intervall:** Dropdown (Monatlich, Quartalsweise, Jährlich).
    *   **Fälligkeit:** (Nur bei Q/Y) Dropdown für Startmonat.
