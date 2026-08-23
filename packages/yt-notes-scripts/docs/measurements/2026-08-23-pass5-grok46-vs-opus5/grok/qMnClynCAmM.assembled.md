# The Next Evolution of AI Coding Is Harnesses - Here's How to Build Them

## Worum es geht

Cole Medin stellt das neu gebaute Archon vor: laut Sprecher der erste Open-Source-Harness-Builder für AI-Coding. Archon sitzt über Coding-Agents, verdrahtet deren Sessions zu YAML-Workflows und soll denselben Entwicklungsprozess über Repos und parallele Tasks wiederholbar machen.

---

## Notizen

[URL](https://youtu.be/qMnClynCAmM?is=BW1p617NVnsvAIwp)

Also ein Problem, das nicht angesprochen wird, das ich aber auf jeden Fall mit Claude Code habe, ist, dass es keine Sandbox gibt und ich den wirklich nicht autonom laufen lassen kann. In einer autonomen Umgebung kann der ja machen, was er will, weil er am Schluss nur die Dateien ändern kann, die in Git sind. Alles andere ist egal, weil das ignoriert wird und nicht gepusht wird. Das ist auf jeden Fall ein Problem, das ich lösen muss. Er hat auf jeden Fall recht, dass das Hundehalten der AI einfach zu viel Zeit kostet und dass hier ein Prozess, der autonom arbeitet, extrem wichtig und mächtig ist. Ein guter Punkt bei Archon ist, dass man hier Skills checken kann und die KI sich die nicht holen muss und das manchmal vergisst. Hier wird gesagt, dass man nach dem erstellen des Plans immer eine neue Session mit dem Agenten aufmachen soll, damit er nicht biased ist. Also das hilft mir auch nicht wirklich weiter. Da wird noch etwas am Anfang gemacht und am Schluss. Und ja, ich muss, um ein GitHub-Ticket herunterzuladen, nicht die LLM benutzen, sondern kann ein CLI benutzen. Weil ich das in einem YAML-Knoten spezifizieren kann. Aber 90 % des Workflows ist einfach immer noch, dass der Agent macht, was im Prompt steht. Und das ist mein Problem, da er hier autonom arbeitet und mich nicht zurückfragt bei Problemen. Und er erfindet einfach irgendwas.

---

---

## Besprochene Konzepte

- [[Harness Engineering_ What Separates Top Agentic Engineers Right Now]] — Tooling, Prompts und das Verketten mehrerer Coding-Agent-Sessions über dem einzelnen Modell
- Prompt Engineering — 2022–2024: ein LLM auf den besten Einzel-Output trimmen
- [[Context Engineering vs. Prompt Engineering_ Smarter AI with RAG & Agents]] — den passenden Kontext für einen einzelnen Agenten zusammenstellen, nicht mehr
- [[Ralph Wiggum is the Final Evolution of Vibe Coding (Here's What Comes Next)]] — bekannter Open-Source-Harness; laut Sprecher ein Startpunkt, aber nicht an den eigenen Prozess angepasst
- Archon-Workflow — YAML aus Nodes: entweder ein Prompt in eine Coding-Agent-Session oder ein deterministischer Befehl
- Hybrid-Prinzip — Schritte wie Tests oder Kontext-Zusammenstellung nicht dem Agenten überlassen, sondern als feste Nodes einbauen
- Getrennte Sessions — Planung und Implementierung in frischen Context-Windows, damit die Implementierung nicht an der Planung klebt
- Human-Approval-Gate — Workflow an einem Node anhalten und den Menschen einbinden
- Per-Node-Modellwahl — schwache Schritte (z. B. Klassifikation) auf ein günstigeres Modell legen
- Define once, run forever — den Prozess einmal als Workflow bündeln und über Projekte sowie parallele Tasks wiederverwenden
- AI Shepherding — Skills und Commands selbst anstoßen und die Reihenfolge im Kopf behalten
- [claude-code-skills](obsidian://open?vault=knowledge-base&file=claude-code-skills) — bestehende Skills und Commands als Prompt-Knoten in Archon-Workflows
- [claude-code-agent-teams](obsidian://open?vault=knowledge-base&file=claude-code-agent-teams) — Anthropic baut laut Sprecher an Agent Teams und Sub-Agents; der Claude-Code-Leak zeige viel Harness-Code
- Beads-Idee — persistente, strukturierte Memory für Coding-Agents, im Video als eigener Archon-Workflow nachgebaut

## Behauptungen

- Das neue Archon ist laut Sprecher der erste Open-Source-Harness-Builder für AI-Coding. ([0:00](https://www.youtube.com/watch?v=qMnClynCAmM&t=0s))
- Eine Harness ist die Schicht über Coding-Agents, die Sessions orchestriert und AI-Coding deterministisch und wiederholbar macht. ([0:00](https://www.youtube.com/watch?v=qMnClynCAmM&t=0s))
- Jeder Archon-Workflow ist eine Kombination aus Nodes: Prompt in eine Agent-Session oder deterministischer Befehl. ([0:00](https://www.youtube.com/watch?v=qMnClynCAmM&t=0s))
- Dinge wie Kontext-Erzeugung und Validierung sollen nicht dem Coding-Agent überlassen werden, weil er sie vergessen kann. ([0:00](https://www.youtube.com/watch?v=qMnClynCAmM&t=0s))
- Mitgelieferte Workflows: GitHub-Issues fixen, PRs aus Ideen, PR-Validierung und Review, volle PRDs mit Human-in-the-Loop. ([0:00](https://www.youtube.com/watch?v=qMnClynCAmM&t=0s))
- Der Sprecher kündigt einen Livestream am Samstag, 9:00 a.m. Central Time, zu Workflows und parallelen Läufen an. ([0:00](https://www.youtube.com/watch?v=qMnClynCAmM&t=0s))
- Prompt Engineering (2022–2024) wurde zu Context Engineering und das zu Harness Engineering mit vielen Coding-Agent-Sessions. ([3:07](https://www.youtube.com/watch?v=qMnClynCAmM&t=187s))
- Bestehende Harnesses (Ralph Loop, Open-Source-Harnesses von Anthropic) sind laut Sprecher nicht auf den eigenen Software-Entwicklungsprozess zugeschnitten. ([3:07](https://www.youtube.com/watch?v=qMnClynCAmM&t=187s))
- Der Sprecher sagt, Claude stehe vor der Veröffentlichung von Mythos, vor allem für Enterprise; Consumer könnten Mythos nicht für alles bezahlen. ([3:07](https://www.youtube.com/watch?v=qMnClynCAmM&t=187s))
- Der Sprecher behauptet, eine Harness um Opus könne das Modell mächtiger machen als Mythos allein. ([3:07](https://www.youtube.com/watch?v=qMnClynCAmM&t=187s))
- Laut Sprecher liegt die PR-Acceptance-Rate bei bloß generiertem Code bei 6,7 Prozent, mit Harness bei fast 70 Prozent. ([3:07](https://www.youtube.com/watch?v=qMnClynCAmM&t=187s))
- Stripe verschifft laut Sprecher 1300 nur-KI-generierte Pull Requests pro Woche über Stripe Minion; das System ist nicht Open Source. ([3:07](https://www.youtube.com/watch?v=qMnClynCAmM&t=187s))
- Nach dem Claude-Code-Quelltext-Leak seien 40 Prozent der Anthropic-Codebasis Harness-Code. ([3:07](https://www.youtube.com/watch?v=qMnClynCAmM&t=187s))
- Das alte Archon saß in den Coding-Agents (RAG, Task-Management) und wurde laut Sprecher irrelevant, weil die Agents das selbst bauten. ([5:54](https://www.youtube.com/watch?v=qMnClynCAmM&t=354s))
- Das neue Archon sitzt über Claude Code und Codex und orchestriert sie. ([5:54](https://www.youtube.com/watch?v=qMnClynCAmM&t=354s))
- Kontext, Skills und MCP-Server lassen sich pro Node setzen, nicht nur global. ([5:54](https://www.youtube.com/watch?v=qMnClynCAmM&t=354s))
- Planung und Implementierung sollen in verschiedenen Coding-Sessions laufen. ([5:54](https://www.youtube.com/watch?v=qMnClynCAmM&t=354s))
- Tests sollen jedes Mal als fester Schritt laufen, nicht weil der Agent sich daran erinnert. ([5:54](https://www.youtube.com/watch?v=qMnClynCAmM&t=354s))
- Das „hybrid secret“ von Stripe Minion: bestimmte Schritte entscheidet der Agent nicht. ([5:54](https://www.youtube.com/watch?v=qMnClynCAmM&t=354s))
- Bestehende Commands und Skills lassen sich in Archon-Workflows übernehmen. ([5:54](https://www.youtube.com/watch?v=qMnClynCAmM&t=354s))
- Installation: Repo klonen, Claude Code öffnen, „set up Archon“ sagen; der Sprecher sagt, das gehe in unter 5 Minuten. ([8:48](https://www.youtube.com/watch?v=qMnClynCAmM&t=528s))
- Voraussetzung ist unter anderem Bun; fehlt es, wird es installiert. ([8:48](https://www.youtube.com/watch?v=qMnClynCAmM&t=528s))
- Das erste registrierte Projekt soll das eigene Ziel-Repo sein, nicht das Archon-Repo. ([8:48](https://www.youtube.com/watch?v=qMnClynCAmM&t=528s))
- Die CLI ist Standard; zusätzlich GitHub, Telegram und Slack. ([8:48](https://www.youtube.com/watch?v=qMnClynCAmM&t=528s))
- API-Keys gehören in ein separates Terminal, nicht in Claude Code. ([8:48](https://www.youtube.com/watch?v=qMnClynCAmM&t=528s))
- Auf manchen Betriebssystemen und auf einem VPS muss man die Setup-Session selbst öffnen. ([8:48](https://www.youtube.com/watch?v=qMnClynCAmM&t=528s))
- Datenbank: SQLite als einfachster Default, optional Postgres. ([8:48](https://www.youtube.com/watch?v=qMnClynCAmM&t=528s))
- Coding-Assistent: derzeit vor allem Claude; Codex-Support fast fertig; später Pi Agent SDK und Open Code. ([8:48](https://www.youtube.com/watch?v=qMnClynCAmM&t=528s))
- Ein lokales Anthropic-Abo ist laut Sprecher erlaubt, weil Archon lokal über das Claude Agent SDK läuft. ([8:48](https://www.youtube.com/watch?v=qMnClynCAmM&t=528s))
- Der Sprecher empfiehlt, den Archon-Skill ins Zielprojekt zu legen, damit der Agent die CLI bedienen kann. ([8:48](https://www.youtube.com/watch?v=qMnClynCAmM&t=528s))
- Beim ersten Lauf der Archon-CLI in einem Repo wird das Repo automatisch registriert. ([8:48](https://www.youtube.com/watch?v=qMnClynCAmM&t=528s))
- Die Setup-Prüfung listet Default-Workflows und startet den Workflow „Archon assist“ als Funktionstest. ([8:48](https://www.youtube.com/watch?v=qMnClynCAmM&t=528s))
- „Use Archon to fix issue number one in GitHub“ reicht: Skill laden, passenden Workflow wählen, im Hintergrund laufen lassen. ([15:03](https://www.youtube.com/watch?v=qMnClynCAmM&t=903s))
- Der Default-Workflow „fix GitHub issue“ macht Investigation, Fix, Validierung und erst dann den Pull Request. ([15:03](https://www.youtube.com/watch?v=qMnClynCAmM&t=903s))
- Die Web-UI läuft im Demo auf Port 5178. ([17:01](https://www.youtube.com/watch?v=qMnClynCAmM&t=1021s))
- Jeder Node ist entweder eine deterministische Aktion (z. B. Bash) oder eine Claude-Code-Session; neu starten oder die Conversation fortsetzen ist wählbar. ([18:47](https://www.youtube.com/watch?v=qMnClynCAmM&t=1127s))
- Workflows liegen als YAML unter `.archon` und stecken auch in der CLI. ([18:47](https://www.youtube.com/watch?v=qMnClynCAmM&t=1127s))
- Die Workflow-Description steuert wie bei Skills die Auswahl; der volle Workflow soll nicht in den Agent-Kontext. ([18:47](https://www.youtube.com/watch?v=qMnClynCAmM&t=1127s))
- Klassifikation braucht wenig Reasoning; dafür empfiehlt der Sprecher Haiku. Default-Modell der Nodes ist Sonnet, wenn keines gesetzt ist. ([18:47](https://www.youtube.com/watch?v=qMnClynCAmM&t=1127s))
- Commands im Workflow-Ordner sind längere Prompts für einzelne Nodes, analog zu Claude-Commands/Skills. ([18:47](https://www.youtube.com/watch?v=qMnClynCAmM&t=1127s))
- Der Fix-Issue-Workflow klassifiziert Bug vs. Feature und verzweigt in Investigation oder Planung. ([18:47](https://www.youtube.com/watch?v=qMnClynCAmM&t=1127s))
- Mitgeliefert unter anderem: Adversarial-Dev-Harness, umfassendes PR-Review, Issue-Erzeugung, Idea-to-PR, interaktives PRD, Ralph Loop, Workflow-Builder. ([18:47](https://www.youtube.com/watch?v=qMnClynCAmM&t=1127s))
- Human-in-the-Loop: an jedem Node auf Input warten. ([18:47](https://www.youtube.com/watch?v=qMnClynCAmM&t=1127s))
- Der Sprecher startet aus der Web-UI Issue 3 und per CLI die Issues 5, 7, 8, 9, 10 und 11 parallel. ([25:52](https://www.youtube.com/watch?v=qMnClynCAmM&t=1552s))
- Am Ende zeigt er acht neue offene Pull Requests. ([25:52](https://www.youtube.com/watch?v=qMnClynCAmM&t=1552s))
- Eigene Workflows können Ideen aus GSD, B-MAD oder Beads aufnehmen. ([27:40](https://www.youtube.com/watch?v=qMnClynCAmM&t=1660s))
- Der Workflow-Builder entsteht, wenn man im Archon-Repo sagt, man wolle mit dem Workflow-Builder-Workflow einen Archon-Workflow bauen. ([27:40](https://www.youtube.com/watch?v=qMnClynCAmM&t=1660s))
- Der Beads-Nachbau im Demo: Exploration, Feature in Tasks zerlegen, Implementierung in einer Schleife mit Fortschritt, Validierung am Ende. ([27:40](https://www.youtube.com/watch?v=qMnClynCAmM&t=1660s))
- Geplant ist ein Workflow-Builder „wie n8n, aber für AI-Coding“. ([27:40](https://www.youtube.com/watch?v=qMnClynCAmM&t=1660s))
- Der Sprecher vermutet Bugs, weil Archon in der Beta steckt. ([27:40](https://www.youtube.com/watch?v=qMnClynCAmM&t=1660s))

## Demos / Schritte

1. Archon-Repo klonen, Verzeichnis wechseln, Claude Code öffnen.
2. „set up Archon“ sagen; der Archon-Skill übernimmt das Setup.
3. Voraussetzungen prüfen (inkl. Bun) und bei Bedarf installieren.
4. Erstes Ziel-Repo setzen (im Demo per lokalem Pfad, nicht das Archon-Repo).
5. Plattformen wählen: CLI plus im Demo GitHub, Telegram und Slack.
6. Credentials im separaten Setup-Wizard: SQLite, Claude, Auth über das Anthropic-Abo; Keys nicht in Claude Code.
7. Archon-Skill in das Zielprojekt kopieren; optionales Docs-Verzeichnis im Demo mit „no“.
8. In der ersten Session „Done“ sagen; Verbindungen prüfen, Default-Workflows listen, „Archon assist“ als Probe laufen lassen.
9. Im Ziel-Repo Claude Code öffnen und z. B. „Use Archon to fix issue number one in GitHub“ sagen.
10. Der Agent lädt den Skill, wählt „fix GitHub issue“, startet den Lauf im Hintergrund; Logs in Claude Code oder in der Web-UI.
11. Im Archon-Repo Frontend und Backend starten lassen; Browser auf Port 5178.
12. Dashboard: aktiver Workflow, Node-Fortschritt, Tool-Calls aus Claude Code.
13. YAML unter `.archon` zeigen: Description, Provider, Default-Modell, Node-Liste, Verzweigungen, optionales Modell pro Node, Commands als Node-Prompts.
14. In der Web-UI ein weiteres Issue (im Demo Nr. 3) demselben Workflow zuordnen.
15. Per CLI mehrere Issues parallel anstoßen (im Demo 5, 7, 8, 9, 10, 11); Ergebnis: acht offene PRs.
16. Im Archon-Repo den Workflow-Builder-Workflow starten, das Beads-Repo übergeben; es entsteht YAML (Exploration → Tasks → Loop → Validierung), sichtbar in der UI.

## Genannte Tools

- Archon — Open-Source-Harness-Builder: YAML-Workflows über Coding-Agents, CLI und Web-UI
- [claude-code-overview](obsidian://open?vault=knowledge-base&file=claude-code-overview) — Coding-Agent, den Archon orchestriert; Setup und Skill-Aufruf laufen darüber
- Codex — zweiter Coding-Agent; Support laut Sprecher fast fertig
- GitHub CLI — im Demo zum Lesen des Issues vor dem Workflow
- [[Bun]] — Voraussetzung der Installation; wird bei Bedarf mitinstalliert
- SQLite — Default-Datenbank im Setup-Wizard
- Postgres — optionale Datenbank statt SQLite
- GitHub — Plattform zum Anbinden und für Issue-/PR-Workflows
- [[Telegram]] — optionales Interface neben CLI und GitHub
- Slack — optionales Interface neben CLI, GitHub und Telegram
- Claude Agent SDK — lokale Laufzeit, über die das Anthropic-Abo laut Sprecher nutzbar ist
- Pi Agent SDK — geplante weitere Coding-Assistenten-Anbindung
- Open Code — geplante weitere Coding-Assistenten-Anbindung
- Beads — Open-Source-Repo für persistente strukturierte Agent-Memory; im Demo als Archon-Workflow nachgebaut
- GSD — Framework, das sich laut Sprecher als eigener Archon-Workflow abbilden lässt
- B-MAD — Framework, das sich laut Sprecher als eigener Archon-Workflow abbilden lässt
- n8n — Vergleichsbild für den geplanten visuellen Workflow-Builder
- Stripe Minion — internes Stripe-System für KI-PRs; nicht Open Source
- Haiku — Modell für leichte Nodes, z. B. Issue-Klassifikation
- Sonnet — Default-Modell der Nodes, wenn keines gesetzt ist
- Opus — Modell, um das man laut Sprecher eine Harness legen kann
- Mythos — angekündigtes Claude-Modell, laut Sprecher vor allem Enterprise
- MCP-Server — lassen sich pro Node einbinden, z. B. nur in der Planung

## Verwandt

- [[Introducing Archon - The Revolutionary Operating System for AI Coding]] — Vorgänger: Archon als OS in den Agents (RAG, Tasks), nicht als Schicht darüber
- [ai-agent-harness-konzept](obsidian://open?vault=knowledge-base&file=ai-agent-harness-konzept) — KIMS-Begriff der Agent-Harness (Hooks, Skills, Rules zur Laufzeit)
- [autonome-agent-workflows-overview](obsidian://open?vault=knowledge-base&file=autonome-agent-workflows-overview) — Entwicklungsprozess als orchestrierter, wiederholbarer Agent-Workflow
- [[Omnigent_ The New Meta-Harness for EVERY Coding Agent - Claude Code, Codex, Pi, More]] — andere Meta-Harness über Claude Code, Codex und Pi
- [skill-lib-coleam-skills](obsidian://open?vault=knowledge-base&file=skill-lib-coleam-skills) — Skills aus Cole Medins eigenem Bestand
- [skill-lib-ecc](obsidian://open?vault=knowledge-base&file=skill-lib-ecc) — weiteres „Agent harness operating system“ (Plan → Test → Review)
- [skill-lib-gnhf](obsidian://open?vault=knowledge-base&file=skill-lib-gnhf) — Ralph-artiger Orchestrator für unbeaufsichtigte Iterationen
- [agent-harness-abo-zugaenge](obsidian://open?vault=knowledge-base&file=agent-harness-abo-zugaenge) — welche Abos lokale Harnesses (inkl. Agent SDK) wirklich tragen
- [[12-Factor Agents Patterns of reliable LLM applications — Dex Horthy, HumanLayer]] — Zuverlässigkeit über Gates und Human-in-the-Loop statt nur Agent-Prompts
