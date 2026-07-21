---
name: youtube-context-lookup
description: |
  Lädt komplette Video-Details aus der yt-Pipeline-DB ins Kontext-Fenster,
  damit der Agent oder ein Sub-Agent sich *im Detail* mit einem einzelnen
  YouTube-Video beschäftigen kann.

  Trigger:
  a) User will sich mit dem Agent über ein konkretes Video unterhalten —
     "erzähl mir was Video X zu Topic Y sagt", "fass das Video Y zusammen",
     "vergleich Video A mit Video B".
  b) Agent hat ein Video gefunden (z.B. via ohs-search-merged.sh) und will
     sich davon die *ungekürzten Details* aus der DB ziehen, statt mit
     Such-Snippets weiterzuarbeiten.

  NICHT für Discovery — dafür ist ohs-search-merged --vault-type arbeit der
  richtige Weg (semantische Cross-Vault-Suche, inkl. YT-Index). Dieser Skill
  ist Komplement zu OHS, nicht Ersatz.
allowed-tools: [Bash, Read]
---

# youtube-context-lookup

Wrapper um die CLI `yt-lookup.ts` aus `packages/yt-notes-scripts`. Bringt
die kompletten DB-Felder zu einem YouTube-Video ins Kontext-Fenster.

## Wann nutzen

**Trigger a — User-Unterhaltung über ein Video:**

- "lass mich mit dir über Video X reden"
- "erzähl mir was Lex Fridman in Video X zu Topic Y sagt"
- "fass Video X zusammen"
- "welche Eigennamen kommen in Video X vor?"
- "vergleich Video A mit Video B" (zwei separate Skill-Aufrufe oder Sub-Agents)

**Trigger b — Agent-interner Detail-Lookup:**

Agent hat z.B. via OHS-Suche das Video `wv779vmyPVY` (Jeremy Utley) als
Top-Hit erhalten. Snippets reichen nicht für die Aufgabe ("vergleiche die
drei Effective-Agents-Prinzipien zwischen Anthropic-Video und Lucas-Barake-
Effect-Video"). Skill lädt das vollständige `audited_md` beider Videos und
gibt dem Hauptkontext Synthese-fähige Daten zurück.

## Wann NICHT nutzen

- **Discovery** ("welche Videos gibt es zu RAG?"): nutze deinen OHS-Wrapper
  (`<your-ohs-wrapper>/ohs-search-merged.sh --vault-type arbeit "RAG"`).
- **Mehrere Videos parallel vergleichen**: spawne Sub-Agents pro Video statt
  mehrere `yt-lookup`-Aufrufe in denselben Kontext zu drücken.
- **Web-YouTube-Daten** (Comments, Likes, Channel-Statistiken): die Pipeline
  cached nur Transcripts + Metadaten zum Audit-Zeitpunkt. Für Live-Daten
  Web-Tools nutzen.

## Schritte

1. **yt-id ermitteln**
   - Aus User-Nachricht extrahieren (URL, ID-String)
   - Aus letztem Read auf `shared/youtube/*.md` ableiten — dann `--file <pfad>` statt `--id`
   - Wenn unklar: User explizit fragen

2. **Welches Feld?** — Entscheidungs-Matrix:

   | Anliegen                                          | `--field`              |
   | ------------------------------------------------- | ---------------------- |
   | „Unterhalten über Video", strukturierte Übersicht | `audited_md` (default) |
   | Roher Volltext für eigene Analyse                 | `plain`                |
   | Eigennamen-Liste                                  | `named_entities`       |
   | SRT mit Zeit-Stempeln                             | `srt`                  |
   | Deutsche Kurz-Beschreibung                        | `description_short`    |
   | Alles auf einmal                                  | `all`                  |

3. **CLI aufrufen** via Bash:

   ```bash
   cd ~/repos/personal-prod/packages/yt-notes-scripts && \
     bun run src/yt-lookup.ts --id <yt-id> --field <feldname>
   ```

   `cd` ist nötig, damit Bun die `.env` mit `DATABASE_URL` aus dem Package-Root lädt.

   Für mehr Format-/Field-Details: `cd ~/repos/personal-prod/packages/yt-notes-scripts && bun run src/yt-lookup.ts --help`.

4. **Mit dem Output arbeiten**
   - Beim Zitieren in einem KB-Artikel: **Pattern 1** beachten (Erkenntnis
     selbst ausformulieren — KB-Artikel muss eigenständig sinntragend sein).
   - **Backtracking-Link-Format** verwenden (siehe
     `[[youtube-quellen-konvention]]` im shared-Vault Sektion 3):
     `Laut dem Video [<Titel> (<TS>)](obsidian://open?vault=test&file=youtube%2F<channel>%2F<title>) gilt …`

## Anti-Pattern

- **NICHT** diesen Skill für Discovery nutzen. Wenn die yt-id nicht bekannt
  ist, ist OHS-Suche der erste Schritt.
- **NICHT** den Skill mehrfach im selben Kontext-Fenster für verschiedene
  Videos aufrufen — pro Video bis zu mehrere KB Volltext. Spawne stattdessen
  Sub-Agents (`Agent` mit `subagent_type: general-purpose`), die je ein
  Video bearbeiten und kompakt zurückberichten.

## Symlink-Setup (User-Aktion, einmalig)

Damit der Skill global verfügbar ist (nicht nur in personal-prod):

```bash
ln -s ~/repos/personal-prod/packages/yt-notes-scripts/skills/youtube-context-lookup \
      <your-claude-skills-dir>/youtube-context-lookup
```

`<your-claude-skills-dir>` ist typischerweise `~/.claude/skills/`.

Sandbox blockt `ln -s` in `~/.claude/` — Symlink-Setup MUSS der User
manuell im Terminal ausführen.
