# Financy Forecast

## DB

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
bun run scripts/create-tables.ts create

# Datenbank zurücksetzen (drop + create)
bun run scripts/create-tables.ts reset

# Alle Tabellen löschen
bun run scripts/create-tables.ts drop

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
bun run scripts/seed-dev.ts seed

# Alle Beispieldaten löschen
bun run scripts/seed-dev.ts clear
```

## Todo

* data.ts should only contain data loading and no render logic to easily split data loading into separate backend when needed
* Translate comments in shemas.ts file
* use server-only package to not leak DB connection details for security
* move sidebar toggl from contet header to sidebar header and create an icon sidebar in collapsed version. Create a "screen to small" for anything below tablet size, this doesn't make sense!
* isActive in sidebar isn't working at the monent
* forward root to dashboard route
* eslint und typescript configs sind noch vom `bun create next-app@latest` die v15 versionen vom monorepo müssen aktulisiert werden

## Done

* schemas and DB read/write/create/seed things created by AI
* pages
* sidebar
* add shadcn
* create v16 next app