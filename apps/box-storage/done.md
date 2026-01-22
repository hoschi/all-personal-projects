## Schritt 1: Prisma Schema erstellen

### Aufgabe

Erstelle prisma/schema.prisma in apps/box-storage. Konfiguriere die datasource mit PostgreSQL (ohne schema Parameter in der URL). Definiere alle Models (User, Floor, Room, Furniture, Box, Item, UserItemInteraction) mit korrekten Relationen, Integer IDs, automatischen createdAt/updatedAt Timestamps, Indizes für Performance und Location Constraint für Items (nur eine Location pro Item darf gesetzt sein). Verwende die Regeln aus ai-assistants/main-rules.md: Bun als Package Manager, PostgreSQL Schema über SQL SET-Befehl, Integer IDs, automatische Timestamps.

### Was getan wurde

- Erstellt prisma/schema.prisma mit allen erforderlichen Models: User, Floor, Room, Furniture, Box, Item, UserItemInteraction
- Korrekte Relationen definiert mit Foreign Keys
- Integer IDs und automatische createdAt/updatedAt Timestamps hinzugefügt
- Indizes für Performance auf Foreign Key Spalten hinzugefügt
- Location Constraint für Items versucht zu implementieren (siehe Probleme)
- Prisma 7 Konfiguration: datasource ohne url in schema.prisma, stattdessen prisma.config.ts erstellt
- Generator für Prisma Client hinzugefügt
- Prisma Client generiert mit bunx prisma generate
- Lint und Type-Check durchgeführt (bun run lint, bun run check-types) - keine Fehler

### Probleme und Lösungen

- **Problem**: Prisma 7 erfordert datasource URL in prisma.config.ts statt in schema.prisma. Fehlermeldung: "The datasource property `url` is no longer supported in schema files"
- **Lösung**: Entfernt url aus schema.prisma, erstellt prisma.config.ts mit import { defineConfig } from "prisma/config" und datasource.url

- **Problem**: @@check Constraint für Location nicht unterstützt in Prisma Schema. Fehlermeldung: "This line is not a valid field or attribute definition"
- **Lösung**: @@check entfernt aus Schema. Constraint wird später manuell als SQL nach Migration hinzugefügt werden.

- **Problem**: import { defineConfig } from "prisma/defineConfig" nicht gefunden
- **Lösung**: Import geändert zu "prisma/config", basierend auf Prisma Docs

- **Problem**: Warnung in lint: DATABASE_URL not listed as dependency in turbo.json
- **Lösung**: Ignoriert, da es nur eine Warnung ist und für CI akzeptabel
