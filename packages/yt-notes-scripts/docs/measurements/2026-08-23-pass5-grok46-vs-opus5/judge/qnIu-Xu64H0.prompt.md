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

### [0:00](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=0s) — Intro: terminal multiplexer for coding agents

Wer mehrere Coding-Agents gleichzeitig laufen lässt, Claude Code, Codex, Pi, sollte sich das ansehen. Es geht um herdr, den Terminal-Multiplexer für Coding-Agents.

### [0:14](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=14s) — Installing herdr

Installation ist unkompliziert: Script kopieren, Terminal öffnen, ausführen. Fertig.

### [0:20](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=20s) — Adding integrations and the agent skill

Zwei weitere Schritte vor dem Start: Unter Quick Start, Integrations, Integrationen für die genutzten Coding-Agents hinzufügen (Codex etc.). Zweitens die Agent-Skill-Datei — sie gibt dem Agent eine Möglichkeit, herdr zu nutzen. Unter Agent Skill File GitHub-Autor und Projektname eintragen, `npx skills add` ausführen. Das klont das Repository und findet die eine Skill-Datei darin. Alle genutzten Coding-Agents auswählen (hier auch Pi), Installation global, weil alle Sessions herdr nutzen sollen. Global and proceed — Installation, Extensions und Agent-Skill sind eingerichtet.

### [0:57](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=57s) — Opening a herdr session

Eine Session öffnen: einfach `her` eingeben.

### [1:08](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=68s) — Workspaces and mouse support

Wichtiger UI-Teil: Workspaces — hier Projekte hinzufügen. Im Unterschied zu tmux unterstützt herdr Maussteuerung (Klicken auf New, Schließen), tmux-Keybindings funktionieren aber weiterhin. Zwei Workspaces angelegt: "agent jiu-jitsu" (ein selbstgebauter Jiu-Jitsu-Agent) und "coffee cluster". Neuer Workspace per Klick oder per Prefix Ctrl+B, dann Shift+N.

### [1:51](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=111s) — Running multiple coding agents

Im ersten Workspace Pi geöffnet — links zeigt die Agent-State-Extension einen idle Agent. Neuer Tab, darin Claude Code geöffnet — zweiter Agent läuft. Zwischen Agents per Klick wechseln. Im coffee cluster ebenfalls Pi gestartet — insgesamt drei laufende Agents. herdr zeigt an, wenn ein Agent Input braucht, fertig ist oder blockiert ist.

### [2:28](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=148s) — Agent states: idle, done, blocked

Bei einem Agent in Pi Status abgefragt — arbeitet. Zweiter Agent aktualisiert die README — arbeitet ebenfalls. Ein dritter Agent (in einem Pane statt Tab) zeigt Status "blocked" — braucht eine Permission. Benachrichtigung meldet einen fertigen Agent. Auto-Modus aktiviert, damit nicht mehr nachgefragt wird.

### [3:13](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=193s) — Tabs, panes, and running dev servers

Konzepte: Workspaces, Agents, Tabs (beliebig viele neue Tabs) und Panes. Für einen Dev-Server ein neues Pane öffnen, Shortcut Ctrl+B, Fragezeichen zeigt Optionen. Vertikal splitten für seitliche Anordnung, horizontal für darunter — Prefix plus Minussymbol (Ctrl+B, Minus). Schließen mit Ctrl+B, X. Dev-Server im neuen Pane gestartet, während "agent jiu-jitsu" fertig wurde und die README aktualisiert hat.

### [3:58](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=238s) — Closing and restoring your session

Fenster geschlossen — Arbeit ist nicht verloren. Erneutes Öffnen per `her` stellt alles wieder her, inklusive aller laufenden Agents mit Status idle/done.

### [4:50](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=290s) — Using the herdr skill for sub-agents

Im coffee cluster Pi geöffnet. Pi hat standardmäßig keine Sub-Agents, kann das aber über die Agent-Skill-Datei. Auftrag: zwei herdr-Panes mit je einem Agent starten, um zu untersuchen, wie aufwendig eine Migration nach Python bzw. Rust wäre. Die herdr-Skill wird geladen, der Haupt-Agent instruiert zwei weitere Panes/Agents — einer macht eine Python-Migration, einer eine Rust-Migration, beide laufen parallel. Nach Abschluss liest der Haupt-Agent beide Ergebnisse und liefert das Urteil, welche Migration einfacher ist. Panes lassen sich per Rechtsklick ("close pane") schließen. Auch nach Beenden (Browser schließen oder Ctrl+B, Q) bleibt nichts verloren — erneutes Öffnen mit `her` stellt alle Agents wieder her.

### [5:44](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=344s) — Separate sessions for work and personal projects

Es gibt zusätzlich das Konzept von Sessions: die aktuelle heißt "default session". Neue Session z. B. für Arbeit anlegen ("work") — komplett getrennt von der Default-Session. Wechsel zurück zur Default-Session über `her`, zur Work-Session über `herdr session.work`. Beide Sessions behalten ihren eigenen Zustand.

### [6:17](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=377s) — Final thoughts

herdr ist ein Terminal-Multiplexer mit starker Maus-Unterstützung und nativer Unterstützung für Coding-Agents.

---

# Fassung A

## Worum es geht
Vorstellung von herdr, einem Terminal-Multiplexer für Coding-Agents (Claude Code, Codex, Pi). Das Video zeigt Installation, Workspaces, Tabs und Panes, Agent-Status, Session-Wiederherstellung und parallele Sub-Agents über die herdr-Skill.
## Besprochene Konzepte
- Terminal-Multiplexer für Coding-Agents — herdr verwaltet mehrere Coding-Agents parallel im Terminal
- Workspaces — Projekte in herdr; neu per Klick oder Prefix Ctrl+B, dann Shift+N
- Tabs und Panes — beliebig viele Tabs; Panes vertikal oder horizontal splitten
- Agent-Zustände — idle, arbeitet, done, blocked (Permission nötig)
- [skill-herdr](obsidian://open?vault=knowledge-base&file=skill-herdr) — Skill-Datei, mit der ein Agent herdr nutzt und Sub-Agents in Panes startet
- Sessions — getrennte herdr-Sessions (z. B. default und work) mit eigenem Zustand
- Session-Wiederherstellung — Schließen verwirft die Arbeit nicht; `her` stellt Agents und Status wieder her
- Maussteuerung — Klicken auf New/Schließen; tmux-Keybindings bleiben gültig
## Behauptungen
- Wer mehrere Coding-Agents gleichzeitig laufen lässt (Claude Code, Codex, Pi), sollte sich herdr ansehen. (0:00)
- Die Installation ist unkompliziert: Script kopieren, Terminal öffnen, ausführen. (0:14)
- Vor dem Start Integrationen für die genutzten Coding-Agents hinzufügen und die Agent-Skill-Datei einrichten. (0:20)
- `npx skills add` klont das Repository und findet die eine Skill-Datei darin. (0:20)
- Die Skill global installieren, weil alle Sessions herdr nutzen sollen. (0:20)
- Eine Session öffnen: `her` eingeben. (0:57)
- Im Unterschied zu tmux unterstützt herdr Maussteuerung; tmux-Keybindings funktionieren weiterhin. (1:08)
- Neuer Workspace per Klick oder Prefix Ctrl+B, dann Shift+N. (1:08)
- herdr zeigt an, wenn ein Agent Input braucht, fertig ist oder blockiert ist. (1:51)
- Status blocked bedeutet, der Agent braucht eine Permission. (2:28)
- Auto-Modus sorgt dafür, dass nicht mehr nachgefragt wird. (2:28)
- Prefix Ctrl+B, Fragezeichen zeigt die Optionen. (3:13)
- Vertikal splitten ordnet Panes nebeneinander, horizontal darunter — Prefix plus Minus (Ctrl+B, Minus). (3:13)
- Panes schließen mit Ctrl+B, X. (3:13)
- Fenster schließen verliert die Arbeit nicht; erneutes `her` stellt alles wieder her, inklusive laufender Agents mit Status idle/done. (3:58)
- Pi hat standardmäßig keine Sub-Agents, kann das aber über die Agent-Skill-Datei. (4:50)
- Der Haupt-Agent kann über die herdr-Skill zwei weitere Panes/Agents parallel starten und danach beide Ergebnisse lesen. (4:50)
- Auch nach Beenden (Browser schließen oder Ctrl+B, Q) bleibt nichts verloren. (4:50)
- Eine neue Session (z. B. work) ist komplett getrennt von der Default-Session; beide behalten ihren eigenen Zustand. (5:44)
- Wechsel zur Default-Session über `her`, zur Work-Session über `herdr session.work`. (5:44)
- herdr ist ein Terminal-Multiplexer mit starker Maus-Unterstützung und nativer Unterstützung für Coding-Agents. (6:17)
## Demos / Schritte
1. Installations-Script kopieren und im Terminal ausführen.
2. Unter Quick Start Integrationen für die genutzten Coding-Agents hinzufügen.
3. In der Agent-Skill-Datei GitHub-Autor und Projektname eintragen, `npx skills add` ausführen, Agents auswählen (inkl. Pi), Installation global.
4. Session mit `her` öffnen.
5. Workspaces anlegen („agent jiu-jitsu“, „coffee cluster“) per Klick oder Ctrl+B, Shift+N.
6. Im ersten Workspace Pi öffnen; die Agent-State-Extension zeigt idle.
7. Neuen Tab mit Claude Code öffnen; zwischen Agents per Klick wechseln.
8. Im Workspace coffee cluster ebenfalls Pi starten — drei laufende Agents.
9. Agent-Status beobachten (arbeitet, blocked/Permission, fertig); Auto-Modus einschalten.
10. Neues Pane für einen Dev-Server: Ctrl+B, Fragezeichen für Optionen; vertikal oder horizontal splitten (Ctrl+B, Minus); schließen mit Ctrl+B, X.
11. Fenster schließen, mit `her` wieder öffnen — Agents und Status sind wiederhergestellt.
12. Im coffee cluster Pi beauftragen, zwei herdr-Panes mit je einem Agent zu starten (Python- vs. Rust-Migration); der Haupt-Agent lädt die herdr-Skill, startet beide parallel und liest danach beide Ergebnisse.
13. Pane per Rechtsklick („close pane“) schließen; Beenden mit Ctrl+B, Q; Wiederherstellung mit `her`.
14. Neue Session work anlegen; Wechsel mit `her` bzw. `herdr session.work`.
## Genannte Tools
- herdr — Terminal-Multiplexer für Coding-Agents
- [claude-code-overview](obsidian://open?vault=knowledge-base&file=claude-code-overview) — Coding-Agent, im Video in einem Tab gestartet
- Codex — Coding-Agent, als Integrations-Ziel genannt
- Pi — Coding-Agent ohne eingebaute Sub-Agents
- tmux — klassischer Terminal-Multiplexer; Vergleich für Maussteuerung und Keybindings
- `npx skills add` — klont das Skill-Repository und installiert die Agent-Skill-Datei
- Agent-State-Extension — zeigt Agent-Status (idle, arbeitet, blocked, done)
## Verwandt
- [agent-herdr-script](obsidian://open?vault=knowledge-base&file=agent-herdr-script) — KIMS steuert Agenten über herdr mit diesem Script
- [herdr-cursor-lifecycle-zustand](obsidian://open?vault=knowledge-base&file=herdr-cursor-lifecycle-zustand) — herdr-Zustände idle, working, blocked, done
- [agent-orchestrierung-entscheidung](obsidian://open?vault=knowledge-base&file=agent-orchestrierung-entscheidung) — wann parallele Sub-Agents statt Solo
- [claude-code-skills](obsidian://open?vault=knowledge-base&file=claude-code-skills) — Skill-Dateien als Agent-Fähigkeit
- [[Herdr_ the Tmux for AI Agents]] — andere Vorstellung von herdr als Tmux für Agenten

---

# Fassung B

## Worum es geht

Vorstellung von herdr, einem Terminal-Multiplexer speziell für Coding-Agents (Claude Code, Codex, Pi). Das Video zeigt Installation, Einrichtung und Bedienung — mehrere Agents parallel in Workspaces, Tabs und Panes laufen lassen, ihren Status verfolgen und Sessions wiederherstellen.

## Besprochene Konzepte

- Terminal-Multiplexer für Coding-Agents — herdr verwaltet mehrere Agents nebeneinander im bestehenden Terminal.
- Workspaces — Container, in dem Projekte und ihre Agents gebündelt werden.
- Tabs und Panes — Aufteilung innerhalb eines Workspace; Panes per Split (vertikal/horizontal) für z. B. Dev-Server.
- Agent-States — herdr zeigt pro Agent den Zustand idle, done (fertig) oder blocked (wartet auf Permission).
- Agent-Skill-Datei — gibt dem Coding-Agent die Fähigkeit, herdr selbst zu bedienen und Sub-Agents zu starten.
- Sub-Agent-Orchestrierung — ein Haupt-Agent startet über die herdr-Skill weitere Agents in eigenen Panes und liest deren Ergebnisse zusammen.
- Sessions — vollständig getrennte Umgebungen (z. B. "default" und "work") mit eigenem Zustand.
- Session-Persistenz — Schließen und Wiederherstellen ohne Arbeitsverlust.

## Behauptungen

- Wer mehrere Coding-Agents gleichzeitig laufen lässt, sollte sich herdr ansehen. ([0:00](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=0s))
- Installation ist unkompliziert: Script kopieren, Terminal öffnen, ausführen. ([0:14](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=14s))
- Vor dem Start braucht es zwei Schritte: Integrationen für die genutzten Coding-Agents hinzufügen und die Agent-Skill-Datei installieren. ([0:20](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=20s))
- `npx skills add` klont das Repository und findet die eine Skill-Datei darin. ([0:20](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=20s))
- Die Skill-Installation sollte global erfolgen, weil alle Sessions herdr nutzen sollen. ([0:20](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=20s))
- Eine Session öffnet man mit `her`. ([0:57](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=57s))
- Im Unterschied zu tmux unterstützt herdr Maussteuerung; tmux-Keybindings funktionieren weiterhin. ([1:08](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=68s))
- Neuer Workspace per Klick oder per Prefix Ctrl+B, dann Shift+N. ([1:08](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=68s))
- herdr zeigt an, wenn ein Agent Input braucht, fertig ist oder blockiert ist. ([1:51](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=111s))
- Ein blockierter Agent braucht eine Permission; Auto-Modus verhindert weiteres Nachfragen. ([2:28](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=148s))
- Ctrl+B, Fragezeichen zeigt die verfügbaren Optionen. ([3:13](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=193s))
- Panes: vertikal splitten für seitliche Anordnung, horizontal (Ctrl+B, Minus) für darunter; schließen mit Ctrl+B, X. ([3:13](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=193s))
- Nach dem Schließen des Fensters geht keine Arbeit verloren; erneutes `her` stellt alle Agents mit Status wieder her. ([3:58](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=238s))
- Pi hat standardmäßig keine Sub-Agents, kann das aber über die Agent-Skill-Datei. ([4:50](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=290s))
- Auch nach Beenden per Browser-Schließen oder Ctrl+B, Q bleibt der Zustand erhalten. ([4:50](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=290s))
- Wechsel zwischen Sessions: `her` zur Default-Session, `herdr session.work` zur Work-Session; beide behalten eigenen Zustand. ([5:44](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=344s))
- herdr ist ein Terminal-Multiplexer mit starker Maus-Unterstützung und nativer Unterstützung für Coding-Agents. ([6:17](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=377s))

## Demos / Schritte

1. herdr installieren: Script kopieren, im Terminal ausführen. ([0:14](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=14s))
2. Integrationen für die genutzten Coding-Agents (Codex etc.) unter Quick Start hinzufügen. ([0:20](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=20s))
3. Agent-Skill installieren: GitHub-Autor und Projektname eintragen, `npx skills add` ausführen, alle genutzten Agents auswählen, global installieren. ([0:20](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=20s))
4. Session mit `her` öffnen und unter Workspaces zwei Workspaces anlegen ("agent jiu-jitsu", "coffee cluster"). ([0:57](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=57s))
5. Im ersten Workspace Pi öffnen, neuen Tab anlegen und darin Claude Code starten; im coffee cluster zusätzlich Pi — drei laufende Agents. ([1:51](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=111s))
6. Agent-States prüfen: Status abfragen, blockierten Agent per Permission freigeben, Auto-Modus aktivieren. ([2:28](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=148s))
7. Für einen Dev-Server ein neues Pane splitten und den Server darin starten. ([3:13](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=193s))
8. Fenster schließen und mit `her` die komplette Session inklusive Agents wiederherstellen. ([3:58](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=238s))
9. Sub-Agent-Demo: Pi anweisen, zwei herdr-Panes mit je einem Agent zu starten — einer prüft eine Python-Migration, einer eine Rust-Migration, parallel; danach liest der Haupt-Agent beide Ergebnisse und urteilt. ([4:50](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=290s))
10. Neue Session "work" anlegen und zwischen Default- und Work-Session wechseln. ([5:44](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=344s))

## Genannte Tools

- herdr — Terminal-Multiplexer für Coding-Agents, um den es im Video geht.
- tmux — klassischer Terminal-Multiplexer, gegen den herdr abgegrenzt wird (Maussteuerung, kompatible Keybindings).
- Claude Code — als einer der parallel laufenden Coding-Agents genutzt.
- Codex — Coding-Agent, für den eine Integration hinzugefügt wird.
- Pi — Coding-Agent, der über die Agent-Skill Sub-Agents starten kann.
- npx skills — Kommando (`npx skills add`) zum Installieren der Agent-Skill-Datei.

## Verwandt

- [claude-code-agent-teams](obsidian://open?vault=knowledge-base&file=claude-code-agent-teams) — Claude-Code-Feature, mit dem eine Session mehrere eigenständige Claude-Code-Instanzen koordiniert; verwandtes Muster zum parallelen Betrieb mehrerer Agents.
- [claude-code-agent-teams-praxis](obsidian://open?vault=knowledge-base&file=claude-code-agent-teams-praxis) — Praxis-Erfahrungen, Tips und bekannte Probleme beim Koordinieren mehrerer Agents.
- [sub-agent-steuerung-hooks-und-anti-token-burn](obsidian://open?vault=knowledge-base&file=sub-agent-steuerung-hooks-und-anti-token-burn) — Steuerung von Sub-Agenten und Token-Kosten, relevant zur Sub-Agent-Orchestrierung, die herdr über die Agent-Skill ermöglicht.
