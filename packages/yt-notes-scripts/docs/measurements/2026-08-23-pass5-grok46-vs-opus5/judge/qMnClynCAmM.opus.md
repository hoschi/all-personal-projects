## Nicht gedeckte Aussagen

### Fassung A
- "Worum es geht": *"Cole Medin stellt das neu gebaute Archon vor"* — der Sprechername kommt im Transkript an keiner Stelle vor. Das Transkript ist durchgehend in der Ich-Form ("I am unveiling the new Archon"), ein Name wird nie genannt.
- "Behauptungen": *"Kontext, Skills und MCP-Server lassen sich pro Node setzen, nicht nur global."* — der Zusatz "nicht nur global" steht so nicht im Transkript. Dort heißt es nur "You also get to pick where you're injecting context … We have that level of control per node with Archon" (5:54). Schwacher Fund: der Gegensatz ist naheliegend, aber der Sprecher zieht ihn nicht.

Zaehlung: A=2

### Fassung B
- "Worum es geht": *"Cole Medin stellt die komplett überarbeitete Version von Archon vor"* — gleicher Fund wie bei A, der Name steht nicht im Transkript.
- "Genannte Tools": *"Bun — JavaScript-Runtime, Prerequisite für Archon"* — dass Bun eine JavaScript-Runtime ist, sagt der Sprecher nicht. Das Transkript nennt Bun nur als Voraussetzung ("check to make sure that we have the prerequisites in place, including Bun, and it'll install it if we don't have it already", 8:48). Die Einordnung stammt aus Weltwissen, nicht aus der Quelle.
- "Behauptungen": fünf Aussagen tragen den Timestamp 5:54, stehen im Transkript aber im Abschnitt 3:07. Betroffen sind wörtlich: *"Claude stehe kurz vor dem Release von 'Mythos' … ([5:54])"*, *"Ein Harness um Opus könne dieses mächtiger machen als Mythos allein ([5:54])"*, *"Eine Studie zeige: Ein LLM allein erreiche nur 6,7 % PR-Acceptance-Rate … ([5:54])"*, *"Stripe shippe mit 'Stripe Minion' 1.300 rein AI-generierte Pull Requests pro Woche … ([5:54])"*, *"Laut Claude-Code-Source-Code-Leak seien 40 % von Anthropics Codebase reiner Harness-Code ([5:54])"*. Der Inhalt ist jeweils gedeckt, die Verortung nicht: alle fünf Sätze stehen im Abschnitt "The Evolution of Harness Engineering" (3:07), der Abschnitt 5:54 handelt von der Orchestrierung. Ein Leser, der dem Link folgt, landet an der falschen Stelle. Ein Fund mit fünf Einzelstellen.

Zaehlung: B=3 (der dritte Fund umfasst 5 Einzelstellen)

## Eigene Spekulation

### Fassung A
- "Besprochene Konzepte": *"Getrennte Sessions — Planung und Implementierung in frischen Context-Windows, damit die Implementierung nicht an der Planung klebt"* — die Begründung ist A's eigene Deutung. Das Transkript sagt "You always want to do your planning and implementation in different coding sessions to remove bias" (5:54). Was "bias" hier meint, legt der Sprecher nicht aus.

Zaehlung: A=1

### Fassung B
- "Genannte Tools": *"Stripe Minion — Stripes internes, nicht-öffentliches AI-Coding-System als Vorbild."* — "als Vorbild" stellt einen Kausalzusammenhang her, den der Sprecher nicht zieht. Er sagt "they actually built something kind of like Archon, but it's not open-source" (3:07) — eine Ähnlichkeit, keine Vorbildbeziehung. Schwacher Fund, aber eine Zuschreibung über die Quelle hinaus. B's eigene Behauptungs-Zeile bleibt dagegen korrekt ("das System sei Archon-ähnlich").

Zaehlung: B=1

## Fehlende wichtige Inhalte

### Fassung A
- Der Archon-Agent in der Web-UI bekommt registrierte Projekte und Workflows beim Gesprächsstart als Kontext injiziert, und über "add project" lassen sich per GitHub-URL oder lokalem Pfad weitere Projekte registrieren (25:52). A erwähnt aus der Web-UI nur den Start eines weiteren Issues.
- Das Monitoring laufender Workflows per Slash-Command: "we could, for example, use the slash loop command in Claude Code to say … every 10 minutes, check on the workflows and restart if there's a failure" (25:52). Fehlt in A vollständig.
- Die zweite Hälfte des Hybrid-Prinzips: "most of the workflow is still going to be driven by our commands and skills, just sending prompts into our coding agents" (5:54). A's Konzept-Eintrag nennt nur die deterministische Hälfte; die Übernahme bestehender Commands/Skills steht bei A zwar als eigene Behauptung, aber nicht als Anteil am Workflow.

Zaehlung: A=3

### Fassung B
- Die mitgelieferten Default-Workflows. Transkript 0:00: "Fixing GitHub issues, creating pull requests from ideas. We have pull request validation and review commands, even one to help you create full PRDs with human in the loop." Transkript 18:47: "adversarial dev harness … a comprehensive PR review workflow … one to help you create issues … idea to PR … this interactive PRD … the Ralph loop … an Archon workflow to help you build more workflows." B nennt davon nur Ralph loop und Workflow-Builder.
- Kontext-Injektion pro Node: "maybe you have a skill that you only need during the validation step, or you have an MCP server that you only want during planning. We have that level of control per node" (5:54). B's Konzept-Eintrag deckt nur Modell- und Session-Wahl pro Node ab; MCP-Server tauchen in B gar nicht auf.
- Die automatische Registrierung eines Repos beim ersten CLI-Lauf: "when we run the Archon CLI in a repo for the first time, it automatically registers it with Archon" (8:48, wiederholt 25:52). Fehlt in B.
- Was der Fix-GitHub-Issue-Workflow leistet: "it does full investigation, fixing, and validation before it creates the pull request" (15:03). Fehlt in B.
- Commands als eigene, längere Prompt-Dateien für einzelne Nodes: "we have the Archon web research command right here. It's just like commands or skills in Claude, where it's just a longer prompt that we're going to invoke for this node specifically" (18:47). Fehlt in B.
- Ablageort und Bündelung der Workflows: "within the .archon folder in the Archon repository, we have all of the default workflows. These are also bundled into the CLI" (18:47). B sagt nur, Workflows seien YAML-Dateien.
- Das konkrete Ergebnis des Parallel-Laufs: "we have eight new open pull requests" (25:52), dazu die Issue-Nummern 3 aus der Web-UI und 5, 7, 8, 9, 10, 11 per CLI. B bleibt bei "mehrere offene Pull Requests".
- Der Sonderfall beim Setup-Wizard: "for certain operating systems, or if you're trying to run Archon in a VPS, you will probably have to open up a new session yourself. So, you just open up a new terminal, and you run the Archon setup command" (8:48). B nennt nur, dass der Wizard in einem separaten Terminal läuft.
- Die Struktur des im Demo erzeugten Beads-Workflows: "It starts with exploration, then it decomposes the feature request into individual tasks, and we implement them in a loop with progress tracking, validating everything at the end as well" (27:40). B nennt nur, dass ein Beads-inspirierter Workflow als YAML entsteht.
- Der angekündigte Livestream: "this Saturday, 9:00 a.m. Central Time" (0:00, wiederholt 27:40). Fehlt in B; für einen Leser, der dem Thema folgen will, ein handlungsrelevanter Punkt.

Zaehlung: B=10

## Praezision

- **Timestamps.** A verortet alle Behauptungen im richtigen Abschnitt. B verlegt fünf Aussagen aus dem Abschnitt 3:07 nach 5:54 (siehe oben). A präziser.
- **Begründung der getrennten Sessions.** B: *"um Bias zu entfernen"* — deckt sich mit "to remove bias" (5:54). A: *"damit die Implementierung nicht an der Planung klebt"* — eigene Auslegung. B präziser.
- **Ergebnis des Parallel-Laufs.** A: *"Am Ende zeigt er acht neue offene Pull Requests."* B: *"→ mehrere offene Pull Requests als Ergebnis"*. Transkript: "we have eight new open pull requests" (25:52). A präziser.
- **Der Test-Workflow beim Setup.** A: *"listet Default-Workflows und startet den Workflow 'Archon assist' als Funktionstest"*. B: *"listet Default-Workflows und führt einen Test-Workflow aus"*. Transkript: "it runs our basic Archon assist one just to make sure that the Archon CLI is functioning" (8:48). A präziser.
- **Zahl der Studien.** B: *"Eine Studie zeige: …"*. A: *"Laut Sprecher liegt die PR-Acceptance-Rate bei bloß generiertem Code bei 6,7 Prozent …"*. Transkript: "There have been studies that have been done" (3:07) — Plural, unbenannt. B legt sich auf eine einzelne Studie fest, A vermeidet die Festlegung. A präziser.
- **Default-Modell.** A: *"Default-Modell der Nodes ist Sonnet, wenn keines gesetzt ist."* B: *"default sei Sonnet"*. Transkript: "we don't specify it here, it just means that it'll use the default model of Sonnet" (18:47). A nennt die Bedingung mit, B nicht. A geringfügig präziser.
- **Hybrid-Prinzip.** B: *"die meisten Schritte treibt der Coding-Agent über Commands/Skills, kritische Schritte (Kontext-Kuration, Tests) werden deterministisch erzwungen"* — beide Hälften. A: *"Schritte wie Tests oder Kontext-Zusammenstellung nicht dem Agenten überlassen, sondern als feste Nodes einbauen"* — nur die deterministische Hälfte. B präziser.
- **Stripe Minion in der Behauptungs-Zeile.** B: *"das System sei Archon-ähnlich, aber nicht Open Source"*. A: *"das System ist nicht Open Source"*. Transkript: "they actually built something kind of like Archon, but it's not open-source" (3:07). B präziser.

## Regelverstoesse

### Fassung A
- Keine. Alle sechs Sektionen sind vorhanden, in der vorgegebenen Reihenfolge, ohne Vorrede und ohne fremde Überschriften. "Demos / Schritte" und "Genannte Tools" haben Anlass (Setup- und Workflow-Demo, zahlreiche genannte Tools). Sprache durchgehend deutsch, Fachbegriffe und Befehlsnamen im Original. "Worum es geht" umfasst zwei Sätze.

### Fassung B
- Keine. Sektionen vollständig, in richtiger Reihenfolge, keine Vorrede, keine fremden Überschriften, Sprache deutsch, "Worum es geht" zwei Sätze. Die falschen Timestamps sind kein Sektions-Regelverstoß, da Timestamps laut Vorgabe optional sind — sie zählen oben als Treue- und Präzisionsmangel.

## Urteil

- Treue: A besser — B trägt drei Funde gegen A's zwei, und B's Timestamp-Fund verlegt fünf einzelne Aussagen an eine Stelle im Video, an der sie nicht fallen.
- Vollstaendigkeit: A besser — bei B fehlen zehn benannte Transkript-Punkte gegen drei bei A, darunter die Liste der mitgelieferten Workflows, die Kontext-Injektion pro Node und die automatische Repo-Registrierung.
- Praezision: A besser — A gewinnt fünf der acht Gegenüberstellungen (Timestamps, acht PRs, "Archon assist", Studien-Plural, Default-Modell-Bedingung), B drei (Bias-Begründung, beide Hälften des Hybrid-Prinzips, Archon-Ähnlichkeit von Stripe Minion).
- Regeltreue: gleichwertig — beide Fassungen erfüllen die Sektionsvorgaben vollständig, keine Fassung hat einen Verstoß.

Gesamt: Fassung A liegt in drei von vier Kriterien vorn und ist bei Regeltreue gleichauf; B's Stärke sind einzelne genauere Formulierungen, die den Verlust an Inhalt nicht aufwiegen.
