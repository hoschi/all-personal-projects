## Worum es geht
Hands-on-Vorstellung von Herder, einem Agenten-Multiplexer, der im bestehenden Terminal läuft und mehrere Coding-Agenten in Workspaces, Tabs und Splits verwaltet, inklusive Statusanzeige, Sitzungs-Persistenz und SSH-Remote. Der Sprecher vergleicht Herder mit tmux und zeigt Installation, Bedienung, Agenten-Steuerung und Themes.
## Besprochene Konzepte
- Agenten-Multiplexer — mehrere Coding-Agenten nebeneinander in Fenstern oder Tabs, mit sichtbarem Arbeits-, Blockade- und Fertig-Status.
- Terminal-Multiplexer — Tabs, Splits und persistente Sitzungen nach Verbindungsabbruch, am Vorbild tmux.
- Agenten-Statusbewusstsein — der Multiplexer erkennt Agenten und deren Zustand, anders als ein klassischer Terminal-Multiplexer.
- Eine Rust-Binärdatei im bestehenden Terminal — Text-Rendering statt Electron oder eigener App, daher auch über SSH lauffähig.
- Unix-Socket-API — Agenten können Herder selbst steuern (Workspaces, Tabs, Splits erzeugen und schließen).
- Client-Server über Unix-Socket — Client sendet Tastatureingaben, Server verwaltet Tabs, Panes und Persistenz.
- SSH-Remote mit lokalem Client — Server auf dem entfernten Rechner, Client lokal, lokale Tastenbelegung und Themes bleiben erhalten.
- Offizielle Harness-Integrationen — Harnesses bekommen Zugriff auf Herder-Skills und können Sitzungen nach dem Schließen fortsetzen.
- Worktree-Integrationen — vom Sprecher genannt, in der Demo nicht ausgeführt.
- Prefix-Bedienung — Standardpräfix Strg+B analog zu tmux, umbelegbar; Navigation per Tastatur und Maus.
## Behauptungen
- Herder ist ein Agenten-Multiplexer im bereits genutzten Terminal, als eine Rust-Binärdatei, ohne Electron oder separate App.
- Man sieht, welcher Agent arbeitet, blockiert oder fertig ist, inklusive Systembenachrichtigungen.
- Herder funktioniert über SSH.
- Gebaut hat es Oğulcan Celik.
- Der Sprecher vermutet, der Entwickler habe das „e“ aus „Herder“ weggelassen, weil er Fan der frühen 2000er sei; er weiß es nicht genau.
- Der Sprecher nimmt an, der Name spiele darauf an, mehrere Agenten zu hüten wie ein Schafhirte.
- Für die meisten Entwickler mit KI in der Entwicklung ist es schwierig, den Überblick zu behalten, was die einzelnen Agenten tun.
- Herder orientiert sich stark an tmux (Tabs, geteilte Fenster, Sitzungen nach dem Trennen).
- tmux entstand lange vor KI-Agenten; ein Agent in einem tmux-Fenster ist tmux unbekannt, einschließlich seines Status.
- Tools wie Warp oder tmux holen den Benutzer aus dem gewohnten Terminal in ihr eigenes System.
- Herder verbindet die Persistenz von tmux mit integrierter Agentenverwaltung.
- Weil Herder mit Ratatui nur Text im Terminal zeichnet, läuft es überall dort, wo das Terminal läuft, auch über SSH.
- Es gibt eine Socket-API, über die Agenten Herder selbst steuern können.
- Installation geht per Brew, curl oder Nix-Flake; der Sprecher ist froh über die Nix-Option.
- Das Standardpräfix ist Strg+B, analog zu tmux, und lässt sich ändern.
- Navigation geht ausschließlich per Tastatur (Präfix und Fragezeichen zeigt Tastenkombinationen) oder per Maus.
- Herder erkennt Agenten automatisch und weist Status zu; in der Demo ist Claude blockiert, Codex hat „keine Zeit“.
- Nach Verzeichniszugriff und Eingabeaufforderungen aktualisiert Herder den Status (Claude arbeitet); das gilt auch für Codex CLI.
- Agenten können Workspaces, Tabs und Splits erzeugen.
- Nach Beenden mit Präfix+Q stellt ein erneuter Start denselben Workspace, denselben Agenten und dieselben Sitzungen wieder her.
- Die Herder-CLI kann zwei Claude-Code-Fenster mit eigenen Aufträgen öffnen und vergibt Titel wie „Claude Secrets“ und „Disk Code“.
- Ein Agent kann die Ausgabe beider Fenster zusammenfassen und die Fenster schließen lassen.
- Auf einem Linux-Server per SSH wird die vorherige Sitzung wiederhergestellt (in der Demo OpenCode und Vim).
- Eine lokal auf dem Mac geänderte Konfiguration (Präfix Strg+Leertaste, Theme „Terminal“) wird bei einer normalen Remote-Installation nicht übernommen.
- Mit dem Remote-Flag läuft der Server auf dem entfernten Rechner und der Client lokal; Tastatureingaben gehen über einen Unix-Socket, der Server zeigt Dateien auf dem Remote-Rechner, der Client nutzt die lokale Konfiguration.
- Im Remote-Modus wirkt das lokale Präfix (Strg+Leertaste); Strg+B tut in der Demo nichts.
- Es gibt Themes, darunter Nord, Gruvbox und Catppuccin.
- Akustische Benachrichtigungen und ein Toast-Menü lassen sich zwischen Terminal und System umschalten.
- Weitere genannte Funktionen: Worktree-Integrationen, offizielle Harness-Integrationen, Herder-Skills für die Harness, Fortsetzen begonnener Sitzungen.
- Für den Sprecher ist das Hauptverkaufsargument, dass Herder im bestehenden Terminal läuft; er nutzt WezTerm lieber als tmux und startet Herder in einem WezTerm-Tab.
- Den Session-Browser von tmux vermisst er, hat ihn aber nach eigener Aussage selten genutzt.
- Zum Aufnahmezeitpunkt gibt es wegen Unix-Sockets und Terminal-PTY keine optimale Windows-Unterstützung.
- Der Sprecher meint, Windows-Nutzer sollten Linux im Dual-Boot installieren; WSL existiere, sei aber nicht dasselbe.
## Demos / Schritte
1. Herder nach der Installation (Brew, curl oder Nix-Flake) starten: Ansicht mit Terminal, Workspaces und Agenten.
2. Ohne vorhandene Workspaces: Präfix Strg+B, Umschalt+N erzeugt einen neuen Workspace.
3. Präfix und Fragezeichen zeigt alle Tastenkombinationen; alternativ Mausbedienung.
4. Per Maus: Tab „zwei“ anlegen, Tab per Rechtsklick schließen, Workspace umbenennen, neuen Workspace anlegen, Einstellungen öffnen, horizontal und vertikal splitten, Bereiche umbenennen und dazwischen wechseln.
5. Shells von Bash auf Fish umstellen; oben Claude Code, unten Codex öffnen.
6. Herder erkennt beide Agenten und zeigt Status (Claude blockiert, Codex „keine Zeit“).
7. Verzeichniszugriff gewähren, Prompts setzen (unter anderem zum Modell); Status wechselt auf arbeitend, auch bei Codex CLI.
8. Falschen Workspace löschen, den richtigen umbenennen.
9. Mit Präfix+Q beenden; CLI-Optionen ansehen; erneuter Start stellt Workspace, Agenten und Sitzungen wieder her.
10. Neuen Workspace anlegen, ins Projektverzeichnis wechseln, Claude Code öffnen.
11. Per Herder-CLI zwei Claude-Code-Fenster starten: größte Datei zusammenfassen bzw. Quellcode nach fest codierten API-Schlüsseln oder Geheimnissen durchsuchen.
12. Titel wie „Claude Secrets“ und „Disk Code“; im Secrets-Fenster keine fest codierten API-Schlüssel; Ausgaben zusammenfassen lassen und beide Fenster schließen.
13. Per SSH auf einem Linux-Server Herder wie auf dem Mac installieren; vorherige Sitzung mit OpenCode und Vim kommt zurück.
14. Zeigen, dass lokale Mac-Config (Strg+Leertaste, Theme Terminal) dort nicht gilt.
15. Herder mit Remote-Flag per SSH starten: Server remote, Client lokal; Strg+B wirkt nicht, weil lokal Strg+Leertaste das Präfix ist.
16. Themes wechseln (Nord, Gruvbox, Catppuccin); akustische Benachrichtigungen und Toast zwischen Terminal und System umschalten.
## Genannte Tools
- Herder — Agenten-Multiplexer im bestehenden Terminal.
- tmux — klassischer Terminal-Multiplexer, Vergleichsmaßstab ohne Agenten-Status.
- Warp — als Beispiel für ein System genannt, das aus dem gewohnten Terminal herausführt.
- Ratatui — TUI-Bibliothek, mit der Herder Text im Terminal zeichnet.
- Rust — Sprache der einzelnen Binärdatei.
- Electron — ausdrücklich nicht genutzt.
- [[brew]] — einer der Installationswege.
- curl — alternativer Installationsweg.
- Nix-Flake — dritter genannter Installationsweg.
- Bash — Ausgangs-Shell in der Demo.
- Fish — Ziel-Shell in der Demo.
- [claude-code-overview](obsidian://open?vault=knowledge-base&file=claude-code-overview) — Coding-Agent, den Herder erkennt und den die CLI in mehreren Fenstern startet.
- Codex CLI — zweiter Coding-Agent in der lokalen Demo.
- OpenCode — Agent auf dem Linux-Server in der SSH-Demo.
- [[neovim - vim]] — Editor neben OpenCode in der Remote-Sitzung.
- WezTerm — Terminal, in dem der Sprecher Herder lieber startet als tmux zu nutzen.
- WSL — vom Sprecher als Windows-Option genannt, die nicht denselben Stand habe.
## Verwandt
- [[Herdr in about 6 minutes]] — weitere herdr-Einführung zu Installation, Workspaces und Agenten-Status.
- [[This Tmux _Rewrite_ Is Actually Brilliant]] — Hands-on-Review von Herder gegen tmux.
- [[Herdr_ the Tmux for AI Agents]] — Herder als Terminal-Multiplexer für KI-Agenten.
- [agent-herdr-script](obsidian://open?vault=knowledge-base&file=agent-herdr-script) — KIMS-Steuerung interaktiver Agenten über herdr.
- [herdr-rename-pane-slash-command](obsidian://open?vault=knowledge-base&file=herdr-rename-pane-slash-command) — herdr-Sidebar und Pane-Titel im KIMS-Betrieb.
- [claude-code-agent-teams](obsidian://open?vault=knowledge-base&file=claude-code-agent-teams) — parallele Agenten in Claude Code selbst statt im Multiplexer.
- [kims-git-worktree-setup](obsidian://open?vault=knowledge-base&file=kims-git-worktree-setup) — Git-Worktrees; Herder nennt Worktree-Integrationen.
