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

### [00:00](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=0s) — Intro: Meet the Lazy Senior Dev

"You know him. Long ponytail, oval glasses, has been at the company longer than the version control. You show him 50 lines, he looks at them, says nothing, and replaces them with one."

>> That is the epic description of this new library called Ponytail, which I guess is kind of relatable. We all know that one 10x developer who matches that description perfectly. But Ponytail is actually a really cool tool. It makes your AI coding agent think like the laziest senior dev in the room, and that's actually a compliment. So in this video, we'll take a look at Ponytail, see how it works, and run some fun demos to find out if this guy is actually the real deal. It's going to be a lot of fun, so let's dive into it.

### [00:48](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=48s) — What is Ponytail?

So Ponytail's mission is simple. Keep everything super concise, eliminate the bloat AI agents usually produce, and try to come up with the leanest solution to a problem it can possibly find.

### [01:08](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=68s) — How Caveman Compares

It's kind of similar to Caveman, which was the library that made AI coding agents talk less, therefore spending less tokens, which James also did a great video on over here.

### [01:15](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=75s) — The YAGNI Principle Explained

So the main idea behind it is embracing the YAGNI principle, which stands for "you ain't gonna need it." It's actually a software engineering idea from the '90s, and the core idea of it is don't build something until you actually need it. Don't add an abstraction layer, don't install a library, don't write the class. If the problem can be solved without it, then just solve it without it.

### [01:42](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=102s) — The Decision Ladder

And Ponytail bakes that directly into your agent by giving it a decision ladder it has to climb before writing anything. Does this need to exist at all? Can a standard library handle it? Is there a native platform feature for this? Is there already a dependency installed that does this? Can it be a one-liner? Only if every single one of those answers is a no, then it actually writes new code. And even then, it just keeps it to the minimum required to get it working.

### [02:05](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=125s) — The Modal Dialog Example

And if we look at some of their examples, especially the modal dialog example, we get a clear picture of this methodology. A normal agent, when asked to add a modal dialog for the delete confirmation, will immediately reach for installing a Radix UI library like the React Dialog, add a dependency, a portal, an overlay, a root, a trigger, a content wrapper, just to show a box with two buttons. But Ponytail looks at this and says, "Hey, the browser already has a dialog element. It traps focus automatically. And it closes on escape, renders a backdrop with a single CSS selector, and it's supported in every major browser since 2022."

So, instead of 30 lines in an NPM package, you get eight lines and zero dependencies. And this little Ponytail comment right here tells you exactly what it skipped and why it did that. So, if one day you actually decide to upgrade it to the Radix version or something more fancy, you know where to go and where it was deferred. So, it's lazy, but it's not irresponsible. And by embracing this laziness, Ponytail claims to be able to reduce your cost by 47 to 77%.

### [03:19](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=199s) — The Benchmarks

And they actually give some benchmarks behind this claim, so let's look at them for a moment. We have three methods here: using no skill, using Caveman, and using Ponytail. And three models and five everyday tasks. Ten runs per cell, and for each of them, the median result. And crucially, they also check for correctness. A broken one-liner that scores great on lines of code will fail on correctness. So, it's not just write less stuff, it has to actually work.

### [03:55](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=235s) — The Prompt Caching Caveat

And there's also an interesting caveat worth noting. Cost reflects single-shot calls that resend the skill every time. In other words, the benchmark works by sending a fresh API call for each test, and every time it does that, it includes the full Ponytail rule set in the prompt. So, in the benchmark, Ponytail is being penalized for the cost of its own instructions on every single test. In real life, you pay for those instructions roughly once per session, and after that they are cached. That means the 47 to 77% cheaper figure is actually underselling it. In a real working session spread across many prompts, the cost advantage is even bigger because that skill injection cost gets amortized across the whole conversation.

### [04:40](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=280s) — A Legitimate Critique

That said, there is a legitimate critique worth mentioning. A recently published blog post by Colin Eberhardt points out that if you actually swap out Ponytail for three simple words, "Follow YAGNI principles," the results of that almost perfectly matched Ponytail's benchmark score. And when elaborating to seven words, "Follow YAGNI principles and one-liner solutions," it actually beat the benchmark. So, is Ponytail magic or is it just a well-packaged prompt? Well, honestly, that is a fair question. But, I would argue that packaging is the product. You get the right rules injected automatically across different agents with commands, audit tools, and a debt ledger on top. Besides, Ponytail has other cool features. "Follow YAGNI" in your system prompt doesn't give you the Ponytail audit feature or the Ponytail review feature.

### [05:37](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=337s) — Demo: Ponytail vs Default Claude Code

But, now let's test it out with a simple example. So, here I have two Claude Code instances open, and on one of them I'm going to install the Ponytail plugin for the local scope only, and the other one will be a simple default Claude Code instance with no plugins activated. I will give them both the same prompt to build a weather dashboard app that detects user location and shows current weather conditions along with some other features. And I'm going to run the same prompt on both instances with the only exception that on the Ponytail one, I'm going to also ask it to use the Ponytail skill because sometimes it doesn't automatically pick it up.

So, after a few moments, we see the Ponytail version has already finished the task in under 1 minute, while the default one is still crunching. And also, we see a very concise overview of what it built and what Ponytail opted out of doing for maximum efficiency. And as we can see here, it chose to have everything in one single HTML file. Meanwhile, on the default window, the task was finished in 2 minutes and 30 seconds, and we can already see that this version is much more bloated. We have three separate files, and this version is run using a Python server. So, while this is in no means a bad result, it's much more over-engineered than the first version.

### [06:20](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=380s) — Comparing the Results

But let's actually look at how they operate. So, first off, this is the version without Ponytail, and while the app looks great and the UI is beautiful and the API retrieves information as expected, I am quite disappointed that it didn't pick up my location automatically as I asked, and instead, it shows me London as the default first result. But now, if we hop onto the Ponytail version, here we can clearly see that upon opening it, it asks to get my current location and then outputs the weather matching that location instead. So, while the UI is maybe not as fancy and the app is maybe more bare-bones, it did follow the instructions more precisely than the default version, which is quite surprising, to be honest.

### [07:39](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=459s) — Token Usage & Cost Savings

And lastly, let's look at the usage. And here we can see that yes, indeed, the version with Ponytail ended up being 50% cheaper than the default version, and it also produced far fewer lines of code. And as we just saw, it was even better in terms of functionality than the default version. So this proves that Ponytail does indeed work as expected, and it does produce leaner code.

### [08:04](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=484s) — Demo: Caveman + Ponytail Combined

So since this test was so successful, I decided to do something even more interesting. What if I combine Caveman and Ponytail together for maximum efficiency? What will that give us? So this time I activated both plugins in a new directory and ran the same prompt again. And once again, the task was finished under a minute, and the output was fairly similar, and I had all the same functionality, so it worked as expected. But if we look at the output, it didn't differ too much from the Ponytail version, and the Caveman plus Ponytail combo ended up being even slightly more expensive than the standalone Ponytail version. So this shows that combining them doesn't really give you any big improvement. So you can stick to just using Caveman, or better yet, opt for using Ponytail, if we can believe their benchmarks that it is indeed better than Caveman.

### [08:58](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=538s) — Final Verdict

So there you have it, folks. That is Ponytail in a nutshell. I am honestly genuinely impressed by the positive output Claude was able to produce with the Ponytail skill while cutting the bloat and maintaining the quality at the same time. I guess this just goes to show that a lot of our coding solutions are probably over-engineered, and sometimes less is indeed more, if you use it the right way. So I'm definitely going to be keeping Ponytail as a plugin in my Claude Code setup, and probably use it for future projects.

But what do you think about Ponytail? Have you tried it? Will you use it? Let us know in the comment section down below. And folks, if you like these types of technical breakdowns, please let me know by smashing that like button underneath the video. And also, don't forget to subscribe to our channel. This has been Andres from Better Stack, and I will see you in the next videos.

---

# Fassung A

## Worum es geht

Vorstellung und Praxistest von **Ponytail**, einem Plugin/Skill für Claude Code, das den KI-Coding-Agenten dazu bringt, wie ein „fauler Senior-Entwickler" die schlankstmögliche Lösung zu bauen und den typischen Code-Bloat von AI-Agenten zu vermeiden.

## Besprochene Konzepte

- Ponytail — Tool/Skill, das den Agenten zur knappsten, schlanksten Lösung eines Problems zwingt und Bloat eliminiert
- YAGNI-Prinzip — „you ain't gonna need it", Software-Engineering-Idee aus den 90ern: nichts bauen, bevor man es tatsächlich braucht (keine Abstraktionsschicht, keine Library, keine Klasse ohne echten Bedarf)
- Decision Ladder — Entscheidungsleiter, die der Agent vor jedem Schreiben durchläuft (existiert es überhaupt nötig? Standard-Library? natives Plattform-Feature? schon installierte Dependency? Einzeiler möglich?); nur bei durchgängigem „Nein" schreibt er neuen Code
- Ponytail-Kommentare / Debt Ledger — Kommentar im Code hält fest, was weggelassen wurde und warum, damit ein späteres Upgrade nachvollziehbar bleibt
- Prompt Caching — Skill-Instruktionen werden real nur einmal pro Session bezahlt und danach gecacht, wodurch sich die Injection-Kosten über die Konversation amortisieren
- Audit- und Review-Features — Ponytail bietet zusätzlich Audit-Tools und ein Review-Feature über die reine Regel-Injektion hinaus

## Behauptungen

- Ponytails Mission ist, alles knapp zu halten und die schlankste mögliche Lösung zu finden ([0:48](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=48s))
- Ponytail ähnelt Caveman, das Agenten weniger reden und dadurch weniger Tokens verbrauchen ließ ([1:08](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=68s))
- YAGNI stammt als Software-Engineering-Idee aus den 90ern ([1:15](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=75s))
- Nur wenn jede Stufe der Decision Ladder mit „Nein" beantwortet wird, schreibt der Agent neuen Code — und dann nur das Minimum ([1:42](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=102s))
- Ein normaler Agent greift für einen Modal-Dialog sofort zu Radix UI mit Portal, Overlay, Root, Trigger und Content-Wrapper, nur um eine Box mit zwei Buttons zu zeigen ([2:05](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=125s))
- Das native `dialog`-Element fängt Fokus automatisch, schließt bei Escape, rendert einen Backdrop per CSS-Selektor und wird seit 2022 in jedem großen Browser unterstützt ([2:05](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=125s))
- Statt 30 Zeilen im NPM-Paket bekommt man acht Zeilen und null Dependencies ([2:05](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=125s))
- Ponytail behauptet, die Kosten um 47 bis 77 % zu senken ([2:05](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=125s))
- Der Benchmark nutzt drei Methoden (kein Skill, Caveman, Ponytail), drei Modelle, fünf Alltags-Tasks, zehn Runs pro Zelle, Median-Ergebnis, und prüft zusätzlich auf Korrektheit ([3:19](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=199s))
- Die Kostenzahl spiegelt Single-Shot-Calls, die den Skill jedes Mal mitsenden; Ponytail wird im Benchmark also für seine eigenen Instruktionen bestraft ([3:55](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=235s))
- Laut Sprecher untertreibt die 47-77-%-Angabe die reale Ersparnis, weil in einer echten Session die Skill-Injektionskosten amortisiert werden ([3:55](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=235s))
- Ein Blogpost von Colin Eberhardt zeigt: „Follow YAGNI principles" (drei Wörter) matcht Ponytails Benchmark fast perfekt, „Follow YAGNI principles and one-liner solutions" (sieben Wörter) schlägt ihn sogar ([4:40](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=280s))
- Der Sprecher argumentiert: das Packaging ist das Produkt — „Follow YAGNI" im System-Prompt liefert nicht die Audit- und Review-Features ([4:40](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=280s))
- In der Demo war die Ponytail-Version in unter 1 Minute fertig, die Default-Version brauchte 2:30 und war deutlich bloatiger ([5:37](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=337s))
- Ponytail packte alles in eine einzige HTML-Datei, die Default-Version nutzte drei Dateien und einen Python-Server ([5:37](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=337s))
- Die Default-Version ignorierte die Standort-Anforderung und zeigte London als Default, während Ponytail den echten Standort abfragte und ausgab ([6:20](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=380s))
- Die Ponytail-Version war 50 % billiger, produzierte weit weniger Codezeilen und war funktional sogar besser als die Default-Version ([7:39](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=459s))
- Die Kombination Caveman + Ponytail brachte kaum Verbesserung und war sogar leicht teurer als Ponytail allein ([8:04](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=484s))
- Laut Sprecher kann man bei Caveman bleiben oder besser Ponytail nutzen, sofern man den Benchmarks glaubt, dass es besser als Caveman ist ([8:04](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=484s))
- Der Sprecher will Ponytail als Plugin in seinem Claude-Code-Setup behalten und für künftige Projekte nutzen ([8:58](https://www.youtube.com/watch?v=2xuFcmUAQUc&t=538s))

## Demos / Schritte

1. Zwei Claude-Code-Instanzen öffnen: in einer das Ponytail-Plugin nur für den lokalen Scope installieren, die andere als Default ohne Plugins.
2. Beiden denselben Prompt geben — eine Wetter-Dashboard-App bauen, die den Nutzerstandort erkennt und aktuelle Wetterdaten anzeigt; bei der Ponytail-Instanz zusätzlich explizit den Ponytail-Skill anfordern.
3. Ergebnis abwarten: Ponytail-Version in unter 1 Minute fertig (eine HTML-Datei), Default-Version nach 2:30 (drei Dateien, Python-Server).
4. Beide Apps öffnen und vergleichen: Default zeigt London als Default-Standort, Ponytail fragt den echten Standort ab und zeigt passendes Wetter.
5. Usage/Kosten vergleichen: Ponytail-Version 50 % günstiger und weniger Codezeilen.
6. Zweiter Durchlauf: Caveman und Ponytail zusammen in einem neuen Verzeichnis aktivieren, gleichen Prompt laufen lassen — Output kaum anders, Kombo leicht teurer als Ponytail allein.

## Genannte Tools

- Ponytail — Claude-Code-Plugin/Skill, das den Agenten YAGNI-konform zur schlanksten Lösung zwingt
- Caveman — ältere Library, die Coding-Agenten weniger reden und damit weniger Tokens verbrauchen lässt
- Claude Code — der Coding-Agent, in dem Ponytail als Plugin/Skill läuft und getestet wird
- Radix UI (React Dialog) — UI-Library, zu der ein Default-Agent für einen Modal-Dialog greift (Portal, Overlay, Trigger, Content-Wrapper)

## Verwandt

- [ai-code-quality-research](obsidian://open?vault=knowledge-base&file=ai-code-quality-research) — Forschung dazu, warum AI-Coding-Assistenten systematisch überdimensionierten, monolithischen Code erzeugen — genau der Bloat, den Ponytail bekämpft
- [llm-coding-prompting-patterns](obsidian://open?vault=knowledge-base&file=llm-coding-prompting-patterns) — wiederverwendbare Prompt-Patterns, die Output-Länge und Code-Volumen messbar reduzieren, verwandt zu Ponytails Regel-Injektion
- [claude-code-updates-2026](obsidian://open?vault=knowledge-base&file=claude-code-updates-2026) — Überblick zu Claude-Code-Skills und deren Steuerung, dem Mechanismus, über den Ponytail als Plugin/Skill eingebunden wird
- [[Anthropic Just Revealed The Best Claude Code Setup]] — Video zu empfohlenen Claude-Code-Setups und Skill-/Plugin-Nutzung, thematisch nah am Ponytail-Setup

---

# Fassung B

## Worum es geht
Andres von Better Stack stellt Ponytail vor: ein Plugin/Skill für Claude Code, das den Agenten wie den faulsten Senior-Dev die schlankste Lösung bauen lässt. Er erklärt YAGNI und die Decision Ladder, zeigt Benchmarks samt Cache-Vorbehalt und testet Ponytail gegen Default-Claude-Code sowie zusammen mit Caveman.
## Besprochene Konzepte
- [ponytail-skill](obsidian://open?vault=knowledge-base&file=ponytail-skill) — Agent denkt wie der faulste Senior-Dev und sucht die schlankste Lösung statt Bloat.
- YAGNI („you ain't gonna need it“) — nichts bauen, bis es gebraucht wird; keine Abstraktion, Library oder Klasse ohne Bedarf.
- Decision Ladder — vor neuem Code: muss es existieren, reicht die Standardbibliothek, gibt es ein natives Plattform-Feature, liegt schon eine Dependency da, reicht ein One-Liner.
- Natives HTML-`dialog` statt Komponentenbibliothek — Focus-Trap, Escape, Backdrop per CSS; in Major-Browsern seit 2022.
- [claude-code-prompt-caching](obsidian://open?vault=knowledge-base&file=claude-code-prompt-caching) — Benchmarks senden den Skill jedes Mal neu mit; in echten Sessions wird er grob einmal bezahlt und danach gecacht.
- Packaging ist das Produkt — automatisch injizierte Regeln plus Commands, Audit, Review und Debt Ledger, nicht nur drei Wörter im System-Prompt.
- Korrektheit als Benchmark-Gate — ein kaputter One-Liner mit wenig LoC fällt durch.
## Behauptungen
- Ponytail lässt den AI-Coding-Agenten wie den faulsten Senior-Dev im Raum denken; das sei ein Kompliment. (0:00)
- Mission: knapp bleiben, den üblichen Agent-Bloat streichen, die schlankste Lösung finden. (0:48)
- Ähnlich wie Caveman, das Agenten weniger reden und dadurch weniger Tokens verbrauchen lässt. (1:08)
- YAGNI stammt aus den 1990ern: nichts bauen, bis es wirklich gebraucht wird. (1:15)
- Nur wenn jede Sprosse der Decision Ladder „nein“ ist, schreibt der Agent neuen Code — und dann das Minimum. (1:42)
- Ein normaler Agent holt für ein Delete-Confirm-Modal Radix UI React Dialog samt Dependency, Portal, Overlay, Root, Trigger und Content-Wrapper. (2:05)
- Das native `dialog` fängt Fokus, schließt bei Escape, rendert Backdrop mit einem CSS-Selektor und läuft in allen Major-Browsern seit 2022. (2:05)
- Statt rund 30 Zeilen plus NPM-Paket: acht Zeilen, null Dependencies. (2:05)
- Ein Ponytail-Kommentar hält fest, was übersprungen wurde und warum; faul, aber nicht verantwortungslos. (2:05)
- Ponytail behauptet eine Kostenreduktion von 47 bis 77 %. (2:05)
- Benchmark: kein Skill, Caveman, Ponytail; drei Modelle; fünf Alltagsaufgaben; zehn Läufe pro Zelle; Median; plus Korrektheitsprüfung. (3:19)
- Die Benchmark-Kosten sind Single-Shot-Calls, die den vollen Regeltext jedes Mal mitsenden; Ponytail zahlt so die eigenen Instructions in jeder Zelle. (3:55)
- In einer echten Session zahlt man die Instructions grob einmal, danach Cache — die 47–77 % untertreiben den Vorteil. (3:55)
- Laut Colin Eberhardt matcht „Follow YAGNI principles“ den Ponytail-Benchmark fast; „Follow YAGNI principles and one-liner solutions“ schlägt ihn. (4:40)
- Der Sprecher argumentiert: Packaging ist das Produkt; „Follow YAGNI“ im System-Prompt liefert weder Audit noch Review. (4:40)
- Ponytail-Plugin manchmal nicht automatisch gegriffen — deshalb im Demo explizit den Skill anfordern. (5:37)
- Ponytail fertig unter 1 Minute, eine HTML-Datei; Default 2:30, drei Dateien plus Python-Server, stärker überentwickelt. (5:37)
- Default-App sieht gut aus und trifft die API, nimmt die Location aber nicht auf und zeigt London. (6:20)
- Ponytail-App fragt nach der Location und zeigt dazu das Wetter; UI karger, folgt dem Prompt genauer. (6:20)
- Ponytail-Lauf rund 50 % günstiger, deutlich weniger LoC, funktional besser — laut Sprecher Beweis, dass Ponytail trägt. (7:39)
- Caveman plus Ponytail: unter 1 Minute, gleiche Funktionalität, Output ähnlich, etwas teurer als Ponytail allein. (8:04)
- Die Kombination bringt laut Sprecher keine große Verbesserung; bei Caveman bleiben oder besser Ponytail, wenn man den Benchmarks glaubt. (8:04)
- Der Sprecher ist beeindruckt: viele Coding-Lösungen sind überentwickelt; weniger sei mehr, richtig eingesetzt. (8:58)
- Er behält Ponytail als Plugin in seinem Claude-Code-Setup und will es in künftigen Projekten nutzen. (8:58)
## Demos / Schritte
1. Modal-Beispiel aus der Ponytail-Doku: Default-Agent mit Radix-Dialog gegen natives `dialog` (acht Zeilen, kein Paket) plus Kommentar, was bewusst aufgeschoben wurde.
2. Zwei Claude-Code-Instanzen: Ponytail-Plugin nur lokal vs. Default ohne Plugins.
3. Gleicher Prompt: Weather-Dashboard mit Location-Erkennung und aktuellen Wetterdaten.
4. In der Ponytail-Instanz den Skill zusätzlich anfordern, weil er nicht immer von selbst greift.
5. Vergleich: Laufzeit, Dateischnitt (eine HTML-Datei vs. drei Dateien plus Python-Server), Location-Verhalten, Usage/LoC.
6. In einem neuen Verzeichnis Caveman und Ponytail zusammen aktivieren, denselben Prompt erneut laufen lassen, Output und Kosten gegen Ponytail allein halten.
## Genannte Tools
- [ponytail-skill](obsidian://open?vault=knowledge-base&file=ponytail-skill) — Plugin/Skill, das YAGNI und die Decision Ladder in den Agenten injiziert.
- [caveman-skill](obsidian://open?vault=knowledge-base&file=caveman-skill) — Library/Skill, das Agenten weniger reden und Tokens sparen lässt.
- [claude-code-overview](obsidian://open?vault=knowledge-base&file=claude-code-overview) — Harness, in der Andres Ponytail lokal installiert und gegen eine Default-Instanz testet.
- Radix UI React Dialog — Bibliothek, die ein normaler Agent laut Beispiel für ein Confirm-Modal zieht.
## Verwandt
- [[This Claude Skill Cuts Your Token Costs In HALF]] — Vorgänger-Video desselben Kanals zu Caveman, das Andres als Vergleich nennt.
- [skill-libs-overview](obsidian://open?vault=knowledge-base&file=skill-libs-overview) — Katalog der bei KIMS eingebundenen Skill-Repos, darunter Ponytail und Caveman.
- [llm-kosten-effizienz](obsidian://open?vault=knowledge-base&file=llm-kosten-effizienz) — Token-Effizienz und warum Benchmark-Preise den Session-Vorteil nicht abbilden.
- [claude-code-skills](obsidian://open?vault=knowledge-base&file=claude-code-skills) — Skill-Mechanik inkl. Auto-Pickup, den Andres im Demo extra anstoßen muss.
- [antwort-stil-regelwerk](obsidian://open?vault=knowledge-base&file=antwort-stil-regelwerk) — KIMS-eigener knapper Antwort-Stil, Nachfolger des Caveman-lite-Injects.
- [baseui-vs-radix-enterprise](obsidian://open?vault=knowledge-base&file=baseui-vs-radix-enterprise) — Radix-Dialog-Schnitt (Root, Trigger, Portal), den Ponytail im Modal-Beispiel vermeidet.
