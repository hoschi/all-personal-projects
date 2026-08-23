---
tags:
  - youtube
aliases:
  - "Herdr: Terminal-Multiplexer für parallele Coding-Agents"
channelName: Jilles
publish_date: 2026-06-29
display_title: "Herdr: Terminal-Multiplexer für parallele Coding-Agents"
description: herdr, ein Terminal-Multiplexer, verwaltet mehrere gleichzeitig
  laufende Coding-Agents (Claude Code, Codex, Pi) in einer Terminal-Oberfläche.
  Gezeigt werden Installation, Integrationen und Agent-Skill-Setup, Workspaces
  mit Maussteuerung, Tabs und Panes, Agent-Status-Anzeige (idle/done/blocked),
  Session-Wiederherstellung sowie das Starten von Sub-Agents aus Pi heraus über
  die herdr-Skill. Relevant für Entwickler, die mehrere Coding-Agents parallel
  orchestrieren und Session-Zustände über Neustarts hinweg oder getrennt nach
  Projekt (Arbeit/privat) verwalten wollen.
youtube_id: qnIu-Xu64H0
---

# Herdr in about 6 minutes

## Worum es geht

Vorstellung von herdr, einem Terminal-Multiplexer speziell für Coding-Agents (Claude Code, Codex, Pi). Das Video zeigt Installation, Einrichtung und Bedienung — mehrere Agents parallel in Workspaces, Tabs und Panes laufen lassen, ihren Status verfolgen und Sessions wiederherstellen.

---

## Notizen

[URL](https://www.youtube.com/watch?v=qnIu-Xu64H0)
In dem Video wird die UI etwas besser erklärt. Ich bin noch nicht fertig mit dem Gucken, aber zu meinem aktuellen Setup, was drei Ghosty-Terminals sind, die ein Drittel des Monitor-Space einnehmen, damit ich sehen kann, was die anderen Agenten gerade machen und leicht wechseln kann: Würde ich hier mit Tabs arbeiten pro Session, wobei eine Session ein Mac-Space ist und mehrere Agenten bzw. Tabs bzw. Panes in Tabs dann meine drei Terminal-Windows wären, bzw. mehr, aber ich kann halt immer drei sehen, bzw. nur eins, wenn ich die VS-Code-IDE aufhabe. Ich sehe durch die Seitenleiste in herdr immer noch, welcher Agent meine Aufmerksamkeit benötigt bzw. fertig ist. Was ich verliere, wäre die Möglichkeit zu sehen, was die verschiedenen Agenten machen, ohne dass ich die Tabs immer wechseln muss. Einen Mac-Space pro Aufgabenfeld bzw. was herdr Workspace nennt, brauche ich meistens trotzdem noch, da weiteres Material wie Browser-Tabs für Figma und der ganze Kram auch irgendwo leben müssen. Was mit herdr besser funktioniert, sind diese kleinen Sidecar-Agenten, die Meta-Dinge im autonomen Workflow fixen oder sowas, da ich hierfür keine Dokumentation brauche. Was mit herdr besser funktioniert, ist den Überblick über mehrere Workspaces zu haben, da die auch farbcodiert sind, ob hier ein Agent blockiert oder fertig ist. Das fehlt aktuell bei Mac-Spaces. Hier muss ich immer zu dem Space wechseln, um zu sehen, wie der Status ist, oder meinen Verstärker anmachen, damit ich einen Ton höre, wenn ein anderer Agent fertig ist, damit ich die Notification rechts oben sehe und gegebenenfalls dahin wechsle. Wobei das bei Ghostty tatsächlich buggy war, da ich manchmal keine Notification bekommen habe. Außerdem kann die Notification nicht unterscheiden zwischen blockiert und fertig. Wenn das Attachen von Sessions so funktioniert wie bei tmux, kann ich ja auch ein Terminal pro Mac-Space haben. Möchte ich schnell zu einer anderen Session wechseln, ohne den Mac-Space wechseln zu müssen, kann ich das trotzdem im gleichen Terminal machen. Ich sehe aber dann immer noch, welche Workspaces blockiert sind oder nicht.

---

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
