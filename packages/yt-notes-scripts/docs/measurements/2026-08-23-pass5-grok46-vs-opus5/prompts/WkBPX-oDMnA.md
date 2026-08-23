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
### Begrüßung und These

Vielen Dank, dass Sie sich für den Studiengang Design Engineering entschieden haben. Mein Name ist Jeffrey Litt. Ich bin derzeit als Designingenieur bei Notion tätig. Ich bin hier, um vielleicht eine gewagte These zu verkünden: Ich denke, es ist nach wie vor wichtig, dass Menschen verstehen, wie Code funktioniert.

Lasst uns eine Umfrage starten. Heben Sie die Hand, wenn Sie dieser Meinung zustimmen. Okay, vielleicht liegt eine Selektionsverzerrung vor. Und wer stimmt nicht zu?

Die Realität ist: Wir treten in eine Ära ein, in der das eine legitime Frage ist. Agenten schreiben Unmengen an Code für uns, persönliche Bestleistungen von 50.000 Zeilen, und es wird immer schwieriger, mitzuhalten. Die gute Nachricht: Es gibt viele Wege, das zu verstehen — nicht mehr nur Code Zeile für Zeile lesen.

In diesem Vortrag stelle ich Praktiken vor, die ich anwende, um den Code zu verstehen, den meine Agenten für mich schreiben: erklärende Dokumente, Quizfragen zur Verständnisprüfung, und Mikrowelten, die ich bewohnen kann, um ein intuitives Verständnis zu entwickeln.

### Warum Verständnis noch wichtig ist

Viele Menschen glauben, wir verstehen nur, um zu überprüfen — die Agenten machen dumme Sachen, und unsere Aufgabe ist es, sie im Zaum zu halten. Code-Reviews als neuer Flaschenhals bedeuten für viele: Korrektheitsprüfung. Aber Korrektheit ist letztlich eine Daumen-hoch-oder-runter-Entscheidung, und Agenten werden mit der Zeit immer besser darin, sich selbst zu prüfen. Die Rolle des Menschen bei der Korrektheitsprüfung nimmt ab — das finde ich nicht schlimm.

Aber es gibt einen tieferen Grund zu verstehen: um teilnehmen zu können. Es ist keine einzelne Schleife — Verständnis aus einem Durchlauf nimmt man mit in den nächsten. Reichhaltige konzeptionelle Strukturen im Kopf ermöglichen fließende, kreative Sprünge, ohne einen Agenten oder Menschen fragen zu müssen. Das ist der menschliche Teil der Arbeit: neue Ideen entwickeln.

Der Begriff kognitive Schulden trifft das gut — eine Analogie zur technischen Verschuldung, populär gemacht von der Wissenschaftlerin Margaret Stories, auch Simon Willison hat darüber gebloggt. Man kommt eine Zeitlang durch, aber irgendwann rächt sich nachlassendes Verständnis.

Also: Wie verstehen wir Dinge im Allgemeinen? Dafür gibt es ein Feld — Bildung. Wir können uns von den besten Ideen aus dem Bildungsbereich inspirieren lassen. Drei Techniken: Erklärungen, Mikrowelten, Gemeinschaftsräume.

### Technik 1 — Erklärungen

Wenn ein Agent Code schreibt, ist das eine Gelegenheit, die Funktionsweise zu erklären. Die naivste Erklärung ist der rohe Code-Diff. Besser: Was wäre die bestmögliche Erklärung, wenn ein Team ein Jahr Zeit hätte, um einen individuellen Lehrplan nur für diese eine Codeänderung zu entwickeln?

Dafür habe ich eine Funktion namens explain-diff entwickelt, die ich täglich nutze, genau wie viele Kollegen. Beispiel: ein Videospiel, in dem man Zen-Gärten zeichnet — Perspektive von Top-Down auf isometrisch umgestellt. Beim Ausführen entsteht ein Code-Erklärungsdokument, als HTML- oder Markdown-Datei, oder in Notion, weil es kollaborativ ist.

Prinzipien: Erst der Hintergrund — wie das System funktioniert, welche Game-Engine, welches Koordinatensystem, welche Subsysteme. Zweites Prinzip: Intuition vor Details — das Ziel des Commits in einem Satz, wie eine ausführlichere Commit-Nachricht. Drittens: interaktive Grafiken, wo es Sinn ergibt — etwa eine Simulation zum Verschieben von Steinen, die Koordinaten und Z-Ebenen live anzeigt. Genutzt wird dabei eine neue Notion-Funktion: HTML-Blöcke auf Notion-Seiten. Interaktivität kann eine Krücke sein, aber geschmackvoll eingesetzt vermittelt sie Verständnis, das statische Bilder nicht erreichen.

Danach kommt der Code selbst — nicht als Dateiliste, sondern als literarische Code-Diffs: Prosa in der richtigen Reihenfolge, vor jeder Datei erklärt, worum es geht.

### Explain-Diff-Skala und Quiz

Lesen ist schwierig, und Menschen sind faul. Als Inspiration dient der Forscher Andy Matuschak mit dem Satz „Bücher funktionieren nicht" — man kann ein Buch lesen, ohne zu merken, dass man es nicht verstanden hat. Er und sein Mitarbeiter Michael Nielsen haben interaktive, verteilte Wiederholungsquizze in Aufsätze eingebaut.

Genau das mache ich mit meinen Code-Erklärungen: Am Ende steht ein Quiz mit fünf Fragen, mittlerer Schwierigkeitsgrad. Meine Regel: Ich schicke keinen Code zur Überprüfung, bevor ich das Quiz bestanden habe. Ich nutze das als eine Art Geschwindigkeitsregler — bei KI dreht sich alles ums Beschleunigen, aber wir müssen uns auch im Tempo des Verstehens bewegen.

Wer die Explain-Diff-Skala nutzen möchte: QR-Code, zwei Versionen — eine gibt HTML aus, eine Notion.

### Technik 2 — Mikrowelten

Inspiriert vom Pädagogen Seymour Papert und seiner Idee von Mathland: Kinder lernen Französisch, indem sie in Frankreich leben — wo lernen sie Mathematik, wenn nicht in einem Matheland? Papert ließ Kinder einen Roboter namens Schildkröte programmieren — nicht um Roboter zu bauen, sondern um durchs Programmieren Mathematik zu lernen.

Beispiel: Ich habe einen Interpreter für die Programmiersprache Prolog implementiert, um sie selbst zu lernen. Von Claude ließ ich mir eine Mikrowelt erschaffen — einen Debugger als temporäre Benutzeroberfläche zur Visualisierung der internen Implementierung, mit Zeitleiste und Kommentarfunktion. So bekam ich beim Debuggen ein Gefühl für die Maschine, das man mit einem Agenten allein nicht bekommt.

Zweites Beispiel: Migration meiner persönlichen Website auf ein anderes Framework. Ein reines Skript von Claude gab mir kein Gespür für die Änderung. Also ließ ich mir ein Videospiel bauen: alte Website links, neue rechts, Schritt für Schritt per Knopfdruck, mit Dateistrukturen zur Verfolgung der Verschiebung — so profitierte ich vom iterativen Vorgehen ohne dessen Schmerzen.

Agenten können Code schreiben, der uns hilft, Code zu verstehen — nicht Software für den Markt, sondern Mikrowelten, das Land der Mathematik.

### Technik 3 — Gemeinschaftsräume

Verständnis im Team ist die Grundlage für gemeinsames kreatives Arbeiten. Bei Notion denken wir viel darüber nach, wie gemeinsames Verständnis — von Namen für Systemteile, UI-Elemente oder Konzepte — Werkzeuge für kollektives Verständnis ermöglicht.

Wir erforschen Mehrspieler-Chats zwischen mehreren Menschen und Agenten in einem gemeinsamen Bereich, statt getrennter Einzelgespräche — ähnlich dem Übergang von Einzelchats zu Slack-Kanälen. Dokumente, über die man gemeinsam sprechen kann, sind ein wirkungsvolles Hilfsmittel: Claude erstellt einen Plan, Teammitglieder kommentieren direkt darin.

Seit letzter Woche lassen sich Coding-Agenten in Notion integrieren — Claude und Cursor laufen jetzt in Notion, und unser Team erstellt einen Großteil des Codes direkt dort, wegen der Vorteile eines gemeinsamen Arbeitsbereichs.

### Fazit

Es geht nicht nur darum, wie Code funktioniert, sondern wie alles funktioniert — und das wird gerade in Frage gestellt. Das ist kein neuer Kampf: Alan Kay, einer der Pioniere des Personal Computing und Miterfinder der modernen grafischen Benutzeroberfläche, schrieb vor 50 Jahren den Aufsatz „Ein persönlicher Computer für Kinder jeden Alters" — seine Vision: Kinder verändern Code in einem Videospiel, um Physik zu lernen. Es ging nie um den Computer, sondern um die Menschen.

Mit KI wird vielen klar: Code ist kostenlos, wir können kurzlebige Benutzeroberflächen, dynamische Simulationen, Debugger und Spielwiesen bauen. Mit den richtigen Werkzeugen, Denkweise und Kreativität können wir besser verstehen als je zuvor — nicht weniger. Wir befreien uns nicht nur aus Schleifen, sondern verstricken uns tiefer in sie. Vielen Dank.