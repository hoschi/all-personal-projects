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

### [0:00](https://www.youtube.com/watch?v=RuH3uiJy84A&t=0s) — Intro

If you like saving money or just hate the way the LLMs talk, this one might be for you. It's a new trending skill called Caveman and it promises to cut up to 75% of output tokens while keeping full technical accuracy, all thanks to the wise words of Kevin.

>> Why waste time say lot word when few word do trick?

>> This works on Claude, Codex, and wherever, and it takes your outputs from filler word to long-not-reading responses to a nice TLDR with the same technical accuracy, and it's even customizable and has extras like Wenyan mode, terse commits, one-line code reviews, and an input compression tool. It may seem a little crazy at first, but there's even some science behind this. So, let's jump in and take a look.

### [0:40](https://www.youtube.com/watch?v=RuH3uiJy84A&t=40s) — Text Demo

So, I was testing this out in Claude Code earlier with a demo Next.js app I have that actually has a fake authentication system. I was simply asking, "Can you explain how auth is implemented in this app?" Now, this is normal Claude Code without the skill installed. You see right away it gets into sort of filler words saying, "This is a simulated authentication system." We have an em dash. It says, "No backend, no passwords, no real security. Exists to demonstrate Better Stack RUM user tracking." After this, it then goes on to explain the core files and how it works. Everything's just sort of in readable English.

If we then ask the same question but this time use the Caveman skill, you can see it just gets straight to the point and is a lot more concise. The first sentence is demo only, client-side auth, no real security, built for Better Stack RUM tracking demos. Doesn't have any of those filler words, the em dashes, or anything like that. It doesn't need to make a proper sentence. It just tells you the technical information straight away. The same thing goes for the how-it-works section, the flow, and the integration points. You can see here, instead of saying how this works sort of in a plain English sentence, it just says app load, then has an arrow to check local storage for the saved user. So, it's just way more concise, and that's what I care about, to be honest. I don't really care about it being in plain English. I just wanted the technical information from it. That conciseness is actually the main reason that I like this skill, but its other selling point is that this means it should reduce output tokens, and therefore theoretically you can get more out of your Claude Code subscription or even save money on your API tokens.

### [1:44](https://www.youtube.com/watch?v=RuH3uiJy84A&t=104s) — Saves Money?

But I do think there's a small catch here. This is the results of a comparison test I was running earlier where I was comparing the baseline Claude Code response versus a terse one, which is where I literally say to Claude Code, "Be concise," versus using our Caveman skill. This was on 10 prompts, and it's things as simple as, "How does Git rebase differ from a Git merge?" And you see the results are very positive. When we use the Caveman skill versus the baseline, we actually have a 45% reduction in our output tokens and a 39% one against just saying, "Be concise," to Claude Code. Now, that's obviously going to relate to cost as well. There's going to be a 45% saving there in the output tokens. So, the baseline cost around 8 cents for them, and Caveman costs around 4 cents. So, everything looks quite good initially.

Where things start to get a little more interesting, though, is when we factor in the cost of input tokens. Obviously, now that we're using the Caveman skill, we're loading in a markdown file which has a lot more text in it than our single-sentence prompts. So, for the baseline, where we were just sending that sentence, it's fractions of a cent, but when we use our skill, you can see it's now around 4 cents. If we then combine our input and output token costs, you can see that on average Caveman is actually 10% more expensive than the baseline, because the savings that we made on those output tokens have been lost to our input tokens.

But this doesn't mean it's a loss for Caveman. That's because this is only true in very specific scenarios. It's only true if we're sending a single small prompt and we're not asking any follow-up questions. If you start to ask follow-up questions, you can hit the prompt cache pricing, and when we do that, you can see things swing back in favor of Caveman. We're actually making a 39% cost saving. You can see I went down a bit of a rabbit hole there, but it does prove there is some logic to using Caveman.

### [3:19](https://www.youtube.com/watch?v=RuH3uiJy84A&t=199s) — Smarter?

That's before we even factored in another possible advantage, which is that a study this year showed that constraining large models to brief responses improves accuracy by 26% on certain benchmarks. So, maybe Kevin was the smart one after all, and you'd be smart for subscribing.

### [3:38](https://www.youtube.com/watch?v=RuH3uiJy84A&t=218s) — The Skill

You can try out this skill for yourself by using the Vercel skill package and running a command like this. And in here we can also see what it's asking the agent to do. We have some rules like drop articles like a, an, and the. Drop any filler words, drop pleasantries, drop hedging. Then we also have use short synonyms, so use "big" instead of "extensive" and say "fix" instead of "implement a solution for." And we also have what we want to keep, which is technical terms, code blocks, and errors. After this, we then have the pattern of how it should be structured, so we should have a thing, an action, a reason, and then a next step. So, nice and concise.

There's even intensity modes in here to change just how Caveman it gets. You see it ranges all the way from light up to ultra. I was using full, since that is the default. You can see in ultra it abbreviates everything, it strips conjunctions, it uses arrows for causality, and it uses one word when one word's enough. There's also a Wenyan mode, which is using classical Chinese characters because they're actually the most token efficient. Unfortunately, I can't read them, so it's not much use to me.

### [4:30](https://www.youtube.com/watch?v=RuH3uiJy84A&t=270s) — Bonus Skills

That's not even all that Caveman has to offer. There's actually a few more skills for specific scenarios. We have Caveman Commit to write terse and exact messages in a Conventional Commits format. We have Caveman Review to write code review comments that are one concise line per finding. And we also have a Compress skill to take your natural language files and Cavemanify them so you can reuse them with slightly less input tokens. Let me know in the comments if you like the sound of any of these, and while you're down there, subscribe, and as always, see you in the next one.

---

# Fassung A

## Worum es geht
Der Sprecher stellt die trendende Skill Caveman vor: sie soll Output-Tokens um bis zu 75 % senken und trotzdem technisch vollständig bleiben. Er zeigt das in Claude Code an einer Auth-Erklärung und rechnet die Output-Ersparnis gegen den Input-Preis der Skill-Datei.
## Besprochene Konzepte
- [caveman-skill](obsidian://open?vault=knowledge-base&file=caveman-skill) — Skill, die Antworten in extrem knappen Stil zwingt und Füllwörter streicht
- [llm-kosten-effizienz](obsidian://open?vault=knowledge-base&file=llm-kosten-effizienz) — Output-Ersparnis gegen den Input-Preis der geladenen Skill-Markdown-Datei
- [claude-code-prompt-caching](obsidian://open?vault=knowledge-base&file=claude-code-prompt-caching) — Nachfragen treffen Prompt-Cache-Preise und können die Rechnung zugunsten von Caveman drehen
- Intensitätsstufen — light bis ultra, Default ist full
- Wenyan-Modus — klassische chinesische Schriftzeichen, laut Sprecher die token-effizienteste Schrift
- Kürze und Genauigkeit — eine Studie zeige 26 % mehr Genauigkeit bei knappen Antworten auf bestimmten Benchmarks
- Antwort-Muster — Ding, Aktion, Grund, nächster Schritt
- Weglass-Regeln — Artikel (a/an/the), Füllwörter, Höflichkeiten und hedging streichen; technische Begriffe, Code-Blöcke und Fehler behalten
- Drei-Wege-Vergleich — Baseline gegen den Satz „Be concise“ gegen die Caveman-Skill, gemessen an 10 Prompts
## Behauptungen
- Caveman verspricht bis zu 75 % weniger Output-Tokens bei voller technischer Genauigkeit. (0:00)
- Die Skill läuft auf Claude, Codex und anderswo. (0:00)
- Zusätzlich gibt es Wenyan-Modus, knappe Commits, Ein-Zeilen-Code-Reviews und ein Input-Kompressions-Werkzeug. (0:00)
- Ohne Skill erklärt Claude Code die Fake-Auth mit Füllwörtern, em dashes und ausformuliertem Englisch. (0:40)
- Mit Caveman kommt zuerst: Demo only, client-side Auth, keine echte Sicherheit, gebaut für Better-Stack-RUM-Demos. (0:40)
- Der Ablauf steht als Stichworte mit Pfeil, etwa App-Load → local storage auf gespeicherten User prüfen, statt als Fließtext. (0:40)
- Dem Sprecher geht es vor allem um Knappheit und technische Information, nicht um ausformuliertes Englisch. (0:40)
- Laut Sprecher sollte weniger Output theoretisch mehr aus dem Claude-Code-Abo holen oder API-Tokens sparen. (0:40)
- Auf 10 Prompts senkt Caveman die Output-Tokens um 45 % gegenüber Baseline und um 39 % gegenüber „Be concise“. (1:44)
- Die Output-Kosten lagen bei rund 8 Cent (Baseline) bzw. rund 4 Cent (Caveman). (1:44)
- Die Skill-Markdown-Datei treibt die Input-Kosten von Bruchteilen eines Cents auf rund 4 Cent. (1:44)
- Input plus Output macht Caveman bei einem einzelnen kleinen Prompt ohne Nachfrage im Schnitt 10 % teurer als Baseline. (1:44)
- Das gelte nur für genau diesen Fall: ein kleiner Prompt, keine Follow-ups. (1:44)
- Mit Follow-ups und Prompt-Cache-Preisen misst der Sprecher 39 % Kostenersparnis. (1:44)
- Eine Studie in diesem Jahr habe gezeigt, dass knappe Antworten die Genauigkeit großer Modelle auf bestimmten Benchmarks um 26 % verbessern. (3:19)
- Installation läuft über das Vercel-Skill-Paket und einen dort gezeigten Befehl. (3:38)
- Regeln: Artikel weglassen; Füllwörter, Höflichkeiten und hedging streichen; kurze Synonyme („big“ statt „extensive“, „fix“ statt „implement a solution for“). (3:38)
- Behalten: technische Begriffe, Code-Blöcke, Fehlermeldungen. (3:38)
- Struktur: Ding, Aktion, Grund, nächster Schritt. (3:38)
- Intensität reicht von light bis ultra; Default und genutzte Stufe ist full. (3:38)
- Ultra kürzt alles, streicht Konjunktionen, setzt Pfeile für Kausalität und ein Wort, wenn ein Wort reicht. (3:38)
- Wenyan nutzt klassische chinesische Schriftzeichen, weil sie am token-effizientesten seien; der Sprecher kann sie nicht lesen und hat nichts davon. (3:38)
- Caveman Commit schreibt knappe, genaue Messages im Conventional-Commits-Format. (4:30)
- Caveman Review schreibt eine knappe Zeile pro Finding. (4:30)
- Die Compress-Skill schreibt natürliche Sprache in Caveman-Stil um, damit Wiederverwendung etwas weniger Input-Tokens kostet. (4:30)
## Demos / Schritte
1. Dieselbe Frage an Claude Code ohne Skill: wie Auth in einer Demo-Next.js-App mit Fake-Auth umgesetzt ist.
2. Dieselbe Frage mit installierter Caveman-Skill: knappe Stichpunkte statt Fließtext.
3. 10 Prompts im Dreiervergleich Baseline / „Be concise“ / Caveman; Output-Kosten, Input-Kosten, Summe, dann Follow-ups mit Prompt-Cache.
4. Skill-Markdown: Weglass-Regeln, Synonyme, Behalten-Liste, Antwort-Muster.
5. Intensitätsstufen light–ultra und Wenyan-Modus.
6. Bonus-Skills: Caveman Commit, Caveman Review, Compress.
## Genannte Tools
- [caveman-skill](obsidian://open?vault=knowledge-base&file=caveman-skill) — die vorgestellte Kompressions-Skill samt Commit-, Review- und Compress-Varianten
- [claude-code-overview](obsidian://open?vault=knowledge-base&file=claude-code-overview) — Demo-Umgebung und Abo-/API-Kostenrechnung
- Codex — laut Sprecher ebenfalls unterstützt
- [[Agent Skills]] — Vercel-Skill-Paket zur Installation
- Next.js — Demo-App mit gefälschter Auth
- Better Stack RUM — Zweck der Fake-Auth in der Demo
- Caveman Commit — knappe Conventional-Commits-Messages
- Caveman Review — eine knappe Zeile pro Finding
- Compress — natürliche Sprache in Caveman-Stil umschreiben
## Verwandt
- [textverdichtung-overview](obsidian://open?vault=knowledge-base&file=textverdichtung-overview) — trennt Lese-Aufwand von Token-Kompression; das Video verkauft beides in einem
- [antwort-stil-regelwerk](obsidian://open?vault=knowledge-base&file=antwort-stil-regelwerk) — bei KIMS eingebautes Antwort-Stil-Regelwerk, historisch caveman-lite
- [caveman-lite-inject-prompt](obsidian://open?vault=knowledge-base&file=caveman-lite-inject-prompt) — der injizierte Caveman-lite-Prompt zum Nachbauen ohne Plugin
- [claude-code-skills](obsidian://open?vault=knowledge-base&file=claude-code-skills) — das Skills-System, über das eine solche Skill geladen wird
- [claude-code-token-cost-tools](obsidian://open?vault=knowledge-base&file=claude-code-token-cost-tools) — Input- vs. Output-Tokens bei Claude-Code-Werkzeugen
- [llm-benchmark-register](obsidian://open?vault=knowledge-base&file=llm-benchmark-register) — Raster, um die zitierte 26-Prozent-Genauigkeitsstudie einzuordnen

---

# Fassung B

## Worum es geht

Vorstellung und Kosten-Analyse der trendenden „Caveman"-Skill für Claude Code (und Codex), die LLM-Ausgaben in extrem knappen „Steinzeit"-Stil zwingt, um Output-Tokens zu sparen und Antworten prägnanter zu machen.

## Besprochene Konzepte

- Caveman-Skill — Regelsatz, der Füllwörter, Artikel, Höflichkeiten und Hedging streicht und Ausgaben auf reine technische Information reduziert
- [[Agent Skills]] — installierbare Skills, die das Agenten-Verhalten (hier: Ausgabestil) per Markdown-Regeldatei steuern
- Prägnanz statt Klartext — Ausgabe als Stichworte/Pfeile (z. B. „app load → check local storage") statt vollständiger englischer Sätze
- Prompt-Caching-Preislogik — bei Folgefragen greift Cache-Pricing und verschiebt die Kostenrechnung zugunsten von Caveman
- Intensitäts-Modi — Stufen von „light" bis „ultra" regeln, wie stark der Stil komprimiert wird (Default: „full")
- Wenyan-Modus — Nutzung klassischer chinesischer Schriftzeichen als besonders token-effiziente Ausgabe
- Struktur-Pattern — Ausgabe folgt dem Schema thing → action → reason → next step

## Behauptungen

- Caveman verspricht, bis zu 75 % der Output-Tokens zu sparen bei voller technischer Genauigkeit ([0:00](https://www.youtube.com/watch?v=RuH3uiJy84A&t=0s))
- Die Skill funktioniert auf Claude, Codex und anderswo ([0:00](https://www.youtube.com/watch?v=RuH3uiJy84A&t=0s))
- Normales Claude Code nutzt Füllwörter, Em-Dashes und ganze Sätze; mit Caveman kommt die Antwort sofort zum technischen Punkt ([0:40](https://www.youtube.com/watch?v=RuH3uiJy84A&t=40s))
- Im Vergleichstest über 10 Prompts: 45 % weniger Output-Tokens gegenüber der Baseline, 39 % weniger gegenüber einem simplen „Be concise" ([1:44](https://www.youtube.com/watch?v=RuH3uiJy84A&t=104s))
- Baseline kostete rund 8 Cent, Caveman rund 4 Cent bei den Output-Tokens ([1:44](https://www.youtube.com/watch?v=RuH3uiJy84A&t=104s))
- Die Caveman-Markdown-Datei erzeugt deutlich mehr Input-Tokens (rund 4 Cent) als der Ein-Satz-Prompt der Baseline ([1:44](https://www.youtube.com/watch?v=RuH3uiJy84A&t=104s))
- Input + Output kombiniert ist Caveman im Schnitt 10 % teurer als die Baseline — aber nur bei einem einzelnen kleinen Prompt ohne Folgefragen ([1:44](https://www.youtube.com/watch?v=RuH3uiJy84A&t=104s))
- Mit Folgefragen greift Prompt-Cache-Pricing und Caveman erzielt dann 39 % Kostenersparnis ([1:44](https://www.youtube.com/watch?v=RuH3uiJy84A&t=104s))
- Eine Studie dieses Jahres zeigte, dass das Beschränken großer Modelle auf knappe Antworten die Genauigkeit auf bestimmten Benchmarks um 26 % verbessert ([3:19](https://www.youtube.com/watch?v=RuH3uiJy84A&t=199s))
- Die Skill ist über das Vercel-Skill-Package installierbar ([3:38](https://www.youtube.com/watch?v=RuH3uiJy84A&t=218s))
- Regeln der Skill: Artikel (a/an/the), Füllwörter, Höflichkeiten und Hedging streichen; kurze Synonyme nutzen („big" statt „extensive", „fix" statt „implement a solution for"); technische Begriffe, Codeblöcke und Fehler behalten ([3:38](https://www.youtube.com/watch?v=RuH3uiJy84A&t=218s))
- Im „ultra"-Modus wird alles abgekürzt, Konjunktionen gestrichen und Pfeile für Kausalität genutzt ([3:38](https://www.youtube.com/watch?v=RuH3uiJy84A&t=218s))
- Der Wenyan-Modus nutzt klassische chinesische Schriftzeichen, weil diese am token-effizientesten sind ([3:38](https://www.youtube.com/watch?v=RuH3uiJy84A&t=218s))
- Zusatz-Skills: Caveman Commit (knappe Messages im Conventional-Commits-Format), Caveman Review (eine prägnante Zeile pro Finding) und Compress (natürliche Sprachdateien „cavemanifizieren") ([4:30](https://www.youtube.com/watch?v=RuH3uiJy84A&t=270s))

## Demos / Schritte

1. In Claude Code (ohne Skill) fragen, wie die Auth im Next.js-Demo-App implementiert ist — Antwort enthält Füllwörter, Em-Dashes und ganze Sätze.
2. Dieselbe Frage mit installierter Caveman-Skill stellen — Antwort ist knapp, ohne Füllwörter, technische Info direkt (z. B. „demo only, client-side auth, no real security").
3. Vergleichstest über 10 Prompts durchführen: Baseline vs. „Be concise" vs. Caveman, Output-Token- und Kostenreduktion messen.
4. Kombinierte Input-+Output-Kosten berechnen und Effekt des Prompt-Caches bei Folgefragen einbeziehen.
5. Skill via Vercel-Skill-Package installieren und die Regeldatei (Regeln, Intensitäts-Modi, Struktur-Pattern) inspizieren.

## Genannte Tools

- Claude Code — Coding-Agent, in dem die Skill getestet wird
- Codex — weiterer Agent, auf dem die Skill laut Video funktioniert
- Vercel Skill Package — Bezugsquelle/Installer für die Caveman-Skill
- Next.js — Framework der Demo-App mit Fake-Auth-System
- Better Stack RUM — Real-User-Monitoring, das die Demo-Auth demonstrieren soll

## Verwandt

- [claude-code-prompt-caching](obsidian://open?vault=knowledge-base&file=claude-code-prompt-caching) — erklärt die Prompt-Cache-Preislogik, auf die der Kostenvorteil bei Folgefragen aufsetzt
- [claude-code-skills](obsidian://open?vault=knowledge-base&file=claude-code-skills) — Grundlagen zu Claude-Code-Skills, deren Mechanik Caveman nutzt
- [claude-code-token-tracking](obsidian://open?vault=knowledge-base&file=claude-code-token-tracking) — Token-Verbrauch messen, relevant für die im Video gezeigte Kostenrechnung
- [llm-coding-prompting-patterns](obsidian://open?vault=knowledge-base&file=llm-coding-prompting-patterns) — Prompting-Muster, verwandt zum Ansatz, Ausgaben über Regeln knapp und technisch zu halten
