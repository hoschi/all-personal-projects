# YouTube / Note Scripts

TypeScript scripts for ingesting YouTube data into the `yt.*` schema of a PostgreSQL database. All scripts use [Prisma](https://www.prisma.io/) (schema in `prisma/schema.prisma`) and [commander](https://github.com/tj/commander.js) for the CLI surface.

## Compliance: Claude-Code-CLI + Subscription (ab 15. Juni 2026: Credit-Pool)

**Stand 2026-06-07.** Die Enrichment-Pipeline ruft `claude --print` per Subprocess
auf (`src/llm-caller.ts`) — keine direkte Anthropic-API-Nutzung, keine SDK-Integration,
kein `ANTHROPIC_API_KEY`. Auth läuft über die normale Claude-Code-OAuth-Session
(macOS Keychain `Claude Code-credentials`), genauso wie Claude Code interaktiv.

**Ab 15. Juni 2026** wandert `claude -p`-Nutzung in einen separaten monatlichen
Agent-SDK-Credit-Pool (Team Premium: $100/Monat, Pro: $20, Max 20x: $200). Der
Wechsel passiert **automatisch ohne Code-Änderung** — die Pipeline läuft weiter
wie heute, nur die Abrechnung kommt aus einem anderen Topf. One-Time-Opt-In im
Claude-Account ist nötig — Anthropic schickt eine Email mit Claim-Link vor dem 15. Juni.

**Volumen-Schätzung**: 5 Passes × ~10 Videos/Tag × 30 Tage = 1.500 Pass-Calls/Monat.
Mit `claude -p`-Boilerplate (~21k Token pro Call, davon ~19k cached) landet das
bei ~30M Input-Tokens/Monat ≈ $90 API-äquivalent. Passt knapp in den $100
Team-Premium-Pool.

**Reaktivierung von Cluster 4k (Low-Level-SDK + API-Key)**: Wenn der Verbrauch
nach 15. Juni den Pool sprengt, wird `llm-caller.ts` auf direktes `@anthropic-ai/sdk`
mit `ANTHROPIC_API_KEY` umgestellt (Spec/Plan unter
`~/repos/personal-three/current/yt-pipeline-cluster4k-{spec,plan}.md`, müssen vor
Reaktivierung von „Agent SDK" auf „Low-Level SDK" umgeschrieben werden).

Anthropic hat zwischen Januar und Juni 2026 die Policy zum Thema „Agent SDK + Subscription-OAuth" mehrfach gedreht. Wer die genaue Saga + Auth-Entscheidungs-Matrix für die eigene Nutzung wissen will, sucht extern nach Anthropic-Quellen — diese Doku hat sich oft genug geändert, dass eine fixierte Referenz hier schnell stale wäre.

## Captions-only yt-dlp policy

This pipeline uses `yt-dlp` **only for subtitles/captions**. Audio/video downloads are neither planned nor needed. Hardcoded flags in `import_youtube_transcript.ts`:

```
--write-auto-subs --skip-download --write-sub --sub-format vtt/srt --cookies-from-browser=chrome
```

Reason: YouTube Web ToS prohibits audio/video downloads. Captions are not an A/V stream (EFF position; YouTube Data API has a separate captions endpoint). `--cookies-from-browser=chrome` re-uses a logged-in Chrome profile so age-gated or region-restricted videos can still expose their captions.

## Prerequisites

- Bun ≥ 1.3
- PostgreSQL ≥ 15
- yt-dlp (`brew install yt-dlp`) — only for `import_youtube_transcript.ts`
- `.env` with:
  ```
  DATABASE_URL="postgresql://user:pass@host:port/db"
  DATABASE_SCHEMA_NAME="yt"
  YOUTUBE_API_KEY="..."   # for get_video_details
  ```

## Setup

```bash
cd packages/yt-notes-scripts
cp .env.example .env  # fill in DATABASE_URL + YOUTUBE_API_KEY
bun install
bun run generate:prisma
bun run migrate:dev
```

## Scripts

Each script provides full `--help` (description, args, options, env vars, examples, exit codes). Below: one-liner each.

### `migrate-from-main.ts`

One-shot migration from legacy `main.youtube_*` tables into `yt.*`. Idempotent (a second run inserts 0 rows).

```bash
bun run src/migrate-from-main.ts --dry-run
bun run src/migrate-from-main.ts
```

### `import_youtube_history.ts`

Imports a Google Takeout `watch-history.json` into `yt.watch_history` (dedup on `youtube_id + watched_at`). See [Exporting from Google Takeout](#exporting-watch-historyjson-from-google-takeout) below for how to obtain the file. Setup (`bun install` + `bun run generate:prisma`) must have run once — see [Setup](#setup).

```bash
# run from packages/yt-notes-scripts/ — quote the path if it contains spaces
bun run src/import_youtube_history.ts "watch-history.json" --dry-run  # parse + count, no DB writes
bun run src/import_youtube_history.ts "watch-history.json"            # real import
```

**Always import the whole export — there is no start-date filter, and you don't need one.**
Takeout always dumps the _entire_ history (back to your first watch), so consecutive
exports overlap heavily with what's already in the DB. That is fine: the insert is
idempotent via the `@@unique([youtubeId, watchedAt])` constraint (`createMany` with
`skipDuplicates`), so already-imported rows are skipped. Re-running the same file
inserts 0 new rows.

The run prints a summary. Example for a full ~16-year history:

```
read:          29963   # all entries in the file
processable:   18303   # real video views (these get inserted/deduped)
skipped_ad:    11660   # "Von Google Anzeigen" ad entries — filtered out
skipped_no_id: 0       # entries with no parseable video URL (deleted/private)
...
inserted:      N       # rows newly added this run
duplicates:    M       # rows already in the DB (overlap with earlier imports)
```

Note: the real import upserts one `video` stub per unique id **sequentially**, so a
full history takes a few minutes — that's expected, not a hang.

#### Exporting `watch-history.json` from Google Takeout

The watch history is **not** available via the YouTube Data API — it has to come from a
Google Takeout export. Steps:

1. Open <https://takeout.google.com/?pli=1>.
2. Click **Deselect all** so nothing is selected.
3. Pick **YouTube and YouTube Music** from the list.
4. Click **All YouTube data included** and uncheck everything except **history**.
5. Still in that dialog, open **Multiple formats** (at the bottom) and switch
   **history** from HTML to **JSON**. Confirm.
6. Continue to the next step (**Next step**).
7. Choose the cadence: a single **Export once**, or a scheduled recurring export.
   Then create the export. Either way the **first** export starts immediately —
   a recurring schedule only adds the _following_ runs at the chosen interval.

Google emails a download link when the archive is ready (minutes to hours,
depending on history size). Inside the archive the file lives at
`Takeout/YouTube and YouTube Music/history/watch-history.json` (the folder is
localized — e.g. `Verlauf/Wiedergabeverlauf.json` for a German account). Feed
that file to the import command above.

### `import_youtube_note_links.ts`

Scans the markdown root of a configured vault (looked up in `yt.vault`) for `[URL](https://youtube.com/...)` links, imports into `yt.note_link`. The `--vault <name>` flag is required; the script reads `root_path` from the DB.

```bash
bun run src/import_youtube_note_links.ts --vault stefans-vault/shared
bun run src/import_youtube_note_links.ts --vault <your-kb-vault-name> --dry-run
```

One-time seed (per environment):

```sql
INSERT INTO yt.vault (name, root_path) VALUES
  ('stefans-vault/shared', '/Users/hoschi/Library/CloudStorage/Dropbox/obsidian-test/test/shared'),
  ('stefans-vault/private', '/Users/hoschi/Library/CloudStorage/Dropbox/obsidian-test/test/private'),
  ('<your-kb-vault-name>',  '/path/to/your/knowledge-base')
ON CONFLICT (name) DO UPDATE SET root_path = EXCLUDED.root_path;
```

### `import_youtube_transcript.ts`

Downloads captions via `yt-dlp` (captions-only — see top of README), stores in `yt.transcript` as SRT + plain text + LLM-formatted 20s buckets. Two-pass cookie strategy: first pass cookie-less, failed video ids land in `yt.transcript.error`; second pass `--retry-failed --with-chrome-cookies` re-tries them with a logged-in Chrome session (triggers Keychain prompt per video — see `knowledge-base/yt-dlp-chrome-cookies-keychain-prompt.md`).

Optional `--classification <arbeit | privat | mixed | unknown>` restricts the bulk selection (both fresh and `--retry-failed`) to videos whose channel has that classification. Ignored for `--video-id`.

```bash
bun run src/import_youtube_transcript.ts --video-id abc12345xyz
bun run src/import_youtube_transcript.ts --limit 10
bun run src/import_youtube_transcript.ts --limit 10 --classification arbeit
bun run src/import_youtube_transcript.ts --retry-failed --with-chrome-cookies --classification arbeit
```

### `get_video_details.ts`

Fetches video metadata via YouTube Data API v3 and upserts to `yt.video` + `yt.channel`. Has a `refresh-stale` sub-command for the 30-day refresh cap (YT Developer Policies §III.E.4).

```bash
bun run src/get_video_details.ts fetch abc12345xyz
bun run src/get_video_details.ts refresh-stale --dry-run
bun run src/get_video_details.ts refresh-stale --delete-instead
```

### `index-video.ts`

Composer: takes one or more video ids, runs `fetch` then `transcript` for each.

```bash
bun run src/index-video.ts abc12345xyz def67890wxy
bun run src/index-video.ts abc12345xyz --skip-transcript
```

## Cluster 2 — Stub-Erzeugung + Klassifikation

Writes stub articles for legacy YouTube links (from notes) and classifies channels.

### `expand-legacy-links.ts`

Expands YouTube legacy links (found in existing notes) into dedicated stub articles in the plugin default output folder. Stub format matches `sundevista/youtube-template` via the shared template file. Pre-pass scans `yt.note_link` (populates on first run if needed).

```bash
bun run expand-legacy-links --dry-run                 # Pre-pass + counts per vault
bun run expand-legacy-links --limit 5                 # Write 5 stubs only
bun run expand-legacy-links --vault stefans-vault/shared  # Restrict to one vault
```

Full help:

```
Usage: expand_legacy_links [options]

Expands YouTube legacy links (mentioned in normal notes) into dedicated stub
articles in the plugin default output folder. Format matches
sundevista/youtube-template via the shared template file.

Options:
  --dry-run          List counts + sample paths, write nothing (default: false)
  --limit <n>        Process only first N legacy links
  --vault <name>     Restrict to one vault (default: all yt.vault entries)
  --skip-scan        Skip the import_youtube_note_links pre-pass (use stale DB
                     state) (default: false)
  --template <path>  Override template file path (default:
                     "/Users/hoschi/Library/CloudStorage/Dropbox/obsidian-test/test/yt-template.md")
  -h, --help         display help for command

Environment:
  DATABASE_URL               Postgres connection string
  YOUTUBE_API_KEY            YouTube Data API v3 key (lazy fetch for missing details)

Examples:
  bun run src/expand_legacy_links.ts --dry-run
  bun run src/expand_legacy_links.ts --limit 5
  bun run src/expand_legacy_links.ts --vault <your-kb-vault-name> --dry-run

Exit codes:
  0  success
  1  input error (template missing, vault not found)
  2  DB error
  3  API error (lazy fetch failed)
```

### `classify-channels.ts`

Classifies YouTube channels as `privat` | `arbeit` | `mixed` | `unknown`. Runs three phases: **Phase A** backfills missing video details via the YouTube Data API for every video with `channel_id IS NULL`; **Phase B** auto-classifies channels by stub presence (R11); **Phase C** is the HITL loop. `--auto-only` skips only Phase C — **Phase A and B still run.**

```bash
bun run classify-channels --auto-only            # Phase A backfill + auto-classify, skip HITL
bun run classify-channels                        # backfill + auto-classify + HITL
bun run classify-channels --review-auto          # Review auto-classified channels
```

> ⚠️ **Phase A does real API work even with `--auto-only`.** It fetches details for every channel-less video (~1–2 quota units each; default quota 10 000/day), so a large watch-history backfill can span several days. With >500 such videos it prompts `[y/n]` first — run it **interactively**, not detached. It is resumable: already-resolved and 404-marked (`unavailable`) videos are skipped on re-runs. Narrow with `--include <ids>`.

Full help:

```
Usage: classify_channels [options]

Classifies YouTube channels as privat | arbeit | mixed | unknown.
Auto-classification uses stub presence per vault (R11); HITL loop for the rest.

Options:
  --auto-only       Skip the HITL loop (Phase A API-backfill +
                    auto-classification still run) (default: false)
  --review-auto     Show already-auto-classified channels for confirm/override
                    (default: false)
  --include <list>  Only process channels matching listed IDs (comma-separated)
  --reset           Reset all classifications to 'unknown' first (DEV only)
                    (default: false)
  -h, --help        display help for command

Environment:
  DATABASE_URL               Postgres connection string
  YOUTUBE_API_KEY            YouTube Data API key

Examples:
  bun run src/classify_channels.ts --auto-only
  bun run src/classify_channels.ts                       # auto + HITL
  bun run src/classify_channels.ts --review-auto

Exit codes:
  0  success
  1  input error
  2  DB error
  3  API error / quota exhausted
```

## Cluster 3 — Relokation + KB-Patch

Moves plugin-generated stub articles between shared and private vault based on channel classification, and patches `obsidian://`-URLs in the user's KB articles inline.

### `relocate-plugin-outputs`

Moves YouTube stub articles between `<stefans-vault>/shared/youtube/` and
`<stefans-vault>/private/youtube/` based on `yt.channel.classification`. Patches
`obsidian://`-URLs in the user's KB articles inline.

**Usage:**

```bash
# Dry-run first
bun run relocate-plugin-outputs --dry-run

# Live (optionally narrow to specific channels)
bun run relocate-plugin-outputs --include "ChannelA,ChannelB"
bun run relocate-plugin-outputs --limit 5
```

**Environment:** `DATABASE_URL`, `SHARED_VAULT_NAME` (default `test`), `USER_KB_VAULT_PATH`.

**Exit codes:** 0 success, 1 input error, 2 DB error, 3 obsidian CLI error
(HITL protocol — see CLAUDE.md), 4 atomicity total-fail (manual repair via stderr).

**Operative Reihenfolge** (Cluster 3 — Phase 4b):

1. `bun run relocate-plugin-outputs --dry-run` — Move-Plan + KB-Patches sichten
2. `bun run relocate-plugin-outputs` — Live-Lauf
3. Nightly via launchd/systemd/cron — Scheduler-Setup ist Sache des Operators (vgl. Scheduling-Hinweis in der „Nightly Pipeline"-Sektion oben).

## Pure modules (`src/utils/`)

Reimplemented from `sundevista/youtube-template@7470a90` (MIT). Tested via `bun test`.

| Module            | Functions                                                           |
| ----------------- | ------------------------------------------------------------------- |
| `parser.ts`       | `parseVideoId`, `parseChapters`, `parseISODuration`                 |
| `file.ts`         | `sanitizeFilename`, `resolveFilenameConflict`                       |
| `template.ts`     | `processTemplate` (with `chapterFormat` + `hashtagFormat` settings) |
| `obsidian-url.ts` | `encodeObsidianPath`, `buildObsidianUrl`                            |

Run tests: `bun test`.

## Database schema

5 tables + 2 enums in schema `yt` — see `prisma/schema.prisma`. Generated client lives in `src/generated/prisma/` (gitignored).

## Exit code convention

| Code | Meaning                                             |
| ---- | --------------------------------------------------- |
| 0    | success                                             |
| 1    | input / parse error                                 |
| 2    | DB connection error                                 |
| 3    | validation error                                    |
| 4    | API key / quota error (only in `get_video_details`) |

## Cluster 4 — Enrichment-Pipeline

5-Pass-Pipeline (Pass 0 deterministische Stub-Migration + Pass 1-5 via Claude-Sub-Agent) für `arbeit`-Videos. Schreibt `yt.transcript.audited_md`, `yt.video.display_title` und — falls ein Vault-Stub existiert — Frontmatter + `## Agent Zusammenfassung`-Sektion in den Stub-File.

> [!info] Modell- und Effort-Wahl pro Pass
> Pass 1+2 laufen auf `sonnet` (effort `medium`), Pass 3+4 auf `sonnet` (effort
> `low`), Pass 5 auf `opus` (effort `high`). `LlmCallOptions.model` und
> `LlmCallOptions.effort` sind Pflichtfelder — TypeScript-Compiler erzwingt
> explizite Wahl pro Call-Site. Begründung und Verifikationsbefunde aus der
> Sonnet-vs-Opus-Migration: siehe [`docs/model-choice.md`](docs/model-choice.md).

> [!info] R18 verworfen — nur `arbeit` via Claude
> Die ursprünglich geplante Account-Trennung Business/Privat in Claude wurde 2026-06-05 verworfen (Override im Decision-Log `<vault>/shared/yt-pipeline-decisions.md`). Pipeline läuft ausschließlich für `--classification arbeit`; `--classification privat` triggert Hard-Fail mit Exit 2. Privat/Secret-Content kommt später durch eine separate Codex-Pipeline.

### `enrich-video.ts`

Orchestriert die Pipeline für gegebene Mode. Pro Run wird ein `yt.enrich_run`-Datensatz angelegt; pro erfolgreichem Enrichment mit existierendem Stub-File ein **automatischer Git-Commit im Vault** (`yt-enrich: <youtube_id> — <display_title>`). Vor dem ersten Pass wird einmalig ein **Pre-Run-Cleanup-Commit** pro Vault gemacht (`git add -A` falls dirty) — damit Pipeline-Commits sich nicht mit fremden Edits vermischen. Git-Operations sind best-effort: Fehler werden geloggt, brechen die Pipeline nicht ab.

```bash
# Alle pending arbeit-Videos
bun run src/enrich-video.ts --pending --classification arbeit

# Einzelnes Video
bun run src/enrich-video.ts --id <yt-id> --classification arbeit

# Retry-Pass für transient errors (error_llm → pending → retry)
bun run src/enrich-video.ts --retry-errors --classification arbeit

# Bulk (ignoriert audit_status — Vorsicht, idempotency-bypass)
bun run src/enrich-video.ts --bulk --classification arbeit
```

Exit-Codes: 0 success, 1 input error (kein Mode), 2 `--classification privat` (Hard-Fail per R18-Override).

### `enrich-status.ts`

Reporting über letzte Runs + Verteilung aller `audit_status` + Top-50 Problemfälle.

```bash
bun run src/enrich-status.ts            # Letzte 5 Runs + Verteilung
bun run src/enrich-status.ts --errors   # Nur Problemfälle (error_llm, transcript_missing, skip_too_long, ...)
```

## Nightly Pipeline

Automatisierte 4-Step-Kette pro Nacht: Vault-Scan → Transcript-Download → Enrichment → Auto-Recovery. Vorgesehen für **eine** Ausführung pro Nacht (Beispiel: 03:00 lokale Zeit).

### Pipeline-Steps

1. `bun run src/import_youtube_note_links.ts --vault stefans-vault/shared` — scant den Shared-Vault nach neuen `youtube.com`/`youtu.be`-Links und legt `yt.note_link`-Einträge an.
2. `bun run src/import_youtube_transcript.ts --classification arbeit` — cookieless `yt-dlp`-Lauf für `arbeit`-Videos ohne Transcript. Der Filter verhindert, dass die Nightly stundenlang Transcripts für privat/unknown-Videos lädt und Step 3 dadurch nie erreicht (Step 3 enricht ohnehin nur `arbeit`).
3. `bun run src/enrich-video.ts --pending --classification arbeit --limit 10` — 5-Pass-Pipeline für maximal 10 pending `arbeit`-Videos pro Nacht. Limit schützt vor Lauf-Eskalation bei transient-API-Fehlern; Backlog wandert über Folge-Nächte ab.
4. `bun run src/enrich-video.ts --retry-post-critical-errors --classification arbeit --limit 10` — Auto-Recovery für Pass-3/4/5/Stub-Write-Failures. Smart-Partial-Pfad: Pass 1+2 wird geskippt, `audited_md` recycelt.

`set +e`-Semantik im Wrapper: jeder Step läuft unabhängig, Idempotenz/Error-Persistence in den CLIs. HITL-Cookie-Pfad (`--with-chrome-cookies`) bleibt manueller Workflow (Keychain-Prompt) und ist **nicht** Teil der Nightly.

### `recompute-plain-from-srt.ts` (Einmal-Wartung)

Einmaliges Wartungsskript, das die Cluster-1-Migrations-Lücke aus `migrate-from-main.ts:325` schließt (srt vorhanden, plain/llmFormatted leer). **Nicht** Teil der Nightly-Pipeline — der laufende Code-Pfad (`import_youtube_transcript.ts:128-144`) schreibt srt+plain+llmFormatted atomar.

```bash
bun run src/recompute-plain-from-srt.ts --dry-run
bun run src/recompute-plain-from-srt.ts
```

### Scheduling

Wie du die Pipeline einplanst, hängt von deinem Setup ab — macOS launchd LaunchAgent, Linux systemd timer, klassischer cron, GitHub Actions, etc. Repo-seitig wird kein Wrapper-Skript mehr ausgeliefert; baue dir einen passend zur Scheduler-Wahl. Wichtige Env-Vars für den Job:

- `DATABASE_URL`, `DATABASE_SCHEMA_NAME=yt` — Postgres-Connection (LaunchAgents/systemd laden **keine** `.env`, daher direkt in der Scheduler-Konfig setzen)
- `PATH` muss `bun` enthalten (z.B. asdf-shims-Pfad)
- `WorkingDirectory` muss auf `packages/yt-notes-scripts` zeigen (für `.tool-versions`/asdf-Pin)

### Robustheit

- `stubPathFor` in `enrich-video.ts` filtert verwaiste `note_link`-Einträge (Datei aus Vault gelöscht/umbenannt) via `existsSync` — kein ENOENT-Hard-Fail im `--pending`-Mode.
- Pre-Run-Cleanup-Commit (`commitAllInVault`) ist best-effort. Wenn ein Pre-Commit-Hook auf User-WIP Top-Level `shared/*.md` fehlschlägt, ist das kein Pipeline-Blocker — pro-Stub-`commitFile` läuft separat.

## Wo schaue ich mir Probleme an?

Drei Anlaufstellen pro Symptom-Klasse:

### 1. Schneller Überblick — `enrich-status --errors`

```bash
cd packages/yt-notes-scripts
bun run src/enrich-status.ts --errors
```

Zeigt die letzten 50 Rows mit Error- oder Skip-Status, sortiert nach `auditedAt DESC`. Spalten: `audit_status`, `youtube_id`, `display_title` (oder `title` falls noch nicht enriched), `channel`, erste 60 Zeichen vom `audit_error`-Stack.

Die acht relevanten Stati:

| Status                      | Bedeutung                                                       | Recovery                                           |
| --------------------------- | --------------------------------------------------------------- | -------------------------------------------------- |
| `error_llm`                 | Pass 1 oder Pass 2 hat geworfen, `audited_md` ist nicht gesetzt | `--retry-errors` (Full-Re-Run)                     |
| `error_empty_output`        | Pass 1 hat leer returned                                        | manuelle Inspektion (Transcript? Chapters?)        |
| `error_pass3_display_title` | Pass 1+2 ok, Pass 3 hat geworfen                                | `--retry-post-critical-errors` (Smart-Partial)     |
| `error_pass4_description`   | Pass 1+2 ok, Pass 4 hat geworfen                                | `--retry-post-critical-errors`                     |
| `error_pass5_summary_long`  | Pass 1+2 ok, Pass 5 (OHS-Wikilinks) hat geworfen                | `--retry-post-critical-errors`                     |
| `error_stub_write`          | Pipeline ok, Stub-File-Write oder Vault-Commit hat geworfen     | `--retry-post-critical-errors` (FS-Ursache prüfen) |
| `transcript_missing`        | `transcript.plain` ist leer                                     | `import_youtube_transcript.ts` für die ID          |
| `transcript_error_upstream` | yt-dlp/YouTube-API-Fehler bei Transcript-Import                 | yt-dlp-Cookies-Pfad                                |

### 2. SQL-Spotcheck pro Pass

Wenn `enrich-status --errors` einen Status zeigt und du den Stack-Trace willst:

```sql
\connect all_personal_projects_dev
SELECT v.youtube_id, c.name AS channel, t.audit_status,
       LEFT(t.audit_error, 1000) AS error_preview,
       t.audited_at, t.audit_model, t.audit_run_id
FROM yt.transcript t
JOIN yt.video v ON v.youtube_id = t.youtube_id
LEFT JOIN yt.channel c ON c.id = v.channel_id
WHERE t.audit_status = 'error_pass5_summary_long'
ORDER BY t.audited_at DESC
LIMIT 10;
```

Pro Status den entsprechenden Filter ersetzen.

### 3. Recovery-Workflow

**Auto-Recovery** läuft täglich um 03:00 via Nightly-Wrapper (`infra/launchd/yt-pipeline-nightly.sh` Step 4) — nichts zu tun, Errors konvergieren von allein wenn die zugrundeliegende Ursache (Sandbox-Bug, transienter Netzwerk-Hänger, etc.) behoben ist.

**Manueller Trigger** ist sinnvoll wenn du gerade einen Bug gefixt hast und nicht bis 03:00 warten willst:

```bash
cd packages/yt-notes-scripts
# Für die 4 Post-Critical-Stati: Smart-Partial-Pfad (Pass 1+2 geskippt)
bun run src/enrich-video.ts --retry-post-critical-errors --classification arbeit

# Für error_llm: Full-Re-Run (audited_md ist NULL)
bun run src/enrich-video.ts --retry-errors --classification arbeit
```

**Selektive Recovery** für eine einzelne ID (z.B. zum Debuggen):

```bash
# Status manuell auf pending zurücksetzen (audited_md bleibt für Smart-Partial)
psql -d all_personal_projects_dev -c "UPDATE yt.transcript SET audit_status='pending' WHERE youtube_id='<yt-id>';"

# Re-Run nur für diese eine ID
bun run src/enrich-video.ts --id <yt-id> --classification arbeit
```

Wenn du den Smart-Partial-Pfad NICHT willst (z.B. weil du `audited_md` neu rechnen lassen willst), explizit auch `audited_md` clearen:

```bash
psql -d all_personal_projects_dev -c "
  UPDATE yt.transcript
    SET audit_status='pending', audited_md=NULL, audited_at=NULL,
        audit_error=NULL, audit_model=NULL, audit_run_id=NULL
    WHERE youtube_id='<yt-id>';
  UPDATE yt.video SET display_title=NULL WHERE youtube_id='<yt-id>';
"
```
