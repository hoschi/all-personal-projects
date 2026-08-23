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

### Was ist Herder?

Herder ist ein Agenten-Multiplexer, der innerhalb des Terminals läuft, das Sie bereits verwenden. So können Sie eine Reihe von Coding-Agenten nebeneinander in verschiedenen Fenstern oder Tabs ausführen und sehen, welcher Agent gerade arbeitet, welcher blockiert ist oder welcher fertig ist – inklusive Systembenachrichtigungen in einer einzigen Rust-Binärdatei. Das bedeutet: kein Electron oder eine separate App. Es verfügt sogar über eine clevere Methode, um über SSH zu funktionieren. Aber warum sollte man angesichts der wachsenden Beliebtheit von Tools wie tmux überhaupt noch Herder verwenden? Abonniert den Kanal und lasst uns herausfinden, was passiert.

### Herkunft und Vergleich mit tmux

Herder wurde von einem Entwickler namens Oğulcan Celik gebaut, der vermutlich das E aus dem Wort Herder weggelassen hat, weil er ein Fan der frühen 2000er Jahre ist. Ich weiß es nicht genau, aber ich nehme an, dass Herder ein Werkzeug ist, mit dem man mehrere Agenten hüten kann, wie einen Schafhirten. Das ist ein Problem für die meisten Entwickler, die KI für die Entwicklung einsetzen, denn es ist schwierig, den Überblick darüber zu behalten, was die einzelnen Agenten gerade tun.

Herder orientiert sich stark an tmux, einem Terminal-Multiplexer mit Tabs, geteilten Fenstern und der Möglichkeit, Sitzungen auch nach dem Trennen der Verbindung aufrechtzuerhalten. tmux wurde jedoch vor Jahrzehnten entwickelt, lange bevor es KI-Agenten gab. Wenn Sie also einen Agenten in einem seiner Fenster ausführen, hat es keine Ahnung, dass er existiert oder welchen Status er hat. Deshalb gibt es Tools wie Warp oder tmux, die den Benutzer aus seinem gewohnten Terminal herausholen und ihn in ihr eigenes System zwingen, sodass er den Workflow anderer lernen muss. Aus diesem Grund entwickelte Oğulcan Celik Herder, um beides gleichzeitig zu ermöglichen: die Persistenz von tmux mit integrierter Agentenverwaltung. Und da Herder nur eine einzige Rust-Binärdatei ist, die mit Ratatui erstellt wurde, rendert das Ganze lediglich Text in Ihrem Terminal und kann daher überall ausgeführt werden, wo auch Ihr Terminal läuft, sogar über SSH. Es gibt außerdem eine Socket-API, was bedeutet, dass Agenten Herder selbst steuern können, was wirklich beeindruckend ist.

### Installation und Bedienung

Lassen Sie uns doch gleich eine kurze Demo durchgehen. Nach der Installation von Herder mit Brew, curl oder sogar einem Nix-Flake bin ich sehr froh, dass diese Option hinzugefügt wurde: Man kann einfach den Herder-Befehl ausführen, woraufhin diese Ansicht mit dem Terminal, einigen Arbeitsbereichen und einigen Agenten angezeigt wird. Ich habe jetzt ein wenig hineingezoomt, daher werden Sie einige Dinge nicht sehen können, wie zum Beispiel den vollen Umfang der Befehle, aber ich werde mein Bestes geben, um Herder vorzustellen.

Hier sehen Sie also, dass es keine Arbeitsbereiche gibt, und standardmäßig ist das Präfix Strg+B, was ähnlich wie bei tmux ist, aber ich zeige Ihnen später, wie Sie das ändern können. Das Präfix ist bereits aktiviert, was ich hier unten beim Navigieren sehen kann. Ich muss also nur die Umschalttaste und N drücken, um einen neuen Arbeitsbereich zu erstellen. Sie können natürlich auch ausschließlich mit der Tastatur navigieren, indem Sie beispielsweise das Präfix und das Fragezeichen drücken, um alle Tastenkombinationen anzuzeigen. Alternativ können Sie aber auch die Maus verwenden. Ich kann also einen neuen Tab erstellen, der „zwei" heißt. Ich kann mit der rechten Maustaste einen Tab schließen, meinen Arbeitsbereich umbenennen, einen neuen Arbeitsbereich erstellen, über das Menü auf die Einstellungen zugreifen und so weiter. Ich kann sogar horizontale und vertikale Aufteilungen erstellen, den jeweiligen Bereich umbenennen und zwischen den Bereichen navigieren – alles mit der Maus.

### Interaktion mit Coding-Agenten

Das eigentliche Verkaufsargument von Herder ist jedoch die Art und Weise, wie es mit Agenten interagiert. Im Moment verwende ich also Bash, aber ich möchte Fish verwenden, daher werde ich beide Terminals wechseln. Und dann öffne ich oben Claude Code und unten Codex. Aber wir können bereits sehen, dass Herder die Agenten automatisch erkannt und ihnen Status zugewiesen hat. Claude ist also blockiert und Codex hat keine Zeit. Lasst uns beiden Problemen begegnen, indem wir ihnen Zugriff auf diese Verzeichnisse gewähren. Und natürlich kann ich ihnen beiden Eingabeaufforderungen geben, zum Beispiel, welches Modell ich verwende, und wir können sehen, dass Herder sich sofort aktualisiert und uns mitteilt, dass Claude funktioniert, was auch mit Codex CLI funktioniert.

Mir ist aufgefallen, dass ich mich im falschen Arbeitsbereich befinde. Löschen wir also diesen und benennen wir diesen hier um, um ihn zu testen. Mit Herder können die Agenten aber auch Arbeitsbereiche, Registerkarten und Splits erstellen. Mal sehen, wie das funktioniert. Ich werde Herder also beenden, indem ich Präfix und dann Q drücke, und dann können Sie hier alle Optionen sehen, die uns die Herder-Befehlszeilenschnittstelle bietet. Also, ich werde jetzt zu Herder zurückkehren, und das ist ein Verkaufsargument dafür, dass ich genau zu dem Arbeitsbereich und dem Agenten zurückkehre, den ich zuvor mit denselben Sitzungen geöffnet hatte.

Aber ich werde einen neuen Arbeitsbereich erstellen, in ein Verzeichnis wechseln und dann Claude Code öffnen. Anschließend werde ich Herder CLI auffordern, zwei Fenster mit Claude Code zu öffnen. In einem Fenster werde ich die größte Datei im Projekt zusammenfassen lassen, im anderen den Quellcode nach fest codierten API-Schlüsseln oder Geheimnissen durchsuchen. Und hier wurde ein neues Fenster mit Claude Code geladen. Ich werde jetzt mal herauszoomen, damit wir das etwas besser sehen können. Und jetzt wird die andere Eingabeaufforderung im Quellcode ausgeführt. Wir können also nach oben scrollen und sehen, dass dieser Vorgang abgeschlossen ist. Wir können auch sehen, dass ihnen passende Titel gegeben werden, wie zum Beispiel Claude Secrets und Disk Code. Und hier wurden keine fest codierten API-Schlüssel gefunden. Von hier aus können wir die Ausgabe beider Fenster zusammenfassen und Claude dann bitten, sie zu schließen. Es hat nun die Informationen aus dem ersten Fenster abgerufen und dieses geschlossen, und es macht dasselbe mit dem zweiten Fenster, das ebenfalls geschlossen ist. Und hier unten wird mir eine schöne Zusammenfassung angezeigt.

### Remote-Nutzung per SSH

Da Herder lediglich eine Binärdatei ist, die man in sein Terminal installieren kann, kann ich mich per SSH auf einen Linux-Server einloggen und Herder auf die gleiche Weise installieren, wie ich es auf einem Mac installiert habe. Sie können sehen, dass ich das schon einmal gemacht habe, und dadurch wurde meine vorherige Sitzung wiederhergestellt. Ich habe also OpenCode in einem Fenster geöffnet und verwende Vim, um in einem anderen Fenster Code durchzugehen. Das Problem dabei ist jedoch, dass meine Herder-Konfigurationseinstellungen, die ich auf meinem lokalen Mac-Rechner habe, nicht übernommen werden. Ehrlich gesagt habe ich nicht viele Einstellungen. Ich habe lediglich die Tastenbelegung von Strg+B auf Strg+Leertaste geändert und das Design auf Terminal umgestellt. Wenn ich aber eine stark bearbeitete Konfigurationsdatei mit spezifischen Tastenkombinationen hätte, könnte das ziemlich nervig werden.

Eine Möglichkeit, dieses Problem zu umgehen, besteht darin, Herder mit dem Remote-Flag zu verwenden und sich per SSH direkt auf Ihrem Server anzumelden. Ich werde Ihnen genau erklären, was das bewirkt, bevor ich die Eingabetaste drücke. Herder funktioniert also, indem ein Server und ein schlanker Client betrieben werden, die über einen Unix-Socket kommunizieren. Der Client sendet also Tastatureingaben an den Server, und der Server verwaltet Tabs, Bereiche, Persistenz und andere Dinge. Im Falle von SSH, also der Verwendung von Remote-Zugriff, läuft der Server auf dem entfernten Rechner und der Client auf Ihrem lokalen Rechner. Es sendet also Tastatureingaben über einen Unix-Socket an den Server, und der Server kann dem Client die Dateien anzeigen, die sich auf dem Rechner selbst befinden, aber der Client selbst kann alle Konfigurationseinstellungen verwenden, die sich auf dem lokalen Rechner befinden, mit dem er verbunden ist.

Schauen wir uns das also einmal in der Praxis an. Zurück zu dem Punkt, an dem wir aufgehört haben. Wenn ich jetzt die Eingabetaste drücke, wird eine direkte Verbindung zu meinem SSH-Rechner hergestellt, auf dem wir sehen können, dass Code geöffnet ist und die aktuelle Datei angezeigt wird, die wir mit Vim betrachten. Wenn ich aber Strg+B drücke, scheint nichts zu passieren, da die Konfiguration auf meinem Mac verwendet wird, bei der Strg+Leertaste verwendet wird, um das Präfix anzuzeigen.

### Themes und weitere Funktionen

Und da wir schon mal hier sind, schauen wir uns doch gleich an, was wir sonst noch auf der Speisekarte finden. Wir können also die Tastenkombinationen anzeigen lassen, die ich Ihnen vorhin gezeigt habe, aber wir können auch das Design ändern. Und Herder bietet Ihnen viele Themes zur Auswahl, von Nord über Gruvbox bis hin zu Catppuccin. Außerdem gibt es die Möglichkeit, akustische Benachrichtigungen und ein Toast-Menü auszulösen, zwischen denen Sie innerhalb von Herder über das Terminal oder über das System wechseln können. Nun gibt es, wie üblich, noch so viele andere Funktionen von Herder, auf die ich nicht näher eingehen konnte, wie zum Beispiel Worktree-Integrationen, offizielle Harness-Integrationen, von denen Sie einige in der Demo gesehen haben, die Ihrem Harness Zugriff auf offizielle Herder-Skills ermöglichen und es Ihnen erlauben, genau die Sitzungen fortzusetzen, die Sie vor dem Schließen von Herder begonnen hatten.

### Fazit und Windows-Unterstützung

Ehrlich gesagt ist für mich die Tatsache, dass es in meinem bestehenden Terminal funktioniert, das Hauptverkaufsargument, denn so sehr ich tmux auch liebe, WezTerm gefällt mir noch viel besser. Ich habe es genau so konfiguriert, wie ich es gerne benutze. Und die Tatsache, dass ich, wenn ich meine Agenten verwalten möchte, einfach nur einen neuen Terminal-Tab in WezTerm öffnen und Herder ausführen muss. Ja, man vermisst den Session-Browser von tmux schon, aber ehrlich gesagt habe ich ihn sowieso nicht wirklich oft benutzt.

Und für alle, die jetzt zuschauen und Windows nutzen, habe ich wirklich schlechte Neuigkeiten. Aufgrund der Unix-Socket-Problematik und der Tatsache, dass Herder ein Terminal-PTY verwendet, gibt es zum Zeitpunkt der Aufnahme keine optimale Windows-Unterstützung. Aber wenn Sie Windows verwenden, dann ist es meiner Meinung nach an der Zeit, in den sauren Apfel zu beißen und einfach Linux im Dual-Boot-Modus zu installieren. Ja, WSL existiert zwar, aber es ist nicht genau dasselbe, richtig?

---

# Fassung A

## Worum es geht

Vorstellung von Herder, einem Agenten-Multiplexer, der im bestehenden Terminal läuft und mehrere Coding-Agenten nebeneinander in Fenstern/Tabs verwaltet und deren Status anzeigt. Das Video ordnet Herder gegen den klassischen Terminal-Multiplexer tmux ein und zeigt Installation, Bedienung und Remote-Nutzung per SSH.

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

---

# Fassung B

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
