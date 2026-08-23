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
### — OpenAI-Überblick: Von Produkt zu Plattform

OpenAI just changed the game again. Chat GPT is turning into a full platform packed with apps, autonomous agents, and even its own hardware. There's the new apps SDK bringing Spotify, Canva, and Zillow inside your chats. Agent Kit for building AI agents that can actually think and act. Codex powering developers everywhere. And massive AMD and Nvidia deals to fuel it all. Oh, and they're also working on a new AI device. Call it what you want, but OpenAI just went from product to platform and from platform to power.

### — Apps SDK und das neue App-Ökosystem

All right, so it all comes from the new apps SDK built on the model context protocol. Basically, it lets developers create interactive apps that live directly inside Chat GPT. The launch lineup already includes Booking.com, Canva, Coursera, Expedia, Figma, Spotify, and Zillow. Each app works through simple natural language. You just mention it. And Chat GPT connects the dots. When you use one for the first time, it'll tell you what data it needs, ask permission, and connect you seamlessly. It's smooth, transparent, and honestly feels like the web being compressed into one single conversation. OpenAI calls it a new app ecosystem, and it's meant to replace traditional menus with plain language. Developers can now connect their own backends, test everything in developer mode, and reach hundreds of millions of users exactly when they're needed most. Submissions, reviews, and an official app directory go live later this year along with monetization through something called the Agentic Commerce Protocol, which allows instant checkout right inside Chat GPT. So yeah, this is the foundation for OpenAI's next big move and what you could call the super app era. The idea is simple. Keep people inside ChatGPT for everything. Booking trips, creating graphics, buying products, learning new skills, all without ever leaving the chat. And instead of depending on app store rankings, visibility now depends on how relevant your app feels to the conversation itself.

### — Agent Kit: Autonome KI-Agenten per Drag-and-Drop

But that's only one half of what OpenAI just unveiled. The other half is Agent Kit. And this one's a big deal. It's a drag and drop system for creating autonomous AI agents. Small reasoning systems that can plan, fetch data, and take action. Think of it as the brain that runs behind all those front-end apps. Basically, developers can visually design workflows, connect tools, add guard rails, and deploy working agents without writing endless code. Agent Kit includes a few key pieces. Agent Builder gives developers a visual canvas to design multi-agent logic using nodes and connections. Connector Registry acts like the command center. A single hub for linking data across Dropbox, Google Drive, SharePoint, Microsoft Teams, and other services. ChatKit lets you embed customized chat interfaces so these agents feel native to your own product or website. Then there's Evals. And this is where it gets interesting. Evals is OpenAI's toolkit for measuring how well agents perform. It now includes data sets for grading, trace grading for end-to-end runs, automatic prompt optimization, and even support for testing third-party models. That's a big deal because once agents start acting autonomously, accuracy becomes the make or break factor. So developers can actually simulate tasks, test workflows, compare models, and catch errors before they reach real users. Faulty chains don't just fail quietly, they create chaos. Evals basically prevents that. It lets teams preview every run, roll back changes, and quickly patch mistakes. Fast iteration is what makes this whole system practical. And all of this means one thing. Building reliable agents just got a lot easier. For legal tech, enterprise automation, or even startups. This could be the missing piece that finally lets AI take over real world workflows instead of just answering questions. Now, it's not a coincidence that OpenAI's valuation hit $500 billion right before this. These announcements are clearly the next stage of that expansion. Apps, agents, integrations, everything feeding back into the same ecosystem. And that ecosystem needs developers to make all this usable. OpenAI had to give teams stronger tools.

### — Codex: KI-gestützte Software-Entwicklung im Enterprise-Einsatz

That's where Codex comes in. Originally launched in research preview, Codex is now officially available with a Slack integration SDK and a full admin dashboard. You can tag @Codex in Slack and it'll pull context from the chat, run your task in the Codex cloud, and send you a link with results. The Codex SDK brings that same power into your own apps or internal tools. It's built on GPT-4o Codex, fine-tuned for speed, precision, and structured output. It remembers context, resumes sessions, and plugs right into CI/CD pipelines using GitHub Actions. So, yeah, Codex can review code, propose fixes, and push updates all automatically. Inside OpenAI, engineers already rely on it every day. They say weekly code merges went up by about 70% and almost every pull request is now auto-reviewed before it even hits production. Companies like Cisco, Instacart, Duolingo, Vanta, and Rocket are doing the same. Cisco's engineers reported code review times cut in half. Instacart uses Codex to clean up dead code and automate repetitive maintenance. And with the new admin dashboards, companies can track usage, monitor changes, and enforce policies across every environment. And admins can even delete environments, set default safety modes, and see how Codex performs across CLI, IDE, and web. It's a whole new level of visibility that makes this feel enterprise ready. When you step back, you can see the full picture. ChatGPT apps form the user layer. That's the front end. Agent Kit is the reasoning layer. That's where all the logic and automation happen. And Codex is the engineering layer, the foundation that keeps everything running. Together, they create a self-reinforcing system. Apps call agents, agents call tools, Codex maintains the code that powers it all.

### — Hardwarepartnerschaften: AMD- und Nvidia-Deals

But for any of this to scale, you need serious compute power. And that's why OpenAI just signed one of the biggest hardware deals in tech history, a multi-billion dollar partnership with AMD. The deal gives OpenAI the option to buy up to 10% of AMD while securing six gigawatts of AI compute through AMD's upcoming MI450 chips. To put that in perspective, that's roughly the energy used by 5 million US homes or three Hoover Dams combined. AMD expects over $100 billion in new revenue from this deal and follow-on contracts in just 4 years. And here's the twist. This comes right after Nvidia announced its own $100 billion partnership with OpenAI for 10 gigawatts of compute. So now OpenAI is officially sourcing from both giants AMD and Nvidia, playing a long-term hedge to make sure it never runs out of GPUs again. Sam Altman called compute the biggest constraint for growth and now he's basically removed that constraint by locking in the global chip supply. This dual supplier move gives OpenAI enormous leverage and makes the entire ecosystem more stable. Every app, every agent, every Codex task, all of it runs on this backbone.

### — Jony Ive und das KI-Begleitgerät ohne Bildschirm

And while all that hardware lives in massive data centers, OpenAI is also working on something more tangible. It's teaming up with Jony Ive, the legendary Apple designer, to create a small AI companion device, something with no screen that listens, sees, and speaks. The idea is bold. Make an AI that feels like a presence, not a gadget. According to people familiar with the project, the goal is a palm-sized device that sits on your desk or travels with you. Like Siri, but better. It's designed to be accessible, but not intrusive. Always aware, but never annoying. It uses microphones, cameras, and speakers to interact with you in a more natural way. No "Hey Siri" trigger words. It just knows when to help. Ive's design philosophy here is simplicity. No display, no distractions, just voice and context. Now, obviously, that raises privacy questions, and it's not without problems. Sources say the device is facing compute challenges and delays. OpenAI already struggles to power ChatGPT's demand, so running thousands of small, always-on AI companions adds a massive load. On top of that, there's the personality issue. They want it to feel friendly without being overly human, capable without sounding robotic, and present without becoming invasive. That balance is delicate, and right now, it's one of the toughest parts of the project. Still, Sam Altman reportedly aims to ship 100 million units, counting on ChatGPT's 700 million weekly users as potential buyers. If it works, it could redefine what AI hardware looks like. Less like a phone, more like a living ambient assistant.

### — Fazit: OpenAI als KI-Infrastruktur

So when you connect all the dots, the apps SDK, Agent Kit, Codex, AMD, and the Jony Ive device, it all starts to look like one coordinated move. OpenAI isn't just adding features, it's locking every piece of its ecosystem together. The apps pull users in, the agents keep them engaged, Codex powers the builders, and the compute network underneath fuels it all. To make it work at scale, OpenAI is also tightening the rules. Every app needs clear data policies, stable performance, and fast responses. Anything unreliable or deceptive gets cut. It's not just about growing fast anymore. It's about keeping the system clean and controlled while millions of people build on top of it. Right now, the rollout is starting outside the EU across free, Plus, and Pro tiers with business, enterprise, and education versions coming next. 11 more partner apps are already on the way. And this shift is obviously strategic. OpenAI is positioning ChatGPT as the central layer where communication, creation, and computation merge into one experience. Developers get reach, businesses get automation, and users get something that feels less like using an app and more like talking to the entire internet through one interface. It's not a chatbot anymore. It's infrastructure. And the way things are moving, that infrastructure is quickly becoming the foundation everything else will run on. So, what do you think? Is OpenAI building the future of AI or just tightening its grip on it? Drop your thoughts down below. I'll be reading every comment. If you enjoyed this breakdown, make sure to subscribe, leave a like, and I'll catch you in the next one.