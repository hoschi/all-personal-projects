# Projekt-Spezifikation: FinanceForecast

Spec: https://aistudio.google.com/prompts/1w5u-FkSTDt0-sYugbmB9Lg3mzyZK090P
Mock: https://aistudio.google.com/apps/drive/1_0_TXcmelH7u4S926JuxcskajHI4LHUI?showAssistant=true&showPreview=true&resourceKey=

**Version:** 5.0 (Final)
**Ziel:** Ein Next.js Tool zur Verfolgung der privaten Finanzen mit Fokus auf Liquidität, Burn-Rate und interaktiver Runway-Simulation.

## 1. Technologie-Stack

- **Framework:** Next.js (App Router).
- **Sprache:** TypeScript.
- **Styling:** Tailwind CSS + ShadCN UI (Components).
- **Datenbank:** PostgreSQL (Lokal).
- **ORM:** keins
- **Interaktivität:** `dnd-kit` (für Drag & Drop).
- **Währungslogik:** Speicherung als **Integer (Cents)**. Frontend-Anzeige in Euro (`/ 100`).

---

## 2. Datenmodell (Datenbank-Schema)

### A. `Account` (Konten)

- `id`: UUID
- `name`: String (z.B. "Sparkasse")
- `category`: Enum (`LIQUID`, `RETIREMENT`)
- `currentBalance`: Integer (Cents). _Zur Performance-Optimierung._

### B. `AssetSnapshot` (Monatliche Ist-Stände)

Repräsentiert den Status am Ende eines Monats für vergangene Monate.

- `id`: UUID
- `date`: Date (Immer der letzte Tag des Monats).
- `totalLiquidity`: Integer (Cents, Summe LIQUID).
- _Relation:_ 1:n zu `AccountBalanceDetail`.

### C. `AccountBalanceDetail`

- `id`: UUID
- `snapshotId`: UUID (FK)
- `accountId`: UUID (FK)
- `amount`: Integer (Cents).

### D. `RecurringItem` (Fixkosten & Regelmäßige Einnahmen)

- `id`: UUID
- `name`: String
- `amount`: Integer (Cents, +/-).
- `interval`: Enum (`MONTHLY`, `QUARTERLY`, `YEARLY`).
- `dueMonth`: Integer (1-12, relevant für Q/Y).

### E. `ScenarioItem` (Szenarien / Einmalzahlungen)

- `id`: UUID
- `name`: String
- `amount`: Integer (Cents, +/-).
- `date`: Date (**Pflichtfeld!** Szenarien sind immer einem Monat zugeordnet).
- `isActive`: Boolean (Default: true).

### F. `Settings`

- `estimatedMonthlyVariableCosts`: Integer (Cents).

---

## 3. Funktionale Module

### 3.1 Dashboard: Die Matrix-Ansicht

Am Anfang existiert kein Snapshot. Man trägt die Werte vom letzten Tag des Vormonats in `Accounts` über die Dashboard Ansicht ein und approved den ersten Snaphsot. Dieser bekommt als `date` den letzten Tag des Vormonats, als Beispiel den 31.3.2024. Ab jetzt läuft der normale Modus weiter. Man kann wann immer man möchte die aktuellen Kontostände in der Dashboard Ansicht eintragen. Ist der erste Tag des übernachsten Monats vom letzten Snapshot erreicht, können die aktuellen Werte approved werden und es wird ein neuer Snapshot angelegt der als Datum den letzten Tag des Vormonats bekommt. In unserem Bespiel kann also frühstens der nächste Snapshot angelegt werden wenn der 1.5.2024 erreicht ist und diese Aktion legt einen Snapshot an der als `date` den 30.4.2024 bekommt.

**Layout:**

- Tabelle (Zeilen: Accounts, Spalten: Monate).
- Zeile "Gesamtvermögen" (Summe der Spalte).
- Zeile "Veränderung" (Delta zum Vormonat, farbig codiert).
- Provisorischer Monat:
  - Statt die Daten aus einem Snaphshot anzuzeigen, werden die aktuellen Daten aus der `account` Tabelle dargestellt, die die nicht finalen Zahlen repräsentieren.
  - "Est." = Label wenn Daten provisorisch sind, da der heutige Tag noch zu früh ist um einen neuen Snapshot anzulegen
  - "✅" Emoji Button wenn ein Snapshot angelegt werden kann, da das heutige Datum entsprechend weit in der Zukunft liegt. Mit diesem Button click bestätigt ma die aktuellen Zahlen des vergangenen Monats.

**Interaktion:**

- **Klick auf "+":** Provisorischen Monat anlegen. Öffnet Dialog "Werte für `Monat` eingeben", falls aktuell kein provisorischer Monat existiert
  - Kein Datumswähler (Logik: `Letzter Snapshot + 1 Monat`).
  - Eingabefelder für alle Konten.

### 3.2 Forecast Engine (Server-Side Logic)

**Berechnung:**

- Iteriere Monat für Monat in die Zukunft (Zeitraum via URL-Parameter steuerbar, Default 24 Monate).
- **Saldo-Logik pro Monat:**
  `Startkapital` (aus letztem Snapshot)
  `+` alle Recurring Items (die in diesem Monat fällig sind)
  `-` Variable Kosten (Wert aus Header)
  `+` alle **aktiven** Scenario Items (die auf diesen Monat datiert sind).

---

### 3.3 Forecast UI: Die interaktive Timeline

**A. Header Controls (Sticky Top):**

- **Variable Kosten:** Input-Feld für "Geschätzte Variable Kosten (Monatlich)".
  - Änderung löst sofortige Neuberechnung aus (Server Action).
- **Zeitraum:** Input/Select für Anzahl der Monate.
- **Szenarien:** Button "Alle Szenarien an/aus".
- **Neues Szenario:** Button öffnet Modal.

**B. Eingabe-Logik (Modal für Szenarien):**

- **Typ-Schalter:** Ein Toggle/Segmented Control `**Einnahme (+)** | **Ausgabe (-)**`.
- **Betrag:** Eingabefeld nimmt nur positive Zahlen entgegen.
- **Speichern:** Backend speichert den Wert je nach Schalter als positiven oder negativen Integer.
- **Datum:** Dropdown/Datepicker (Default: aktueller Monat).

**C. Layout der Timeline (Monats-Container):**

- **Metriken & Status:**
  - **Hauptzahl:** Prognostizierter Kontostand am Monatsende (Groß, Rot bei < 0).
  - **Burn-Rate Block:**
    - Zeile 1: "Ø Burn: -2.400 €" (Summe aus Fixkosten + Variablen Kosten).
    - Zeile 2:
      - "Fix: -1.200 €" -> **Klickbar!** Link scrollt zur Fixkosten-Verwaltung.
      - "Var: -1.200 €" -> Statischer Text.

- **Inhalt & Drop-Zone:**
  - **Ebene 1 (Info - Fixkosten):**
    - Textliche Auflistung von _fälligen_ Jährlichen/Quartalsweisen Fixkosten.
    - Monatliche Fixkosten werden ausgeblendet.
  - **Ebene 2 (Interaktiv - Szenarien):**
    - Liste der `ScenarioItems` als Cards/Chips. Es werden _alle_ Szenarios für den Monat angezeigt. Aber für die Berechnung werden _nur_ die aktiven Szenarion herangezogen.
    - **Drag & Drop:** Verschieben in sichtbare Nachbarmonate möglich (via `dnd-kit`).
    - **Klick auf Pencil Icon im Chip:** Öffnet Edit-Modal (siehe B, inkl. Möglichkeit das Datum weit in die Zukunft zu ändern).

---

### 3.4 Einstellungen & Fixkosten

**A. Variable Kosten Info:**

- Anzeige: "Durchschnittliche Ausgaben der letzten 4 Monate: X €" (als Entscheidungshilfe für den Wert im Forecast-Header).

**B. Fixkosten-Liste (Recurring Items):**

- Tabelle aller `RecurringItems`.
- **Erstellen/Bearbeiten Dialog:**
  - **Typ-Schalter:** [ **Einnahme** | **Ausgabe** ]. Ersetzt das manuelle Tippen von Minuszeichen.
  - **Betrag:** Immer positive Zahl eingeben.
  - **Intervall:** Dropdown (Monatlich, Quartalsweise, Jährlich).
  - **Fälligkeit:** (Nur bei Q/Y) Dropdown für Startmonat.
