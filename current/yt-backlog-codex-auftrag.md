# Auftrag: yt-Backlog über Codex abarbeiten, Rate-Limit überwachen

Stand 2026-10-17. Auftraggeber: der Mensch, über eine Claude-Code-Sitzung.
Dieser Auftrag gilt für jede Sitzung der Fenix-Kette `yt-backlog-codex`.

## Ziel

Alle `pending` arbeit-Videos der yt-Pipeline anreichern (Stand am 17.10.: rund
750). Pass 1–4 laufen über `codex exec` (`gpt-6.1-sol`/low, `gpt-6-luna`/low),
Pass 5 über `cursor-agent` (Grok). Das Codex-Kontingent wurde frisch
zurückgesetzt; es soll genutzt, aber nie in einen Fehlerlauf getrieben werden.
Erreicht ein Codex-Fenster sein Limit, wird pausiert, bis es zurückgesetzt ist.

## Lage beim Start

- Der launchd-Job `de.kims.yt-pipeline-nightly` ist mit `launchctl disable`
  abgeschaltet. Ein letzter manueller Lauf dieses Jobs (Run
  `a6b417d1-cc7e-44f2-8570-9e1feb16ef31`, 20 Videos) läuft noch und schreibt
  nach `~/Library/Logs/kims-yt-pipeline-prod-nightly.log`.
- **Erster Handgriff:** warten, bis in diesem Log nach Zeile 6934 eine Zeile
  `[yt-pipeline-nightly] end …` steht. Erst danach selbst Videos anfassen —
  zwei gleichzeitige Läufe greifen sonst dieselben `pending`-Videos.
- Danach den Job aushängen, damit er auch nicht versehentlich um 02:00 startet:
  `launchctl bootout gui/501/de.kims.yt-pipeline-nightly` (als eigener Befehl).
  **Nicht** wieder einschalten — das entscheidet der Mensch.

## Arbeitsweise

Arbeitsverzeichnis: `/Users/hoschi/repos/personal-prod/packages/yt-notes-scripts`.
Die DB-Verbindung kommt aus der `.env` dort (bun lädt sie selbst).

Ein Durchgang:

1. **Kontingent prüfen** (siehe unten). Ist ein Fenster bei 95 % oder mehr:
   pausieren bis `resets_at` plus 2 Minuten, dann erneut prüfen.
2. Batch im Hintergrund starten und den Kontext klein halten:
   `nohup bun run src/enrich-video.ts --pending --classification arbeit --limit 20 >> ~/Library/Logs/kims-yt-backlog-codex.log 2>&1 &`
   Danach in Abständen von etwa 10 Minuten nur das Log-Ende und den Prozess
   prüfen, bis die Zeile `Run <id> done: ok=… skipped=… errored=…` steht.
3. Danach `bun run src/enrich-video.ts --retry-post-critical-errors --classification arbeit --limit 10 -y`
   (ebenfalls ins selbe Log).
4. Nach jedem Durchgang die Fehler dieses Runs ansehen:
   `select youtube_id, audit_status, left(audit_error,300) from yt.transcript where audit_run_id='<run-id>' and audit_status like 'error%'`
   (psql gegen `postgresql://all_personal_projects_prod:all_personal_projects_prod@localhost:5432/all_personal_projects_prod`).
5. Alle fünf Durchgänge und am Ende einmal die Nachlauf-Schritte aus
   `~/repos/kims/scripts/launchd/yt-pipeline-nightly.sh` fahren: Step 5
   (relocate) und Step 6 (OHS-Reindex der Transcripts), mit den Umgebungs-
   variablen und Log-Dateien, die das Skript dort setzt.

Fertig ist der Auftrag, wenn keine `pending` arbeit-Videos mehr übrig sind
(`select count(*) from yt.transcript t join yt.video v on v.youtube_id=t.youtube_id join yt.channel c on c.id=v.channel_id where c.classification='arbeit' and t.audit_status='pending'`).

## Rate-Limit erkennen

**Vorab:** Codex schreibt den Kontingent-Stand in jedes `token_count`-Event
der Sitzungsdatei unter `~/.codex/sessions/<jahr>/<monat>/<tag>/`. Die eigene
Sitzung hat eine solche Datei; sie über die eigene Sitzungs-Kennung finden,
nie über die jüngste Änderungszeit (parallel laufen andere Codex-Sitzungen).
Falle: `plan_type` steht direkt unter `rate_limits`, `used_percent`,
`window_minutes` und `resets_at` stehen unter `rate_limits.primary` bzw.
`rate_limits.secondary`. Hintergrund: `~/repos/kims/knowledge-base/codex-als-dritte-harness.md`,
Abschnitt „Wo die Messwerte liegen".

**Nachher:** Fehler mit Meldungen wie `usage limit`, `rate limit`, `429` oder
`try again at` in `audit_error` oder im Log gelten als Rate-Limit. Dann sofort
keinen neuen Batch starten, bis zum Reset pausieren und die betroffenen Videos
danach mit `--retry-errors --classification arbeit --limit <anzahl> -y` neu
einreihen. Die Pipeline-Aufrufe selbst laufen mit `--ephemeral` und hinterlassen
keine Sitzungsdatei — den Stand liest du deshalb aus der eigenen.

## Grenzen

- Keinen Code und keine Konfiguration ändern. Keine Commits in den Repos
  (die Pipeline committet den Vault selbst).
- Kein `--bulk`.
- Scheitern drei Videos hintereinander mit demselben Fehler, der **kein**
  Rate-Limit ist: anhalten, Fehlertext und Run-ID in den Wiedereinstieg
  schreiben und dem Menschen vorlegen. Nicht selbst reparieren.
- Zwischen 01:00 und 01:10 startet `de.kims.nacht-ki-pause` die OHS-Dienste
  neu; ein Pass-5-Fehler in diesem Fenster ist kein Systemfehler, Step 3 des
  Durchgangs fängt ihn auf.

## Bericht

In der Fenix-Kettendatei unter „Stand für den Menschen" fortschreiben: Zahl der
erledigten Videos, offene `pending`, Fehler nach Art, jede Pause mit Anlass und
Dauer. Am Ende zusätzlich: Hinweis, dass der Nightly abgeschaltet ist und der
Mensch über das Wiedereinschalten entscheidet
(`launchctl enable gui/501/de.kims.yt-pipeline-nightly`, danach `bootstrap`).
