## Nicht gedeckte Aussagen

### Fassung A

- Keine. Ich habe jede Aussage in "Worum es geht", "Besprochene Konzepte", "Behauptungen", "Demos / Schritte" und "Genannte Tools" gegen das Transkript geprüft; alle Zahlen (75 %, 45 %, 39 %, 8 Cent, 4 Cent, 10 %, 26 %), Namen (Kevin nicht genannt, aber Claude Code, Codex, Next.js, Better Stack RUM, Vercel-Skill-Paket, Wenyan, Caveman Commit/Review/Compress) und Zusammenhänge sind wörtlich rückführbar.

### Fassung B

- "Worum es geht": „die LLM-Ausgaben in extrem knappen ‚Steinzeit'-Stil zwingt". Das Transkript nennt den Stil nie „Steinzeit" oder „caveman-artig"; „Caveman" ist dort ausschließlich der Produktname der Skill. Geringes Gewicht — es ist eine Eindeutschung des Namens, keine erfundene Tatsache.

Zaehlung: A=0 B=1

## Eigene Spekulation

### Fassung A

- "Verwandt": „textverdichtung-overview — trennt Lese-Aufwand von Token-Kompression; das Video verkauft beides in einem". Der zweite Halbsatz ist ein eigenes Urteil des Modells über das Video. Der Sprecher stellt Lese-Knappheit (0:40: „that conciseness is actually the main reason that I like this skill") und Token-Ersparnis nebeneinander, zieht aber nirgends den Schluss, beides werde in einem verkauft.

### Fassung B

- "Besprochene Konzepte": „[[Agent Skills]] — installierbare Skills, die das Agenten-Verhalten (hier: Ausgabestil) per Markdown-Regeldatei steuern". Die allgemeine Definition dessen, was Skills sind, sagt der Sprecher nicht. Belegt sind nur zwei Einzelheiten: „we're loading in a markdown file" (1:44) und „in here we can also see what it's asking the agent to do" (3:38). Geringes Gewicht — die Verallgemeinerung liegt nah an den Belegstellen.

Zaehlung: A=1 B=1

## Fehlende wichtige Inhalte

### Fassung A

- Herkunft des Namens und das Leitzitat. Transkript 0:00: „all thanks to the wise words of Kevin" und „Why waste time say lot word when few word do trick?". Beides fehlt; damit fehlt dem Leser, worauf sich „Caveman" bezieht.
- Der Beispiel-Prompt des Vergleichstests. Transkript 1:44: „things as simple as, ‚How does Git rebase differ from a Git merge?'". Ohne ihn bleibt offen, welche Art Prompts die 45 % erzeugt hat.

### Fassung B

- Herkunft des Namens und das Leitzitat (0:00, siehe oben). Fehlt ebenfalls.
- Der Beispiel-Prompt „How does Git rebase differ from a Git merge?" (1:44). Fehlt ebenfalls.
- Die eigene Begründung des Sprechers. Transkript 0:40: „I don't really care about it being in plain English. I just wanted the technical information from it. That conciseness is actually the main reason that I like this skill." B nennt Knappheit nur als Eigenschaft der Skill, nicht als den Grund, aus dem der Sprecher sie mag.
- Der Nutzen-Anspruch hinter der Token-Ersparnis. Transkript 0:40: „theoretically you can get more out of your Claude Code subscription or even save money on your API tokens." Fehlt in B; A hat ihn mit „theoretisch" und „laut Sprecher".
- Welche Intensitätsstufe gemessen wurde. Transkript 3:38: „I was using full, since that is the default." B nennt nur „(Default: ‚full')", nicht dass der gezeigte Test mit full lief.
- Ultra-Modus, vierte Regel. Transkript 3:38: „it uses one word when one word's enough." B listet Abkürzen, Konjunktionen streichen und Pfeile, lässt diese Regel weg.
- Wenyan ist für den Sprecher nutzlos. Transkript 3:38: „Unfortunately, I can't read them, so it's not much use to me." Fehlt in B; damit fehlt die Einschränkung zum einzigen Modus, den er nicht einsetzen kann.
- Zweck der Compress-Skill. Transkript 4:30: „so you can reuse them with slightly less input tokens." B nennt nur das „Cavemanifizieren", nicht wofür.

Zaehlung: A=2 B=8

## Praezision

- Input-Kosten der Baseline (1:44: „for the baseline … it's fractions of a cent"). A: „Die Skill-Markdown-Datei treibt die Input-Kosten von Bruchteilen eines Cents auf rund 4 Cent." B: „Die Caveman-Markdown-Datei erzeugt deutlich mehr Input-Tokens (rund 4 Cent) als der Ein-Satz-Prompt der Baseline." A nennt den Ausgangswert, B nur „deutlich mehr" — A präziser.
- Intensitätsstufe (3:38: „I was using full, since that is the default"). A: „Intensität reicht von light bis ultra; Default und genutzte Stufe ist full." B: „Stufen von ‚light' bis ‚ultra' … (Default: ‚full')". A korrekter, weil sie Default und Messbedingung trennt und beides nennt.
- Wenyan-Begründung (3:38: „because they're actually the most token efficient"). A: „laut Sprecher die token-effizienteste Schrift" — Superlativ plus Zuschreibung. B: „als besonders token-effiziente Ausgabe" — schwächt den Superlativ ab. A näher am Original.
- Ultra-Modus (3:38). A: „kürzt alles, streicht Konjunktionen, setzt Pfeile für Kausalität und ein Wort, wenn ein Wort reicht." B: „wird alles abgekürzt, Konjunktionen gestrichen und Pfeile für Kausalität genutzt." A vollständiger bei gleicher Aussage.
- Compress (4:30). A: „schreibt natürliche Sprache in Caveman-Stil um, damit Wiederverwendung etwas weniger Input-Tokens kostet." B: „Compress (natürliche Sprachdateien ‚cavemanifizieren')". A trägt den im Transkript genannten Zweck, B nicht.
- Zitat aus der Caveman-Antwort (0:40: „demo only, client-side auth, no real security, built for Better Stack RUM tracking demos"). B: „‚demo only, client-side auth, no real security'" — im Originalwortlaut. A: „Demo only, client-side Auth, keine echte Sicherheit, gebaut für Better-Stack-RUM-Demos" — teilübersetzt, dafür vollständig bis zum Demo-Zweck. B näher am Wortlaut, A vollständiger; einziger Punkt, an dem B präziser zitiert.

## Regelverstoesse

### Fassung A

- Keine. Alle sechs Sektionen stehen in der vorgegebenen Reihenfolge; "Demos / Schritte" und "Genannte Tools" sind durch Vorführung bzw. genannte Tools gedeckt; keine Vorrede, keine fremde Überschrift, Sprache deutsch mit erhaltenen Fachbegriffen; Timestamps sind optional und hier als reine Zeitangaben gesetzt.

### Fassung B

- Keine. Gleiche Prüfung, gleiches Ergebnis; Timestamps als Links sind zulässig, ihre technische Form ist nicht Gegenstand.

## Urteil

- Treue: gleichwertig — beide erfinden keine Zahl, keinen Namen und keinen Zusammenhang; A trägt eine eigene Wertung im Verwandt-Teil, B eine Namens-Eindeutschung und eine verallgemeinerte Skill-Definition, beides von geringem Gewicht.
- Vollstaendigkeit: A besser — B fehlen acht im Transkript benannte Punkte gegenüber zwei bei A, darunter die Begründung des Sprechers, die gemessene Intensitätsstufe und der Zweck der Compress-Skill.
- Praezision: A besser — in fünf von sechs Vergleichsstellen nennt A den Wert oder die Einschränkung, die B abschwächt oder weglässt; nur beim wörtlichen Zitat der Caveman-Antwort liegt B näher am Original.
- Regeltreue: gleichwertig — beide erfüllen Sektionsfolge, Anlassbindung, Sprache und Timestamp-Vorgabe ohne Verstoß.
