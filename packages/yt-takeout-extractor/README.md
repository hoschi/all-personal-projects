# yt-takeout-extractor

Tool zum Importieren von YouTube-History-Daten aus Google Takeout in eine PostgreSQL-Datenbank. Verarbeitet JSON-Daten, extrahiert Video-IDs, validiert Eingaben und vermeidet Duplikate. Unterstützt jetzt auch:
- Verknüpfung von Markdown-Notizen mit YouTube-Videos
- Automatischen Download von Video-Transkripten

## ⚙️ Funktionsweise

### Import-Skript (`import_youtube_history.ts`)

- **Validierung**: Zod-Schema prüft Rohdatenstruktur
- **ID-Extraktion**: Regex-Muster extrahieren YouTube-ID aus URLs
- **Batch-Verarbeitung**: 8 Einträge pro Batch (optimiert für Performance)
- **Duplikaterkennung**: `ON CONFLICT`-Klausel überspringt vorhandene Einträge
- **Fehlerlogging**: Detaillierte Fehlerprotokolle mit Originaldaten

### Note-Link Skript (`import_youtube_note_links.ts`)

- **Markdown-Scanning**: Durchsucht .md-Dateien rekursiv nach YouTube-Links
- **ID-Extraktion**: Unterstützt verschiedene YouTube-URL-Formate (Video, Shorts, Embed)
- **Datenbanklogik**:
  - Duplikatsprüfung auf (youtube_id, title, file_name)
  - Erkennung von Titelkonflikten bei gleicher Video-ID
- **Fehlerprotokollierung**: Sammelt alle Fehler für gebündelte Ausgabe

### Transkript-Skript (`import_youtube_transcript.ts`)

- **yt-dlp Integration**: Lädt Untertitel im SRT-Format herunter
- **Effect.ts**: Robustes Error-Handling mit Retry-Logik
- **Datenbankoperationen**:
  - Upsert von Transkripten mit Sprachkennung
  - Speicherung von Fehlermeldungen bei fehlgeschlagenen Downloads
- **Cleanup**: Automatisches Löschen temporärer Dateien

## 📋 Voraussetzungen
- Node.js ≥18.x
- PostgreSQL ≥15
- yt-dlp (`brew install yt-dlp` oder `pip install yt-dlp`)
- `.env`-Datei mit:
  ```env
  DATABASE_URL="postgres://user:pass@host:port/db"
  ```
- **Für Transkripte**: Chrome-Browser mit angemeldetem YouTube-Account (für Cookie-Zugriff)

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
# History-Import
bun src/import_youtube_history.ts path/to/history.json

# Note-Link-Import
bun src/import_youtube_note_links.ts /pfad/zu/notes

# Transkript-Download
bun src/import_youtube_transcript.ts main.youtube_videos
```

## 🗃️ Datenbankschema-Dokumentation

### youtube_history
| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| id | SERIAL | Primärschlüssel |
| youtube_id | VARCHAR(20) | Eindeutige YouTube-Video-ID |
| watched_time | TIMESTAMP | Exakter Wiedergabezeitpunkt |
| details | JSONB | Zusätzliche Metadaten |
| activity_controls | JSONB | Nutzerinteraktionen |

### youtube_note_links
| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| youtube_id | VARCHAR(20) | Video-ID (Fremdschlüssel) |
| title | TEXT | Optionaler benutzerdefinierter Titel |
| file_name | TEXT | Vollständiger Pfad zur Markdown-Datei |
| created_at | TIMESTAMP | Erstellungszeitpunkt |

### youtube_transcript
| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| youtube_id | VARCHAR(20) | Primärschlüssel |
| transcript_original | TEXT | Roh-Transkript im SRT-Format |
| lang | VARCHAR(10) | Sprachkürzel (z.B. 'en', 'de') |
| error | TEXT | Fehlermeldung bei fehlgeschlagenem Download |
| updated_at | TIMESTAMP | Letzte Aktualisierung |

## 🚨 Fehlerbehandlung
- **Allgemein**:
  - Konsolenausgabe mit Fehlerstatistiken
  - Detailierte Originaldaten bei schweren Fehlern
  - Transaktionssicherheit bei Datenbankoperationen

- **Transkript-spezifisch**:
  - Behandlung von privaten/gesperrten Videos
  - Cookie-basierte Authentifizierungsfehler
  - Speicherung von Fehlerlogs in der Datenbank

- **Note-Link-spezifisch**:
  - Titelkonflikt-Erkennung bei gleicher Video-ID
  - Validierung von YouTube-Link-Formaten
  - Batch-Verarbeitung von Markdown-Dateien