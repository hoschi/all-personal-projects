# Plan für Box-Storage Datenbank Setup

## Überblick

Dieser Plan beschreibt die Schritte zur Erstellung der Datenbank für das Box-Storage Projekt basierend auf den Anforderungen in `docs/requirements.md` und den Regeln in `ai-assistants/main-rules.md`. Das Projekt verwendet Prisma mit PostgreSQL und dem Schema "box_storage". Wichtige Regeln: Bun als Package Manager, PostgreSQL Schema über SQL SET-Befehl, Integer IDs, automatische createdAt/updatedAt Timestamps.

## Ziele

- Prisma Schema erstellen für alle erforderlichen Tabellen
- Datenbank Migration durchführen
- Beispieldaten seeden
- Abfragelogik testen
- Sicherstellen, dass alle funktionalen Anforderungen erfüllt werden

## Datenmodell

Basierend auf requirements.md und `<root>/ai-assistants/main-rules.md`:

**Wichtige Regeln:**

- Dokumentation und Readmes immer englisch, Antworten auf Deutsch
- Bun als Package Manager verwenden (`bun run`, `bunx`)
- Alle Models haben `createdAt` und `updatedAt` Timestamps (automatisch von Prisma)
- Integer IDs verwenden statt UUID

### User

- id (Int, Primary Key, autoincrement)
- username (String, unique)
- passwordHash (String) - gehashtes Passwort
- createdAt (DateTime)
- updatedAt (DateTime)

### Hierarchie (ohne Single-Table-Inheritance)

- Floor: id (Int), name (String), createdAt, updatedAt
- Room: id (Int), name (String), floorId (Int, Foreign Key), createdAt, updatedAt
- Furniture: id (Int), name (String), roomId (Int, Foreign Key), createdAt, updatedAt
- Box: id (Int), name (String), furnitureId (Int, Foreign Key), createdAt, updatedAt

### Items

- id (Int, Primary Key, autoincrement)
- name (String)
- description (String)
- lastModifiedAt (DateTime)
- isPrivate (Boolean)
- ownerId (Int, Foreign Key zu User)
- boxId (Int?, nullable Foreign Key zu Box)
- furnitureId (Int?, nullable Foreign Key zu Furniture)
- roomId (Int?, nullable Foreign Key zu Room)
- inMotionUserId (Int?, nullable Foreign Key zu User)
- createdAt (DateTime)
- updatedAt (DateTime)
- Constraint: Nur eine Location (boxId, furnitureId oder roomId) darf gesetzt sein

### UserItemInteraction

- Composite Primary Key: userId (Int) + itemId (Int)
- isFavorite (Boolean)
- lastUsedAt (DateTime)
- createdAt (DateTime)
- updatedAt (DateTime)

## Schritte

### 1. Prisma Schema erstellen

- Erstelle `prisma/schema.prisma` in `apps/box-storage`
- Konfiguriere datasource mit PostgreSQL (ohne schema Parameter in URL)
- Definiere alle Models mit korrekten Relationen und Integer IDs
- Alle Models haben createdAt/updatedAt Timestamps
- Füge Indizes für Performance hinzu
- Implementiere Location Constraint für Items

### 2. Environment Setup

- Kopiere `.env.dev` von `packages/db` nach `apps/box-storage/.env`
- DATABASE_URL bleibt unverändert (kein ?schema= Parameter)

### 3. Prisma Setup

- Führe `bunx prisma generate` aus um Client zu generieren
- Führe `bunx prisma migrate dev --name init` aus für erste Migration

### 4. Seed Script erstellen

- Erstelle `scripts/seed-dev.ts` ähnlich zu financy-forecast, benutze aber statt raw SQL den prisma client
- Implementiere clearSeedData Funktion zum Löschen aller Daten
- Erstelle Beispieldaten:
  - 2-3 User mit gehashten Passwörtern
  - Mindestens 2 Floors (EG, OG)
  - Pro Floor mindestens 2 Rooms (Wohnzimmer, Küche, Schlafzimmer, Bad)
  - Pro Room mindestens 2 Furniture (Regale, Schränke, Kommoden)
  - Pro Furniture mindestens 2 Boxes
  - 20-30 Items mit verschiedenen Locations (einige in Boxes, einige direkt in Furniture/Room)
  - UserItemInteractions für Favoriten und lastUsedAt
- Teste das seed script in dem du die clear funtkion verwendest um dann die daten erneut zu erstellen

### 5. Testskripte erstellen

- Erstelle `scripts/test-queries.ts` die den Prisma Client benutzt um zu testen das damit die Daten aus dem seed script abgerufen werden können, bevor wir von Fake daten zu DB Daten umstiegen (Schritt 7)
- Teste alle erforderlichen Abfragen:
  - Items für Inventory View (mit Filtern für owner, isPrivate)
  - Items für Dashboard (Meine Items, Andere Items, kürzlich modifizierte)
  - In Motion Status setzen/löschen
  - Hierarchische Struktur abfragen
- Verwende Bun um das Skript auszuführen

### 6. Abfragelogik validieren

- Analysiere den Stand bis jetzt und überprüfe ob alle Anforderungen korrekt umgesetzt sind.
- Stelle sicher, dass alle Business Logic implementiert ist:
  - In Motion: Setzen/löschen mit korrekten Regeln
  - Visibility: isPrivate + ownerId Logic
  - Location Constraints: Nur eine Location pro Item

### 7. Ersetze das fake data setup mit dem DB setup

- Analysiere welche React Komponenten aktuell die `actions.ts` Funktionen benutzen um die zu sehen wie die fake Daten verwendet werden
- Lösche die Fake daten und Zod Schemas komplett
- Verwende statt fake daten den prisma Client
  - Verwende die Prisma Typen und erstelle nur Zod Schemas und Typen wo nötig
  - Wichtig ist das die Daten die vom Frontend kommen validiert werden wie aktuell auch schon
  - Behalte die Trennung von Business Logik (actions) und DB (data) bei

## Quality Gates

- Prisma Schema kompiliert ohne Fehler
- Migration läuft erfolgreich
- Seed Script füllt DB mit glaubwürdigen Daten
- Alle Test Queries laufen erfolgreich
- Business Logic ist korrekt implementiert
