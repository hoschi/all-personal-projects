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

---

# Fassung A

## Worum es geht

Überblick über die OpenAI-Ankündigungen rund um den Dev Day: ChatGPT wandelt sich von einem Produkt zu einer Plattform aus Apps, autonomen Agenten, Codex, Hardware-Compute-Deals und einem geplanten KI-Gerät. Der Sprecher argumentiert, OpenAI baue damit eine zusammenhängende KI-Infrastruktur statt einzelner Features.

## Besprochene Konzepte

- Apps SDK / App-Ökosystem — interaktive Apps leben direkt in ChatGPT und werden per natürlicher Sprache aufgerufen
- [Model Context Protocol](obsidian://open?vault=knowledge-base&file=claude-code-mcp-setup) — technische Grundlage, auf der das Apps SDK aufsetzt
- Agentic Commerce Protocol — ermöglicht Instant-Checkout und Monetarisierung direkt im Chat
- Super-App-Ära — die Idee, Nutzer für alles (Buchen, Gestalten, Kaufen, Lernen) in ChatGPT zu halten
- Agent Kit — Drag-and-Drop-System zum Bauen autonomer Agenten, die planen, Daten holen und handeln
- Evals — Toolkit zum Messen, Testen und Vergleichen der Agenten-Genauigkeit vor dem Produktivlauf
- Drei-Schichten-Architektur — Apps als User-Layer, Agent Kit als Reasoning-Layer, Codex als Engineering-Layer
- Dual-Supplier-Compute-Strategie — Bezug von Rechenleistung sowohl von AMD als auch Nvidia zur Absicherung
- Bildschirmloses, ambientes KI-Begleitgerät — ein gerätehaftes „Presence"-Konzept statt klassischer Gadgets

## Behauptungen

- OpenAI sei von Produkt zu Plattform und von Plattform zu „Power" geworden
- Das Apps SDK ist auf dem Model Context Protocol aufgebaut
- Launch-Partner sind u.a. Booking.com, Canva, Coursera, Expedia, Figma, Spotify und Zillow
- Apps fragen beim ersten Gebrauch transparent nach Datenfreigabe und benötigten Daten
- Einreichungen, Reviews, ein offizielles App-Directory und Monetarisierung über das Agentic Commerce Protocol kommen später im Jahr
- Sichtbarkeit hänge künftig nicht mehr vom App-Store-Ranking ab, sondern von der Relevanz der App zum Gespräch
- Agent Kit umfasst Agent Builder (visuelle Canvas), Connector Registry, ChatKit und Evals
- Evals erlaube Datensatz-Grading, Trace-Grading, automatische Prompt-Optimierung und Tests von Drittanbieter-Modellen
- OpenAIs Bewertung habe kurz vor diesen Ankündigungen 500 Milliarden Dollar erreicht
- Codex ist nun offiziell verfügbar mit Slack-Integration, SDK und Admin-Dashboard
- Codex sei auf GPT-4o Codex aufgebaut, auf Geschwindigkeit, Präzision und strukturierten Output feinabgestimmt
- Codex lasse sich per GitHub Actions in CI/CD-Pipelines einbinden und könne Code reviewen, Fixes vorschlagen und Updates pushen
- Intern bei OpenAI seien die wöchentlichen Code-Merges um etwa 70 % gestiegen und fast jeder Pull Request werde automatisch reviewt
- Cisco habe die Code-Review-Zeiten halbiert; Instacart nutze Codex zum Aufräumen von totem Code
- Der AMD-Deal gebe OpenAI die Option, bis zu 10 % von AMD zu kaufen, und sichere sechs Gigawatt Compute über AMDs kommende MI450-Chips
- AMD erwarte aus dem Deal und Folgeverträgen über 100 Milliarden Dollar Neuumsatz in vier Jahren
- Nvidia habe zuvor eine eigene 100-Milliarden-Dollar-Partnerschaft mit OpenAI für 10 Gigawatt Compute angekündigt
- Sam Altman habe Compute als die größte Wachstumsbeschränkung bezeichnet, die er nun durch Sicherung der globalen Chip-Versorgung beseitige
- OpenAI arbeite mit Jony Ive an einem handflächengroßen, bildschirmlosen KI-Gerät, das hört, sieht und spricht — ohne Trigger-Wörter wie „Hey Siri"
- Das Gerät stehe vor Compute-Herausforderungen und Verzögerungen, da Millionen always-on-Geräte die ohnehin angespannte ChatGPT-Last erhöhen
- Sam Altman ziele laut Quellen darauf, 100 Millionen Einheiten auszuliefern, gestützt auf ChatGPTs 700 Millionen wöchentliche Nutzer
- Der Sprecher vermutet, das Gerät könne neu definieren, wie KI-Hardware aussieht — weniger wie ein Telefon, mehr wie ein ambienter Assistent
- Der Rollout starte außerhalb der EU über Free-, Plus- und Pro-Tiers, mit Business-, Enterprise- und Education-Versionen danach; 11 weitere Partner-Apps seien unterwegs
- ChatGPT sei kein Chatbot mehr, sondern Infrastruktur

## Genannte Tools

- ChatGPT — zentrale Plattform, in der Apps und Agenten leben
- Apps SDK — Framework zum Bauen interaktiver Apps innerhalb von ChatGPT
- Agent Kit (Agent Builder, Connector Registry, ChatKit, Evals) — Baukasten für autonome KI-Agenten
- Codex (GPT-4o Codex) — KI-Coding-Agent mit Slack-Integration, SDK und Admin-Dashboard
- Agentic Commerce Protocol — Protokoll für Instant-Checkout im Chat
- GitHub Actions — CI/CD-Anbindung für Codex
- Slack — Integrationskanal, um Codex per @Codex zu taggen
- Booking.com, Canva, Coursera, Expedia, Figma, Spotify, Zillow — erste ChatGPT-App-Partner
- Dropbox, Google Drive, SharePoint, Microsoft Teams — über Connector Registry angebundene Datenquellen
- AMD (MI450-Chips) — Compute-Lieferant und Beteiligungsoption
- Nvidia — zweiter Compute-Lieferant
- Cisco, Instacart, Duolingo, Vanta, Rocket — Unternehmen, die Codex einsetzen

## Verwandt

- [[Did ChatGPT Just Kill Zapier]] — Matt Wolfes Zusammenfassung desselben OpenAI Dev Day mit Apps in ChatGPT und AgentKit
- [[OpenAI NEW Agent Builder Easily Create AI Agents That Can Automate Anything! n8n Killer (Agentkit)]] — vertieft das im Video erwähnte Agent Kit / Agent Builder
- [[NEW MCP Toolkit Is Insane! Ultimate MCP Setup For AI Coding Assistants Will 10x Your Productivity!]] — zum Model Context Protocol, auf dem das Apps SDK aufsetzt
- [[The Greatest AI Coding System I've Ever Used, Forget Codex Vs Claude Code]] — Einordnung von Codex im Vergleich zu anderen KI-Coding-Systemen

---

# Fassung B

## Worum es geht
Der Sprecher fasst OpenAIs Schritt von ChatGPT als Produkt zu einer Plattform zusammen: Apps SDK, Agent Kit, Codex, Compute-Deals mit AMD und Nvidia sowie ein geplantes KI-Begleitgerät mit Jony Ive. Er ordnet das als koordinierten Ausbau zu KI-Infrastruktur ein.
## Besprochene Konzepte
- Produkt-zu-Plattform — ChatGPT wird von einem Chatbot zu einer Schicht aus Apps, Agenten, Entwickler-Tools und Compute.
- Super-App-Ära — Nutzer sollen Reisen, Grafik, Einkauf und Lernen in der Chat-Oberfläche erledigen, ohne sie zu verlassen.
- Apps SDK auf dem Model Context Protocol — [claude-code-mcp-setup](obsidian://open?vault=knowledge-base&file=claude-code-mcp-setup) — Entwickler bauen interaktive Apps, die direkt in ChatGPT leben.
- App-Ökosystem per natürlicher Sprache — Apps werden per Erwähnung aufgerufen; Sichtbarkeit hängt an Gesprächsrelevanz statt App-Store-Ranking.
- Agentic Commerce Protocol — Monetisierung und Sofort-Checkout innerhalb von ChatGPT.
- Agent Kit — Drag-and-Drop für autonome Agenten, die planen, Daten holen und handeln.
- Connector Registry — zentrale Anbindung von Datenquellen wie Dropbox, Google Drive, SharePoint und Microsoft Teams.
- Evals für Agenten — Datasets, Trace-Grading, automatische Prompt-Optimierung und Tests gegen Drittanbieter-Modelle vor dem Live-Gang.
- Dreischichten-Stack — ChatGPT-Apps als User-Schicht, Agent Kit als Reasoning-Schicht, Codex als Engineering-Schicht.
- Dual-Supplier-Compute — AMD und Nvidia parallel, damit GPU-Nachschub nicht wieder zum Engpass wird.
- Ambient-KI-Gerät ohne Bildschirm — [[persönlicher AI Assistent]] — Präsenz statt Gadget, Stimme und Kontext statt Display.
- Privatsphäre bei Always-on-Hardware — [[KI - Privatsphäre - geschützte Daten - Geschäftsdaten]] — Mikrofon, Kamera, kein Triggerwort.
- ChatGPT als Infrastruktur — Kommunikation, Erstellung und Compute laufen in einer Oberfläche zusammen.
## Behauptungen
- ChatGPT wird zu einer Plattform mit Apps, autonomen Agenten und eigener Hardware.
- Das Apps SDK sitzt auf dem Model Context Protocol und lässt interaktive Apps direkt in ChatGPT laufen.
- Zur Launch-Lineup gehören Booking.com, Canva, Coursera, Expedia, Figma, Spotify und Zillow.
- Jede App reagiert auf natürliche Sprache: man erwähnt sie, ChatGPT verbindet sie.
- Beim ersten Nutzen nennt ChatGPT den Datenbedarf, fragt um Erlaubnis und verbindet dann.
- OpenAI nennt das ein neues App-Ökosystem: klassische Menüs sollen durch Klartext ersetzt werden.
- Entwickler können eigene Backends anbinden, im Developer Mode testen und Hunderte Millionen Nutzer erreichen.
- Einreichungen, Reviews und ein offizielles App-Verzeichnis kommen noch in diesem Jahr, plus Monetisierung über das Agentic Commerce Protocol mit Checkout in ChatGPT.
- Laut Sprecher ist das die Grundlage für eine Super-App-Ära: alles in ChatGPT halten.
- Sichtbarkeit hängt künftig daran, wie relevant eine App im Gespräch wirkt, nicht am App-Store-Ranking.
- Agent Kit ist ein Drag-and-Drop-System für autonome Agenten, die planen, Daten holen und handeln.
- Agent Builder ist eine visuelle Fläche für Multi-Agent-Logik aus Knoten und Verbindungen.
- Connector Registry bündelt Daten über Dropbox, Google Drive, SharePoint, Microsoft Teams und andere Dienste.
- ChatKit erlaubt eingebettete, angepasste Chat-Oberflächen im eigenen Produkt oder auf der eigenen Website.
- Evals umfasst Datasets zum Bewerten, Trace-Grading für komplette Läufe, automatische Prompt-Optimierung und Tests mit Drittanbieter-Modellen.
- Teams können Aufgaben simulieren, Workflows testen, Modelle vergleichen, Fehler vor dem Nutzer fangen, Läufe vorschauen, Änderungen zurückrollen und schnell patchen.
- Der Sprecher vermutet, Agent Kit könne das fehlende Stück sein, mit dem KI echte Workflows übernimmt statt nur Fragen zu beantworten — etwa Legal Tech, Enterprise-Automatisierung oder Startups.
- Laut Sprecher ist es kein Zufall, dass OpenAIs Bewertung direkt davor 500 Milliarden Dollar erreichte; die Ankündigungen seien die nächste Ausbaustufe.
- Codex ist nach der Research Preview offiziell verfügbar, mit Slack-Integration, SDK und Admin-Dashboard.
- In Slack holt @Codex Kontext aus dem Chat, führt die Aufgabe in der Codex-Cloud aus und schickt einen Link mit dem Ergebnis.
- Das Codex SDK bringt dieselbe Funktion in eigene Apps oder interne Tools.
- Codex sitzt auf GPT-4o Codex, feinabgestimmt auf Tempo, Präzision und strukturierte Ausgabe.
- Codex behält Kontext, setzt Sitzungen fort und hängt über GitHub Actions in CI/CD-Pipelines.
- Codex kann Code reviewen, Fixes vorschlagen und Updates automatisch pushen.
- OpenAI-Ingenieure nutzen Codex täglich: wöchentliche Code-Merges um etwa 70 Prozent gestiegen, fast jeder Pull Request wird vor Produktion automatisch gereviewt.
- Cisco, Instacart, Duolingo, Vanta und Rocket setzen Codex ein.
- Bei Cisco haben sich Code-Review-Zeiten halbiert; Instacart räumt toten Code weg und automatisiert wiederkehrende Wartung.
- Admin-Dashboards zeigen Nutzung, Änderungen und Richtlinien; Admins können Umgebungen löschen, Standard-Safety-Modi setzen und die Leistung über CLI, IDE und Web sehen.
- ChatGPT-Apps, Agent Kit und Codex verstärken sich gegenseitig: Apps rufen Agenten, Agenten rufen Tools, Codex hält den Code.
- OpenAI hat eine milliardenschwere Partnerschaft mit AMD: Option auf bis zu 10 Prozent von AMD und 6 Gigawatt KI-Compute über kommende MI450-Chips.
- 6 Gigawatt entsprechen laut Sprecher grob dem Verbrauch von 5 Millionen US-Haushalten oder drei Hoover-Staudämmen.
- AMD erwartet aus diesem Deal und Folgeverträgen über 100 Milliarden Dollar Umsatz in 4 Jahren.
- Nvidia hat zuvor eine 100-Milliarden-Dollar-Partnerschaft mit OpenAI über 10 Gigawatt Compute angekündigt.
- Laut Sprecher spielt OpenAI AMD und Nvidia gegeneinander als langfristige Absicherung, damit GPUs nicht wieder ausgehen.
- Sam Altman nannte Compute die größte Wachstumsbremse; laut Sprecher ist diese Bremse damit im Kern beseitigt.
- OpenAI arbeitet mit Jony Ive an einem kleinen KI-Begleitgerät ohne Bildschirm, das hört, sieht und spricht.
- Ziel laut mit dem Projekt vertrauten Personen: handflächengroßes Gerät für Schreibtisch oder unterwegs, zugänglich aber nicht aufdringlich.
- Es nutzt Mikrofone, Kameras und Lautsprecher; ohne „Hey Siri“-Triggerwort, es soll selbst merken, wann Hilfe nötig ist.
- Ives Ansatz: kein Display, keine Ablenkung, nur Stimme und Kontext.
- Quellen laut Sprecher: das Gerät hat Compute-Probleme und Verzögerungen; OpenAI kämpft schon mit der ChatGPT-Last, Tausende Always-on-Begleiter würden die Last stark erhöhen.
- Die Persönlichkeit soll freundlich ohne übermenschlich, fähig ohne roboterhaft, präsent ohne aufdringlich sein; das sei derzeit einer der schwersten Teile.
- Sam Altman will laut Sprecher 100 Millionen Stück ausliefern und setzt auf 700 Millionen wöchentliche ChatGPT-Nutzer als potenzielle Käufer.
- Der Sprecher vermutet: wenn es klappt, sieht KI-Hardware weniger wie ein Telefon und mehr wie ein ambienter Assistent aus.
- Apps, Agenten, Codex, AMD-Compute und das Ive-Gerät greifen laut Sprecher als eine koordinierte Bewegung ineinander.
- Jede App braucht klare Datenrichtlinien, stabile Leistung und schnelle Antworten; Unzuverlässiges oder Täuschendes fliegt raus.
- Der Rollout startet außerhalb der EU über Free, Plus und Pro; Business, Enterprise und Education folgen.
- 11 weitere Partner-Apps sind bereits unterwegs.
- Der Sprecher vermutet, diese Infrastruktur werde schnell zur Grundlage, auf der alles andere läuft.
## Genannte Tools
- ChatGPT — Chat-Oberfläche, in der Apps, Agenten und Checkout laufen sollen.
- Apps SDK — Entwickler-Schnittstelle für interaktive Apps in ChatGPT.
- Agent Kit — Baukasten für autonome Agenten.
- Agent Builder — visuelle Fläche für Multi-Agent-Logik.
- Connector Registry — Hub für Datenanbindungen.
- ChatKit — einbettbare Chat-Oberfläche für eigene Produkte.
- Evals — OpenAI-Werkzeugkasten zur Messung von Agenten-Qualität.
- Codex — KI-Softwareentwicklung mit Slack-Anbindung, SDK, Admin-Dashboard, CLI, IDE und Web.
- [[openai api modelle]] — GPT-4o Codex als feinabgestimmte Basis von Codex.
- Slack — Codex per @Codex im Chat anstoßen.
- [[Github Actions vs BuildKite]] — CI/CD-Anbindung von Codex.
- Booking.com — Launch-App in ChatGPT.
- Canva — Launch-App in ChatGPT.
- Coursera — Launch-App in ChatGPT.
- Expedia — Launch-App in ChatGPT.
- Figma — Launch-App in ChatGPT.
- Spotify — Launch-App in ChatGPT.
- Zillow — Launch-App in ChatGPT.
- Dropbox — Datenquelle über Connector Registry.
- Google Drive — Datenquelle über Connector Registry.
- SharePoint — Datenquelle über Connector Registry.
- Microsoft Teams — Datenquelle über Connector Registry.
- AMD — Compute-Partner, MI450-Chips, bis zu 6 Gigawatt.
- Nvidia — Compute-Partner, 10 Gigawatt laut genanntem Deal.
- [[personal assistance systems]] — Siri als Vergleich für das geplante Begleitgerät.
## Verwandt
- [[Did ChatGPT Just Kill Zapier]] — derselben Dev-Day-Linie: Apps in ChatGPT und AgentKit.
- [[OpenAI NEW Agent Builder Easily Create AI Agents That Can Automate Anything! n8n Killer (Agentkit)]] — vertieft Agent Kit und den visuellen Agent Builder.
- [iframe-plugin-sdk-patterns](obsidian://open?vault=knowledge-base&file=iframe-plugin-sdk-patterns) — wie Plattformen App- und Plugin-SDKs bauen, analog zum ChatGPT-App-Ökosystem.
- [[The MCP Integration EVERYONE is Sleeping On (MCP + Custom AI Agents)]] — MCP in eigenen Agenten, das Protokoll hinter dem Apps SDK.
- [[This Is The Greatest Shift In Codex CLI And Claude Code]] — Codex-CLI und Anbindung externer Dienste, parallel zur Engineering-Schicht im Video.
- [[Claude Managed Agents Just Automated EVERY Job! AI Agent OS!]] — andere verwaltete Agenten-Plattform neben Agent Kit.
- [datenschutz-und-nutzungsrechte-checkliste](obsidian://open?vault=knowledge-base&file=datenschutz-und-nutzungsrechte-checkliste) — Prüfrahmen für Always-on-Geräte mit Mikrofon und Kamera.
