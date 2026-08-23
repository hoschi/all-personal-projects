---
tags:
  - youtube
aliases:
  - "Docker MCP Catalog: MCP-Server per Klick installieren und in Agenten
    einbinden"
channelName: Cole Medin
publish_date: 2025-10-09
display_title: "Docker MCP Catalog: MCP-Server per Klick installieren und in
  Agenten einbinden"
description: Das Video zeigt, wie der Docker MCP Catalog genutzt wird, um
  MCP-Server per Einzel-Klick zu installieren und in KI-Clients einzubinden.
  Konkret werden YouTube Transcripts, Slack, GitHub und Obsidian als
  Docker-Container-MCPs über Claude Desktop verbunden und in einem
  End-to-End-Workflow kombiniert; abschließend wird das Docker MCP Gateway (Open
  Source) genutzt, um dieselben Server auch in eigenen Agenten (n8n,
  LiveKit/Python) per HTTP Streamable Transport anzusprechen. Relevant für
  Entwickler und KI-Power-User, die mehrere MCP-Server ohne manuelle
  JSON-Konfiguration verwalten und in beliebige Agenten-Umgebungen integrieren
  wollen.
youtube_id: TxlVdB2gmGE
---

# Docker Just Made Using MCP Servers 100x Easier (One Click Installs!)

## Worum es geht

Cole Medin stellt den Docker MCP Catalog vor — eine kuratierte Liste von MCP-Servern, die sich per Klick aus Docker Desktop heraus mit KI-Clients wie Claude Desktop, Claude Code oder eigenen Agenten verbinden lassen. Er baut damit einen End-to-End-Workflow von der Recherche bis zur automatisch erstellten Pull Request.

---

## Notizen

[URL](https://youtu.be/TxlVdB2gmGE?si=GBRNzPC1XF_ItnqJ)

Die Idee ist sehr cool, weil es tatsächlich anstrengend ist, die MCP-Server einzurichten. Gerade auch so einfache wie Context7 funktionieren dann stellenweise auch einfach nicht mehr. Der MCP-Server wird zwar als grün angezeigt, aber sobald die KI versucht, ihn zu benutzen, kommt ein Fehler. Sehr frustrierend. Was das Hauptproblem an der Lösung aber tatsächlich ist, dass man Docker Desktop braucht. Wenn man zum Beispiel einen anderen Docker-Client wie OrbStack benutzt, hat man hier schon mal Probleme. Super hingegen ist, dass die Clients wie Gemini CLI, RooCode oder andere direkt geupdatet werden, wenn man neue Server installiert. Auch, dass die Server nach Benutzung wieder runtergefahren werden und keinen RAM benötigen, wenn sie nicht genutzt werden, finde ich sehr gut. Insgesamt ist das eine sehr tolle Lösung für technisch nicht affine Personen, da Docker Desktop sehr einfach zu installieren ist. Schön ist, dass man das Gateway auch an andere Dinge andocken kann, wie gezeigt. Bei eigenen Agenten ist es vielleicht sinnvoller, dediziert die wirklich benötigten Server mit dem Agenten zu bündeln. Muss man sich an der Stelle bestimmt überlegen.

---

## Besprochene Konzepte

- MCP-Server (Model Context Protocol) — geben KI-Agenten Zugriff auf externe Funktionalität wie Transkripte, Slack, GitHub oder Datenbanken; Setup-Details unter [MCP-Server in Claude Code einrichten](obsidian://open?vault=knowledge-base&file=claude-code-mcp-setup)
- Docker MCP Catalog — nach Popularität sortierte, kuratierte Liste von MCP-Servern, per Ein-Klick verbindbar statt manueller JSON-Konfiguration
- Docker MCP Gateway — die Open-Source-Tooling unter der Haube, die die Katalog-Server an die Clients anbindet und selbst gehostet werden kann
- Ephemeres Container-Modell — jeder Tool-Aufruf startet kurz einen Docker-Container, der nach Abschluss sofort wieder runtergefahren wird
- Aggregierter Single-Server (`mcp_docker`) — der Client sieht nur einen Server, der die Tools aller ausgewählten MCPs bündelt
- Agentischer Multi-Server-Workflow — mehrere MCP-Server in einem einzigen größeren Task kombinieren (Recherche → Notiz → Issue → Coding-Agent)
- RAG — als Einsatzzweck mehrerer Server genannt (Context7, Docling); [[Was ist Retrieval Augmented Generation]]
- Hybrid Chunking — als Feature von Docling im generierten Summary hervorgehoben

## Behauptungen

- Den kompletten Workflow (Claude Desktop mit YouTube, Obsidian, Slack, GitHub) hat er in nur 10 Minuten aufgesetzt ([00:00](https://www.youtube.com/watch?v=TxlVdB2gmGE&t=0s))
- Mit dem Docker MCP Catalog ist das Finden und Verbinden von MCP-Servern „100-mal einfacher" als über die GitHub-Registry mit manueller JSON-Konfiguration ([00:00](https://www.youtube.com/watch?v=TxlVdB2gmGE&t=0s))
- Voraussetzung für den Katalog ist nur die Installation von Docker Desktop ([02:06](https://www.youtube.com/watch?v=TxlVdB2gmGE&t=126s))
- Fetch ist der populärste Server mit über 500.000 Downloads ([03:00](https://www.youtube.com/watch?v=TxlVdB2gmGE&t=180s))
- Die MCP Toolkit ist in Beta und muss ggf. in den Docker-Settings unter Beta Features aktiviert werden ([04:26](https://www.youtube.com/watch?v=TxlVdB2gmGE&t=266s))
- Gordon ist der in Docker Desktop eingebaute KI-Agent und dient zum schnellen Testen der MCP-Server ([04:26](https://www.youtube.com/watch?v=TxlVdB2gmGE&t=266s))
- Alle Tools laufen als Docker-Container, die nur während des Tool-Aufrufs hochgefahren werden — dadurch „extrem effizient und sicher" ([04:26](https://www.youtube.com/watch?v=TxlVdB2gmGE&t=266s))
- Claude Desktop liefert deutlich bessere Ergebnisse als Gordon, weil ein leistungsstärkeres LLM darunter läuft ([04:26](https://www.youtube.com/watch?v=TxlVdB2gmGE&t=266s))
- Laut Sprecher ist Gordon vermutlich von etwas wie Gemini 2.5 Flash oder GPT-5 Nano angetrieben und wird mit vielen Tools überfordert ([08:56](https://www.youtube.com/watch?v=TxlVdB2gmGE&t=536s))
- Der offizielle GitHub-Server funktionierte bei ihm nicht; er nutzte stattdessen den archivierten, der „phänomenal" lief ([08:56](https://www.youtube.com/watch?v=TxlVdB2gmGE&t=536s))
- Für Obsidian braucht man das Community-Plugin „Local REST API", dessen API-Key in die MCP-Konfiguration kommt ([08:56](https://www.youtube.com/watch?v=TxlVdB2gmGE&t=536s))
- Sonnet 4.5 konnte sich nach einem fehlgeschlagenen Issue-Erstellungs-Tool-Call selbst korrigieren und den Aufruf erfolgreich wiederholen ([14:19](https://www.youtube.com/watch?v=TxlVdB2gmGE&t=859s))
- Der komplette agentische Workflow lief „flawlessly" durch und mündete in einer von Claude Code erstellten Pull Request ([14:19](https://www.youtube.com/watch?v=TxlVdB2gmGE&t=859s))
- HTTP Streamable ist das De-facto-Standardprotokoll für MCP ([16:49](https://www.youtube.com/watch?v=TxlVdB2gmGE&t=1009s))
- Der MCP Gateway ist Open Source und Dockers „enterprise-ready" Lösung zum Orchestrieren von MCP-Servern ([16:49](https://www.youtube.com/watch?v=TxlVdB2gmGE&t=1009s))
- Er betreibt den Gateway lokal auf Port 8089 mit Streaming-Transport ([16:49](https://www.youtube.com/watch?v=TxlVdB2gmGE&t=1009s))
- In n8n läuft die Anbindung über `host.docker.internal`, weil der n8n-Container auf den Host zugreifen muss ([19:59](https://www.youtube.com/watch?v=TxlVdB2gmGE&t=1199s))
- Der Slack-Tool-Aufruf über den Gateway dauerte laut Logs insgesamt 1,5 Sekunden ([19:59](https://www.youtube.com/watch?v=TxlVdB2gmGE&t=1199s))
- Docker hat bei dem Video mit ihm zusammengearbeitet ([22:35](https://www.youtube.com/watch?v=TxlVdB2gmGE&t=1355s))

## Demos / Schritte

1. Docker Desktop installieren und MCP Toolkit (Beta) aktivieren
2. Im Katalog YouTube Transcripts auswählen und per „Add MCP Server" verbinden, ggf. API-Keys konfigurieren
3. Server zunächst direkt in Docker Desktop über den eingebauten Agenten Gordon testen (Video transkribieren + Summary)
4. Im Clients-Tab Claude Desktop per Klick verbinden, Claude Desktop neu starten und unter „Search and tools" den Server `mcp_docker` verifizieren
5. Weitere Server hinzufügen: Slack (Team-/Channel-IDs + Bot-Token), GitHub (Personal Access Token), Obsidian (Local-REST-API-Key)
6. Vollen Workflow in Claude Desktop auslösen: Docling-Transkript holen → Summary in Obsidian-Reference-Notes-Ordner → Slack-Research-Channel lesen → GitHub-Issue für Archon erstellen → Kommentar `@claudefix work on this issue` zum Auslösen von Claude Code
7. Für eigene Agenten den MCP Gateway aus dem Source bauen und mit `docker mcp gateway` auf Port 8089 (HTTP Streamable) starten
8. In n8n einen AI-Agent mit MCP-Client (`host.docker.internal:8089`, HTTP streamable) verbinden und z. B. Slack-Channels abfragen
9. Denselben Gateway-URL in einem LiveKit-Voice-Agent als `mcp_servers`-Parameter einbinden und per Sprache GitHub-Repos abfragen

## Genannte Tools

- [Docling](obsidian://open?vault=knowledge-base&file=docling-dokumentenextraktion) — Open-Source-Python-Tool zur Datenextraktion und zum Chunking für RAG (Demo-Video-Thema)
- Docker Desktop / MCP Toolkit — Plattform zum Verwalten der MCP-Server samt Katalog
- Docker MCP Gateway — Open-Source-Orchestrierung zum Anbinden eigener Agenten
- Gordon — in Docker Desktop eingebauter KI-Agent zum Testen der Server
- Claude Desktop — Client zum Brainstormen und Ausführen des Multi-Server-Workflows
- Claude Code — autonomer Coding-Agent, der per Issue-Kommentar getriggert wird
- Slack-MCP — Lesen von Channel-Konversationen als Kontext
- GitHub-MCP — Repos durchsuchen, Issues erstellen und kommentieren
- Obsidian-MCP (via Local REST API) — Notizen/Zusammenfassungen im Vault ablegen
- YouTube Transcripts MCP — Transkripte aus Video-URLs ziehen
- Fetch — URL-Inhalte extrahieren
- Context7 — RAG-Server
- weitere Katalog-Server: Playwright, Notion, Brave, Firecrawl, Discord, Stripe, Chroma DB
- n8n — Low-Code-Plattform für den eigenen AI-Agent mit MCP-Client
- LiveKit — Framework für Voice-Agenten, ebenfalls über den Gateway angebunden
- Archon — Repository, in das das Docling-Integrations-Issue erstellt wird
- Sonnet 4.5, GPT-4.1 mini, Gemini CLI, Cursor — weitere genannte Modelle/Clients

## Verwandt

- [[NEW MCP Toolkit Is Insane! Ultimate MCP Setup For AI Coding Assistants Will 10x Your Productivity!]] — anderes Video zum selben Docker MCP Toolkit / One-Click-Setup
- [[How We Build Effective Agents Barry Zhang, Anthropic]] — Grundlagen zum Bau effektiver Agenten, die solche MCP-Workflows nutzen
- [[Code 100x Faster with AI, Here's How (No Hype, FULL Process)]] — KI-gestützter Dev-Workflow inkl. eigenem MCP-Server-Beispiel
- [Autonome Entwicklung mit Superpowers-Subagents](obsidian://open?vault=knowledge-base&file=autonome-entwicklung-mit-superpowers) — autonome Coding-Agenten wie das per Issue getriggerte Claude Code
- [[3 ways to make money with n8n AI Automations in 2025 (while it's still easy)]] — n8n als Plattform für eigene AI-Automations-Agenten
