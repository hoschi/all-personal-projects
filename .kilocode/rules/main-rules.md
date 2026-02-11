# AI Assistants

## Generelles

- Dokumentation von Code und Readmes sind _immer_ englisch, deine Antworten auf deutsch.
- Verwende _immer_ den MCP Server nie das CLI um mit `git` zu arbeiten
- Wenn du Problem angehst überlege ob dir Informationen aus der bestehenden Codebase helfen können. Dier steht in den meisten Roo Modi ein MCP Server zur Verfügung um die Code Base zu durchsuchen. Benutze diesen um mehr Informationen zu bekommen _bevor_ du an der Lösung arbeitest.
- Wenn du Dokumentation runterladen möchtest speichere diese im `tmp` Ordner damit sie nicht mit git comittet wird. Dokumentation oder andere Artefakte die du erstellen möchtest die zur Übergabe zwischen Roo Modi/Agenten oder aus Useranweisungen heraus generiert werden, speicherst du im `current` Ordner falls nicht anders angegeben/sinnvoll.

## AI ref

Lies diese Dateien wenn für die aktuelle Aufgabe sinnvoll oder du Probleme hast mit Dingen die hier thematisiert werden. Aktuelle Dokumentation zu bekommen ist wichtig da deine Trainingsdaten veraltet sein können.

- `ai-ref/tan-stack-llms.txt`: Links zu Tan Stack Dokumentation um aktuelle und detailierter Informationen zu bekommen.
- [Next JS llms.txt](https://nextjs.org/docs/llms-full.txt): Komplette Dokumentation vom Next JS v16 Framework

## 🔧 Kritische Projekt-Konfiguration

### Package Manager: Bun statt NPM

- **Problem**: Das Repo verwendet `bun` als Package Manager, nicht `npm`
- **Lösung**: Immer `bun run` statt `npm run` verwenden und `bunx` statt `npx`

### .env.example vs .env

- **Problem**: dotenv lädt standardmäßig `.env`, nicht `.env.example`
- **Lösung**: `cp .env.example .env` ausführen falls `.env` nicht verfügbar oder `.env` lesen um zu überprüfen ob alle benötigten Keys verfügbar sind

## Frontend Applikationen

### shadcn instructions

Verwende die neueste Version von Shadcn, um neue Komponenten zu installieren, beispielsweise diesen Befehl, um eine Button Komponente hinzuzufügen:

```bash
bunx shadcn@latest add button
```

## 🗄️ PostgreSQL-spezifische Erkenntnisse

### Schema-Parameter in URLs: PostgreSQL vs Prisma

- **Problem**: PostgreSQL-URLs unterstützen **KEINEN** `schema=` Parameter. Dieser funktioniert nur in Projekten die Prisma verwenden, dort ist er OK. Manche Projekte benutzen Prisma, andere PostgreSQL direkt. Der Unterschied ist wichtig!
- **Falsch für Projekte ohne Prisma**: `postgresql://user:pass@host:port/db?schema=financy_forecast`
- **Korrekt**: `postgresql://user:pass@host:port/db?sslmode=disable`
- **Lösung**: Schema über `SET search_path TO financy_forecast;` nach Verbindung setzen wenn nicht Prisma sondern Postgresql direkt verwendet wird

### PostgreSQL 17 Kompatibilität

- **Problem**: `uuid-ossp` Extension ist in PostgreSQL 17 veraltet
- **Problem**: `gen_random_uuid()` ist in PostgreSQL 17 bereits eingebaut
- **Lösung**: Extension-Zeile entfernen und nur `gen_random_uuid()` verwenden

### Schema-Namen mit Bindestrich

- **Problem**: `financy-forecast` (mit Bindestrich) verursacht SQL-Syntaxfehler
- **Lösung**: `financy_forecast` (mit Unterstrich) verwenden

### SSL-Konfiguration für lokale Entwicklung

- **Problem**: Lokale PostgreSQL-Server unterstützen oft kein SSL
- **Falsch**: `sslmode=require`
- **Korrekt**: `sslmode=disable`

---

## 💻 Shell- und Scripting-Probleme

### Shell-Escaping bei komplexen SQL-Befehlen

- **Problem**: Direktes Einfügen von SQL in `-c` Parameter verursacht Escaping-Probleme
- **Lösung**: Temporäre SQL-Dateien verwenden:

```typescript
const tempSqlFile = "/tmp/temp_seed_sql.sql"
writeFileSync(
  tempSqlFile,
  `SET search_path TO financy_forecast, public; ${sql}`,
)
execSync(`psql "${DATABASE_URL}" -f "${tempSqlFile}"`, {
  stdio: "pipe",
  env: process.env,
})
unlinkSync(tempSqlFile)
```

### PostgreSQL Template-Commands

- **Problem**: `\i` (include) funktioniert nicht mit `-c` Parameter
- **Lösung**: Separate `-f` Parameter für Dateien verwenden

---

## 🗃️ Datenbankdesign-Patterns

### Schema-Management für Multi-Tenant Apps

- **Pattern**: Jedes Projekt bekommt eigenes Schema (`financy_forecast`)
- **Vorteil**: Saubere Trennung zwischen Projekten

### Singleton-Tabellen (Settings)

- **Pattern**: Settings-Tabelle mit fester UUID als Primary Key
- **SQL Beispiel**:

```sql
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000000',
    estimated_monthly_variable_costs BIGINT NOT NULL DEFAULT 0
);
```

---

## 🏗️ Prisma und Datenbank-Migrations-Patterns

### Prisma 7 Architektur

- **Problem**: Prisma 7 erfordert datasource URL in prisma.config.ts, nicht in schema.prisma
- **Lösung**: Erstelle prisma.config.ts im Projekt-Root mit korrektem defineConfig, siehe `apps/box-storage/prisma.config.ts`
- **Erkenntnis**: Schema.prisma enthält nur provider und Models, keine URL

### Testing-Praktiken für Migrationen

- **Problem**: Große Migrationen brauchen Validierung vor Ausführung
- **Lösung**: Vollständige Test-Scripts mit Prisma oder DB Client erstellen
- **Pattern**: test-queries.ts mit allen Business-Funktionen schreiben und mit Bun ausführen um Funtionalität zu testen

### Server Actions: Auth & Validierung

- **Auth-Check bei Mutationen**: Bei Update/Write-Server-Funktionen immer Ownership prüfen (z.B. `item.ownerId === userId`), sonst können fremde Items geändert werden.
- **Zod 4 inputValidator Bug**: `.parse` nicht als bare Callback-Funktion übergeben (bindet `this` falsch). Immer wrappen:
  - `inputValidator((data) => schema.parse(data))`
  - oder `const parsed = schema.safeParse(data)` und `parsed.data` verwenden.

### Sicheres Backfill für neue NOT NULL Spalten

- **Problem**: Eine neue Pflichtspalte (NOT NULL) in bestehende Tabellen schlägt fehl, weil vorhandene Zeilen keinen Wert haben.
- **Lösung**: Eine gestufte Migration mit Daten-Backfill dazwischen.
- **Schritte**:
  1. Neue Spalten als nullable hinzufügen (kein Default).
  2. Daten backfillen (z.B. `bun run scripts/seed-dev.ts` oder ein einmaliges Script).
  3. Spalten auf NOT NULL setzen und die zweite Migration anwenden.

---

## 🔍 Debug Logging mit `debug` Bibliothek

### Anwendung auf Actions und Database Code

- **Debug-Logger Setup**: `const debug = Debug('app:category:functionName')`
- **Kategorien**: `db` für Database-Funktionen, `action` für Server Actions
- **Präfix-Struktur**: `app:category:functionName` (z.B. `app:db:updateScenarioIsActive`, `app:action:handleSaveForecastDirect`)
- **Variablenname**: Immer `debug` für Konsistenz verwenden
- **Funktion-lokal**: Debug-Logger am Anfang jeder Funktion erstellen
- **Aktivierung**: `DEBUG=app:db:*`, `DEBUG=app:action:*`, oder `DEBUG=app:*` für selektives Logging
- **Zweck**: `app:` Präfix unterscheidet Application-Logs von Third-Party-Logs

### Beispiel Implementation

```typescript
// Database Function
export async function updateScenarioIsActive(id: string, isActive: boolean) {
  const debug = Debug("app:db:updateScenarioIsActive")
  debug("Updating scenario isActive: id=%s, isActive=%s", id, isActive)
  // ... function logic
}

// Server Action
export async function handleSaveForecastDirect(input: SaveForecastSchema) {
  const debug = Debug("app:action:handleSaveForecastDirect")
  debug("Received save forecast direct request: %O", input)
  // ... function logic
}
```

---

## 🧪 Qualitätskontrolle

### Obligatorische Qualitätskontrollen

Führe im Monorepo root `bun run ci` aus und fixe die Fehler, sonst ist deine Aufgabe _nicht_ abgeschlossen. In einer app oder package Projekt stehen dir die folgenden Befehle zur Verfügung um einzelne Dinge nacheinander zu prüfen:

- **Schritt 1**: `bun lint` - Code-Qualität prüfen
- **Schritt 2**: `bun check-types` - TypeScript-Typen prüfen
- **Erkenntnis**: Niemals Aufgabe als abgeschlossen markieren ohne `bun run ci` Erfolg im Monorepo root.

## 🧪 Bun Test spezifische Erkenntnisse

### Mock-System

- **Lösung**: Bun hat vollständig eingebautes `mock()` und `mock.module()` System
- **Korrekt**: `import { mock } from "bun:test";` verwenden

### Modul-Mocking: Vollständige vs. Selektive Funktionen

- **Problem**: Anfangs wurden alle Funktionen gemockt (unnötig)
- **Lösung**: Nur die tatsächlich verwendeten Funktionen mocken

### Import-Struktur für Bun Test

- **Problem**: `beforeEach` und `afterAll` Hooks müssen importiert werden
- **Lösung**: `import { describe, test, expect, mock, beforeEach } from "bun:test";`

### Mock-Cleanup in Bun Test

- **Problem**: Mock-State kann zwischen Tests "lecken"
- **Lösung**: `beforeEach()` mit `mockClear()` verwenden, siehe unten
- **Falsch**: `afterAll(() => mock.clearAllMocks())` - existiert nicht in Bun

```
// Mock module implementation for `getSnapshotDetails`
mock.module("./db", () => ({
    getSnapshotDetails: mockGetSnapshotDetails,
}));

beforeEach(() => {
    // Clear mock state before each test
    mockGetSnapshotDetails.mockClear();
});
```

### Factory Functions für Mock-Daten

- **Problem**: Wiederholter Mock-Daten-Code in Tests
- **Lösung**: Factory Functions mit flexiblen Overrides verwenden

### Date/Time Dependencies

- **Problem**: Im Code wird `new Date()` verwendet, statt das util `now()`
- **Gefahr**: Tests würden vom aktuellen Datum abhängen und in Zukunft fehlschlagen
- **Lösung**: IMMER `now()` aus utils verwenden, NIE `new Date()` Funktion verwenden. `now()` korrekt mit `mock.module()` mocken für stabile Tests

### describe Blöcke

- **Problem**: Durch `describe` Blöcke ensteht nesting und die Einrückung wird größer so das der Code schwerer lesbar ist
- **Lösung**: Benutze auf dem ersten level nur `test` ohne `describe`, nutze `describe` nur wenn unbedingt nötig, z.B. um mocks die von mehreren Tests benutzt werden mit unterschiedlichen Daten zu initalisieren

---

## Monorepo Konventionen (Turbo, Syncpack, Versions)

### Turbo Outputs

- **Erkenntnis**: Für Projekte mit echten Build-Artefakten müssen die Outputs gesetzt sein, z.B. `.next/**`, `.output/**`, `dist/**`, und `!.next/cache/**` als Ausschluss
- **Problem**: Turbo warnt bei Tasks ohne Outputs (z.B. `build` mit `echo 'not implemented'`)
- **Lösung**: Pro Paket ein `turbo.json` anlegen und für betroffene Tasks explizit `outputs: []` setzen (statt global falsche Outputs zu deklarieren)

### Turbo Caching und Env-Variablen

- **Problem**: Env-Variablen beeinflussen Outputs, aber landen nicht im Cache-Key
- **Lösung**: Relevante Variablen in `globalEnv` aufnehmen (z.B. `DATABASE_SCHEMA_NAME`, `DATABASE_URL`, `DB_SCHEMA`, `YOUTUBE_API_KEY`)

### Syncpack Usage

- **Ziel**: Dependency-Versionen im Monorepo konsistent halten
- **Konvention**: `syncpack:check` und `syncpack:fix` über `packages/tools` ausführen (dort ist Syncpack verfügbar)
- **Caching**: Fix-Tasks (`syncpack:fix`, `format`, `fix`) immer `cache: false`

### Monorepo Versionierung

- **Konvention**: Alle Workspace-Packages starten mit `version: "0.0.0"`, erst mit dem ersten Release wird gezählt und mit `0.0.1` gestartet
- **Wichtig**: Interne Abhängigkeiten müssen `workspace:*` verwenden als Version in der dependency Sektion in einer `package.json` Datei
