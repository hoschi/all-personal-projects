# AI Assistants

## Generelles

- Dokumentation von Code und Readmes sind _immer_ englisch, deine Antworten auf deutsch.
- Verwende _immer_ den MCP Server nie das CLI um mit `git` zu arbeiten
- Wenn du Problem angehst überlege ob dir Informationen aus der bestehenden Codebase helfen können. Dier steht in den meisten Roo Modi ein MCP Server zur Verfügung um die Code Base zu durchsuchen. Benutze diesen um mehr Informationen zu bekommen _bevor_ du an der Lösung arbeitest.
- Wenn du Dokumentation herunterladen möchtest, speichere sie im `tmp`-Ordner, damit sie nicht mit Git committed wird. Dokumentation oder andere Artefakte, die du zur Übergabe zwischen Roo Modi/Agenten oder aus Useranweisungen heraus erstellst, speicherst du im `current`-Ordner, falls nicht anders angegeben oder sinnvoll. `plan.md` legst du ebenfalls in `current` ab, außer du arbeitest mit dem `specify`-System.

## AI ref

Im Ordner `ai-ref` müssen folgende Dateien sein:

- `nextjs-llms-full.txt` enthält die komplette Dokumentation für Next.js v16.
- `effect-llms-full.txt` enthält die komplette Dokumentation zu Effect
- `tan-stack-llms.txt` enthält Links zur TanStack-Dokumentation für aktuelle und detailliertere Informationen.
- `ts-pattern-README.md` enthält die wichtigsten Dokumentations- und API-Beispiele für die ts-pattern Bibliothek.
- Führe `bun run packages/tools/src/fetch-ai-docs.ts` aus, um die Dateien nach `ai-ref` zu laden.

Lies diese Dateien, wenn sie für die aktuelle Aufgabe sinnvoll sind oder du Probleme hast mit Dingen, die hier thematisiert werden. Aktuelle Dokumentation zu bekommen ist WICHTIG, da deine Trainingsdaten veraltet sein können.

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

Verwende außerdem `NativeSelect` statt `Select`, letzteres hat einen Overlay Scrollblocker, der bestehende Scrollbars ausblendet, was zu Layout-Shifts führt. Siehe [Bug Ticket](https://github.com/shadcn-ui/ui/issues/4227) das geschlossen wurde obwohl das Verhalten noch existiert.

### React Compiler: Kein manuelles Memoizing

- **Regel**: In React Components standardmäßig **kein** `useMemo` und **kein** `useCallback` verwenden.
- **Begründung**: Der React Compiler übernimmt Optimierungen; unnötiges Memoizing erhöht Komplexität ohne Nutzen.
- **Ausnahme**: Nur mit klarem Befehl vom Benutzer nachdem nach gefragt wurde!

### `useEffect`: Nur für Synchronisation von Side Effects

- **Problem**: `useEffect` wird oft für reine Datenableitung genutzt oder hängt an instabilen Funktions-Identitäten, wodurch z.B. Debounce-Timer bei jedem Render unnötig neu starten.
- **Regel**: `useEffect` nur verwenden, wenn externe Side Effects synchronisiert werden müssen (Timer, Netzwerk, Subscriptions, URL/Navigate-Sync, DOM-Integrationen). Reine Ableitungen gehören in Render/State, nicht in `useEffect`.
- **Regel**: Bei Debounce-/Timer-Logik mit wechselnden Callback-Identitäten `useEffectEvent` verwenden, damit der Timer die neuesten Werte liest, ohne dass der Effect wegen der Callback-Referenz neu ausgeführt wird.
- **Lösung**: Dependencies auf die fachlich relevanten Trigger begrenzen (z.B. `debounceMs`, `localValue`, `searchKey`, `searchValue`) und Cleanup (`clearTimeout`/`unsubscribe`) immer im Rückgabewert des Effects sicherstellen.

### TanStack Start: Error Boundaries statt silent catch

- **Regel**: Runtime Exceptions dürfen nicht still geschluckt werden (`catch {}` / `catch { return ... }` ohne Re-throw/Propagation).
- **Lösung**: Unerwartete Fehler in UI/Route-Logik an die TanStack Route Error Boundary weitergeben (`errorComponent` pro Route oder `defaultErrorComponent` im Router).
- **Hinweis**: Für erwartete Fachfälle (z.B. `not_found`, `conflict`) sind normale UI-States erlaubt; für unerwartete Exceptions nicht.

### CSR-only Routes: Browser APIs direkt nutzen

- **Regel**: Wenn eine TanStack-Route explizit `ssr: false` ist, keine unnötigen `typeof window === "undefined"` Guards in dieser Route einbauen.
- **Begründung**: Diese Guards verschleiern echte Laufzeitprobleme und fördern stilles Fehlerhandling.

### Konstanten: `UPPER_SNAKE_CASE` + `as const`

- **Regel**: Modulweite Konstanten (Storage Keys, Event-Namen, feste IDs/Präfixe) immer in `UPPER_SNAKE_CASE` benennen.
- **Regel**: String-Literal-Konstanten mit `as const` deklarieren, um versehentliche Aufweichung der Typen zu vermeiden.

### Externe Daten im BFF typisieren: `unknown` + Zod-Parsing

- **Regel**: Daten aus z.B. `await response.json()` die im BFF von einer Quelle angezogen werden, sind immer `unknown` und müssen per Zod-Schema geparsed werden.
- **Verboten**: Type-Assertions wie `(await response.json()) as SomeType` für externe Daten.
- **Begründung**: Type-Casts umgehen die Laufzeitvalidierung und hebeln Typsicherheit bei unsicheren Inputs aus. Im BFF wird alles geparsed, damit zwischen BFF und Client und damit innerhalb des Client Codes alles so type safe wie möglich ist.

### Pflicht-Env für Server-Integrationen: Fail Fast beim Start

- **Regel**: Externe Service-Endpunkte/Modelle (z.B. Whisper/Ollama) dürfen keine harten Fallback-Defaults im Code haben.
- **Regel**: Werte aus `.env.base` + optional `.env` laden (wie in `box-storage`) und bei fehlenden/ungültigen Pflichtwerten den Server-Start sofort fehlschlagen lassen.
- **Begründung**: Fehlkonfigurationen sollen früh sichtbar sein und nicht erst zur Laufzeit beim ersten Request.

### Numerische Eingaben mit Komma

- **Problem**: `replace(",", ".")` ersetzt nur das erste Komma.
- **Lösung**: Immer globale Ersetzung (`replace(/,/g, ".")` oder `replaceAll(",", ".")`) vor `Number(...)` verwenden.

### Select-Inputs: Keine `selectedIndex`-Logik

- **Problem**: `selectedIndex` ist fragil (Reordering, Placeholder, dynamische Optionen).
- **Lösung**: Immer `event.currentTarget.value` lesen und den String gegen die erlaubten Werte validieren (`zod.safeParse` oder Lookup in getypten `options`-Arrays).
- **Regel**: Keine `as`-Casts in `onChange` für Selects; Typableitung muss über die Option-Typen oder Schema-Parsing passieren.

### Zentrale Filter-/Sort-Contracts

- **Problem**: UI und Backend driften bei String-Literalen (`"free"`, `"mine"`, ...).
- **Lösung**: Gemeinsame Konstanten + Zod-Schemas in einem dedizierten Modul pflegen und in Route/Search sowie Server-Actions importieren.
- **Regel**: Enum-ähnliche Query-Werte nicht doppelt als Literale in mehreren Dateien definieren.

## Next.js 16

### Cache-Invalidation in Server Actions

- **Read-your-own-writes**: In Server Actions bei Mutationen standardmäßig `updateTag(...)` verwenden.
- **Keine sofortige Konsistenz nötig**: `revalidateTag(...)` nur für eventual consistency / stale-while-revalidate einsetzen.
- **Kernzeilen aus `nextjs-llms-full.txt` (sinngemäß)**:
  - `updateTag` ist speziell für Server Actions und read-your-own-writes (sofortige Expiration).
  - `revalidateTag` unterstützt stale-while-revalidate (`"max"`) und ist für verzögerungstolerante Updates.
  - Referenz: ca. Zeilen `4172-4219`, `2566-2594`, `23077-23081`.

### Cache Components: Uncached Data

- **Problem**: Seiten mit uncached Datenzugriff schlagen im Build fehl (`Uncached data was accessed outside of <Suspense>`).
- **Lösung**: Uncached Data-Reads in eine async Unterkomponente auslagern und in `<Suspense>` rendern, statt direkt im Page-Root zu blockieren.
- **Kernzeilen aus `nextjs-llms-full.txt` (sinngemäß)**:
  - Wenn Arbeit beim Prerendern nicht abgeschlossen werden kann, muss sie explizit über `<Suspense>` auf Request-Time deferred werden.
  - Ohne `<Suspense>` oder `use cache` entsteht der Fehler `Uncached data was accessed outside of <Suspense>`.
  - Suspense-Grenzen möglichst nah an die betroffenen Komponenten setzen.
  - Referenz: ca. Zeilen `2229`, `2275-2279`, `2377`, `18084`.

### Server Action Fehlerbehandlung für Formulare

- **Problem**: Unbehandelte Errors in Server Actions triggern Error Boundaries und geben dem Nutzer kein verwertbares Feedback.
- **Lösung**: Erwartete Fehler als Rückgabewerte modellieren (`success/error/fieldErrors`) und mit `useActionState` im Formular anzeigen; nur unerwartete Fehler werfen.
- **Pattern**: Business-Parsing/Validierung in Helper-Funktionen, UI-State/Anzeige im Client-Form-Component.
- **Kernzeilen aus `nextjs-llms-full.txt` (sinngemäß)**:
  - Für expected errors: nicht werfen, sondern als Return-Value modellieren.
  - `useActionState` soll den Action-State im Formular anzeigen; Server-Action-Signatur erhält dabei `prevState` als ersten Parameter.
  - Uncaught exceptions sind Bugs und sollen an Error Boundaries gehen.
  - Referenz: ca. Zeilen `4368-4378`, `4418`, `4550`, `11530-11532`.

### RSC Boundary: Date-Werte in Client Components

- **Problem**: Date-Werte aus Server Components/DB können im Client als String ankommen und dann in `date-fns`-Formatierungen brechen.
- **Lösung**: Date-Werte im Client am Boundary immer normalisieren (`new Date(value)` / `parseISO(value)`) oder bereits formatiert als String vom Server übergeben.
- **Kernzeilen aus `nextjs-llms-full.txt` (sinngemäß)**:
  - Props zwischen Server- und Client-Komponenten müssen serialisierbar sein.
  - Bei gemischten Server/Client-Boundaries auf stabile Typen achten und bei Bedarf clientseitig deserialisieren.
  - Referenz: ca. Zeilen `1528` (Props Server → Client), `1655-1657` (Passing data from Server to Client Components), `1704` (Props must be serializable).

## Clerk

### `userId` bekommen in Komponenten

- **Problem**: Man braucht die `userId` um diese mit geladenen Daten zu vergleichen, z.B. ob diese id der eigenen entspricht.
- **Falsch**: `useUser` Hook von Clerk benutzen.
- **Korrekt**: `userId` im `loader` vom `context` zurück geben.
- **Lösung**: `useUser` braucht zwei Render Zyklen um einen Wert zu liefern, im ersten Zyklus ist die id _immer_ undefined. Die `userId` aus dem Router Kontext ist direkt da.
- **Referenz-Implementierung**: [TableView](<apps/box-storage/src/routes/(authed)/table-view.tsx>)

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

## Einfache CLI-Skripte

- **Argumente**: Immer `commander` für CLI-Parsing verwenden (`-y/--yes` für Auto-Confirm).
- **Prompts**: Für Interaktion `@inquirer/prompts` nutzen (z.B. `confirm`), mit Default `false`.
- **Non-Interactive**: Wenn `!process.stdin.isTTY`, keine Prompts starten und sichere Defaults verwenden.
- **Root-Pfad**: Root-Verzeichnis aus `import.meta.url` via `fileURLToPath` + `dirname` ableiten (kein `cwd`-Raten).
- **Ausführung**: Befehle per `spawnSync` mit `stdio: "inherit"` ausführen und bei Fehlern mit Exit-Code beenden.
- **Logging**: Kurze, klare Step-Logs (`Linking...`, `Fetching...`, `Installing...`).

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

### Prisma Typen-Konsistenz

- **Regel**: Wenn Prisma im Projekt verwendet wird, nutze bevorzugt Prisma-generierte Typen (`Prisma.*`, `ModelGetPayload`, `ModelInclude`, `validator`) statt eigener manuell duplizierter Typdefinitionen.
- **Ziel**: Bessere Konsistenz zwischen Query-Definitionen und Result-Shape, weniger Drift bei Schema-Änderungen.
- **Ausnahme**: Manuelle Typen nur wenn bewusst vom Prisma-Schema abgewichen werden muss (z.B. UI-only View-Model), dann Abweichung kurz dokumentieren.

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
- **Wichtig bei Bun-Mocks**: Für Zeit-Mocks `mockReset()` statt nur `mockClear()` nutzen, wenn Return-Values pro Test sicher zurückgesetzt werden müssen.
- **Konvention**: In jedem Testpfad, der Datumslogik nutzt (`calculateApprovable`, `isAfter`, `isEqual`), `mockNow.mockReturnValue(...)` explizit setzen.

### Fehlerbehandlung in Server/DB Code

- **Pattern**: Für Business-Fehler (z.B. "nicht approvable", "keine Accounts") dedizierte Error-Klassen verwenden statt `error.message`-String-Matching.
- **Rethrow-Regel**: Beim Wrappen technischer Fehler immer `cause` setzen (`new Error("...", { cause: error })`), damit Stack/Typ erhalten bleiben.
- **speziell: Next.js**: Error-Klassen, die sowohl in Server- als auch UI-Code benötigt werden, in ein neutrales Domain-Modul legen (nicht in `use server`-Dateien).

### Immutability in Datenaufbereitung

- **Problem**: `reverse()` mutiert Arrays in-place und kann Side-Effects erzeugen.
- **Lösung**: Für read-only Transformationen `toReversed()` verwenden.

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

### Vite Dev Ports in Apps

- **Regel**: Wenn in einem App-`package.json` ein Vite-Dev-Script mit festem Port genutzt wird (`vite dev --port ...`), muss immer `--strictPort` gesetzt sein.
- **Begründung**: Sonst wechselt Vite bei Port-Konflikten still auf einen anderen Port und Caddy-/Reverse-Proxy-Routen zeigen auf den falschen Target-Port.
- **Beispiel**: `"dev": "vite dev --port 3059 --strictPort"`

### Syncpack Usage

- **Ziel**: Dependency-Versionen im Monorepo konsistent halten
- **Konvention**: `syncpack:check` und `syncpack:fix` über `packages/tools` ausführen (dort ist Syncpack verfügbar)
- **Caching**: Fix-Tasks (`syncpack:fix`, `format`, `fix`) immer `cache: false`

### Monorepo Versionierung

- **Konvention**: Alle Workspace-Packages starten mit `version: "0.0.0"`, erst mit dem ersten Release wird gezählt und mit `0.0.1` gestartet
- **Wichtig**: Interne Abhängigkeiten müssen `workspace:*` verwenden als Version in der dependency Sektion in einer `package.json` Datei

---

## ts-pattern

### Index der wichtigsten ts-pattern Funktionalitäten

- `match(value)`: Einstieg in den Builder für Pattern Matching. Details: `ai-ref/ts-pattern-README.md:209`, API-Referenz: `ai-ref/ts-pattern-README.md:417`.
- `.with(pattern, handler)`: Branches definieren und Typen im Handler präzise narrowing. Details: `ai-ref/ts-pattern-README.md:230`, API-Referenz: `ai-ref/ts-pattern-README.md:437`.
- `P.select(name?)`: Werte aus verschachtelten Strukturen extrahieren und direkt an den Handler übergeben. Details: `ai-ref/ts-pattern-README.md:252`, Pattern-Referenz: `ai-ref/ts-pattern-README.md:1217`.
- `P.not(pattern)`: Negative Matches (alles außer X) typsicher ausdrücken. Details: `ai-ref/ts-pattern-README.md:299`, Pattern-Referenz: `ai-ref/ts-pattern-README.md:1194`.
- `P.when(...)` und Guard-Funktionen: Zusätzliche Prädikatslogik in Pattern/Branches einbauen. Details: `ai-ref/ts-pattern-README.md:310`, Pattern-Referenz: `ai-ref/ts-pattern-README.md:1166`, API-Referenz `.when`: `ai-ref/ts-pattern-README.md:490`.
- `P._`: Catch-all Wildcard für Default-Fälle. Details: `ai-ref/ts-pattern-README.md:349`.
- `.returnType<OutputType>()`: Erzwingt konsistenten Rückgabetyp über alle Branches. Details: `ai-ref/ts-pattern-README.md:220`, API-Referenz: `ai-ref/ts-pattern-README.md:516`.
- `.exhaustive()` und `.otherwise()`: Ausdruck ausführen und fehlende Fälle absichern (oder Default setzen). Details: `ai-ref/ts-pattern-README.md:364`, API-Referenz: `ai-ref/ts-pattern-README.md:539`, `ai-ref/ts-pattern-README.md:603`.
- `isMatching`: Strukturvalidierung mit Pattern außerhalb von `match(...)`. Details: `ai-ref/ts-pattern-README.md:680`.
- `P.instanceOf(...)`: Klassentypen (z.B. Error-Klassen) robust matchen. Details: `ai-ref/ts-pattern-README.md:1318`.

### dos

#### Nutze `match` für echte Mehrfach-Branches mit fachlicher Logik

Nutze `match` für echte Mehrfach-Branches mit fachlicher Logik (z.B. Status-Mapping oder strukturierte Objektfälle), nicht nur als `if`-Ersatz.
Doku: `ai-ref/ts-pattern-README.md:209`, `ai-ref/ts-pattern-README.md:230`, `ai-ref/ts-pattern-README.md:364`.

Negatives Beispiel:

```ts
type OrderStatus = "draft" | "approved" | "rejected"

function getStatusColor(status: OrderStatus) {
  if (status === "draft") return "gray"
  if (status === "approved") return "green"
  if (status === "rejected") return "red"
  return "gray"
}
```

Positives Beispiel:

```ts
type OrderStatus = "draft" | "approved" | "rejected"

function getStatusColor(status: OrderStatus) {
  return match(status)
    .with("draft", () => "gray")
    .with("approved", () => "green")
    .with("rejected", () => "red")
    .exhaustive()
}
```

#### Nutze `match` wenn ein Wert aus mehreren Fällen abgeleitet wird

Nutze `match` wenn ein Wert aus mehreren Fällen abgeleitet wird und die Branches klarer als `if/else` sind.
Doku: `ai-ref/ts-pattern-README.md:143`, `ai-ref/ts-pattern-README.md:230`.

Negatives Beispiel:

```ts
function getVisiblePanel(role: "admin" | "member", ownsProject: boolean) {
  if (role === "admin" && ownsProject) return "admin-owner"
  if (role === "admin") return "admin"
  if (ownsProject) return "owner"
  return "member"
}
```

Positives Beispiel:

```ts
function getVisiblePanel(role: "admin" | "member", ownsProject: boolean) {
  return match<[typeof role, boolean], string>([role, ownsProject])
    .with(["admin", true], () => "admin-owner")
    .with(["admin", false], () => "admin")
    .with(["member", true], () => "owner")
    .with(["member", false], () => "member")
    .exhaustive()
}
```

#### Nutze stabile Identifikatoren zwischen Throw und Handling

Nutze stabile Identifikatoren zwischen Throw und Handling (z.B. Error-Klasse) und matche dann typsicher.
Doku: `ai-ref/ts-pattern-README.md:1318`, `ai-ref/ts-pattern-README.md:230`.

Negatives Beispiel:

```ts
try {
  throw new Error("NOT_AUTHENTICATED")
} catch (error) {
  const message = error instanceof Error ? error.message : ""
  return message === "NOT_AUTHENTICATED" ? "<SignIn />" : "<UnknownError />"
}
```

Positives Beispiel:

```ts
class NotAuthenticatedError extends Error {}

try {
  throw new NotAuthenticatedError()
} catch (error) {
  return match(error)
    .with(P.instanceOf(NotAuthenticatedError), () => "<SignIn />")
    .otherwise(() => "<UnknownError />")
}
```

#### Baue Match-Reihenfolge von konkret nach unspezifisch auf

Baue Match-Reihenfolge von konkret nach unspezifisch auf: zuerst die spezifischen Fachfälle, dann generische Fälle (`P.nullish`, `P._`, `.otherwise`). Für Match-Refactorings ist die Reihenfolge oft invers zu typischen `if/else`-Bäumen. Verschachtelte Situationen können so auch aufgelöst werden, da diese nicht erlaubt sind! Auf diese Weise ist es auch möglich `otherwise()` durch `exhaustive()` zu ersetzen, was stabiler für zukünftige Änderungen ist, da diese nicht verschlukt werden sondern als Typefehler auftauchen.
Doku: `ai-ref/ts-pattern-README.md:437`, `ai-ref/ts-pattern-README.md:611`.

Negatives Beispiel:

```ts
await match(item)
  .with(P.nullish, () => {
    throw new Error(`Item not found: ${itemId}`)
  })
  .with(P.nonNullable, async (existingItem) => {
    const updateData = await match(existingItem.inMotionUserId)
      .with(P.nullish, async () => {
        const inMotionUsername = await getClerkUsername(userId)
        return { inMotionUserId: userId, inMotionUsername }
      })
      .otherwise(() => ({
        inMotionUserId: null,
        inMotionUsername: null,
      }))

    await prisma.item.update({
      where: { id: itemId },
      data: updateData,
    })
  })
```

Positives Beispiel:

```ts
await prisma.item.update({
  where: { id: itemId },
  data: await match(item)
    // is in motion, reset
    .with({ inMotionUserId: P.string }, async () => ({
      inMotionUserId: null,
      inMotionUsername: null,
    }))
    // not in motion, assign to us
    .with({ inMotionUserId: P.nullish }, async () => {
      const inMotionUsername = await getClerkUsername(userId)
      return {
        inMotionUserId: userId,
        inMotionUsername,
      }
    })
    .with(P.nullish, () => {
      throw new Error(`Item not found: ${itemId}`)
    })
    .exhaustive(),
})
```

#### Achte bei UI-Branches auf konfliktfreie Klassen

Achte bei UI-Branches darauf, dass jede Branch konfliktfreie Klassen liefert (keine konkurrierenden Tailwind-Utilities in derselben Branch).
Doku (Branch-Struktur): `ai-ref/ts-pattern-README.md:230`, `ai-ref/ts-pattern-README.md:364`.

Negatives Beispiel:

```ts
const classes = match("sm" as "sm" | "md")
  .with("sm", () => "px-2 px-4 text-sm")
  .with("md", () => "px-4 text-base")
  .exhaustive()
```

Positives Beispiel:

```ts
const classes = match("sm" as "sm" | "md")
  .with("sm", () => "px-2 text-sm")
  .with("md", () => "px-4 text-base")
  .exhaustive()
```

### donts

#### Kein `match` nur als Guard mit Throw

Kein `match` nur als Guard mit Throw: Wenn nur validiert und ggf. geworfen wird, `if` verwenden.
Doku (wann `match` sinnvoll ist): `ai-ref/ts-pattern-README.md:209`, `ai-ref/ts-pattern-README.md:230`.

Negatives Beispiel:

```ts
match(locations.length)
  .with(1, () => undefined)
  .otherwise(() => {
    throw new Error("Expected one location")
  })
```

Positives Beispiel:

```ts
if (locations.length !== 1) {
  throw new Error("Expected one location")
}
```

#### Kein `match` für triviale Boolean-Auswahl

Kein `match` für triviale Boolean-Auswahl wie `asChild ? Slot : "span"`.

Negatives Beispiel:

```ts
const Component = match(asChild)
  .with(true, () => Slot)
  .otherwise(() => "span")
```

Positives Beispiel:

```ts
const Component = asChild ? Slot : "span"
```

#### Kein `match` für Node-Entry-Point Guards

Kein `match` für Node-Entry-Point Guards wie `require.main === module`; hier ist ein einfaches `if` klarer.

Negatives Beispiel:

```ts
match(require.main === module)
  .with(true, () => startCli())
  .otherwise(() => undefined)
```

Positives Beispiel:

```ts
if (require.main === module) {
  startCli()
}
```

#### Keine verschachtelten `match`-Blöcke in derselben Funktion

Keine verschachtelten `match`-Blöcke in derselben Funktion, wenn ein flacher Ausdruck oder ein `if` lesbarer ist.
Doku (Tuples in einer Match-Struktur): `ai-ref/ts-pattern-README.md:143`, `ai-ref/ts-pattern-README.md:230`.

Negatives Beispiel:

```ts
function getAction(state: "idle" | "loading", isDirty: boolean) {
  return match(state)
    .with("idle", () =>
      match(isDirty)
        .with(true, () => "save")
        .otherwise(() => "noop"),
    )
    .with("loading", () => "wait")
    .exhaustive()
}
```

Positives Beispiel:

```ts
function getAction(state: "idle" | "loading", isDirty: boolean) {
  return match<[typeof state, boolean], string>([state, isDirty])
    .with(["idle", true], () => "save")
    .with(["idle", false], () => "noop")
    .with(["loading", true], () => "wait")
    .with(["loading", false], () => "wait")
    .exhaustive()
}
```

#### Kein String-Coupling über `error.message`

Kein String-Coupling über `error.message` zwischen Throw und UI-Handling.
Doku: `ai-ref/ts-pattern-README.md:1318`.

Negatives Beispiel:

```ts
try {
  throw new Error("MISSING_PERMISSION")
} catch (error) {
  const message = error instanceof Error ? error.message : ""
  return match(message)
    .with("MISSING_PERMISSION", () => "<NoPermission />")
    .otherwise(() => "<UnknownError />")
}
```

Positives Beispiel:

```ts
class MissingPermissionError extends Error {}

try {
  throw new MissingPermissionError()
} catch (error) {
  return match(error)
    .with(P.instanceOf(MissingPermissionError), () => "<NoPermission />")
    .otherwise(() => "<UnknownError />")
}
```

#### Kein switch/case

Kein switch/case verwende ts-pattern für diese use cases.
Doku (mehrere Patterns in einer Branch): `ai-ref/ts-pattern-README.md:380`, API mit mehreren Patterns: `ai-ref/ts-pattern-README.md:437`.

Negatives Beispiel:

```ts
function sanitizeTag(type: string): string {
  switch (type) {
    case "text":
    case "span":
    case "p":
      return "text"
    case "btn":
    case "button":
      return "button"
    default:
      return type
  }
}
```

Positives Beispiel:

```ts
function sanitizeTag(type: string): string {
  return match(type)
    .with("text", "span", "p", () => "text")
    .with("btn", "button", () => "button")
    .otherwise(() => type)
}
```
