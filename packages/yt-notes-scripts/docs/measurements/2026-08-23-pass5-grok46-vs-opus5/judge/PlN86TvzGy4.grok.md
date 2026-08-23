## Nicht gedeckte Aussagen
### Fassung A
- **Besprochene Konzepte** (`/tmp/claude/p5/j-PlN86TvzGy4.md:149`): „Server und schlanker Client kommunizieren über einen Unix-Socket, wodurch auch Agenten Herder selbst steuern können.“ Das Transkript trennt zwei Dinge: die Socket-API, „was bedeutet, dass Agenten Herder selbst steuern können“ (`:102`), und den Unix-Socket zwischen Client und Server für Tastatureingaben, Tabs, Bereiche und Persistenz (`:122`). Den Agenten-Steuerweg als Folge der Client-Server-Socket-Architektur gibt das Transkript nicht her.
- **Behauptungen** (`:163`): „weist ihnen Status zu (z. B. Claude blockiert, Codex arbeitet)“. Bei der automatischen Erkennung ist Claude blockiert und „Codex hat keine Zeit“ (`:112`). „Arbeitet“/„Claude funktioniert“ kommt erst nach Verzeichniszugriff und Prompts (`:112`).
- **Behauptungen** (`:164`): „Agenten können über die Herder-CLI selbst Arbeitsbereiche, Tabs und Splits erstellen und wieder schließen.“ Anlegen von Arbeitsbereichen, Registerkarten und Splits steht so (`:114`); das Schließen läuft über „Claude dann bitten, sie zu schließen“ (`:116`), nicht über die Herder-CLI.
### Fassung B
- **Besprochene Konzepte** (`:220`): „Unix-Socket-API — Agenten können Herder selbst steuern (Workspaces, Tabs, Splits erzeugen und schließen).“ Im Transkript heißt es „Socket-API“ (`:102`) und getrennt „Unix-Socket“ für Client/Server (`:122`). Erzeugen von Arbeitsbereichen, Registerkarten und Splits steht in `:114`; Schließen über die Socket-API steht dort nicht.
- **Behauptungen** (`:247`): „Die Herder-CLI kann zwei Claude-Code-Fenster … öffnen und vergibt Titel wie „Claude Secrets“ und „Disk Code“.“ Die CLI öffnet die Fenster (`:116`); die Titel stehen nur im Passiv („ihnen passende Titel gegeben werden“, `:116`), nicht als Leistung der CLI.
- **Besprochene Konzepte** (`:223`): „Harnesses bekommen Zugriff auf Herder-Skills und können Sitzungen nach dem Schließen fortsetzen.“ Das Transkript gibt dem Harness den Skill-Zugriff und „Ihnen“ (dem Nutzer) das Fortsetzen der Sitzungen (`:128`).
Zaehlung: A=3 B=3
## Eigene Spekulation
### Fassung A
- „wodurch auch Agenten Herder selbst steuern können“ (`:149`) — kausaler Schluss, den der Sprecher so nicht zieht (`:102` vs. `:122`).
### Fassung B
- Die Klammer „Workspaces, Tabs, Splits erzeugen und schließen“ an der Socket-API (`:220`) — fasst Steuerung, Erzeugen (`:114`) und späteres Schließen (`:116`) zu einer API-Leistung zusammen.
Zaehlung: A=1 B=1
Annahme: Texte unter **Verwandt** zählen hier nicht; Links sind laut Auftrag erlaubt, ihre Form ist nicht Gegenstand.
## Fehlende wichtige Inhalte
### Fassung A
- Entwicklername Oğulcan Celik — fehlt; Transkript `:100`.
- Systembenachrichtigungen — fehlen; Transkript `:96`.
- Motiv: für die meisten KI-Entwickler ist der Überblick über einzelne Agenten schwierig — fehlt; Transkript `:100`.
- Präfix + Fragezeichen zeigt alle Tastenkombinationen — fehlt; Transkript `:108`.
- Lokale Mac-Config konkret: Präfix Strg+Leertaste, Design „Terminal“ — fehlt (nur generelles Nicht-Übernehmen); Transkript `:120`.
- Remote-Demo: Strg+B tut nichts, weil lokal Strg+Leertaste gilt — fehlt; Transkript `:124`.
- Fenstertitel „Claude Secrets“ und „Disk Code“ — fehlen; Transkript `:116`.
- Ergebnis der Secrets-Suche: keine fest codierten API-Schlüssel — fehlt; Transkript `:116`.
- Nach dem Schließen erscheint unten eine Zusammenfassung — fehlt; Transkript `:116`.
### Fassung B
- Nach dem Schließen erscheint unten eine Zusammenfassung — fehlt; Transkript `:116`.
Zaehlung: A=9 B=1
## Praezision
- Auto-Status: A „Claude blockiert, Codex arbeitet“ (`:163`) vs. B „Claude blockiert, Codex hat „keine Zeit““ (`:243`) — B entspricht `:112`.
- Lokale Config auf SSH ohne Remote-Flag: A nur „nicht übernommen“ (`:167`) vs. B mit Strg+Leertaste und Theme „Terminal“ (`:250`) — B näher an `:120`.
- Wirkung Remote-Flag: A beschreibt die Architektur (`:166`) vs. B zusätzlich „Strg+B tut in der Demo nichts“ (`:252`) — B näher an `:124`.
- Fenster schließen: A „Claude bitten, die Fenster wieder zu schließen“ (`:186`) vs. B „Ein Agent kann … die Fenster schließen lassen“ (`:248`) — A näher an `:116`.
- Nix: A nur Installationsweg (`:161`) vs. B „der Sprecher ist froh über die Nix-Option“ (`:240`) — B näher an `:106`.
- WezTerm: A „nutzt WezTerm lieber als tmux“ (`:173`) vs. B plus Start in einem WezTerm-Tab (`:256`) — B näher an `:132`.
- tmux-Alter: A „vor Jahrzehnten … lange vor KI-Agenten“ (`:158`) vs. B nur „lange vor KI-Agenten“ (`:235`) — A näher an `:102`.
- Harness vs. Session-Resume: A hält Skills am Harness und Persistenz getrennt (`:170`, `:165`) vs. B vermengt das in den Konzepten (`:223`) — A näher an `:128`.
## Regelverstoesse
### Fassung A
- keine
### Fassung B
- keine
Beide haben die Sektionen in der Vorgabe-Reihenfolge, „Worum es geht“ in zwei Sätzen, Deutsch mit Original-Produktnamen, keine Vorrede, Demo- und Tools-Sektion mit Anlass.
## Urteil
- Treue: B besser — gleiche Fundzahl, aber A verdreht den zentralen Demo-Status von Codex; B zieht vor allem benachbarte Transkriptstellen zusammen.
- Vollstaendigkeit: B besser — A lässt Entwickler, Systembenachrichtigungen, Motiv, Tastenkürzel-Hilfe, konkrete Remote-Config und mehrere Demo-Ergebnisse weg; B nur die Abschluss-Zusammenfassung.
- Praezision: B besser — Status, Mac-Config, Remote-Präfix, Nix-Freude und WezTerm-Workflow sind in B wortnäher; A bleibt nur bei Schließen-Bitte, tmux-„vor Jahrzehnten“ und der Trennung Harness/Persistenz genauer.
- Regeltreue: gleichwertig — beide erfüllen die Sektionsvorgaben ohne Verstoß.
## Annahmen
- Zeilenangaben beziehen sich auf `/tmp/claude/p5/j-PlN86TvzGy4.md` (Transkript und beide Fassungen in einer Datei).
- Wikilink-Titel unter **Verwandt** und **Genannte Tools** (z. B. `neovim - vim`) gelten als Linkform, nicht als inhaltliche Aussage.
- Demo-Kürze zählt nur, wenn ein benannter Inhalt fehlt, nicht als Qualitätsmangel an sich.
