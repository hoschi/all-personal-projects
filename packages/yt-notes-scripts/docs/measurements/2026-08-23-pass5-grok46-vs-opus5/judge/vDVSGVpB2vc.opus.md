## Nicht gedeckte Aussagen

### Fassung A

- Keine Funde. Jede Behauptung, jeder Demo-Schritt und jeder Tool-Eintrag ist im Transkript belegt: „team called Neuroflow of three teammates using Sonnet" (0:00), „the QA agent found three critical issues" (0:00), „add one environment variable into your project setting" (2:29), „they are more expensive and they are a bit slower, but you do get much higher quality" (4:32), „10 times more expensive" (6:30), „11 documentation gaps identified" (7:12), „this is the blue agent / the green agent / the yellow one" (10:15), „they inherit the permissions from the main session" (11:45), „three times the cost … two to five agents max" (14:05).
- Grenzfall, nicht gezählt: „## Verwandt", `claude-code-hooks-overview` — „listet die Agent/Team-Hook-Events (`SubagentStart`, `TeammateIdle`, `TaskCreate` …)". Diese Event-Namen stehen nirgends im Transkript; der Satz beschreibt aber den Ziel-Artikel, nicht das Video. Nach der Auflage „Links … ihre technische Korrektheit ist NICHT dein Gegenstand" bleibt er ungezählt.

### Fassung B

- Keine Funde. Auch die Punkte, die nur B hat, sind belegt: „it invoked a tool called team create" (0:00), „there are some things that aren't perfect … we'd want to go back and iterate" (0:00), „if you're on Windows, you have to take a little bit of a workaround" (10:15), „Did you send your structured inventory to both the strategist and the critic?" (7:12), „if you have five, it'll be five times the cost" (14:05), „force killing it right away where things might be all out of control and not cleaned up yet" (14:05).
- Der Vorspann „Die erste OHS-Suche hängt ohne Treffer …" steht nicht im Transkript, ist aber keine Aussage über das Video, sondern Werkzeug-Bericht des Modells. Er ist unter „## Regelverstoesse" gezählt, nicht hier — sonst doppelt.
- Grenzfall, nicht gezählt wie bei A: die Beschreibungen der Vault-Artikel in „## Verwandt" (etwa `claude-code-agent-teams-praxis` — „Community-Prompt-Muster, Teamzuschnitt und bekannte Pitfalls").

Zaehlung: A=0 B=0

## Eigene Spekulation

### Fassung A

- Keine Funde. Zwei Grenzfälle geprüft und verworfen: „Sub-Agents … ohne Querkommunikation" ist die Kehrseite der Sprecher-Aussage „the huge unlock here is that individual teammates can talk to each other" (1:24), keine eigene Deutung. „Team Lead … managt die Teammates wie ein Projektmanager und sichert Qualität" gibt „a team lead, maybe like a project manager" und „making sure that the tasks are getting done and that they're all high quality" (1:24) wieder.

### Fassung B

- Keine Funde. Grenzfall geprüft und verworfen: „Parallelität statt Kette — … reine 1-2-3-Abfolgen sind laut Sprecher eher Sub-Agents". Der Schluss stammt vom Sprecher selbst („that honestly might not even call for an agent team", 11:45) und ist zusätzlich mit „laut Sprecher" markiert.

Zaehlung: A=0 B=0

## Fehlende wichtige Inhalte

### Fassung A

- Der Werkzeugname `team create`: „this now invoked a tool called team create" (0:00). A beschreibt das Spawnen, nennt den Aufruf nicht. B hat ihn als Demo-Schritt 1.
- Die Relativierung des Demo-Ergebnisses: „obviously there are some things that aren't perfect about this and we'd want to go back and iterate" (0:00). A übernimmt nur das Lob. B hat sie als eigene Behauptung.
- Der Inhalt der erzeugten Master-Referenz: „enabling them, when to use them, display modes, task management, hooks, best practices" (2:29). A sagt nur „Master Reference Guide … als Markdown". B listet die Abschnitte in Demo-Schritt 4.
- Der Inhalt des Beispiel-Prompts bei 4:32: „build a working full stack app with a REST API and a React front end. The end result should be a running app that I can view on a local host." A hat nur die Begründung fürs Ziel-Setzen, keinen der genannten Bestandteile. B nennt zumindest React und die Prompt-Struktur.
- Die Rückfrage des Hauptagenten an den Researcher: „Did you send your structured inventory to both the strategist and the critic? … You were asked to message both teammates." (7:12). Das ist die einzige Stelle, an der man den Lead korrigierend eingreifen sieht. Fehlt in A, B hat sie als Demo-Schritt 7.
- Die Begründung für tmux: „We couldn't actually tell what the agents were thinking or doing, and that's because we're doing this in the Claude Code extension." (10:15). A nennt nur den Nutzen der tmux-Ansicht, nicht die Grenze, die sie behebt. B hat beide Sätze.
- Der Windows-Workaround: „if you're on Windows, you have to take a little bit of a workaround" (10:15). Fehlt in A, B hat ihn.
- Pitfall untätiger Agent: „if … one of the agents isn't really doing much or is just sitting around, then maybe you want to specifically make sure you're assigning each agent work or some sort of dependency" (13:12). A lässt diesen von sechs Pitfalls aus. B hat ihn.
- Pitfall falsche Freigaben: „if you're getting the wrong approval … maybe just try to have you be the one who approves things to start" (13:12). A lässt auch diesen aus. B hat ihn.
- Frühabbruch bei falschem Weg: „make sure that you are shutting them down if you see them early on going off down the wrong path. Which is another reason why I think it's helpful to use the tmux version" (14:05) — der Satz, der die tmux-Ansicht mit der Steuerung verbindet. Fehlt in A, B hat ihn.
- Folge des harten Abbruchs: „rather than just force killing it right away where things might be all out of control and not cleaned up yet" (14:05). A nennt das saubere Speichern, nicht die Alternative dazu. B hat sie.

### Fassung B

- Das Ergebnis-Urteil zur Eröffnungsdemo: „it was able to basically one-shot this website" (0:00). B beschreibt in Demo-Schritt 2 nur „die Landing Page steht". A hat den Punkt als Behauptung.

### In beiden Fassungen fehlend

- Die drei geforderten End-Deliverables des Beispiel-Prompts: „I want a running app, I want a report about pass and fail tests, and then I want a doc, which is basically what was built, key decisions, and how we run this moving forward" (4:32), samt Ziel-Details „users and post functionality". A hat davon nichts, B nur das abstrakte Wort „Deliverables".
- Die Verallgemeinerung des Doku-Tipps: „that's something that I like to do whenever I have like maybe a big MCP server or certain documentation that I know it might need to look at constantly" (2:29). Beide beschreiben den Einzelfall Agent-Teams-Doku, keine den wiederverwendbaren Tipp.
- Zwei der Sub-Agent-Kriterien: „If you don't need the agents to communicate, and if you want to save some tokens" (14:05). Beide führen die Nicht-Nutzen-Fälle auf, keine diese beiden.
- Die Anknüpfung an den Plan-Modus: „you guys know how I've told you always start in plan mode. If you plan with your main session before anything actually happens, it's way better" (11:45) — die Begründung, warum Plan Approval Mode überhaupt lohnt. Beide nennen nur den Mechanismus.

Zaehlung: A=15 (11 exklusiv, 4 in beiden) B=5 (1 exklusiv, 4 in beiden)

## Praezision

- Zweiter Durchgang nach dem QA-Befund: A „nach einem zweiten Durchlauf der beiden Dev-Agenten waren alle gelöst" gegen B „der Hauptagent schickt beide plus QA in einen zweiten Durchgang". Das Transkript sagt „it sent off those messages to the front-end developer, the back-end dev, and the QA. And now they're all back to work once again" (0:00) — drei Empfänger, nicht zwei. B ist genauer.
- Kostenfaktor: A „Drei Sessions bedeuten dreifache Kosten" gegen B „Drei parallele Sessions kosten grob dreimal so viel, fünf Sessions fünfmal so viel". Das Transkript hat beide Zahlen (14:05); B gibt die Regel vollständig wieder.
- Ortsbindung des Features: A „VS Code — Editor, in dem die Claude-Code-Extension verwendet wird" gegen B „der Sprecher nutzt sie bevorzugt, sagt aber, Agent Teams gehen überall, wo Claude Code läuft". Das Transkript sagt genau das: „I like to use it in VS Code, but you can use the agent teams feature wherever you decide to use Claude Code" (2:29). B hält die Einschränkung fest, A legt VS Code implizit fest.
- Plan Approval Mode: A „entweder durch die Main-Session, einen Reviewer-Teammate oder den User selbst" gegen B zwei Einträge, davon „Der Sprecher hält es für besser, die Hauptsitzung freigeben zu lassen, nicht jeden Plan selbst". A listet die Optionen vollständig, B nennt zusätzlich die im Transkript ausgesprochene Präferenz („I think it's probably better to just have the main session do that", 11:45). B ist genauer.
- Grund für die lokale Doku-Kopie: A „das macht Nachschlagen schneller" gegen B „damit Claude Code nicht ständig nachschlagen muss". Das Transkript sagt „if it ever needs to look up something … it already has that locally here stored as markdown. So it's going to be much quicker" (2:29). Nachgeschlagen wird weiter, nur lokal — A trifft es, B verschiebt es zu einem Wegfall.
- Aktivierungsweg: A „eine Environment-Variable in den Projekt-Settings" gegen B „eine Variable in der `settings.json`" plus „Im Demo-Projekt entstand `.claude/settings.local.json`". Das Transkript hat beide Formulierungen (2:29); A übernimmt das Wort „environment variable", B den Dateinamen. Gleichwertig genau, unterschiedlich zugeschnitten.
- Auftrag des Research-Teams: A „räumen den Workspace auf" gegen B „zum Aufräumen/Prüfen des Workspace". Das Transkript nennt beides: „the goal is to help me clean up the workspace" und „read through this project and make sure that everything's accurate" (7:12). B ist vollständiger.
- Teamgröße: A „etwa drei bis fünf Teammates" (6:30) und „maximal zwei bis fünf Agenten" (14:05) gegen B mit denselben zwei Angaben an denselben Stellen. Gleichwertig; beide vermeiden es, die zwei Zahlen zu einer zu verschmelzen.

## Regelverstoesse

### Fassung A

- Keine Verstöße. Alle sechs Sektionen vorhanden und in der vorgegebenen Reihenfolge, keine Vorrede, keine fremde Überschrift, Sprache deutsch, „## Worum es geht" zwei Sätze, „## Demos / Schritte" und „## Genannte Tools" haben Anlass (fünf vorgeführte Abläufe, benannte Werkzeuge). Fachbegriffe und Befehlsnamen bleiben im Original.

### Fassung B

- Vorrede vor der ersten Sektion: „Die erste OHS-Suche hängt ohne Treffer; die übrigen Lookups reichen für die Links. Zusammenfassung folgt aus dem Transkript." Die Sektionsvorgabe lässt „## Worum es geht" als erste Sektion beginnen; hier steht Werkzeug-Bericht des Modells davor, der zudem nichts mit dem Video zu tun hat.
- Grenzfall, nicht als Verstoß gezählt: „## Genannte Tools" führt `claude-code-mcp-setup` und `claude-code-skills` auf. Der Sprecher nennt MCP-Server und Skills nur als Gattungen („any of your MCP servers, any of your skills", 11:45), nicht als benannte Werkzeuge. Die Einträge sind gedeckt, die Sektionswahl ist gedehnt.
- Sonst kein Verstoß: alle sechs Sektionen vorhanden, Reihenfolge korrekt, keine fremde Überschrift, Sprache deutsch, „## Worum es geht" zwei Sätze, Timestamps ohne Link sind zulässig (optional).

## Urteil

- Treue: gleichwertig — beide Fassungen haben null nicht gedeckte Aussagen und null eigene Spekulation; jeder geprüfte Grenzfall löste sich in beiden Fällen zur Sprecher-Aussage auf.
- Vollstaendigkeit: B besser — A fehlen elf im Transkript benannte Punkte, die B hat, darunter zwei von sechs Pitfalls, der Windows-Hinweis, die Extension-Grenze als Grund für tmux und die korrigierende Rückfrage des Leads; B fehlt exklusiv nur das „one-shot"-Urteil.
- Praezision: B besser — B trifft den dritten Empfänger im zweiten QA-Durchgang, die zweite Kostenzahl, die Ortsunabhängigkeit des Features und die Freigabe-Präferenz genauer, während A nur bei der Begründung der lokalen Doku-Kopie vorn liegt.
- Regeltreue: A besser — A verletzt keine Sektionsvorgabe, B stellt eine Vorrede über Werkzeug-Zustände vor die erste Sektion.
