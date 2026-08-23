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
### [00:00](https://www.youtube.com/watch?v=TxlVdB2gmGE&t=0s) — Introducing the Docker MCP Catalog

Right now, I'm going to show you the easiest possible way to supercharge your AI agents, and it's all thanks to MCP servers. You might have heard of them before, but there is a new way to set them up and connect them to your agents super quickly. The workflow that you're looking at right here, and I'll actually show you this later in the video, took me only 10 minutes to set up. I connected my Claude Desktop to YouTube, Obsidian, Slack, and GitHub really, really easily. And so I have this whole workflow here where it pulls a YouTube transcript. It summarizes that and puts it in my Obsidian vault and then I have it read my Slack conversation to get some extra context and then create a GitHub issue and then I even have it mention Claude Code in the issue to kick off a Claude Code agent to autonomously work on my codebase based on the research that I did here. So end to end, we started with research all the way to a complete implementation in our codebase and it took me 10 minutes to set this up with all of these MCP servers. Now you might be asking yourself, Cole, isn't that going to take a while to get everything set up? I mean, if you worked with MCP before, you probably worked with this kind of registry, like the main one that we have in GitHub where you find the MCP servers that you want in this list, but then you have to click into it and you have to figure out the JSON configuration to connect it and then you have to go and do that for the next one and the next one. It actually is a bit of a hassle to get all of these MCP servers, all this functionality built into our AI agents. But now there is a new tool that makes it 100 times easier to find and connect MCP servers and that is the Docker MCP Catalog. This is what I want to show you today and all the things that we can do with it. It is a beautifully curated list of all of these MCP servers and with a single click of a button I can connect them and then use them in my own agents. I can connect very easily again with a click of a button to Claude Code or Claude Desktop. This is now my command center to manage my MCP servers. Right now, I'll show you how easy it is to get this up and running and then we'll play around with some of these different servers and build out some workflows.

### [02:06](https://www.youtube.com/watch?v=TxlVdB2gmGE&t=126s) — How to Download + Use the Docker MCP Catalog

So, in order to get access to this lovely catalog of MCP servers, the only thing you have to do is install Docker Desktop. And if you followed along with any of my content in the past, you probably already have it. I use Docker already for pretty much every application that I build. And so I already have the platform up and running 24/7 with all of my different containers. And so now I get to manage my MCP servers in the exact same place. It is a beautiful thing. So cool.

### [03:00](https://www.youtube.com/watch?v=TxlVdB2gmGE&t=180s) — Exploring the Docker MCP Catalog (So Many Servers)

Let's actually explore all the MCP servers that we have here. And I'll show you how easy it is with a single click of a button to connect these servers into any of your external clients as well. Once you have your server selected like Claude Code, Claude Desktop, Gemini CLI, it'll actually update the configuration for these tools for you. So you don't even have to do anything with JSON yourself like you have before if you've used MCP. And so yeah, going back to the catalog, I have this sorted by popularity right now. We've got Fetch at the top with over 500,000 downloads already, giving our agents the ability to take a URL and extract the content from it. We've got Slack. I'm going to be using this one today. Playwright for front-end testing. Context7 for RAG. We can hook our agents into our database in one click. We can pull YouTube transcripts. I'll also be using that one today. It feels like whatever functionality I need for my agent, I can get it from this catalog. We got Notion. We've got Brave, Firecrawl for scraping. We've got Discord, Stripe, Chroma DB. It's like everything is here. It's so cool.

### [04:26](https://www.youtube.com/watch?v=TxlVdB2gmGE&t=266s) — Testing Our First Catalog MCP (in Docker and Claude Desktop)

So, let's actually install one of these. I'm going to go to YouTube Transcripts, click into this and then all I have to do, one click, add MCP server. Boom, we have it now connected. The only other thing you might need to do depending on your MCP is set up configuration. But it's also really convenient that we can do all of this for things like API keys right within the catalog as well. And then we can also see all of the tools that this MCP now gives to our agent once we have it connected. Also keep in mind that when you are working with the MCP toolkit, which is in beta, you might need to go to your Docker settings in the top here, and go to beta features and enable it. Now, this was enabled for me by default, but I just want to call that out in case you're missing that there, because then it's not going to work when we go on to the rest of the things here, actually getting these MCP servers connected to our agents. So now with our first server selected from the catalog, we can now hook this in to any of our clients in the click of a button. But there's one other thing I actually want to show you first that's really cool. Because when you go to this client page for the first time, none of these will be connected except for this one right here, Ask Gordon. It's actually set up to be connected to our MCP toolkit by default because Gordon is the AI agent that is built directly into Docker Desktop, also in beta, just like the MCP toolkit. And so without even having to connect to any external client yet, we can actually test our MCP servers directly within Docker Desktop thanks to Gordon. And so for the tool that I have right now, you just have to go to your toolbox MCP toolkit right here. And then just make sure that you have the toolkit enabled for Gordon. And so I have my three tools right now for that YouTube Transcript MCP server. So I'll close out of this. And we need it to transcribe a video. So I'm just going to go to one of the latest videos on my channel where I cover Docling, which is a tool to help with data extraction and chunking for RAG. And so I'm just going to copy this URL at the top. Very simple. Go back to Gordon here. I'm going to say transcribe this video and give me a very concise summary. I just want something really fast here just to show you how Gordon is a place for us to quickly test our MCP servers. And so Gordon is going to make that tool call. There we go. Calling get transcript. And it's a pretty quick agent overall. So we should get the summary in just a second here. There we go. Nice. The video introduces Dockling. Didn't quite spell it right. I'll give it a pass on that one. Free open source Python tool designed to simplify the extraction and preparation of complex data. Cool. This is perfect. So, as we're adding these servers in our catalog, we can use Gordon to quickly test them. But the real deal here is being able to use these MCP servers in our existing clients. You maybe are using Claude Code or Cursor for your coding or you're just working with Claude Desktop to brainstorm with an LLM. Let's give the functionality to those guys. And so, all we have to do is go to the clients tab and then single click of a button. Just as easy as selecting the servers in our catalog. So, we'll start with Claude Desktop here. All I have to do is click connect. And boom, there we go. Now, the next time we open up Claude Desktop, all of the servers that we have here are going to be immediately available in Claude Desktop. Now, for most MCP clients, once we add more servers into them, we have to restart them. So, I'll do that for Claude Desktop here. I'll just go and right-click, quit, and then go and restart the application. Super super fast. Wait for it to load. And then the way that we can verify our connection here is by going to search and tools and then you're looking for the MCP server called mcp_docker very creatively named. And we can click into this to see all the tools that it exposes. And so this single server is basically aggregating all the tools from all the MCPs that we have selected in the catalog. So once we start adding more here, we're going to just see it still as a single server in our client just with all the tools from all of our different servers. And the other thing I want to say here, I think you'll find this interesting. This is a quick 30-second explanation how this works. All of these tools that we add, they run as Docker containers. So whenever our client like Claude Desktop requests to use a tool like to get a transcript, that actually quickly spins up a container to perform that tool action and then once the tool is done running, it immediately spins the container down. So no matter how many MCP servers we have connected here, it's not like those containers are constantly running taking memory on our machine. It's only when we're using a tool that the container is actually running. So extremely efficient and secure. Very, very cool. And so now with Claude Desktop here, I'm just going to go ahead and test it with the exact same thing. So I'll copy this URL, go back in and say transcribe this video, and give me a super concise summary. All right. So, we'll just make sure that it can work as well as Gordon, which quick spoiler, Claude Desktop does work quite a bit better than Gordon. It is a lot more powerful of an LLM running things under the hood. So, there we go. It's calling mcp_docker to get the transcript for the URL. And let's see if we can get a nice summary here. Awesome. Perfect. Yep. Here's our video, what it covers, key features. Looking really good. Honestly, probably even a better summary. So, cool. That is the YouTube Transcript MCP, but let's add in a few more, really spice things up, and actually get a full workflow created with these MCP servers.

### [08:56](https://www.youtube.com/watch?v=TxlVdB2gmGE&t=536s) — Building Up Our Arsenal of MCP Servers

So, I'm just going to connect a few different ones that I want to have in my Claude Desktop. So, I'm going to start with Slack here. I'll go ahead and add this server. Single click. Boom. There we go. And then we just have to configure a couple of things, which I already did off camera for the team ID and the channel IDs. You just get these from the Slack URLs. And then you just have to create a Slack app and hook in the bot token here. I'm not going to cover that right now. You can read the documentation in Slack if you want. So I got Slack connected. What else do we want here? How about GitHub? So I did actually try the official GitHub and that one wasn't working for me for some reason. So I'm just going to use the archived one here because this has actually been working phenomenally for me. So now all I have to do is add in my personal access token that I can get in my GitHub settings. And now it can access all my repositories and do things like create issues on my behalf. Very, very neat. And then the last one that I want to add in here, I've been absolutely loving Obsidian recently. Probably going to be creating a lot more content on it in the near future. So, I'm going to go ahead and add this one. Obsidian is where I do a lot of my note taking and knowledge management. Like what you're looking at right here is actually the script that I have written out for this video right now. I know it's really meta but yeah, when you go into the settings for Obsidian, you can install community plugins. And one of these plugins that you can install is called the Local REST API. So you have to install this and then it's going to give you an API key, which is what you need to hook into the Obsidian API key right here in the MCP configuration. So that's how you hook in Obsidian. Now going back to my servers, I have four in total now. So I have 26 tools for GitHub, which is kind of a lot, but we'll roll with it here. Then we've got Obsidian, Slack, and YouTube Transcripts. And so we can start to actually define these workflows for the large language model to combine functionality from these different servers. It's really cool. Now, I'm not going to be testing this with Gordon. Gordon is a pretty cool guy, but I can tell from my testing that I've been doing that it's not powered by the most powerful LLM. It seems like it's something like Gemini 2.5 Flash or GPT-5 Nano. It gets quite overwhelmed with all of these tools when it has more than a couple. And plus, I think Gordon is more fine-tuned to help you with Docker related things anyway. And so with all these tools connected, I'm just going to jump straight to restarting Claude Desktop and testing things in Claude Desktop. And I could connect other clients as well, like if I wanted to connect it to Claude Code or Gemini CLI, but I'll keep on the train here of Claude Desktop because I love using Claude Desktop just to generally brainstorm ideas with an LLM.

### [11:19](https://www.youtube.com/watch?v=TxlVdB2gmGE&t=679s) — Testing Multiple Docker MCP Servers in Claude Desktop

So yeah, let's go do search and tools. Scroll down mcp_docker. I'll click into this and sure enough, this time we have a much larger list of tools because we have everything from Slack, Obsidian, YouTube Transcripts, and GitHub. Awesome. So, I can say, for example, what Slack channels do I have? And it should just say I have access to a research channel because that's the only one that I've given the Slack bot access to. So, yep, listing Slack channels. In a second here, it should say research. There we go. Okay, perfect. Yep. So, the Slack MCP is working. For GitHub, I can say what GitHub repos do I have? And in a second here, I'll actually combine some of these tool usages together to make something pretty interesting. But yeah, first let's just make sure that these servers are actually working. There we go. I have 50 GitHub repos. Take a look at that. That's actually crazy to me. Yeah, things are working great.

### [12:30](https://www.youtube.com/watch?v=TxlVdB2gmGE&t=750s) — Full Agentic Workflow with MCP Servers

Okay, so that was fun just testing out the different MCP servers, seeing these tools in action. But now, let's take it to the next level. This is where the fun really begins because I wanted to create more of a workflow for my agent to go through leveraging the different MCP servers in tandem to accomplish a single larger task for me. Let's push the limits of Sonnet 4.5 here. And so what I'm going to do is send in this request that is going to require it to work with all four MCP servers that it has through the Docker catalog. So I'm having it pull the transcript for that same Docling video. I want to create a summary and put it in my Obsidian Vault. And I'm specifically having it put it in this reference notes folder right here. And I'll actually delete the previous Docling summary that I have just so that it's starting from scratch. There we go. Put it in the reference notes folder. Then after I want it to read my Docling research that I have in that single Slack channel that it has access to. So just giving it some more context to then create a GitHub issue for Archon. I want to actually integrate Docling with Archon. And then finally last thing — we're asking a lot here — finally, I wanted to add a comment to the issue saying @claudefix work on this issue. That is our way to trigger Claude Code to autonomously work on this issue. So, we're going from the research phase all the way to actually kicking off a workflow for Claude Code to work on this issue in our repository. I know this is pretty complex, but that is the point. I'm trying to ask a lot here and see how it performs. And I'm actually super curious. I have not run this yet. This is my first time doing it. And so, we'll see if it's able to accomplish everything. And so, yeah, first it is getting the transcript. I think what I'm going to do here is let it run. I'll pause and come back once it's done. We'll read through the conversation history together and see if it did what it was supposed to.

### [14:19](https://www.youtube.com/watch?v=TxlVdB2gmGE&t=859s) — Results of the Agentic Workflow (Insane)

Okay, this is actually beyond exciting. Everything worked flawlessly. And as I'm speaking, Claude Code is working on this issue. Take a look at this. This is just so cool. So, it got the transcript. We saw that already before I paused to come back here. Then, it is creating the research summary in Obsidian. Take a look at this in the reference notes folder. I've got Docling YouTube tutorial summary. And it even spelled Docling right this time. Good for Sonnet 4.5. So, we got our nice little summary here of the tool as a whole. Looks really good. Talks about hybrid chunking, which is one of the things that I care about. And then going down now, it goes and it fetches the conversation history in that Slack channel. So, it lists the channels, finds that research one, it pulls the channel history. So, there's quite a bit of text that I have here, just things that I did to research Docling. Looking really good. Then, it searches my GitHub repositories to find the Archon one. Once it finds Archon, then it creates the issue. And it had a problem creating an issue the first time it used that tool call. But LLMs are quite smart, especially Sonnet 4.5. So it's able to correct itself, figure out the problem, call the tool again, and this time it works creating that issue for the Docling integration. And then finally, it adds that comment to trigger Claude Code to work on this issue. And so yeah, let's actually go to our browser. Now, I want to show you here first. This is the research that I have in the Slack conversation that it pulled by the way. Then going into Archon, we have a new issue. Look at that. Integrate Docling for advanced document processing in the RAG pipeline. We got a beautifully formatted issue here. And there we go. @claudefix work on this issue. And then Claude Code that I already have integrated in the repository responded to this and is in the middle of processing creating a pull request for my issue. So end to end from Claude Desktop, I had to do a ton of research that now finalizes. It culminates into Claude Code actually working on this for me. Super super cool. All right, Claude Code has finished its work. It did it all within a feature branch that I created a pull request for as well. So, we can go to that, check it out, and boom, there we go. We have a pull request that was created end to end by automation thanks to MCP servers and the Docker catalog. Now, I didn't check its work yet here, but that's not the point. It's totally good if you don't understand Archon or exactly what I'm doing at GitHub here. The point that I'm trying to drive home is just how easy it was to create this agentic workflow with all these MCP servers that we connected in just a couple of clicks.

### [16:49](https://www.youtube.com/watch?v=TxlVdB2gmGE&t=1009s) — Connecting Docker MCPs to Custom Agents (MCP Gateway)

Now, what we were able to do here in Claude Desktop was pretty incredible. And it's really easy for us to connect to other clients that are in this list as well, especially if you want to take some of these MCP servers and use them with your coding assistants. Most of the clients here actually are coding assistants that you can connect to. But the big question I have is how can we use these MCP servers in our own custom agents within Python code within n8n. Well, that's what I'm going to show you right now. To end things off for this video, I want to show you how we can take all this functionality and use it anywhere. So, we're not just limited to this client list. As awesome as this list is, and it does cover the tools that I use generally, what about my own agents? So, we'll actually start by going back to Claude Desktop because I want to show you that the way that Docker connects to these clients is the same way we can connect to our custom ones. There's just a little bit of extra setup we have to do. So, let's go to the settings here. Let's see how exactly this connection is set up between the Docker catalog and Claude Desktop. If we go to the MCP Docker server here, take a look at this. It is using this thing called the Docker MCP Gateway. What the heck is the MCP Gateway? Well, it is the tooling under the hood that allows us to connect the MCP servers in the Docker catalog to all of those clients in that preconfigured list. But the beautiful thing with this MCP Gateway is it is actually open-sourced. And so we have this documentation page that I'll link to in the description where they talk about this. The MCP Gateway is Docker's open-source enterprise ready solution for orchestrating and managing MCP servers. So the exact same functionality that is used under the hood to connect with our catalog and that preconfigured set of clients like Claude Desktop and Claude Code, we can use that same functionality. We can run it ourselves and then connect our own agents like what I have right here in n8n. And I'll show you this in a second here. And so going to their open source repo for MCP Gateway, they have some instructions for setup. You basically build the gateway from source and then we can run it with a couple of different commands depending on the MCP protocol specifically that we want to use. Now HTTP streamable is the de facto standard protocol for MCP. So this is the command that I'm going to run myself. So, I followed the instructions in this readme to get everything up and running locally already. So, now I can run Docker MCP Gateway and I'm going to run it on port 8089 and I'm going to use the streaming transport layer for MCP. So, I'll run this and it's going to look at my Docker catalog registry and it's going to figure out the MCP servers that I have connected. So, the exact same ones that we connected within Docker Desktop in the UI with the catalog we have available here. And so it's going to run all of these. And so now we have the server listening on port 8089. It's ready to receive any requests for any of the tools for any of these servers. It is that easy to get this all up and running.

### [19:59](https://www.youtube.com/watch?v=TxlVdB2gmGE&t=1199s) — Docker MCPs with an n8n Agent

And so now in n8n, I'll just show you really quickly. And now we can do this with like any agent that we want. n8n is just like the easiest way to take advantage of this right out the gate. So I have a chat trigger that goes to a super basic AI agent. Like this is like extremely barebones right now. I'm just using GPT-4.1 mini for my LLM. And then for the MCP client, the connection here is host.docker.internal because I have to look outside of the n8n container to my host machine where I'm running the Docker MCP Gateway. And then the port obviously is 8089 because that's exactly what I selected when I ran the gateway. And then the server transport is HTTP streamable. And then everything's running locally. So, I don't have any authentication at this point. Super easy to get it set up. So, I'll go back to the canvas here. I can actually open the chat and show you here. Let's do something like, what Slack channels do I have? I'm not going to do like a whole complex workflow again because we already saw that in action, but we can just quickly see it leverage the MCP client. It used the Slack list channels here. And we have our research channel. Cool. And then I can actually go to the MCP Gateway logs and I can see the logs from the n8n. So, first we have the connection that's made here from n8n and then it's running this specific tool to list the channels that we have, Slack list channels, and it took 1.5 seconds in total. So, absolutely beautiful.

### [21:22](https://www.youtube.com/watch?v=TxlVdB2gmGE&t=1282s) — Docker MCPs with a LiveKit Agent

And I also did a video recently on my channel showing you how to build LiveKit voice agents. And there I did show very briefly using the Docker MCP Gateway to connect to the servers I have in the catalog. And so definitely check out the video I'll link to right here if you want a full guide on building LiveKit voice agents. But right here, I just want to show you another example of using our custom agents to talk to these MCP servers that we've curated. And so in my agent session, I've just added this MCP servers parameter where I'm connected to the same URL that we used in n8n. So again, connected to the same servers that we were using in Claude Desktop and n8n. So in my console here, I can go ahead and run this voice agent and let's see it in action.

>> Hello, how can I assist you today?

>> Yeah, my GitHub username is Colium0000. I want you to search my repos and find the one that has the most stars and tell me what it is.

>> The repository with the most stars under your GitHub username Colium0000 based on the top results is Archon. It is described as the beta release.

That is the right answer. So I'll go ahead and close out of that there. But there you go. We have a live voice agent that is connected to all the servers that we have curated in our Docker catalog.

### [22:35](https://www.youtube.com/watch?v=TxlVdB2gmGE&t=1355s) — Outro

So there you go. That my friend is everything that I have to cover right now for the Docker MCP Catalog. And huge thanks to Docker for actually collaborating with me on this video just to make sure that I was hitting on all of the important features that we have with the MCP catalog. It really is the easiest way to bring external functionality into our AI agents like I showed you in this video. So, if you appreciated this video and you're looking forward to more things AI and AI agents, I'd really appreciate a like and a subscribe.