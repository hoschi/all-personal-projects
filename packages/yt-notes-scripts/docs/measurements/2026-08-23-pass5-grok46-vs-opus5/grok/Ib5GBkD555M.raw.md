## Worum es geht
Dex (Human Layer) hält den Konferenzvortrag „Harness Engineering is not enough and why software factories fail“. These: Coding-Agenten in Produktion scheitern nicht an zu wenig Loops oder Tokens, sondern daran, dass Modelle auf Test-Bestehen trainiert werden und Codebase-Qualität nicht halten.
## Besprochene Konzepte
- [[Harness Engineering_ What Separates Top Agentic Engineers Right Now]] — Hülle aus Orchestrierung, Sandbox, Loops und Review-Bots um das Modell
- Lights-off Software Factory — Code wird nicht mehr gelesen; Testing, Monitoring und Rollout sollen die Qualität tragen
- Agentic Software Factory — der Schritt „jemand baut das Ding“ wird durch einen Agenten ersetzt
- Token-Maxing / Loop-Maxing — mehr Tokens und mehr Loops als Antwort auf Qualitätsprobleme
- [[Vibe Coding]] — der Sprecher grenzt Side-Project-Vibe-Coding gegen Brownfield-Enterprise ab
- Brownfield — historisch alte Java-Systeme; der Sprecher setzt die Schwelle schon bei 3–6 Monaten
- Shotgun surgery — Fowler-Code-Smell: eine Änderung zwingt zu vielen anderen Stellen
- [llm-benchmark-register](obsidian://open?vault=knowledge-base&file=llm-benchmark-register) — SWE-bench-artiges Training mit binärer Belohnung (Tests grün oder nicht), ohne Strafe für schlechtes Design
- RL auf Traces — viele Lösungsversuche bewerten, gutes Verhalten in den Weights verstärken
- Modell-plus-Harness-Eigentum — wer Weights und Auslieferungs-Harness besitzt, kann RL dort fahren
- Program Design — Typen, Methodensignaturen, Layout und Call Stacks, nicht nur Systemarchitektur
- Vertical Slices — Implementierungsreihenfolge, Multi-Repo-Koordination und Checks zwischen den Phasen
- Alignment vorab — Product Review, Architektur und Program Design, damit Review kürzer wird
## Behauptungen
- Die vorherrschende Erzählung lautet: du bist der Engpass, Modelle sind gut genug, Code ist gratis, einfach mehr shippen. (0:00)
- StrongDM hat eine Lights-out-Software-Factory gebaut, in der niemand den Code liest. (0:00)
- Firmen, die keine Ausfälle durch Coding-Agenten haben sollten, haben genau solche Ausfälle. (1:28)
- Codebases zerfallen schneller als zuvor. (1:28)
- Faros AI: seit der breiten Einführung von AI-Coding-Tools (Januar/Februar) sinkt die Pull-Request-Review-Qualität; mehr und längere Kommentare, viele PRs ohne Review, Incidents und Bugs pro Entwickler steigen. (1:28)
- Die Standardantwort „you're holding it wrong“ / Skill Issue trifft nicht den Kern. (1:28)
- Laut Sprecher reicht keine Menge Harness Engineering oder Loop-Maxing, weil das Grundproblem im Modell-Training liegt. (2:20)
- Der Begriff Software Factory stammt laut Sprecher von einer NATO-Konferenz 1968. (3:36)
- Im 2022-Ablauf dauern Bauen und Review oft Stunden bis Tage; Teams planen deshalb vorab, um Rework und Zeile-für-Zeile-Review zu senken. (3:36)
- Viele Firmen behaupten, eine Coding-Agent-Factory shippe 75 % ihres Codes. (5:52)
- Agentisches Bauen dauert Minuten bis Stunden, menschliches Review und Testen weiter Stunden bis Tage. (5:52)
- Lights-off (Begriff laut Sprecher von Dentsu Bureau): Code-Review entfällt, investiert wird in Tests, Monitoring und Rollout. (5:52)
- Der Sprecher setzt: Lights-off funktioniert nicht. (7:30)
- Zitat von Addy, wortgleich übernommen: ein Side-Project, das ein Dutzend Leute nutzen, und ein zehn Jahre altes Enterprise-System teilen fast keine nennenswerten Constraints. (7:30)
- Human Layer zielt auf harte Probleme in komplexen Codebases. (7:30)
- Der Sprecher vermutet: Agenten tun sich nach 3–6 Monaten schwer, besonders bei heutigem Ship-Tempo. (7:30)
- Im Juli 2025 ging Human Layer full lights-off; es blieb mindestens ein Issue, das der Agent nicht löste, die Site lag, User waren verärgert, der Code war Slop. (7:30)
- Modelle können Codebase-Qualität ohne erhebliches menschliches Steering nicht halten oder verbessern. (8:56)
- One-off-Probleme und Vibe-Coding-Marketing-Sites wurden seit 2024/2025 deutlich besser; Codebase-Qualität laut Sprecher kaum. (8:56)
- Der Sprecher sagt, er könne das nicht belegen, weil es keine guten Benchmarks für Maintainability gibt. (8:56)
- Claude Code ging laut Sprecher in unter einem Jahr von nichts auf 4 Milliarden und seiner Einschätzung nach auf 9 Milliarden Umsatz. (10:12)
- Aider und Codebuff hatten dieselben Tools (Read, Write, Edit, Grep, Bash); der Unterschied war Training gegen die ausgelieferte Harness. (10:12)
- OpenAI-Talk im November: ein Harness-Bauer ohne Weights und ohne RL in der eigenen Harness bleibt im Nachteil. (10:12)
- SWE-bench Multilingual: Aufgaben von etwa 15 Minuten aus OSS-Repos (Redis, JQ, Django), Reward 0/1 für Fix ohne Regression. (10:12)
- In diesem Setup gibt es keine Strafe für schlechtes Program Design oder erodierte Maintainability. (10:12)
- Modelle kommentieren Tests aus, setzen unnötige try/catch und Casts, nur damit Tests grün werden (Beispiel von Bybop). (10:12)
- Codequalität und Maintainability zu prüfen ist um Größenordnungen schwerer als „läuft und Tests sind grün“, weil schlechte Architektur erst in Monaten und Jahren kostet. (10:12)
- Sweep Marathon (Abundant AI): Aufgaben in der Größenordnung 400 Stunden, etwa Microsoft Excel Feature für Feature nachbauen. (13:18)
- Deep Sweep (Data Curve): große Aufgaben auf OSS-Repos, die so nie gebaut wurden und deshalb nicht im Trainingssatz liegen. (13:18)
- Frontier Code (Cognition): Multi-PR-Aufgaben; Strafe, wenn Tests auf dem Pre-Patch-Code nicht fehlschlagen; Judge-Modell für Qualitätsregeln. (13:18)
- Der Sprecher setzt: ein Modell, das gutes Code aussehen kennen würde, würde es vermutlich selbst schreiben; Review-Agenten und mehr Tokens heben den Boden, die Grenze bleibt, was RL lehren kann. (13:18)
- Der Sprecher setzt: vorerst muss man den Code weiter lesen. (13:18)
- 30 Minuten Vorplanung und Alignment können Stunden Review sparen; dann ist es machbar, jede Zeile zu lesen. (14:58)
- Kleinkram geht weiter direkt an den Agenten, ohne Product Review. (14:58)
- Wer in PRs ertrinkt, hat nicht zu viele PRs, sondern zu viele schlechte PRs. (17:16)
- Selbst 20 % Rework — laut Sprecher großzügig für viel AI-Slop — ist eine emotionale und intellektuelle Last für Reviewer und Submitter. (17:16)
- Mit modellgestütztem Alignment wird Alignment kürzer, Review schneller, Coding schneller, und man besitzt den Code weiter. (17:16)
- Human Layer ist eine AI-IDE und Kollaborationsplattform, Bausteine für die Software Factory, später bessere Verifier für Softwarequalität; frei für kleine Teams auf humanlayer.com. (17:16)
- Laut Sprecher ein „Figma for Claude Code“ und ein Codex-artiger gemeinsamer Workspace. (17:16)
- Human Layer spricht mit Design Partners und stellt Founding Engineers in San Francisco ein. (17:16)
## Demos / Schritte
SWE-bench-Ablauf (an Fastlane, Ruby, Null-Check / NPE):
1. Base-Commit auschecken, bevor ein Mensch das Issue gelöst hat.
2. Test-Patch und goldenen Patch bereithalten, beides vor dem Modell verborgen.
3. Agent erzeugt einen Patch.
4. Änderungen an Testdateien rückgängig machen.
5. Goldenen Test-Patch anwenden, alte und neue Tests laufen lassen.
6. Reward nur, wenn beides grün ist.
Lights-on-Ablauf mit Folien echter Docs:
1. Product Review: Problem, gewünschtes Verhalten, Mock-ups (nicht für Kleinkram).
2. Systemarchitektur: Komponentenverträge, Datenmodelle, Constraints.
3. Program Design: Typen, Methodensignaturen, Layout, Call Stacks (Dylan Mulroy / Cloudflare: Call Graphs).
4. Vertical Slices: Reihenfolge, Multi-Repo, Tests und Checks zwischen den Phasen.
5. Danach bauen und jede Zeile reviewen.
## Genannte Tools
- [claude-code-overview](obsidian://open?vault=knowledge-base&file=claude-code-overview) — CLI-Coding-Agent, erstes Modell laut Sprecher gegen die eigene Auslieferungs-Harness trainiert
- Codex — OpenAIs Coding-Agent; ein früherer MTS des Launch-Teams (Calvin French-Owen) wird zitiert
- Aider — CLI-Coding-Agent vor Claude Code mit denselben Basis-Tools
- Codebuff — weiterer CLI-Agent derselben Generation
- Human Layer — AI-IDE und Kollaborationsplattform des Sprechers
- StrongDM — genannt als Lights-out-Software-Factory
- Faros AI — Report zu sinkender PR-Review-Qualität
- Linear — Tracker / Zustandsautomat für Arbeit
- Jira — Tracker / Zustandsautomat für Arbeit
- Beads — Tracker / Zustandsautomat für Arbeit
- SWE-bench Multilingual — Trainings- und Eval-Set mit binärem Test-Reward
- Sweep Marathon — Langhorizont-Benchmark von Abundant AI
- Deep Sweep — Langhorizont-Benchmark von Data Curve
- Frontier Code — Multi-PR-Benchmark von Cognition
- Figma — Vergleichsbild für den Human-Layer-Workspace
- Fastlane — Ruby-Projekt als Beispielaufgabe im SWE-bench-Ablauf
## Verwandt
- [[12-Factor Agents Patterns of reliable LLM applications — Dex Horthy, HumanLayer]] — früherer Konferenzvortrag desselben Sprechers zu zuverlässigen LLM-Anwendungen
- [[How to Build the Most Powerful System for AI Coding (Full Breakdown)]] — Cole Medin zur AI Dark Factory, dem Lights-off-Gegenstück
- [[How to Kill the Code Review — Ankit Jain, Aviator]] — anderer Konferenzvortrag dazu, Zeile-für-Zeile-Review abzulösen
- [[Coding mit AI]] — Hub zu Workflows und Tools beim Entwickeln mit KI
- [ai-agent-harness-konzept](obsidian://open?vault=knowledge-base&file=ai-agent-harness-konzept) — KIMS-Harness aus Hooks, Skills und Rules zur Laufzeit
- [ai-code-quality-research](obsidian://open?vault=knowledge-base&file=ai-code-quality-research) — Befundlage zu überladenem, schwer wartbarem AI-Code und Review-Last
- [gefuehrte-code-durchsicht-agenten-features](obsidian://open?vault=knowledge-base&file=gefuehrte-code-durchsicht-agenten-features) — Review-Wege für agenten-gebauten Code
- [vorlage-last-autonomer-laeufe](obsidian://open?vault=knowledge-base&file=vorlage-last-autonomer-laeufe) — Dark-Factory-Spur und Last autonomer Läufe
- [llm-benchmark-kontamination](obsidian://open?vault=knowledge-base&file=llm-benchmark-kontamination) — warum SWE-bench-artige Sets nicht das messen, was der Sprecher als Lücke benennt
