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

### [0:00](https://www.youtube.com/watch?v=qMnClynCAmM&t=0s) — Intro to the New Archon

Finally, after months and months of hard work behind the scenes, I am unveiling the new Archon, a massive overhaul of the AI command center that I was working on last year. It is now the first open-source harness builder for AI coding. So, similar vision, but a very different and powerful use case. Harnesses are the future. It's the layer on top of your coding agents that orchestrates the different sessions. It's what makes AI coding deterministic and repeatable. We'll talk about what that means. And now with Archon, you can build your own custom harnesses very easily. No matter how you work with AI coding agents right now, you can take that process and bundle it up into an Archon workflow that you can run across all your code bases, even handling different tasks in parallel. Archon handles all of the messy logic behind the scenes to make that possible.

So, in this video, I want to talk about what makes Archon so powerful. I want to show you how to get started with it and even give you some inspiration for the kinds of things you can do with it. It's a very powerful tool. It's actually hard for me to explain everything in just one video, but a lot more content coming on Archon soon as well.

So, the main idea with Archon is you can encode your development process as a workflow, no matter what it is. I will link to this repo in the description. I highly encourage you to try Archon today. It's very easy to get up and running. I'll show you that in a little bit. But I have an example here at the top of the readme for what an Archon workflow looks like. And so every single workflow is just a combination of nodes, where a node is either a prompt that we send into a coding agent session, or it is a deterministic command that we want to invoke. Because sometimes we want to enforce certain things to happen, like context creation or validation, that we don't want to leave up to the coding agent cuz it might forget to do so. So we want to plan, implement tasks in a loop, run the tests, have it do a review, even adding in a human approval gate so we can address our feedback. We can build ourselves into Archon workflows if we want as well, and then ending with a pull request. And Archon comes with a skill that I'll cover with you in a bit as well. So we just say like use Archon to build this feature, it knows automatically the workflow to use, it'll invoke it for us, and we have the logs so we can monitor the workflow along the way.

Archon also comes with a ton of pre-packaged workflows that will immediately level up your agentic coding workflow. Fixing GitHub issues, creating pull requests from ideas. We have pull request validation and review commands, even one to help you create full PRDs with human in the loop. So, ton of things for you to use and very easy to create your own custom workflows as well. We're going to cover all of that in this video. I'm going to give you enough of a starting point for you to dive right into Archon. And then if you want a super deep dive, I'm also doing a live stream this Saturday, 9:00 a.m. Central Time. So come be a part of this as well cuz we're going to get really deep into building workflows and running them in parallel, doing a lot of fancy things. But for now, I want to give you a good overview of Archon, why it's important, where we're heading with agent harnesses, and then we'll get into the setup guide.

### [3:07](https://www.youtube.com/watch?v=qMnClynCAmM&t=187s) — The Evolution of Harness Engineering

So I want to start by talking about the evolution that we've seen that has brought us to harness engineering. So prompt engineering, that was all the rage back in 2022 through 2024. It was all about how can we prompt LLMs to get the single best output? And then that evolved into context engineering, which is all about how can we curate the perfect context for a single agent so it can handle a larger set of work. We give it all the context it needs and nothing more.

And now that has evolved into harness engineering, where we're dealing with many different coding agent sessions, all tying that together through a harness. And so up until this point, everything we've done here is dealing with a single LLM or a single agent. Now we are stringing coding agent sessions together to handle much larger sets of work. And so maybe you've heard of the Ralph loop before, or Anthropic has built a couple open-source harnesses. There are a lot of harnesses out there, but the problem is that they're not custom to you. Maybe it's a good starting point or helpful to create a proof of concept, but what Archon unlocks for you is being able to create your own custom harness wrapping up your own software development life cycle.

And harnesses are a big deal. It's the tooling, the prompting, chaining different coding agents together, everything to elevate the capabilities of a single large language model. And this is really important right now cuz Claude is about to release Mythos, but it's more enterprise use. Like us consumers, there's no way we're going to be able to afford using Mythos for everything. But what we can do is build a harness around Opus to make it more powerful than Mythos by itself. And this is proven. There have been studies that have been done that if we take a large language model and we just use it to create some code, the PR acceptance rate is only 6.7%. But if we create a harness, like the Ralph loop but probably more custom and better, we can get even as high as like almost 70% for a PR acceptance.

And I don't want to get like super deep into the study here, but the point is we can elevate models a drastic amount by creating a harness where we build in validation, we build in a special kind of context curation. And that's exactly what Stripe did with Stripe Minion. So I covered this on my channel already actually, but Stripe, they ship 1,300 AI only generated pull requests every single week. And they did this by building their AI coding workflow, their context curation, their validation, enforcing that at different steps of the way in their workflow. So they actually built something kind of like Archon, but it's not open-source, right? You can't use it like you can use Archon.

And with the Claude Code source code leak, we found that even Anthropic is leaning a lot more into harnesses with agent teams and features they're building around sub-agents. 40% of their code base is just code for harnesses right now. And so that just is a signal for how much it's a big deal right now.

### [5:54](https://www.youtube.com/watch?v=qMnClynCAmM&t=354s) — How Archon Orchestrates Coding Agents

And Archon, it wraps above Claude Code and Codex. So the old Archon was more of a tool built into coding agents. That's kind of why it became irrelevant because these coding agents, they built all that themselves for rag and task management. You know what I'm talking about if you've used the old Archon. But now the new Archon, it sits above the coding agents and it orchestrates them.

So the problem is before, you're dealing with AI shepherding. Like yes, you have your skills and commands and you're running workflows there, but you still have your entire process where you're running different skills and different commands, and you have to remember what comes next, and you have to kick off the code review after the implementation. But now your entire process, you can bundle as an Archon workflow. Define once, run forever, reusable across projects.

You also get to pick where you're injecting context. Like maybe you have a skill that you only need during the validation step, or you have an MCP server that you only want during planning. We have that level of control per node with Archon. And kind of like the example I gave in the readme, here's an example of going from plan all the way to open a pull request. This is the kind of thing you can build with Archon. And I think you really see here how we're building in reliability through deterministic steps, enforcing validation at certain steps of the way, and human approvals.

So we have our plan here. We can even build this into a loop where we have the agent create the plan and then we give feedback, and we go in a loop until we go to the coding step. And we do that in a fresh context window. You always want to do your planning and implementation in different coding sessions to remove bias. And then after the coding, we go into the tests, and we run this every single time. Again, we don't want to rely on the coding agent to remember to do the tests all the time. And then we retry and have it fix issues if they come up. Otherwise, we go to the final human approval gate. When things look good, we then open the pull request.

Just one example of how you can — this is a more basic example of what your agentic coding workflow might look like, but there's going to be different things depending on if you're fixing bugs or refactoring or building a new feature. All of those things you can build into Archon.

And the big secret here is the hybrid secret. This is what makes Stripe Minion so powerful. There are certain steps of the workflow that we don't want the coding agent to decide. Like sometimes we want to curate context in a specific way, or run our tests in a specific way. We have nodes for that that we can build into Archon workflows. But then of course, most of the workflow is still going to be driven by our commands and skills, just sending prompts into our coding agents. We have of course support for all of that so you can take your existing commands and skills, everything, and build it right into Archon.

So I hope you can see why this is so powerful, building these kinds of harnesses for yourself. And so with that, I now want to get into the guide for you, how you can get Archon up and running using these workflows in less than 5 minutes.

### [8:48](https://www.youtube.com/watch?v=qMnClynCAmM&t=528s) — Installation and Setup Guide

Now, installing Archon is actually incredibly easy because we can use our coding agent to guide us through the entire process. All you have to do is clone the repository, open up Claude, and then ask it to set up Archon. Because it will automatically load in a skill that we have in the code base here that guides you through the entire process. And I'll do this right now with you just to show how easy it is. We can do this in less than 5 minutes.

So I'll take this first command here to clone the repository, and then obviously we want to open up our coding agent in this repo so we can load the skill. So we'll change our directory, and then we'll open up Claude. So now in Claude Code, I just say set up Archon. That is all you have to do. And take a look at this. We'll see in just a second, it'll load the Archon skill, and then it'll kick off this process where it'll ask us all the questions we need in order to help us get our credentials set up and then validate that Archon is working on our machine.

So first, Archon is going to check to make sure that we have the prerequisites in place, including Bun, and it'll install it if we don't have it already. Then it asks what repository we first want to use Archon with. So it's important that you add in your own project, not the Archon repo, because we want to use the Archon workflows on a target repository. And don't worry, it's super easy to add more projects into Archon after.

And so, just for this demonstration here, I have a rag YouTube chat application that I'm going to be running some Archon workflows in. And so, I have the path to this repo cloned locally copied here. And so, I'll just go to option number two, specify a local path. And so, then it's going to ask me, what is the path? Please paste it. So, I'll paste it in here. And then, it'll register this as our first Archon registered project. And then, going forward, we can add any project into Archon by just running a workflow there for the first time or right within the web UI.

Then, it asks what platforms do I want to set up. So, the CLI is included by default. You can run Archon through the CLI, ask your coding agent to do so. But, we can also run in GitHub. And then, we could run through Telegram, through Slack. I'm actually going to set up quite a few of these right now. There are a lot of different interfaces to interact with Archon.

Then, after Archon installs the global CLI, it's going to walk us through a setup wizard to set our credentials for any other platforms we chose, like GitHub or Slack. We need to do this in a different window, because we don't want to send our API keys directly into Claude Code. So, it's going to spin up another terminal process for us to enter our keys, not going to a coding agent. And so, it should spin up the wizard automatically and bring up another terminal automatically. But, for certain operating systems, or if you're trying to run Archon in a VPS, you will probably have to open up a new session yourself. So, you just open up a new terminal, and you run the Archon setup command. So, Archon is now a globally recognized command, because we installed the CLI.

So, this is going to work automatically. In my case, I'm just going to go back to the terminal that it popped up for me automatically. So, we can pick our database. SQLite by default, this is the easiest. Or, you can set up Postgres if you like. So, I'm going to do SQLite. And then, it asks which AI coding assistant you want to use. So, right now, we mostly support Claude. We're almost done with Codex support, and then we want to add in other coding assistants later, like the Pi Agent SDK and Open Code.

And so, I'll go with Claude right here. And then, how do I want to authenticate with Claude? Well, I just want to use my Anthropic subscription. We are allowed to use our Anthropic subscription as long as it's an application running locally using the Claude Agent SDK. And that is the case for Archon. So, I'm going to use my global auth.

What platforms do I want to connect? So, I'll just select GitHub, Telegram, and Slack. So, then it'll ask me for the credentials for those. And this is where it's going to guide you through getting the API keys for each of them. For each one of the platforms you select, there are instructions to walk you through getting your keys for each application.

Then, after you set all of your credentials, it's going to ask, do you want to install the Archon skill in your project? And I would highly recommend doing this, because then, if we open up Claude Code in our other code base, we can use the Archon CLI to kick off workflows automatically. Cuz then, if we have Claude open there, we can just say, "Use the Archon CLI to invoke whatever workflow to handle a pull request or an issue or something." And it'll know right away to load the skill, and it'll know exactly how to use the Archon CLI. Again, it's important for any CLI to have a skill paired with it, so that our coding agent knows how to use it.

So, I will bring this over. It asks for the path. So, I'm just going to take the path that I copied earlier for the repo, just paste it in right here, so it knows where to copy it. And then, it'll ask if you want a non-default docs directory. If you have other documentation you want to load into Archon, probably don't worry about that right now. That's something that we're working on currently. So, I'll do no there. And there we go. Our setup is complete.

And so, what we do here is we actually go back to the first session where we first said, "Set up Archon." And it tells you this here. So, it says, come back here, complete the configuration there, let me know when you are done. So, I'll just say, "Done." And then, what it's going to do now, that I've set all my credentials, is verify that everything is working. So, it'll test the connections. It'll even test running a workflow through the Archon CLI.

So, it confirms that our credentials are good to go, without actually reading them, of course. Then, we list out all of the default Archon workflows to make sure they're available. Those are all the workflows that we have bundled ready for you to use immediately to fix GitHub issues, run a rough loop, create a PRD. There is a lot of value that we have built into this right away. And then, it of course runs a workflow as well. So, it runs our basic Archon assist one just to make sure that the Archon CLI is functioning, and we're ready to use it on any repository that we want.

And then, it gives us a summary at the end. And look at how easy it is for us to just start using Archon right now. So, we just open up Claude Code in our target repository. You can really do this in any repo you want, because remember, when we run the Archon CLI in a repo for the first time, it automatically registers it with Archon. So, we just copy over the Archon skill into whatever repo, launch Claude there, and then we can just say, "Use Archon to, for example, fix this issue number." Or, "Help me create a PRD." Whatever workflow you want to use, and you can build your own, like I'll show you in a little bit.

### [15:03](https://www.youtube.com/watch?v=qMnClynCAmM&t=903s) — Running an Archon Workflow End-To-End

So, because I chose my rag YouTube chat application as my onboarding repo, I copied over the Archon skill. So, it knows how to use the Archon CLI when I ask it to. And so, I'm going to open up Claude Code right within this repository, and we are already ready to use a workflow. And so, I'm going to use Archon to help me fix a GitHub issue. And so, going into the issue list for my repo, you can see there is quite a few options that I have to work with here. Well, let's say I just want to deal with issue number one. And so, all I have to do is say, "Use Archon to fix issue number one in GitHub." That is it. I don't have to provide any more context, because it'll know to load the Archon skill, find the right workflow for the job, and then invoke it. And then, our Claude Code can just monitor it in the background.

So, there we go. It used the GitHub CLI to view the issue to get context, loaded the Archon skill, and it decided, "Okay, I should use the Archon fix GitHub issue workflow." It's one of the defaults that we have bundled. It is a very powerful workflow, by the way, because it does full investigation, fixing, and validation before it creates the pull request. And that is the end result — we'll have a pull request that has the final implementation from the Archon workflow.

So, we can see right here that in Claude Code, it is running as a background process. So, we can track the logs here. We can always ask Claude Code to give us an update for how the workflow is running, or we can view the workflow in the web UI as it is running.

### [17:01](https://www.youtube.com/watch?v=qMnClynCAmM&t=1021s) — Archon Web Dashboard

Okay. So, right here, we are focusing on using the CLI to run an Archon workflow. That is the most convenient way. But, we also have a web interface. If you want to more visualize what's happening with your workflows, we can also view the logs for the workflows more easily that we run through the CLI.

So, I'm going to go back to the terminal where I had the Archon repository open with Claude Code. So, all I have to do, if I want to start the back end and front end of Archon, is I just have to ask my coding agent to do so. It is that easy. So, I can say, "Spin up the front end and back end of Archon." And it's going to, based on the readme, understand the commands to run, and then get everything running for us as background processes.

And so, take a look at this. If I go into the browser and go to port 5178, right? Cuz that's where it says it's running right now, I can see my conversations. I can see the workflows that are currently active. So, if I go into the dashboard here, I can see that it's using the Archon fix GitHub issue workflow. I can view the logs for it to see what is currently happening. So, this is the node that we just completed. Now, we're currently investigating the issue. So, we started with web research, then now we're investigating. We can see all the tool calls. So, all the logs from Claude Code, if you want to dig into all the individual actions that it's doing as it's going through this Archon workflow.

### [18:47](https://www.youtube.com/watch?v=qMnClynCAmM&t=1127s) — How Archon Workflows Work

And so, every single one of the nodes here is either a deterministic action, like a bash command, or it's a session with Claude Code. And again, in our Archon workflows, we can determine when we go from node to node, do we want to start a brand new session with Claude Code or continue the conversation? We have a lot of flexibility for token management, making sure we keep our context lean when we're dealing with our coding agents. One of the big things that Archon gives us that we were missing before.

All right. And while we wait for this workflow to finish — it's going to create a pull request at the end — I want to show you what it actually looks like in the YAML. Cuz remember, all of the workflows in Archon are simply defined as YAML files. It is so easy to improve the existing ones that we have in Archon, and even create your own. That's one of the last things I'll show you in this video.

And so, within the .archon folder in the Archon repository, we have all of the default workflows. These are also bundled into the CLI. So, when you run the CLI from any other repository, it'll automatically have access to these. So, take a look at this. We have all of these different workflows. The one that we're running right now is Archon fix GitHub issue. And so, we have a description for the workflow. And this is important, because this is just like Claude Code's skills, where the description is what we first give to Claude Code. Like, "Hey, here's a workflow from Archon that you want to use when the user is specifically asking for you to fix a GitHub issue." Right? We don't want to load the entire workflow into context for the coding agent. It only needs this brief description up front. So, it uses this to determine if it should analyze and run this entire workflow.

We can define the provider up front. Again, we're supporting more in the near future, the default model used for each of the nodes, and then we have the list of nodes. This is the step-by-step that we're going through. So, exactly what I have defined in the YAML document, we can see right here in the web UI. We see the full execution, all the different nodes that we have, the different branches and decisions that can be made. All of this is a direct visualization of what we have in the YAML right here.

So, for this workflow specifically, we are going to first extract the issue number. So, based on the prompt that is fed into this workflow — it's kind of like running a sub agent in Claude Code — we're going to grab the issue number, and then we're going to classify the issue. Is this a bug that needs to be fixed or a feature that we need to build? Because that's going to determine what comes next, right? Do we have to investigate the issue or plan for a new feature?

And we have the prompt here that we're sending into the model for this step specifically. And one of the most powerful things — I know that token consumption is a big deal right now, especially because of rate limits with Anthropic — one of the powerful things we can do with Archon is specify the model we want to use for the individual nodes. So, certain nodes, like classification, they don't need a lot of reasoning power. So, we can make it a lot more token efficient, a lot cheaper by just using Haiku for our model.

And then we go into the research phase. In this one, we're just going to use the default model. So, we don't specify it here, it just means that it'll use the default model of Sonnet. And we don't have the prompt in line, we're actually using a command. And so, for every single workflow that's in this folder, the commands are sort of like the extensions that we run in certain nodes. So, for example, we have the Archon web research command right here. It's just like commands or skills in Claude, where it's just a longer prompt that we're going to invoke for this node specifically.

So, we do our web research, and then we investigate if it is a bug or we plan if it is a feature request. That's the first decision that we can see right here. So, in the case of the workflow we just invoked, it went down the path of investigation because looking at our issue here, it's definitely a problem that we're addressing, not a new feature that we are adding.

And so, I'm just trying to show you the idea of like how we can take a pretty comprehensive workflow and turn it into this single process that we run with Archon. It's more than just writing some code. It's doing classification, it's doing investigation or planning, it's implementing, validating, and then creating the pull request at the end as well, and even doing further review after that point. And so, we have a lot more faith by the time this workflow finishes that the pull request is really ready for us to review and merge.

And yes, it takes a good number of tokens to go through this many steps, but that's why we lean on being able to specify the model at each step of the way. We're able to use Haiku for a lot of this here. So, we're just kind of giving more of a set of guidance around the coding agent. That's why we're calling it a harness, right? Like, this is sort of a harness wrapping many different Claude Code sessions to work together to fix a GitHub issue.

And there are so many amazing workflows that we have available for you that you can use out of the box, and then anything that's not here, you can just create by yourself. So, we have the adversarial dev harness as an Archon workflow. I showed this in a live stream that I'll link to right here. We have a comprehensive PR review workflow. We have one to help you create issues. So, like investigating a problem creating a GitHub issue, idea to PR — this is a very comprehensive one. We have one with human in the loop. We actually have human in the loop with Archon. So, we can pause at any given node to ask for your input.

So, we have this interactive PRD, where it'll have you sort of ideate with a coding agent to create that initial spec for a new application you want to create. We have the Ralph loop built as an Archon workflow. There's just so many things that are here already. We even have an Archon workflow to help you build more workflows. We'll use this in just a second here. So, yeah, literally no matter what you want to do with your AI coding assistants, it doesn't matter how many coding agent sessions you need, you can bundle it together into an Archon workflow, adding in reliability through deterministic nodes, like you always want to run validation at some point, or you always want to curate context in this way.

### [25:52](https://www.youtube.com/watch?v=qMnClynCAmM&t=1552s) — Running Multiple Workflows in Parallel

All right, so I'm just going to keep showing you some really cool ways to use Archon. I'm going to keep using the GitHub issue fix workflow because that is my most used, but there are so many amazing workflows you can use. And by the way, you can just ask it in the web UI here, what projects and workflows do you have? And so, the Archon agent in the UI is actually kind of special. It has all of the context around Archon, like our registered projects and workflows injected in at the start of the conversation. And by the way, in the web UI here, you can just click add project to give a GitHub URL or local path if you want to register more.

So, right now, this is my only registered project, as you can see from the drop-down here. And then here are all of the available workflows, which this will also include any that you build on top yourself, but these are all of the default ones shipped with Archon. So, now, for example, I can say fix GitHub issue, and then if I go to the issue list here, we're currently handling this one on the other screen. So, we'll just do number three for the rag YouTube chat project. So, we don't even have to call out the exact repo name, it can reason based on what we said and what context it has loaded to know which workflow to kick off.

So, take a look at that. It invoked the Archon fix GitHub issue workflow specifically in our rag YouTube chat application. So, it does all of the routing for us from the web UI. And we can go into the logs, the beautiful screen. This is the exact same view we saw earlier, but this time we actually invoked it from the web UI. Very cool.

And another really powerful thing I want to show you really quickly is that we can invoke a ton of workflows in parallel. And so, for example, I'm back here with Claude open in my rag YouTube chat application, and I can just say use Archon to fix GitHub issues 5 7 8 9 10 and 11. So, the last six in that list there that we haven't touched yet, I just want to rip through all of these at the exact same time. And so, we can invoke Archon directly from our project, or we can have Claude Code open within our Archon repository, and we can point it to any code base if we just give it the path. And remember, it will automatically register Archon at that point.

So, now it used the Archon CLI. Boom, look at that. Six times in a row, all of them are running as background processes, so we can see that right here, and we can continue to have it monitor for us. We could, for example, use the slash loop command in Claude Code to say, you know, every 10 minutes, check on the workflows and restart if there's a failure or something, which there usually isn't. But yeah, so all six workflows are running, progressing through the early DAG stages. So, most of them are on the classify step right now, figuring out is the issue a new feature or a problem that has to be addressed.

Super cool. All right, so I'm back, and we have the pull requests for all of our Archon workflow runs. So, we can see them all complete in the web UI as well. We can click into the logs just to see what happened every step of the way. And of course, we can go see our final result. Going to the repository for the first time here, I'll click on pull requests, and boom, there we go. We have eight new open pull requests handling each of the issues that we handled with an Archon workflow.

### [27:40](https://www.youtube.com/watch?v=qMnClynCAmM&t=1660s) — Building Custom Archon Workflows

All right, the last thing that I want to show you really quickly here — and I'm going to expand upon this a lot more in the Archon live stream — is how we can build our own custom Archon workflows. Because yes, there are a lot of very powerful workflows that we have as the defaults for you, but there's always going to be an opportunity to build your own, something very custom to you, or if you want to take another framework like GSD or B-MAD and bring it into Archon, or take a strategy like Beads for memory — anything you want to do, you can build it as a custom workflow for yourself.

And you can take advantage of this workflow builder workflow that we have. I know it's very meta, but all you have to do is open up Claude Code in the Archon repository and just say, use the workflow builder workflow to help me make an Archon workflow. That is all you have to say, and it's going to automatically load the Archon skill, and then ask you questions. It'll give you a chance to obviously describe the workflow you want to build, and then it'll run this full builder afterwards to create the YAML structure, and then you will immediately be able to run the workflow on any code base.

So, for example, something fun that I thought I would try right now for this video is creating an Archon workflow that essentially takes the idea from Beads. So, Beads, it's pretty cool. It's an open source repo that gives persistent structured memory for coding agents. And so, I want to essentially build the idea that we have here into an Archon workflow. So, I'm just going to copy this repo, paste it in here, go into my speech-to-text tool and say: I want to build an Archon workflow that incorporates Beads. Basically, just taking all the ideas from Beads in a simple sense. So, I want you to search through this repository, understand how it works, and then build this as an Archon workflow so that we can use Beads to create any new feature on any code base. So, there we go. I'll send that off, and it's going to do some research and thinking for me, and then obviously invoke this workflow to create the final YAML.

And there we go. We have our full workflow created. It starts with exploration, then it decomposes the feature request into individual tasks, and we implement them in a loop with progress tracking, validating everything at the end as well. So, taking a lot of ideas from Beads and building a full Archon harness around it. So cool. We can also view the full workflow within the user interface. We're working on a workflow builder, so it's like N8N but for AI coding. Super cool.

A ton of awesome things that we're actively working on right now with Archon. It's just in beta. Probably going to be some bugs that you'll find when you try it. A lot of new things that we're going to be adding over the next couple of months here. It is my biggest passion project. And so, please give it a shot. I think you'll really like it. And also, I would love to see you at the Archon livestream this Saturday at 9:00 a.m. Central Time. Going to be diving a lot deeper into building workflows and running them and showing you all these really cool features in Archon. So, I hope to see you there. Otherwise, if you appreciate this video and you're looking forward to more things on Archon and AI coding and agent harnesses, I would really appreciate a like and a subscribe. And with that, I will see you in the next video.

---

# Fassung A

## Worum es geht
Cole Medin stellt das neu gebaute Archon vor: laut Sprecher der erste Open-Source-Harness-Builder für AI-Coding. Archon sitzt über Coding-Agents, verdrahtet deren Sessions zu YAML-Workflows und soll denselben Entwicklungsprozess über Repos und parallele Tasks wiederholbar machen.
## Besprochene Konzepte
- [[Harness Engineering_ What Separates Top Agentic Engineers Right Now]] — Tooling, Prompts und das Verketten mehrerer Coding-Agent-Sessions über dem einzelnen Modell
- Prompt Engineering — 2022–2024: ein LLM auf den besten Einzel-Output trimmen
- [[Context Engineering vs. Prompt Engineering_ Smarter AI with RAG & Agents]] — den passenden Kontext für einen einzelnen Agenten zusammenstellen, nicht mehr
- [[Ralph Wiggum is the Final Evolution of Vibe Coding (Here's What Comes Next)]] — bekannter Open-Source-Harness; laut Sprecher ein Startpunkt, aber nicht an den eigenen Prozess angepasst
- Archon-Workflow — YAML aus Nodes: entweder ein Prompt in eine Coding-Agent-Session oder ein deterministischer Befehl
- Hybrid-Prinzip — Schritte wie Tests oder Kontext-Zusammenstellung nicht dem Agenten überlassen, sondern als feste Nodes einbauen
- Getrennte Sessions — Planung und Implementierung in frischen Context-Windows, damit die Implementierung nicht an der Planung klebt
- Human-Approval-Gate — Workflow an einem Node anhalten und den Menschen einbinden
- Per-Node-Modellwahl — schwache Schritte (z. B. Klassifikation) auf ein günstigeres Modell legen
- Define once, run forever — den Prozess einmal als Workflow bündeln und über Projekte sowie parallele Tasks wiederverwenden
- AI Shepherding — Skills und Commands selbst anstoßen und die Reihenfolge im Kopf behalten
- [claude-code-skills](obsidian://open?vault=knowledge-base&file=claude-code-skills) — bestehende Skills und Commands als Prompt-Knoten in Archon-Workflows
- [claude-code-agent-teams](obsidian://open?vault=knowledge-base&file=claude-code-agent-teams) — Anthropic baut laut Sprecher an Agent Teams und Sub-Agents; der Claude-Code-Leak zeige viel Harness-Code
- Beads-Idee — persistente, strukturierte Memory für Coding-Agents, im Video als eigener Archon-Workflow nachgebaut
## Behauptungen
- Das neue Archon ist laut Sprecher der erste Open-Source-Harness-Builder für AI-Coding. (0:00)
- Eine Harness ist die Schicht über Coding-Agents, die Sessions orchestriert und AI-Coding deterministisch und wiederholbar macht. (0:00)
- Jeder Archon-Workflow ist eine Kombination aus Nodes: Prompt in eine Agent-Session oder deterministischer Befehl. (0:00)
- Dinge wie Kontext-Erzeugung und Validierung sollen nicht dem Coding-Agent überlassen werden, weil er sie vergessen kann. (0:00)
- Mitgelieferte Workflows: GitHub-Issues fixen, PRs aus Ideen, PR-Validierung und Review, volle PRDs mit Human-in-the-Loop. (0:00)
- Der Sprecher kündigt einen Livestream am Samstag, 9:00 a.m. Central Time, zu Workflows und parallelen Läufen an. (0:00)
- Prompt Engineering (2022–2024) wurde zu Context Engineering und das zu Harness Engineering mit vielen Coding-Agent-Sessions. (3:07)
- Bestehende Harnesses (Ralph Loop, Open-Source-Harnesses von Anthropic) sind laut Sprecher nicht auf den eigenen Software-Entwicklungsprozess zugeschnitten. (3:07)
- Der Sprecher sagt, Claude stehe vor der Veröffentlichung von Mythos, vor allem für Enterprise; Consumer könnten Mythos nicht für alles bezahlen. (3:07)
- Der Sprecher behauptet, eine Harness um Opus könne das Modell mächtiger machen als Mythos allein. (3:07)
- Laut Sprecher liegt die PR-Acceptance-Rate bei bloß generiertem Code bei 6,7 Prozent, mit Harness bei fast 70 Prozent. (3:07)
- Stripe verschifft laut Sprecher 1300 nur-KI-generierte Pull Requests pro Woche über Stripe Minion; das System ist nicht Open Source. (3:07)
- Nach dem Claude-Code-Quelltext-Leak seien 40 Prozent der Anthropic-Codebasis Harness-Code. (3:07)
- Das alte Archon saß in den Coding-Agents (RAG, Task-Management) und wurde laut Sprecher irrelevant, weil die Agents das selbst bauten. (5:54)
- Das neue Archon sitzt über Claude Code und Codex und orchestriert sie. (5:54)
- Kontext, Skills und MCP-Server lassen sich pro Node setzen, nicht nur global. (5:54)
- Planung und Implementierung sollen in verschiedenen Coding-Sessions laufen. (5:54)
- Tests sollen jedes Mal als fester Schritt laufen, nicht weil der Agent sich daran erinnert. (5:54)
- Das „hybrid secret“ von Stripe Minion: bestimmte Schritte entscheidet der Agent nicht. (5:54)
- Bestehende Commands und Skills lassen sich in Archon-Workflows übernehmen. (5:54)
- Installation: Repo klonen, Claude Code öffnen, „set up Archon“ sagen; der Sprecher sagt, das gehe in unter 5 Minuten. (8:48)
- Voraussetzung ist unter anderem Bun; fehlt es, wird es installiert. (8:48)
- Das erste registrierte Projekt soll das eigene Ziel-Repo sein, nicht das Archon-Repo. (8:48)
- Die CLI ist Standard; zusätzlich GitHub, Telegram und Slack. (8:48)
- API-Keys gehören in ein separates Terminal, nicht in Claude Code. (8:48)
- Auf manchen Betriebssystemen und auf einem VPS muss man die Setup-Session selbst öffnen. (8:48)
- Datenbank: SQLite als einfachster Default, optional Postgres. (8:48)
- Coding-Assistent: derzeit vor allem Claude; Codex-Support fast fertig; später Pi Agent SDK und Open Code. (8:48)
- Ein lokales Anthropic-Abo ist laut Sprecher erlaubt, weil Archon lokal über das Claude Agent SDK läuft. (8:48)
- Der Sprecher empfiehlt, den Archon-Skill ins Zielprojekt zu legen, damit der Agent die CLI bedienen kann. (8:48)
- Beim ersten Lauf der Archon-CLI in einem Repo wird das Repo automatisch registriert. (8:48)
- Die Setup-Prüfung listet Default-Workflows und startet den Workflow „Archon assist“ als Funktionstest. (8:48)
- „Use Archon to fix issue number one in GitHub“ reicht: Skill laden, passenden Workflow wählen, im Hintergrund laufen lassen. (15:03)
- Der Default-Workflow „fix GitHub issue“ macht Investigation, Fix, Validierung und erst dann den Pull Request. (15:03)
- Die Web-UI läuft im Demo auf Port 5178. (17:01)
- Jeder Node ist entweder eine deterministische Aktion (z. B. Bash) oder eine Claude-Code-Session; neu starten oder die Conversation fortsetzen ist wählbar. (18:47)
- Workflows liegen als YAML unter `.archon` und stecken auch in der CLI. (18:47)
- Die Workflow-Description steuert wie bei Skills die Auswahl; der volle Workflow soll nicht in den Agent-Kontext. (18:47)
- Klassifikation braucht wenig Reasoning; dafür empfiehlt der Sprecher Haiku. Default-Modell der Nodes ist Sonnet, wenn keines gesetzt ist. (18:47)
- Commands im Workflow-Ordner sind längere Prompts für einzelne Nodes, analog zu Claude-Commands/Skills. (18:47)
- Der Fix-Issue-Workflow klassifiziert Bug vs. Feature und verzweigt in Investigation oder Planung. (18:47)
- Mitgeliefert unter anderem: Adversarial-Dev-Harness, umfassendes PR-Review, Issue-Erzeugung, Idea-to-PR, interaktives PRD, Ralph Loop, Workflow-Builder. (18:47)
- Human-in-the-Loop: an jedem Node auf Input warten. (18:47)
- Der Sprecher startet aus der Web-UI Issue 3 und per CLI die Issues 5, 7, 8, 9, 10 und 11 parallel. (25:52)
- Am Ende zeigt er acht neue offene Pull Requests. (25:52)
- Eigene Workflows können Ideen aus GSD, B-MAD oder Beads aufnehmen. (27:40)
- Der Workflow-Builder entsteht, wenn man im Archon-Repo sagt, man wolle mit dem Workflow-Builder-Workflow einen Archon-Workflow bauen. (27:40)
- Der Beads-Nachbau im Demo: Exploration, Feature in Tasks zerlegen, Implementierung in einer Schleife mit Fortschritt, Validierung am Ende. (27:40)
- Geplant ist ein Workflow-Builder „wie n8n, aber für AI-Coding“. (27:40)
- Der Sprecher vermutet Bugs, weil Archon in der Beta steckt. (27:40)
## Demos / Schritte
1. Archon-Repo klonen, Verzeichnis wechseln, Claude Code öffnen.
2. „set up Archon“ sagen; der Archon-Skill übernimmt das Setup.
3. Voraussetzungen prüfen (inkl. Bun) und bei Bedarf installieren.
4. Erstes Ziel-Repo setzen (im Demo per lokalem Pfad, nicht das Archon-Repo).
5. Plattformen wählen: CLI plus im Demo GitHub, Telegram und Slack.
6. Credentials im separaten Setup-Wizard: SQLite, Claude, Auth über das Anthropic-Abo; Keys nicht in Claude Code.
7. Archon-Skill in das Zielprojekt kopieren; optionales Docs-Verzeichnis im Demo mit „no“.
8. In der ersten Session „Done“ sagen; Verbindungen prüfen, Default-Workflows listen, „Archon assist“ als Probe laufen lassen.
9. Im Ziel-Repo Claude Code öffnen und z. B. „Use Archon to fix issue number one in GitHub“ sagen.
10. Der Agent lädt den Skill, wählt „fix GitHub issue“, startet den Lauf im Hintergrund; Logs in Claude Code oder in der Web-UI.
11. Im Archon-Repo Frontend und Backend starten lassen; Browser auf Port 5178.
12. Dashboard: aktiver Workflow, Node-Fortschritt, Tool-Calls aus Claude Code.
13. YAML unter `.archon` zeigen: Description, Provider, Default-Modell, Node-Liste, Verzweigungen, optionales Modell pro Node, Commands als Node-Prompts.
14. In der Web-UI ein weiteres Issue (im Demo Nr. 3) demselben Workflow zuordnen.
15. Per CLI mehrere Issues parallel anstoßen (im Demo 5, 7, 8, 9, 10, 11); Ergebnis: acht offene PRs.
16. Im Archon-Repo den Workflow-Builder-Workflow starten, das Beads-Repo übergeben; es entsteht YAML (Exploration → Tasks → Loop → Validierung), sichtbar in der UI.
## Genannte Tools
- Archon — Open-Source-Harness-Builder: YAML-Workflows über Coding-Agents, CLI und Web-UI
- [claude-code-overview](obsidian://open?vault=knowledge-base&file=claude-code-overview) — Coding-Agent, den Archon orchestriert; Setup und Skill-Aufruf laufen darüber
- Codex — zweiter Coding-Agent; Support laut Sprecher fast fertig
- GitHub CLI — im Demo zum Lesen des Issues vor dem Workflow
- [[Bun]] — Voraussetzung der Installation; wird bei Bedarf mitinstalliert
- SQLite — Default-Datenbank im Setup-Wizard
- Postgres — optionale Datenbank statt SQLite
- GitHub — Plattform zum Anbinden und für Issue-/PR-Workflows
- [[Telegram]] — optionales Interface neben CLI und GitHub
- Slack — optionales Interface neben CLI, GitHub und Telegram
- Claude Agent SDK — lokale Laufzeit, über die das Anthropic-Abo laut Sprecher nutzbar ist
- Pi Agent SDK — geplante weitere Coding-Assistenten-Anbindung
- Open Code — geplante weitere Coding-Assistenten-Anbindung
- Beads — Open-Source-Repo für persistente strukturierte Agent-Memory; im Demo als Archon-Workflow nachgebaut
- GSD — Framework, das sich laut Sprecher als eigener Archon-Workflow abbilden lässt
- B-MAD — Framework, das sich laut Sprecher als eigener Archon-Workflow abbilden lässt
- n8n — Vergleichsbild für den geplanten visuellen Workflow-Builder
- Stripe Minion — internes Stripe-System für KI-PRs; nicht Open Source
- Haiku — Modell für leichte Nodes, z. B. Issue-Klassifikation
- Sonnet — Default-Modell der Nodes, wenn keines gesetzt ist
- Opus — Modell, um das man laut Sprecher eine Harness legen kann
- Mythos — angekündigtes Claude-Modell, laut Sprecher vor allem Enterprise
- MCP-Server — lassen sich pro Node einbinden, z. B. nur in der Planung
## Verwandt
- [[Introducing Archon - The Revolutionary Operating System for AI Coding]] — Vorgänger: Archon als OS in den Agents (RAG, Tasks), nicht als Schicht darüber
- [ai-agent-harness-konzept](obsidian://open?vault=knowledge-base&file=ai-agent-harness-konzept) — KIMS-Begriff der Agent-Harness (Hooks, Skills, Rules zur Laufzeit)
- [autonome-agent-workflows-overview](obsidian://open?vault=knowledge-base&file=autonome-agent-workflows-overview) — Entwicklungsprozess als orchestrierter, wiederholbarer Agent-Workflow
- [[Omnigent_ The New Meta-Harness for EVERY Coding Agent - Claude Code, Codex, Pi, More]] — andere Meta-Harness über Claude Code, Codex und Pi
- [skill-lib-coleam-skills](obsidian://open?vault=knowledge-base&file=skill-lib-coleam-skills) — Skills aus Cole Medins eigenem Bestand
- [skill-lib-ecc](obsidian://open?vault=knowledge-base&file=skill-lib-ecc) — weiteres „Agent harness operating system“ (Plan → Test → Review)
- [skill-lib-gnhf](obsidian://open?vault=knowledge-base&file=skill-lib-gnhf) — Ralph-artiger Orchestrator für unbeaufsichtigte Iterationen
- [agent-harness-abo-zugaenge](obsidian://open?vault=knowledge-base&file=agent-harness-abo-zugaenge) — welche Abos lokale Harnesses (inkl. Agent SDK) wirklich tragen
- [[12-Factor Agents Patterns of reliable LLM applications — Dex Horthy, HumanLayer]] — Zuverlässigkeit über Gates und Human-in-the-Loop statt nur Agent-Prompts

---

# Fassung B

## Worum es geht

Cole Medin stellt die komplett überarbeitete Version von **Archon** vor — laut Sprecher der erste Open-Source-"Harness-Builder" für AI-Coding. Statt wie früher ein in die Coding-Agents eingebautes Tool zu sein, sitzt das neue Archon *über* Claude Code und Codex und orchestriert mehrere Coding-Agent-Sessions zu wiederholbaren, deterministischen Workflows.

## Besprochene Konzepte

- **Harness Engineering** — Schicht über den Coding-Agents, die mehrere Sessions verkettet, Tooling/Prompting/Validierung bündelt und so einen einzelnen LLM aufwertet.
- [[Context Engineering is the New Vibe Coding (Learn this Now)]] — Kuratieren des perfekten Kontexts für einen einzelnen Agent; Zwischenstufe in der Evolution.
- [Prompt Engineering](obsidian://open?vault=knowledge-base&file=llm-coding-prompting-patterns) — frühere Stufe (2022–2024): einen LLM so prompten, dass ein einzelner bestmöglicher Output entsteht.
- Workflow aus Nodes — ein Node ist entweder ein Prompt in eine Coding-Agent-Session oder ein deterministischer Command (z.B. erzwungene Kontext-Erstellung oder Validierung).
- Hybrid-Ansatz ("hybrid secret") — die meisten Schritte treibt der Coding-Agent über Commands/Skills, kritische Schritte (Kontext-Kuration, Tests) werden deterministisch erzwungen.
- Per-Node-Modellwahl — pro Node lässt sich Modell und neue-Session-vs-Conversation-Fortsetzung festlegen, für Token-Management und Kosteneffizienz.
- DAG-Workflow mit Verzweigungen — Klassifizierung (Bug vs. Feature) steuert den weiteren Pfad (Investigation vs. Planning).
- Human-in-the-Loop-Gate — Workflow kann an beliebigen Nodes für Nutzer-Feedback pausieren.

## Behauptungen

- Harnesses seien "die Zukunft" und das, was AI-Coding deterministisch und wiederholbar mache ([0:00](https://www.youtube.com/watch?v=qMnClynCAmM&t=0s)).
- Der alte Archon sei irrelevant geworden, weil die Coding-Agents RAG und Task-Management selbst eingebaut haben ([5:54](https://www.youtube.com/watch?v=qMnClynCAmM&t=354s)).
- Bei Planning und Implementation solle man immer getrennte Sessions / einen frischen Context nutzen, um Bias zu entfernen ([5:54](https://www.youtube.com/watch?v=qMnClynCAmM&t=354s)).
- Claude stehe kurz vor dem Release von "Mythos", das eher für Enterprise-Nutzung gedacht sei und für Endkunden zu teuer ([5:54](https://www.youtube.com/watch?v=qMnClynCAmM&t=354s)).
- Ein Harness um Opus könne dieses mächtiger machen als Mythos allein ([5:54](https://www.youtube.com/watch?v=qMnClynCAmM&t=354s)).
- Eine Studie zeige: Ein LLM allein erreiche nur 6,7 % PR-Acceptance-Rate, mit einem Harness bis zu fast 70 % ([5:54](https://www.youtube.com/watch?v=qMnClynCAmM&t=354s)).
- Stripe shippe mit "Stripe Minion" 1.300 rein AI-generierte Pull Requests pro Woche; das System sei Archon-ähnlich, aber nicht Open Source ([5:54](https://www.youtube.com/watch?v=qMnClynCAmM&t=354s)).
- Laut Claude-Code-Source-Code-Leak seien 40 % von Anthropics Codebase reiner Harness-Code ([5:54](https://www.youtube.com/watch?v=qMnClynCAmM&t=354s)).
- Die Installation gelinge in unter 5 Minuten, weil ein Skill den Coding-Agent durch den gesamten Setup führe ([8:48](https://www.youtube.com/watch?v=qMnClynCAmM&t=528s)).
- API-Keys solle man nicht direkt in Claude Code eingeben — der Setup-Wizard läuft in einem separaten Terminal-Prozess ([8:48](https://www.youtube.com/watch?v=qMnClynCAmM&t=528s)).
- Die Nutzung des Anthropic-Abos sei erlaubt, solange es eine lokal laufende App über das Claude Agent SDK ist — was bei Archon der Fall sei ([8:48](https://www.youtube.com/watch?v=qMnClynCAmM&t=528s)).
- Aktuell werde vor allem Claude unterstützt, Codex-Support sei fast fertig; später sollen Pi Agent SDK und Open Code folgen ([8:48](https://www.youtube.com/watch?v=qMnClynCAmM&t=528s)).
- Workflows seien einfache YAML-Dateien, leicht anzupassen und selbst zu erstellen ([18:47](https://www.youtube.com/watch?v=qMnClynCAmM&t=1127s)).
- Die Workflow-Description vorne funktioniere wie bei Claude-Code-Skills — der Agent bekommt zuerst nur die kurze Beschreibung, nicht den ganzen Workflow in den Context ([18:47](https://www.youtube.com/watch?v=qMnClynCAmM&t=1127s)).
- Klassifizierungs-Nodes brauchten wenig Reasoning und könnten mit Haiku günstig/token-effizient laufen, default sei Sonnet ([18:47](https://www.youtube.com/watch?v=qMnClynCAmM&t=1127s)).
- Man könne viele Workflows parallel als Background-Prozesse laufen lassen (z.B. sechs GitHub-Issues gleichzeitig) ([25:52](https://www.youtube.com/watch?v=qMnClynCAmM&t=1552s)).
- Beads sei ein Open-Source-Repo, das Coding-Agents persistenten, strukturierten Speicher gebe ([27:40](https://www.youtube.com/watch?v=qMnClynCAmM&t=1660s)).
- Archon sei noch in Beta, es werde wahrscheinlich Bugs geben ([27:40](https://www.youtube.com/watch?v=qMnClynCAmM&t=1660s)).

## Demos / Schritte

1. Repository klonen, ins Verzeichnis wechseln und Claude Code öffnen ([8:48](https://www.youtube.com/watch?v=qMnClynCAmM&t=528s)).
2. "set up Archon" eingeben — der Archon-Skill lädt automatisch und startet den geführten Setup-Prozess ([8:48](https://www.youtube.com/watch?v=qMnClynCAmM&t=528s)).
3. Prerequisites prüfen (u.a. Bun, wird bei Bedarf installiert) und das erste Ziel-Repository registrieren (eigenes Projekt, nicht das Archon-Repo) ([8:48](https://www.youtube.com/watch?v=qMnClynCAmM&t=528s)).
4. Plattformen wählen (CLI default, optional GitHub, Telegram, Slack) ([8:48](https://www.youtube.com/watch?v=qMnClynCAmM&t=528s)).
5. Im separaten Terminal-Wizard Datenbank (SQLite oder Postgres) und Coding-Assistant (Claude via globaler Anthropic-Auth) wählen und Credentials für die Plattformen eingeben ([8:48](https://www.youtube.com/watch?v=qMnClynCAmM&t=528s)).
6. Archon-Skill ins Ziel-Projekt installieren ([8:48](https://www.youtube.com/watch?v=qMnClynCAmM&t=528s)).
7. Zur ersten Session zurückkehren, "Done" melden; Archon testet Connections, listet Default-Workflows und führt einen Test-Workflow aus ([8:48](https://www.youtube.com/watch?v=qMnClynCAmM&t=528s)).
8. In einem beliebigen Repo Claude öffnen und z.B. "Use Archon to fix issue number one in GitHub" sagen — der passende Workflow läuft als Background-Prozess ([15:03](https://www.youtube.com/watch?v=qMnClynCAmM&t=903s)).
9. Front- und Backend per Agent starten und das Web-Dashboard auf Port 5178 öffnen, um Workflows und Logs zu visualisieren ([17:01](https://www.youtube.com/watch?v=qMnClynCAmM&t=1021s)).
10. Mehrere Issues in einem Befehl parallel abarbeiten lassen → mehrere offene Pull Requests als Ergebnis ([25:52](https://www.youtube.com/watch?v=qMnClynCAmM&t=1552s)).
11. Custom-Workflow per "workflow builder workflow" bauen lassen — Beispiel: einen Beads-inspirierten Workflow als YAML generieren ([27:40](https://www.youtube.com/watch?v=qMnClynCAmM&t=1660s)).

## Genannte Tools

- [Claude Code](obsidian://open?vault=knowledge-base&file=claude-code-overview) — Coding-Agent, über den Archon Sessions orchestriert.
- Codex — zweiter Coding-Agent, Support fast fertiggestellt.
- Claude Agent SDK — Grundlage, über die Archon lokal das Anthropic-Abo nutzen darf.
- Mythos — kommendes, enterprise-orientiertes Claude-Angebot (als Vergleich genannt).
- Opus / Sonnet / Haiku — Claude-Modelle; per Node wählbar (Haiku günstig für Klassifizierung).
- Ralph loop — bekannter Harness-Ansatz, in Archon als Workflow nachgebaut.
- Stripe Minion — Stripes internes, nicht-öffentliches AI-Coding-System als Vorbild.
- Beads — Open-Source-Repo für persistenten strukturierten Coding-Agent-Speicher.
- B-MAD / GSD — Coding-Frameworks, die man in Archon-Workflows überführen kann.
- Bun — JavaScript-Runtime, Prerequisite für Archon.
- SQLite / Postgres — wählbare Datenbanken.
- GitHub (CLI) / Telegram / Slack — Interfaces, über die Archon angesteuert werden kann.
- Pi Agent SDK / Open Code — geplante zukünftige Coding-Assistant-Integrationen.
- N8N — als Analogie für den geplanten visuellen Workflow-Builder ("N8N für AI-Coding").

## Verwandt

- [[Introducing Archon - The Revolutionary Operating System for AI Coding]] — die alte Archon-Version desselben Channels, die der Sprecher hier explizit als überholt beschreibt.
- [[The Greatest AI Coding System I've Ever Used, Forget Codex Vs Claude Code]] — anderes Tool (Goal Buddy) zum selben Thema: lang laufende, autonome Coding-Tasks über Claude Code/Codex.
- [Claude Code Session Management](obsidian://open?vault=knowledge-base&file=claude-code-session-management) — passt zu Archons Kernversprechen, Context/Token über mehrere Sessions hinweg schlank zu halten.
- [AI Code Quality Research](obsidian://open?vault=knowledge-base&file=ai-code-quality-research) — Hintergrund zur Behauptung, dass Validierung/Kontext-Kuration im Harness die PR-Qualität von AI-Code drastisch hebt.
