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
### [0:00](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=0s) — The five layer trust model, and what it got wrong

Okay. Hello. Hey everyone. Thanks for joining in. Today we will be talking about how to kill the code reviews. Everyone's favorite topic. I'm Ankit, co-founder of Aviator. At Aviator, we are building an AI code verification platform. So we'll bring in some of the ideas and concepts that we talked about, that we built into our product. But first, let's dive into a little bit. So a few months ago, I wrote a post on LinkedIn about how to kill code review, creating a framework, a five-layer trust model.

So this model was focused around how do we actually layer by layer build trust into the code that can then be merged without needing line-by-line review. And I got some things right, and I got some things wrong. So this talk will be about just really diving a bit more into it. I'm not going to talk about specific layers, but we will talk about some of the concepts that emerged from this session.

So let's just talk about the problem. We are looking today at the volume of code increasing every day, and we are struggling to keep up. So when we think about like how long will it take us to actually stop reading code line by line? And the reality is we've already stopped reviewing it.

### [1:17](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=77s) — We already stopped reviewing, and AI reviews nobody reads

There is 861% code churn. That means we are producing more code. The incidents-to-PR ratio is increasing. That means even if you're doing reviews today, they're not effective. So the median time of review is increasing. We have just moved the bottleneck from the coding — now coding is solved — to now reviewing, where everything just gets stuck there. You're spending 4x the time that you were spending before just waiting for the reviews.

And today, over 30% of changes are actually getting merged without a review at all.

So let's just think about it a little bit. Think about AI reviews. Everyone is probably using some form of AI reviews today. When AI writes the code and AI reviews the code, why are we doing it in a UI? Right? Like we open GitHub, there's maybe two or three AI coding agents doing the reviews. The review goes back to the user or the agent and it gets resolved, and you're doing back and forth with the agent.

Where is the human here in the loop? You're eventually just looking at, okay, if AI has reviewed it, most of the things probably found it, let's just do a skimming of it and merge it. So when AI reviews and nobody reads, we have configured the wrong thing.

### [3:05](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=185s) — What code review was actually for

So let's just take a step back. Code reviews are not very old. They are maybe 15 to 20 years old. In 2006 Google launched Mondrian internally and made formal code review a thing. Windows back in the day — the first versions — was actually built without reviews.

But if we look carefully, code review is not just about code reviews. Obviously we are looking at catching bugs, understanding conventions, identifying security issues. But code review is also about alignment. And this was one piece missing from my five-layer model that I talked about a few months ago.

So a big part of code reviews is knowledge sharing, mentorship, architectural feedback, onboarding, being able to collaborate. Again, if you're doing solo coding, working as a solo project, this is not a talk for you. If you are working in teams, which I believe most of you are, collaborating in teams, you're not likely using completely dark factories or orchestrators where nobody looks at the code. You're actually collaborating in teams, you need to do knowledge sharing — which is the alignment part. And that is the most important aspect of review.

So for semantic accuracy, we can build better tooling, but alignment must survive.

### [4:21](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=261s) — Spec driven development is waterfall again

So let's dive into alignment. What does it mean? In today's world, can we actually think of a better model than aligning just based on reading line-by-line code?

Most folks have probably heard about spec-driven development by now. Spec-driven development is: we write a spec, it covers all the details, we pass it to an agent, it generates code, and then we verify.

So what's wrong here? If you look back in 1970, this is what the waterfall model was. You have requirements, specification, you implement, and then you verify. But there's no feedback loop. The spec is written before we identified everything else.

That's why today everyone still wants to use coding sessions — whether it's Claude Code, Codex, Cursor, whatever you're using — you want to interact with the agents. And the reason you're interacting with agents is because there were certain things which were not clear in the spec, and we still need to capture that.

And second, as you implement, you identify more issues, and you never go back and update the spec, because if you're doing spec-driven development, it's already done. Once the spec is done, you expect the code will come deterministically. But guess what? LLM is not deterministic. It's going to make decisions itself. So spec-driven development is a great methodology, but it falls short in day-to-day software development.

### [5:53](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=353s) — Intent lives in the prompts, which we throw away

But there are some interesting aspects of this which we should carry forward. The most important part is the intent. Intent doesn't only live in the spec. Intent lives in your Jira ticket. That's the goal — where you express what we want to do. It lives in your PRDs — details, like a plan.

But most importantly, it lives in your prompts today. This is where the real decisions are being made. You start with, okay, this is a Jira ticket I'm going to look at, but you're going back and forth with the agent, and this is where all the user decisions are being made.

But what we do today is we create a change, we create a pull request, and then we throw away the prompts. And this is one of the things that we need to change.

### [6:42](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=402s) — The AI slop registry

Let us first talk also about semantic accuracy because you're saying, "Hey Ankit, okay, I understand the alignment part, but there are still bugs in the code. Who's going to look at that?" LLMs are also not great at this, and we already talked about how AI reviewer agents may not always be perfect.

So this is where I introduce you to the concept of AI slop registry. If you're reviewing code today manually, and I expect everyone should be doing some degree of this — we are essentially possibly identifying the same issues over and over again. Can we actually capture these concepts and codify them so that we don't have to always create those review feedback one by one? You actually also have all of those things automatically identified. The beauty of this is if you do it a few times, you now build a system which actually learns over time. Think of this as doing more training on top of the standard LLM that you have extracted, built on top of. So AI slop registries now can create better results because it's learning from the review experience that you as humans are providing.

Every recurring comment is now a guardrail that you don't have to review again.

### [7:58](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=478s) — Session to acceptance criteria to test plan

Okay, so let's try to put both of these — alignment and the semantic accuracy — together. It is two halves of the same problem. We are trying to understand the core mechanics of review — how do we actually break it down into alignment and semantic accuracy, and bring them together into a single loop.

So first, you could take your session and capture the user responses, and that essentially forms your acceptance criteria. The acceptance criteria then tied with your AI slop registry that you are constantly maintaining finally creates a test plan. And this is the test plan which then gets verified. This is part of the system that we are building — the verification system where it spins up a preview, takes your test plan, and makes sure it actually works end-to-end. Even if the code looks right, does it actually work?

So this verification part has become interesting. And now the kicker is: this is now your review surface. You're not reviewing code line by line, but rather looking at the evidence of what was the intent, did the user actually implement the capability defined in the intent, and did the behavior actually meet the requirements defined in the acceptance criteria.

So you're still having the architectural decisions, still having these arguments, but the review surface changes.

So just walking through how we have built our system: the session becomes the criteria — all these decisions you're making here with the agent, providing feedback. Even for a simple task, many times you're going back and forth. The agent will stop to ask questions. These are the decisions that we need to capture. This is the intent. This is what makes your review, your collaboration more valuable. This is how you teach your junior engineers how to improve over time. These are the decisions which make a software engineer valuable today.

We convert those into acceptance criteria. This is where you can also leverage an LLM to do so. You capture these user decisions and make sure you can create a test plan based on this. Test plan creation is always painful, which is where I would recommend people use an LLM for this purpose. And finally, the criteria plus invariants is what makes the test plan.

We build the verification systems to actually capture the test plan, run your previews, and be able to test based on this test plan. So even if you're building a new feature, you don't have to maintain tests at all. This is creating tests in real time, and this is where you can leverage the power of an LLM, because test plan maintenance and creation can be really painful. But the value of the human in the loop here is the governance and the review part — reviewing the test plan, not the code.

Right? It's been over 20 years since we came up with test-driven development. This in some ways is closer to behavior-driven development, where the test plan is now something you can share with your product managers, your designers. Everyone can participate because these things are now in English.

At the same time, we have deterministic verification, which verifies whether the particular test criteria has been met or not.

### [11:51](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=711s) — Deterministic where you can, and reviewing intent not the diff

Let's move on. So this is where I'd say the system is not supposed to be perfect. It's deterministic where it can be, but LLM where you must. Not everything can be deterministic. Not every system can be built 100% on deterministic systems. This is where you use LLM as a fallback.

Let me give an example. If you're making a change in your web application, it creates a test plan of what the behavior changes. Say you introduce a new payment form. The verification here is: does the payment system change? An AI agent can go and browse through your application to fill out a form and capture screenshots as evidence. And then take those screenshots as well as your database snapshots to identify whether the criteria was met. So the screenshot testing or sandboxing can then still be done by agents. But at the same time, you're creating more solid evidence, which now a reviewer can look at and build more confidence that this actually works.

So now reviewers are reviewing the intent, not the diff. You're reviewing the intent decisions — what we said to build out, what we tried and rejected — and capture all of these things from the sessions. Remember, capturing it from the sessions is key. If we try to build it from the code, you'll end up in the same situation we were talking about — I think Dex was talking about yesterday — which is if your code is built by the same agent that is actually building a test plan, it's not going to build a test plan that will actually catch issues. So that's why it's important to use the session information to build out a test plan.

You can discuss architectural decisions — how you're creating the data models, how these services interact with each other. So you've moved one level above. You're essentially, instead of reviewing line by line, having discussions on architecture, which are very critical for any kind of collaboration. And then you look at the evidence, everything that was collected from the verification.

### [14:12](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=852s) — Homework: mine your last 1,000 review comments

So here's a homework for everyone. Go home and mine your last 1,000 review comments and build out an AI slop registry for the things which are repeatable. A vast majority of the comments that you're providing in your code review are something that we repeat over and over again. This compounds with every merged PR. Every time you capture something as a registry entry, you don't have to capture that comment again.

And this is where you can codify some of the best practices of doing code, maintain semantic accuracy, and at the same time not lose the collaboration part of the review.

It does follow a J curve. So pain is real. You will have to spend some time to actually make it pay off, because initially creating a registry can take some time. And this is where I would recommend you folks come and try out our product. So code review is not just about code review. It is about really getting the alignment. And where we can build better tools is creating the semantic accuracy and defining your AI slop registry. So if you remember one thing from today: code review is not just about code review, it is about getting the alignment.

And yes, we are piloting our new product called Verify. Please join and be our early design partners. We are working with a few companies to pilot out a new verification system. This combines both the alignment side of things as well as building tools and capabilities for detecting semantic accuracy using the AI slop registry.

Thank you everyone. Thanks for joining.