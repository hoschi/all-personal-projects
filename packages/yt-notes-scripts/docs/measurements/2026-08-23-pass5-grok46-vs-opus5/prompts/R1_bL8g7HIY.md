Du bekommst ein audited_md eines YouTube-Videos (Werbung schon ausgeschnitten).

Vault-Kontext: Die Zusammenfassung wird in eine Markdown-Datei geschrieben, die
im Obsidian-Vault `test` (Shared-Vault) liegt — Pfad
`shared/youtube/<channel>/<title>.md`. Wikilinks `[[…]]` lösen NUR innerhalb
dieses Vaults auf. Treffer aus dem KB-Vault (`knowledge-base`) brauchen
deshalb `obsidian://`-URIs — siehe Wikilink-Verfahren unten.

Aufgabe: Schreibe eine deutsche Zusammenfassung als Markdown, strukturiert in
folgende Sektionen. Setze Wikilinks zu KB-Artikeln im Vault aktiv, wo
entsprechende Sektionen das vorsehen.

## Worum es geht

Ein bis zwei Sätze: Was ist Thema und Kontext.

## Besprochene Konzepte

Bullet-Liste der inhaltlichen Konzepte / Theorien / Ansätze.
Pro Bullet: "<Konzept> — <ein Halbsatz Beschreibung>".
Wenn der Konzept-Begriff einen passenden Vault-Artikel hat (OHS-Lookup
geprüft, siehe Wikilink-Verfahren unten): "[[<artikel-name>]] — …".

## Behauptungen

Bullet-Liste konkreter Aussagen des Sprechers — Fakten, Empfehlungen,
Wertungen über Tools/Produkte/Vorgehen.
Pro Bullet: "<knappe Behauptung>" (optional: `(<timestamp>)` am Ende).
KEINE Wikilinks in dieser Sektion — die landen in `## Verwandt` unten.

Timestamp-Format STRIKT (nur wenn du einen aus dem audited_md übernimmst):
M:SS, MM:SS, H:MM:SS oder HH:MM:SS — IN runden Klammern, KEINE
selbstgebauten Markdown-Links. Die Timestamps werden in einem
deterministischen Post-Process zu YouTube-Marker-Links umgeschrieben.

Behauptung vs Spekulation:
- **DEINE** Spekulation ist verboten:
    - "Vermutlich meint der Sprecher …" — keine eigene Interpretation
    - "Daraus folgt …" — keine eigenen Schlüsse
    - "Das könnte zu Z führen" — keine Vorausschau
- **Sprecher-Spekulation** ist OK: wenn der Sprecher selbst vermutet
  ("ich glaube X wird Y überholen"), übernimm es mit Marker
  "Laut Sprecher …" oder "Der Sprecher vermutet …".
- Faustregel: bei Unsicherheit ob du eine Behauptung wörtlich ins Original
  zurückführen kannst, weglassen.

## Demos / Schritte

Falls etwas vorgeführt wird: nummerierte Liste, jeder Schritt knapp.
Wenn nichts vorgeführt wird, Sektion weglassen.

## Genannte Tools

Bullet-Liste der explizit genannten externen Tools / Frameworks / Produkte.
Pro Bullet: "[[<vault-artikel-name>]] — <Halbsatz Funktion>" wenn Match,
sonst Klartext-Name.
Wenn keine Tools im Video: Sektion weglassen.

## Verwandt

Bullet-Liste von Vault-Artikeln, die zum Video-Thema verwandt sind —
auch wenn nicht explizit im Video genannt. Quelle: OHS-Lookup mit
Video-Thema/Konzept-Phrasen.
Pro Bullet: "[[<artikel-name>]] — <Halbsatz, was die Verbindung ist>".
Keine Duplikate zu den schon in Konzepte/Tools verlinkten Artikeln.
Wenn nichts verwandt: Sektion weglassen.

---

Wikilink-Verfahren (für Konzepte, Tools, Verwandt — Pflicht):
1. Bash-Aufruf (mit explizitem Node-Interpreter — claude-CLI Sub-Agent erbt
   einen PATH, in dem ein Node v26 vor Node v22 steht, was den OHS-internen
   `better-sqlite3` mit NODE_MODULE_VERSION-Mismatch kaputtmacht):
   OHS_NODE_BIN=$HOME/.asdf/shims/node /Users/hoschi/repos/kims/scripts/ohs-search-merged.sh --vault-type arbeit --no-yt --limit 3 --json '<query>'
2. Score-Lese: nur Hits mit `score_native >= 0.8` betrachten (NICHT score_rrf —
   der ist Rank-basiert und liegt im Bereich ~0.01-0.02, also nie >= 0.8).
3. Title-Match-Prüfung gegen Video-Kontext:
   - Bei Mehrdeutigkeit (z.B. "Claude" → "Claude Code" vs "Claude API"):
     Kontext-Snippet aus diesem Video entscheidet
4. **Link-Format strikt nach `source_index` des Hits** (siehe JSON-Antwort):
   - `source_index: "shared"` → `[[<exakter-hit-title>]]` (Wikilink, gleicher Vault)
   - `source_index: "kb"` → `[<exakter-hit-title>](obsidian://open?vault=knowledge-base&file=<URL-encoded-file_path-OHNE-.md>)`
     **`.md`-Suffix wird abgeschnitten** (Obsidian-URI erwartet den File-Namen
     ohne Extension — sonst öffnet der Klick eine neue Stub-Datei statt der
     Ziel-Datei). URL-Encoding: Leerzeichen → `%20`, Slashes `/` → `%2F`,
     Sonderzeichen (Umlaute, Bindestrich-em-dash, Apostrophe) entsprechend RFC 3986.
     Beispiel: file_path `claude-code-mcp-setup.md` → `file=claude-code-mcp-setup`.
     Beispiel mit Sonderzeichen: `yt-pipeline — decisions.md` → `file=yt-pipeline%20%E2%80%94%20decisions`.
5. Kein Match / Score zu niedrig: Klartext lassen,
   KEINEN spekulativen Wikilink.
6. NIEMALS `[[…]]` für einen Hit mit `source_index: "kb"` — das wäre ein
   toter Cross-Vault-Link.
7. NIEMALS ein Markdown-Link mit relativem Vault-Pfad für eine Vault-Notiz —
   weder `[text](shared/…/datei.md)` noch `[text](knowledge-base/…/datei.md)`.
   Solche Pfade lösen in Obsidian NICHT auf. Es gibt nur zwei erlaubte Formen:
   Same-Vault → `[[…]]` (Punkt 4, source_index shared),
   KB-Vault → `[…](obsidian://…)` (Punkt 4, source_index kb).

Globale Regeln:
- NUR was der Sprecher tatsächlich sagt
- Sprache: deutsch
- Keine harten Längen-Limits
- Links (Wikilinks [[…]] und [text](obsidian://…)) NIEMALS in Backticks
  einschließen — Backticks rendern den Link als Inline-Code statt als
  klickbaren Link. Die Backtick-Beispiele oben dienen nur der Darstellung.
- Gib AUSSCHLIESSLICH den Markdown-Body aus (beginnend mit "## Worum es
  geht"). Keine Vorrede, kein Denken, keine Meta-Kommentare wie "Ich schreibe
  jetzt die Zusammenfassung", keine zusätzlichen Überschriften außer den oben
  definierten Sektionen.

Input audited_md:
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