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