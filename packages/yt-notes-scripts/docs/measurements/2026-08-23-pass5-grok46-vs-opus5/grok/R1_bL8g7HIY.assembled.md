# OpenAI NEW Agent Builder: Easily Create AI Agents That Can Automate Anything! n8n Killer? (Agentkit)

## Worum es geht

OpenAIs **Agent Kit** wird als kostenlose No-Code-Plattform vorgestellt, mit der man KI-Agenten visuell bauen, testen, bewerten und veröffentlichen kann. Der Sprecher führt den Agent Builder vor, zeigt zwei Demo-Workflows und vergleicht das Angebot mit n8n.

---

## Notizen

[URL](https://youtu.be/R1_bL8g7HIY?si=8nnZQU19uq9jm2bh)

Interessant ist tatsächlich, dass man den Code für seinen No-Code-Workflow bekommen kann, um daran dann eine erweiterte Version zu bauen, nehme ich an. Ansonsten sind die gezeigten Beispiele extrem einfach und bieten keine wirkliche Evaluierungsmöglichkeit für das Werkzeug. Ich teile die Meinung vom Video, dass aktuell n8N wesentlich mächtiger ist, wie die Lösung von OpenAI. So die größere Integration von Third-Party-Tools, Möglichkeiten den Workflow zu steuern und auch Möglichkeiten der Datenbearbeitung generell. Also quasi jeden Aspekt des Tools. Außerdem hat man, wie er auch sagt, die Möglichkeit unterschiedliche Modelle zu benutzen, was Optimierungen für die verschiedensten Anwendungsszenarien bietet, ob es nun Kosten oder Performance sind. Es gibt aber keine kostenlose Version von N8N. Hier macht es tatsächlich Sinn, wenn man mit dieser Art von Werkzeug arbeiten möchte, erstmal die kostenlose Version von OpenAI zu benutzen, um zu sehen, wie weit man mit seinen Kenntnissen kommt bzw. was diese Art von Tools für Möglichkeiten bieten.

---

---

## Besprochene Konzepte

- Agent Kit — End-to-End-Plattform zum Bauen, Deployen und Optimieren von KI-Agenten ohne Code, nativ im OpenAI-Ökosystem
- Agent Builder — visuelles Canvas mit Drag-and-Drop, eingebauten Guardrails und Live-Preview
- Connector Registry — zentrale Stelle für Datenquellen, APIs und Tools über OpenAI-Produkte hinweg
- Chat Kit — einbettbares Chat-UI für agentische Oberflächen in Produkten und Websites
- Multi-Agent-Workflows — mehrere Agent-Nodes hintereinander, etwa Recherche und Zusammenfassung
- Guardrails — Prüfung der Nutzereingabe (z. B. Moderation) vor dem Ausführen
- Workflow-Logik — If-Else, Loops, User-Approvals, Daten umformen und State setzen
- Modellwahl nur im OpenAI-Ökosystem — Gemini- und Claude-Modelle sind nicht wählbar
- Evaluation — Logs, Traces und Tests nach dem Lauf
- No-Code und AI-Engineering — der Sprecher sagt, Agent Kit verwischt die Grenze zwischen beiden

## Behauptungen

- Agent Kit ist OpenAIs Antwort auf n8n, Vector Shift und LangGraph, nativ im OpenAI-Ökosystem und derzeit frei zugänglich.
- Es ist eine End-to-End-Plattform zum Bauen, Deployen und Optimieren von KI-Agenten ohne Code.
- Die drei Kernteile sind Agent Builder, Connector Registry und Chat Kit.
- Agent Kit verwischt die Grenze zwischen AI-Engineering und No-Code-Automatisierung und ermöglicht produktionsreife Agenten visuell, vergleichbar mit Zapier, mit nativer GPT-Anbindung und eingebauter Evaluation.
- HubSpot hat das Custom-Response-Widget von Agent Kit in den eigenen KI-Assistenten integriert, damit die Firmen-Wissensdatenbank in Echtzeit durchsucht wird.
- Agent Kit ist nicht nur für Entwickler gedacht, sondern für echte Unternehmen, die agentische Logik in Kundenerlebnisse einbetten wollen.
- Die Modellwahl im Agent-Node ist auf das OpenAI-Ökosystem beschränkt; Gemini und Claude sind nicht nutzbar.
- Erweiterte Optionen im Agent-Node soll man nicht sofort anfassen, wenn man sie nicht versteht.
- Vorlagen im Agent Builder umfassen unter anderem Document Comparison, Internal Knowledge Assistant und Data Enrichment.
- Nach der Konfiguration kann man den Agenten evaluieren, duplizieren, Chat-Kit- und Agent-SDK-Code holen, eine Domain zuweisen und veröffentlichen.
- Agent Kit ist n8n noch nicht überlegen, weil es noch sehr neu ist.
- Der Sprecher bevorzugt n8n wegen einfacherer Bedienung, mehr Anpassbarkeit, mehr Nodes, mehr Modellwahl und einem leichteren Weg von Prototyp zu Produktion.
- Agent Kit ist trotzdem eine gute, im Browser kostenlos nutzbare Alternative mit aktuellen Modellen.
- Der Sprecher vermutet, dass Agent Kit künftig mit n8n gleichziehen könnte.
- Laut Sprecher ist n8n derzeit besser für Multi-Provider und stark anpassbare Workflows; Agent Kit eignet sich, um kostenlos in der Cloud mit einfachen Automatisierungen zu starten.
- Der Datenbank-Agent kann laut Sprecher auch große Mengen von Dokumenten verarbeiten.

## Demos / Schritte

1. OpenAI Platform öffnen, Abschnitt Agent Builder wählen, neuen Workflow von Grund auf anlegen (Vorlagen sind vorhanden).
2. Nodes per Drag-and-Drop setzen: Start, Agent, End, Document, File Search, Guardrails, MCP, If-Else, Loop, User Approval, Data, Set State.
3. Agent-Node konfigurieren: Name, Instruction, OpenAI-Modell, Reasoning Effort ein/aus, Tools wie Client Tool, MCP und File Search.
4. Recherche-Workflow: User Inquiry → Web-Research-Agent (Web Search, Marketing-Infos zur Firma) → Summarize-and-Display-Agent (GPT-5, Chat History, festes Ausgabeformat).
5. Preview mit dem Prompt „analyze Nvidia the stock“: Webquellen werden gelesen, danach eine Zusammenfassung mit Name, Industrie (Semiconductors and Technology), Hauptsitz Santa Clara, Unternehmensgröße, Website, Gründungsjahr und Beschreibung.
6. Evaluation öffnen (Logs, Traces, Tests); Workflow duplizieren; Code für Chat Kit und Agent SDK holen; Domain setzen; veröffentlichen.
7. Datenbank-Workflow: Guardrail prüft die Eingabe auf Moderation, danach Kategorie erkennen und Select-Agent ausführen.
8. Preview mit „how many orders did you sell in 2015“: nach bestandenem Guardrail Antwort ca. 82k Orders auf Basis der Dummy-Daten.

## Genannte Tools

- Agent Kit — OpenAIs No-Code-Plattform für visuelle KI-Agenten
- [[n8n]] — Workflow-Automatisierung, vom Sprecher als Vergleichsmaßstab und bevorzugte Alternative
- LangGraph — vom Sprecher als Vergleichsprodukt im agentischen No-Code-/Orchestrierungsraum genannt
- Vector Shift — vom Sprecher als Vergleichsprodukt genannt
- Zapier — Vergleichsbild für visuelles, produktionsreifes Automatisieren
- Chat Kit — Toolkit zum Einbetten agentischer Chat-UIs
- Agent SDK — Code-Zugang neben Chat Kit nach der Konfiguration
- [[openai api modelle]] — GPT-5 und die übrigen wählbaren Modelle im Agent-Node
- MCP — Node- und Tool-Typ im Agent Builder
- File Search — OpenAI-Tool im Canvas und im Agent-Node
- HubSpot — Beispiel für eingebettetes Custom-Response-Widget auf einer Firmen-Wissensdatenbank
- OpenAI Platform — Einstieg in den Agent Builder

## Verwandt

- [[Did ChatGPT Just Kill Zapier]] — anderer Überblick zu AgentKit als Visual-Workflow-Builder und zum Zapier-Vergleich
- [[10x Your AI Agents with this ONE Agent Architecture]] — LangGraph-Orchestrierung als Gegenstück zu dem im Video genannten Vergleichsprodukt
- [[Kestra Easily Create AI Agents That Can Automate Anything! Opensource n8n Alternative!]] — weitere n8n-Alternative im selben No-Code-Agent-Raum
- [[OpenAI Just Dropped ChatGPT Apps SDK Massive Upgrade!]] — OpenAI-SDK- und Plattform-Kontext neben dem im Video genannten Agent SDK
- [claude-code-mcp-setup](obsidian://open?vault=knowledge-base&file=claude-code-mcp-setup) — MCP-Einrichtung, thematisch zu den MCP-Nodes im Agent Builder
- [graded-evaluation](obsidian://open?vault=knowledge-base&file=graded-evaluation) — Bewertung von Agent-Ausgaben, benachbart zur Trace-Evaluation im Agent Builder
- [[If You’re Serious About Building AI Agents, This is Your Secret Weapon]] — Tracing und Observability von Agent-Läufen
- [agent-orchestrierung-entscheidung](obsidian://open?vault=knowledge-base&file=agent-orchestrierung-entscheidung) — wann mehrere Agenten zusammenarbeiten, analog zum Multi-Agent-Canvas
