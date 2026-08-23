## Nicht gedeckte Aussagen

### Fassung A

- Behauptungen: "Herder erkennt gestartete Agenten automatisch und weist ihnen Status zu (z. B. Claude blockiert, **Codex arbeitet**)." — Das Transkript sagt an dieser Stelle: "Claude ist also blockiert und Codex hat keine Zeit." Der Status "arbeitet" wird erst spaeter vergeben, nachdem Verzeichniszugriff und Eingabeaufforderungen gegeben wurden ("Claude funktioniert, was auch mit Codex CLI funktioniert"). A legt den spaeteren Zustand in das Erkennungs-Beispiel zurueck; der genannte Status ist im Erkennungsmoment falsch.
- Genannte Tools: "Warp — **Terminal**, das laut Sprecher den Nutzer in ein eigenes System zwingt." — Das Transkript sagt nur "Tools wie Warp oder tmux, die den Benutzer aus seinem gewohnten Terminal herausholen und ihn in ihr eigenes System zwingen". Dass Warp ein Terminal ist, steht dort nicht; es ist Weltwissen, keine Transkript-Aussage.
- Demos / Schritte 10: "... und akustische Benachrichtigungen sowie das Toast-Menue **konfigurieren**." — Das Transkript nennt nur, dass es "die Moeglichkeit [gibt], akustische Benachrichtigungen und ein Toast-Menue auszuloesen, zwischen denen Sie innerhalb von Herder ueber das Terminal oder ueber das System wechseln koennen". Ein Konfigurationsschritt wird nicht vorgefuehrt; die Auflistung als Demo-Schritt ist nicht gedeckt.

Zaehlung: A=3

### Fassung B

- Genannte Tools: "WSL — vom Sprecher als Windows-Option genannt, die **nicht denselben Stand habe**." — Das Transkript sagt: "Ja, WSL existiert zwar, aber es ist nicht genau dasselbe, richtig?" "Nicht denselben Stand" behauptet einen Reifegrad-Rueckstand; gesagt ist nur Andersartigkeit.
- Behauptungen: "Die Herder-CLI kann zwei Claude-Code-Fenster mit eigenen Auftraegen oeffnen und **vergibt Titel** wie 'Claude Secrets' und 'Disk Code'." — Das Transkript nennt keinen Urheber: "Wir koennen auch sehen, dass ihnen passende Titel gegeben werden, wie zum Beispiel Claude Secrets und Disk Code." Die Zuschreibung an die CLI ist hinzugefuegt.
- Besprochene Konzepte: "Offizielle Harness-Integrationen — Harnesses bekommen Zugriff auf Herder-Skills und **koennen Sitzungen nach dem Schliessen fortsetzen**." — Das Transkript adressiert den Nutzer, nicht die Harness: "... und es Ihnen erlauben, genau die Sitzungen fortzusetzen, die Sie vor dem Schliessen von Herder begonnen hatten."
- Demos / Schritte 10: "Neuen Workspace anlegen, ins **Projektverzeichnis** wechseln, Claude Code oeffnen." — Das Transkript sagt nur "in ein Verzeichnis wechseln". Die Kennzeichnung als Projektverzeichnis ist ergaenzt.

Zaehlung: B=4

Gewichtung: A hat einen Fund, der einen Demo-Fakt verdreht; B hat vier Funde, die durchweg Zuschreibung oder Wortlaut verschieben, ohne einen Fakt umzukehren.

## Eigene Spekulation

### Fassung A

- Besprochene Konzepte: "Socket-API / Unix-Socket-Architektur — Server und schlanker Client kommunizieren ueber einen Unix-Socket, **wodurch** auch Agenten Herder selbst steuern koennen." — Das Transkript nennt beides getrennt und ohne Kausalitaet: "Es gibt ausserdem eine Socket-API, was bedeutet, dass Agenten Herder selbst steuern koennen" (Abschnitt "Herkunft und Vergleich mit tmux") und "Herder funktioniert also, indem ein Server und ein schlanker Client betrieben werden, die ueber einen Unix-Socket kommunizieren" (Abschnitt "Remote-Nutzung per SSH"). Das "wodurch" ist ein Schluss des Modells.
- Verwandt: "Experiment, das tmux genau fuer parallele Agent-Sessions einsetzt — **dasselbe Grundproblem, das Herder loesen will**." — Der Sprecher zieht diese Gleichsetzung nicht; sie ist eine Deutung des Modells.

Zaehlung: A=2

### Fassung B

- Besprochene Konzepte: "**Unix-Socket**-API — Agenten koennen Herder selbst steuern (Workspaces, Tabs, Splits erzeugen und schliessen)." — Das Transkript spricht an der Stelle nur von einer "Socket-API"; die Gleichsetzung mit dem spaeter beschriebenen Unix-Socket ist ein Schluss des Modells (Spiegelbild von A's erstem Fund).
- Verwandt: "claude-code-agent-teams — parallele Agenten in Claude Code selbst **statt im Multiplexer**." — Die Gegenueberstellung stammt vom Modell, nicht vom Sprecher.

Zaehlung: B=2

Anmerkung: Die Verwandt-Eintraege beider Fassungen begruenden Links; die Begruendung ist notwendigerweise modell-eigen. Beide Fassungen tun dasselbe im selben Umfang, deshalb ist der Punkt symmetrisch und trennt nicht.

## Fehlende wichtige Inhalte

### Fassung A

- Der Name des Entwicklers, Oğulcan Celik. Transkript, Abschnitt "Herkunft und Vergleich mit tmux": "Herder wurde von einem Entwickler namens Oğulcan Celik gebaut". A nennt ihn nirgends.
- Die Namensdeutung als Sprecher-Annahme: "Ich weiss es nicht genau, aber ich nehme an, dass Herder ein Werkzeug ist, mit dem man mehrere Agenten hueten kann, wie einen Schafhirten" (Abschnitt "Herkunft und Vergleich mit tmux"). A benutzt das Bild ("huetet") nur unmarkiert in einer Konzept-Definition, gibt die Annahme aber nicht wieder.
- Das Problem, das Herder adressiert: "Das ist ein Problem fuer die meisten Entwickler, die KI fuer die Entwicklung einsetzen, denn es ist schwierig, den Ueberblick darueber zu behalten, was die einzelnen Agenten gerade tun" (Abschnitt "Herkunft und Vergleich mit tmux"). Fehlt in A.
- Praefix und Fragezeichen zeigt alle Tastenkombinationen: "indem Sie beispielsweise das Praefix und das Fragezeichen druecken, um alle Tastenkombinationen anzuzeigen" (Abschnitt "Installation und Bedienung"). A nennt nur Praefix+Umschalt+N und die Maus.
- Das Ergebnis der CLI-Demo: die vergebenen Titel "Claude Secrets" und "Disk Code" sowie der Nullbefund "Und hier wurden keine fest codierten API-Schluessel gefunden" (Abschnitt "Interaktion mit Coding-Agenten"). A's Schritt 7 nennt nur Zusammenfassen und Schliessen.
- Die konkrete lokale Konfiguration: "Ich habe lediglich die Tastenbelegung von Strg+B auf Strg+Leertaste geaendert und das Design auf Terminal umgestellt" (Abschnitt "Remote-Nutzung per SSH"). A bleibt bei "die lokalen Konfigurationseinstellungen".
- Die Probe im Remote-Modus: "Wenn ich aber Strg+B druecke, scheint nichts zu passieren, da die Konfiguration auf meinem Mac verwendet wird, bei der Strg+Leertaste verwendet wird" (Abschnitt "Remote-Nutzung per SSH"). Genau der Beleg dafuer, dass das Remote-Flag wirkt — fehlt in A.
- Systembenachrichtigungen: "inklusive Systembenachrichtigungen in einer einzigen Rust-Binaerdatei" (Abschnitt "Was ist Herder?"). A nennt nur die Statusanzeige.
- Demo-Schritt: falschen Arbeitsbereich loeschen und den richtigen umbenennen ("Mir ist aufgefallen, dass ich mich im falschen Arbeitsbereich befinde. Loeschen wir also diesen und benennen wir diesen hier um", Abschnitt "Interaktion mit Coding-Agenten"). Fehlt in A's Schrittliste; geringes Gewicht.

Zaehlung: A=9

### Fassung B

Keine. Ich habe das Transkript Abschnitt fuer Abschnitt gegen B geprueft und keinen Punkt gefunden, den B auslaesst und der einem Leser fehlen wuerde; auch alle Inhalte, die A hat, sind in B enthalten.

Zaehlung: B=0

## Praezision

- Codex-Status bei der Erkennung. A: "z. B. Claude blockiert, Codex arbeitet." B: "in der Demo ist Claude blockiert, Codex hat 'keine Zeit'." Das Transkript sagt "Codex hat keine Zeit" — B gibt die (offensichtlich verrauschte) Formulierung in Anfuehrungszeichen wieder, statt sie zu glaetten oder zu ersetzen. B korrekt.
- Ergebnis der CLI-Demo. A: "Ausgaben beider Fenster zusammenfassen lassen und Claude bitten, die Fenster wieder zu schliessen." B: "Titel wie 'Claude Secrets' und 'Disk Code'; im Secrets-Fenster keine fest codierten API-Schluessel; Ausgaben zusammenfassen lassen und beide Fenster schliessen." B praeziser.
- Lokale Konfiguration bei SSH. A: "Ohne Remote-Flag werden die lokalen Herder-Konfigurationseinstellungen auf dem Server nicht uebernommen." B: "Eine lokal auf dem Mac geaenderte Konfiguration (Praefix Strg+Leertaste, Theme 'Terminal') wird bei einer normalen Remote-Installation nicht uebernommen." B nennt, worum es konkret geht.
- Herkunft. A nennt keinen Entwickler. B: "Gebaut hat es Oğulcan Celik." B korrekt und vollstaendiger.
- Warp. A: "Warp — Terminal, das laut Sprecher den Nutzer in ein eigenes System zwingt." B: "Warp — als Beispiel fuer ein System genannt, das aus dem gewohnten Terminal herausfuehrt." B bleibt am Transkript, A ergaenzt eine Kategorie.
- WSL. A: "WSL sei nicht genau dasselbe." B: "WSL — ... die nicht denselben Stand habe." Das Transkript sagt "nicht genau dasselbe". A korrekt, B verschoben.
- Wirkung des Remote-Flags. A: "mit dem Remote-Flag nutzt der Client die lokalen Config-Einstellungen, waehrend der Server die Dateien des entfernten Rechners zeigt." B: dieselbe Aussage plus die Probe "Strg+B tut in der Demo nichts". Gleich korrekt, B mit Beleg.

## Regelverstoesse

### Fassung A

- Sprecher-Spekulation unmarkiert uebernommen. Besprochene Konzepte: "Agenten-Multiplexer — ein Terminal-Werkzeug, das mehrere Coding-Agenten parallel 'huetet'". Das Huete-Bild stammt aus der ausdruecklichen Annahme des Sprechers ("Ich weiss es nicht genau, aber ich nehme an ... wie einen Schafhirten") und haette nach der Regel mit "laut Sprecher" markiert werden muessen. In den Behauptungen markiert A die zweite Sprecher-Spekulation (das weggelassene "e") korrekt — hier nicht.
- Sektionsfolge, Sektionsanlaesse, Sprache, keine Vorrede, keine fremden Ueberschriften: alles regelkonform.

### Fassung B

- Kein Verstoss gefunden. Sektionsfolge korrekt, alle Pflichtsektionen vorhanden, "Demos / Schritte" und "Genannte Tools" haben Anlass, keine Vorrede, keine fremde Ueberschrift, durchgehend deutsch, Sprecher-Spekulationen ("vermutet", "nimmt an", "meint", "nach eigener Aussage") sind markiert.
- Grenzfall ohne Verstoss: "Electron — ausdruecklich nicht genutzt" unter "Genannte Tools". Electron wird im Transkript genannt, wenn auch als Negativabgrenzung; die Sektion ist damit formal gedeckt.

## Urteil

- Treue: gleichwertig — A hat drei, B vier nicht gedeckte Stellen; A's einziger schwerer Fund (verdrehter Agenten-Status) und B's vier leichte Verschiebungen (Zuschreibung, Wortlaut) wiegen zusammengenommen etwa gleich.
- Vollstaendigkeit: B besser — A fehlen neun im Transkript belegte Punkte, darunter der Entwicklername, das adressierte Problem und das Ergebnis der CLI-Demo; in B fehlt keiner.
- Praezision: B besser — in fuenf von sieben verglichenen Stellen ist B naeher am Wortlaut oder konkreter, A ist nur bei WSL praeziser.
- Regeltreue: B besser — A uebernimmt eine Sprecher-Annahme unmarkiert als Definition, B haelt alle Sektions- und Markierungsvorgaben ein.
