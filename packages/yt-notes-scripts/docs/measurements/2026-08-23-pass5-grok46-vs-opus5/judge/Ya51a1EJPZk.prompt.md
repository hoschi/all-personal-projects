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

---

# Fassung A

## Worum es geht

Der Sprecher zeigt einen Open-Source-Workflow, mit dem sich kurze Videos (z. B. YouTube Shorts, Erklärvideos) end-to-end per KI erzeugen lassen — Skript, Audio, Animation und Synchronisation. Der Stack kombiniert Claude Code, Hyperframes (Rendering), Eleven Labs bzw. Kokoro (Sprache) und Archon (Workflow-Orchestrierung).

## Besprochene Konzepte

- End-to-end-KI-Videogenerierung — LLMs erzeugen komplette Videos inkl. Animation und synchronem Audio. Siehe [[Bild und Video Generierung mit KI]].
- AI Coding Harness / Workflow-Engine — Orchestrierungsschicht für mehrstufige, durchhaltefähige und parallele Agent-Workflows. Siehe [ai-agent-harness-konzept](obsidian://open?vault=knowledge-base&file=ai-agent-harness-konzept).
- Claude-Code-Skill als Workflow-Kapsel — der gesamte Ablauf steckt in einem Skill, der in den Harness eingebettet ist. Siehe [claude-code-skills](obsidian://open?vault=knowledge-base&file=claude-code-skills).
- Template-System — Vorlagen bestimmen Länge, Inhalt, Stil und Szenen des Videos.
- Prompt-Engineering für Text-to-Speech — Tags, Pausen und natürliche Abkürzungen im Skript optimieren die Sprachausgabe.
- Audio-getaktete Szenen-Synchronisation — das Animationstiming wird an das zuvor erzeugte Audio angepasst.
- Themen-Recherche mit Anti-Fabrication-Gate — der Agent recherchiert das Thema, statt zu halluzinieren.
- Preview-vor-Render-Workflow — eine HTML-Preview erlaubt Reviews und Anpassungen, bevor das finale MP4 gerendert wird.
- Isolierte Run-Umgebung — pro Video-Run eine eindeutige ID und ein eigener Ordner für alle Assets.

## Behauptungen

- Vor wenigen Monaten hätte der Sprecher LLM-getriebene End-to-end-Videogenerierung noch für nicht praxistauglich gehalten; das ändere sich nun schnell. ([0:00](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=0s))
- Der gezeigte YouTube-Short sei vollständig von KI erzeugt, inklusive Audio, das mit allen Übergängen synchronisiert ist. ([0:00](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=0s))
- Hyperframes sei das zentrale Tool, das die Render-Engine und den gezeigten Editor liefert. ([0:00](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=0s))
- Hyperframes sei vergleichbar mit Remotion, aber laut Sprecher ein deutlicher Fortschritt in der Zuverlässigkeit. ([0:00](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=0s))
- Remotion sei vor einigen Monaten als erstes Tool mit Skill viral gegangen, das Claude Code Videos erzeugen ließ, sei in seiner Erfahrung aber nicht sehr zuverlässig gewesen. ([0:00](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=0s))
- Das Repo sei Open Source und in unter 10 Minuten lauffähig. ([0:00](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=0s))
- KI-Videos seien noch nicht perfekt (Stimm-Inflektion, leicht ungelenke Übergänge), würden aber sehr schnell besser. ([1:39](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=99s))
- Der Sprecher betrachte das Projekt als laufendes Experiment, nicht als out-of-the-box-Produktionsqualität. ([1:39](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=99s))
- Alles sei kostenlos außer optional Eleven Labs; mit Kokoro sei es komplett gratis. ([2:45](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=165s))
- Drei Default-Templates würden mitgeliefert, vor allem als Beispiele zum Einstieg. ([2:45](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=165s))
- Archon unterstütze parallele Workflow-Ausführung, sodass mehrere Videos gleichzeitig generiert werden könnten. ([5:10](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=310s))
- Als Datenbank gehe SQLite, oder für mehr Zuverlässigkeit Postgres (er nutze Neon); der Workflow-State werde persistiert. ([5:10](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=310s))
- Das 25-Sekunden-Demo sei ohne Iteration und mit wenig Content-Vorgabe entstanden; Audio, Übergänge und Synchronisation seien laut Sprecher sehr gut gewesen. ([6:01](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=361s))
- Hyperframes nutze reines HTML für die Komposition, was leicht zu erstellen und anzupassen sei. ([6:51](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=411s))
- Der Preview-Modus sei direkt in Hyperframes eingebaut und kein selbstgebautes Dashboard. ([6:51](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=411s))
- Das volle Skript werde in einem einzigen Call an Eleven Labs gesendet. ([6:51](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=411s))
- Claude Code prüfe das Video Frame für Frame auf Layout-Overflow. ([6:51](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=411s))
- Granulare Anpassungen seien ohne kompletten Re-Render möglich. ([6:51](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=411s))
- Geklonte Eleven-Labs-Stimmen zuverlässig zu machen erfordere viel Aufwand. ([11:00](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=660s))
- Eigene Templates baue Claude Code über einen Frage-Antwort-Prozess; das neue Template defaulte z. B. auf ~50 Sekunden statt 25–30. ([12:08](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=728s))
- Ein guter Use Case sei, sich neue Claude-Code-Features per kurzem Erklärvideo erklären zu lassen, statt längere YouTube-Videos oder Docs zu konsumieren. ([14:22](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=862s))

## Demos / Schritte

Setup (einmalig):

1. Repository per `git clone` klonen und ins Verzeichnis wechseln.
2. Claude Code im Repo öffnen.
3. Prompt senden: „Read the readme, set up everything so I can generate my first video" plus die Idee oder eine URL.
4. Optional einen zweiten Prompt für die Anpassung von Stil, Theme und Szenen schicken; ein Template wählen (z. B. das Anthropic-/classic-Template).

Workflow (vom Skill ausgeführt):

1. Eindeutige Video-ID erzeugen und isolierten Ordner für den Run anlegen.
2. Template in den Run-Ordner kopieren und Video-Metadaten setzen.
3. Thema recherchieren (mit Anti-Fabrication-Gate).
4. Aus der Recherche ein Skript erstellen — inkl. Tags, Pausen und Abkürzungen zur TTS-Optimierung.
5. Audio in einem einzigen Call an Eleven Labs (oder Kokoro) erzeugen.
6. Animationstiming an das Audio anpassen (Pacing der Szenen).
7. `index.html`-Komposition in Hyperframes bauen.
8. Linting sowie Layout-Overflow-Check Frame für Frame durchführen.
9. Preview (localhost-Seite) öffnen, reviewen und ggf. inline anpassen.
10. Nach Zufriedenheit das finale MP4 rendern.

## Genannte Tools

- Hyperframes — HTML-basierte Render-Engine mit eingebautem Editor/Preview, Kern des Stacks.
- Claude Code — Coding-Agent, der den gesamten Workflow ausführt.
- Archon — Open-Source-AI-Coding-Harness / Workflow-Engine zur Orchestrierung (Parallelität, Durability).
- Eleven Labs — Text-to-Speech für die Stimme (kostenpflichtig, API-Key nötig).
- Kokoro — kostenlose Text-to-Speech-Alternative.
- Remotion — programmatisches Video-Framework, nur als Vergleich genannt.
- Neon — serverlose Postgres-Datenbank für den Workflow-State.
- SQLite / Postgres — Datenbank-Optionen für die Workflow-Runs.
- Excalidraw — für ein Erklärdiagramm des Workflows genutzt.

## Verwandt

- [[The Next Evolution of AI Coding Is Harnesses - Here's How to Build Them]] — erklärt das Harness-Konzept hinter Archon ausführlich.
- [[Datenbanken für private und Open Source Projekte]] — Einordnung der DB-Wahl (SQLite vs. Postgres/Neon) für Open-Source-Projekte.
- [claude-code-updates-2026](obsidian://open?vault=knowledge-base&file=claude-code-updates-2026) — dokumentiert neuere Claude-Code-Features wie das im Video demonstrierte Agent View.

---

Hinweis: Die Datei sollte unter `shared/youtube/<channel>/<title>.md` landen — Channel und exakter Titel waren im Input nicht enthalten, daher habe ich nur den Inhalt erzeugt. Sag mir den Channel-Namen, dann lege ich die Datei direkt im Vault an.

---

# Fassung B

## Worum es geht
Cole Medin zeigt einen Open-Source-Workflow, mit dem sich kurze Videos (YouTube Shorts, Erklärvideos) end-to-end per KI erzeugen lassen: Skript, Audio, Animation und Synchronisation. Der Stack kombiniert Claude Code, Hyperframes, Archon sowie Eleven Labs oder Kokoro.
## Besprochene Konzepte
- End-to-End-KI-Videoerzeugung — LLMs erzeugen Animation und Audio in einem Durchlauf; der Sprecher hält das inzwischen für praxisnah.
- Hyperframes als HTML-Compositor — Szenen sind HTML; Render und Preview-Editor stecken im Tool.
- Remotion-Vergleich — Remotion war laut Sprecher das erste Tool mit einem Skill für Claude-Code-Videos, in seiner Erfahrung unzuverlässiger als Hyperframes.
- [claude-code-skills](obsidian://open?vault=knowledge-base&file=claude-code-skills) — der Ablauf steckt in einem Claude-Code-Skill, der in einem Archon-Workflow für Parallelität und Dauerhaftigkeit hängt.
- Playbook und Template — template-spezifische Anweisung, wie Kokoro oder Eleven Labs mit Hyperframes zusammengefügt werden; bestimmt Szenen und Länge.
- Isolierter Workflow-Lauf — eindeutige Video-ID, Template-Kopie in einen isolierten Ordner, Assets und Output an einem Ort.
- Anti-Fabrication-Gate — Recherche vor dem Skript, damit Claude Code das Thema nicht halluziniert.
- [[Text to speech]] — Skript mit Tags, Pausen und natürlichen Abkürzungen für Eleven Labs oder Kokoro.
- Audio-getaktetes Pacing — Szenen-Timing in Hyperframes wird am fertigen Audio ausgerichtet, bevor gerendert wird.
- Layout-Overflow-Prüfung — Claude Code prüft Frame für Frame, ob Text oder Grafik aus Containern läuft.
- Hyperframes-Preview — localhost-Dashboard für Audio, Soundeffekte, Slides und Animationen vor dem MP4.
- Granulare Nacharbeit — einzelne Inflection- oder Übergangsprobleme korrigieren, ohne den ganzen Render neu zu fahren.
- Custom Templates — die drei mitgelieferten Templates sind Beispiele; Claude Code baut per Fragenkatalog eigene (Stil, Komposition, Länge).
- Agent View — vom Sprecher als neueste Claude-Code-Funktion vorgestellt und als Demo-Thema genutzt.
- Parallele Workflow-Ausführung — Archon kann mehrere Videoläufe gleichzeitig fahren.
## Behauptungen
- Vor wenigen Monaten hätte der Sprecher gesagt, LLMs können noch keine vollständigen Videos mit Animation und Audio in brauchbarer Qualität erzeugen; das ändert sich schnell. (0:00)
- Das gezeigte YouTube Short ist vollständig KI-generiert, inklusive synchronem Audio. (0:00)
- Hyperframes ist der größte Baustein: Szenen rendern und der Editor. (0:00)
- Remotion ging vor ein paar Monaten viral als erstes Tool mit einem Skill, der Claude Code Videos erzeugen lässt; in seiner Erfahrung nicht am zuverlässigsten. Hyperframes ist ein Schritt nach oben. (0:00)
- Open-Source-Repo: den Coding-Agent einrichten lassen, eigenes KI-Video in unter 10 Minuten. (0:00)
- KI-Videos sind noch nicht perfekt (Stimm-Inflection, etwas ungeschickte Renderings und Übergänge), werden aber schnell gut genug für Team-/Community-Explainer und YouTube Shorts. (1:39)
- Das Repo ist auf YouTube Shorts spezialisiert. (1:39)
- Der Sprecher betrachtet das eher als laufendes Experiment als als Production-Qualität out of the box. (1:39)
- Input ist eine Idee oder eine URL (z. B. Blogpost-Explainer); der Workflow macht Skript, Audio, Visuals, Sync und ein fertiges Video zum Review. (2:45)
- Setup: `git clone`, Claude Code im Repo öffnen, Prompt in zwei Sätzen: README lesen, alles einrichten, erste Video-Idee oder URL. (2:45)
- Der Sprecher nennt das eine Vereinfachung; Stil, Theme und Szenen will man laut ihm oft noch anpassen — dafür gibt es einen zweiten Prompt. (2:45)
- Alles ist kostenlos, außer optional Eleven Labs (API-Key); Kokoro macht den Stack komplett kostenlos. Hyperframes und Archon sind kostenlos. (2:45)
- Drei Default-Templates liegen bei; der Sprecher rät, den Coding-Agent daraus ein eigenes Template bauen zu lassen. (2:45)
- Demo-Lauf: README, Setup, Thema Claude Code Agent View, Anthropic-Template. (2:45)
- Assets liegen pro Lauf in einem Ordner. (5:10)
- Archon ist sein Open-Source-Harness-Builder, wichtiger Teil des Stacks; der Coding-Agent installiert es, leichter Footprint. (5:10)
- Workflow-DB: SQLite oder Postgres; er nutzt Neon und persistiert jeden Videolauf dort. (5:10)
- Archon unterstützt parallele Workflow-Ausführung, mehrere Videos gleichzeitig. (5:10)
- 25-Sekunden-Demo ohne Iteration und mit wenig inhaltlicher Vorgabe: Audio perfekt, Transitions gut, Sync sehr gut; Validation steckt im Workflow. (6:01)
- Der gesamte Workflow ist dieser Claude-Code-Skill, gewrappt im Archon-Workflow für Parallelität und Durability. (6:51)
- Das Playbook sagt Claude Code, wie Kokoro oder Eleven Labs und Hyperframes zusammengefügt werden; es ist template-spezifisch. (6:51)
- Hyperframes-Komposition ist HTML. (6:51)
- Die Preview ist in Hyperframes eingebaut, kein selbst gebautes Dashboard, erreichbar als localhost-Seite. (6:51)
- Der Sprecher vermutet, das erste Video sei meist nicht perfekt; Anpassungen an Information, Transitions und Szenen seien nötig. (6:51)
- Granulare Korrekturen gehen ohne kompletten Re-Render. (6:51)
- Eine geklonte Eleven-Labs-Stimme zuverlässig zu machen, kostet laut Sprecher viel Arbeit; im Archon-Explainer nutzt er deshalb eine generische Stimme. (11:00)
- Den 30-Sekunden-Archon-Explainer findet er insgesamt etwas zu langsam, die Erklärung aber gut. (11:00)
- Die drei mitgelieferten Templates sind nur Startbeispiele. (12:08)
- Custom-Template-Bau: Claude Code liest das README und stellt Fragen; er wollte einen Explainer mit Before/After-Diagrammen, Analogy-Panels, clean und educational, Scope Architectures and Techniques. (12:08)
- Ergebnis: Template „concept short“, Default etwa 50 Sekunden statt 25 bis 30. (12:08)
- In einer neuen Session genügt „create a video on MCP“: README, verfügbare Templates, Wahl des neuen Templates. (12:08)
- Weiterer Use Case: eigene Explainer für neue Claude-Code-Features (z. B. Agent View) in 30 bis 60 Sekunden statt längeres YouTube oder Docs. (14:22)
- Kostenlos, laut Sprecher in 15 Minuten oder weniger lauffähig. (14:22)
## Demos / Schritte
1. Repo-URL kopieren und `git clone` (im Video nicht ausgeführt, Repo war schon da).
2. Ins Verzeichnis wechseln und Claude Code im Repo öffnen.
3. Prompt: README lesen, Setup für das erste Video, Idee oder URL; optional zweiter Prompt für Stil, Theme und Szenen.
4. Agent installiert Dependencies; Eleven Labs optional mit API-Key, sonst Kokoro.
5. Beispiel-Lauf: Thema Claude Code Agent View, Anthropic-Template.
6. Isolierten Asset-Ordner pro Lauf zeigen.
7. Neon mit persistierten Runs zeigen; parallele Ausführung ansprechen.
8. 25-Sekunden-Short zu Agent View abspielen (ohne Iteration).
9. Excalidraw-Ablauf: eindeutige Video-ID (isolierte Umgebung, Speichern in Neon).
10. Template in den isolierten Ordner kopieren, Video-Metadaten setzen.
11. Thema recherchieren, Anti-Fabrication-Gate.
12. Skript mit TTS-Tags, Breaks und Abkürzungen schreiben.
13. Einen Eleven-Labs-Call für das volle Skript, Audio holen.
14. Animation-Timing an das Audio anpassen, `index.html` in Hyperframes bauen.
15. Linting, Layout-Overflow, Frame-für-Frame-Check durch Claude Code.
16. Hyperframes-Preview im Browser, inline Änderungen im Dashboard.
17. MP4 erst rendern, wenn Preview passt; einzelne Stellen nachziehen ohne Full-Rerun.
18. 30-Sekunden-Archon-Explainer mit Custom-Template und generischer Eleven-Labs-Stimme abspielen.
19. Custom-Template: README lesen, diesmal Template bauen statt Setup.
20. Fragen beantworten (Explainer-Stil, Before/After, Analogy-Panels, Scope).
21. Claude Code erzeugt das Template „concept short“ (~50 s).
22. Neue Session: Video zu MCP anfordern; das neue Template wird gewählt.
## Genannte Tools
- Hyperframes — HTML-basiertes Render- und Preview-Tool für Szenen.
- Remotion — Vergleichsprodukt; Skill für Claude-Code-Videos.
- [claude-code-overview](obsidian://open?vault=knowledge-base&file=claude-code-overview) — Coding-Agent, führt Skill, Setup und Workflow aus.
- Eleven Labs — TTS, optional kostenpflichtig per API-Key.
- Kokoro — kostenlose TTS-Alternative.
- [[Introducing Archon - The Revolutionary Operating System for AI Coding]] — Open-Source-Harness-Builder und Workflow-Manager.
- Neon — Postgres-Hosting; persistiert Workflow-Runs.
- [[sqlite]] — lokale Alternative für Workflow-State.
- Postgres — vom Sprecher als zuverlässigere Alternative zu SQLite genannt.
- Excalidraw — Diagramm des Workflows.
- Git — Repo klonen; im Archon-Explainer außerdem isolierter Git-Worktree pro Task.
## Verwandt
- [[The Next Evolution of AI Coding Is Harnesses - Here's How to Build Them]] — Archon als Harness-Builder, der hier den Video-Workflow orchestriert.
- [[MCP]] — Beispiel-Thema, für das der Sprecher das neue Concept-Short-Template nutzen will.
- [[RAG]] — weiteres Beispiel-Thema neben Attention und MCP.
- [[Datenbanken für private und Open Source Projekte]] — SQLite- versus Postgres-Wahl, hier für persistierte Archon-Läufe.
