## Worum es geht
Cole Medin zeigt den Docker MCP Catalog: eine kuratierte Liste von MCP-Servern in Docker Desktop, die sich per Klick mit Claude Desktop, Claude Code und eigenen Agenten verbinden lassen. Er führt einen Workflow von YouTube-Transkript über Obsidian und Slack bis zum GitHub-Issue vor und bindet dieselben Server über die Docker MCP Gateway an n8n und einen LiveKit-Voice-Agenten.
## Besprochene Konzepte
- Docker MCP Catalog — kuratierte Liste von MCP-Servern mit Ein-Klick-Anbindung an Clients
- MCP-Server — externe Tool-Server für KI-Agenten; klassisch über GitHub-Registry plus manuelles JSON
- MCP Toolkit (Beta) — Docker-Desktop-Funktion zum Verwalten und Verbinden der Catalog-Server
- Ask Gordon — in Docker Desktop eingebauter KI-Agent, standardmäßig am MCP Toolkit
- `mcp_docker` — ein aggregierter MCP-Server im Client, der die Tools aller gewählten Catalog-Server bündelt
- On-Demand-Container — jeder Tool-Call startet einen Docker-Container und fährt ihn danach wieder herunter
- Docker MCP Gateway — Open-Source-Schicht, mit der Catalog-Server auch außerhalb der vorgefertigten Client-Liste laufen
- HTTP streamable — laut Sprecher das De-facto-Standardprotokoll für MCP
- Agentic Multi-Server-Workflow — ein Prompt steuert mehrere MCP-Server nacheinander auf ein Ziel
- `@claudefix`-Issue-Kommentar — Auslöser, damit Claude Code ein GitHub-Issue autonom abarbeitet
## Behauptungen
- Der gezeigte End-to-End-Workflow (YouTube-Transkript → Obsidian-Zusammenfassung → Slack-Kontext → GitHub-Issue → Claude-Code-Agent) war in 10 Minuten mit MCP-Servern eingerichtet. (0:00)
- In der klassischen GitHub-Registry muss man pro MCP-Server die JSON-Konfiguration selbst heraussuchen und eintragen. (0:00)
- Der Docker MCP Catalog macht Finden und Verbinden von MCP-Servern laut Sprecher „100 times easier“. (0:00)
- Ein Klick verbindet gewählte Server mit Claude Code oder Claude Desktop. (0:00)
- Für den Catalog reicht die Installation von Docker Desktop. (2:06)
- Claude Code, Claude Desktop und Gemini CLI bekommen die Konfiguration automatisch, ohne eigenes JSON. (3:00)
- Fetch steht nach Popularität oben und hat über 500.000 Downloads; der Server zieht Inhalte aus einer URL. (3:00)
- Das MCP Toolkit ist in Beta; fehlt es, muss man es unter Docker-Einstellungen → Beta Features aktivieren. (4:26)
- Ask Gordon ist als einziger Client von Anfang an mit dem MCP Toolkit verbunden. (4:26)
- Gordon und das MCP Toolkit sind beide in Beta. (4:26)
- Die MCP-Tools laufen als Docker-Container: Start beim Tool-Call, Shutdown danach, kein Dauerbetrieb im Speicher. (4:26)
- Laut Sprecher ist das effizient und sicher. (4:26)
- Claude Desktop arbeitet laut Sprecher spürbar besser als Gordon, weil ein stärkeres LLM dahintersteckt. (4:26)
- Der offizielle GitHub-MCP hat beim Sprecher nicht funktioniert; die archivierte Variante schon. (8:56)
- Slack-MCP braucht Team-ID, Channel-IDs, eine Slack-App und einen Bot-Token. (8:56)
- GitHub-MCP braucht ein Personal Access Token. (8:56)
- Obsidian-MCP braucht das Community-Plugin Local REST API und dessen API-Key. (8:56)
- Mit vier Servern (GitHub, Obsidian, Slack, YouTube Transcripts) liefert GitHub allein 26 Tools. (8:56)
- Der Sprecher vermutet, Gordon laufe auf etwas wie Gemini 2.5 Flash oder GPT-5 Nano und überfordere sich bei mehr als ein paar Tools. (8:56)
- Gordon sei eher auf Docker-Themen feinabgestimmt. (8:56)
- Der Slack-Bot hatte nur Zugriff auf den Channel „research“. (11:19)
- Der Sprecher hat 50 GitHub-Repos. (11:19)
- Der kombinierte Workflow mit Sonnet 4.5 hat Transkript, Obsidian-Notiz, Slack-History, GitHub-Issue und `@claudefix`-Kommentar durchgezogen. (14:19)
- Der erste GitHub-Issue-Call schlug fehl; Sonnet 4.5 korrigierte sich und legte das Issue an. (14:19)
- Claude Code arbeitete das Issue in einem Feature-Branch ab und erstellte einen Pull Request. (14:19)
- Die MCP Gateway ist Dockers Open-Source-Lösung zum Orchestrieren und Verwalten von MCP-Servern. (16:49)
- HTTP streamable ist laut Sprecher das De-facto-Standardprotokoll für MCP. (16:49)
- Die lokal gestartete Gateway auf Port 8089 mit Streaming-Transport bedient dieselben im Catalog verbundenen Server. (16:49)
- Der n8n-MCP-Client spricht `host.docker.internal:8089` mit HTTP streamable an; lokal ohne Authentifizierung. (19:59)
- `Slack list channels` über n8n dauerte 1,5 Sekunden. (19:59)
- Der LiveKit-Voice-Agent mit derselben Gateway-URL nannte Archon als Repo mit den meisten Stars unter Colium0000. (21:22)
- Docker hat am Video mitgearbeitet. (22:35)
- Der Catalog sei der einfachste Weg, externe Funktionen in AI-Agenten zu bringen. (22:35)
## Demos / Schritte
1. Docker Desktop nutzen; MCP-Catalog öffnen (hier nach Popularität sortiert).
2. YouTube Transcripts per „Add MCP Server“ hinzufügen; Konfiguration und API-Keys im Catalog setzen; MCP Toolkit unter Beta Features prüfen.
3. Im Clients-Tab Ask Gordon / Toolbox: Toolkit für Gordon aktivieren.
4. Docling-Video-URL kopieren; Gordon: Transkript holen und knappe Zusammenfassung (Tool `get transcript`).
5. Claude Desktop im Clients-Tab verbinden; App beenden und neu starten.
6. Unter Search and tools den Server `mcp_docker` öffnen und die aggregierten Tools prüfen.
7. Dieselbe Transkript-Anfrage in Claude Desktop (Call über `mcp_docker`).
8. Slack hinzufügen (Team-ID, Channel-IDs, Bot-Token; App-Setup off-camera).
9. GitHub: archivierte Variante statt des offiziellen Servers; Personal Access Token eintragen.
10. Obsidian hinzufügen: Community-Plugin Local REST API installieren, API-Key in die MCP-Konfiguration übernehmen.
11. Claude Desktop neu starten; Slack-Channels listen (Ergebnis: „research“); GitHub-Repos listen (50 Repos).
12. Ein Prompt an Claude Desktop (Sonnet 4.5): Docling-Transkript holen, Zusammenfassung nach `reference notes` in Obsidian, Slack-Channel „research“ lesen, Issue in Archon anlegen, Kommentar `@claudefix work on this issue`.
13. Ablauf prüfen: Transkript → Obsidian-Notiz „Docling YouTube tutorial summary“ → Slack-History → Issue „Integrate Docling for advanced document processing in the RAG pipeline“ (zweiter Versuch) → Claude Code erstellt den Pull Request.
14. MCP Gateway aus dem Open-Source-Repo bauen; auf Port 8089 mit Streaming-Transport starten; Catalog-Registry wird übernommen.
15. n8n-Agent: Chat-Trigger, GPT-4.1 mini, MCP-Client auf `host.docker.internal:8089`, HTTP streamable; Frage nach Slack-Channels; Gateway-Logs prüfen.
16. LiveKit-Voice-Agent mit derselben Gateway-URL; mündliche Suche nach dem GitHub-Repo mit den meisten Stars unter Colium0000 (Antwort: Archon).
## Genannte Tools
- Docker Desktop — Laufzeit und UI für Catalog, MCP Toolkit und Gordon
- Docker MCP Catalog — kuratierte Ein-Klick-Liste der MCP-Server
- Docker MCP Gateway — Open-Source-Orchestrierung derselben Catalog-Server für eigene Agenten
- MCP Toolkit — Beta-Funktion in Docker Desktop zum Verwalten der Server
- Ask Gordon — eingebauter Docker-Desktop-Agent zum schnellen Testen
- Claude Desktop — MCP-Client für den Multi-Server-Workflow
- [claude-code-overview](obsidian://open?vault=knowledge-base&file=claude-code-overview) — Coding-Agent, per Catalog verbindbar und per `@claudefix` aus einem Issue gestartet
- Gemini CLI — weiterer vorgefertigter Catalog-Client
- [[Cursor]] — vom Sprecher als Coding-Client genannt, den man mit Catalog-Servern ausstatten kann
- Slack — MCP-Server für Channels und Verlauf (Bot-Token, Team-ID, Channel-IDs)
- GitHub — MCP-Server für Repos und Issues; Sprecher nutzt die archivierte Variante plus Personal Access Token
- [[Obsidian]] — Notizen und Vault; Anbindung über Local REST API und API-Key
- Local REST API — Obsidian-Community-Plugin als HTTP-Schnittstelle für den MCP-Server
- YouTube Transcripts — Catalog-MCP zum Holen von Video-Transkripten (`get transcript`)
- Fetch — Catalog-MCP, URL-Inhalte extrahieren
- [playwright-cli-vs-chrome-devtools-mcp](obsidian://open?vault=knowledge-base&file=playwright-cli-vs-chrome-devtools-mcp) — im Catalog für Frontend-Tests genannt
- Context7 — im Catalog für RAG genannt
- Notion — Catalog-MCP
- Brave — Catalog-MCP
- [firecrawl-vs-tavily](obsidian://open?vault=knowledge-base&file=firecrawl-vs-tavily) — Catalog-MCP zum Scrapen
- Discord — Catalog-MCP
- Stripe — Catalog-MCP
- Chroma DB — Catalog-MCP
- [[n8n]] — eigener Agent als MCP-Client gegen die Gateway (`host.docker.internal:8089`)
- GPT-4.1 mini — LLM im n8n-Demo-Agenten
- LiveKit — Voice-Agent mit denselben Catalog-Servern über die Gateway
- [docling-dokumentenextraktion](obsidian://open?vault=knowledge-base&file=docling-dokumentenextraktion) — Open-Source-Python-Tool für Extraktion und Chunking; Testvideo und Integrationsziel
- [[Introducing Archon - The Revolutionary Operating System for AI Coding]] — Ziel-Repo für das Docling-Issue und laut Voice-Agent das Repo mit den meisten Stars
- Sonnet 4.5 — Modell hinter dem Claude-Desktop-Workflow
- `mcp_docker` — aggregierter MCP-Server-Name in Claude Desktop
## Verwandt
- [[NEW MCP Toolkit Is Insane! Ultimate MCP Setup For AI Coding Assistants Will 10x Your Productivity!]] — dasselbe Docker-MCP-Toolkit aus einer anderen Video-Perspektive
- [[The MCP Integration EVERYONE is Sleeping On (MCP + Custom AI Agents)]] — Cole Medin zu MCP in selbstgebauten Agenten statt nur in Desktop-Clients
- [claude-code-mcp-setup](obsidian://open?vault=knowledge-base&file=claude-code-mcp-setup) — JSON- und ENV-Setup von MCP-Servern in Claude Code, ohne Docker-Catalog
- [[8 MCP Servers That Make Claude Code 10x Better]] — Auswahl und Menge von MCP-Servern für Claude Code
- [[All the BEST RAG Strategies in ONE MCP for AI Coding Assistants]] — Coles eigener RAG-MCP, thematisch neben Context7 und Docling im Catalog
- [[What Is Docling Transforming Unstructured Data for RAG and AI]] — Docling-Einführung unabhängig vom Catalog-Workflow
- [[How to INSTANTLY Build AI Agents in N8N Using Claude]] — n8n-Agenten mit Claude, ohne Docker-Gateway
- [[How to Scrape ANY YouTube Video Transcript with n8n! (full workflow)]] — YouTube-Transkripte per n8n statt Catalog-MCP
- [ai-browser-assisted-development-testing](obsidian://open?vault=knowledge-base&file=ai-browser-assisted-development-testing) — Playwright-MCP im Agent-Alltag neben dem Catalog-Eintrag
- [obsidian-cli-for-agents](obsidian://open?vault=knowledge-base&file=obsidian-cli-for-agents) — Agent-Zugriff auf Obsidian über die CLI statt Local REST API
