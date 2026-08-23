# Bewertungsauftrag: zwei Zusammenfassungen desselben Videos

Du bekommst das aufbereitete Transkript eines YouTube-Videos und zwei
unabhaengig erzeugte deutsche Zusammenfassungen davon (Fassung A und Fassung B).
Welches Modell welche Fassung geschrieben hat, erfaehrst du nicht und sollst du
nicht raten.

## Die Regeln, nach denen beide Fassungen erzeugt wurden

- Sektionen in dieser Reihenfolge: "## Worum es geht" (1-2 Saetze),
  "## Besprochene Konzepte", "## Behauptungen", "## Demos / Schritte" (nur wenn
  etwas vorgefuehrt wird), "## Genannte Tools" (nur wenn Tools genannt werden),
  "## Verwandt".
- Nur was der Sprecher tatsaechlich sagt. Eigene Spekulation des Modells ist
  verboten: keine eigene Deutung ("vermutlich meint der Sprecher"), keine
  eigenen Schluesse ("daraus folgt"), keine Vorausschau. Spekulation des
  SPRECHERS darf uebernommen werden, markiert mit "laut Sprecher".
- Bei Unsicherheit, ob eine Behauptung woertlich ins Original zurueckfuehrbar
  ist: weglassen.
- Sprache deutsch. Fachbegriffe, Produkt- und Befehlsnamen bleiben im Original.
- Timestamps in "## Behauptungen" sind optional.
- Links auf Vault-Artikel sind erlaubt und erwuenscht; ihre technische
  Korrektheit wird getrennt gemessen und ist NICHT dein Gegenstand.

## Dein Auftrag

Miss beide Fassungen einzeln gegen das Transkript. Frageform ist Plural: nenne
alle Fundstellen, und sag ausdruecklich, wenn es nur eine oder keine gibt.

1. **Nicht gedeckte Aussagen.** Jede Aussage, die so nicht im Transkript steht —
   erfundene Zahl, erfundener Name, verdrehte Aussage, hinzugedichteter
   Zusammenhang. Je Fund: Fassung, Sektion, das Zitat aus der Fassung, und
   warum das Transkript es nicht deckt. Zaehl am Ende je Fassung.
2. **Eigene Spekulation des Modells.** Deutungen, Schluesse, Vorausschau, die
   der Sprecher nicht selbst zieht. Je Fund: Fassung, Zitat. Zaehl je Fassung.
3. **Fehlende wichtige Inhalte.** Geh das Transkript durch und nenne die Punkte,
   die ein Leser der Zusammenfassung braucht und die in einer der beiden
   Fassungen fehlen. Je Fund: welcher Punkt, in welcher Fassung er fehlt, wo er
   im Transkript steht. Zaehl je Fassung.
4. **Praezision der uebernommenen Aussagen.** Wo sagt eine Fassung dasselbe
   praeziser oder korrekter als die andere? Je Fund beide Formulierungen
   nebeneinander.
5. **Regelverstoesse gegen die Sektionsvorgaben** (fehlende Sektion, Sektion
   trotz fehlendem Anlass, Vorrede, fremde Ueberschrift, falsche Sprache).
6. **Gesamturteil je Kriterium** (Treue, Vollstaendigkeit, Praezision,
   Regeltreue): A besser / B besser / gleichwertig, mit einem Satz Begruendung.
   Kein Gesamtsieger-Satz ohne diese vier Einzelurteile.

Auflagen:

- Belege jeden Fund am Transkript. Findest du die Stelle nicht, schreib
  "im Transkript nicht gefunden" statt einer Vermutung.
- Zaehl nicht die Laenge als Qualitaet. Eine kuerzere Fassung ist nur dann
  schlechter, wenn ein benannter Inhalt fehlt.
- Bewerte die technische Form der Links NICHT.
- Rate nicht, welches Modell welche Fassung geschrieben hat.

## Ausgabe

Gib den Bericht als deine Schlussnachricht zurueck, in dieser Form:

    ## Nicht gedeckte Aussagen
    ### Fassung A
    - ...
    ### Fassung B
    - ...
    Zaehlung: A=<n> B=<n>

    ## Eigene Spekulation
    ... (gleiche Form, mit Zaehlung)

    ## Fehlende wichtige Inhalte
    ... (gleiche Form, mit Zaehlung)

    ## Praezision
    - ...

    ## Regelverstoesse
    ### Fassung A
    - ...
    ### Fassung B
    - ...

    ## Urteil
    - Treue: A besser | B besser | gleichwertig — <ein Satz>
    - Vollstaendigkeit: ...
    - Praezision: ...
    - Regeltreue: ...

---

# Transkript (audited_md)

### Einführung — Was ist Agent Kit?

Looks like Open AI just made a major move in the agentic no code space with agent kit and it's basically their answer to tools like n8n, Vector Shift as well as LangGraph but native to open ai's ecosystem and fully free to access right now. Agent kit is a new end-to-end platform for building deploying and optimizing AI agents with no coding required. You have key components like an agent builder which is a visual canvas to design and test various sorts of multi-agent workflows with a drag and drop logic, built-in guardrails and live preview runs. You also have a connector registry which is a central hub for managing data sources APIs and tools that connect across open AI products. And lastly, you have a chat kit. This is a customizable chat toolkit that lets developers embed agentic UIs directly into their products or websites. But essentially with agent kit, OpenAI just blurred the line between AI engineering as well as no code automation which gives anyone the power to create production-ready AI agents visually similar to Zapier but with native GPT integration and built-in evaluation tools.

### Agent Builder — Canvas, Nodes & Konfiguration

To get started, it's super simple. Just head over to the open AI platform which I'll leave a link to in the description below. Head over to the agent builder section and then over here you can open up agent builder. This will take you to create a new workflow from scratch. But there's a couple of templates that you can access readily like a document comparison and internal knowledge assistant, data enrichment and so many others. But we're going to go ahead and create one from scratch. And this is basically the new canvas of the agent kit.

Just take a look at this example where HubSpot integrated agent kit's custom response widget into their AI assistant. And this is where it gives it the capability to search the company's knowledge base in real time. You can retrieve the most relevant information and help articles and deliver personalized support responses directly to users. This shows how Agent Kit isn't just for devs. It's designed for real businesses so that you can embed agentic logic into customer experiences without building everything from scratch.

This is the canvas of the agent builder. On the left hand side, you have all the different nodes which are basically action points. You have an agent node which is where you can call the model to perform any action with instructions and tools. The end is where you can basically finalize the workflow. You have a start node and an end node. Then you have other nodes like a document node. You also have file search, guardrails, MCPs. You also have logics. So if-else logic, you can also have it so that there's a loop for different conditions, user approvals. And then there's also data nodes where you can reshape data as well as set state where you can assign values to workflow state variables. But this is essentially where you can drag and drop these different nodes to perform different actions to automate different things. But if you click on the agent node, this is where you can give it a name, give it an instruction as to what you want it to perform like web searching or you want to create an AI agent that will help you process data. You can then select the model of your choice, a part of the open AI ecosystem, which is definitely restrictive if you're looking to use other models like Gemini or Claude. But essentially once you select that, you can toggle on or off the reasoning effort. You can also implement other tools you can use like a client tool, MCPs, file search and etc. You have all the different tools that open AI provides. And if you click more, there's other options that you can tweak, which I wouldn't recommend you do right away if you do not know what you're doing.

### Demo: Unternehmens-Recherche-Workflow

But just take a look at this demo workflow, which is a simple workflow to research a set of companies using web search and provide a summary analysis. This is where you first start off with the user inquiry, which sends it over to the web research agent. This web research agent has been configured and it also has been given a name and a couple of instructions where it's stated that you are a helpful assistant. Use web search capabilities to find information about the following company that could be used in marketing assets based on the underlying logic. From there it works on the next step and that is to summarize and display. This is the next agent that has been configured with another model like the GPT-5 and it also has been requested to include chat history and instruction to put the research together in a nice display using the output format that was described and alternatively you can convert the results into different structures.

But now what we can do is we can actually take a preview look of this. So if you click on preview, you can test this out and we can say something like analyze Nvidia the stock and then we can send in this request and you can see that now it is working on using the web research agent where it's looking through different sources like Nvidia's website or description and it's now working on a summary and displaying that content. And you can see right here that it has done that by providing me the company name, the industry which is semiconductors and technology, headquarters in Santa Clara, company size, website, founding year, as well as a description of what the company does. And this was a super simple AI agent that anyone can create with most AI agent builders. And you can see how easy it was to actually configure with the agent kit.

And after you have configured your agent, you can click on evaluation. This is where you can get a good understanding of the log as well as how the agent is performing and you can evaluate different traces with different tests. Now you can also duplicate this. You can access the code for the chat kit as well as the agent SDK and then you can also add a domain to this. And once you have finished configuring it, you can then publish your AI agent so that anyone can access it or you can basically access it in a production environment.

### Demo: Datenbank-Abfrage-Workflow

Here is another demo example of an AI agent that can perform different sorts of actions by invoking the database. So you can get analysis on different files a part of your database with different guard rules that are set so that it accesses it only if user input doesn't violate the moderation. It'll then identify each category and then it will provide you a summary of it. And you can actually take a preview of this by sending in a prompt like how many orders did you sell in 2015 and you can send in this prompt and if it passes the guardrail it will then execute it using the select agent and it will select the correct condition and then provide you the correct answer afterwards. So you can see that it was able to invoke our database. And the total orders is 82k approximately based off of the dummy data that was set. And this is something that can also process large amounts of documents which is great.

### Agent Kit vs. n8n — Vergleich & Fazit

Now here comes the real question. Is it better than n8n? Well the simple answer is Agent Kit is definitely not superior than n8n just yet. This is because agent kit is definitely fairly new. There's a lot of factors that are still being implemented, but most of the reasons why I prefer n8n right away is because it's a little easier to work with, which also offers a lot of customizability and versatility. You have the ability to use a lot of different nodes in comparison to agent kit, which is just restricted to the base amount which we saw over there. There's more agents. There's more flexibility with models you can use. And it's easier to prototype to production with the pipelines in n8n. Now, this doesn't mean that agent kit is bad. It's definitely a great alternative that you can access directly on the web for free, and it's powered by state-of-the-art models, so you can't really complain much when you're getting offered free access to it. It's something that will be worked upon more, and it will be able to maybe even be on par with n8n in the future. So in my opinion right now, n8n is better for multi-providers as well as highly customizable workflows and agent kit is something that you can get started with completely for free today and get started on the cloud to build basic automations.

### Outro

If you like this video and would love to support the channel, you can consider donating to my channel through the super thanks option below. Or you can consider joining our private Discord where you can access multiple subscriptions to different AI tools for free on a monthly basis, plus daily AI news and exclusive content, plus a lot more. But that's basically it, guys, for today's video on agent kit. This is something that I'll leave a link to in the description below so that you can easily get started. But with that thought, guys, thank you guys so much for watching. Make sure you go ahead and subscribe to the second channel. This is where I'm also posting consistently with my partners. Make sure you go ahead and join the newsletter, join our private Discord, follow me on Twitter, and lastly, make sure you guys subscribe, turn on notification bell, like this video, and please take a look at our previous videos cuz there's a lot of content that you will truly benefit from. But with that thought, guys, have an amazing day, spread positivity, and I'll see you guys fairly shortly.

---

# Fassung A

## Worum es geht

OpenAIs neues **Agent Kit** wird vorgestellt — eine No-Code-Plattform zum Bauen, Deployen und Optimieren von KI-Agenten innerhalb des OpenAI-Ökosystems. Das Video erklärt die Komponenten, zeigt zwei Demo-Workflows und vergleicht Agent Kit am Ende mit n8n.

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

---

# Fassung B

## Worum es geht
OpenAIs **Agent Kit** wird als kostenlose No-Code-Plattform vorgestellt, mit der man KI-Agenten visuell bauen, testen, bewerten und veröffentlichen kann. Der Sprecher führt den Agent Builder vor, zeigt zwei Demo-Workflows und vergleicht das Angebot mit n8n.
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
