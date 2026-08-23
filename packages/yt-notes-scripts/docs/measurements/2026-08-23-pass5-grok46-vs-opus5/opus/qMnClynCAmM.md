---
tags:
  - youtube
aliases:
  - "Archon: Open-Source Harness Builder für AI Coding Agents"
channelName: Cole Medin
publish_date: 2026-04-09
display_title: "Archon: Open-Source Harness Builder für AI Coding Agents"
description: Das Video stellt Archon vor, ein Open-Source-Tool, das als "Harness
  Builder" über AI-Coding-Agenten wie Claude Code sitzt und mehrere
  Agenten-Sessions zu wiederholbaren Workflows orchestriert. Gezeigt werden
  YAML-basierte Workflow-Definitionen mit deterministischen Bash-Nodes und
  AI-Nodes, das Archon-CLI, ein Web-Dashboard zur Log-Visualisierung, parallele
  Workflow-Ausführung für mehrere GitHub-Issues sowie ein Meta-Workflow zum
  Erstellen eigener Workflows. Relevant für Entwickler, die wiederkehrende
  Agentic-Coding-Prozesse (Bug-Fix, PR-Erstellung, Code-Review) automatisieren
  und die Reproduzierbarkeit ihrer KI-gestützten Entwicklungspipeline erhöhen
  wollen.
youtube_id: qMnClynCAmM
---

# The Next Evolution of AI Coding Is Harnesses - Here's How to Build Them

## Worum es geht

Cole Medin stellt die komplett überarbeitete Version von **Archon** vor — laut Sprecher der erste Open-Source-"Harness-Builder" für AI-Coding. Statt wie früher ein in die Coding-Agents eingebautes Tool zu sein, sitzt das neue Archon *über* Claude Code und Codex und orchestriert mehrere Coding-Agent-Sessions zu wiederholbaren, deterministischen Workflows.

---

## Notizen

[URL](https://youtu.be/qMnClynCAmM?is=BW1p617NVnsvAIwp)

Also ein Problem, das nicht angesprochen wird, das ich aber auf jeden Fall mit Claude Code habe, ist, dass es keine Sandbox gibt und ich den wirklich nicht autonom laufen lassen kann. In einer autonomen Umgebung kann der ja machen, was er will, weil er am Schluss nur die Dateien ändern kann, die in Git sind. Alles andere ist egal, weil das ignoriert wird und nicht gepusht wird. Das ist auf jeden Fall ein Problem, das ich lösen muss. Er hat auf jeden Fall recht, dass das Hundehalten der AI einfach zu viel Zeit kostet und dass hier ein Prozess, der autonom arbeitet, extrem wichtig und mächtig ist. Ein guter Punkt bei Archon ist, dass man hier Skills checken kann und die KI sich die nicht holen muss und das manchmal vergisst. Hier wird gesagt, dass man nach dem erstellen des Plans immer eine neue Session mit dem Agenten aufmachen soll, damit er nicht biased ist. Also das hilft mir auch nicht wirklich weiter. Da wird noch etwas am Anfang gemacht und am Schluss. Und ja, ich muss, um ein GitHub-Ticket herunterzuladen, nicht die LLM benutzen, sondern kann ein CLI benutzen. Weil ich das in einem YAML-Knoten spezifizieren kann. Aber 90 % des Workflows ist einfach immer noch, dass der Agent macht, was im Prompt steht. Und das ist mein Problem, da er hier autonom arbeitet und mich nicht zurückfragt bei Problemen. Und er erfindet einfach irgendwas.

---

## Besprochene Konzepte

- **Harness Engineering** — Schicht über den Coding-Agents, die mehrere Sessions verkettet, Tooling/Prompting/Validierung bündelt und so einen einzelnen LLM aufwertet.
- [[Context Engineering is the New Vibe Coding (Learn this Now)]] — Kuratieren des perfekten Kontexts für einen einzelnen Agent; Zwischenstufe in der Evolution.
- [Prompt Engineering](obsidian://open?vault=knowledge-base&file=llm-coding-prompting-patterns) — frühere Stufe (2022–2024): einen LLM so prompten, dass ein einzelner bestmöglicher Output entsteht.
- Workflow aus Nodes — ein Node ist entweder ein Prompt in eine Coding-Agent-Session oder ein deterministischer Command (z.B. erzwungene Kontext-Erstellung oder Validierung).
- Hybrid-Ansatz ("hybrid secret") — die meisten Schritte treibt der Coding-Agent über Commands/Skills, kritische Schritte (Kontext-Kuration, Tests) werden deterministisch erzwungen.
- Per-Node-Modellwahl — pro Node lässt sich Modell und neue-Session-vs-Conversation-Fortsetzung festlegen, für Token-Management und Kosteneffizienz.
- DAG-Workflow mit Verzweigungen — Klassifizierung (Bug vs. Feature) steuert den weiteren Pfad (Investigation vs. Planning).
- Human-in-the-Loop-Gate — Workflow kann an beliebigen Nodes für Nutzer-Feedback pausieren.

## Behauptungen

- Harnesses seien "die Zukunft" und das, was AI-Coding deterministisch und wiederholbar mache ([0:00](https://www.youtube.com/watch?v=qMnClynCAmM&t=0s)).
- Der alte Archon sei irrelevant geworden, weil die Coding-Agents RAG und Task-Management selbst eingebaut haben ([5:54](https://www.youtube.com/watch?v=qMnClynCAmM&t=354s)).
- Bei Planning und Implementation solle man immer getrennte Sessions / einen frischen Context nutzen, um Bias zu entfernen ([5:54](https://www.youtube.com/watch?v=qMnClynCAmM&t=354s)).
- Claude stehe kurz vor dem Release von "Mythos", das eher für Enterprise-Nutzung gedacht sei und für Endkunden zu teuer ([5:54](https://www.youtube.com/watch?v=qMnClynCAmM&t=354s)).
- Ein Harness um Opus könne dieses mächtiger machen als Mythos allein ([5:54](https://www.youtube.com/watch?v=qMnClynCAmM&t=354s)).
- Eine Studie zeige: Ein LLM allein erreiche nur 6,7 % PR-Acceptance-Rate, mit einem Harness bis zu fast 70 % ([5:54](https://www.youtube.com/watch?v=qMnClynCAmM&t=354s)).
- Stripe shippe mit "Stripe Minion" 1.300 rein AI-generierte Pull Requests pro Woche; das System sei Archon-ähnlich, aber nicht Open Source ([5:54](https://www.youtube.com/watch?v=qMnClynCAmM&t=354s)).
- Laut Claude-Code-Source-Code-Leak seien 40 % von Anthropics Codebase reiner Harness-Code ([5:54](https://www.youtube.com/watch?v=qMnClynCAmM&t=354s)).
- Die Installation gelinge in unter 5 Minuten, weil ein Skill den Coding-Agent durch den gesamten Setup führe ([8:48](https://www.youtube.com/watch?v=qMnClynCAmM&t=528s)).
- API-Keys solle man nicht direkt in Claude Code eingeben — der Setup-Wizard läuft in einem separaten Terminal-Prozess ([8:48](https://www.youtube.com/watch?v=qMnClynCAmM&t=528s)).
- Die Nutzung des Anthropic-Abos sei erlaubt, solange es eine lokal laufende App über das Claude Agent SDK ist — was bei Archon der Fall sei ([8:48](https://www.youtube.com/watch?v=qMnClynCAmM&t=528s)).
- Aktuell werde vor allem Claude unterstützt, Codex-Support sei fast fertig; später sollen Pi Agent SDK und Open Code folgen ([8:48](https://www.youtube.com/watch?v=qMnClynCAmM&t=528s)).
- Workflows seien einfache YAML-Dateien, leicht anzupassen und selbst zu erstellen ([18:47](https://www.youtube.com/watch?v=qMnClynCAmM&t=1127s)).
- Die Workflow-Description vorne funktioniere wie bei Claude-Code-Skills — der Agent bekommt zuerst nur die kurze Beschreibung, nicht den ganzen Workflow in den Context ([18:47](https://www.youtube.com/watch?v=qMnClynCAmM&t=1127s)).
- Klassifizierungs-Nodes brauchten wenig Reasoning und könnten mit Haiku günstig/token-effizient laufen, default sei Sonnet ([18:47](https://www.youtube.com/watch?v=qMnClynCAmM&t=1127s)).
- Man könne viele Workflows parallel als Background-Prozesse laufen lassen (z.B. sechs GitHub-Issues gleichzeitig) ([25:52](https://www.youtube.com/watch?v=qMnClynCAmM&t=1552s)).
- Beads sei ein Open-Source-Repo, das Coding-Agents persistenten, strukturierten Speicher gebe ([27:40](https://www.youtube.com/watch?v=qMnClynCAmM&t=1660s)).
- Archon sei noch in Beta, es werde wahrscheinlich Bugs geben ([27:40](https://www.youtube.com/watch?v=qMnClynCAmM&t=1660s)).

## Demos / Schritte

1. Repository klonen, ins Verzeichnis wechseln und Claude Code öffnen ([8:48](https://www.youtube.com/watch?v=qMnClynCAmM&t=528s)).
2. "set up Archon" eingeben — der Archon-Skill lädt automatisch und startet den geführten Setup-Prozess ([8:48](https://www.youtube.com/watch?v=qMnClynCAmM&t=528s)).
3. Prerequisites prüfen (u.a. Bun, wird bei Bedarf installiert) und das erste Ziel-Repository registrieren (eigenes Projekt, nicht das Archon-Repo) ([8:48](https://www.youtube.com/watch?v=qMnClynCAmM&t=528s)).
4. Plattformen wählen (CLI default, optional GitHub, Telegram, Slack) ([8:48](https://www.youtube.com/watch?v=qMnClynCAmM&t=528s)).
5. Im separaten Terminal-Wizard Datenbank (SQLite oder Postgres) und Coding-Assistant (Claude via globaler Anthropic-Auth) wählen und Credentials für die Plattformen eingeben ([8:48](https://www.youtube.com/watch?v=qMnClynCAmM&t=528s)).
6. Archon-Skill ins Ziel-Projekt installieren ([8:48](https://www.youtube.com/watch?v=qMnClynCAmM&t=528s)).
7. Zur ersten Session zurückkehren, "Done" melden; Archon testet Connections, listet Default-Workflows und führt einen Test-Workflow aus ([8:48](https://www.youtube.com/watch?v=qMnClynCAmM&t=528s)).
8. In einem beliebigen Repo Claude öffnen und z.B. "Use Archon to fix issue number one in GitHub" sagen — der passende Workflow läuft als Background-Prozess ([15:03](https://www.youtube.com/watch?v=qMnClynCAmM&t=903s)).
9. Front- und Backend per Agent starten und das Web-Dashboard auf Port 5178 öffnen, um Workflows und Logs zu visualisieren ([17:01](https://www.youtube.com/watch?v=qMnClynCAmM&t=1021s)).
10. Mehrere Issues in einem Befehl parallel abarbeiten lassen → mehrere offene Pull Requests als Ergebnis ([25:52](https://www.youtube.com/watch?v=qMnClynCAmM&t=1552s)).
11. Custom-Workflow per "workflow builder workflow" bauen lassen — Beispiel: einen Beads-inspirierten Workflow als YAML generieren ([27:40](https://www.youtube.com/watch?v=qMnClynCAmM&t=1660s)).

## Genannte Tools

- [Claude Code](obsidian://open?vault=knowledge-base&file=claude-code-overview) — Coding-Agent, über den Archon Sessions orchestriert.
- Codex — zweiter Coding-Agent, Support fast fertiggestellt.
- Claude Agent SDK — Grundlage, über die Archon lokal das Anthropic-Abo nutzen darf.
- Mythos — kommendes, enterprise-orientiertes Claude-Angebot (als Vergleich genannt).
- Opus / Sonnet / Haiku — Claude-Modelle; per Node wählbar (Haiku günstig für Klassifizierung).
- Ralph loop — bekannter Harness-Ansatz, in Archon als Workflow nachgebaut.
- Stripe Minion — Stripes internes, nicht-öffentliches AI-Coding-System als Vorbild.
- Beads — Open-Source-Repo für persistenten strukturierten Coding-Agent-Speicher.
- B-MAD / GSD — Coding-Frameworks, die man in Archon-Workflows überführen kann.
- Bun — JavaScript-Runtime, Prerequisite für Archon.
- SQLite / Postgres — wählbare Datenbanken.
- GitHub (CLI) / Telegram / Slack — Interfaces, über die Archon angesteuert werden kann.
- Pi Agent SDK / Open Code — geplante zukünftige Coding-Assistant-Integrationen.
- N8N — als Analogie für den geplanten visuellen Workflow-Builder ("N8N für AI-Coding").

## Verwandt

- [[Introducing Archon - The Revolutionary Operating System for AI Coding]] — die alte Archon-Version desselben Channels, die der Sprecher hier explizit als überholt beschreibt.
- [[The Greatest AI Coding System I've Ever Used, Forget Codex Vs Claude Code]] — anderes Tool (Goal Buddy) zum selben Thema: lang laufende, autonome Coding-Tasks über Claude Code/Codex.
- [Claude Code Session Management](obsidian://open?vault=knowledge-base&file=claude-code-session-management) — passt zu Archons Kernversprechen, Context/Token über mehrere Sessions hinweg schlank zu halten.
- [AI Code Quality Research](obsidian://open?vault=knowledge-base&file=ai-code-quality-research) — Hintergrund zur Behauptung, dass Validierung/Kontext-Kuration im Harness die PR-Qualität von AI-Code drastisch hebt.
