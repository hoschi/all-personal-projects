# Pass 5 — Grok 4.6 xhigh gegen Opus 5 high (2026-08-23)

Messung zur Frage: Können wir Pass 5 (`summary-long`) von `opus`/`high` auf
Grok 4.6 xhigh umstellen, und was verlieren wir dabei?

## Aufbau

- **Referenz-Arm (Opus 5, `high`)**: die Pass-5-Ausgabe aus dem Produktionslauf,
  wie sie im Shared-Vault-Stub steht. Nicht neu erzeugt — das Video war schon
  enricht. Kostet kein Kontingent, ist dafür bereits nachbearbeitet
  (`stripLinkBackticks`, Cross-Vault-Auto-Fix, `linkifyTimestamps`,
  `assembleEnrichedBody`). Die Rohausgabe von Opus existiert nicht mehr; die
  Pipeline speichert sie nirgends.
- **Vergleichs-Arm (Grok 4.6 xhigh)**: `buildPass5Prompt(auditedMd)` —
  zeichengleich derselbe Prompt-Text wie in Produktion — über
  `scripts/agent-herdr.sh einmal --kind cursor --model cursor-grok-4.6-xhigh`.
  Rohausgabe unter `grok/<id>.raw.md`, dieselbe Nachbearbeitung wie in
  Produktion unter `grok/<id>.assembled.md`.

## Bekannte Unterschiede zwischen den Armen (Confounder)

Beim Lesen der Zahlen mitdenken:

1. **Nachbearbeitung.** Der Opus-Text ist nur nachbearbeitet verfügbar. Roh-
   Formfehler von Opus (Vorrede, fremde Überschriften, Backtick-Links, kaputte
   Cross-Vault-Links) sind darin bereits geheilt oder verworfen. Grok wird roh
   **und** nachbearbeitet gemessen; für den Vergleich zählt die nachbearbeitete
   Fassung, die Roh-Zahlen stehen als Zusatz daneben.
2. **Prompt-Zustellung.** Opus bekommt den Prompt über `claude -p`. Grok bekommt
   einen kurzen Auftrag, der auf eine Datei mit demselben Prompt-Text zeigt —
   `herdr` kann 40 kB nicht zuverlässig ins Eingabefeld schicken.
3. **Umgebungs-Präambel.** Beide Arme lesen eine Regelbasis, die nicht Teil des
   Pass-5-Prompts ist: Opus `~/.claude/CLAUDE.md`, Grok die
   `cursor-root/praeambel.md` (1842 B) von `agent-herdr.sh`. Aus letzterer
   stammt der Marker `--FERTIG--`, den Grok anhängt; er wird vor der Ablage
   entfernt und zählt nicht als Formfehler des Modells.
4. **Retry-Schleife.** Produktion fährt Pass 5 bis zu dreimal, wenn der
   Cross-Vault-Validator kaputte Links meldet. Der Grok-Arm hat nur einen
   Versuch. Der Vergleich nutzt deshalb die Auto-Fix-Stufe, die in Produktion
   nach dem dritten Versuch greift.
5. **Zwei Läufe eines Modells streuen.** Je Video liegt genau ein Grok-Lauf vor.
   Ein Unterschied bei einem einzelnen Video belegt nichts; die Aussage steckt
   in der Verteilung über die 16 Videos und vier Video-Arten.

## Video-Auswahl

`videos.json` — vier Arten à vier Videos, ausgewählt aus den zuletzt enrichten
Videos, die einen Vault-Stub haben (nur dort existiert die Opus-Referenz):

| Art | Merkmal |
| --- | --- |
| `art1-konferenz-talk` | Vortrag, ein Sprecher, konzeptlastig, 16–27 min |
| `art2-langes-workflow-tutorial` | Screencast mit vorgeführten Schritten, 15–31 min |
| `art3-kurzes-news-video` | Release-/News-Video, 8–13 min, hohe Produktnamen-Dichte |
| `art4-kurzes-tool-demo` | Tool-Demo mit starkem Vault-Bezug, 5–11 min |

## Dateien

| Pfad | Inhalt |
| --- | --- |
| `videos.json` | Auswahl je Art |
| `dump-prompts.ts` | schreibt `prompts/` (Pass-5-Eingabe) und `opus/` (Vault-Stub) |
| `assemble-grok.ts` | Grok-Roh → Produktions-Nachbearbeitung → `grok/*.assembled.md` |
| `analyze.ts` | maschinelle Regeltreue-Messung → `metrics.json` |
| `make-judge-prompts.ts` | verblindete A/B-Richter-Vorlagen → `judge/` |
| `BERICHT.md` | Ergebnis und Empfehlung |
