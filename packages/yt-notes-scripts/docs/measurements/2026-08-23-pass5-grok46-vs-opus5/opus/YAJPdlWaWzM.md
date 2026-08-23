---
tags:
  - youtube
aliases:
  - "OpenAI Apps SDK, AgentKit und Codex: Plattform-Umbau im Überblick"
channelName: AI Revolution
publish_date: 2025-10-08
display_title: "OpenAI Apps SDK, AgentKit und Codex: Plattform-Umbau im Überblick"
description: OpenAI stellt mehrere neue Produkte vor, die ChatGPT von einem
  Chatbot zu einer offenen Plattform erweitern. Konkret gezeigt werden das Apps
  SDK (mit Integrationen wie Spotify, Canva, Figma über das Model Context
  Protocol), AgentKit (visueller Builder für autonome Multi-Agenten-Workflows),
  Codex (GPT-4-feingetunte Coding-KI mit Slack-Integration und CI/CD-Anbindung)
  sowie Milliarden-Dollar-Chip-Deals mit AMD und Nvidia. Relevant für Entwickler
  und Entscheider, die KI-Agenten in Enterprise-Workflows oder eigene Produkte
  integrieren wollen, sowie für alle, die OpenAIs strategische
  Plattformstrategie (Ökosystem-Lock-in, Agentic Commerce) einschätzen müssen.
youtube_id: YAJPdlWaWzM
---

# OpenAI Just Dropped ChatGPT Apps SDK: Massive Upgrade!

## Worum es geht

Überblick über die OpenAI-Ankündigungen rund um den Dev Day: ChatGPT wandelt sich von einem Produkt zu einer Plattform aus Apps, autonomen Agenten, Codex, Hardware-Compute-Deals und einem geplanten KI-Gerät. Der Sprecher argumentiert, OpenAI baue damit eine zusammenhängende KI-Infrastruktur statt einzelner Features.

---

## Notizen

[URL](https://youtu.be/YAJPdlWaWzM?si=0iPLuzClwdd2hBQ1)

Puh, okay. Dann kommt, was man befürchtet hat, ja doch schneller, als man denkt. Wenn in den Conversation-Apps, die mit LLMs laufen, jetzt auch direkt das gekauft werden kann, muss man ja gar nicht mehr auf Seiten wie Shops oder sowas gehen. Dann funktioniert das rein mit API-Anbindung ohne eine extra UI für den Shop. Das wird noch interessant. Jetzt ist ja schon das Problem, dass die Werbeindustrie Angst hat, dass Leute nicht mehr auf Internetseiten gehen, da sie nur noch die Zusammenfassung im Chatbot lesen und so keine Werbung ausgespielt wird. Das Building Tool für Agenten sieht für mich nur wie ein einfaches n8n aus und integriert aber eben die Tools, die vorher angesprochen wurden und die KI von OpenAI. Das müsste man sich sonst genauer angucken, ob hier wirklich ein Mehrwert existiert zu bestehenden Lösungen. Agenten können aktuell auf verschiedenste Weise zusammengebaut werden, insbesondere wenn sie einfach sind. Bei komplexen Agenten ist eine Low-Code-Lösung eh schwierig zu maintainen. Okay, die beiden Deals mit den Grafikkartenherstellern sind massiv. Da kann man nichts anderes sagen.

---

## Besprochene Konzepte

- Apps SDK / App-Ökosystem — interaktive Apps leben direkt in ChatGPT und werden per natürlicher Sprache aufgerufen
- [Model Context Protocol](obsidian://open?vault=knowledge-base&file=claude-code-mcp-setup) — technische Grundlage, auf der das Apps SDK aufsetzt
- Agentic Commerce Protocol — ermöglicht Instant-Checkout und Monetarisierung direkt im Chat
- Super-App-Ära — die Idee, Nutzer für alles (Buchen, Gestalten, Kaufen, Lernen) in ChatGPT zu halten
- Agent Kit — Drag-and-Drop-System zum Bauen autonomer Agenten, die planen, Daten holen und handeln
- Evals — Toolkit zum Messen, Testen und Vergleichen der Agenten-Genauigkeit vor dem Produktivlauf
- Drei-Schichten-Architektur — Apps als User-Layer, Agent Kit als Reasoning-Layer, Codex als Engineering-Layer
- Dual-Supplier-Compute-Strategie — Bezug von Rechenleistung sowohl von AMD als auch Nvidia zur Absicherung
- Bildschirmloses, ambientes KI-Begleitgerät — ein gerätehaftes „Presence"-Konzept statt klassischer Gadgets

## Behauptungen

- OpenAI sei von Produkt zu Plattform und von Plattform zu „Power" geworden
- Das Apps SDK ist auf dem Model Context Protocol aufgebaut
- Launch-Partner sind u.a. Booking.com, Canva, Coursera, Expedia, Figma, Spotify und Zillow
- Apps fragen beim ersten Gebrauch transparent nach Datenfreigabe und benötigten Daten
- Einreichungen, Reviews, ein offizielles App-Directory und Monetarisierung über das Agentic Commerce Protocol kommen später im Jahr
- Sichtbarkeit hänge künftig nicht mehr vom App-Store-Ranking ab, sondern von der Relevanz der App zum Gespräch
- Agent Kit umfasst Agent Builder (visuelle Canvas), Connector Registry, ChatKit und Evals
- Evals erlaube Datensatz-Grading, Trace-Grading, automatische Prompt-Optimierung und Tests von Drittanbieter-Modellen
- OpenAIs Bewertung habe kurz vor diesen Ankündigungen 500 Milliarden Dollar erreicht
- Codex ist nun offiziell verfügbar mit Slack-Integration, SDK und Admin-Dashboard
- Codex sei auf GPT-4o Codex aufgebaut, auf Geschwindigkeit, Präzision und strukturierten Output feinabgestimmt
- Codex lasse sich per GitHub Actions in CI/CD-Pipelines einbinden und könne Code reviewen, Fixes vorschlagen und Updates pushen
- Intern bei OpenAI seien die wöchentlichen Code-Merges um etwa 70 % gestiegen und fast jeder Pull Request werde automatisch reviewt
- Cisco habe die Code-Review-Zeiten halbiert; Instacart nutze Codex zum Aufräumen von totem Code
- Der AMD-Deal gebe OpenAI die Option, bis zu 10 % von AMD zu kaufen, und sichere sechs Gigawatt Compute über AMDs kommende MI450-Chips
- AMD erwarte aus dem Deal und Folgeverträgen über 100 Milliarden Dollar Neuumsatz in vier Jahren
- Nvidia habe zuvor eine eigene 100-Milliarden-Dollar-Partnerschaft mit OpenAI für 10 Gigawatt Compute angekündigt
- Sam Altman habe Compute als die größte Wachstumsbeschränkung bezeichnet, die er nun durch Sicherung der globalen Chip-Versorgung beseitige
- OpenAI arbeite mit Jony Ive an einem handflächengroßen, bildschirmlosen KI-Gerät, das hört, sieht und spricht — ohne Trigger-Wörter wie „Hey Siri"
- Das Gerät stehe vor Compute-Herausforderungen und Verzögerungen, da Millionen always-on-Geräte die ohnehin angespannte ChatGPT-Last erhöhen
- Sam Altman ziele laut Quellen darauf, 100 Millionen Einheiten auszuliefern, gestützt auf ChatGPTs 700 Millionen wöchentliche Nutzer
- Der Sprecher vermutet, das Gerät könne neu definieren, wie KI-Hardware aussieht — weniger wie ein Telefon, mehr wie ein ambienter Assistent
- Der Rollout starte außerhalb der EU über Free-, Plus- und Pro-Tiers, mit Business-, Enterprise- und Education-Versionen danach; 11 weitere Partner-Apps seien unterwegs
- ChatGPT sei kein Chatbot mehr, sondern Infrastruktur

## Genannte Tools

- ChatGPT — zentrale Plattform, in der Apps und Agenten leben
- Apps SDK — Framework zum Bauen interaktiver Apps innerhalb von ChatGPT
- Agent Kit (Agent Builder, Connector Registry, ChatKit, Evals) — Baukasten für autonome KI-Agenten
- Codex (GPT-4o Codex) — KI-Coding-Agent mit Slack-Integration, SDK und Admin-Dashboard
- Agentic Commerce Protocol — Protokoll für Instant-Checkout im Chat
- GitHub Actions — CI/CD-Anbindung für Codex
- Slack — Integrationskanal, um Codex per @Codex zu taggen
- Booking.com, Canva, Coursera, Expedia, Figma, Spotify, Zillow — erste ChatGPT-App-Partner
- Dropbox, Google Drive, SharePoint, Microsoft Teams — über Connector Registry angebundene Datenquellen
- AMD (MI450-Chips) — Compute-Lieferant und Beteiligungsoption
- Nvidia — zweiter Compute-Lieferant
- Cisco, Instacart, Duolingo, Vanta, Rocket — Unternehmen, die Codex einsetzen

## Verwandt

- [[Did ChatGPT Just Kill Zapier]] — Matt Wolfes Zusammenfassung desselben OpenAI Dev Day mit Apps in ChatGPT und AgentKit
- [[OpenAI NEW Agent Builder Easily Create AI Agents That Can Automate Anything! n8n Killer (Agentkit)]] — vertieft das im Video erwähnte Agent Kit / Agent Builder
- [[NEW MCP Toolkit Is Insane! Ultimate MCP Setup For AI Coding Assistants Will 10x Your Productivity!]] — zum Model Context Protocol, auf dem das Apps SDK aufsetzt
- [[The Greatest AI Coding System I've Ever Used, Forget Codex Vs Claude Code]] — Einordnung von Codex im Vergleich zu anderen KI-Coding-Systemen
