Du bekommst ein audited_md eines YouTube-Videos (Werbung schon ausgeschnitten).

Vault-Kontext: Die Zusammenfassung wird in eine Markdown-Datei geschrieben, die
im Obsidian-Vault `test` (Shared-Vault) liegt — Pfad
`shared/youtube/<channel>/<title>.md`. Wikilinks `[[…]]` lösen NUR innerhalb
dieses Vaults auf. Treffer aus dem KB-Vault (`knowledge-base`) brauchen
deshalb `obsidian://`-URIs — siehe Wikilink-Verfahren unten.

Aufgabe: Schreibe eine deutsche Zusammenfassung als Markdown, strukturiert in
folgende Sektionen. Setze Wikilinks zu KB-Artikeln im Vault aktiv, wo
entsprechende Sektionen das vorsehen.

## Worum es geht

Ein bis zwei Sätze: Was ist Thema und Kontext.

## Besprochene Konzepte

Bullet-Liste der inhaltlichen Konzepte / Theorien / Ansätze.
Pro Bullet: "<Konzept> — <ein Halbsatz Beschreibung>".
Wenn der Konzept-Begriff einen passenden Vault-Artikel hat (OHS-Lookup
geprüft, siehe Wikilink-Verfahren unten): "[[<artikel-name>]] — …".

## Behauptungen

Bullet-Liste konkreter Aussagen des Sprechers — Fakten, Empfehlungen,
Wertungen über Tools/Produkte/Vorgehen.
Pro Bullet: "<knappe Behauptung>" (optional: `(<timestamp>)` am Ende).
KEINE Wikilinks in dieser Sektion — die landen in `## Verwandt` unten.

Timestamp-Format STRIKT (nur wenn du einen aus dem audited_md übernimmst):
M:SS, MM:SS, H:MM:SS oder HH:MM:SS — IN runden Klammern, KEINE
selbstgebauten Markdown-Links. Die Timestamps werden in einem
deterministischen Post-Process zu YouTube-Marker-Links umgeschrieben.

Behauptung vs Spekulation:
- **DEINE** Spekulation ist verboten:
    - "Vermutlich meint der Sprecher …" — keine eigene Interpretation
    - "Daraus folgt …" — keine eigenen Schlüsse
    - "Das könnte zu Z führen" — keine Vorausschau
- **Sprecher-Spekulation** ist OK: wenn der Sprecher selbst vermutet
  ("ich glaube X wird Y überholen"), übernimm es mit Marker
  "Laut Sprecher …" oder "Der Sprecher vermutet …".
- Faustregel: bei Unsicherheit ob du eine Behauptung wörtlich ins Original
  zurückführen kannst, weglassen.

## Demos / Schritte

Falls etwas vorgeführt wird: nummerierte Liste, jeder Schritt knapp.
Wenn nichts vorgeführt wird, Sektion weglassen.

## Genannte Tools

Bullet-Liste der explizit genannten externen Tools / Frameworks / Produkte.
Pro Bullet: "[[<vault-artikel-name>]] — <Halbsatz Funktion>" wenn Match,
sonst Klartext-Name.
Wenn keine Tools im Video: Sektion weglassen.

## Verwandt

Bullet-Liste von Vault-Artikeln, die zum Video-Thema verwandt sind —
auch wenn nicht explizit im Video genannt. Quelle: OHS-Lookup mit
Video-Thema/Konzept-Phrasen.
Pro Bullet: "[[<artikel-name>]] — <Halbsatz, was die Verbindung ist>".
Keine Duplikate zu den schon in Konzepte/Tools verlinkten Artikeln.
Wenn nichts verwandt: Sektion weglassen.

---

Wikilink-Verfahren (für Konzepte, Tools, Verwandt — Pflicht):
1. Bash-Aufruf (mit explizitem Node-Interpreter — claude-CLI Sub-Agent erbt
   einen PATH, in dem ein Node v26 vor Node v22 steht, was den OHS-internen
   `better-sqlite3` mit NODE_MODULE_VERSION-Mismatch kaputtmacht):
   OHS_NODE_BIN=$HOME/.asdf/shims/node /Users/hoschi/repos/kims/scripts/ohs-search-merged.sh --vault-type arbeit --no-yt --limit 3 --json '<query>'
2. Score-Lese: nur Hits mit `score_native >= 0.8` betrachten (NICHT score_rrf —
   der ist Rank-basiert und liegt im Bereich ~0.01-0.02, also nie >= 0.8).
3. Title-Match-Prüfung gegen Video-Kontext:
   - Bei Mehrdeutigkeit (z.B. "Claude" → "Claude Code" vs "Claude API"):
     Kontext-Snippet aus diesem Video entscheidet
4. **Link-Format strikt nach `source_index` des Hits** (siehe JSON-Antwort):
   - `source_index: "shared"` → `[[<exakter-hit-title>]]` (Wikilink, gleicher Vault)
   - `source_index: "kb"` → `[<exakter-hit-title>](obsidian://open?vault=knowledge-base&file=<URL-encoded-file_path-OHNE-.md>)`
     **`.md`-Suffix wird abgeschnitten** (Obsidian-URI erwartet den File-Namen
     ohne Extension — sonst öffnet der Klick eine neue Stub-Datei statt der
     Ziel-Datei). URL-Encoding: Leerzeichen → `%20`, Slashes `/` → `%2F`,
     Sonderzeichen (Umlaute, Bindestrich-em-dash, Apostrophe) entsprechend RFC 3986.
     Beispiel: file_path `claude-code-mcp-setup.md` → `file=claude-code-mcp-setup`.
     Beispiel mit Sonderzeichen: `yt-pipeline — decisions.md` → `file=yt-pipeline%20%E2%80%94%20decisions`.
5. Kein Match / Score zu niedrig: Klartext lassen,
   KEINEN spekulativen Wikilink.
6. NIEMALS `[[…]]` für einen Hit mit `source_index: "kb"` — das wäre ein
   toter Cross-Vault-Link.
7. NIEMALS ein Markdown-Link mit relativem Vault-Pfad für eine Vault-Notiz —
   weder `[text](shared/…/datei.md)` noch `[text](knowledge-base/…/datei.md)`.
   Solche Pfade lösen in Obsidian NICHT auf. Es gibt nur zwei erlaubte Formen:
   Same-Vault → `[[…]]` (Punkt 4, source_index shared),
   KB-Vault → `[…](obsidian://…)` (Punkt 4, source_index kb).

Globale Regeln:
- NUR was der Sprecher tatsächlich sagt
- Sprache: deutsch
- Keine harten Längen-Limits
- Links (Wikilinks [[…]] und [text](obsidian://…)) NIEMALS in Backticks
  einschließen — Backticks rendern den Link als Inline-Code statt als
  klickbaren Link. Die Backtick-Beispiele oben dienen nur der Darstellung.
- Gib AUSSCHLIESSLICH den Markdown-Body aus (beginnend mit "## Worum es
  geht"). Keine Vorrede, kein Denken, keine Meta-Kommentare wie "Ich schreibe
  jetzt die Zusammenfassung", keine zusätzlichen Überschriften außer den oben
  definierten Sektionen.

Input audited_md:
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