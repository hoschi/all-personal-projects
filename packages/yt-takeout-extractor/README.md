# yt-takeout-extractor

## 📌 Übersicht
Tool zum Importieren von YouTube-History-Daten aus Google Takeout in eine PostgreSQL-Datenbank. Verarbeitet JSON-Daten, extrahiert Video-IDs, validiert Eingaben und vermeidet Duplikate.

## ⚙️ Funktionsweise

### Import-Skript (`import_youtube_history.ts`)
```typescript
// Code-Snippet: Validierung mit Zod
const RawYouTubeHistoryEntrySchema = z.object({
  title: z.string().min(1),
  titleUrl: z.string().url(),
  time: z.string().datetime(),
  // ...
});
```

- **Validierung**: Zod-Schema prüft Rohdatenstruktur
- **ID-Extraktion**: Regex-Muster extrahieren YouTube-ID aus URLs
- **Batch-Verarbeitung**: 8 Einträge pro Batch (optimiert für Performance)
- **Duplikaterkennung**: `ON CONFLICT`-Klausel überspringt vorhandene Einträge
- **Fehlerlogging**: Detaillierte Fehlerprotokolle mit Originaldaten

### Datenbank-Schema (`create_youtube_history.sql`)
```sql
CREATE TABLE IF NOT EXISTS youtube_history (
    youtube_id VARCHAR(20) NOT NULL,
    watched_time TIMESTAMP NOT NULL,
    -- ...
    UNIQUE (youtube_id, watched_time)
);
```

- **Tabellenstruktur**:
  - `youtube_id`: Video-Identifier (20 Zeichen)
  - `watched_time`: Exakter Wiedergabezeitpunkt
  - `activity_controls`: JSONB für YouTube-Interaktionen
- **Indizes**:
  - `watched_time DESC`: Schnelle Zeitbereichsabfragen
  - `youtube_id`: Video-spezifische Suche
  - GIN-Index für JSON-Daten

## Import Youtube Note Links

**Ablauf:**

Das Skript erhält einen Ordnerpfad als Kommandozeilenargument und findet alle Markdown-Dateien darin. Für jede Datei extrahiert es die erste H1-Überschrift als Titel und sucht nach Markdown-Links im Format `[URL](http://...)`. Nur Links mit dem Label "URL" werden berücksichtigt.

Jeder gefundene Link wird validiert: Ist es keine YouTube-URL, wird ein Fehler geloggt. Bei gültigen YouTube-URLs wird die Video-ID extrahiert (unterstützt verschiedene URL-Formate wie `youtube.com/watch?v=...`, `youtu.be/...`, `embed`).

Die extrahierten Daten (YouTube-ID, Titel, Dateipfad) werden per Zod-Schema validiert und in die Datenbank eingefügt. Dabei wird geprüft: Existiert der Eintrag bereits identisch (ID + Titel + Datei), wird dies als Info geloggt. Existiert die ID mit anderem Titel, gilt dies als Fehler.

**Fehlerbehandlung:**

Das Skript bricht bei Fehlern nicht ab, sondern zählt sie mit. Am Ende erfolgt eine Zusammenfassung mit Anzahl neuer Einträge und Fehler. Der Exit-Code signalisiert, ob Fehler auftraten (1) oder nicht (0).

Die Implementierung ist rein funktional ohne objektorientierte Konstrukte und nutzt `zod`, `pg` und `dotenv`.

## 📋 Voraussetzungen
- Node.js ≥18.x
- PostgreSQL ≥15
- `.env`-Datei mit:
  ```env
  DATABASE_URL="postgres://user:pass@host:port/db"
  ```

## 🛠️ Installation
```bash
bun install
cd packages/yt-takeout-extractor
cp .env.example .env
dotenv -f .env run -- zsh
psql $DATABASE_URL -f src/create_youtube_history.sql
psql $DATABASE_URL -f src/create_youtube_note_links.sql
psql $DATABASE_URL -f src/create_youtube_transcript.sql
```

## 🚀 Verwendung
```bash
bun src/import_youtube_history.ts watched.json
```

## 💻 Beispielausgabe
```
Verarbeite 542 validierte Einträge in Batches à 8...
Batch 1: 8 erfolgreich, 0 Fehler, 2 Duplikate
Batch 2: 6 erfolgreich, 2 Fehler, 0 Duplikate
...
========== Zusammenfassung ==========
Erfolgreich importiert: 521
Duplikate übersprungen: 15
Fehler: 6
```

## 🗃️ Datenbankschema-Dokumentation
| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| id | SERIAL | Primärschlüssel |
| title | TEXT | Videotitel |
| youtube_id | VARCHAR(20) | Eindeutige YouTube-Video-ID |
| watched_time | TIMESTAMP | Exakter Wiedergabezeitpunkt |
| details | JSONB | Zusätzliche Metadaten |
| activity_controls | JSONB | Nutzerinteraktionen (z.B. "Watched", "Search") |

## 🚨 Fehlerbehandlung
- **Validierungsfehler**:
  - Protokolliert ungültige JSON-Strukturen
  - Speichert fehlerhafte Rohdaten zur Analyse
- **Datenbankfehler**:
  - Transaktionsrollback bei Batch-Fehlern
  - Isolierte Fehler pro Eintrag (kein Abbruch)
- **Logging**:
  - Konsolenausgabe mit Fehlerstatistiken
  - Detailierte Originaldaten bei schweren Fehlern