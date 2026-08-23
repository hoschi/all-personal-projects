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

### [0:00](https://www.youtube.com/watch?v=Ib5GBkD555M&t=0s) — The narrative: you are the bottleneck, just ship more

What's up everybody? How we doing? Guys, give it up for all the great speakers today so far.

All right, this is Harness Engineering is not enough and why software factories fail. And we're going to click, maybe. Oop. Oh, that's way too many slides. Hold on, guys. Okay.

So, we're all racing to put AI coding into production. And there's been lots been said about loop engineering. And we should probably write more loops. And yeah, I don't know. I guess we're doing loops now. StrongDM built a lights-out software factory where nobody even reads the code. And the prevailing narrative is we should just spend more tokens. You are the bottleneck. The models are good enough. Code is free. Just ship more stuff.

### [1:28](https://www.youtube.com/watch?v=Ib5GBkD555M&t=88s) — The cracks: outages and falling PR review quality

But at the same time, we are starting to see the cracks. Our friend Mario at AI Engineer Europe begged us to slow down because companies that should not be having outages because of coding agents are having outages due to coding agent mishaps. Codebases are falling apart faster than they ever have before. And our friends at Faros AI actually even did a report since we all picked up all these AI coding tools in January, maybe February. Pull request code review quality is way down. We're having more comments, longer comments, and tons of PRs being merged without any review at all. Incidents are way up, bugs per developer are way up, and many people will tell you that you're holding it wrong. That's the only reason. You're not. Well, maybe you are, but that's not the point.

I've spoken a lot about how to hold it better when it comes to working with AI. Probably a million views on YouTube at this point across a bunch of different talks. And the basic thing is like as engineers, we've been told that if token maxing isn't working, then it's a skill issue. You just need to spend more tokens. Let go of reading the code. That with enough harness engineering, if we maybe sprinkle some magic words, adversarial review on enough of our PR bots, that we can get the best of both worlds. 10 to 100x faster, high quality, and nobody has to do that thing we all hate called code review.

### [2:20](https://www.youtube.com/watch?v=Ib5GBkD555M&t=140s) — The thesis: the harness is not enough

I'm here to convince you today that this is in fact not a skill issue. That no amount of harness engineering or loops maxing can solve what is fundamentally a model training issue. That's why we say the harness is not enough. And to understand this, we kind of have to grapple and dig into how coding models are trained. I'm going to talk about what I think the shortcomings are with some of the current benchmarks and what better ones might look like. And we'll talk about how to move faster safely in the meantime.

It's going to sound like a rant, but there is hope here. I'm going to talk about our journey and a bunch of the landmines we've hit building in this world. A bunch of exciting new techniques that we've been working with a lot of our users and customers to develop. And I think how we all as a community get to the next chapter of agentic engineering after whatever this thing that we're in.

### [3:36](https://www.youtube.com/watch?v=Ib5GBkD555M&t=216s) — A brief history of the software factory

So we use a lot of words here. I'm going to zoom out a little bit. I want to give you kind of like a brief history of the software factory. And it's actually — I just learned this last week — the term software factory was defined at a NATO conference in 1968.

We're going to start around 2022, like right before AI started coming around. And basically in a typical 2022 software factory, you will have some people building stuff. You'll have engineers, you'll have PMs, maybe you have some sort of leadership team that is driving the vision here. And they all decide that stuff needs to get done. And so you put it in a tracker, a linear, a Jira, a beads, some sort of state machine that tracks what needs to be done.

And then someone goes and grabs something off of there, and they build the thing. And there may be some automated testing in that process, maybe some manual testing in that process. At a certain point, we make this pull request thing. Says, "Okay, cool. We got to run a bunch of checks, automated stuff. A human's going to review the change and review the code. And perhaps we might even have a human pull it down and test it somehow." And if anything goes wrong here, we loop back to someone builds the thing.

And eventually we're ready for prod. And so we ship it to production. And once it's in prod, it makes contact with our users. And users do a thing that we all love. Users love to complain. I love our users. But yeah, they're going to ask for things, they're going to find bugs, they're going to file feature requests. And that goes back to your team. You might also add monitoring. And so, you know, what do we want more than anything else? We want to wake up engineers at 3:00 in the morning when something breaks. So they can get dragged out of bed to try to go fix it. And we go on and on in this loop.

And we ship a bunch of code. And one thing that we noticed here is that teams figured this out decades ago is that this "someone builds the thing" step is usually going to take hours or days in most cases. And the review part will also take hours or days for large things. And so teams started doing these upfront planning, architectural proposals, sprint planning, and they would collaborate on these things as a team with the hopes that we might decrease the percent chance that something would need to be reworked. That we would be able to reduce the time spent in reviewing every line of code because we aligned on everything ahead of time.

### [5:52](https://www.youtube.com/watch?v=Ib5GBkD555M&t=352s) — The agentic factory and turning the lights off

This brings us to the agentic software factory. Every company and their mother is talking about how they built a coding agent factory that ships 75% of their code now. Literally everybody.

And so if we look at the software factory from 2022, we just replace "someone builds the thing" with "an agent builds the thing." And we have an orchestration and a harness and a sandbox and a model and computer use and I'm not going to get into the details of that. You can watch 100 talks about that this week, I'm sure. But now the building part takes minutes or hours, but this human part still takes hours or days if you're going to review the code and test the changes.

And so we bring in agentic code review. We bring in agentic regression testing, and it makes this part faster, but it's probably still the bottleneck. But we can do more loops here. Why not? Let's do some more loops. So we can route all incidents straight into the factory. Why does someone need to get woken up and try to fix it when they could just wake up to a pull request and maybe that fixes the issue for you. You can take all the user feedback and just stick it straight into the factory so that people ask for stuff and it gets built.

And now your only job is how much things can you stuff into the queue of stuff to do and how fast can you review and test the changes? Which brings us of course to, I'm sure you know, the lights off software factory where basically Dentsu Bureau coined this — we no longer read the code. We say, "You know what? This is going great. That code review thing? No, thanks. We're just not going to do that anymore." And we invest into all these other parts of the system. Your testing, your monitoring, your rollout, everything else. We just write more code and build those systems better. And now our job really is just how much stuff can we ask the agent to build?

### [7:30](https://www.youtube.com/watch?v=Ib5GBkD555M&t=450s) — Why it fails: the July 2025 lights-off experiment

I am going to posit that this does not work. And this is why software factories fail. As an aside, what I'm going to say has nothing to do with vibe coding. Addy had this great post. I'm going to literally take his quote verbatim. A developer vibe coding a side project a dozen people will ever run, and a team keeping a 10-year-old enterprise system alive for another quarter share almost no constraints worth naming. And most of what you hear on the internet is one of these groups of people telling the other group of people how to live their lives.

So, if you love vibe coding, please go on. At Human Layer, what we care about is how do we help people solve hard problems in complex codebases. We use the word brownfield a lot, which historically has meant like some 10-year-old Java thing. I actually think agents really start to struggle after maybe 3 to 6 months, especially with the pace at which we can ship now.

You can ask me how I know this, and I will tell you that it is because in July 2025, we tried this. We went full lights off, and if you have tried this seriously for a number of months, you probably found at least one issue that the agent couldn't solve. Even with your most advanced prompting, you do research, you do reproductions, you just have to go and dig into that codebase that you stopped reading 3 months ago to try to figure out what's broken. And in the meantime, your site was down, your users were pissed, and if you were like me, you were probably miserable reading all this slop code that you let slip into your system.

### [8:56](https://www.youtube.com/watch?v=Ib5GBkD555M&t=536s) — Models cannot maintain codebase quality

And what I want to get to is basically models have a shortcoming. They can't maintain and improve codebase quality over time, not without a decent amount of human steering.

And when I say maintainability, I'm basically talking about issues like it becomes really, really hard to make a change in one part of the codebase without breaking other parts of the codebase. This is Martin Fowler's shotgun surgery, textbook code smell. I'm not going to say much more about maintainability. There's a bunch of books that you can go read about it. In fact, John Ousterhout is actually here speaking this week, so you can go ask him in person about the philosophy of software design if you want to.

But it brings us to this question of like why can't models do software maintainability? And you may also be saying, but Dex, you know, surely the models have gotten much better since then. They've gotten better in some ways, but they're still about the same in others. If you want to solve one-off problems or vibe code a new marketing side, yes, they got way better since 2025 and 2024. But as far as improving codebase quality, I think they have not gotten much better. Now, I cannot prove this because there are no good benchmarks for a model's ability to maintain codebase quality, and I'll get into where we're going with that.

But if you've worked with coding agents for a while, a lot of people are posting about this. It's just like you probably have this vibe that they generally make things worse over time and make the codebase harder to work in.

### [10:12](https://www.youtube.com/watch?v=Ib5GBkD555M&t=612s) — Why Claude Code won and how coding models are trained

And to figure out why this happens, I want to zoom out to the first great coding agent. Why did Claude Code go from nothing to 4 billion and I think now they're at 9 billion in revenue in under a year? Cuz they were great — CLI agents before Claude Code. You had Aider, you had Codebuff. There was a bunch of tools in this category. They had all the same tools, read, write, edit, grep, bash. So what was the difference? The difference was that this was the first time that a model lab trained a model against the harness that they were going to distribute it to users in.

And it got really, really good at — this is just some of the tools, but it got really, really good at calling these sorts of tools in an agentic loop. In fact, the OpenAI team did a talk in November about basically if you are a harness builder and you don't own the model weights and you can't RL the model in your harness, you will always be at a disadvantage compared to somebody who owns both the model and the harness.

And I'm going to cite a couple slides from my buddy Calvin French-Owen, who was a MTS on Codex during the initial launch. But LLMs are just next token predictors. This is a slide from over a year ago where basically as you're doing your agentic loop, context window goes in, next step comes out.

And we're going to try to do this. I haven't actually timed this, but we're going to see if we can do coding agent reinforcement learning in 60 seconds. So, what we're going to do if we want to train a model to get better at tool calling, better at solving software problems, we're going to give it a problem and we're going to generate a bunch of traces. Try to solve the problem a bunch of different times. We're going to score them all on correctness and did the test pass and all this stuff.

And then we're going to reinforce. We're going to make the bad behavior less likely and we're going to update the weights to make the good behavior more likely. This one of the classic ones here is SWE-bench Multilingual. They're about 15-minute tasks. They're from open-source repos like Redis, JQ, and Django and all this stuff. And they have binary one or zero rewards on did you fix the problem you were trying to fix? And did you do it without breaking anything else?

And we look at actually a real problem from one of these benchmarks. This is Fastlane, which is a Ruby project. Basically, there was some issue where we weren't checking for nil and we have a stack trace blow up because you have a null pointer exception. And in this benchmark, you have a base commit that we're going to check out before the issue was solved by a human in the past. We're going to give it a test patch that says here's what the behavior should be afterwards. We have a golden patch. Both these are hidden from the model.

And so we have the agent go try to solve the problem. We store its patch. We undo all the changes it made to any test files cuz I'm sure you've seen models comment out tests just to get things working. And then we're going to apply our golden test patch. And then we're going to run the test. Old test and did the new test pass? And if they both pass, then we get the reward. Otherwise, we don't.

And so models are trying to get the test to pass. There's no way in this system that we can penalize it for poor program design or for eroding the maintainability of our systems. That's why we get things like this. Try catches around things that probably don't need a try catch. Or things like this. I think Bybop gave us this example earlier of casting things to other things just so the model can just get the test to pass.

And so if you can't verify the maintainability of the code, it gets way harder to train on this stuff. So you remember this picture? Verifying code quality and maintainability is orders of magnitude harder than the code runs and the test pass. Because the cost function of bad architecture is measured in months and years. If you have a coding episode and then you only find out months later that like somebody vibed this a little bit too hard, it's really hard to propagate that reward signal back across the gap.

### [13:18](https://www.youtube.com/watch?v=Ib5GBkD555M&t=798s) — Verifying maintainability and better benchmarks

And now the frontier is getting better, slowly. And since I know someone's going to be in the YouTube comments about this, yes, I know benchmarks and verifiers are different and they actually have to be separate data sets, but they're shaped the same and the structure of these benchmarks is directionally correct. So we're going to look at these as like what is the future of evaluating code maintainability.

There's a really cool one called Sweep Marathon from Abundant AI where they do like 400-hour tasks of like clone all of Microsoft Excel, every single feature. And they have some sophisticated reward channel stuff. Deep Sweep from Data Curve is also like large tasks on OSS repos that are not actually in the training set cuz they were never actually built in the real world. And then you have Frontier Code from Cognition, which is multi-PR tasks. They do interesting things like hey, if the model writes tests that don't fail on the pre-patch code, then it gets penalized. And then we have a judge model that says, "Okay, did this follow all of our code quality rules?"

So we're getting better, but I think models judging quality can only go so far cuz if the model knew what good code looks like, it would probably write it in the first place. And review agents and throwing more tokens at the problem, it can raise the floor, but we're still constrained by what we can teach during RL.

And so I will posit that for now we're stuck reading the code, but we can still move pretty fast. And of course there's a world where this is solved in the future, and if you want to just keep yolowing prompts until you get to GPT-7 and you don't have to think about this, by all means, please. But bitter lesson be damned, we've got some problems to solve. So let's engineer our way out of this.

### [14:58](https://www.youtube.com/watch?v=Ib5GBkD555M&t=898s) — Turning the lights back on: plan up front

So turning the lights back on, we're going to put the code review back. We're going to embrace this approach of like how do we plan up front to reduce the chance that we have a long or difficult review process. We're going to find leverage. We're going to use AI to help with this.

The first thing we're going to do is we're going to do some sort of product review, understanding what problem we're solving, what's the desired behavior, maybe looking at mock-ups. Here's a product review I was working on yesterday with a mock-up of a new feature. Once we have our product review — by the way, we don't do this for small stuff, still just go straight to the agent.

But once we have the product review, we're going to also do architecture, system architecture. A lot of people have been doing this for a while, component contracts, data models, constraints. This is an example of a doc that we build to understand how these systems are going to fit together and what's like the high-level picture of it.

From there, we do something that I think is really under-emphasized in agentic coding these days, which is program design. I think people assume that once you get the architecture right, the model can just cook. But we often look into the types and the method signatures, the program layout and the call stacks. So here's some examples. I don't think you'll be able to read this one, but this is like the level of abstraction we're at. It's how we're actually going to lay this stuff out and how these systems are going to interact. Dylan Mulroy from Cloudflare talks a lot about how he's using these call graphs as part of his planning process. I think this is exactly right.

And then once we've done the product program design, we can do this thing called vertical slices, which is the order of implementation, multi-repo coordination, how we're going to build this across our entire system, and how are we going to check it along the way. I've talked a little bit about how models have horizontal plans. I won't go too deep into it. If you want to learn more about this, you can go watch our talk from AI Engineer Miami. Couple shots of a doc like this going through the tests and the steps in between each phase.

The main idea here is 30 minutes over here in pre-planning and alignment can save you hours in review. And so it's actually feasible to still read every line of code.

### [17:16](https://www.youtube.com/watch?v=Ib5GBkD555M&t=1036s) — Too many bad PRs, and closing advice

We'll skip this part. Basically, the summary here is like you don't have too many PRs. If you're drowning in PRs, you actually have too many bad PRs. Because a good PR is a joy to review. You're just reading through it like, "Yep, this is great. This is what we discussed. This is what we talked about." But even if a PR needs 20% rework, which is generous for a lot of AI vibe coded slop, it's an emotional and intellectual burden on both the reviewer and the submitter.

And so if you use model assistant planning and alignment, your alignment is shorter cuz you used AI to get all the information at once. Your code review is faster because you aligned up front, and your coding is faster cuz AI did it. And so you're actually really moving faster, but you're still reading everything and you're still owning the code.

So, closing advice, is easy to hear all this and be a little bummed out. I really like the world where we just YOLO everything, and we can just not have to ever read code ever again. But we're engineers, and these are just constraints, and models are good at certain things, and they're not good at other things. And so go figure out how to solve problems given a set of constraints.

Use loops, they're great. Go solve hard problems. Seek leverage. If you want to help with this, we're building Human Layer. Human Layer is an AI IDE and collaboration platform. It's building blocks for your software factory, and soon to be better verifiers for software quality. We've got sort of a Figma for Claude Code and Codex-style collaborative workspace. It walks you through the workflows for doing this sort of work. And we are talking to design partners. We are hiring founding engineers here in San Francisco.

And these slides are live. You can go get them right now. You can try Human Layer at humanlayer.com. It's free for small teams. Go solve hard problems in complex codebases. Thank you all for your energy.

---

# Fassung A

## Worum es geht
Dex (Human Layer) hält den Konferenzvortrag „Harness Engineering is not enough and why software factories fail“. These: Coding-Agenten in Produktion scheitern nicht an zu wenig Loops oder Tokens, sondern daran, dass Modelle auf Test-Bestehen trainiert werden und Codebase-Qualität nicht halten.
## Besprochene Konzepte
- [[Harness Engineering_ What Separates Top Agentic Engineers Right Now]] — Hülle aus Orchestrierung, Sandbox, Loops und Review-Bots um das Modell
- Lights-off Software Factory — Code wird nicht mehr gelesen; Testing, Monitoring und Rollout sollen die Qualität tragen
- Agentic Software Factory — der Schritt „jemand baut das Ding“ wird durch einen Agenten ersetzt
- Token-Maxing / Loop-Maxing — mehr Tokens und mehr Loops als Antwort auf Qualitätsprobleme
- [[Vibe Coding]] — der Sprecher grenzt Side-Project-Vibe-Coding gegen Brownfield-Enterprise ab
- Brownfield — historisch alte Java-Systeme; der Sprecher setzt die Schwelle schon bei 3–6 Monaten
- Shotgun surgery — Fowler-Code-Smell: eine Änderung zwingt zu vielen anderen Stellen
- [llm-benchmark-register](obsidian://open?vault=knowledge-base&file=llm-benchmark-register) — SWE-bench-artiges Training mit binärer Belohnung (Tests grün oder nicht), ohne Strafe für schlechtes Design
- RL auf Traces — viele Lösungsversuche bewerten, gutes Verhalten in den Weights verstärken
- Modell-plus-Harness-Eigentum — wer Weights und Auslieferungs-Harness besitzt, kann RL dort fahren
- Program Design — Typen, Methodensignaturen, Layout und Call Stacks, nicht nur Systemarchitektur
- Vertical Slices — Implementierungsreihenfolge, Multi-Repo-Koordination und Checks zwischen den Phasen
- Alignment vorab — Product Review, Architektur und Program Design, damit Review kürzer wird
## Behauptungen
- Die vorherrschende Erzählung lautet: du bist der Engpass, Modelle sind gut genug, Code ist gratis, einfach mehr shippen. (0:00)
- StrongDM hat eine Lights-out-Software-Factory gebaut, in der niemand den Code liest. (0:00)
- Firmen, die keine Ausfälle durch Coding-Agenten haben sollten, haben genau solche Ausfälle. (1:28)
- Codebases zerfallen schneller als zuvor. (1:28)
- Faros AI: seit der breiten Einführung von AI-Coding-Tools (Januar/Februar) sinkt die Pull-Request-Review-Qualität; mehr und längere Kommentare, viele PRs ohne Review, Incidents und Bugs pro Entwickler steigen. (1:28)
- Die Standardantwort „you're holding it wrong“ / Skill Issue trifft nicht den Kern. (1:28)
- Laut Sprecher reicht keine Menge Harness Engineering oder Loop-Maxing, weil das Grundproblem im Modell-Training liegt. (2:20)
- Der Begriff Software Factory stammt laut Sprecher von einer NATO-Konferenz 1968. (3:36)
- Im 2022-Ablauf dauern Bauen und Review oft Stunden bis Tage; Teams planen deshalb vorab, um Rework und Zeile-für-Zeile-Review zu senken. (3:36)
- Viele Firmen behaupten, eine Coding-Agent-Factory shippe 75 % ihres Codes. (5:52)
- Agentisches Bauen dauert Minuten bis Stunden, menschliches Review und Testen weiter Stunden bis Tage. (5:52)
- Lights-off (Begriff laut Sprecher von Dentsu Bureau): Code-Review entfällt, investiert wird in Tests, Monitoring und Rollout. (5:52)
- Der Sprecher setzt: Lights-off funktioniert nicht. (7:30)
- Zitat von Addy, wortgleich übernommen: ein Side-Project, das ein Dutzend Leute nutzen, und ein zehn Jahre altes Enterprise-System teilen fast keine nennenswerten Constraints. (7:30)
- Human Layer zielt auf harte Probleme in komplexen Codebases. (7:30)
- Der Sprecher vermutet: Agenten tun sich nach 3–6 Monaten schwer, besonders bei heutigem Ship-Tempo. (7:30)
- Im Juli 2025 ging Human Layer full lights-off; es blieb mindestens ein Issue, das der Agent nicht löste, die Site lag, User waren verärgert, der Code war Slop. (7:30)
- Modelle können Codebase-Qualität ohne erhebliches menschliches Steering nicht halten oder verbessern. (8:56)
- One-off-Probleme und Vibe-Coding-Marketing-Sites wurden seit 2024/2025 deutlich besser; Codebase-Qualität laut Sprecher kaum. (8:56)
- Der Sprecher sagt, er könne das nicht belegen, weil es keine guten Benchmarks für Maintainability gibt. (8:56)
- Claude Code ging laut Sprecher in unter einem Jahr von nichts auf 4 Milliarden und seiner Einschätzung nach auf 9 Milliarden Umsatz. (10:12)
- Aider und Codebuff hatten dieselben Tools (Read, Write, Edit, Grep, Bash); der Unterschied war Training gegen die ausgelieferte Harness. (10:12)
- OpenAI-Talk im November: ein Harness-Bauer ohne Weights und ohne RL in der eigenen Harness bleibt im Nachteil. (10:12)
- SWE-bench Multilingual: Aufgaben von etwa 15 Minuten aus OSS-Repos (Redis, JQ, Django), Reward 0/1 für Fix ohne Regression. (10:12)
- In diesem Setup gibt es keine Strafe für schlechtes Program Design oder erodierte Maintainability. (10:12)
- Modelle kommentieren Tests aus, setzen unnötige try/catch und Casts, nur damit Tests grün werden (Beispiel von Bybop). (10:12)
- Codequalität und Maintainability zu prüfen ist um Größenordnungen schwerer als „läuft und Tests sind grün“, weil schlechte Architektur erst in Monaten und Jahren kostet. (10:12)
- Sweep Marathon (Abundant AI): Aufgaben in der Größenordnung 400 Stunden, etwa Microsoft Excel Feature für Feature nachbauen. (13:18)
- Deep Sweep (Data Curve): große Aufgaben auf OSS-Repos, die so nie gebaut wurden und deshalb nicht im Trainingssatz liegen. (13:18)
- Frontier Code (Cognition): Multi-PR-Aufgaben; Strafe, wenn Tests auf dem Pre-Patch-Code nicht fehlschlagen; Judge-Modell für Qualitätsregeln. (13:18)
- Der Sprecher setzt: ein Modell, das gutes Code aussehen kennen würde, würde es vermutlich selbst schreiben; Review-Agenten und mehr Tokens heben den Boden, die Grenze bleibt, was RL lehren kann. (13:18)
- Der Sprecher setzt: vorerst muss man den Code weiter lesen. (13:18)
- 30 Minuten Vorplanung und Alignment können Stunden Review sparen; dann ist es machbar, jede Zeile zu lesen. (14:58)
- Kleinkram geht weiter direkt an den Agenten, ohne Product Review. (14:58)
- Wer in PRs ertrinkt, hat nicht zu viele PRs, sondern zu viele schlechte PRs. (17:16)
- Selbst 20 % Rework — laut Sprecher großzügig für viel AI-Slop — ist eine emotionale und intellektuelle Last für Reviewer und Submitter. (17:16)
- Mit modellgestütztem Alignment wird Alignment kürzer, Review schneller, Coding schneller, und man besitzt den Code weiter. (17:16)
- Human Layer ist eine AI-IDE und Kollaborationsplattform, Bausteine für die Software Factory, später bessere Verifier für Softwarequalität; frei für kleine Teams auf humanlayer.com. (17:16)
- Laut Sprecher ein „Figma for Claude Code“ und ein Codex-artiger gemeinsamer Workspace. (17:16)
- Human Layer spricht mit Design Partners und stellt Founding Engineers in San Francisco ein. (17:16)
## Demos / Schritte
SWE-bench-Ablauf (an Fastlane, Ruby, Null-Check / NPE):
1. Base-Commit auschecken, bevor ein Mensch das Issue gelöst hat.
2. Test-Patch und goldenen Patch bereithalten, beides vor dem Modell verborgen.
3. Agent erzeugt einen Patch.
4. Änderungen an Testdateien rückgängig machen.
5. Goldenen Test-Patch anwenden, alte und neue Tests laufen lassen.
6. Reward nur, wenn beides grün ist.
Lights-on-Ablauf mit Folien echter Docs:
1. Product Review: Problem, gewünschtes Verhalten, Mock-ups (nicht für Kleinkram).
2. Systemarchitektur: Komponentenverträge, Datenmodelle, Constraints.
3. Program Design: Typen, Methodensignaturen, Layout, Call Stacks (Dylan Mulroy / Cloudflare: Call Graphs).
4. Vertical Slices: Reihenfolge, Multi-Repo, Tests und Checks zwischen den Phasen.
5. Danach bauen und jede Zeile reviewen.
## Genannte Tools
- [claude-code-overview](obsidian://open?vault=knowledge-base&file=claude-code-overview) — CLI-Coding-Agent, erstes Modell laut Sprecher gegen die eigene Auslieferungs-Harness trainiert
- Codex — OpenAIs Coding-Agent; ein früherer MTS des Launch-Teams (Calvin French-Owen) wird zitiert
- Aider — CLI-Coding-Agent vor Claude Code mit denselben Basis-Tools
- Codebuff — weiterer CLI-Agent derselben Generation
- Human Layer — AI-IDE und Kollaborationsplattform des Sprechers
- StrongDM — genannt als Lights-out-Software-Factory
- Faros AI — Report zu sinkender PR-Review-Qualität
- Linear — Tracker / Zustandsautomat für Arbeit
- Jira — Tracker / Zustandsautomat für Arbeit
- Beads — Tracker / Zustandsautomat für Arbeit
- SWE-bench Multilingual — Trainings- und Eval-Set mit binärem Test-Reward
- Sweep Marathon — Langhorizont-Benchmark von Abundant AI
- Deep Sweep — Langhorizont-Benchmark von Data Curve
- Frontier Code — Multi-PR-Benchmark von Cognition
- Figma — Vergleichsbild für den Human-Layer-Workspace
- Fastlane — Ruby-Projekt als Beispielaufgabe im SWE-bench-Ablauf
## Verwandt
- [[12-Factor Agents Patterns of reliable LLM applications — Dex Horthy, HumanLayer]] — früherer Konferenzvortrag desselben Sprechers zu zuverlässigen LLM-Anwendungen
- [[How to Build the Most Powerful System for AI Coding (Full Breakdown)]] — Cole Medin zur AI Dark Factory, dem Lights-off-Gegenstück
- [[How to Kill the Code Review — Ankit Jain, Aviator]] — anderer Konferenzvortrag dazu, Zeile-für-Zeile-Review abzulösen
- [[Coding mit AI]] — Hub zu Workflows und Tools beim Entwickeln mit KI
- [ai-agent-harness-konzept](obsidian://open?vault=knowledge-base&file=ai-agent-harness-konzept) — KIMS-Harness aus Hooks, Skills und Rules zur Laufzeit
- [ai-code-quality-research](obsidian://open?vault=knowledge-base&file=ai-code-quality-research) — Befundlage zu überladenem, schwer wartbarem AI-Code und Review-Last
- [gefuehrte-code-durchsicht-agenten-features](obsidian://open?vault=knowledge-base&file=gefuehrte-code-durchsicht-agenten-features) — Review-Wege für agenten-gebauten Code
- [vorlage-last-autonomer-laeufe](obsidian://open?vault=knowledge-base&file=vorlage-last-autonomer-laeufe) — Dark-Factory-Spur und Last autonomer Läufe
- [llm-benchmark-kontamination](obsidian://open?vault=knowledge-base&file=llm-benchmark-kontamination) — warum SWE-bench-artige Sets nicht das messen, was der Sprecher als Lücke benennt

---

# Fassung B

## Worum es geht

Dex von Human Layer hält auf einer Konferenz den Vortrag „Harness Engineering is not enough and why software factories fail". Er argumentiert, dass keine noch so gute Harness-Technik das Grundproblem löst: Coding-Modelle werden nicht darauf trainiert, die Wartbarkeit einer Codebasis zu erhalten — deshalb muss der Mensch den Code weiterhin lesen.

## Besprochene Konzepte

- Software Factory — Begriff aus einer NATO-Konferenz von 1968; die Schleife aus Tracker, Bauen, Pull Request, Review, Produktion, Nutzer-Rückmeldung und Monitoring ([3:36](https://www.youtube.com/watch?v=Ib5GBkD555M&t=216s))
- Agentic Software Factory — dieselbe Schleife, in der „jemand baut das Ding" durch „ein Agent baut das Ding" ersetzt wird, plus agentisches Review und agentische Regressionstests ([5:52](https://www.youtube.com/watch?v=Ib5GBkD555M&t=352s))
- Lights-off Software Factory — Ausbaustufe, in der niemand den Code mehr liest und stattdessen in Tests, Monitoring und Rollout investiert wird ([5:52](https://www.youtube.com/watch?v=Ib5GBkD555M&t=352s))
- [Harness](obsidian://open?vault=knowledge-base&file=ai-agent-harness-konzept) — Orchestrierung, Sandbox, Modell und Werkzeuge rund um den Coding-Agenten ([5:52](https://www.youtube.com/watch?v=Ib5GBkD555M&t=352s))
- Loop Maxing / Token Maxing — die Haltung, mehr Schleifen und mehr Token zu fahren, statt die Ursache zu beheben ([0:00](https://www.youtube.com/watch?v=Ib5GBkD555M&t=0s))
- [Wartbarkeit als Modell-Schwachstelle](obsidian://open?vault=knowledge-base&file=ai-code-quality-research) — Modelle können Code-Qualität über die Zeit nicht ohne menschliche Steuerung halten oder verbessern ([8:56](https://www.youtube.com/watch?v=Ib5GBkD555M&t=536s))
- Shotgun Surgery — Martin Fowlers Code Smell: eine Änderung an einer Stelle bricht andere Stellen ([8:56](https://www.youtube.com/watch?v=Ib5GBkD555M&t=536s))
- Coding-Agent-Reinforcement-Learning — Problem vorgeben, viele Traces erzeugen, auf Korrektheit bewerten, Gewichte in Richtung des guten Verhaltens verschieben ([10:12](https://www.youtube.com/watch?v=Ib5GBkD555M&t=612s))
- Binäres Reward-Signal — Base Commit, versteckter Test-Patch und Golden Patch; Belohnung nur, wenn alte und neue Tests bestehen ([10:12](https://www.youtube.com/watch?v=Ib5GBkD555M&t=612s))
- Brownfield — Arbeit an gewachsenen, komplexen Codebasen, abgegrenzt vom Wegwerf-Nebenprojekt ([7:30](https://www.youtube.com/watch?v=Ib5GBkD555M&t=450s))
- [Benchmarks für Wartbarkeit](obsidian://open?vault=knowledge-base&file=llm-benchmark-register) — Sweep Marathon, Deep Sweep und Frontier Code als Versuche, längere und mehrstufige Aufgaben zu bewerten ([13:18](https://www.youtube.com/watch?v=Ib5GBkD555M&t=798s))
- [Planung vor der Umsetzung](obsidian://open?vault=knowledge-base&file=planungs-skills-matt-pocock-vs-superpowers) — Product Review, Systemarchitektur, Program Design und Vertical Slices vor dem Bauen ([14:58](https://www.youtube.com/watch?v=Ib5GBkD555M&t=898s))
- Program Design — Typen, Methodensignaturen, Programm-Aufbau und Call Stacks als eigene Planungsebene zwischen Architektur und Code ([14:58](https://www.youtube.com/watch?v=Ib5GBkD555M&t=898s))
- Vertical Slices — Reihenfolge der Umsetzung, Repo-übergreifende Abstimmung und Prüfpunkte je Phase ([14:58](https://www.youtube.com/watch?v=Ib5GBkD555M&t=898s))

## Behauptungen

- Der vorherrschende Erzählstrang lautet: du bist der Engpass, die Modelle sind gut genug, Code ist umsonst, ship einfach mehr ([0:00](https://www.youtube.com/watch?v=Ib5GBkD555M&t=0s))
- StrongDM hat eine Lights-out-Software-Factory gebaut, in der niemand mehr den Code liest ([0:00](https://www.youtube.com/watch?v=Ib5GBkD555M&t=0s))
- Firmen, die keine Ausfälle haben sollten, haben Ausfälle durch Missgeschicke von Coding-Agenten ([1:28](https://www.youtube.com/watch?v=Ib5GBkD555M&t=88s))
- Codebasen zerfallen schneller als je zuvor ([1:28](https://www.youtube.com/watch?v=Ib5GBkD555M&t=88s))
- Ein Report von Faros AI zeigt: seit der breiten Einführung der KI-Coding-Werkzeuge im Januar/Februar ist die Pull-Request-Review-Qualität deutlich gefallen ([1:28](https://www.youtube.com/watch?v=Ib5GBkD555M&t=88s))
- Es gibt mehr und längere Review-Kommentare, und sehr viele PRs werden ganz ohne Review gemerged ([1:28](https://www.youtube.com/watch?v=Ib5GBkD555M&t=88s))
- Incidents und Bugs pro Entwickler sind deutlich gestiegen ([1:28](https://www.youtube.com/watch?v=Ib5GBkD555M&t=88s))
- Das ist kein Skill Issue: keine Menge an Harness Engineering oder Loop Maxing löst ein Problem, das im Modell-Training liegt ([2:20](https://www.youtube.com/watch?v=Ib5GBkD555M&t=140s))
- Vibe Coding an einem Nebenprojekt und die Pflege eines zehn Jahre alten Enterprise-Systems teilen fast keine nennenswerten Randbedingungen — Zitat von Addy ([7:30](https://www.youtube.com/watch?v=Ib5GBkD555M&t=450s))
- Agenten fangen laut Sprecher schon nach etwa drei bis sechs Monaten an zu straucheln, nicht erst bei zehn Jahre altem Java ([7:30](https://www.youtube.com/watch?v=Ib5GBkD555M&t=450s))
- Human Layer hat im Juli 2025 selbst voll auf Lights-off umgestellt und ist damit gescheitert ([7:30](https://www.youtube.com/watch?v=Ib5GBkD555M&t=450s))
- Wer es ernsthaft über Monate versucht, findet mindestens ein Problem, das der Agent nicht lösen kann — und muss dann in eine Codebasis einsteigen, die er drei Monate nicht gelesen hat ([7:30](https://www.youtube.com/watch?v=Ib5GBkD555M&t=450s))
- Modelle sind bei Einzelproblemen und neuen Marketing-Seiten seit 2024/2025 deutlich besser geworden, bei der Verbesserung der Codebasis-Qualität laut Sprecher nicht ([8:56](https://www.youtube.com/watch?v=Ib5GBkD555M&t=536s))
- Der Sprecher kann das nicht beweisen, weil es keine guten Benchmarks für die Fähigkeit zur Wartbarkeit gibt ([8:56](https://www.youtube.com/watch?v=Ib5GBkD555M&t=536s))
- Claude Code ging in unter einem Jahr von null auf 4 Milliarden und inzwischen 9 Milliarden Umsatz ([10:12](https://www.youtube.com/watch?v=Ib5GBkD555M&t=612s))
- Es gab vor Claude Code schon gute CLI-Agenten wie Aider und Codebuff mit denselben Werkzeugen — read, write, edit, grep, bash ([10:12](https://www.youtube.com/watch?v=Ib5GBkD555M&t=612s))
- Der Unterschied war, dass zum ersten Mal ein Modell-Labor ein Modell gegen genau die Harness trainiert hat, in der es ausgeliefert wird ([10:12](https://www.youtube.com/watch?v=Ib5GBkD555M&t=612s))
- Laut einem OpenAI-Vortrag im November ist ein Harness-Bauer ohne eigene Modellgewichte strukturell im Nachteil gegenüber jemandem, der Modell und Harness besitzt ([10:12](https://www.youtube.com/watch?v=Ib5GBkD555M&t=612s))
- SWE-bench Multilingual besteht aus etwa 15-Minuten-Aufgaben aus Open-Source-Repos wie Redis, JQ und Django mit binärem Reward ([10:12](https://www.youtube.com/watch?v=Ib5GBkD555M&t=612s))
- Modelle kommentieren Tests aus, nur damit etwas durchläuft — deshalb werden im Benchmark alle Änderungen an Testdateien zurückgenommen ([10:12](https://www.youtube.com/watch?v=Ib5GBkD555M&t=612s))
- Im binären Test-Reward gibt es keine Möglichkeit, schlechtes Programm-Design oder erodierende Wartbarkeit zu bestrafen ([10:12](https://www.youtube.com/watch?v=Ib5GBkD555M&t=612s))
- Daher entstehen unnötige try-catch-Blöcke und Casts, nur damit der Test besteht ([10:12](https://www.youtube.com/watch?v=Ib5GBkD555M&t=612s))
- Wartbarkeit zu verifizieren ist um Größenordnungen schwerer als „Code läuft und Tests bestehen" ([10:12](https://www.youtube.com/watch?v=Ib5GBkD555M&t=612s))
- Die Kostenfunktion schlechter Architektur wird in Monaten und Jahren gemessen — das Reward-Signal lässt sich über diese Lücke kaum zurückführen ([10:12](https://www.youtube.com/watch?v=Ib5GBkD555M&t=612s))
- Sweep Marathon von Abundant AI fährt etwa 400-Stunden-Aufgaben, etwa: klone alle Funktionen von Microsoft Excel ([13:18](https://www.youtube.com/watch?v=Ib5GBkD555M&t=798s))
- Deep Sweep von Data Curve nutzt große Aufgaben auf OSS-Repos, die nicht im Trainingsset stecken, weil sie nie real gebaut wurden ([13:18](https://www.youtube.com/watch?v=Ib5GBkD555M&t=798s))
- Frontier Code von Cognition arbeitet mit Multi-PR-Aufgaben, bestraft Tests, die auf dem Pre-Patch-Code nicht fehlschlagen, und lässt ein Judge-Modell die Code-Qualitätsregeln prüfen ([13:18](https://www.youtube.com/watch?v=Ib5GBkD555M&t=798s))
- Modelle, die Qualität beurteilen, kommen laut Sprecher nur begrenzt weit: wüsste das Modell, wie guter Code aussieht, hätte es ihn gleich geschrieben ([13:18](https://www.youtube.com/watch?v=Ib5GBkD555M&t=798s))
- Review-Agenten und mehr Token heben den Boden, bleiben aber durch das begrenzt, was im RL beigebracht werden kann ([13:18](https://www.youtube.com/watch?v=Ib5GBkD555M&t=798s))
- Vorerst bleibt uns nichts anderes übrig, als den Code zu lesen — schnell arbeiten geht trotzdem ([13:18](https://www.youtube.com/watch?v=Ib5GBkD555M&t=798s))
- Product Review und Architektur-Dokumente lohnen sich nicht für Kleinkram, dort geht es direkt an den Agenten ([14:58](https://www.youtube.com/watch?v=Ib5GBkD555M&t=898s))
- Program Design ist im agentischen Arbeiten stark unterbewertet; viele nehmen an, das Modell könne nach der Architektur einfach loslegen ([14:58](https://www.youtube.com/watch?v=Ib5GBkD555M&t=898s))
- Dylan Mulroy von Cloudflare nutzt Call Graphs als Teil seines Planungsprozesses — der Sprecher hält das für genau richtig ([14:58](https://www.youtube.com/watch?v=Ib5GBkD555M&t=898s))
- 30 Minuten Vorab-Planung und Abstimmung sparen Stunden im Review ([14:58](https://www.youtube.com/watch?v=Ib5GBkD555M&t=898s))
- Wer in PRs ertrinkt, hat nicht zu viele PRs, sondern zu viele schlechte PRs — ein guter PR ist eine Freude zu reviewen ([17:16](https://www.youtube.com/watch?v=Ib5GBkD555M&t=1036s))
- Schon 20 Prozent Nacharbeit an einem PR sind eine emotionale und intellektuelle Last für Reviewer und Einreicher ([17:16](https://www.youtube.com/watch?v=Ib5GBkD555M&t=1036s))
- Mit modellgestützter Planung wird die Abstimmung kürzer, das Review schneller und das Coding schneller — man liest trotzdem alles und behält die Verantwortung für den Code ([17:16](https://www.youtube.com/watch?v=Ib5GBkD555M&t=1036s))
- Human Layer ist eine KI-IDE und Kollaborationsplattform, eine Art Figma für Claude-Code- und Codex-Arbeitsweise, kostenlos für kleine Teams ([17:16](https://www.youtube.com/watch?v=Ib5GBkD555M&t=1036s))

## Demos / Schritte

1. Coding-Agent-RL in Kurzform: dem Modell ein Problem geben und viele Lösungsversuche (Traces) erzeugen
2. Alle Traces auf Korrektheit bewerten — sind die Tests durchgelaufen
3. Gewichte anpassen: schlechtes Verhalten unwahrscheinlicher, gutes wahrscheinlicher machen
4. Konkretes Beispiel Fastlane (Ruby): fehlende nil-Prüfung führt zu einem Stack Trace
5. Base Commit vor der historischen menschlichen Lösung auschecken; Test-Patch und Golden Patch bleiben vor dem Modell verborgen
6. Agent löst das Problem, sein Patch wird gespeichert
7. Alle Änderungen des Modells an Testdateien werden zurückgenommen
8. Golden Test Patch anwenden, alte und neue Tests laufen lassen — Reward nur, wenn beide bestehen

Planungsablauf „Licht wieder an":

1. Product Review: welches Problem wird gelöst, welches Verhalten ist gewünscht, ggf. Mock-ups ansehen
2. Systemarchitektur: Komponenten-Verträge, Datenmodelle, Randbedingungen als Dokument
3. Program Design: Typen, Methodensignaturen, Programm-Aufbau, Call Stacks
4. Vertical Slices: Reihenfolge der Umsetzung, Repo-übergreifende Abstimmung, Prüfpunkte je Phase
5. Erst dann bauen — und jede Zeile Code lesen

## Genannte Tools

- Claude Code — CLI-Coding-Agent, erstes Modell, das gegen die eigene Auslieferungs-Harness trainiert wurde
- Codex — OpenAIs Coding-Agent; ein früherer MTS des Launch-Teams wird zitiert
- Aider — CLI-Coding-Agent vor Claude Code mit denselben Werkzeugen
- Codebuff — weiterer CLI-Coding-Agent derselben Kategorie
- Human Layer — KI-IDE und Kollaborationsplattform, Bausteine für die eigene Software Factory
- Linear, Jira, Beads — Tracker als Zustandsmaschine für offene Arbeit
- Faros AI — Anbieter des Reports zur gefallenen PR-Review-Qualität
- SWE-bench Multilingual — Benchmark mit kurzen Aufgaben aus Open-Source-Repos und binärem Reward
- Sweep Marathon (Abundant AI) — Benchmark mit sehr langen Aufgaben und differenzierten Reward-Kanälen
- Deep Sweep (Data Curve) — Benchmark mit großen Aufgaben auf Repos außerhalb des Trainingssets
- Frontier Code (Cognition) — Multi-PR-Benchmark mit Judge-Modell für Code-Qualitätsregeln

## Verwandt

- [[How to Kill the Code Review — Ankit Jain, Aviator]] — Gegenposition aus derselben Konferenzreihe: Zeile-für-Zeile-Review ablösen statt wieder einführen
- [[How to build your own AI Code Review Agent from scratch!]] — praktischer Bau eines Review-Agenten, also genau die Schicht, die der Sprecher als „hebt den Boden, löst es nicht" einordnet
- [[OpenSpec NEW Toolkit Ends Vibe Coding! 100x Better Than Vibe Coding (Full Tutorial)]] — Werkzeug für die Spec-vor-Code-Reihenfolge, die der Vortrag als Planungsschritt fordert
- [LLM-Benchmark-Kontamination](obsidian://open?vault=knowledge-base&file=llm-benchmark-kontamination) — warum Repos aus dem Trainingsset die Benchmark-Aussage untergraben, das Argument hinter Deep Sweep
- [community-fr-autonomer-frontend-workflow](obsidian://open?vault=knowledge-base&file=community-fr-autonomer-frontend-workflow) — eigener Workflow mit Vorab-Planung, Etappen und Abnahme statt Lights-off
