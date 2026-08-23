---
tags:
  - youtube
aliases:
  - "Caveman Skill: Prompt-Technik reduziert Claude-Code-Output-Tokens um bis zu
    45%"
channelName: Better Stack
publish_date: 2026-04-12
display_title: "Caveman Skill: Prompt-Technik reduziert
  Claude-Code-Output-Tokens um bis zu 45%"
description: Das Caveman-Skill entfernt Füllwörter, Höflichkeitsfloskeln und
  Hedging aus Claude-Antworten, um die Ausgabe auf technische Kerninhalte zu
  reduzieren. Gezeigt werden ein Vorher-Nachher-Vergleich in Claude Code, ein
  Kosten-Test mit 10 Prompts (45% weniger Output-Tokens, aber höhere
  Input-Tokens durch das geladene Skill-Markdown, netto nur bei Folgefragen mit
  Prompt-Caching ein Vorteil) sowie Zusatz-Skills wie Caveman Commit, Caveman
  Review und ein Wenyan-Modus. Relevant für Claude-Code-Nutzer, die
  Output-Token-Kosten senken oder knappere, weniger geschwätzige Antworten
  wollen, sollten aber die Input-Token-Kosten und den Nutzen nur bei
  mehrstufigen Konversationen beachten.
youtube_id: RuH3uiJy84A
---

# This Claude Skill Cuts Your Token Costs In HALF

## Worum es geht

Vorstellung und Kosten-Analyse der trendenden „Caveman"-Skill für Claude Code (und Codex), die LLM-Ausgaben in extrem knappen „Steinzeit"-Stil zwingt, um Output-Tokens zu sparen und Antworten prägnanter zu machen.

---

## Notizen

[URL](https://www.youtube.com/watch?v=RuH3uiJy84A)
Das ist auf jeden Fall für normalen Text ausgelegt und somit für das Schreiben bzw. Interagieren mit Claude Code besser geeignet. Da lohnt es sich auf jeden Fall, mal das auszuprobieren. Weiter als den Full-Mode würde ich nicht gehen, da der schon stellenweise etwas knapp war. Gegebenenfalls muss man hier Light verwenden. Wie bei Ponytail denke ich, dass es ziemlich smart ist, sich nur das repo zu holen und auch mal in den Prompt zu schauen und das Wichtigste rauszuziehen.

---

## Besprochene Konzepte

- Caveman-Skill — Regelsatz, der Füllwörter, Artikel, Höflichkeiten und Hedging streicht und Ausgaben auf reine technische Information reduziert
- [[Agent Skills]] — installierbare Skills, die das Agenten-Verhalten (hier: Ausgabestil) per Markdown-Regeldatei steuern
- Prägnanz statt Klartext — Ausgabe als Stichworte/Pfeile (z. B. „app load → check local storage") statt vollständiger englischer Sätze
- Prompt-Caching-Preislogik — bei Folgefragen greift Cache-Pricing und verschiebt die Kostenrechnung zugunsten von Caveman
- Intensitäts-Modi — Stufen von „light" bis „ultra" regeln, wie stark der Stil komprimiert wird (Default: „full")
- Wenyan-Modus — Nutzung klassischer chinesischer Schriftzeichen als besonders token-effiziente Ausgabe
- Struktur-Pattern — Ausgabe folgt dem Schema thing → action → reason → next step

## Behauptungen

- Caveman verspricht, bis zu 75 % der Output-Tokens zu sparen bei voller technischer Genauigkeit ([0:00](https://www.youtube.com/watch?v=RuH3uiJy84A&t=0s))
- Die Skill funktioniert auf Claude, Codex und anderswo ([0:00](https://www.youtube.com/watch?v=RuH3uiJy84A&t=0s))
- Normales Claude Code nutzt Füllwörter, Em-Dashes und ganze Sätze; mit Caveman kommt die Antwort sofort zum technischen Punkt ([0:40](https://www.youtube.com/watch?v=RuH3uiJy84A&t=40s))
- Im Vergleichstest über 10 Prompts: 45 % weniger Output-Tokens gegenüber der Baseline, 39 % weniger gegenüber einem simplen „Be concise" ([1:44](https://www.youtube.com/watch?v=RuH3uiJy84A&t=104s))
- Baseline kostete rund 8 Cent, Caveman rund 4 Cent bei den Output-Tokens ([1:44](https://www.youtube.com/watch?v=RuH3uiJy84A&t=104s))
- Die Caveman-Markdown-Datei erzeugt deutlich mehr Input-Tokens (rund 4 Cent) als der Ein-Satz-Prompt der Baseline ([1:44](https://www.youtube.com/watch?v=RuH3uiJy84A&t=104s))
- Input + Output kombiniert ist Caveman im Schnitt 10 % teurer als die Baseline — aber nur bei einem einzelnen kleinen Prompt ohne Folgefragen ([1:44](https://www.youtube.com/watch?v=RuH3uiJy84A&t=104s))
- Mit Folgefragen greift Prompt-Cache-Pricing und Caveman erzielt dann 39 % Kostenersparnis ([1:44](https://www.youtube.com/watch?v=RuH3uiJy84A&t=104s))
- Eine Studie dieses Jahres zeigte, dass das Beschränken großer Modelle auf knappe Antworten die Genauigkeit auf bestimmten Benchmarks um 26 % verbessert ([3:19](https://www.youtube.com/watch?v=RuH3uiJy84A&t=199s))
- Die Skill ist über das Vercel-Skill-Package installierbar ([3:38](https://www.youtube.com/watch?v=RuH3uiJy84A&t=218s))
- Regeln der Skill: Artikel (a/an/the), Füllwörter, Höflichkeiten und Hedging streichen; kurze Synonyme nutzen („big" statt „extensive", „fix" statt „implement a solution for"); technische Begriffe, Codeblöcke und Fehler behalten ([3:38](https://www.youtube.com/watch?v=RuH3uiJy84A&t=218s))
- Im „ultra"-Modus wird alles abgekürzt, Konjunktionen gestrichen und Pfeile für Kausalität genutzt ([3:38](https://www.youtube.com/watch?v=RuH3uiJy84A&t=218s))
- Der Wenyan-Modus nutzt klassische chinesische Schriftzeichen, weil diese am token-effizientesten sind ([3:38](https://www.youtube.com/watch?v=RuH3uiJy84A&t=218s))
- Zusatz-Skills: Caveman Commit (knappe Messages im Conventional-Commits-Format), Caveman Review (eine prägnante Zeile pro Finding) und Compress (natürliche Sprachdateien „cavemanifizieren") ([4:30](https://www.youtube.com/watch?v=RuH3uiJy84A&t=270s))

## Demos / Schritte

1. In Claude Code (ohne Skill) fragen, wie die Auth im Next.js-Demo-App implementiert ist — Antwort enthält Füllwörter, Em-Dashes und ganze Sätze.
2. Dieselbe Frage mit installierter Caveman-Skill stellen — Antwort ist knapp, ohne Füllwörter, technische Info direkt (z. B. „demo only, client-side auth, no real security").
3. Vergleichstest über 10 Prompts durchführen: Baseline vs. „Be concise" vs. Caveman, Output-Token- und Kostenreduktion messen.
4. Kombinierte Input-+Output-Kosten berechnen und Effekt des Prompt-Caches bei Folgefragen einbeziehen.
5. Skill via Vercel-Skill-Package installieren und die Regeldatei (Regeln, Intensitäts-Modi, Struktur-Pattern) inspizieren.

## Genannte Tools

- Claude Code — Coding-Agent, in dem die Skill getestet wird
- Codex — weiterer Agent, auf dem die Skill laut Video funktioniert
- Vercel Skill Package — Bezugsquelle/Installer für die Caveman-Skill
- Next.js — Framework der Demo-App mit Fake-Auth-System
- Better Stack RUM — Real-User-Monitoring, das die Demo-Auth demonstrieren soll

## Verwandt

- [claude-code-prompt-caching](obsidian://open?vault=knowledge-base&file=claude-code-prompt-caching) — erklärt die Prompt-Cache-Preislogik, auf die der Kostenvorteil bei Folgefragen aufsetzt
- [claude-code-skills](obsidian://open?vault=knowledge-base&file=claude-code-skills) — Grundlagen zu Claude-Code-Skills, deren Mechanik Caveman nutzt
- [claude-code-token-tracking](obsidian://open?vault=knowledge-base&file=claude-code-token-tracking) — Token-Verbrauch messen, relevant für die im Video gezeigte Kostenrechnung
- [llm-coding-prompting-patterns](obsidian://open?vault=knowledge-base&file=llm-coding-prompting-patterns) — Prompting-Muster, verwandt zum Ansatz, Ausgaben über Regeln knapp und technisch zu halten
