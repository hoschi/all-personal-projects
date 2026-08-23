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

> **Update 2026-08-23:** Pass 5 (summary-long) läuft nicht mehr über
> `claude --print`, sondern über `cursor-agent --print` auf
> `cursor-grok-4.6-xhigh`. Beleg ist die 16-Video-Vergleichsmessung in
> [`docs/measurements/2026-08-23-pass5-grok46-vs-opus5/BERICHT.md`](measurements/2026-08-23-pass5-grok46-vs-opus5/BERICHT.md).
> Pass 1–4 bleiben unverändert bei Claude. Damit hat die Pipeline zwei Kanäle;
> `LlmCallOptions` in `src/llm-caller.ts` ist eine Union über `channel`, jede
> Aufrufstelle nennt Kanal, Modell und Reasoning-Stufe selbst.

## Pro-Pass-Konfiguration

Kanal ist `claude --print`, wo nichts anderes dabeisteht.

| Pass                                   | Modell   | Effort   | Begründung                                                                                                                                                                                                                     |
| -------------------------------------- | -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1 audit (Werbung + Sektionierung)      | `opus`   | `low`    | Nutzer-Entscheidung 2026-07-11: auf Opus vereinheitlicht. Sektionierung mit gegebenen Chapters ist deterministisch; Werbung-Erkennung braucht Kontext, Pass-1-Regel "bei Unsicherheit drin lassen" begrenzt das Risiko.        |
| 2 asr-fix (ASR-Fehler korrigieren)     | `opus`   | `low`    | Nutzer-Entscheidung 2026-07-11: auf Opus vereinheitlicht. Domain-Verständnis nötig. Haiku bleibt **disqualifiziert** — versteht Domain-Vokabular nicht (Effect-Begriffe wie `Redacted`, `PgLive`, `@effect/sql` verpasst).     |
| 3 display_title (max 80 Zeichen)       | `sonnet` | `low`    | Mini-Generation, 1 Zeile Output. Sonnet hält Limit konsistent (Opus hat es 1× verletzt mit 88ch). Haiku zu wörtlich, matched Production-Stil nicht.                                                                            |
| 4 description (3 Sätze)                | `sonnet` | `low`    | Sonnet trifft "kompakt + konkret" am besten. Haiku zu generisch, Opus erzeugt 100-Wort-Bandwurm-Sätze.                                                                                                                         |
| 5 summary-long (Markdown + Shell-Tool) | `cursor-grok-4.6` über `cursor-agent --print` | `xhigh` | Agentic Loop mit Tool-Use (`ohs-search-merged.sh` für Wikilink-Disambiguierung), Spekulations-Disziplin, mehrere strukturierte Sektionen. Gegen `opus`/`high` gemessen an 16 Videos in vier Video-Arten: Grok gewinnt Vollständigkeit einstimmig über zwei verblindete Richter und Präzision deutlich, setzt 182 statt 95 Vault-Links (alle auflösbar) und hält das Wikilink-Verfahren in 16 von 16 Läufen ein. Beleg: [`measurements/2026-08-23-pass5-grok46-vs-opus5/BERICHT.md`](measurements/2026-08-23-pass5-grok46-vs-opus5/BERICHT.md). Preis fällt nicht ins Gewicht (enthaltener Topf des Cursor-Pro+-Plans), Laufzeit schon: 209–696 s je Video, Median 412 s. |

## Warum nicht alles auf einem Modell?

**Pass-Aufgaben sind zu unterschiedlich.** Single-Responsibility-Prinzip gilt für
Prompts wie für Code. Empirisch leidet die Qualität jeder Sub-Task, wenn ein
Modell 5 Dinge gleichzeitig im Kopf behalten muss (Werbung erkennen + ASR-Fix +
Titel + 3-Satz + agentic Synthese). Per-Pass-Modellwahl erlaubt:

- **Output-Token-Optimierung**: Sonnet ist ~5× günstiger als Opus bei Output, der
  bei Pass 1+2 dominiert (langer audited_md durchgereicht). Pass 3+4 sind Mini-
  Outputs — Sonnet-vs-Haiku-Differenz dort vernachlässigbar.
- **Tool-Use bleibt isoliert** in Pass 5. Sonst würde jeder Call zum potentiell
  agentic Loop. Pass 1–4 laufen mit `allowedTools: ""`, Pass 5 bekommt genau
  einen Shell-Befehl frei (siehe „Werkzeug-Schranke in Pass 5" unten).
- **Partielles Retry**: `audit_status='error_post_pass2'` wenn Pass 1+2 ok aber
  Pass 3/4/5 failed → kein Wegwerfen des audited_md.

## Effort-Wahl

Die beiden Kanäle drücken die Reasoning-Stufe verschieden aus, deshalb zwei
Leitern.

**Claude CLI (Pass 1–4)** hat `--effort {low, medium, high, xhigh, max}`.
Default ist `xhigh` — **explizit setzen, sonst läuft alles unnötig teuer und
langsam**.

- `low`: klare Aufgaben mit Domain-Verständnis + Mini-Outputs (Pass 1, 2, 3, 4).
- `medium`: aktuell in keinem Pass genutzt.
- `high`: bis 2026-08-23 der Wert von Pass 5, seit dem Kanalwechsel ungenutzt.
- `xhigh`/`max`: für die Claude-Pässe dieser Pipeline nicht nötig.

**Cursor CLI (Pass 5)** kennt keinen eigenen Schalter: die Stufe steckt im
Modell-Slug (`cursor-grok-4.6-xhigh`), Leiter `{low, medium, high, xhigh}`.
`llm-caller.ts` setzt den Slug deshalb aus `model` + `effort` zusammen, damit
die Stufe ein Pflichtfeld bleibt statt im Slug-String unterzugehen.

- `xhigh`: der einzige gemessene Wert für Pass 5. `high` ist **nicht** gemessen
  (siehe Abschnitt „Was diese Messung nicht zeigt" im Bericht); ein Wechsel
  darauf wäre eine neue Messung, keine Feineinstellung.

`LlmCallOptions` ist eine Union über `channel`; `model` und `effort` sind in
beiden Zweigen Pflichtfelder. Der TypeScript-Compiler erzwingt damit, dass
jede Aufrufstelle Kanal, Modell und Stufe selbst nennt — es gibt keinen Zweig,
in den man ohne Entscheidung hineinrutscht. Die `@ts-expect-error`-Blöcke in
`src/llm-caller.test.ts` halten das fest.

## Werkzeug-Schranke in Pass 5

`auditedMd` ist ungeprüfter Transkript-Text. Der Sub-Agent darf deshalb genau
eine Sache tun: den OHS-Lookup des Wikilink-Verfahrens absetzen.

Beim claude-Kanal machte das `--allowed-tools "Bash(OHS_NODE_BIN=* <wrapper> *)"`.
Die Cursor CLI hat dafür kein Gegenstück, das trägt — gemessen am 2026-08-23 mit
cursor-agent 2026.08.11-e8db854:

- `permissions.deny` greift zwar auch unter `approvalMode: "unrestricted"`, wird
  aber **vor** jeder Allowlist geprüft. „Alles sperren außer diesem einen" lässt
  sich damit nicht ausdrücken.
- `permissions.allow` plus `approvalMode: "allowlist"` lehnt unbekannte Befehle
  ab, lässt eingebaut-harmlose wie `echo` unter `--print` aber durch.

Tragend sind deshalb zwei Hooks, die `src/llm-caller.ts` je Aufruf in ein
Wegwerf-Arbeitsverzeichnis schreibt und die `src/cursor-agent-guard.ts`
bedient — beide `failClosed`, ein Fehler im Guard ist also ein Deny:

- `preToolUse` lässt nur das Shell-Werkzeug durch. `Read`, `Write`, `Grep`,
  `Fetch` und der Rest sind gesperrt.
- `beforeShellExecution` lässt von der Shell nur Befehle durch, die mit einem
  der drei Präfixe aus `buildPass5AllowedShellPrefixes()` beginnen, und lehnt
  jede Verkettung (`;`, `&&`, `|`, `$(…)`, Umleitung) ab.

Dazu kommt ein eigenes `CURSOR_CONFIG_DIR` je Aufruf: der Lauf hängt damit nicht
an der interaktiven Cursor-Konfiguration des Nutzers und bekommt mangels
`mcp.json` auch keine MCP-Werkzeuge.

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

- Kanal + Modell + Effort pro Pass: `src/enrich-passes/pass{1,2,3,4,5}-*.ts`;
  für Pass 5 gebündelt in `buildPass5CallOptions()`
- CLI-Brücke, beide Kanäle: `src/llm-caller.ts` (`LlmCallOptions` als Union über
  `channel`, `model` + `effort` in beiden Zweigen Pflichtfelder)
- Werkzeug-Schranke des cursor-Kanals: `src/cursor-agent-guard.ts`
- Vergleichsmessung, die den Pass-5-Kanalwechsel trägt:
  [`docs/measurements/2026-08-23-pass5-grok46-vs-opus5/BERICHT.md`](measurements/2026-08-23-pass5-grok46-vs-opus5/BERICHT.md)
- Pipeline-Orchestrierung: `src/enrich-pipeline.ts` (`auditModel`-Spalte
  protokolliert das Pass-1+2-Modell pro DB-Row)
