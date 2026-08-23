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

---

# Fassung A

## Worum es geht

Ankit, Mitgründer von Aviator, spricht auf einer Konferenz darüber, wie klassische Zeile-für-Zeile-Code-Reviews abgelöst werden können. Sein Vortrag korrigiert ein früheres „Five-Layer-Trust-Model" und stellt Alignment und semantische Genauigkeit als die zwei Hälften des Review-Problems dar.

## Besprochene Konzepte

- Five-Layer-Trust-Model — Schichtweiser Vertrauensaufbau, damit Code ohne Zeile-für-Zeile-Review gemergt werden kann.
- Alignment als Review-Zweck — Review ist auch Wissenstransfer, Mentoring, Architektur-Feedback, Onboarding und Zusammenarbeit.
- Semantische Genauigkeit — die Bug-/Konventions-/Sicherheits-Hälfte des Reviews, die durch bessere Werkzeuge automatisierbar ist.
- Spec-Driven Development — Spec schreiben, Agent generiert Code, danach verifizieren.
- Wasserfall-Analogie — Requirements → Spec → Implementierung → Verifikation ohne Rückkopplung, wie 1970.
- Intent — die eigentliche Absicht, verteilt über Jira-Ticket, PRD und vor allem die Prompts der Coding-Session.
- AI Slop Registry — kodifizierte, wiederkehrende Review-Kommentare als automatisch geprüfte Guardrails.
- Session → Akzeptanzkriterien → Testplan — die Entscheidungen aus der Agenten-Session werden zu Kriterien, Kriterien plus Invarianten zum Testplan.
- Verifikations-System — spinnt eine Preview hoch, fährt den Testplan und liefert Belege statt Diff.
- Review Surface — statt des Diffs werden Intent, Akzeptanzkriterien und Verifikationsbelege geprüft.
- „Deterministic where you can, LLM where you must" — deterministische Prüfung als Standard, LLM nur als Rückfallebene.
- Behavior-Driven Development — Testpläne in natürlicher Sprache, an denen auch Produkt und Design teilnehmen können.
- J-Curve — Aufbau der Registry kostet erst Zeit, zahlt sich erst später aus.

## Behauptungen

- Code Churn liegt bei 861 %; es wird immer mehr Code produziert ([1:17](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=77s))
- Das Verhältnis von Incidents zu PRs steigt — heutige Reviews sind also nicht wirksam ([1:17](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=77s))
- Die mediane Review-Dauer steigt; Entwickler warten 4x so lange wie früher ([1:17](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=77s))
- Der Engpass hat sich vom Coding zum Review verschoben; Coding gilt als gelöst ([1:17](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=77s))
- Über 30 % der Änderungen werden heute komplett ohne Review gemergt ([1:17](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=77s))
- Wir haben faktisch bereits aufgehört, Code zu lesen ([0:00](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=0s))
- Wenn AI den Code schreibt und AI ihn reviewt, ist ein UI-basierter Review-Prozess auf GitHub die falsche Konfiguration ([1:17](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=77s))
- Menschen überfliegen AI-Review-Ergebnisse nur noch und mergen ([1:17](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=77s))
- Code Reviews sind erst 15 bis 20 Jahre alt ([3:05](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=185s))
- Google startete 2006 intern Mondrian und machte formales Code Review zur Norm ([3:05](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=185s))
- Die ersten Windows-Versionen wurden ohne Reviews gebaut ([3:05](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=185s))
- Alignment war das fehlende Stück im Five-Layer-Model des Sprechers ([3:05](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=185s))
- Für semantische Genauigkeit lassen sich bessere Werkzeuge bauen, Alignment muss überleben ([3:05](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=185s))
- Spec-Driven Development entspricht dem Wasserfallmodell von 1970 und hat keinen Rückkopplungs-Weg ([4:21](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=261s))
- Entwickler nutzen weiterhin Coding-Sessions, weil die Spec Lücken lässt ([4:21](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=261s))
- Specs werden nach der Implementierung nicht mehr aktualisiert ([4:21](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=261s))
- LLMs sind nicht deterministisch, deshalb folgt aus einer fertigen Spec kein bestimmter Code ([4:21](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=261s))
- Spec-Driven Development ist eine gute Methodik, greift im Alltag aber zu kurz ([4:21](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=261s))
- Intent lebt heute vor allem in den Prompts — dort fallen die echten Entscheidungen ([5:53](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=353s))
- Prompts werden beim Anlegen des Pull Requests weggeworfen; das muss sich ändern ([5:53](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=353s))
- LLMs sind bei semantischer Genauigkeit ebenfalls nicht gut; AI-Reviewer sind nicht immer korrekt ([6:42](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=402s))
- Beim manuellen Review werden dieselben Punkte immer wieder gefunden ([6:42](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=402s))
- Eine AI Slop Registry lernt über Zeit aus den Review-Rückmeldungen der Menschen ([6:42](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=402s))
- Jeder wiederkehrende Kommentar wird zu einem Guardrail, den man nicht erneut reviewen muss ([6:42](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=402s))
- Die Erstellung von Testplänen ist schmerzhaft — dafür empfiehlt der Sprecher ein LLM ([7:58](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=478s))
- Bei neuen Features müssen keine Tests gepflegt werden, weil sie in Echtzeit entstehen ([7:58](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=478s))
- Der Wert des Menschen liegt in Governance und dem Review des Testplans, nicht des Codes ([7:58](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=478s))
- Test-Driven Development ist über 20 Jahre alt; der Ansatz liegt näher an Behavior-Driven Development ([7:58](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=478s))
- Testpläne in Englisch können mit Produktmanagern und Designern geteilt werden ([7:58](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=478s))
- Das System muss nicht perfekt sein; nicht alles lässt sich deterministisch bauen ([11:51](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=711s))
- Beispiel neues Zahlungsformular: ein Agent bedient die App, macht Screenshots und prüft zusammen mit DB-Snapshots, ob das Kriterium erfüllt ist ([11:51](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=711s))
- Belege geben dem Reviewer mehr Zuversicht, dass es tatsächlich funktioniert ([11:51](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=711s))
- Reviewer prüfen den Intent, nicht den Diff — inklusive dessen, was verworfen wurde ([11:51](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=711s))
- Der Testplan muss aus der Session stammen, nicht aus dem Code ([11:51](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=711s))
- Der Sprecher verweist auf Dex vom Vortag: baut derselbe Agent Code und Testplan, findet der Testplan keine Fehler ([11:51](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=711s))
- Die Diskussion verschiebt sich eine Ebene nach oben auf Architektur und Datenmodelle ([11:51](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=711s))
- Hausaufgabe: die letzten 1.000 Review-Kommentare auswerten und daraus eine AI Slop Registry bauen ([14:12](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=852s))
- Der Effekt verstärkt sich mit jedem gemergten PR ([14:12](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=852s))
- Der Aufbau folgt einer J-Kurve; der Schmerz am Anfang ist real ([14:12](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=852s))
- Kernaussage: Code Review geht nicht um Code Review, sondern um Alignment ([14:12](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=852s))
- Aviator pilotiert ein neues Produkt namens Verify und sucht Design-Partner ([14:12](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=852s))

## Demos / Schritte

1. Die Coding-Session mit dem Agenten führen und die Nutzer-Entscheidungen aus dem Hin und Her festhalten.
2. Diese Entscheidungen — per LLM — in Akzeptanzkriterien überführen.
3. Akzeptanzkriterien mit der gepflegten AI Slop Registry und den Invarianten zum Testplan verbinden.
4. Testplan vom Menschen reviewen lassen (Governance-Punkt statt Code-Review).
5. Verifikations-System spinnt eine Preview hoch und fährt den Testplan durch.
6. Wo möglich deterministisch prüfen, sonst per Agent: Formular ausfüllen, Screenshots und DB-Snapshots als Belege sammeln.
7. Reviewer prüft Intent, Akzeptanzkriterien und die gesammelten Belege statt des Diffs.

## Genannte Tools

- [claude-code-overview](obsidian://open?vault=knowledge-base&file=claude-code-overview) — als Beispiel für eine Coding-Session mit Agent-Interaktion genannt.
- [[Cursor]] — ebenfalls als Beispiel für eine genutzte Coding-Umgebung genannt.
- Codex — als weiteres Beispiel für Coding-Sessions genannt.
- GitHub — Oberfläche, in der die AI-Reviews heute stattfinden.
- Jira — Ort des Tickets, in dem das Ziel formuliert wird.
- Google Mondrian — 2006 intern gestartetes Werkzeug, das formales Code Review etablierte.
- Aviator Verify — das pilotierte Verifikations-Produkt des Sprechers.

## Verwandt

- [[How to build your own AI Code Review Agent from scratch!]] — anderes Video zum Bau eines AI-Review-Agenten statt Zeile-für-Zeile-Review.
- [process-ai-review-comments-skill](obsidian://open?vault=knowledge-base&file=process-ai-review-comments-skill) — Verarbeitung wiederkehrender Review-Kommentare, das Gegenstück zur AI Slop Registry.
- [goal-verification-workflow](obsidian://open?vault=knowledge-base&file=goal-verification-workflow) — unabhängige Abnahme gegen eine vorab geschriebene Akzeptanzmatrix statt gegen den Diff.
- [gefuehrte-code-durchsicht-agenten-features](obsidian://open?vault=knowledge-base&file=gefuehrte-code-durchsicht-agenten-features) — geführte Durchsicht als Review-Oberfläche jenseits des reinen Diffs.
- [ai-code-quality-research](obsidian://open?vault=knowledge-base&file=ai-code-quality-research) — Befundlage zur Qualität KI-generierten Codes, Hintergrund zu Churn und Incident-Zahlen.
- [ai-browser-assisted-development-testing](obsidian://open?vault=knowledge-base&file=ai-browser-assisted-development-testing) — Agent bedient den Browser und sammelt Belege, wie im Zahlungsformular-Beispiel.

---

# Fassung B

## Worum es geht
Ankit, Mitgründer von Aviator, erklärt, warum Zeile-für-Zeile-Code-Reviews bei steigendem AI-Codevolumen nicht mehr tragen und was an seinem älteren Five-Layer-Trust-Model fehlte. Statt den Diff zu lesen, sollen Teams Alignment (Intent aus der Agent-Session) und semantische Korrektheit (AI Slop Registry plus Verifikation gegen einen Testplan) in einer Schleife halten.
## Besprochene Konzepte
- Five-Layer-Trust-Model — Trust schichtweise in den Code legen, damit ohne Zeile-für-Zeile-Review gemerged werden kann; der Sprecher korrigiert das Modell
- Alignment vs. semantic accuracy — Review hat zwei Hälften: Team-Ausrichtung (Wissen, Mentoring, Architektur) und semantische Korrektheit
- Spec-driven development als Wasserfall — Spec vorab, Agent erzeugt Code, Verify; ohne Feedback-Schleife, Spec wird nicht nachgezogen
- Intent in Prompts — die echten Entscheidungen fallen im Dialog mit dem Agenten, nicht nur in Jira, PRD oder Spec
- AI Slop Registry — wiederkehrende Review-Befunde kodifizieren, bis jeder wiederholte Kommentar ein Guardrail ist
- Session → Acceptance Criteria → Testplan — User-Antworten in der Session werden Kriterien; Kriterien plus Invarianten ergeben den Testplan
- Review-Oberfläche wechselt — Intent, Capability und Evidence statt Diff
- Deterministisch wo möglich, LLM wo nötig — LLM als Fallback, nicht als einziges Orakel
- Dark Factories / Orchestrators — vollautomatische Fabriken, in denen niemand auf den Code schaut; der Sprecher hält das für Teamarbeit nicht für den Normalfall
- Behavior-driven development — Testplan auf Englisch, teilbar mit PM und Design; näher an BDD als an klassischem TDD
## Behauptungen
- Aviator baut eine AI-Code-Verifikationsplattform. (0:00)
- Der Sprecher hat vor wenigen Monaten auf LinkedIn ein Five-Layer-Trust-Model vorgestellt; einiges daran war richtig, einiges falsch. (0:00)
- Es gibt 861% Code-Churn, es wird mehr Code produziert. (1:17)
- Das Verhältnis Incidents zu PRs steigt; Reviews sind deshalb nicht wirksam. (1:17)
- Die mediane Review-Zeit steigt. (1:17)
- Der Engpass hat sich vom Coding zum Review verschoben; Coding sei gelöst. (1:17)
- Teams verbringen 4× so viel Zeit wie zuvor nur mit Warten auf Reviews. (1:17)
- Über 30% der Changes werden ohne Review gemerged. (1:17)
- Wenn AI den Code schreibt und AI ihn reviewed und niemand die Reviews liest, ist das falsch konfiguriert. (1:17)
- Formelle Code-Reviews gibt es etwa 15–20 Jahre; 2006 hat Google intern Mondrian eingeführt. (3:05)
- Frühe Windows-Versionen entstanden ohne Reviews. (3:05)
- Review fängt Bugs, Conventions und Security-Probleme — ein großer Teil ist aber Alignment. (3:05)
- Alignment (Knowledge Sharing, Mentorship, Architektur-Feedback, Onboarding, Zusammenarbeit) fehlte im Five-Layer-Model. (3:05)
- Der Vortrag richtet sich an Teams, nicht an Solo-Projekte. (3:05)
- Für semantische Korrektheit lassen sich bessere Tools bauen; Alignment muss überleben. (3:05)
- Spec-driven development ist Wasserfall von 1970: Requirements, Spec, Implement, Verify, ohne Feedback-Schleife. (4:21)
- Teams interagieren deshalb weiter mit Agenten in Sessions, weil die Spec Unklares nicht erfasst. (4:21)
- Während der Implementierung tauchen weitere Issues auf, die Spec wird danach nicht aktualisiert. (4:21)
- Ein LLM ist nicht deterministisch und trifft eigene Entscheidungen. (4:21)
- Spec-driven development ist eine gute Methodik, reicht im Alltag der Softwareentwicklung aber nicht. (4:21)
- Intent lebt im Jira-Ticket, in PRDs und vor allem in den Prompts; dort fallen die User-Entscheidungen. (5:53)
- Nach Pull Request werden die Prompts weggeworfen; das muss sich ändern. (5:53)
- LLMs und AI-Reviewer-Agenten sind bei Bugs nicht zuverlässig. (6:42)
- Dieselben Review-Issues tauchen immer wieder auf; sie lassen sich in einer AI Slop Registry kodifizieren. (6:42)
- Die Registry lernt aus menschlichem Review und liefert mit der Zeit bessere Ergebnisse. (6:42)
- Jeder wiederkehrende Kommentar wird zum Guardrail, den man nicht erneut reviewen muss. (6:42)
- Alignment und semantic accuracy sind zwei Hälften desselben Problems. (7:58)
- Session-Antworten werden zu Acceptance Criteria; zusammen mit der Slop Registry entsteht der Testplan. (7:58)
- Das Verifikationssystem fährt eine Preview hoch und prüft den Testplan end-to-end. (7:58)
- Die neue Review-Oberfläche ist Evidence: Intent, umgesetzte Capability, Verhalten gegen die Acceptance Criteria — nicht Zeile für Zeile. (7:58)
- Die Entscheidungen im Dialog mit dem Agenten machen den Software-Ingenieur wertvoll und lehren Junioren. (7:58)
- Testpläne soll man per LLM erzeugen, weil Erstellung und Pflege schmerzhaft sind. (7:58)
- Criteria plus Invarianten ergeben den Testplan. (7:58)
- Tests entstehen in Echtzeit; man muss laut Sprecher keine Tests pflegen. (7:58)
- Der Mensch im Loop macht Governance und reviewed den Testplan, nicht den Code. (7:58)
- Das liegt näher an Behavior-driven Development als an Test-driven Development; der Testplan ist Englisch und teilbar mit PM und Design. (7:58)
- Daneben gibt es deterministische Verifikation, ob ein Kriterium erfüllt ist. (7:58)
- Das System muss nicht perfekt sein: deterministisch wo es geht, LLM wo es muss. (11:51)
- Beispiel Payment-Formular: ein Agent browsed die App, füllt das Formular, liefert Screenshots und Datenbank-Snapshots als Evidence. (11:51)
- Reviewer reviewen Intent und abgelehnte Alternativen, nicht den Diff. (11:51)
- Den Testplan aus der Session bauen, nicht aus dem Code; sonst fängt derselbe Agent die eigenen Fehler nicht. (11:51)
- Architektur-Diskussionen (Datenmodelle, Service-Schnittstellen) rücken eine Ebene über den Zeilen-Review. (11:51)
- Hausaufgabe: die letzten 1000 Review-Kommentare minen und daraus eine AI Slop Registry für Wiederholbares bauen. (14:12)
- Das folgt einer J-Kurve: der Anfangsaufwand ist real, der Nutzen kommt später. (14:12)
- Aviator pilotiert das Produkt Verify und sucht Early Design Partner. (14:12)
- Eine Sache merken: Code Review ist Alignment. (14:12)
## Demos / Schritte
1. User-Entscheidungen in der Agent-Session festhalten (Rückfragen, Feedback, abgelehnte Alternativen).
2. Daraus Acceptance Criteria erzeugen, auch per LLM.
3. Kriterien plus Invarianten aus der AI Slop Registry zu einem Testplan zusammenziehen (LLM empfohlen).
4. Preview hochfahren, Testplan ausführen, inklusive End-to-End.
5. Evidence sammeln (Screenshots, Datenbank-Snapshots) und dagegen reviewen: Intent und Verhalten, nicht den Diff.
## Genannte Tools
- Aviator — Firma des Sprechers, baut eine AI-Code-Verifikationsplattform
- GitHub — UI, in der AI-Review-Agenten Kommentare hinterlassen
- [claude-code-overview](obsidian://open?vault=knowledge-base&file=claude-code-overview) — interaktive Coding-Session mit dem Agenten
- Codex — interaktive Coding-Session mit dem Agenten
- [[Cursor]] — interaktive Coding-Session mit dem Agenten
- Jira — Ticket als Zielbeschreibung, ein Ort für Intent
- Verify — Aviator-Pilotprodukt: Alignment plus semantische Prüfung über die AI Slop Registry
- Mondrian — internes Google-Review-System ab 2006
## Verwandt
- [goal-verification-workflow](obsidian://open?vault=knowledge-base&file=goal-verification-workflow) — Abnahme gegen eine vorher geschriebene Akzeptanzmatrix, nicht gegen den gebauten Diff
- [gefuehrte-code-durchsicht-agenten-features](obsidian://open?vault=knowledge-base&file=gefuehrte-code-durchsicht-agenten-features) — Review-Oberfläche für agenten-gebauten Code, den ein Mensch verstehen muss
- [process-ai-review-comments-skill](obsidian://open?vault=knowledge-base&file=process-ai-review-comments-skill) — wiederkehrende KI-Review-Kommentare abarbeiten; nah an der AI Slop Registry
- [spec-etappen-workflow](obsidian://open?vault=knowledge-base&file=spec-etappen-workflow) — Spec in Etappen schneiden statt einmal Wasserfall-Spec an den Agenten
- [[Spec Kit Github's NEW tool That FINALLY Fixes AI Coding]] — Spec-Driven-Development-Toolchain, die der Sprecher als Wasserfall kritisiert
- [[How to Build the Most Powerful System for AI Coding (Full Breakdown)]] — Dark Factory, die der Sprecher für Teamarbeit ablehnt
- [[How to build your own AI Code Review Agent from scratch!]] — AI-Review-Agenten, die der Sprecher als ungelesen kritisiert
- [vorlage-last-autonomer-laeufe](obsidian://open?vault=knowledge-base&file=vorlage-last-autonomer-laeufe) — Dark-Factory-Spur und autonome Läufe im KIMS-Bestand
- [ai-browser-assisted-development-testing](obsidian://open?vault=knowledge-base&file=ai-browser-assisted-development-testing) — Agent-Browser-Verifikation mit Screenshots als Evidence
- [community-fr-review-skill](obsidian://open?vault=knowledge-base&file=community-fr-review-skill) — Review-Skill im community-fr-Workflow
- [[Coding mit AI]] — Hub für KI-Coding-Workflows im Shared-Vault
- [autonome-entwicklung-mit-superpowers](obsidian://open?vault=knowledge-base&file=autonome-entwicklung-mit-superpowers) — Review-Disziplin bei Subagent-Driven Development
