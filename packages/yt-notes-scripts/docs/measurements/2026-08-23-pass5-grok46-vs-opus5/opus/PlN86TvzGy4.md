---
tags:
  - youtube
aliases:
  - "Herdr: Terminal-basierter Rust-Multiplexer für parallele Coding-Agents"
channelName: Better Stack
publish_date: 2026-06-05
display_title: "Herdr: Terminal-basierter Rust-Multiplexer für parallele Coding-Agents"
description: Herdr wird als Rust-Binärdatei vorgestellt, die im bestehenden
  Terminal mehrere KI-Coding-Agenten wie Claude Code, OpenCode und Codex
  gleichzeitig in Fenstern und Tabs verwaltet. Gezeigt werden Installation über
  Brew, curl oder Nix-Flake, tastatur- und mausgesteuerte Navigation ähnlich
  tmux, automatische Statuserkennung der Agenten, Steuerung per Socket-API sowie
  Remote-Betrieb über SSH mit Server-Client-Architektur. Relevant für
  Entwickler, die mehrere KI-Coding-Agenten parallel im Terminal orchestrieren
  wollen, ohne eine separate App wie Warp zu nutzen.
youtube_id: PlN86TvzGy4
---

# herdr: Is This the Ultimate Agent Multiplexer?

## Worum es geht

Vorstellung von Herder, einem Agenten-Multiplexer, der im bestehenden Terminal läuft und mehrere Coding-Agenten nebeneinander in Fenstern/Tabs verwaltet und deren Status anzeigt. Das Video ordnet Herder gegen den klassischen Terminal-Multiplexer tmux ein und zeigt Installation, Bedienung und Remote-Nutzung per SSH.

---

## Notizen

[URL](https://www.youtube.com/watch?v=PlN86TvzGy4)
Was ich mich frage, ist, ob Claude Code dann auch das Effort-Level setzen kann, wenn er, wie im Beispiel, angewiesen ist, ein weiteres Panel von Herdr zu erstellen. Das wäre ja wichtig. Interessant wäre für mich tatsächlich auch bei autonomen Workflows, dass nicht mit Subagenten gearbeitet wird, sondern mit richtigen Claude-Code-CLIs, um gegebenenfalls die Interna der Agenten zu sehen. Wobei ich da aktuell keinen Überblick habe, ob das sich schon mit den getesteten Recherchen mit zum Beispiel tmux und dem experimentellen Flag von Claude Code widerspricht. Also ich will nicht das experimentelle Flag wieder benutzen, weil das andere Probleme hat, aber dass ein Agent andere Agenten spawnt, die ich dann auch vor allem weiter benutzen kann, wäre für Handoff-Sessions sehr interessant und eben für autonome Workflows.

---

## Besprochene Konzepte

- Agenten-Multiplexer — ein Terminal-Werkzeug, das mehrere Coding-Agenten parallel „hütet" und ihren Zustand (arbeitend, blockiert, fertig) sichtbar macht.
- Terminal-Multiplexer — Tabs, geteilte Fenster und Sitzungs-Persistenz über das Trennen der Verbindung hinaus (tmux-Prinzip), erweitert um Agenten-Bewusstsein.
- Einzelne Rust-Binärdatei mit Ratatui — die gesamte Oberfläche rendert nur Text im Terminal, ohne Electron oder separate App.
- Socket-API / Unix-Socket-Architektur — Server und schlanker Client kommunizieren über einen Unix-Socket, wodurch auch Agenten Herder selbst steuern können.
- Server-Client-Trennung bei SSH — Server auf dem entfernten Rechner, Client lokal; Tastatureingaben gehen über den Socket, lokale Config bleibt beim Client.
- Session-Persistenz — Wiederherstellung genau der Arbeitsbereiche und Agenten, die vor dem Beenden offen waren.

## Behauptungen

- Herder läuft innerhalb des Terminals, das man bereits nutzt — kein Electron, keine separate App.
- Herder ist eine einzige mit Ratatui gebaute Rust-Binärdatei, rendert nur Text und läuft überall, wo das Terminal läuft, auch über SSH.
- Herder besitzt eine Socket-API, mit der Agenten Herder selbst steuern können.
- tmux wurde vor Jahrzehnten entwickelt, lange vor KI-Agenten, und hat keine Ahnung, dass ein Agent in einem Fenster existiert oder welchen Status er hat.
- Tools wie Warp oder tmux holen den Benutzer aus seinem gewohnten Terminal heraus und zwingen ihm ein eigenes System auf.
- Herder verbindet die Persistenz von tmux mit integrierter Agentenverwaltung.
- Herder lässt sich mit Brew, curl oder einem Nix-Flake installieren.
- Das Standard-Präfix ist Strg+B (wie bei tmux) und lässt sich ändern.
- Herder erkennt gestartete Agenten automatisch und weist ihnen Status zu (z. B. Claude blockiert, Codex arbeitet).
- Agenten können über die Herder-CLI selbst Arbeitsbereiche, Tabs und Splits erstellen und wieder schließen.
- Beim Neustart kehrt Herder zu genau dem Arbeitsbereich und Agenten mit denselben Sitzungen zurück.
- Über SSH läuft der Server auf dem entfernten Rechner und der Client lokal; mit dem Remote-Flag nutzt der Client die lokalen Config-Einstellungen, während der Server die Dateien des entfernten Rechners zeigt.
- Ohne Remote-Flag werden die lokalen Herder-Konfigurationseinstellungen auf dem Server nicht übernommen.
- Herder bietet viele Themes zur Auswahl, darunter Nord, Gruvbox und Catppuccin.
- Es gibt akustische Benachrichtigungen und ein Toast-Menü, umschaltbar zwischen Terminal und System.
- Weitere Funktionen sind Worktree-Integrationen und offizielle Harness-Integrationen, die dem Harness Zugriff auf offizielle Herder-Skills geben.
- Zum Zeitpunkt der Aufnahme gibt es wegen Unix-Socket und Terminal-PTY keine optimale Windows-Unterstützung; WSL sei nicht genau dasselbe.
- Der Sprecher vermutet, der Entwickler habe das „e" aus „Herder" weggelassen, weil er ein Fan der frühen 2000er sei — er weiß es nicht genau.
- Laut Sprecher ist das Hauptverkaufsargument, dass Herder im bestehenden Terminal funktioniert; er nutzt WezTerm lieber als tmux.
- Der Sprecher vermisst den Session-Browser von tmux, hat ihn aber ohnehin selten benutzt.
- Der Sprecher empfiehlt Windows-Nutzern, Linux im Dual-Boot zu installieren.

## Demos / Schritte

1. Herder installieren (Brew, curl oder Nix-Flake) und mit dem Befehl `herder` starten.
2. Mit Präfix + Umschalt + N neue Arbeitsbereiche erstellen; alternativ per Maus Tabs anlegen, umbenennen, schließen und horizontale/vertikale Splits erzeugen.
3. Shell von Bash auf Fish wechseln, oben Claude Code und unten Codex öffnen — Herder erkennt beide Agenten automatisch und zeigt ihren Status.
4. Den Agenten Verzeichniszugriff und Eingabeaufforderungen geben; Herder aktualisiert den Status sofort auf „arbeitet".
5. Herder mit Präfix + Q beenden und die Optionen der Herder-CLI ansehen; nach Neustart kehrt Herder zum vorherigen Arbeitsbereich zurück.
6. Neuen Arbeitsbereich anlegen, Claude Code öffnen und die Herder-CLI zwei Claude-Code-Fenster erstellen lassen — eines fasst die größte Datei zusammen, das andere sucht nach fest codierten API-Schlüsseln.
7. Ausgaben beider Fenster zusammenfassen lassen und Claude bitten, die Fenster wieder zu schließen.
8. Per SSH auf einen Linux-Server einloggen, Herder dort installieren; die vorherige Remote-Sitzung (OpenCode, Vim) wird wiederhergestellt.
9. Herder mit dem Remote-Flag starten, um die lokale Config gegen den Remote-Server zu nutzen.
10. Über das Menü Themes wechseln (Nord, Gruvbox, Catppuccin) und akustische Benachrichtigungen sowie das Toast-Menü konfigurieren.

## Genannte Tools

- [Claude Code](obsidian://open?vault=knowledge-base&file=claude-code-overview) — Coding-Agent, in der Demo oben im Split geöffnet und von der Herder-CLI mehrfach gestartet.
- Herder — der vorgestellte Agenten-Multiplexer als einzelne Rust-Binärdatei.
- Codex (Codex CLI) — Coding-Agent, in der Demo unten geöffnet und von Herder automatisch erkannt.
- OpenCode — Coding-Agent, in der Remote-SSH-Sitzung geöffnet.
- tmux — klassischer Terminal-Multiplexer, an dem Herder sich orientiert und gegen den es abgegrenzt wird.
- Warp — Terminal, das laut Sprecher den Nutzer in ein eigenes System zwingt.
- WezTerm — Terminal, das der Sprecher bevorzugt und in dem er Herder in einem Tab startet.
- Vim — im Remote-Fenster zum Durchgehen von Code genutzt.
- Ratatui — Rust-Bibliothek, mit der die Herder-Oberfläche gebaut ist.
- Brew / curl / Nix-Flake — Installationswege für Herder.

## Verwandt

- [Claude Code Agent Teams](obsidian://open?vault=knowledge-base&file=claude-code-agent-teams) — Claudes eigenes Feature, um mehrere Agenten zu koordinieren; thematisch verwandt zur Kern-Idee, viele parallele Agenten im Blick zu behalten.
- [Agent-Team (tmux) vs. bounded Task-Tool](obsidian://open?vault=knowledge-base&file=agent-team-vs-task-tool-effort-experiment-2026-07-08) — Experiment, das tmux genau für parallele Agent-Sessions einsetzt — dasselbe Grundproblem, das Herder lösen will.
- [[You're Hardly Using What Claude Code Has to Offer, it's Insane]] — Video, in dem tmux als Terminal-Multiplexer zum Sichtbarmachen paralleler Agent-Sessions genutzt wird.
