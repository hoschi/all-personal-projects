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

### [0:00](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=0s) — Agent Teams Demo

I just pasted in this message and I'm shooting it off to Claude and it says, create a team called Neuroflow of three teammates using Sonnet. The first one is a front-end developer, the second one is a back-end developer, and the third one is a QA agent. So, this now invoked a tool called team create. And you can see that what it's doing is now that it's created this team, it's spawning up three teammates in parallel. And these are all individual agents. So, right now we can see we have our front-end developer, we have our back-end developer, and we have our QA agent. So, what's happening is right now we have these three agents working together with our main session. They all share a task list, they can talk to each other, and I'm going to check back in with you guys once this is done.

Okay, so this is really interesting. The front-end and back-end developer sent work over to the QA agent, and then the QA agent found three critical issues. So, the main agent said that it's going to send all of this work right back to those first two agents to take another pass at it. So, here's where you can see it sent off those messages to the front-end developer, the back-end dev, and the QA. And now they're all back to work once again. And there we go, the second time the QA agent gives it a pass. All three of those critical issues have been resolved. And then it was able to basically one-shot this website.

Now, obviously there are some things that aren't perfect about this and we'd want to go back and iterate, but considering in the prompt all I said was to build me a landing page for a fictional AI startup and we get all of this text, we get these animations, we get all of this stuff to come in dynamically, and it feels pretty polished. It came up with all the copy, the color scheme, all of it. This is truly one of the most powerful AI agent features I've ever used, but you have to know how to use it right, which is why in today's video I'm going to explain everything you need to know, what they are, how to set them up, how to use them, when not to use them, everything that you need. So, let's not waste any time and get straight into the video.

### [1:24](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=84s) — What Are Agent Teams

So, agent teams. As you guys saw in the demo, we had one get spun up called Neuroflow, and in that team we had three agents. We had the front-end dev, the back-end dev, and the QA. So, what happens is the main orchestrator, the Claude Code session you're talking to, creates these different agents and manages them. But not in the same way that we do sub agents, because sub agents work independently and then they send their individual result back to the main agent. Agent teams have a team lead, maybe like a project manager, and it creates all of these different agents and a shared task list. So, the huge unlock here is that individual teammates can talk to each other. So, sometimes there's a dependency. Teammate one needs something from teammate two, and they can just talk. And you can get in these really cool loops, especially when you have the QA agent like we just saw in the demo, where one of the teammates will basically say, "Hey, this isn't good enough." and send the work back. And then the main agent, like I said, is just making sure that the tasks are getting done and that they're all high quality. So, that's the big difference between sub-agents and agent teams, and I had to clear that up because I know that's probably where there's some confusion.

### [2:29](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=149s) — How to Set Them Up

So, I am going to break more stuff down, but what I want to do first is just show you guys how to set this up because I think the best way to learn is just to be able to play around with stuff. And all you have to do to set this up is add one environment variable into your project setting. So, let me show you how that works right now.

All right, here I am in Claude Code. I like to use it in VS Code, but you can use the agent teams feature wherever you decide to use Claude Code. You can see that I am in a brand new project with nothing in it. So, this is exactly what one of you guys' setup should look like if you want to follow along. So, like I said, we need to enable the feature, and I'm going to do that in this demo on the project level. So, what I'm going to do is go to the official Claude Code documentation for agent teams, and you can see right here that it says they are disabled by default because it's an experimental feature. So, you have to enable them by adding this variable into your settings.json. So, what I'm going to do is literally just copy this JSON right here and come into Claude Code and say, "Hey, I need you to put this in our local settings in this project." and then just paste in that JSON prompt. And I'm going to go ahead and shoot that off, and that should basically be able to create that file for us. So, you can see that it set everything up. We now have a .claude folder. If I click in here, we have a settings.local.json, and it has put that command in there. And now our project should be set up to actually be able to use agent teams.

Now, before we dive in and I start showing you guys how to do that, there is one thing that I recommend doing first. And that's basically training your Claude Code project on how agent teams work so that they can actually be used as effectively as possible. So, the easiest way to do this is you go to the documentation on agent teams, you take the URL, and you copy it. And then I said, "Hey, create me a master reference guide for agent teams in a folder called docs. This will be used to help you build better and more effective agents in the future." And now it's going to read through that documentation. And now if you ever have questions about agent teams or if it ever needs to look up something while it is building them, it already has that locally here stored as markdown. So it's going to be much quicker. And it just created this documentation about enabling them, when to use them, display modes, task management, hooks, best practices, tons of stuff like that. And that can be found in the docs folder in this section, which is a full markdown file with hundreds of lines. And that's just a little tip. That's something that I like to do whenever I have like maybe a big MCP server or certain documentation that I know it might need to look at constantly.

### [4:32](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=272s) — How to Prompt Agent Teams

So now that we're pretty much set up and ready to start building, let's talk about prompting. How do we actually tell Claude Code to build us agent teams, but not just to build them, but to actually make them really good to give you what you want. Because the truth about agent teams is that they are more expensive and they are a bit slower, but you do get much higher quality if you use them right.

Now the good news is you can pretty much invoke them just using natural language. So I kind of follow this pattern. Create a team of X number of agents using X model. So Haiku, Sonnet or Opus. And then you basically just say the agents that you want. You would say the first agent is X role. This agent should be doing this and it should produce me this. It can talk to the other agents to do X, Y and Z. And so pretty much just listing that out in natural language. Whether that be an API designer, a database engineer and/or a test writer.

So let's take a real quick look at an example prompt. So I'm going to read this full one out. Now what you'll notice is I start off by establishing a goal. The reason I do this is because when the agents wake up, they have no context. They basically only get the prompt that the main session feeds into them. So if we tell the main agent a goal to give to the sub agents, they understand a little bit better, you know, like what they're working towards, but also why they have their teammates next to them. So the goal here is to build a working full stack app with a REST API and a React front end. The end result should be a running app that I can view on a local host. It should have users and post functionality plus a QA test report confirming that everything works.

So then I said, "Hey, create me a team of three teammates using Sonnet. The first one's a back-end dev, it should be doing this. The second one is a front-end dev, and it should be doing this. And the third one is a QA agent that should be doing this." You can see that in the descriptions I said, "When you're done, message the front-end dev." And then in this one I said, "Wait for the back-end dev's message, and then you will send all this stuff to the QA." And then I'm saying what the final deliverables should be because the main agent spins these three up, and then it's going to get a bunch of information back. So what do I actually want at the end of the day? I want a running app, I want a report about pass and fail tests, and then I want a doc, which is basically what was built, key decisions, and how we run this moving forward.

### [6:30](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=390s) — Dos and Don'ts

So we're about to hop right back into Claude Code and live prompt an agent. But real quick, let's talk about some dos and don'ts.

So do have each agent own specific files because if you don't do this and agents are sharing files, they might overwrite each other's work, which is not good. Do define the output, don't use vague deliverables. Do name recipients, don't just assume that they're going to understand who to talk to and why. Do have about three to five teammates, don't go for massive agent swarms of 10+. That'll also be 10 times more expensive. And do give full context because of the fact that no history is given beforehand. Now of course, they can still read everything in the project, they can still look through all of those files, but no context is fed in initially. And I will show you exactly what I mean by that when we go in here and spin up a new agent team.

### [7:12](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=432s) — Live Build in VS Code

Okay, so I'm in that project that we set up together. I'm in a fresh session, and I'm going to send off this prompt. I said that the goal is to help me clean up the workspace. We have three agents called research team. We're using Sonnet. We've got a researcher, a strategist, and a critic, and they're basically just going to read through this project and make sure that everything's accurate and make sure that we're set up good.

Let's take a look at what's going on. It's creating the research team, right? So it's created the team, and now we have a to-do list. Now what it's doing is it's going to spawn the three teammates in parallel. And when it spawns these, I'm going to actually show you how. So the first one is a researcher. If I click into this, you can see that this says in. So this is basically saying this is what the main agent sent to the agent. You are the researcher on the research team, here is what your job is, and you have to be thorough and include anything that might be helpful. So this is basically the prompt that spun up that agent. You can see same exact thing happened for the strategist and for the critic. And if I clicked in, we could once again read exactly what they were prompted to do and the step-by-step instructions. Including stuff like when you're done, send your five use cases to the critic teammate using the send message tool. Which once again validates that these agents are able to talk to each other and send messages to each other.

So now we can see that all three of our agents are running and they are all basically just waiting for their turn. And you'll notice what it does is pretty much every time there's a new update, it updates me. So here comes another live update. Let's see if the researcher is finally done. There we go, it's done. So now what happens is we sent a message off to the researcher. And let's go ahead and see what that message actually said. So this is the main agent talking to the researcher. It said, "Did you send your structured inventory to both the strategist and the critic? Please make sure the strategist also received it. You were asked to message both teammates." And then we can see that the researcher confirmed that both teammates received the inventory and now the critic is running.

All right, so everything just finished up. All the reports are here. But real quick, I wanted to draw your attention to this. The main agent said, "Cool, let me shut down the teammates and finalize." I'll touch on this a little bit later, but now the main agent has sent a message to each of them, the researcher, the strategist and the critic, and basically said, "You're done. Save your work." So anyways, we'll come back to that in a little bit, but we now have an output, which is a new document over here, Agent Teams Patterns, and it found a ton of stuff. There were 11 documentation gaps identified that are worth reviewing against your reference doc. So anyways, let's just click into the doc real quick. We're not going to read this whole thing cuz I'm assuming it is super long, but this is the actual output that we just got from this agent team, and you can see that this thing is insanely thorough. So, if you wanted to really, really understand how agent teams work, then spin up an agent team to help you explain agent teams.

### [10:15](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=615s) — Tmux Split-Pane View

Now, what you'll notice here is we were kind of able to see what was going on, but not really under the hood. We couldn't actually tell what the agents were thinking or doing, and that's because we're doing this in the Claude Code extension. If you do this in your terminal, and specifically if you have tmux installed, you can actually see the different agents working and thinking, and you can individually send messages to them. Because right here we're kind of only communicating through the main session, and the main session sends messages to the other ones. But one of the value props of agent teams is that I could individually message a sub-agent if I wanted to. So, let me show you what that looks like.

All right, so right now I'm running Claude Code in a tmux terminal. Now, if you're on Windows, you have to take a little bit of a workaround, but you just have to be in a tmux terminal. So, I'm not going to do a full setup video on it right now, but I literally just had Claude Code walk me through it, and it was super simple. But anyways, what I did here is I just pasted in this prompt, which obviously is like we talked about, we have the goal, we say create me an agent team, and then we have our front-end dev, our back-end dev, and our QA. This is basically the same exact prompt that I ran in the demo, so this isn't to show you the actual deliverable. What I want to show you guys here is the way that we can visually see this.

So, right here what it's going to do is it's going to spin up that agent team for us, right? It's setting up the task dependencies, and it's assigning owners, and now it's spawning those agents. And there we go, we just got our front-end dev created right here, and this is the blue agent. We have another one right here, which is the back-end dev, and this is the green agent. And there we go, we just got our QA agent, which is the yellow one. So, now I very clearly can see what each of these agents is doing, which is super cool. And now if I wanted to, I could come over here, and I could check on the team status with the main session. I could come up here, and I could talk to the front-end dev, I could approve things, or I could give it more info. Same exact thing with the QA, or same exact thing with the back-end dev. So, now I literally have an agent team that I can watch, and I can interact with any of them. And I can also watch them do research, create things, talk to each other. It's super, super cool. So, like I said, I'm not going to run this whole thing out. I just wanted to show you guys that this is possible.

### [11:45](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=705s) — Key Rules for Better Teams

Okay, now that we've seen some cool demos, let's talk about how do we actually make these things better and better and understand a little bit more about what's going on. So, here are three key rules.

The first one is that each of these agents has their own territory. So, they should have their own file and they should be working on their own deliverables. They can send them across and they can communicate, but they should only really all be editing their own thing. The second thing is, once again, direct messaging. They can talk to each other. They don't have to use the middleman of the main session. And then the third piece is that they can be working at the same time. It doesn't have to be agent one hands off to agent two and then agent two hands off to agent three, because that honestly might not even call for an agent team. Agent teams work together in parallel and need to communicate throughout the whole process.

So, what do teammates instantly know when they wake up? Because we know that they don't have any context from the jump. What they do have is they inherit the permissions from the main session. So, if you're on bypass permissions, then all of your agents are going to be on bypass permissions. If you allow all bash commands, then those same permissions will once again be inherited by the teammates. But the other thing to know that's very important is that any of your files, any of your MCP servers, any of your skills, all of the teammates can use and access those things.

We also have a really cool ability to use something called plan approval mode. So, you guys know how I've told you always start in plan mode. If you plan with your main session before anything actually happens, it's way better. What we can do is we can have all of those agent teammates plan first and they have to basically get their plan approved by the main agent before they're actually allowed to go execute. So, it's really cool. You could also set it up where you're actually the one who has to approve every single plan, but I think it's probably better to just have the main session do that. Or maybe even one of the teammates is just the plan reviewer and approver.

### [13:12](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=792s) — Common Pitfalls and Fixes

So, I wanted to talk about some common pitfalls or mistakes that you might be making and what the fix could be for that.

So, the first one is if the agents keep asking permissions and they keep stopping for that. You can pre-approve certain tools. So, that would be in your project settings or your local settings. You can allow certain commands, and that way they won't stop to ask you something every couple seconds. If the deliverables aren't coming out feeling holistic, maybe they're being overridden, so make sure that you assign file owners. If you spin up an agent team and you realize that one of the agents isn't really doing much or is just sitting around, then maybe you want to specifically make sure you're assigning each agent work or some sort of dependency in your plan in your prompt. If you're burning through way too many tokens, just use fewer agents. If it seems like your agents are losing work, then tell them to basically store everything as a temporary file that they can then call on later. And if you're getting the wrong approval and it just seems like it's off, then maybe just try to have you be the one who approves things to start until you understand the flow of how these teams work a little better.

### [14:05](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=845s) — When to Use Agent Teams

All right, so next I wanted to talk about when to use agent teams because like I said earlier, they can be slow and expensive, so you really just want to use them when you need something pretty complex done, and you need lots of different specialized agents. So, think about using them if your specific process or project has multiple areas, and that way you can have one specialized in each of those. If you need those things to be done in parallel. If you need them to be able to react to each other, assign tasks to each other, communicate with each other. And if something needs to be done at a really high quality and you want tons of different steps to make sure, then an agent team is probably a decent idea.

Now, if you have a process that could be done sequentially, meaning every time it basically goes one, two, three, and those steps are dependent on each other, then maybe an agent team isn't the right call. Maybe that's just sub agents. If you need everything in one specific conversation history or one context window, then don't use teams. If you're just kind of working on the same files, don't use teams. And if it's a very simple task, then agent teams would be overkill. There might be a lot of times where you'd be able to use sub agents instead. Like I said, with sequential or if you need a very focused result. If you don't need the agents to communicate, and if you want to save some tokens. Because once again, if you have three sessions running, that's basically going to be three times the cost. So, if you have five, it'll be five times the cost. Which means I like to stay around maybe two to five agents max. You can keep them running parallel.

Otherwise, you can use sub agents and make sure that you are shutting them down if you see them early on going off down the wrong path. Which is another reason why I think it's helpful to use the tmux version, so you can actually see them in that split pane view. And when I say shut down, which is kind of what we saw earlier, I just mean basically at the end of every session saving your work. Because remember right here how we saw the main session say, "Hey, this is a shut down request." The researcher agent here could have said, "I'm not done yet. Let me save stuff. Don't shut me down yet." So when the teammates actually confirm that they're ready to be shut down, that means that everything's good and we can essentially cleanly save that work. So everything gets cleaned up and then we're good to close the session and shut down that agent team rather than just force killing it right away where things might be all out of control and not cleaned up yet.

### [16:08](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=968s) — Outro

Well, all right. That is agent teams. I hope by now you are excited to hop into Claude Code and start building with some agent teams. And if you want to check out other Claude Code stuff that I've been doing to expand your learning, then definitely check out this video right up here. Hopefully I'll see you guys over there, but that is going to be the end of the video. So if you enjoyed it and you learned something new, please give it a like. It definitely helps me out a ton. And as always, I appreciate you guys making it to the end of the video. I'll see you on the next one. Thanks, everyone.

---

# Fassung A

## Worum es geht

Eine Erklär- und Demo-Session zum experimentellen Claude-Code-Feature „Agent Teams": Ein Haupt-Orchestrator spawnt mehrere spezialisierte Agenten, die parallel arbeiten, sich gegenseitig Nachrichten schicken und eine gemeinsame Task-Liste teilen. Der Sprecher zeigt Setup, Prompting, Dos & Don'ts und wann man das Feature besser nicht einsetzt.

## Besprochene Konzepte

- Agent Teams — ein Team Lead (Haupt-Session) erzeugt mehrere spezialisierte Agenten, die parallel arbeiten und eine geteilte Task-Liste haben
- Sub-Agents (Abgrenzung) — arbeiten unabhängig und liefern ihr Einzelergebnis an die Main-Session zurück, ohne Querkommunikation
- Team Lead / Orchestrator — die Main-Session managt die Teammates wie ein Projektmanager und sichert Qualität
- Geteilte Task-Liste — alle Teammates teilen sich dieselbe To-do-Liste
- Direct Messaging zwischen Teammates — Teammates kommunizieren direkt miteinander, ohne den Umweg über die Main-Session
- QA-Feedback-Loop — ein QA-Agent findet Mängel und schickt die Arbeit zur Überarbeitung an die anderen Agenten zurück
- Permission-Vererbung — [01-permission-modes](obsidian://open?vault=knowledge-base&file=team-setup-docs%2Fsicherheit%2F01-permission-modes) — Teammates erben die Permissions der Main-Session
- Plan Approval Mode — Teammates planen erst und müssen ihren Plan genehmigt bekommen, bevor sie ausführen
- Graceful Shutdown — Teammates bestätigen Abschluss/Speichern, statt sofort force-gekillt zu werden

## Behauptungen

- Agent Teams sind eines der mächtigsten KI-Agent-Features, das der Sprecher je genutzt hat — aber man muss es richtig einsetzen ([0:00](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=0s))
- In der Demo fand der QA-Agent drei kritische Issues; nach einem zweiten Durchlauf der beiden Dev-Agenten waren alle gelöst und das Team hat die Landing Page quasi one-shot gebaut ([0:00](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=0s))
- Der große Unterschied zu Sub-Agents: bei Agent Teams gibt es einen Team Lead/Projektmanager und Teammates können direkt miteinander reden ([1:24](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=84s))
- Zum Aktivieren reicht eine Environment-Variable in den Projekt-Settings; das Feature ist experimentell und standardmäßig deaktiviert ([2:29](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=149s))
- Empfehlung: Claude Code vorab auf die Agent-Teams-Doku „trainieren", indem man die Doku als lokale Master-Reference im docs-Ordner als Markdown ablegt — das macht Nachschlagen schneller ([2:29](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=149s))
- Agent Teams sind teurer und etwas langsamer, liefern bei richtigem Einsatz aber deutlich höhere Qualität ([4:32](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=272s))
- Man kann Agent Teams per natürlicher Sprache aufrufen, Muster: „Erstelle ein Team aus X Agenten mit Modell Y" (Haiku, Sonnet oder Opus) ([4:32](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=272s))
- Beim Prompten zuerst ein Ziel etablieren, weil die Agenten beim Aufwachen keinen Kontext außer dem Prompt der Main-Session haben ([4:32](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=272s))
- Do: jeder Agent besitzt seine eigenen Dateien, sonst überschreiben sich die Agenten gegenseitig ([6:30](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=390s))
- Do: Output definieren und Empfänger benennen; Don't: vage Deliverables, keine Annahmen wer mit wem redet ([6:30](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=390s))
- Empfehlung: etwa drei bis fünf Teammates, keine großen Swarms mit 10+ — das wäre 10× teurer ([6:30](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=390s))
- Teammates bekommen initial keinen History-Kontext, können aber alle Projektdateien lesen ([6:30](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=390s))
- tmux-Variante zeigt die Agenten farbcodiert im Split-Pane (blau/grün/gelb) und erlaubt das individuelle Anschreiben einzelner Teammates ([10:15](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=615s))
- Teammates erben die Permissions der Main-Session (z.B. bypass permissions, erlaubte Bash-Commands) ([11:45](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=705s))
- Teammates können alle Dateien, MCP-Server und Skills der Session nutzen ([11:45](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=705s))
- Plan Approval Mode: Teammates müssen ihren Plan genehmigen lassen, bevor sie ausführen — entweder durch die Main-Session, einen Reviewer-Teammate oder den User selbst ([11:45](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=705s))
- Pitfall-Fix: Tools vorab erlauben (pre-approve), wenn Agenten ständig nach Permissions fragen ([13:12](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=792s))
- Pitfall-Fix: File-Owner zuweisen, wenn Deliverables nicht holistisch wirken ([13:12](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=792s))
- Pitfall-Fix: weniger Agenten nutzen, wenn zu viele Tokens verbraucht werden ([13:12](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=792s))
- Pitfall-Fix: Agenten alles als temporäre Datei speichern lassen, wenn sie Arbeit verlieren ([13:12](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=792s))
- Agent Teams nutzen, wenn etwas komplex ist und mehrere spezialisierte, parallel arbeitende Agenten braucht, die aufeinander reagieren und kommunizieren ([14:05](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=845s))
- Nicht nutzen bei sequenziellen, voneinander abhängigen Schritten, bei Arbeit an denselben Dateien, bei nur einem benötigten Kontext-Fenster oder einfachen Tasks — dann eher Sub-Agents ([14:05](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=845s))
- Drei Sessions bedeuten dreifache Kosten; der Sprecher bleibt bei maximal zwei bis fünf Agenten ([14:05](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=845s))
- Shutdown heißt sauberes Speichern der Arbeit; ein Teammate kann signalisieren „noch nicht fertig, nicht abschalten" ([14:05](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=845s))

## Demos / Schritte

1. **Setup:** Offizielle Agent-Teams-Doku öffnen, das dort gezeigte JSON kopieren und Claude Code anweisen, es in die lokalen Projekt-Settings zu schreiben — es entsteht ein `.claude`-Ordner mit `settings.local.json` und der aktivierenden Variable.
2. **Master-Reference anlegen:** Doku-URL an Claude geben und einen „Master Reference Guide for Agent Teams" im `docs`-Ordner als Markdown erstellen lassen (lokales Nachschlagewerk für spätere Builds).
3. **Neuroflow-Demo:** Team „Neuroflow" aus drei Sonnet-Agenten (Frontend-Dev, Backend-Dev, QA) für eine Landing Page einer fiktiven AI-Startup; QA findet drei kritische Issues, Arbeit geht zurück an die beiden Devs, zweiter QA-Pass besteht.
4. **Research-Team-Demo (VS Code):** Drei Agenten (Researcher, Strategist, Critic) räumen den Workspace auf; man kann pro Agent den Spawn-Prompt einsehen; Ergebnis ist ein Doc „Agent Teams Patterns" mit 11 identifizierten Doku-Lücken.
5. **tmux-Demo:** Gleicher Team-Prompt im tmux-Terminal; Agenten erscheinen farbcodiert im Split-Pane und lassen sich einzeln direkt ansprechen, beobachten und freigeben.

## Genannte Tools

- [claude-code-overview](obsidian://open?vault=knowledge-base&file=claude-code-overview) — Coding-Agent, in dem das Agent-Teams-Feature läuft (im Video meist in der VS-Code-Extension genutzt)
- VS Code — Editor, in dem die Claude-Code-Extension verwendet wird
- tmux — Terminal-Multiplexer, um die Agenten im farbigen Split-Pane sichtbar zu machen und einzeln anzusprechen
- Sonnet, Haiku, Opus — Claude-Modelle, die man pro Team auswählen kann

## Verwandt

- [claude-code-hooks-overview](obsidian://open?vault=knowledge-base&file=claude-code-hooks-overview) — listet die Agent/Team-Hook-Events (`SubagentStart`, `TeammateIdle`, `TaskCreate` …), die genau dieses Feature instrumentieren
- [skill-army](obsidian://open?vault=knowledge-base&file=skill-army) — paralleles Multi-Agent-Pattern in Git-Worktrees, konzeptuell verwandt mit dem parallelen Arbeiten der Teammates
- [[Claude Code Dynamic Workflows Clearly Explained]] — grenzt Dynamic Workflows explizit gegen Sub-Agents und Agent Teams ab

---

# Fassung B

Die erste OHS-Suche hängt ohne Treffer; die übrigen Lookups reichen für die Links. Zusammenfassung folgt aus dem Transkript.
## Worum es geht
Erklär- und Demo-Video zum experimentellen Claude-Code-Feature Agent Teams: Die Hauptsitzung spawnt spezialisierte Teammates, die parallel arbeiten, eine gemeinsame Task-Liste teilen und einander direkt Nachrichten schicken. Der Sprecher zeigt Aktivierung, Prompt-Muster, Demos in VS Code und tmux sowie Dos/Don’ts, Fallstricke und wann Teams gegenüber Sub-Agents die falsche Wahl sind.
## Besprochene Konzepte
- [claude-code-agent-teams](obsidian://open?vault=knowledge-base&file=claude-code-agent-teams) — experimentelles Feature: Team-Lead plus Teammates mit geteilter Task-Liste und Peer-Kommunikation
- Sub-Agents — arbeiten unabhängig und liefern ihr Ergebnis nur an den Hauptagenten zurück, ohne sich untereinander abzustimmen
- Team-Lead / Orchestrator — die Claude-Code-Hauptsitzung, die Teammates anlegt, die Task-Liste führt und Qualität prüft
- Shared Task List — gemeinsame Aufgabenliste, die alle Teammates sehen
- Send Message / Direct Messaging — Teammates schreiben einander direkt, ohne die Hauptsitzung als Mittler
- Plan Approval Mode — Teammates planen zuerst; Freigabe durch den Lead, den Menschen oder einen Reviewer-Teammate, erst dann Ausführung
- Permission- und Kontext-Vererbung — Teammates erben Permissions, Dateien, MCP-Server und Skills der Hauptsitzung, bekommen aber beim Start keine History
- File Ownership / Territory — jeder Agent besitzt eigene Dateien und Deliverables, damit sich Arbeit nicht überschreibt
- Parallelität statt Kette — Teams arbeiten gleichzeitig und kommunizieren durchgängig; reine 1-2-3-Abfolgen sind laut Sprecher eher Sub-Agents
- Natural-Language-Prompt — Ziel, Teamgröße, Modell, Rollen, Deliverables und namentliche Nachrichten-Empfänger in Alltagssprache
- Sauberes Shutdown — die Hauptsitzung schickt einen Shutdown-Request; Teammates speichern und bestätigen, statt hart beendet zu werden
## Behauptungen
- Der Sprecher nennt Agent Teams eines der mächtigsten AI-Agent-Features, die er je genutzt hat; man müsse sie richtig einsetzen. (0:00)
- Im Eröffnungs-Prompt stand nur, eine Landing Page für ein fiktives AI-Startup zu bauen; Copy, Animationen, Farbschema und dynamische Inhalte kamen vom Team. (0:00)
- Der Sprecher sagt, am Ergebnis sei nicht alles perfekt und man würde nachiterieren. (0:00)
- Sub-Agents arbeiten unabhängig und schicken ihr Ergebnis an den Hauptagenten; Agent Teams haben einen Team-Lead, eine Shared Task List und Peer-Kommunikation. (1:24)
- Der große Unlock sei, dass Teammates einander direkt anschreiben können, etwa bei Abhängigkeiten oder QA-Rückweisungen. (1:24)
- Agent Teams sind standardmäßig aus, weil das Feature experimentell ist; Aktivierung über eine Variable in der `settings.json`. (2:29)
- Im Demo-Projekt entstand `.claude/settings.local.json` mit dieser Einstellung. (2:29)
- Der Sprecher legt lokale Markdown-Doku aus der offiziellen Agent-Teams-URL in `docs/` an, damit Claude Code nicht ständig nachschlagen muss. (2:29)
- Agent Teams sind teurer und langsamer, liefern bei richtigem Einsatz aber höhere Qualität. (4:32)
- Aufruf geht in Alltagssprache: Team aus X Agenten mit Modell Haiku, Sonnet oder Opus, plus Rollen. (4:32)
- Beim Aufwachen haben Agenten keinen Kontext, nur den Prompt der Hauptsitzung. (4:32)
- Deshalb zuerst ein Ziel setzen, damit Teammates wissen, worauf sie hinarbeiten und warum die anderen da sind. (4:32)
- Do: jeder Agent besitzt konkrete Dateien; sonst überschreiben sie sich. (6:30)
- Do: Output klar definieren, keine vagen Deliverables. (6:30)
- Do: Empfänger namentlich nennen, nicht annehmen, die Agenten wüssten von selbst, wen sie anschreiben. (6:30)
- Do: etwa drei bis fünf Teammates; keine Schwärme von 10+, das sei auch zehnmal teurer. (6:30)
- Do: vollen Kontext geben, weil keine History mitgegeben wird; Dateien im Projekt können sie trotzdem lesen. (6:30)
- In der Claude-Code-Extension sieht man Denken und Tun der Agenten nicht unter der Haube. (10:15)
- Im Terminal mit tmux sieht man die Agenten arbeiten und kann sie einzeln anschreiben. (10:15)
- Unter Windows braucht tmux einen Workaround. (10:15)
- Drei Kernregeln: eigene Datei-Territorien, Direct Messaging ohne Mittler, parallele Arbeit statt reiner Staffel. (11:45)
- Eine reine Staffel (Agent 1 übergibt an 2, 2 an 3) rechtfertigt laut Sprecher oft kein Agent Team. (11:45)
- Teammates erben die Permissions der Hauptsitzung, inklusive Bypass Permissions und freigegebener Bash-Befehle. (11:45)
- Dateien, MCP-Server und Skills der Hauptsitzung stehen allen Teammates zur Verfügung. (11:45)
- Plan Approval Mode: Teammates müssen ihren Plan vom Hauptagenten freigeben lassen, bevor sie ausführen. (11:45)
- Der Sprecher hält es für besser, die Hauptsitzung freigeben zu lassen, nicht jeden Plan selbst; alternativ ein Plan-Reviewer-Teammate. (11:45)
- Agenten bleiben an Permissions hängen: betroffene Tools in den Projekt- oder Local-Settings vorab erlauben. (13:12)
- Deliverables wirken nicht ganzheitlich oder werden überschrieben: File Owner zuweisen. (13:12)
- Ein Agent sitzt untätig: im Prompt jedem Agenten Arbeit oder eine Abhängigkeit geben. (13:12)
- Zu viele Tokens: weniger Agenten. (13:12)
- Arbeit geht verloren: Zwischenergebnisse in temporäre Dateien schreiben, die später wieder gelesen werden. (13:12)
- Falsche Freigaben: anfangs selbst freigeben, bis der Ablauf klar ist. (13:12)
- Teams lohnen bei mehreren Spezialgebieten, paralleler Arbeit, gegenseitigem Reagieren/Zuweisen und hoher Qualität über viele Schritte. (14:05)
- Kein Team, wenn der Prozess streng sequentiell ist — dann eher Sub-Agents. (14:05)
- Kein Team, wenn alles in einer Conversation History bzw. einem Context Window bleiben soll. (14:05)
- Kein Team, wenn alle an denselben Dateien arbeiten. (14:05)
- Kein Team bei einfachen Aufgaben; das sei Overkill. (14:05)
- Drei parallele Sessions kosten grob dreimal so viel, fünf Sessions fünfmal so viel. (14:05)
- Der Sprecher bleibt bei etwa zwei bis fünf Agenten. (14:05)
- Sub-Agents früh abbrechen, wenn sie vom Weg abkommen; dafür sei die tmux-Split-Ansicht nützlich. (14:05)
- Shutdown heißt: Arbeit speichern und bestätigen; Teammates können widersprechen, wenn sie noch nicht fertig sind. (14:05)
- Hartes Kill ohne Shutdown kann unaufgeräumten Stand hinterlassen. (14:05)
## Demos / Schritte
1. Prompt an Claude: Team `Neuroflow` mit drei Sonnet-Teammates (Frontend, Backend, QA); Tool `team create` spawnt sie parallel. (0:00)
2. Frontend und Backend schicken Arbeit an QA; QA findet drei kritische Issues; der Hauptagent schickt beide plus QA in einen zweiten Durchgang; QA gibt frei, die Issues sind weg, die Landing Page steht. (0:00)
3. In einem leeren Projekt JSON aus der offiziellen Agent-Teams-Doku in die lokalen Settings legen lassen; Ergebnis: `.claude/settings.local.json`. (2:29)
4. Doku-URL kopieren und eine Master-Referenz unter `docs/` erzeugen lassen (Aktivierung, Wann nutzen, Display-Modi, Task Management, Hooks, Best Practices). (2:29)
5. Frische Sitzung: Team `research team` mit Sonnet (Researcher, Strategist, Critic) zum Aufräumen/Prüfen des Workspace. (7:12)
6. Spawn-Prompts prüfen: Rollen, Schrittfolge, Anweisung, per Send-Message-Tool an namentliche Teammates zu schreiben. (7:12)
7. Hauptagent fragt den Researcher, ob Inventar an Strategist und Critic ging; Researcher bestätigt, Critic läuft. (7:12)
8. Hauptagent schickt Shutdown („save your work“) an alle drei; Output u. a. Dokument „Agent Teams Patterns“ mit 11 Dokumentationslücken. (7:12)
9. Denselben Frontend/Backend/QA-Prompt in Claude Code unter tmux: farbige Panes (blau Frontend, grün Backend, gelb QA); Status in der Hauptsitzung, Direktansprache je Agent. (10:15)
## Genannte Tools
- [claude-code-overview](obsidian://open?vault=knowledge-base&file=claude-code-overview) — CLI/Extension, in der Agent Teams laufen
- VS Code — Umgebung der Extension-Demos; der Sprecher nutzt sie bevorzugt, sagt aber, Agent Teams gehen überall, wo Claude Code läuft
- tmux — Split-Pane-Ansicht, in der Teammates sichtbar und einzeln ansprechbar sind
- Sonnet, Haiku, Opus — wählbare Modelle für Teammates; Demos laufen mit Sonnet
- React — im Beispiel-Prompt das Frontend der Full-Stack-App
- [claude-code-mcp-setup](obsidian://open?vault=knowledge-base&file=claude-code-mcp-setup) — MCP-Server der Hauptsitzung, die Teammates mitnutzen
- [claude-code-skills](obsidian://open?vault=knowledge-base&file=claude-code-skills) — Skills der Hauptsitzung, die Teammates mitnutzen
## Verwandt
- [claude-code-agent-teams-quickstart](obsidian://open?vault=knowledge-base&file=claude-code-agent-teams-quickstart) — Kurzüberblick zur selben Mechanik
- [claude-code-agent-teams-praxis](obsidian://open?vault=knowledge-base&file=claude-code-agent-teams-praxis) — Community-Prompt-Muster, Teamzuschnitt und bekannte Pitfalls
- [[Claude Code Dynamic Workflows Clearly Explained]] — grenzt Agent Teams gegen Sub-Agents, Skills und Dynamic Workflows ab
- [sub-agent-steuerung-hooks-und-anti-token-burn](obsidian://open?vault=knowledge-base&file=sub-agent-steuerung-hooks-und-anti-token-burn) — Steuerung und Token-Kosten von Sub-Agents und Teammates
- [agent-orchestrierung-entscheidung](obsidian://open?vault=knowledge-base&file=agent-orchestrierung-entscheidung) — wann Solo, wann Subagent, analog zur Team-vs-Sub-Agent-Grenze im Video
