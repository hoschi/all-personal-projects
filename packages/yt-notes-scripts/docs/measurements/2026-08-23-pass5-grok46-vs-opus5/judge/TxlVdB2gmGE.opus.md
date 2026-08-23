## Nicht gedeckte Aussagen

### Fassung A

- Sektion "Worum es geht": "Cole Medin zeigt den Docker MCP Catalog". Das Transkript nennt nur den Vornamen ("Now you might be asking yourself, Cole", 00:00). Der Nachname "Medin" steht nirgends im Transkript.
- Grenzfall, Sektion "Genannte Tools": "Local REST API — Obsidian-Community-Plugin als HTTP-Schnittstelle für den MCP-Server". Das Transkript sagt nur, dass das Community-Plugin einen API-Key liefert, den man in die MCP-Konfiguration einträgt (08:56). Dass die Anbindung über HTTP läuft, ist aus dem Plugin-Namen geschlossen, nicht gesagt.

Zählung: A=1 (plus 1 Grenzfall)

### Fassung B

- Sektion "Worum es geht": "Cole Medin stellt den Docker MCP Catalog vor". Gleiche Fundstelle wie bei A — nur "Cole" ist gedeckt (00:00).
- Sektion "Besprochene Konzepte": "MCP-Server (Model Context Protocol)". Der Sprecher löst die Abkürzung MCP an keiner Stelle auf; er sagt durchgängig nur "MCP servers".
- Sektion "Genannte Tools": "n8n — Low-Code-Plattform für den eigenen AI-Agent mit MCP-Client". Der Sprecher sagt zu n8n nur "n8n is just like the easiest way to take advantage of this right out the gate" (19:59). "Low-Code-Plattform" ist eine hinzugefügte Einordnung.
- Grenzfall, Sektion "Besprochene Konzepte": "Hybrid Chunking — als Feature von Docling im generierten Summary hervorgehoben". Gesagt wird nur, dass die von Sonnet 4.5 erzeugte Obsidian-Notiz hybrid chunking erwähnt ("Talks about hybrid chunking, which is one of the things that I care about", 14:19). Dass es ein Feature von Docling ist, folgert die Fassung.
- Grenzfall, Sektion "Genannte Tools": "LiveKit — Framework für Voice-Agenten". Das Transkript sagt "how to build LiveKit voice agents" (21:22); die Gattungsbezeichnung "Framework" ist ergänzt.

Zählung: B=3 (plus 2 Grenzfälle)

## Eigene Spekulation

### Fassung A

- Keine gefunden. Die einzige Spekulation im Video — Gordon laufe auf "something like Gemini 2.5 Flash or GPT-5 Nano" (08:56) — ist als Sprecher-Vermutung markiert ("Der Sprecher vermutet, …"). Ebenso "Laut Sprecher ist das effizient und sicher" (04:26).

### Fassung B

- Keine gefunden. Die Gordon-Vermutung ist mit "Laut Sprecher … vermutlich" markiert (08:56). Die beiden Grenzfälle oben (Hybrid Chunking, LiveKit) sind hinzugefügte Einordnungen und stehen dort gezählt, nicht doppelt hier.

Zählung: A=0 B=0

## Fehlende wichtige Inhalte

### Fassung A

- Hybrid Chunking als inhaltlicher Punkt der erzeugten Obsidian-Notiz — fehlt in A, steht bei 14:19 ("Talks about hybrid chunking").
- Die Selbstbeschreibung der Gateway als "enterprise ready" — A schreibt nur "Dockers Open-Source-Lösung zum Orchestrieren und Verwalten von MCP-Servern"; das Zitat lautet "Docker's open-source enterprise ready solution" (16:49).
- Der Vorbehalt des Sprechers zum Ergebnis: "Now, I didn't check its work yet here, but that's not the point" (14:19). Fehlt in A und in B. Ein Leser, der den Workflow als Erfolgsnachweis liest, braucht diese Einschränkung.
- Der YouTube-Transcript-MCP bringt drei Tools mit ("I have my three tools right now for that YouTube Transcript MCP server", 04:26). Fehlt in A und in B.

Zählung: A=4 (davon 2 auch in B fehlend)

### Fassung B

- Der Verifikationstest über Slack: der Bot hat nur Zugriff auf den Channel "research" (11:19). Fehlt in B, A hat ihn.
- Der Verifikationstest über GitHub: "I have 50 GitHub repos" (11:19). Fehlt in B.
- GitHub allein liefert 26 Tools ("So I have 26 tools for GitHub, which is kind of a lot", 08:56). Fehlt in B — die Größenordnung erklärt, warum Gordon danach überfordert ist.
- Ask Gordon ist beim ersten Öffnen der Clients-Seite der einzige bereits verbundene Client, und Gordon ist wie das MCP Toolkit in Beta (04:26). B nennt Gordon nur als eingebauten Testagenten.
- Zum Slack-Setup gehört, eine Slack-App anzulegen und deren Bot-Token einzutragen ("you just have to create a Slack app and hook in the bot token here", 08:56). B nennt nur "Team-/Channel-IDs + Bot-Token".
- Die konkreten Artefakte des Workflows: die Obsidian-Notiz "Docling YouTube tutorial summary" und das Issue "Integrate Docling for advanced document processing in the RAG pipeline" (14:19). Fehlen in B, A hat beide.
- Claude Code hat die Arbeit in einem Feature-Branch erledigt und daraus die Pull Request erzeugt ("It did it all within a feature branch that I created a pull request for as well", 14:19). B nennt nur die Pull Request.
- Die gestartete Gateway liest die Docker-Catalog-Registry und übernimmt daraus die verbundenen Server ("it's going to look at my Docker catalog registry and it's going to figure out the MCP servers that I have connected", 16:49). Fehlt in B.
- Die n8n-Anbindung läuft lokal ohne Authentifizierung ("everything's running locally. So, I don't have any authentication at this point", 19:59). Fehlt in B.
- Das Ergebnis der LiveKit-Demo: der Voice-Agent nennt Archon als Repo mit den meisten Stars unter dem GitHub-Namen Colium0000, und der Sprecher bestätigt "That is the right answer" (21:22). B beschreibt nur, dass per Sprache GitHub-Repos abgefragt werden.
- Gordon sei ohnehin eher auf Docker-Themen feinabgestimmt ("I think Gordon is more fine-tuned to help you with Docker related things anyway", 08:56). Fehlt in B.
- Der Vorbehalt "I didn't check its work yet" (14:19). Fehlt auch in B.
- Die drei Tools des YouTube-Transcript-MCP (04:26). Fehlt auch in B.

Zählung: B=13 (davon 2 auch in A fehlend)

## Präzision

- Fetch und Popularität. A: "Fetch steht nach Popularität oben und hat über 500.000 Downloads". B: "Fetch ist der populärste Server mit über 500.000 Downloads". Das Transkript sagt "I have this sorted by popularity right now. We've got Fetch at the top" (03:00) — eine Aussage über die aktuelle Sortierung, nicht über einen Rang. A ist näher am Original.
- De-facto-Protokoll. A: "HTTP streamable ist laut Sprecher das De-facto-Standardprotokoll für MCP". B: "HTTP Streamable ist das De-facto-Standardprotokoll für MCP". Transkript: "Now HTTP streamable is the de facto standard protocol for MCP" (16:49) — eine Bewertung des Sprechers. A schreibt sie ihm zu, B stellt sie als Tatsache hin.
- Claude Desktop gegen Gordon. A: "Claude Desktop arbeitet laut Sprecher spürbar besser als Gordon". B: "Claude Desktop liefert deutlich bessere Ergebnisse als Gordon". Auch hier ist das Urteil im Transkript an den Sprecher gebunden ("quick spoiler, Claude Desktop does work quite a bit better", 04:26); nur A markiert das.
- Slack-Konfiguration. A: "Slack-MCP braucht Team-ID, Channel-IDs, eine Slack-App und einen Bot-Token". B: "Slack (Team-/Channel-IDs + Bot-Token)". A gibt die vier im Transkript genannten Bestandteile vollständig wieder (08:56).
- Die übrigen Katalog-Server. A führt sie einzeln mit Zweck: "Playwright — im Catalog für Frontend-Tests genannt", "Firecrawl — Catalog-MCP zum Scrapen". B fasst zusammen: "weitere Katalog-Server: Playwright, Notion, Brave, Firecrawl, Discord, Stripe, Chroma DB". Die Zwecke stehen im Transkript ("Playwright for front-end testing", "Firecrawl for scraping", 03:00); A gibt sie wieder.
- Gateway-Start. B: "den MCP Gateway aus dem Source bauen und mit `docker mcp gateway` auf Port 8089 (HTTP Streamable) starten" — nennt den Befehlsnamen. A: "MCP Gateway aus dem Open-Source-Repo bauen; auf Port 8089 mit Streaming-Transport starten; Catalog-Registry wird übernommen" — nennt den Registry-Schritt. Hier ist B beim Befehl konkreter, A beim Ablauf; beide Angaben sind gedeckt (16:49).
- Die 1,5 Sekunden. B: "dauerte laut Logs insgesamt 1,5 Sekunden". A: "`Slack list channels` über n8n dauerte 1,5 Sekunden". B nennt die Quelle der Zahl (die Gateway-Logs), A nennt das gemessene Tool. Beides gedeckt (19:59); B ist bei der Herkunft der Zahl genauer.

## Regelverstöße

### Fassung A

- Keiner gefunden. Alle sechs Sektionen stehen in der vorgegebenen Reihenfolge, "Demos / Schritte" und "Genannte Tools" haben einen Anlass, keine Vorrede, keine fremde Überschrift, Sprache durchgängig deutsch, Timestamps in "Behauptungen" sind zulässig.

### Fassung B

- Keiner gegen die Sektionsvorgaben. Reihenfolge, Anlass, Vorrede, Überschriften und Sprache sind in Ordnung.
- Mild, gegen die Markierungspflicht am Rand: drei Bewertungen des Sprechers stehen ohne "laut Sprecher" — "Claude Desktop liefert deutlich bessere Ergebnisse als Gordon", "HTTP Streamable ist das De-facto-Standardprotokoll für MCP", und das Container-Modell sei "extrem effizient und sicher" (letzteres immerhin in Anführungszeichen). Die Regel verlangt die Markierung ausdrücklich für Spekulation; diese drei sind Urteile, keine Spekulation, deshalb Randfall und kein harter Verstoß.

## Urteil

- Treue: A besser — B trägt drei nicht gedeckte Einordnungen ein (Model Context Protocol, Low-Code-Plattform, Hybrid Chunking als Docling-Feature), A nur den Nachnamen, den B ebenfalls hat.
- Vollständigkeit: A besser — B fehlen elf im Transkript benannte Punkte, die A hat (Verifikationstests, 26 Tools, Gordon-Vorbedingungen, Artefaktnamen, Feature-Branch, Registry-Übernahme, fehlende Authentifizierung, LiveKit-Ergebnis), A fehlen nur zwei Punkte, die B hat.
- Präzision: A besser — A bindet die drei Sprecher-Urteile an den Sprecher und gibt Konfigurationslisten und Server-Zwecke vollständig wieder; B ist nur beim Gateway-Befehl und bei der Herkunft der 1,5-Sekunden-Zahl genauer.
- Regeltreue: gleichwertig — beide erfüllen alle Sektionsvorgaben; Bs unmarkierte Sprecher-Urteile sind ein Randfall der Markierungsregel, kein Sektionsverstoß.
