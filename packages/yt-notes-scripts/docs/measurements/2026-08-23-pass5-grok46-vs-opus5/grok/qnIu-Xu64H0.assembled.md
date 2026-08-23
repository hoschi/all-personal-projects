# Herdr in about 6 minutes

## Worum es geht

Vorstellung von herdr, einem Terminal-Multiplexer für Coding-Agents (Claude Code, Codex, Pi). Das Video zeigt Installation, Workspaces, Tabs und Panes, Agent-Status, Session-Wiederherstellung und parallele Sub-Agents über die herdr-Skill.

---

## Notizen

[URL](https://www.youtube.com/watch?v=qnIu-Xu64H0)
In dem Video wird die UI etwas besser erklärt. Ich bin noch nicht fertig mit dem Gucken, aber zu meinem aktuellen Setup, was drei Ghosty-Terminals sind, die ein Drittel des Monitor-Space einnehmen, damit ich sehen kann, was die anderen Agenten gerade machen und leicht wechseln kann: Würde ich hier mit Tabs arbeiten pro Session, wobei eine Session ein Mac-Space ist und mehrere Agenten bzw. Tabs bzw. Panes in Tabs dann meine drei Terminal-Windows wären, bzw. mehr, aber ich kann halt immer drei sehen, bzw. nur eins, wenn ich die VS-Code-IDE aufhabe. Ich sehe durch die Seitenleiste in herdr immer noch, welcher Agent meine Aufmerksamkeit benötigt bzw. fertig ist. Was ich verliere, wäre die Möglichkeit zu sehen, was die verschiedenen Agenten machen, ohne dass ich die Tabs immer wechseln muss. Einen Mac-Space pro Aufgabenfeld bzw. was herdr Workspace nennt, brauche ich meistens trotzdem noch, da weiteres Material wie Browser-Tabs für Figma und der ganze Kram auch irgendwo leben müssen. Was mit herdr besser funktioniert, sind diese kleinen Sidecar-Agenten, die Meta-Dinge im autonomen Workflow fixen oder sowas, da ich hierfür keine Dokumentation brauche. Was mit herdr besser funktioniert, ist den Überblick über mehrere Workspaces zu haben, da die auch farbcodiert sind, ob hier ein Agent blockiert oder fertig ist. Das fehlt aktuell bei Mac-Spaces. Hier muss ich immer zu dem Space wechseln, um zu sehen, wie der Status ist, oder meinen Verstärker anmachen, damit ich einen Ton höre, wenn ein anderer Agent fertig ist, damit ich die Notification rechts oben sehe und gegebenenfalls dahin wechsle. Wobei das bei Ghostty tatsächlich buggy war, da ich manchmal keine Notification bekommen habe. Außerdem kann die Notification nicht unterscheiden zwischen blockiert und fertig. Wenn das Attachen von Sessions so funktioniert wie bei tmux, kann ich ja auch ein Terminal pro Mac-Space haben. Möchte ich schnell zu einer anderen Session wechseln, ohne den Mac-Space wechseln zu müssen, kann ich das trotzdem im gleichen Terminal machen. Ich sehe aber dann immer noch, welche Workspaces blockiert sind oder nicht.

---

---

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

- Wer mehrere Coding-Agents gleichzeitig laufen lässt (Claude Code, Codex, Pi), sollte sich herdr ansehen. ([0:00](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=0s))
- Die Installation ist unkompliziert: Script kopieren, Terminal öffnen, ausführen. ([0:14](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=14s))
- Vor dem Start Integrationen für die genutzten Coding-Agents hinzufügen und die Agent-Skill-Datei einrichten. ([0:20](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=20s))
- `npx skills add` klont das Repository und findet die eine Skill-Datei darin. ([0:20](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=20s))
- Die Skill global installieren, weil alle Sessions herdr nutzen sollen. ([0:20](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=20s))
- Eine Session öffnen: `her` eingeben. ([0:57](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=57s))
- Im Unterschied zu tmux unterstützt herdr Maussteuerung; tmux-Keybindings funktionieren weiterhin. ([1:08](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=68s))
- Neuer Workspace per Klick oder Prefix Ctrl+B, dann Shift+N. ([1:08](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=68s))
- herdr zeigt an, wenn ein Agent Input braucht, fertig ist oder blockiert ist. ([1:51](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=111s))
- Status blocked bedeutet, der Agent braucht eine Permission. ([2:28](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=148s))
- Auto-Modus sorgt dafür, dass nicht mehr nachgefragt wird. ([2:28](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=148s))
- Prefix Ctrl+B, Fragezeichen zeigt die Optionen. ([3:13](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=193s))
- Vertikal splitten ordnet Panes nebeneinander, horizontal darunter — Prefix plus Minus (Ctrl+B, Minus). ([3:13](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=193s))
- Panes schließen mit Ctrl+B, X. ([3:13](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=193s))
- Fenster schließen verliert die Arbeit nicht; erneutes `her` stellt alles wieder her, inklusive laufender Agents mit Status idle/done. ([3:58](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=238s))
- Pi hat standardmäßig keine Sub-Agents, kann das aber über die Agent-Skill-Datei. ([4:50](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=290s))
- Der Haupt-Agent kann über die herdr-Skill zwei weitere Panes/Agents parallel starten und danach beide Ergebnisse lesen. ([4:50](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=290s))
- Auch nach Beenden (Browser schließen oder Ctrl+B, Q) bleibt nichts verloren. ([4:50](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=290s))
- Eine neue Session (z. B. work) ist komplett getrennt von der Default-Session; beide behalten ihren eigenen Zustand. ([5:44](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=344s))
- Wechsel zur Default-Session über `her`, zur Work-Session über `herdr session.work`. ([5:44](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=344s))
- herdr ist ein Terminal-Multiplexer mit starker Maus-Unterstützung und nativer Unterstützung für Coding-Agents. ([6:17](https://www.youtube.com/watch?v=qnIu-Xu64H0&t=377s))

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
