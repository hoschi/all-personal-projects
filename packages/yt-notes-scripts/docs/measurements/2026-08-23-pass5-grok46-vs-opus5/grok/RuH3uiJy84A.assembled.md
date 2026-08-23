# This Claude Skill Cuts Your Token Costs In HALF

## Worum es geht

Der Sprecher stellt die trendende Skill Caveman vor: sie soll Output-Tokens um bis zu 75 % senken und trotzdem technisch vollständig bleiben. Er zeigt das in Claude Code an einer Auth-Erklärung und rechnet die Output-Ersparnis gegen den Input-Preis der Skill-Datei.

---

## Notizen

[URL](https://www.youtube.com/watch?v=RuH3uiJy84A)
Das ist auf jeden Fall für normalen Text ausgelegt und somit für das Schreiben bzw. Interagieren mit Claude Code besser geeignet. Da lohnt es sich auf jeden Fall, mal das auszuprobieren. Weiter als den Full-Mode würde ich nicht gehen, da der schon stellenweise etwas knapp war. Gegebenenfalls muss man hier Light verwenden. Wie bei Ponytail denke ich, dass es ziemlich smart ist, sich nur das repo zu holen und auch mal in den Prompt zu schauen und das Wichtigste rauszuziehen.

---

---

## Besprochene Konzepte

- [caveman-skill](obsidian://open?vault=knowledge-base&file=caveman-skill) — Skill, die Antworten in extrem knappen Stil zwingt und Füllwörter streicht
- [llm-kosten-effizienz](obsidian://open?vault=knowledge-base&file=llm-kosten-effizienz) — Output-Ersparnis gegen den Input-Preis der geladenen Skill-Markdown-Datei
- [claude-code-prompt-caching](obsidian://open?vault=knowledge-base&file=claude-code-prompt-caching) — Nachfragen treffen Prompt-Cache-Preise und können die Rechnung zugunsten von Caveman drehen
- Intensitätsstufen — light bis ultra, Default ist full
- Wenyan-Modus — klassische chinesische Schriftzeichen, laut Sprecher die token-effizienteste Schrift
- Kürze und Genauigkeit — eine Studie zeige 26 % mehr Genauigkeit bei knappen Antworten auf bestimmten Benchmarks
- Antwort-Muster — Ding, Aktion, Grund, nächster Schritt
- Weglass-Regeln — Artikel (a/an/the), Füllwörter, Höflichkeiten und hedging streichen; technische Begriffe, Code-Blöcke und Fehler behalten
- Drei-Wege-Vergleich — Baseline gegen den Satz „Be concise“ gegen die Caveman-Skill, gemessen an 10 Prompts

## Behauptungen

- Caveman verspricht bis zu 75 % weniger Output-Tokens bei voller technischer Genauigkeit. ([0:00](https://www.youtube.com/watch?v=RuH3uiJy84A&t=0s))
- Die Skill läuft auf Claude, Codex und anderswo. ([0:00](https://www.youtube.com/watch?v=RuH3uiJy84A&t=0s))
- Zusätzlich gibt es Wenyan-Modus, knappe Commits, Ein-Zeilen-Code-Reviews und ein Input-Kompressions-Werkzeug. ([0:00](https://www.youtube.com/watch?v=RuH3uiJy84A&t=0s))
- Ohne Skill erklärt Claude Code die Fake-Auth mit Füllwörtern, em dashes und ausformuliertem Englisch. ([0:40](https://www.youtube.com/watch?v=RuH3uiJy84A&t=40s))
- Mit Caveman kommt zuerst: Demo only, client-side Auth, keine echte Sicherheit, gebaut für Better-Stack-RUM-Demos. ([0:40](https://www.youtube.com/watch?v=RuH3uiJy84A&t=40s))
- Der Ablauf steht als Stichworte mit Pfeil, etwa App-Load → local storage auf gespeicherten User prüfen, statt als Fließtext. ([0:40](https://www.youtube.com/watch?v=RuH3uiJy84A&t=40s))
- Dem Sprecher geht es vor allem um Knappheit und technische Information, nicht um ausformuliertes Englisch. ([0:40](https://www.youtube.com/watch?v=RuH3uiJy84A&t=40s))
- Laut Sprecher sollte weniger Output theoretisch mehr aus dem Claude-Code-Abo holen oder API-Tokens sparen. ([0:40](https://www.youtube.com/watch?v=RuH3uiJy84A&t=40s))
- Auf 10 Prompts senkt Caveman die Output-Tokens um 45 % gegenüber Baseline und um 39 % gegenüber „Be concise“. ([1:44](https://www.youtube.com/watch?v=RuH3uiJy84A&t=104s))
- Die Output-Kosten lagen bei rund 8 Cent (Baseline) bzw. rund 4 Cent (Caveman). ([1:44](https://www.youtube.com/watch?v=RuH3uiJy84A&t=104s))
- Die Skill-Markdown-Datei treibt die Input-Kosten von Bruchteilen eines Cents auf rund 4 Cent. ([1:44](https://www.youtube.com/watch?v=RuH3uiJy84A&t=104s))
- Input plus Output macht Caveman bei einem einzelnen kleinen Prompt ohne Nachfrage im Schnitt 10 % teurer als Baseline. ([1:44](https://www.youtube.com/watch?v=RuH3uiJy84A&t=104s))
- Das gelte nur für genau diesen Fall: ein kleiner Prompt, keine Follow-ups. ([1:44](https://www.youtube.com/watch?v=RuH3uiJy84A&t=104s))
- Mit Follow-ups und Prompt-Cache-Preisen misst der Sprecher 39 % Kostenersparnis. ([1:44](https://www.youtube.com/watch?v=RuH3uiJy84A&t=104s))
- Eine Studie in diesem Jahr habe gezeigt, dass knappe Antworten die Genauigkeit großer Modelle auf bestimmten Benchmarks um 26 % verbessern. ([3:19](https://www.youtube.com/watch?v=RuH3uiJy84A&t=199s))
- Installation läuft über das Vercel-Skill-Paket und einen dort gezeigten Befehl. ([3:38](https://www.youtube.com/watch?v=RuH3uiJy84A&t=218s))
- Regeln: Artikel weglassen; Füllwörter, Höflichkeiten und hedging streichen; kurze Synonyme („big“ statt „extensive“, „fix“ statt „implement a solution for“). ([3:38](https://www.youtube.com/watch?v=RuH3uiJy84A&t=218s))
- Behalten: technische Begriffe, Code-Blöcke, Fehlermeldungen. ([3:38](https://www.youtube.com/watch?v=RuH3uiJy84A&t=218s))
- Struktur: Ding, Aktion, Grund, nächster Schritt. ([3:38](https://www.youtube.com/watch?v=RuH3uiJy84A&t=218s))
- Intensität reicht von light bis ultra; Default und genutzte Stufe ist full. ([3:38](https://www.youtube.com/watch?v=RuH3uiJy84A&t=218s))
- Ultra kürzt alles, streicht Konjunktionen, setzt Pfeile für Kausalität und ein Wort, wenn ein Wort reicht. ([3:38](https://www.youtube.com/watch?v=RuH3uiJy84A&t=218s))
- Wenyan nutzt klassische chinesische Schriftzeichen, weil sie am token-effizientesten seien; der Sprecher kann sie nicht lesen und hat nichts davon. ([3:38](https://www.youtube.com/watch?v=RuH3uiJy84A&t=218s))
- Caveman Commit schreibt knappe, genaue Messages im Conventional-Commits-Format. ([4:30](https://www.youtube.com/watch?v=RuH3uiJy84A&t=270s))
- Caveman Review schreibt eine knappe Zeile pro Finding. ([4:30](https://www.youtube.com/watch?v=RuH3uiJy84A&t=270s))
- Die Compress-Skill schreibt natürliche Sprache in Caveman-Stil um, damit Wiederverwendung etwas weniger Input-Tokens kostet. ([4:30](https://www.youtube.com/watch?v=RuH3uiJy84A&t=270s))

## Demos / Schritte

1. Dieselbe Frage an Claude Code ohne Skill: wie Auth in einer Demo-Next.js-App mit Fake-Auth umgesetzt ist.
2. Dieselbe Frage mit installierter Caveman-Skill: knappe Stichpunkte statt Fließtext.
3. 10 Prompts im Dreiervergleich Baseline / „Be concise“ / Caveman; Output-Kosten, Input-Kosten, Summe, dann Follow-ups mit Prompt-Cache.
4. Skill-Markdown: Weglass-Regeln, Synonyme, Behalten-Liste, Antwort-Muster.
5. Intensitätsstufen light–ultra und Wenyan-Modus.
6. Bonus-Skills: Caveman Commit, Caveman Review, Compress.

## Genannte Tools

- [caveman-skill](obsidian://open?vault=knowledge-base&file=caveman-skill) — die vorgestellte Kompressions-Skill samt Commit-, Review- und Compress-Varianten
- [claude-code-overview](obsidian://open?vault=knowledge-base&file=claude-code-overview) — Demo-Umgebung und Abo-/API-Kostenrechnung
- Codex — laut Sprecher ebenfalls unterstützt
- [[Agent Skills]] — Vercel-Skill-Paket zur Installation
- Next.js — Demo-App mit gefälschter Auth
- Better Stack RUM — Zweck der Fake-Auth in der Demo
- Caveman Commit — knappe Conventional-Commits-Messages
- Caveman Review — eine knappe Zeile pro Finding
- Compress — natürliche Sprache in Caveman-Stil umschreiben

## Verwandt

- [textverdichtung-overview](obsidian://open?vault=knowledge-base&file=textverdichtung-overview) — trennt Lese-Aufwand von Token-Kompression; das Video verkauft beides in einem
- [antwort-stil-regelwerk](obsidian://open?vault=knowledge-base&file=antwort-stil-regelwerk) — bei KIMS eingebautes Antwort-Stil-Regelwerk, historisch caveman-lite
- [caveman-lite-inject-prompt](obsidian://open?vault=knowledge-base&file=caveman-lite-inject-prompt) — der injizierte Caveman-lite-Prompt zum Nachbauen ohne Plugin
- [claude-code-skills](obsidian://open?vault=knowledge-base&file=claude-code-skills) — das Skills-System, über das eine solche Skill geladen wird
- [claude-code-token-cost-tools](obsidian://open?vault=knowledge-base&file=claude-code-token-cost-tools) — Input- vs. Output-Tokens bei Claude-Code-Werkzeugen
- [llm-benchmark-register](obsidian://open?vault=knowledge-base&file=llm-benchmark-register) — Raster, um die zitierte 26-Prozent-Genauigkeitsstudie einzuordnen
