# Modell- und Effort-Wahl pro Pass

Dokumentiert die Entscheidungen aus der Sonnet-vs-Opus-Migration der Cluster-4
Enrichment-Pipeline (2026-06-06). Quelldaten: A/B-Vergleiche auf zwei Pure-Prompt-
Sample-Videos und ein 3-Video-Full-Pipeline-Lauf (Lucas Barake, Jeremy Utley/EO,
Marina Wyss).

> **Update 2026-07-11:** Pass 1 (audit) und Pass 2 (asr-fix) wurden von
> `sonnet`/`medium` auf `opus`/`low` umgestellt (Nutzer-Entscheidung). Die
> Pro-Pass-Tabelle und die Effort-Faustregeln unten spiegeln den neuen Stand;
> die empirischen Sonnet-vs-Opus-Befunde weiter unten bleiben als historische
> Evaluations-Grundlage stehen. Die Kosten-Tabelle ist entsprechend veraltet.

## Pro-Pass-Konfiguration

| Pass                                   | Modell   | Effort   | Begründung                                                                                                                                                                                                                     |
| -------------------------------------- | -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1 audit (Werbung + Sektionierung)      | `opus`   | `low`    | Nutzer-Entscheidung 2026-07-11: auf Opus vereinheitlicht. Sektionierung mit gegebenen Chapters ist deterministisch; Werbung-Erkennung braucht Kontext, Pass-1-Regel "bei Unsicherheit drin lassen" begrenzt das Risiko.        |
| 2 asr-fix (ASR-Fehler korrigieren)     | `opus`   | `low`    | Nutzer-Entscheidung 2026-07-11: auf Opus vereinheitlicht. Domain-Verständnis nötig. Haiku bleibt **disqualifiziert** — versteht Domain-Vokabular nicht (Effect-Begriffe wie `Redacted`, `PgLive`, `@effect/sql` verpasst).     |
| 3 display_title (max 80 Zeichen)       | `sonnet` | `low`    | Mini-Generation, 1 Zeile Output. Sonnet hält Limit konsistent (Opus hat es 1× verletzt mit 88ch). Haiku zu wörtlich, matched Production-Stil nicht.                                                                            |
| 4 description (3 Sätze)                | `sonnet` | `low`    | Sonnet trifft "kompakt + konkret" am besten. Haiku zu generisch, Opus erzeugt 100-Wort-Bandwurm-Sätze.                                                                                                                         |
| 5 summary-long (Markdown + Bash-Tools) | `opus`   | `high`   | Agentic Loop mit Tool-Use (`ohs-search-merged.sh` für Wikilink-Disambiguierung), Spekulations-Disziplin, mehrere strukturierte Sektionen. Sonnet hier nicht getestet — wäre Risiko ohne klare Ersparnis.                       |

## Warum nicht alles auf einem Modell?

**Pass-Aufgaben sind zu unterschiedlich.** Single-Responsibility-Prinzip gilt für
Prompts wie für Code. Empirisch leidet die Qualität jeder Sub-Task, wenn ein
Modell 5 Dinge gleichzeitig im Kopf behalten muss (Werbung erkennen + ASR-Fix +
Titel + 3-Satz + agentic Synthese). Per-Pass-Modellwahl erlaubt:

- **Output-Token-Optimierung**: Sonnet ist ~5× günstiger als Opus bei Output, der
  bei Pass 1+2 dominiert (langer audited_md durchgereicht). Pass 3+4 sind Mini-
  Outputs — Sonnet-vs-Haiku-Differenz dort vernachlässigbar.
- **Tool-Use bleibt isoliert** in Pass 5 (`allowedTools: "Bash"`). Sonst würde
  jeder Call zum potentiell agentic Loop.
- **Partielles Retry**: `audit_status='error_post_pass2'` wenn Pass 1+2 ok aber
  Pass 3/4/5 failed → kein Wegwerfen des audited_md.

## Effort-Wahl

Claude CLI hat `--effort {low, medium, high, xhigh, max}`. Default ist `xhigh` —
**explizit setzen, sonst läuft alles unnötig teuer und langsam**.

Faustregeln:

- `low`: klare Aufgaben mit Domain-Verständnis + Mini-Outputs (Pass 1, 2, 3, 4).
- `medium`: aktuell in keinem Pass genutzt.
- `high`: agentic Loops mit Tool-Use und Mehrschritt-Synthese (Pass 5).
- `xhigh`/`max`: vermutlich nie für diese Pipeline nötig.

`LlmCallOptions.effort` ist Pflichtfeld (analog `model`) — TypeScript-Compiler
erzwingt, dass jeder Call-Site sich Gedanken macht.

## Caption-Klausel (Pass 1)

Pass-1-Prompt erlaubt explizit, **ASR-erfasste On-Screen-Captions zu streichen**
(Titelkarten, Chapter-Bauchbinden, Lower-Thirds-Sprechernamen). Bei Zweifel
drin lassen.

Begründung: ASR fängt häufig Video-Overlay-Text als "Speech" mit ein. Im
EO-Sample (Jeremy Utley) waren das z.B. die Titelkarte `"Exploring Human Agency
in the age of AI"` und Kapitel-Bauchbinden `"Chapter1.", "Chapter2.", "Chapter3."`.
Production-Opus hat sie 1:1 übernommen → unschöne Floating-Strings im audited_md
mitten zwischen Speaker-Sätzen, die Pass 3/4/5 als Input dann mit verarbeiten
mussten.

Sonnet hat das schon ohne Klausel pragmatisch gefiltert (technisch eine Regel-
Verletzung). Explizite Klausel macht das Verhalten regel-konform und modell-
unabhängig.

## Anti-Meta-Klausel (Pass 1)

Pass-1-Prompt enthält explizit:

> Output: Beginne deine Antwort direkt mit "### " der ersten Sektion. Kein
> einleitender Satz, kein Kommentar, keine Zusammenfassung deiner Vorgehensweise
> — nur das audited_md selbst.

Begründung: Im A/B haben Haiku und Opus (aber nicht Sonnet) gerne einen
Meta-Kommentar vor dem Output gepackt (z.B. _"Keine Werbung im Transcript
erkannt. Sektioniert nach den vorgegebenen YouTube-Chapters."_). Pipeline-Code
übernimmt den Raw-Output 1:1 als `auditedMd` → Meta-Kommentar landet in DB und
fließt in Pass 2/3/4/5 weiter.

Production-Opus hat das nur deshalb nicht in der DB, weil Pass 2 (asr-fix) den
Meta-Kommentar zufällig wegrasiert hat — fragil. Explizite Klausel schaltet
den Defekt deterministisch ab.

## Konkrete Verifikationsbefunde (3-Video-Sample 2026-06-06)

### Was Sonnet besser macht

- **Werbung-Erkennung**: Marina Wyss / DataCamp-Sponsor (03:31–04:54, 1:23min)
  erkannt aus Chapter-Titel "DataCamp AI Engineering courses" + Werbe-Marker
  korrekt gesetzt. **Production-Opus hatte das übersehen** und den ganzen
  Chapter im audited_md gelassen.
- **80-Zeichen-Limit für display_title**: konsistent eingehalten (62, 65, 59
  Zeichen). Opus-Baseline hatte 1× verletzt (Lucas 88 Zeichen).
- **Sprache-Constraint**: Jeremy Utley (englisches Video) bekam von Sonnet
  englischen Titel ("AI as Creative Teammate: How Mindset Shifts..."). Opus-
  Baseline hatte DE-Titel ("KI als Teammate statt Werkzeug — Jeremy Utley...")
  — verletzt "Original-Sprache des Videos beibehalten".
- **Anti-Halluzination**: Alte Opus-Wikilinks enthielten teils Selbst-
  Referenzen auf das eigene Video (`[[SqlClient Setup 2 Building...]]`,
  `[[AI Engineering A Realistic Roadmap for Beginners]]`). Neue Sonnet-Pass1+2
  → Opus-Pass5-Outputs zeigen keine Selbst-Referenzen mehr.

### Verbesserungen unabhängig vom Modellwechsel

- **Pass-5 "## Behauptungen" mit Timestamps**: durchgängig Timestamps in
  Klammern (`00:00`, `01:26`, `03:57`, ...). Verbesserte Rückverfolgbarkeit.
  Im Prompt war das optional — der neue Pass-5-Lauf nutzt es konsequenter.

### Was schwächer wirkt (aber nicht durch Sonnet verursacht)

- **OHS-Lookup teilweise gescheitert**: Pass 5 konnte `~/.claude/session-env/`
  nicht anlegen (EPERM) → Wikilinks fehlten bei 2 von 3 Sample-Videos
  (Jeremy + Lucas). Marina hatte OHS-Erfolg mit 3 echten KB-Links
  (`[[docker]]`, `[[Lokale KI]]`, `[[2025-08 Erste RAG - GraphRAG - Wissensgraphen]]`).
  Sandbox-Permission-Issue, **existiert auch im alten Opus-Setup**. Opus war
  früher "lauter" — hat halluzinierte Wikilinks gesetzt statt den Fehler zu
  melden. Sonnet ist hier ehrlicher (`(Nicht ermittelt — OHS-Lookup nicht
verfügbar.)`).

## Kosten-Vergleich (Beispiel-Video Lucas Barake, ~5k input tokens)

| Setup                                    | Pass-1+2+3+4 | Pass 5 | Total      |
| ---------------------------------------- | ------------ | ------ | ---------- |
| Alt (alles Opus, default `xhigh`)        | ~$1.20       | ~$0.40 | **~$1.60** |
| Neu (Sonnet 1–4 medium/low, Opus 5 high) | ~$0.55       | ~$0.40 | **~$0.95** |

Erwartete Ersparnis ~40% pro Video bei vergleichbarer/besserer Qualität. Bei
163 noch ausstehenden `pending arbeit`-Videos sind das grob $100 Ersparnis
gegenüber dem Status-quo.

## Offene Optimierungen

Siehe `current/youtube-pipeline-rollout.md` § "Verbleibende Detail-Punkte":

- **Anthropic Prompt Caching Spike** (eigene Test-Session, ohne parallele
  Agents): native SDK statt CLI, `cache_control: ephemeral` auf `audited_md`.
  Erwartet: Pass 3+4+5 Input fast gratis (10% des Normalpreises). Eliminiert
  die Sonnet-vs-Opus-Frage **nicht** — Output-Tokens bleiben gleich teuer.
- **OHS-Sandbox-Fix**: Permission für `~/.claude/session-env/` ergänzen, damit
  Pass-5-Wikilinks stabil funktionieren (siehe Rollout-Plan).

## Code-Verweise

- Modell + Effort pro Pass: `src/enrich-passes/pass{1,2,3,4,5}-*.ts`
- CLI-Brücke: `src/llm-caller.ts` (`LlmCallOptions` enthält `model` + `effort`
  als Pflichtfelder)
- Pipeline-Orchestrierung: `src/enrich-pipeline.ts` (`auditModel`-Spalte
  protokolliert das Pass-1+2-Modell pro DB-Row)
