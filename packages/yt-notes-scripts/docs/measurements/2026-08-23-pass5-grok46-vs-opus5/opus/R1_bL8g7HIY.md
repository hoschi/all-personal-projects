---
tags:
  - youtube
aliases:
  - "OpenAI AgentKit: No-Code-Plattform für Multi-Agent-Workflows"
channelName: WorldofAI
publish_date: 2025-10-07
display_title: "OpenAI AgentKit: No-Code-Plattform für Multi-Agent-Workflows"
description: OpenAI stellt AgentKit vor — eine kostenlose No-Code-Plattform zum
  Erstellen, Deployen und Optimieren von KI-Agenten, bestehend aus Agent Builder
  (visueller Canvas), Connector Registry und ChatKit. Gezeigt werden das Anlegen
  von Multi-Agenten-Workflows per Drag-and-Drop mit Nodes für GPT-Modelle, Web
  Search, File Search, MCPs, Guardrails und Datenbankabfragen sowie ein
  Vergleich mit n8n hinsichtlich Flexibilität und Modellauswahl. Relevant für
  Entwickler und Nicht-Entwickler, die KI-Automatisierungen ohne Code
  prototypisieren oder agentenbasierte Chat-UIs in eigene Produkte einbetten
  wollen.
youtube_id: R1_bL8g7HIY
---

# OpenAI NEW Agent Builder: Easily Create AI Agents That Can Automate Anything! n8n Killer? (Agentkit)

## Worum es geht

OpenAIs neues **Agent Kit** wird vorgestellt — eine No-Code-Plattform zum Bauen, Deployen und Optimieren von KI-Agenten innerhalb des OpenAI-Ökosystems. Das Video erklärt die Komponenten, zeigt zwei Demo-Workflows und vergleicht Agent Kit am Ende mit n8n.

---

## Notizen

[URL](https://youtu.be/R1_bL8g7HIY?si=8nnZQU19uq9jm2bh)

Interessant ist tatsächlich, dass man den Code für seinen No-Code-Workflow bekommen kann, um daran dann eine erweiterte Version zu bauen, nehme ich an. Ansonsten sind die gezeigten Beispiele extrem einfach und bieten keine wirkliche Evaluierungsmöglichkeit für das Werkzeug. Ich teile die Meinung vom Video, dass aktuell n8N wesentlich mächtiger ist, wie die Lösung von OpenAI. So die größere Integration von Third-Party-Tools, Möglichkeiten den Workflow zu steuern und auch Möglichkeiten der Datenbearbeitung generell. Also quasi jeden Aspekt des Tools. Außerdem hat man, wie er auch sagt, die Möglichkeit unterschiedliche Modelle zu benutzen, was Optimierungen für die verschiedensten Anwendungsszenarien bietet, ob es nun Kosten oder Performance sind. Es gibt aber keine kostenlose Version von N8N. Hier macht es tatsächlich Sinn, wenn man mit dieser Art von Werkzeug arbeiten möchte, erstmal die kostenlose Version von OpenAI zu benutzen, um zu sehen, wie weit man mit seinen Kenntnissen kommt bzw. was diese Art von Tools für Möglichkeiten bieten.

---

## Besprochene Konzepte

- Agent Kit — End-to-End-No-Code-Plattform von OpenAI zum Bauen/Deployen/Optimieren von Agenten
- Agent Builder — visueller Drag-and-Drop-Canvas zum Entwerfen und Testen von Multi-Agent-Workflows mit Live-Preview
- Connector Registry — zentrale Verwaltung von Datenquellen, APIs und Tools über OpenAI-Produkte hinweg
- ChatKit — anpassbares Chat-Toolkit, um agentische UIs direkt in Produkte/Websites einzubetten
- Nodes als Bausteine — Agent-, Start-, End-, Document-, File-Search-, Guardrail-, MCP-, Logik- (If-Else, Loop, User-Approval) und Daten-Nodes (Reshape, Set State)
- [[MCP]] — Model Context Protocol als Node-Typ zum Anbinden externer Tools
- Guardrails — built-in Schutzregeln, z. B. Moderation von Nutzereingaben vor Ausführung
- Evaluation / Traces — Logs und Test-Traces zur Bewertung der Agent-Performance
- No-Code-Automatisierung — Verschmelzung von AI-Engineering und No-Code, vergleichbar mit Zapier aber mit nativer GPT-Integration

## Behauptungen

- Agent Kit ist OpenAIs Antwort auf Tools wie n8n, Vector Shift und LangGraph, nativ im OpenAI-Ökosystem
- Agent Kit ist aktuell vollständig kostenlos zugänglich
- Mit Agent Kit lassen sich production-ready KI-Agenten ohne Coding visuell erstellen
- Es gibt fertige Templates (z. B. Document Comparison, Internal Knowledge Assistant, Data Enrichment)
- HubSpot hat Agent Kits Custom-Response-Widget in seinen AI-Assistenten integriert, um die Wissensdatenbank in Echtzeit zu durchsuchen
- Die Modellauswahl ist auf das OpenAI-Ökosystem beschränkt — andere Modelle wie Gemini oder Claude sind nicht nutzbar, was der Sprecher als einschränkend bezeichnet
- Die „More"-Optionen am Agent-Node sollte man nicht sofort verändern, wenn man nicht weiß, was man tut
- Im Datenbank-Demo wurden ca. 82.000 Bestellungen aus Dummy-Daten ermittelt
- Nach der Konfiguration kann man den Agenten publishen oder per Code (ChatKit / Agent SDK) in einer Produktionsumgebung nutzen
- Laut Sprecher ist Agent Kit aktuell **nicht** überlegen gegenüber n8n
- Der Sprecher bevorzugt n8n, weil es einfacher zu bedienen ist, mehr Nodes, mehr Anpassbarkeit, mehr Modell-Flexibilität und einen leichteren Weg von Prototyp zu Produktion bietet
- n8n sei besser für Multi-Provider und hoch-anpassbare Workflows; Agent Kit eignet sich, um heute kostenlos in der Cloud mit einfachen Automatisierungen zu starten
- Der Sprecher vermutet, dass Agent Kit künftig weiterentwickelt wird und n8n möglicherweise irgendwann ebenbürtig sein könnte

## Demos / Schritte

1. Auf der OpenAI-Plattform den Bereich „Agent Builder" öffnen und einen Workflow von Grund auf neu erstellen (oder ein Template wählen)
2. Im Canvas Nodes per Drag-and-Drop platzieren; den Agent-Node mit Name, Instruktion, Modellwahl, Reasoning-Effort und Tools konfigurieren
3. **Demo 1 (Unternehmens-Recherche):** User-Inquiry → Web-Research-Agent (Websuche nach Firmeninfos) → zweiter Agent (GPT-5) fasst Ergebnisse im definierten Output-Format zusammen
4. Über „Preview" testen (Beispiel-Prompt „analyze Nvidia the stock") — Ausgabe: Firmenname, Branche (Halbleiter/Technologie), HQ Santa Clara, Größe, Website, Gründungsjahr, Beschreibung
5. Über „Evaluation" Logs und Traces prüfen; Workflow duplizieren, Code (ChatKit / Agent SDK) abrufen, Domain hinzufügen und publishen
6. **Demo 2 (Datenbank-Abfrage):** Agent fragt eine Datenbank ab, mit Guardrail-Moderation der Eingabe; Beispiel-Prompt „how many orders did you sell in 2015" → Select-Agent liefert nach Guardrail-Check das Ergebnis (~82k Bestellungen)

## Genannte Tools

- n8n — Workflow-Automatisierungsplattform, dient als Hauptvergleichsmaßstab
- Vector Shift — als vergleichbares agentisches No-Code-Tool genannt
- LangGraph — als vergleichbares Agenten-Framework genannt
- Zapier — als Vergleich für No-Code-Automatisierung herangezogen
- [[MCP]] — Model Context Protocol als verfügbarer Node-/Tool-Typ
- OpenAI Agent SDK — Code-Zugriff auf den gebauten Agenten
- ChatKit — Toolkit zum Einbetten der Agenten-UI, ebenfalls als Code abrufbar
- HubSpot — Beispiel-Integrator von Agent Kits Custom-Response-Widget
- GPT-5 — im Demo-Workflow genutztes Modell
- Gemini / Claude — als (nicht nutzbare) Drittanbieter-Modelle erwähnt

## Verwandt

- [[Did ChatGPT Just Kill Zapier]] — fasst denselben OpenAI-Dev-Day-AgentKit-Launch zusammen und vergleicht ihn mit Zapier
- [[Kestra Easily Create AI Agents That Can Automate Anything! Opensource n8n Alternative!]] — Open-Source-Alternative im selben Workflow-Automatisierungs-/Agenten-Umfeld wie n8n
