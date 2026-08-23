---
tags:
  - youtube
aliases:
  - "Ponytail: Claude-Code-Plugin für YAGNI-Prinzip und weniger generierten Code"
channelName: Better Stack
publish_date: 2026-06-20
display_title: "Ponytail: Claude-Code-Plugin für YAGNI-Prinzip und weniger generierten Code"
description: Ponytail ist ein Claude-Code-Plugin, das KI-Coding-Agenten per
  YAGNI-Prinzip dazu zwingt, vor eigenem Code zunächst native
  Plattform-Features, Standardbibliotheken und vorhandene Dependencies zu
  prüfen. Gezeigt werden Installation des Plugins, die Entscheidungsleiter
  (Decision Ladder), das Modal-Dialog-Beispiel (HTML-`dialog`-Element statt
  Radix-UI-Library), Benchmark-Vergleiche gegen "Caveman" und
  Standard-Claude-Code sowie ein Live-Demo-Vergleich (Wetter-Dashboard-App)
  inklusive Token- und Kostenmessung. Relevant für Entwickler, die mit Claude
  Code oder ähnlichen KI-Coding-Agenten arbeiten und Code-Bloat sowie API-Kosten
  reduzieren wollen.
youtube_id: 2xuFcmUAQUc
---

# This Claude Code Plugin Writes 94% Less Code (ponytail)

## Worum es geht

Vorstellung und Praxistest von **Ponytail**, einem Plugin/Skill für Claude Code, das den KI-Coding-Agenten dazu bringt, wie ein „fauler Senior-Entwickler" die schlankstmögliche Lösung zu bauen und den typischen Code-Bloat von AI-Agenten zu vermeiden.

---

## Notizen

[URL](https://www.youtube.com/watch?v=2xuFcmUAQUc)
Das können wir auf jeden Fall mal ausprobieren. Was aber wichtig ist, ist der Disclaimer mitten im Video, dass ein einfacheres Setup auch funktioniert. Ich glaube, das macht am meisten Sinn, sich nur das Repo zu ziehen und dann den Skill, der für das Coding wichtig ist, erstmal raus zu kopieren und nicht die ganze Suite, um das gezielt einzusetzen. Interessant fände ich auf jeden Fall auch noch, aber da bin ich mir nicht sicher, ob Caveman eine bessere Lösung ist, wie sich das Ganze verhält beim Schreiben von Texten, da die aktuell sehr langatmig sind stellenweise. Außerdem muss man darauf achten, ob noch alles gut aussieht, da tatsächlich die Beispiele wesentlich flacher wirken. Gerade aber im Community-Projekt, wo das Ziel-Design durch Figma-Screens vorgegeben ist, erwarte ich mir hier tatsächlich wesentlich bessere Ergebnisse im Code bei gleichbleibender Funktionalität für den visuellen Part im UI.

---

## Besprochene Konzepte

- Ponytail — Tool/Skill, das den Agenten zur knappsten, schlanksten Lösung eines Problems zwingt und Bloat eliminiert
- YAGNI-Prinzip — „you ain't gonna need it", Software-Engineering-Idee aus den 90ern: nichts bauen, bevor man es tatsächlich braucht (keine Abstraktionsschicht, keine Library, keine Klasse ohne echten Bedarf)
- Decision Ladder — Entscheidungsleiter, die der Agent vor jedem Schreiben durchläuft (existiert es überhaupt nötig? Standard-Library? natives Plattform-Feature? schon installierte Dependency? Einzeiler möglich?); nur bei durchgängigem „Nein" schreibt er neuen Code
- Ponytail-Kommentare / Debt Ledger — Kommentar im Code hält fest, was weggelassen wurde und warum, damit ein späteres Upgrade nachvollziehbar bleibt
- Prompt Caching — Skill-Instruktionen werden real nur einmal pro Session bezahlt und danach gecacht, wodurch sich die Injection-Kosten über die Konversation amortisieren
- Audit- und Review-Features — Ponytail bietet zusätzlich Audit-Tools und ein Review-Feature über die reine Regel-Injektion hinaus

## Behauptungen

- Ponytails Mission ist, alles knapp zu halten und die schlankste mögliche Lösung zu finden ([0:48](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=48s))
- Ponytail ähnelt Caveman, das Agenten weniger reden und dadurch weniger Tokens verbrauchen ließ ([1:08](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=68s))
- YAGNI stammt als Software-Engineering-Idee aus den 90ern ([1:15](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=75s))
- Nur wenn jede Stufe der Decision Ladder mit „Nein" beantwortet wird, schreibt der Agent neuen Code — und dann nur das Minimum ([1:42](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=102s))
- Ein normaler Agent greift für einen Modal-Dialog sofort zu Radix UI mit Portal, Overlay, Root, Trigger und Content-Wrapper, nur um eine Box mit zwei Buttons zu zeigen ([2:05](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=125s))
- Das native `dialog`-Element fängt Fokus automatisch, schließt bei Escape, rendert einen Backdrop per CSS-Selektor und wird seit 2022 in jedem großen Browser unterstützt ([2:05](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=125s))
- Statt 30 Zeilen im NPM-Paket bekommt man acht Zeilen und null Dependencies ([2:05](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=125s))
- Ponytail behauptet, die Kosten um 47 bis 77 % zu senken ([2:05](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=125s))
- Der Benchmark nutzt drei Methoden (kein Skill, Caveman, Ponytail), drei Modelle, fünf Alltags-Tasks, zehn Runs pro Zelle, Median-Ergebnis, und prüft zusätzlich auf Korrektheit ([3:19](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=199s))
- Die Kostenzahl spiegelt Single-Shot-Calls, die den Skill jedes Mal mitsenden; Ponytail wird im Benchmark also für seine eigenen Instruktionen bestraft ([3:55](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=235s))
- Laut Sprecher untertreibt die 47-77-%-Angabe die reale Ersparnis, weil in einer echten Session die Skill-Injektionskosten amortisiert werden ([3:55](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=235s))
- Ein Blogpost von Colin Eberhardt zeigt: „Follow YAGNI principles" (drei Wörter) matcht Ponytails Benchmark fast perfekt, „Follow YAGNI principles and one-liner solutions" (sieben Wörter) schlägt ihn sogar ([4:40](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=280s))
- Der Sprecher argumentiert: das Packaging ist das Produkt — „Follow YAGNI" im System-Prompt liefert nicht die Audit- und Review-Features ([4:40](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=280s))
- In der Demo war die Ponytail-Version in unter 1 Minute fertig, die Default-Version brauchte 2:30 und war deutlich bloatiger ([5:37](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=337s))
- Ponytail packte alles in eine einzige HTML-Datei, die Default-Version nutzte drei Dateien und einen Python-Server ([5:37](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=337s))
- Die Default-Version ignorierte die Standort-Anforderung und zeigte London als Default, während Ponytail den echten Standort abfragte und ausgab ([6:20](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=380s))
- Die Ponytail-Version war 50 % billiger, produzierte weit weniger Codezeilen und war funktional sogar besser als die Default-Version ([7:39](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=459s))
- Die Kombination Caveman + Ponytail brachte kaum Verbesserung und war sogar leicht teurer als Ponytail allein ([8:04](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=484s))
- Laut Sprecher kann man bei Caveman bleiben oder besser Ponytail nutzen, sofern man den Benchmarks glaubt, dass es besser als Caveman ist ([8:04](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=484s))
- Der Sprecher will Ponytail als Plugin in seinem Claude-Code-Setup behalten und für künftige Projekte nutzen ([8:58](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=538s))

## Demos / Schritte

1. Zwei Claude-Code-Instanzen öffnen: in einer das Ponytail-Plugin nur für den lokalen Scope installieren, die andere als Default ohne Plugins.
2. Beiden denselben Prompt geben — eine Wetter-Dashboard-App bauen, die den Nutzerstandort erkennt und aktuelle Wetterdaten anzeigt; bei der Ponytail-Instanz zusätzlich explizit den Ponytail-Skill anfordern.
3. Ergebnis abwarten: Ponytail-Version in unter 1 Minute fertig (eine HTML-Datei), Default-Version nach 2:30 (drei Dateien, Python-Server).
4. Beide Apps öffnen und vergleichen: Default zeigt London als Default-Standort, Ponytail fragt den echten Standort ab und zeigt passendes Wetter.
5. Usage/Kosten vergleichen: Ponytail-Version 50 % günstiger und weniger Codezeilen.
6. Zweiter Durchlauf: Caveman und Ponytail zusammen in einem neuen Verzeichnis aktivieren, gleichen Prompt laufen lassen — Output kaum anders, Kombo leicht teurer als Ponytail allein.

## Genannte Tools

- Ponytail — Claude-Code-Plugin/Skill, das den Agenten YAGNI-konform zur schlanksten Lösung zwingt
- Caveman — ältere Library, die Coding-Agenten weniger reden und damit weniger Tokens verbrauchen lässt
- Claude Code — der Coding-Agent, in dem Ponytail als Plugin/Skill läuft und getestet wird
- Radix UI (React Dialog) — UI-Library, zu der ein Default-Agent für einen Modal-Dialog greift (Portal, Overlay, Trigger, Content-Wrapper)

## Verwandt

- [ai-code-quality-research](obsidian://open?vault=knowledge-base&file=ai-code-quality-research) — Forschung dazu, warum AI-Coding-Assistenten systematisch überdimensionierten, monolithischen Code erzeugen — genau der Bloat, den Ponytail bekämpft
- [llm-coding-prompting-patterns](obsidian://open?vault=knowledge-base&file=llm-coding-prompting-patterns) — wiederverwendbare Prompt-Patterns, die Output-Länge und Code-Volumen messbar reduzieren, verwandt zu Ponytails Regel-Injektion
- [claude-code-updates-2026](obsidian://open?vault=knowledge-base&file=claude-code-updates-2026) — Überblick zu Claude-Code-Skills und deren Steuerung, dem Mechanismus, über den Ponytail als Plugin/Skill eingebunden wird
- [[Anthropic Just Revealed The Best Claude Code Setup]] — Video zu empfohlenen Claude-Code-Setups und Skill-/Plugin-Nutzung, thematisch nah am Ponytail-Setup
