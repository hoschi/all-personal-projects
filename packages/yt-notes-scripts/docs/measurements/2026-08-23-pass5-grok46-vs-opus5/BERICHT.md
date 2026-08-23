# Pass 5: Grok 4.6 xhigh gegen Opus 5 high — Ergebnis

Gemessen am 2026-08-23 an 16 Videos in vier Video-Arten. Aufbau, Auswahl und die
bekannten Unterschiede zwischen den Armen stehen in `README.md`; die Rohdaten in
`grok/`, `opus/`, `metrics.json`, `judge/` und `judge-scores-*.json`.

## Kurzfassung

**Grok 4.6 xhigh ist in dieser Messung nicht schlechter als Opus 5 high, sondern
in zwei von vier inhaltlichen Kriterien deutlich besser.** Ein Wechsel kostet
nichts an Qualität; er kostet Laufzeit und nimmt einen kleinen Formfehler-Rand
in Kauf, den die bestehende Nachbearbeitung bereits abfängt.

| Kriterium | Ergebnis |
| --- | --- |
| Vollständigkeit | **Grok**, einstimmig — beide Richter, alle Videos |
| Präzision | **Grok**, deutlich (10:2 bzw. 7:1) |
| Treue zum Transkript | leichter Vorteil Grok, aber die Richter sind sich uneinig |
| Regeltreue (Sektionsvorgaben) | überwiegend gleichwertig, kleiner Vorteil Opus |
| Wikilink-Mechanik | **Grok**: 182 gegen 95 Links, alle auflösbar, kein Auto-Fix nötig |
| Laufzeit je Video | Grok 209–696 s (Median 412 s) über `agent-herdr.sh` |
| Kosten | Grok liegt im enthaltenen Topf des Cursor-Pro+-Plans |

## Was gemessen wurde

Zwei Ebenen, getrennt gehalten:

1. **Maschinelle Regeltreue** (`analyze.ts` → `metrics.json`): Sektionsbestand,
   Vorrede, fremde Überschriften, Link-Anzahl, Link-Auflösbarkeit gegen beide
   Vaults, Backtick-Links, Links in `## Behauptungen`, Selbstreferenzen,
   Timestamp-Format. Kein Modell beteiligt.
2. **Verblindetes A/B-Urteil** durch zwei unabhängige Richter, jeder mit dem
   Transkript und beiden Fassungen als „Fassung A" und „Fassung B", ohne
   Modellnamen. Die A/B-Position wechselt je Video-Art ab (8× Grok als A, 8× als
   B). Richterarm 1: Opus 5 high, alle 16 Videos. Richterarm 2: Grok 4.6 xhigh,
   8 Videos (2 je Art) — als Gegenprobe auf Selbstbevorzugung.

## Ergebnis der maschinellen Messung

Über alle 16 Videos, beide Arme:

| Kennzahl | Opus 5 high | Grok 4.6 xhigh |
| --- | --- | --- |
| Sektionsbestand vollständig | 16/16 | 16/16 |
| Vorrede vor der ersten Sektion | 0 | 1 (`vDVSGVpB2vc`, 124 Zeichen) |
| fremde Überschriften | 0 | 0 |
| Vault-Links gesamt | 95 | **182** |
| davon nicht auflösbar | 0 | **0** |
| Cross-Vault-Auto-Fix nötig | — | **0 von 16** |
| Links in Backticks | 0 | 0 |
| Links in `## Behauptungen` (verboten) | 0 | 0 |
| Selbstreferenz auf das eigene Video | **1** (`Rw37z2Cma-k`) | 0 |
| Timestamp-Formatverstöße | 0 | 0 |
| Aussage-Bullets gesamt | 787 | **1055** |
| Zeichen gesamt | 134 725 | 131 117 |

Der eine Treffer, den die Timestamp-Prüfung auf der Opus-Seite meldete, ist ein
Falsch-Positiv der Messung: `(56,64)` in `Rw37z2Cma-k` ist ein Benchmark-Wert,
keine Zeitangabe. Beide Arme halten das Timestamp-Format ein.

Zwei Punkte daraus sind entscheidend:

- **Grok setzt fast doppelt so viele Vault-Links, und keiner davon ist tot.** Das
  Wikilink-Verfahren des Prompts (OHS-Lookup, `score_native >= 0.8`,
  Link-Form nach `source_index`) hält Grok in allen 16 Läufen ein. Die
  Retry-Schleife der Pipeline hätte in keinem einzigen Lauf anspringen müssen.
- **Grok packt 34 % mehr Aussage-Bullets in dieselbe Textmenge.** Die
  Zusammenfassungen sind gleich lang, aber dichter.

Die Selbstreferenz auf der Opus-Seite ist genau der Fehler, den
`docs/model-choice.md` als Opus-Muster notiert hat — er ist noch da.

## Ergebnis der verblindeten Bewertung

Alle 16 Videos, Richter Opus 5 high:

| Kriterium | Grok besser | Opus besser | gleichwertig |
| --- | --- | --- | --- |
| Treue | 6 | 4 | 6 |
| Vollständigkeit | **13** | 0 | 3 |
| Präzision | **10** | 2 | 4 |
| Regeltreue | 3 | 5 | 8 |

Die 8 Videos, die beide Richter bewertet haben:

| Kriterium | Opus-Richter (g/o/=) | Grok-Richter (g/o/=) | Übereinstimmung |
| --- | --- | --- | --- |
| Treue | 3/2/3 | 5/3/0 | 3 von 8 |
| Vollständigkeit | 8/0/0 | 8/0/0 | **8 von 8** |
| Präzision | 7/0/1 | 7/1/0 | 6 von 8 |
| Regeltreue | 3/0/5 | 1/0/7 | 6 von 8 |

**Vollständigkeit ist das robusteste Ergebnis der ganzen Messung.** Beide Richter,
alle bewerteten Videos, ohne eine einzige Gegenstimme. Der Grok-Richter zählt auf
diesen 8 Videos 74 fehlende Transkript-Inhalte in der Opus-Fassung gegen 24 in
der Grok-Fassung; der Opus-Richter kommt auf der Teilmenge, in der er zählt, auf
dasselbe Verhältnis (29 zu 14).

**Kontrolle auf Selbstbevorzugung:** Der Opus-Richter bevorzugt die Grok-Fassung,
also die des anderen Modells — die Richtung des Ergebnisses läuft gegen sein
Eigeninteresse. Der Grok-Richter urteilt gleichsinnig. Ein Bias, der das
Ergebnis erklärt, müsste in beiden Armen dieselbe Fassung bevorzugen, obwohl die
Modelle verschieden sind; das ist die unwahrscheinlichere Erklärung.

**Kontrolle auf Positions-Vorliebe:** Über alle 16 Videos gewinnt bei
Vollständigkeit 6× Position A und 7× Position B — keine Positions-Vorliebe. Beim
Kriterium **Treue** dagegen 8× A gegen 2× B; das Treue-Urteil des Opus-Richters
hängt also an der Reihenfolge und trägt für sich genommen keine Aussage. Da Grok
in genau der Hälfte der Videos auf Position A stand, verschiebt das den
Gesamtvergleich nicht — es macht nur die Treue-Zeile unbrauchbar als Beleg.

## Was ein Wechsel konkret kostet

**Der Handel ist: mehr Inhalt gegen mehr Angriffsfläche.** Der Grok-Richter zählt
auf seinen 8 Videos 24 nicht gedeckte Aussagen bei Grok gegen 21 bei Opus — in
absoluten Zahlen ist Grok also minimal schlechter. Bezogen auf die Zahl der
Aussagen kippt das:

| | Grok | Opus |
| --- | --- | --- |
| Aussage-Bullets (8 Videos) | 551 | 403 |
| davon nicht gedeckt | 24 | 21 |
| **Quote** | **4,4 %** | **5,2 %** |

Grok sagt mehr und liegt dabei anteilig etwas seltener daneben. Wer die absolute
Zahl falscher Aussagen minimieren will, gewinnt mit Opus drei Aussagen — und
verliert 50 richtige.

**Formfehler**, die tatsächlich aufgetreten sind:

- Grok, `vDVSGVpB2vc`: ein Meta-Satz vor `## Worum es geht`
  („Die erste OHS-Suche hängt ohne Treffer …"). Der Satz landet **nicht** im
  Vault: `assembleEnrichedBody` verwirft alles vor der ersten H2 — nachgeprüft
  an `grok/vDVSGVpB2vc.assembled.md`, der Satz steht dort nicht. 1 von 16.
- Grok, `YAJPdlWaWzM`: in `## Genannte Tools` stehen Artikeltitel statt
  Tool-Namen, Siri wird als Tool geführt, zwei Fachbegriffe sind eingedeutscht.
- Grok, `WkBPX-oDMnA`: zwei nicht vorgeführte Punkte stehen unter
  `## Demos / Schritte`.
- Grok, `YgEv7IQzGdM`: konjugierte englische Verben in deutschen Sätzen.
- Opus, `Ya51a1EJPZk`: hinter `## Verwandt` hängt ein Nutzer-Hinweis mit
  Rückfrage — dieselbe Klasse Fehler, andere Stelle.
- Opus, `Rw37z2Cma-k`: Wikilink auf das eigene Video.

Keiner dieser Fehler ist häufig genug, um ein Modell zu disqualifizieren, und
keiner tritt bei einem der beiden Modelle systematisch auf.

**Laufzeit.** Ein Grok-Lauf über `agent-herdr.sh` brauchte 209 bis 696 Sekunden,
Median 412. Darin steckt der Tab-Start (~4 s), das Lesen der Prompt-Datei und
die OHS-Lookups. Ein mitgelesener Lauf zeigte mehr als ein Dutzend
OHS-Aufrufe hintereinander; wie viele Opus in Produktion absetzt, ist **nicht**
gemessen — die doppelte Link-Ausbeute legt einen Zusammenhang nahe, belegt ihn
aber nicht. Für die nächtliche Pipeline über Dutzende Videos ist die Laufzeit
die relevante Größe, nicht der Preis.

## Ergebnis je Video-Art

Urteile des Opus-Richters, je Art über 4 Videos:

| Art | Treue (g/o/=) | Vollständigkeit | Präzision | Regeltreue |
| --- | --- | --- | --- | --- |
| Konferenz-Talk | 1/3/0 | 2/0/2 | 1/2/1 | 0/2/2 |
| langes Workflow-Tutorial | 2/0/2 | **4/0/0** | **4/0/0** | 1/1/2 |
| kurzes News-Video | 3/0/1 | 3/0/1 | 2/0/2 | 1/1/2 |
| kurzes Tool-Demo | 0/1/3 | **4/0/0** | 3/0/1 | 1/1/2 |

**Der Konferenz-Talk ist die einzige Art, in der Opus vorn liegt** — bei Treue
(1:3) und Präzision (1:2). Das sind lange Vorträge mit dichter Argumentation und
ohne Bildschirm-Demo; dort zahlt sich Opus' Zurückhaltung aus, während Grok mehr
zusammenzieht und dabei häufiger etwas verschiebt. Bei den anderen drei Arten —
Tutorial, News, Tool-Demo — gewinnt Grok Vollständigkeit und Präzision klar, in
zwei Arten sogar mit 4:0.

Die Stichprobe je Art ist 4 Videos. Für eine Grundsatzentscheidung reicht das
Gesamtbild; die Art-Zeilen sind Hinweise, keine Belege.

## Empfehlung

**Pass 5 auf Grok 4.6 xhigh umstellen.** Die beiden Kriterien, die für eine
Zusammenfassung zählen — was steht drin, und steht es genau da —, gehen klar an
Grok, einstimmig über zwei Richter. Die Wikilink-Mechanik, der eigentliche
Risikoteil des Passes, hält Grok in 16 von 16 Läufen fehlerfrei ein und liefert
dabei doppelt so viele Verbindungen in den Vault. Der Preisunterschied kommt
obendrauf, ist aber nicht das Argument.

Drei Dinge gehören zur Umstellung:

1. **Der Aufrufweg ist offen.** `runPass5` ruft heute `callClaudeCli`. Ein
   Cursor-Modell erreicht die Pipeline nicht über `claude -p`; für einen
   produktiven Wechsel braucht `llm-caller.ts` einen zweiten Kanal, oder Grok
   wird über die xAI-API statt über Cursor angebunden. **Diese Messung sagt
   nichts darüber, ob Grok über einen anderen Kanal dieselbe Qualität liefert** —
   sie ist an Cursors Grok-4.6-xhigh gemessen, samt dessen Werkzeug-Schicht für
   den OHS-Aufruf.
2. **Der Konferenz-Talk bleibt der wunde Punkt.** Wenn die Art vor dem Lauf
   bekannt ist, ist ein Opus-Pass-5 für lange Vorträge die vorsichtige Variante.
   Ob sich das lohnt, entscheidet eine Messung mit mehr als 4 Videos dieser Art.
3. **Die Retry-Schleife bleibt sinnvoll**, auch wenn sie in dieser Messung nie
   ansprang — sie kostet nichts, solange nichts kaputt ist.

## Was diese Messung nicht zeigt

- **Keine Streuung.** Je Video liegt genau ein Grok-Lauf vor. Zwei Läufe
  desselben Modells auf demselben Video unterscheiden sich; wie stark, ist hier
  nicht gemessen.
- **Die Opus-Rohausgabe existiert nicht mehr.** Verglichen wurde Groks
  Rohausgabe gegen Opus' nachbearbeiteten Vault-Stand. Roh-Formfehler von Opus,
  die die Nachbearbeitung geheilt hat, sind unsichtbar — die Formfehler-Bilanz
  ist deshalb zu Groks Ungunsten verzerrt, nicht umgekehrt.
- **Beide Richter sind LLMs.** Kein Mensch hat die 32 Fassungen gelesen. Die
  Fundlisten in `judge/*.md` nennen je Fund die Stelle im Transkript und sind
  stichprobenweise nachprüfbar.
- **Grok 4.6 high** (die vom Auftrag genannte Alternative zu xhigh) ist **nicht**
  gemessen. Alle Zahlen hier stammen von `cursor-grok-4.6-xhigh`.
