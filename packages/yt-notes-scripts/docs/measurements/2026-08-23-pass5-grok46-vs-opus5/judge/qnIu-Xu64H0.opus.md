## Nicht gedeckte Aussagen

### Fassung A

- Sektion "Genannte Tools": "Agent-State-Extension — zeigt Agent-Status (idle, arbeitet, blocked, done)". Das Transkript schreibt der Extension nur die Anzeige eines **idle** Agents zu (1:51: "links zeigt die Agent-State-Extension einen idle Agent"). Die uebrigen Zustaende werden dort herdr allgemein zugeschrieben ("herdr zeigt an, wenn ein Agent Input braucht, fertig ist oder blockiert ist"), nicht der Extension. Die volle Zustandsliste als Leistung der Extension steht so nicht im Transkript.

Sonst keine Funde: die uebrigen Aussagen in A sind alle woertlich auf Transkript-Stellen zurueckfuehrbar.

Zaehlung: A=1

### Fassung B

- Sektion "Demos / Schritte", Schritt 6: "blockierten Agent per Permission freigeben". Das Transkript sagt bei 2:28 nur, dass ein dritter Agent den Status "blocked" zeigt und eine Permission braucht; dass die Permission erteilt und der Agent freigegeben wurde, steht dort nicht. Danach folgt im Transkript nur "Auto-Modus aktiviert, damit nicht mehr nachgefragt wird".

Sonst keine Funde. Grenzfall geprueft und **nicht** gezaehlt: "Workspaces — Container, in dem Projekte und ihre Agents gebuendelt werden" (Konzepte). Das Transkript sagt bei 1:08 "Workspaces — hier Projekte hinzufuegen"; dass Agents in den Workspaces laufen, zeigt es bei 1:51 ausdruecklich (Pi und Claude Code im ersten Workspace, Pi im coffee cluster). Die Aussage ist damit gedeckt, wenn auch verallgemeinert.

Zaehlung: B=1

## Eigene Spekulation

### Fassung A

- Keine Funde. Kein "vermutlich", kein "daraus folgt", keine Vorausschau; alle Kausal- und Zweckaussagen ("weil alle Sessions herdr nutzen sollen", "braucht eine Permission") stammen aus dem Transkript selbst.

### Fassung B

- Keine Funde. Der Konzeptname "Sub-Agent-Orchestrierung" ist eine Etikettierung des bei 4:50 Gezeigten, keine eigene Deutung; eigene Schluesse oder Vorausschau kommen nicht vor.

Zaehlung: A=0 B=0

## Fehlende wichtige Inhalte

### Fassung A

- Das Urteil des Haupt-Agents am Ende der Sub-Agent-Demo. Transkript 4:50: "Nach Abschluss liest der Haupt-Agent beide Ergebnisse und liefert das Urteil, welche Migration einfacher ist." A endet in Behauptungen und in Schritt 12 bei "liest danach beide Ergebnisse" — das Ergebnis der Demo fehlt.
- Die Benachrichtigung ueber einen fertigen Agent. Transkript 2:28: "Benachrichtigung meldet einen fertigen Agent." A nennt nur die Status-Anzeige, nicht die Benachrichtigung.
- Dass der blockierte Agent in einem Pane statt in einem Tab lief. Transkript 2:28: "Ein dritter Agent (in einem Pane statt Tab) zeigt Status 'blocked'."

Zaehlung: A=3

### Fassung B

- Die Agent-State-Extension als benannte Komponente. Transkript 1:51: "links zeigt die Agent-State-Extension einen idle Agent." B nennt sie weder in Konzepten noch in Tools.
- Der Zustand "arbeitet". Transkript 2:28 zeigt zweimal einen arbeitenden Agent ("arbeitet", "arbeitet ebenfalls"). B listet in Konzepten nur "idle, done (fertig) oder blocked (wartet auf Permission)".
- Panes per Rechtsklick schliessen. Transkript 4:50: "Panes lassen sich per Rechtsklick ('close pane') schliessen." Bei B fehlt das ganz.
- Der Wechsel zwischen Agents per Klick. Transkript 1:51: "Zwischen Agents per Klick wechseln." B erwaehnt Maussteuerung nur allgemein in der tmux-Abgrenzung.
- Dass beliebig viele neue Tabs moeglich sind. Transkript 3:13: "Tabs (beliebig viele neue Tabs)". B sagt nur "Tabs und Panes — Aufteilung innerhalb eines Workspace".
- Die Benachrichtigung ueber einen fertigen Agent. Transkript 2:28, wie bei A.
- Dass der blockierte Agent in einem Pane statt in einem Tab lief. Transkript 2:28, wie bei A.

Zaehlung: B=7

In beiden Fassungen fehlt zusaetzlich, dass "agent jiu-jitsu" ein selbstgebauter Jiu-Jitsu-Agent ist (1:08). Fuer das Verstaendnis von herdr ist das entbehrlich, deshalb oben nicht mitgezaehlt.

## Praezision

- Agent-Zustaende. A: "Agent-Zustaende — idle, arbeitet, done, blocked (Permission noetig)". B: "herdr zeigt pro Agent den Zustand idle, done (fertig) oder blocked (wartet auf Permission)". Das Transkript zeigt bei 2:28 zusaetzlich arbeitende Agents — A trifft die Zustandsmenge genauer.
- Wiederherstellung. A: "erneutes `her` stellt alles wieder her, inklusive laufender Agents mit Status idle/done". B: "erneutes `her` stellt alle Agents mit Status wieder her". Transkript 3:58 nennt "idle/done" ausdruecklich — A ist praeziser.
- Zahl der Einrichtungsschritte. B: "Vor dem Start braucht es zwei Schritte". A: "Vor dem Start Integrationen ... hinzufuegen und die Agent-Skill-Datei einrichten". Transkript 0:20 sagt "Zwei weitere Schritte vor dem Start" — B gibt die Zahl wieder, A laesst sie weg.
- Ende der Sub-Agent-Demo. B: "danach liest der Haupt-Agent beide Ergebnisse und urteilt". A: "der Haupt-Agent ... liest danach beide Ergebnisse". Transkript 4:50 nennt das Urteil — B ist hier praeziser. Beide lassen weg, dass die Frage "wie aufwendig eine Migration nach Python bzw. Rust waere" lautete.
- Zuschreibung der Statusanzeige. A: "Agent-State-Extension — zeigt Agent-Status (idle, arbeitet, blocked, done)". B macht diese Zuschreibung nicht. An dieser Stelle ist A ungenauer (siehe Fund oben), B laesst die Komponente dafuer ganz aus.
- Workspaces. A: "Workspaces — Projekte in herdr; neu per Klick oder Prefix Ctrl+B, dann Shift+N". B: "Workspaces — Container, in dem Projekte und ihre Agents gebuendelt werden". A liegt naeher an der Formulierung des Transkripts (1:08 "hier Projekte hinzufuegen") und nennt zugleich den Anlege-Weg im Konzept.
- Pane-Splits. A: "Vertikal splitten ordnet Panes nebeneinander, horizontal darunter — Prefix plus Minus (Ctrl+B, Minus)". B: "vertikal splitten fuer seitliche Anordnung, horizontal (Ctrl+B, Minus) fuer darunter". Gleichwertig; beide geben 3:13 korrekt wieder.

## Regelverstoesse

### Fassung A

- Keine Funde. Sektionsreihenfolge vollstaendig und korrekt ("Worum es geht", "Besprochene Konzepte", "Behauptungen", "Demos / Schritte", "Genannte Tools", "Verwandt"); "Worum es geht" sind zwei Saetze; keine Vorrede, keine fremde Ueberschrift; Sprache deutsch mit unveraenderten Fach-, Produkt- und Befehlsnamen; Timestamps in "Behauptungen" sind zulaessig-optional. "Demos / Schritte" und "Genannte Tools" haben Anlass (das Video fuehrt vor und nennt Tools).

### Fassung B

- Keine Funde. Gleiche Sektionsfolge, gleiche Bedingungen erfuellt. Timestamps zusaetzlich in "Demos / Schritte" sind von den Vorgaben nicht untersagt.

## Urteil

- Treue: gleichwertig — beide Fassungen haben je genau einen nicht gedeckten Punkt (A eine zu weite Zuschreibung an die Agent-State-Extension, B eine nicht stattgefundene Permission-Freigabe) und keine eigene Spekulation.
- Vollstaendigkeit: A besser — A laesst 3 benannte Transkript-Punkte aus, B 7, darunter die Agent-State-Extension, der Zustand "arbeitet" und das Schliessen von Panes per Rechtsklick.
- Praezision: A besser — A trifft Zustandsmenge und Wiederherstellungs-Detail genauer, waehrend B nur bei der Zahl der Einrichtungsschritte und beim Urteil am Ende der Sub-Agent-Demo genauer ist.
- Regeltreue: gleichwertig — beide erfuellen Sektionsfolge, Sprachvorgabe und Anlassbedingungen ohne Verstoss.
