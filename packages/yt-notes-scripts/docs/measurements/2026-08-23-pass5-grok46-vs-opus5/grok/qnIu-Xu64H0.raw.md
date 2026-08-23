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
