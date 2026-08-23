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