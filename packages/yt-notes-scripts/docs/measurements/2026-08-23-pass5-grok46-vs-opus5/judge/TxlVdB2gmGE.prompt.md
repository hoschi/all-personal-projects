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

---

# Fassung A

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

---

# Fassung B

## Worum es geht

Cole Medin stellt den Docker MCP Catalog vor — eine kuratierte Liste von MCP-Servern, die sich per Klick aus Docker Desktop heraus mit KI-Clients wie Claude Desktop, Claude Code oder eigenen Agenten verbinden lassen. Er baut damit einen End-to-End-Workflow von der Recherche bis zur automatisch erstellten Pull Request.

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
