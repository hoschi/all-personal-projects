---
tags:
  - youtube
aliases:
  - "Coding-Modelle: Warum reines Prompting/Harness-Skalierung Codebase-Qualität
    nicht erhält"
channelName: AI Engineer
publish_date: 2026-07-23
display_title: "Coding-Modelle: Warum reines Prompting/Harness-Skalierung
  Codebase-Qualität nicht erhält"
description: "Software Factory war lights-off, ein Agent-Team baut Code ohne
  Review, gescheitert an einem im Juli 2025 aufgetretenen Bug. Konzepte:
  RL-Training gegen Test-Pass statt Codequalität, Claude Code als erstes gegen
  den eigenen Harness trainiertes Modell, Benchmarks wie SweetBench, Sweep
  Marathon, Frontier Code; Gegenmaßnahme: Produkt-Review, System-Architektur,
  Programm-Design mit Typen/Call-Graphen, vertikale Slices vor der
  Implementierung. Relevant für Engineering-Teams und Tech-Leads, die
  AI-Coding-Agenten produktiv einsetzen und Codebase-Wartbarkeit über die Zeit
  sichern wollen."
youtube_id: Ib5GBkD555M
---

# Harness Engineering is not Enough: Why Software Factories Fail — Dex Horthy, HumanLayer

## Worum es geht

Dex von Human Layer hält auf einer Konferenz den Vortrag „Harness Engineering is not enough and why software factories fail". Er argumentiert, dass keine noch so gute Harness-Technik das Grundproblem löst: Coding-Modelle werden nicht darauf trainiert, die Wartbarkeit einer Codebasis zu erhalten — deshalb muss der Mensch den Code weiterhin lesen.

---

## Notizen

[URL](https://www.youtube.com/watch?v=Ib5GBkD555M)

---

## Besprochene Konzepte

- Software Factory — Begriff aus einer NATO-Konferenz von 1968; die Schleife aus Tracker, Bauen, Pull Request, Review, Produktion, Nutzer-Rückmeldung und Monitoring ([3:36](https://www.youtube.com/watch?v=Ib5GBkD555M&t=216s))
- Agentic Software Factory — dieselbe Schleife, in der „jemand baut das Ding" durch „ein Agent baut das Ding" ersetzt wird, plus agentisches Review und agentische Regressionstests ([5:52](https://www.youtube.com/watch?v=Ib5GBkD555M&t=352s))
- Lights-off Software Factory — Ausbaustufe, in der niemand den Code mehr liest und stattdessen in Tests, Monitoring und Rollout investiert wird ([5:52](https://www.youtube.com/watch?v=Ib5GBkD555M&t=352s))
- [Harness](obsidian://open?vault=knowledge-base&file=ai-agent-harness-konzept) — Orchestrierung, Sandbox, Modell und Werkzeuge rund um den Coding-Agenten ([5:52](https://www.youtube.com/watch?v=Ib5GBkD555M&t=352s))
- Loop Maxing / Token Maxing — die Haltung, mehr Schleifen und mehr Token zu fahren, statt die Ursache zu beheben ([0:00](https://www.youtube.com/watch?v=Ib5GBkD555M&t=0s))
- [Wartbarkeit als Modell-Schwachstelle](obsidian://open?vault=knowledge-base&file=ai-code-quality-research) — Modelle können Code-Qualität über die Zeit nicht ohne menschliche Steuerung halten oder verbessern ([8:56](https://www.youtube.com/watch?v=Ib5GBkD555M&t=536s))
- Shotgun Surgery — Martin Fowlers Code Smell: eine Änderung an einer Stelle bricht andere Stellen ([8:56](https://www.youtube.com/watch?v=Ib5GBkD555M&t=536s))
- Coding-Agent-Reinforcement-Learning — Problem vorgeben, viele Traces erzeugen, auf Korrektheit bewerten, Gewichte in Richtung des guten Verhaltens verschieben ([10:12](https://www.youtube.com/watch?v=Ib5GBkD555M&t=612s))
- Binäres Reward-Signal — Base Commit, versteckter Test-Patch und Golden Patch; Belohnung nur, wenn alte und neue Tests bestehen ([10:12](https://www.youtube.com/watch?v=Ib5GBkD555M&t=612s))
- Brownfield — Arbeit an gewachsenen, komplexen Codebasen, abgegrenzt vom Wegwerf-Nebenprojekt ([7:30](https://www.youtube.com/watch?v=Ib5GBkD555M&t=450s))
- [Benchmarks für Wartbarkeit](obsidian://open?vault=knowledge-base&file=llm-benchmark-register) — Sweep Marathon, Deep Sweep und Frontier Code als Versuche, längere und mehrstufige Aufgaben zu bewerten ([13:18](https://www.youtube.com/watch?v=Ib5GBkD555M&t=798s))
- [Planung vor der Umsetzung](obsidian://open?vault=knowledge-base&file=planungs-skills-matt-pocock-vs-superpowers) — Product Review, Systemarchitektur, Program Design und Vertical Slices vor dem Bauen ([14:58](https://www.youtube.com/watch?v=Ib5GBkD555M&t=898s))
- Program Design — Typen, Methodensignaturen, Programm-Aufbau und Call Stacks als eigene Planungsebene zwischen Architektur und Code ([14:58](https://www.youtube.com/watch?v=Ib5GBkD555M&t=898s))
- Vertical Slices — Reihenfolge der Umsetzung, Repo-übergreifende Abstimmung und Prüfpunkte je Phase ([14:58](https://www.youtube.com/watch?v=Ib5GBkD555M&t=898s))

## Behauptungen

- Der vorherrschende Erzählstrang lautet: du bist der Engpass, die Modelle sind gut genug, Code ist umsonst, ship einfach mehr ([0:00](https://www.youtube.com/watch?v=Ib5GBkD555M&t=0s))
- StrongDM hat eine Lights-out-Software-Factory gebaut, in der niemand mehr den Code liest ([0:00](https://www.youtube.com/watch?v=Ib5GBkD555M&t=0s))
- Firmen, die keine Ausfälle haben sollten, haben Ausfälle durch Missgeschicke von Coding-Agenten ([1:28](https://www.youtube.com/watch?v=Ib5GBkD555M&t=88s))
- Codebasen zerfallen schneller als je zuvor ([1:28](https://www.youtube.com/watch?v=Ib5GBkD555M&t=88s))
- Ein Report von Faros AI zeigt: seit der breiten Einführung der KI-Coding-Werkzeuge im Januar/Februar ist die Pull-Request-Review-Qualität deutlich gefallen ([1:28](https://www.youtube.com/watch?v=Ib5GBkD555M&t=88s))
- Es gibt mehr und längere Review-Kommentare, und sehr viele PRs werden ganz ohne Review gemerged ([1:28](https://www.youtube.com/watch?v=Ib5GBkD555M&t=88s))
- Incidents und Bugs pro Entwickler sind deutlich gestiegen ([1:28](https://www.youtube.com/watch?v=Ib5GBkD555M&t=88s))
- Das ist kein Skill Issue: keine Menge an Harness Engineering oder Loop Maxing löst ein Problem, das im Modell-Training liegt ([2:20](https://www.youtube.com/watch?v=Ib5GBkD555M&t=140s))
- Vibe Coding an einem Nebenprojekt und die Pflege eines zehn Jahre alten Enterprise-Systems teilen fast keine nennenswerten Randbedingungen — Zitat von Addy ([7:30](https://www.youtube.com/watch?v=Ib5GBkD555M&t=450s))
- Agenten fangen laut Sprecher schon nach etwa drei bis sechs Monaten an zu straucheln, nicht erst bei zehn Jahre altem Java ([7:30](https://www.youtube.com/watch?v=Ib5GBkD555M&t=450s))
- Human Layer hat im Juli 2025 selbst voll auf Lights-off umgestellt und ist damit gescheitert ([7:30](https://www.youtube.com/watch?v=Ib5GBkD555M&t=450s))
- Wer es ernsthaft über Monate versucht, findet mindestens ein Problem, das der Agent nicht lösen kann — und muss dann in eine Codebasis einsteigen, die er drei Monate nicht gelesen hat ([7:30](https://www.youtube.com/watch?v=Ib5GBkD555M&t=450s))
- Modelle sind bei Einzelproblemen und neuen Marketing-Seiten seit 2024/2025 deutlich besser geworden, bei der Verbesserung der Codebasis-Qualität laut Sprecher nicht ([8:56](https://www.youtube.com/watch?v=Ib5GBkD555M&t=536s))
- Der Sprecher kann das nicht beweisen, weil es keine guten Benchmarks für die Fähigkeit zur Wartbarkeit gibt ([8:56](https://www.youtube.com/watch?v=Ib5GBkD555M&t=536s))
- Claude Code ging in unter einem Jahr von null auf 4 Milliarden und inzwischen 9 Milliarden Umsatz ([10:12](https://www.youtube.com/watch?v=Ib5GBkD555M&t=612s))
- Es gab vor Claude Code schon gute CLI-Agenten wie Aider und Codebuff mit denselben Werkzeugen — read, write, edit, grep, bash ([10:12](https://www.youtube.com/watch?v=Ib5GBkD555M&t=612s))
- Der Unterschied war, dass zum ersten Mal ein Modell-Labor ein Modell gegen genau die Harness trainiert hat, in der es ausgeliefert wird ([10:12](https://www.youtube.com/watch?v=Ib5GBkD555M&t=612s))
- Laut einem OpenAI-Vortrag im November ist ein Harness-Bauer ohne eigene Modellgewichte strukturell im Nachteil gegenüber jemandem, der Modell und Harness besitzt ([10:12](https://www.youtube.com/watch?v=Ib5GBkD555M&t=612s))
- SWE-bench Multilingual besteht aus etwa 15-Minuten-Aufgaben aus Open-Source-Repos wie Redis, JQ und Django mit binärem Reward ([10:12](https://www.youtube.com/watch?v=Ib5GBkD555M&t=612s))
- Modelle kommentieren Tests aus, nur damit etwas durchläuft — deshalb werden im Benchmark alle Änderungen an Testdateien zurückgenommen ([10:12](https://www.youtube.com/watch?v=Ib5GBkD555M&t=612s))
- Im binären Test-Reward gibt es keine Möglichkeit, schlechtes Programm-Design oder erodierende Wartbarkeit zu bestrafen ([10:12](https://www.youtube.com/watch?v=Ib5GBkD555M&t=612s))
- Daher entstehen unnötige try-catch-Blöcke und Casts, nur damit der Test besteht ([10:12](https://www.youtube.com/watch?v=Ib5GBkD555M&t=612s))
- Wartbarkeit zu verifizieren ist um Größenordnungen schwerer als „Code läuft und Tests bestehen" ([10:12](https://www.youtube.com/watch?v=Ib5GBkD555M&t=612s))
- Die Kostenfunktion schlechter Architektur wird in Monaten und Jahren gemessen — das Reward-Signal lässt sich über diese Lücke kaum zurückführen ([10:12](https://www.youtube.com/watch?v=Ib5GBkD555M&t=612s))
- Sweep Marathon von Abundant AI fährt etwa 400-Stunden-Aufgaben, etwa: klone alle Funktionen von Microsoft Excel ([13:18](https://www.youtube.com/watch?v=Ib5GBkD555M&t=798s))
- Deep Sweep von Data Curve nutzt große Aufgaben auf OSS-Repos, die nicht im Trainingsset stecken, weil sie nie real gebaut wurden ([13:18](https://www.youtube.com/watch?v=Ib5GBkD555M&t=798s))
- Frontier Code von Cognition arbeitet mit Multi-PR-Aufgaben, bestraft Tests, die auf dem Pre-Patch-Code nicht fehlschlagen, und lässt ein Judge-Modell die Code-Qualitätsregeln prüfen ([13:18](https://www.youtube.com/watch?v=Ib5GBkD555M&t=798s))
- Modelle, die Qualität beurteilen, kommen laut Sprecher nur begrenzt weit: wüsste das Modell, wie guter Code aussieht, hätte es ihn gleich geschrieben ([13:18](https://www.youtube.com/watch?v=Ib5GBkD555M&t=798s))
- Review-Agenten und mehr Token heben den Boden, bleiben aber durch das begrenzt, was im RL beigebracht werden kann ([13:18](https://www.youtube.com/watch?v=Ib5GBkD555M&t=798s))
- Vorerst bleibt uns nichts anderes übrig, als den Code zu lesen — schnell arbeiten geht trotzdem ([13:18](https://www.youtube.com/watch?v=Ib5GBkD555M&t=798s))
- Product Review und Architektur-Dokumente lohnen sich nicht für Kleinkram, dort geht es direkt an den Agenten ([14:58](https://www.youtube.com/watch?v=Ib5GBkD555M&t=898s))
- Program Design ist im agentischen Arbeiten stark unterbewertet; viele nehmen an, das Modell könne nach der Architektur einfach loslegen ([14:58](https://www.youtube.com/watch?v=Ib5GBkD555M&t=898s))
- Dylan Mulroy von Cloudflare nutzt Call Graphs als Teil seines Planungsprozesses — der Sprecher hält das für genau richtig ([14:58](https://www.youtube.com/watch?v=Ib5GBkD555M&t=898s))
- 30 Minuten Vorab-Planung und Abstimmung sparen Stunden im Review ([14:58](https://www.youtube.com/watch?v=Ib5GBkD555M&t=898s))
- Wer in PRs ertrinkt, hat nicht zu viele PRs, sondern zu viele schlechte PRs — ein guter PR ist eine Freude zu reviewen ([17:16](https://www.youtube.com/watch?v=Ib5GBkD555M&t=1036s))
- Schon 20 Prozent Nacharbeit an einem PR sind eine emotionale und intellektuelle Last für Reviewer und Einreicher ([17:16](https://www.youtube.com/watch?v=Ib5GBkD555M&t=1036s))
- Mit modellgestützter Planung wird die Abstimmung kürzer, das Review schneller und das Coding schneller — man liest trotzdem alles und behält die Verantwortung für den Code ([17:16](https://www.youtube.com/watch?v=Ib5GBkD555M&t=1036s))
- Human Layer ist eine KI-IDE und Kollaborationsplattform, eine Art Figma für Claude-Code- und Codex-Arbeitsweise, kostenlos für kleine Teams ([17:16](https://www.youtube.com/watch?v=Ib5GBkD555M&t=1036s))

## Demos / Schritte

1. Coding-Agent-RL in Kurzform: dem Modell ein Problem geben und viele Lösungsversuche (Traces) erzeugen
2. Alle Traces auf Korrektheit bewerten — sind die Tests durchgelaufen
3. Gewichte anpassen: schlechtes Verhalten unwahrscheinlicher, gutes wahrscheinlicher machen
4. Konkretes Beispiel Fastlane (Ruby): fehlende nil-Prüfung führt zu einem Stack Trace
5. Base Commit vor der historischen menschlichen Lösung auschecken; Test-Patch und Golden Patch bleiben vor dem Modell verborgen
6. Agent löst das Problem, sein Patch wird gespeichert
7. Alle Änderungen des Modells an Testdateien werden zurückgenommen
8. Golden Test Patch anwenden, alte und neue Tests laufen lassen — Reward nur, wenn beide bestehen

Planungsablauf „Licht wieder an":

1. Product Review: welches Problem wird gelöst, welches Verhalten ist gewünscht, ggf. Mock-ups ansehen
2. Systemarchitektur: Komponenten-Verträge, Datenmodelle, Randbedingungen als Dokument
3. Program Design: Typen, Methodensignaturen, Programm-Aufbau, Call Stacks
4. Vertical Slices: Reihenfolge der Umsetzung, Repo-übergreifende Abstimmung, Prüfpunkte je Phase
5. Erst dann bauen — und jede Zeile Code lesen

## Genannte Tools

- Claude Code — CLI-Coding-Agent, erstes Modell, das gegen die eigene Auslieferungs-Harness trainiert wurde
- Codex — OpenAIs Coding-Agent; ein früherer MTS des Launch-Teams wird zitiert
- Aider — CLI-Coding-Agent vor Claude Code mit denselben Werkzeugen
- Codebuff — weiterer CLI-Coding-Agent derselben Kategorie
- Human Layer — KI-IDE und Kollaborationsplattform, Bausteine für die eigene Software Factory
- Linear, Jira, Beads — Tracker als Zustandsmaschine für offene Arbeit
- Faros AI — Anbieter des Reports zur gefallenen PR-Review-Qualität
- SWE-bench Multilingual — Benchmark mit kurzen Aufgaben aus Open-Source-Repos und binärem Reward
- Sweep Marathon (Abundant AI) — Benchmark mit sehr langen Aufgaben und differenzierten Reward-Kanälen
- Deep Sweep (Data Curve) — Benchmark mit großen Aufgaben auf Repos außerhalb des Trainingssets
- Frontier Code (Cognition) — Multi-PR-Benchmark mit Judge-Modell für Code-Qualitätsregeln

## Verwandt

- [[How to Kill the Code Review — Ankit Jain, Aviator]] — Gegenposition aus derselben Konferenzreihe: Zeile-für-Zeile-Review ablösen statt wieder einführen
- [[How to build your own AI Code Review Agent from scratch!]] — praktischer Bau eines Review-Agenten, also genau die Schicht, die der Sprecher als „hebt den Boden, löst es nicht" einordnet
- [[OpenSpec NEW Toolkit Ends Vibe Coding! 100x Better Than Vibe Coding (Full Tutorial)]] — Werkzeug für die Spec-vor-Code-Reihenfolge, die der Vortrag als Planungsschritt fordert
- [LLM-Benchmark-Kontamination](obsidian://open?vault=knowledge-base&file=llm-benchmark-kontamination) — warum Repos aus dem Trainingsset die Benchmark-Aussage untergraben, das Argument hinter Deep Sweep
- [community-fr-autonomer-frontend-workflow](obsidian://open?vault=knowledge-base&file=community-fr-autonomer-frontend-workflow) — eigener Workflow mit Vorab-Planung, Etappen und Abnahme statt Lights-off
