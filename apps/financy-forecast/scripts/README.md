# FinanceForecast Database Scripts

Diese Dokumentation beschreibt die erstellten Datenbank-Scripts für die FinanceForecast Anwendung.

## Übersicht

Die Scripts ermöglichen die Verwaltung einer lokalen PostgreSQL-Datenbank für die FinanceForecast App mit vollständiger CRUD-Funktionalität.

## Dateien

### 1. `lib/db.ts` - Datenbankverbindung und CRUD-Operationen

**Zweck:** Zentrale Datenbank-Verbindung und alle CRUD-Operationen für die FinanceForecast-Anwendung.

**Features:**
- PostgreSQL-Verbindung über `DATABASE_URL`
- Vollständige CRUD-Operationen für alle Entitäten:
  - **Accounts** - Kontenverwaltung (LIQUID, RETIREMENT)
  - **AssetSnapshots** - Monatliche Ist-Stände
  - **AccountBalanceDetail** - Verknüpfung zwischen Snapshots und Accounts
  - **RecurringItem** - Fixkosten & regelmäßige Einnahmen (MONTHLY, QUARTERLY, YEARLY)
  - **ScenarioItem** - Szenarien/Einmalzahlungen
  - **Settings** - Globale Einstellungen
- Utility-Funktionen für komplexe Abfragen
- Automatische Validierung über Zod-Schema
- Error Handling mit detaillierten Fehlermeldungen

**Verwendung:**
```typescript
import { getAccounts, createAccount, AccountCategory } from '../lib/db';

// Alle Konten abrufen
const accounts = await getAccounts();

// Neues Konto erstellen
const newAccount = await createAccount(
  'Meine Bank', 
  AccountCategory.LIQUID, 
  500000 // 5,000.00 €
);
```

### 2. `scripts/create-tables.sql` - Datenbank-Schema

**Zweck:** SQL-Schema für alle Tabellen der FinanceForecast-Anwendung.

**Tabellen:**
- `accounts` - Bankkonten und Depots
- `asset_snapshots` - Monatliche Vermögensstände
- `account_balance_details` - Detaillierte Kontostände pro Monat
- `recurring_items` - Wiederkehrende Zahlungen
- `scenario_items` - Einmalige Szenarien
- `settings` - Globale App-Einstellungen

**Features:**
- UUID-Primärschlüssel
- Foreign Key Constraints
- CHECK Constraints für Datenvalidierung
- Performance-Indizes
- Automatische Timestamps

### 3. `scripts/create-tables.ts` - Tabellenerstellungs-Script

**Zweck:** TypeScript-Wrapper für die Tabellenerstellung.

**Befehle:**
```bash
# Tabellen erstellen
npx tsx scripts/create-tables.ts create

# Datenbank zurücksetzen (drop + create)
npx tsx scripts/create-tables.ts reset

# Alle Tabellen löschen
npx tsx scripts/create-tables.ts drop

# Direkter SQL-Aufruf
psql $DATABASE_URL -f scripts/create-tables.sql
```

**Features:**
- Automatische PostgreSQL-Verbindung
- Befehlszeilen-Interface
- Fehlerbehandlung
- Status-Ausgabe

### 4. `scripts/seed-dev.ts` - Entwicklungsdaten

**Zweck:** Realistische Beispieldaten für Entwicklung und Testing.

**Beispieldaten:**
- **5 Konten:** 3 liquide (Sparkasse, ING DiBa, PayPal) + 2 Altersvorsorge (Comdirect, DAX ETF)
- **6 Monate Daten:** Juli-Dezember 2024 mit realistischen Kontostand-Verläufen
- **15 Recurring Items:** Miete, Gehalt, Versicherungen, etc.
- **9 Scenario Items:** Urlaub, Anschaffungen, etc. (aktiv/inaktiv)
- **Settings:** Standardvariable Kosten (1,200.00 €)

**Befehle:**
```bash
# Datenbank mit Beispieldaten füllen
npx tsx scripts/seed-dev.ts seed

# Alle Beispieldaten löschen
npx tsx scripts/seed-dev.ts clear
```

## Environment Setup

### 1. `.env` Datei erstellen
```env
DATABASE_URL=postgresql://username:password@localhost:5432/financy_forecast
```

### 2. PostgreSQL installieren (falls nicht vorhanden)
```bash
# macOS
brew install postgresql
brew services start postgresql

# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 3. Datenbank erstellen
```bash
createdb financy_forecast
```

### 4. Scripts ausführen
```bash
# 1. Tabellen erstellen
npx tsx scripts/create-tables.ts create

# 2. Beispieldaten einpflegen
npx tsx scripts/seed-dev.ts seed

# 3. App starten
npm run dev
```

## Datenmodell

### Entitäten-Beziehungen

```
Accounts (1) ←→ (n) AccountBalanceDetails (n) ←→ (1) AssetSnapshots
Settings (1) ←→ (n) AssetSnapshots
Settings (1) ←→ (n) ScenarioItems
RecurringItems (n) ←→ (1) Settings
```

### Währungslogik
- **Speicherung:** Integer in Cents (z.B. 125000 = 1,250.00 €)
- **Anzeige:** Division durch 100 für Euro-Darstellung
- **Berechnungen:** Direkte Integer-Arithmetik (keine Rundungsfehler)

### Enum-Werte
- **AccountCategory:** `LIQUID`, `RETIREMENT`
- **RecurringItemInterval:** `MONTHLY`, `QUARTERLY`, `YEARLY`

## Entwicklungshinweise

1. **Connection Pooling:** Für Produktionsumgebung Connection Pooling implementieren
2. **Migration:** Für Produktion Migrationssystem (z.B. Prisma Migrate) verwenden
3. **Validierung:** Alle Eingaben werden über Zod-Schema validiert
4. **Transaktionen:** Komplexe Operationen in Transaktionen wrappen
5. **Logs:** Alle DB-Operationen werden geloggt (nützlich für Debugging)

## Troubleshooting

### Häufige Probleme

1. **DATABASE_URL nicht gesetzt**
   ```bash
   echo "DATABASE_URL=postgresql://..." > .env
   ```

2. **PostgreSQL nicht erreichbar**
   ```bash
   pg_isready -h localhost -p 5432
   ```

3. **Tabellen existieren bereits**
   ```bash
   npx tsx scripts/create-tables.ts reset
   ```

4. **Import-Fehler in db.ts**
   ```bash
   npm install postgres
   ```

### Development-Workflow

1. **Neue Datenbank:** `create-tables.ts reset` → `seed-dev.ts seed`
2. **Schema ändern:** `create-tables.sql` aktualisieren → Script neu ausführen
3. **Daten zurücksetzen:** `seed-dev.ts clear` → `seed-dev.ts seed`
4. **Debugging:** `lib/db.ts` Funktionalität in Next.js-Components testen