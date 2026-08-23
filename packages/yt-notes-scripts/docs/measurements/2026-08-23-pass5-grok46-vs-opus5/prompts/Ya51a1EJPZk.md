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
### [0:00](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=0s) — AI Video Generation is Realistic Now

If you were to ask me, even a few months ago, if LLMs are able to generate full videos with animation and audio end-to-end, I would have said, "Not yet. It's theoretically possible, but you're not going to get the best output." But, just like everything else in the AI space, this is changing very quickly. This is what I'm going to show you how to do in this video. But, this YouTube short that I'm showing you right here is generated entirely by AI, including audio that I just have muted right now that syncs with all the transitions, everything that you're seeing on the screen. And there's a few different technologies that I've stitched together to make this happen. It's super cool. And the biggest kid on the block here is Hyperframes. This is what lets our AI engines render these scenes and have that editor that I was just showing you. So, this is kind of like Remotion. It went viral a couple of months ago for really the first tool that had a skill giving Claude Code the ability to generate videos. It wasn't really the most reliable in my experience. Hyperframes is definitely a step up. And so, I've taken Hyperframes and I have combined it with a couple of things. So, obviously Claude Code, and then I'm using Eleven Labs for my voice, Kokoro if you want something free, and then I'm using Archon as the workflow manager to orchestrate everything. And so, I have this as an open-source repository. You can download and try this right now. Literally, just ask your coding agent to set it up and you can have your own AI-generated video up and running in less than 10 minutes. I'm going to show you how to do that and exactly how this workflow works. It's pretty cool how we do the scripting and then we sync the audio with the different scenes. A lot of customizations you can do for this as well.

### [1:39](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=99s) — State of AI Video (Not Perfect but Really Good)

So, I want to start by saying that AI-generated videos are not perfect yet, but man, are they getting good. There are still some issues with voice inflection, slightly awkward renderings or transitions, but it is getting to the point very quickly where there are some real use cases for AI-generated videos, especially just creating explainers for your team or a community, whatever. Even just creating YouTube shorts, like that's what this repository is specialized in right here. And so, I would consider this more an ongoing experiment versus something that you can use and expect to get production quality right out of the box, but I have also made it really easy for you to not just try this quickly, but also customize it to your own needs. And that's what I'll talk about in this video as well.

### [2:45](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=165s) — Setting up the AI Video Gen Workflow

And so, literally, once you have it set up and you can ask your coding agent to do so, all you have to do is give it an idea. This can also be a URL, like if you wanted to create an explainer for a blog post, for example, and it's going to go through the full workflow of scripting it out, generating the audio, rendering the visuals, and syncing everything together, giving you the final video ready for you to review and iterate on, and then post once you are ready. And so, all you have to do is start by cloning this repository. So, I'll grab the URL here, and then you'll just run a git clone with that URL. I'm not going to do it here cuz I already have it cloned. Change your directory into there, and then open up Claude Code in the repository. And then, like I show in the read me, all you have to do to get everything set up and generating your first video is send in this prompt. Just two sentences. Read the read me, set up everything so I can generate my first video, and then you give it the idea or the URL that you want to generate the video around. It is that easy. Now, obviously, this is a bit of an oversimplification. You're probably going to want to customize the style and the theme and the scenes. That's what the second prompt is for. But, either one, you send it in, and now the rest of the read me, I know it's pretty long here, but it's really just instructions for your agent to walk you through everything. It'll install all of the dependencies, and everything is free unless you want to use Eleven Labs, which it'll walk you through setting up your API key and everything if you do want to use Eleven Labs. But, if you want to use Kokoro to make it completely free, you definitely can because Hyperframes for the rendering, and then Archon, which is my harness builder, this gives us the workflow engine. All of this completely free to get up and running. So, very easy to get started. I'll talk about how you can customize things in a little bit as well. So, for example, with the video that I showed you at the start, I just said read the read me to set up everything. The topic is a Claude Code Agent View. This is the latest edition of Claude Code. It's pretty powerful. So, I thought it'd be a good demo for our video here. And then I'm telling it to use the Anthropic template. So, obviously, we need some kind of template that dictates the length and the content, what's rendered, and the style. So, there's three that I have shipped by default that you can use. I would also highly encourage you to just point your coding agent to look at these for inspiration and tell it to make one that is styled in the way you want it with the length and the content that you want. Very easy to do that. So, I just ran this with one of the default ones and it goes through the entire workflow. Simple request leads to this entire workflow being executed here. All the steps that I'll explain after our quick demo here.

### [5:10](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=310s) — The Workflow Engine (Archon)

And so, it's going to generate all of the assets just self-contained in a single folder. So, it's really easy to manage everything per run. So, we have all the web research going into the script. Then it creates the audio and the assets and composition. It syncs everything together with transitions. Very comprehensive workflow here. Definitely needs a harness to guide everything. And so, that's where Archon comes in. It's my open source harness builder. I've covered a lot on my YouTube channel. It's not really the point of this video, but it is an important part of the tech stack here. So, this is one of the things that your coding agent will install for you. Very easy and has a light footprint as well.

Just an important part of the stack here. And then for the database that manages all the workflow runs, you can use SQLite. Or if you want something a bit more reliable, you can also use Postgres like I'm using Neon here. So, every single video that I generate, the workflow state and everything is persisted into my Neon database. You can see all of my individual runs. And also, because we're using Archon here, it supports parallel workflow execution. And so, I can also generate a lot of different videos at the exact same time if I wanted to do so.

### [6:01](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=361s) — AI Video Demo

But anyway, right here I'm just generating one video. So, let me go ahead and just shut up, play this for you so you can see the 25 seconds that Claude Code generated with this workflow. All right, here we go.

>> Claude Code just went async. Agent View manages all your running sessions from one terminal.
One command, Claude agents. Track all six session states at a glance.
See every agent's status in real time. Send sessions to the background and return when needed. Use /goal for fully autonomous runs. Try it now at anthropic.com.
Follow for more Claude Code updates.

>> All right. That is not bad at all, especially cuz I did no iteration on it, and I really didn't give it much guidance for the actual content that I wanted. And so, I could have taken that a lot further as well to make it more concrete. But that's good. Like the audio was perfect, the transitions were great, everything was synced phenomenally. That's part of the validation that's built into the workflow as well.

### [6:51](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=411s) — Deep Dive into the Workflow

So, pretty much the entire workflow can be boiled down into this Claude Code skill that's wrapped in the Archon workflow for parallel execution and durability. And so, this accepts as input what you want to generate the video on. We have our core mission here, and then we have the playbook. This is what tells Claude Code how we're going to use Kokoro or Eleven Labs, how we're going to use HyperFrames, how we're going to stitch everything together. And this is custom to the template that I'm using. And so, this is one of the files that you'll customize when you want to change the scenes and the length of the video, everything like that. So, this is for the classic template that I used to generate that Claude Agent View video. And so, of course I got an Excalidraw diagram just to really quickly explain everything that goes in this. So, I think you'll really appreciate the workflow when you see how much prompting and step-by-step process that we have laid out here. And so, we're going to start by creating a unique identifier for the video. This is how we can create an isolated environment to manage everything in the Archon workflow. Also, so that we can have the execution saved in our Neon database here.

So, we create the ID and then we're going to copy the template in the isolated folder for this workflow run. Cuz remember, we're managing all the assets and the output and everything in a single place. So, we copy the template as a starting point, set the video metadata, and then we're going to research the topic. We don't want to assume that Claude Code knows everything about the topic we're going to generate the video on. So, it needs to do research. We have an anti-fabrication gate as well, so it's not just hallucinating everything. And then from the research, it's going to create the script. And the cool part here is the script is more than just the text that we're going to say. There is a lot of prompt engineering that goes into adding in tags and breaks and natural abbreviations to really optimize for our text-to-speech once we pass things into Eleven Labs or Kokoro. And so, once we have everything ready, then we're going to make a single call to Eleven Labs, send in the full script, get the audio out, and then we're going to sync the animation timing to the video. And so, before we really start rendering things, we're going to decide, okay, based on the audio here, how do we have to pace the different scenes that we want to create with HyperFrames. And so, then we create this index.html. This is what I love about HyperFrames. It's literally just HTML. It's super easy to create and mold. So, we build the composition based on the audio. We do some linting, so just making sure that our audio is good, the transitions are good, everything like that. We inspect for the layout overflow just to make sure that there are no text or visual elements that bust out of their containers. So, basically we have Claude Code look at it frame by frame to make sure everything looks good for the entire video. And then we open up the preview. And so, this is what I was showing in the browser earlier. I'll pop back over to that. We have this preview mode that's built right into HyperFrames. This is not a dashboard that I had to build myself. This allows us to see the sound effects here and the audio and then we can obviously scroll through this and see the different slides and animations. And so, we have the opportunity here to review things and make adjustments before we actually have it render the full MP4. So, we can even change things in line here in the dashboard. It's really, really cool. So, this is a big part of the workflow as well. That's why I love HyperFrames. And so, we have the preview URL. So, this is just like a localhost browser page that we can open. And then once we're happy with everything and maybe we've iterated with Claude Code, then we can create the MP4. And so, this is our opportunity here to say like, "Hey, the audio has a weird inflection at this point or the sound effect is really awkward for the transition here." Like whatever we want, we don't have to rerun the entire render. Claude Code with this whole workflow that I have set up for you in the skill, it's able to make those granular adjustments because the video is probably not going to be perfect on its first pass. The information, the transitions, the scenes, whatever, you're probably going to have to make some adjustments. But you can do all that and then render the final MP4 when you are happy.

### [11:00](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=660s) — Archon Explainer Demo

Cool. And just for fun, let me show you another video that I generated with a custom template that I created. And I'll show you at the end here how to create templates as well. So, this is a template for Archon. And this video is just a 30-second explainer for what Archon is. I also tried to use one of my cloned voices in Eleven Labs, but it actually takes a lot of work to make that reliable. So, just to show you something more fleshed out here, I have one of the more generic voices. But take a look at this. It's actually really good.

>> Archon is an open-source AI coding harness built with Claude Code. Generic workflows isolated running in parallel.
21,000 GitHub stars and counting.
One isolated Git work tree per task, clean, safe, and fast.
Three core workflows out of the box.
PIV, plan, implement, validate.
Fix, turn GitHub issues into a PR.
Review with five parallel agents.
Start free at archon.diy.
One command and your AI dev team is ready.

>> All right, pretty good. A little slow-paced overall, but I like the explanation quite a bit. So, there you go. A couple of examples there.

### [12:08](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=728s) — Building Custom Templates

Now, the last thing that I want to show you, just so you can really take this as your own, I want to talk about how you can build your own templates. So, I want to reiterate that the three templates that ship with this repo for you are really just examples to get you started. When you want to build your own videos, really what you do is you have Claude Code read the read me, but instead of helping you with the setup, now it's going to help us build our own template. And then it just grabs an example here. I'm saying that I want a template for explaining tougher AI concepts or tougher to understand concepts. And so now this is going to really kick off a process where Claude is going to go through a set of questions to understand what we're going for here and then build that custom template for us. And so first it asks like you know out of the ones that shipped, what are the ones that match what we're looking for the most. I'm really saying I want something pretty new here. I need a new explainer style video. And I want diagrams of before and after, analogy panels for the brand. I just want something clean and educational. And then for the topic scope, let's just say that I want to cover architectures and techniques in the AI space. So I'll submit this. Maybe it'll ask me some more questions. Maybe it'll get right to creating the template. Just take your time, go through this process. I'll come back once this is done and I have a new template to show you. And boom, there we go. After quite a bit of work cuz there's a lot that goes into creating these templates, Claude Code has created the new concept short template for me. So, now I can ask it to create videos to explain things like RAG, attention, MCP, and it'll know to use this template out of all of the other ones. And so, if I go to like even a brand new Claude Code session here and I say create a video on MCP, it'll know because of the project we're in right now, like okay, we got to read the read me, then let's look at the templates that are available and pick the right one, and it will pick the one that we just created here. And so, now we have a template that's customized to these kinds of videos. Like for example, we're defaulting to the 50-second range instead of like 25 to 30 seconds like the other template. So, we can change style, composition, length, everything to fit the exact kind of video that you want to generate.

### [14:22](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=862s) — Final Thoughts

So, just trying to show you at the end here how you can really take this and run with it to create any kinds of videos that you want with Archon, HyperFrames, and Claude Code. So, there you go. That is how you can generate videos pretty reliably now with Claude Code, audio, animations, everything. And one really cool use case I didn't talk about earlier is you can even use this to generate explainer videos for just yourself. Like when a new Claude Code feature comes out, like Agent View for example, just have it explain it to you in a minute or 30 seconds instead of watching a longer YouTube video or going to the Claude Code docs. Of course, that's useful as well, but it's just a really cool use case for something like this. And it's so easy to get this up and running. I would highly encourage you just try this. It's free. Get it up and running in 15 minutes or less. Generate some videos and just have fun with this. And so, if you appreciated this video and you're looking forward to more things on Claude Code and AI coding, I would really appreciate a like and a subscribe. And with that, I will see you in the next video.