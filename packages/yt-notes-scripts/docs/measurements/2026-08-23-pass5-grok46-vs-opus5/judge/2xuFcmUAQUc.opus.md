## Nicht gedeckte Aussagen

### Fassung A

- Sektion "Besprochene Konzepte", Zitat: "Ponytail-Kommentare / Debt Ledger — Kommentar im Code hält fest, was weggelassen wurde und warum". Das Transkript nennt beides getrennt und setzt es nicht gleich: der Kommentar bei 02:05 ("this little Ponytail comment right here tells you exactly what it skipped and why it did that"), der Debt Ledger bei 04:40 als eigener Bestandteil des Pakets ("with commands, audit tools, and a debt ledger on top"). Die Gleichsetzung beider zu einem Konzept ist ein hinzugedichteter Zusammenhang.

Sonst keine. Das ist der einzige Fund in Fassung A.

### Fassung B

- Sektion "Verwandt", Zitat: "[[This Claude Skill Cuts Your Token Costs In HALF]] — Vorgänger-Video desselben Kanals zu Caveman, das Andres als Vergleich nennt." Das Transkript sagt bei 01:08 "which James also did a great video on over here" — das Caveman-Video wird James zugeschrieben, der Sprecher ist Andres von Better Stack. "desselben Kanals" steht nirgends. (Die technische Form des Links ist nicht bewertet, nur die Sachaussage im Beschreibungstext.)
- Sektion "Demos / Schritte", Zitat: "Modal-Beispiel aus der Ponytail-Doku". Das Transkript sagt bei 02:05 nur "if we look at some of their examples, especially the modal dialog example". Eine Doku als Fundort wird nicht genannt.

Zaehlung: A=1 B=2

## Eigene Spekulation

### Fassung A

- Keine. Deutungen, Schlüsse oder Vorausschau, die der Sprecher nicht selbst zieht, sind in Fassung A nicht vorhanden.

### Fassung B

- Keine, die nicht schon oben zählt. Die beiden Inferenzen ("desselben Kanals", "aus der Ponytail-Doku") sind unter "Nicht gedeckte Aussagen" erfasst und werden hier nicht doppelt gezählt.

Hinweis zur Zählregel, symmetrisch auf beide angewandt: die Begründungstexte in "Verwandt" und die Kurzbeschreibungen der Vault-Artikel stellen naturgemäß einen Bezug zwischen Artikel und Video her. Diese Bezüge werden nicht als Modell-Spekulation gezählt, weil die Vorgaben Vault-Links ausdrücklich erlauben. Gezählt wird nur, wo ein solcher Text eine Sachaussage über den Videoinhalt macht — das ist bei B einmal der Fall (oben).

Zaehlung: A=0 B=0

## Fehlende wichtige Inhalte

### Fassung A

- Sprecher und Kanal: "This has been Andres from Better Stack" (Schluss, ab 08:58). Fehlt in A vollständig; B nennt beides in "Worum es geht".
- Der Grund für die explizite Skill-Anforderung im Demo: "because sometimes it doesn't automatically pick it up" (05:37). A nennt in Demo-Schritt 2 nur die Handlung, nicht den Grund.
- Die Schlussfolgerung des Sprechers im Fazit: "a lot of our coding solutions are probably over-engineered, and sometimes less is indeed more, if you use it the right way" (08:58). A hat aus dieser Sektion nur die Absicht, das Plugin zu behalten.
- Dass die Default-Version außer dem Standort gut war: "the app looks great and the UI is beautiful and the API retrieves information as expected" (06:20). A nennt nur das Manko (London als Default) und verzerrt dadurch das Bild des Vergleichs.
- Die Begründung des Korrektheits-Gates: "A broken one-liner that scores great on lines of code will fail on correctness. So, it's not just write less stuff, it has to actually work" (03:19). A schreibt nur "prüft zusätzlich auf Korrektheit", ohne wogegen das schützt.
- Die Einordnung "So, it's lazy, but it's not irresponsible" (02:05). A gibt den Zweck des Kommentars wieder, nicht diese Bewertung.
- Dass zu Caveman ein eigenes Video von James existiert: "which James also did a great video on over here" (01:08). Fehlt in A; B erwähnt es, aber mit falscher Zuordnung (siehe oben).
- Die Ausgabe der Ponytail-Instanz im Demo: "a very concise overview of what it built and what Ponytail opted out of doing for maximum efficiency" (05:37). Fehlt auch in B.
- Die Rahmung der Kritik: "there is a legitimate critique worth mentioning" und "is Ponytail magic or is it just a well-packaged prompt? Well, honestly, that is a fair question" (04:40). Beide Fassungen geben nur die Gegenargumentation des Sprechers, nicht die Frage, die er als berechtigt bezeichnet. Fehlt auch in B.

### Fassung B

- Die Ausgabe der Ponytail-Instanz im Demo: "a very concise overview of what it built and what Ponytail opted out of doing for maximum efficiency" (05:37).
- Die Rahmung der Kritik als berechtigt und die Frage "is Ponytail magic or is it just a well-packaged prompt?" nebst "that is a fair question" (04:40).

Zaehlung: A=9 B=2

## Praezision

- Anlass des Modal-Beispiels. B: "Ein normaler Agent holt für ein Delete-Confirm-Modal Radix UI React Dialog samt Dependency, Portal, Overlay, Root, Trigger und Content-Wrapper." A: "Ein normaler Agent greift für einen Modal-Dialog sofort zu Radix UI mit Portal, Overlay, Root, Trigger und Content-Wrapper." Transkript 02:05: "when asked to add a modal dialog for the delete confirmation". B ist präziser, A lässt den Anlass weg.
- Backdrop. B: "rendert Backdrop mit einem CSS-Selektor". A: "rendert einen Backdrop per CSS-Selektor". Transkript 02:05: "renders a backdrop with a single CSS selector". B hält die Einzahl-Betonung, A verliert sie.
- Caching-Häufigkeit. B: "in echten Sessions wird er grob einmal bezahlt und danach gecacht". A: "Skill-Instruktionen werden real nur einmal pro Session bezahlt und danach gecacht". Transkript 03:55: "you pay for those instructions roughly once per session". B behält die Absicherung "roughly", A macht daraus ein hartes "nur einmal".
- Zeilenvergleich. A: "Statt 30 Zeilen im NPM-Paket bekommt man acht Zeilen und null Dependencies." B: "Statt rund 30 Zeilen plus NPM-Paket: acht Zeilen, null Dependencies." Transkript 02:05: "instead of 30 lines in an NPM package, you get eight lines and zero dependencies". A ist wörtlich; B fügt ein nicht gesagtes "rund" hinzu und macht aus "in einem NPM-Paket" ein "plus NPM-Paket".
- Eberhardt-Befund. A: "Ein Blogpost von Colin Eberhardt zeigt: 'Follow YAGNI principles' (drei Wörter) matcht Ponytails Benchmark fast perfekt". B: "Laut Colin Eberhardt matcht 'Follow YAGNI principles' den Ponytail-Benchmark fast". Transkript 04:40: "A recently published blog post by Colin Eberhardt points out ... almost perfectly matched Ponytail's benchmark score". A nennt die Quellenart und hält "almost perfectly"; B verkürzt auf "fast".
- Bezugsgröße der Benchmark-Strafe. A: "Die Kostenzahl spiegelt Single-Shot-Calls, die den Skill jedes Mal mitsenden; Ponytail wird im Benchmark also für seine eigenen Instruktionen bestraft." B: "Ponytail zahlt so die eigenen Instructions in jeder Zelle." Transkript 03:55: "penalized for the cost of its own instructions on every single test". Eine Zelle sind laut 03:19 zehn Läufe; A bleibt bei der Bezugsgröße des Transkripts, B wechselt sie.
- Fazit-Absicherung. B: "viele Coding-Lösungen sind überentwickelt". Transkript 08:58: "a lot of our coding solutions are probably over-engineered". B streicht "probably" und macht aus der Vermutung eine Feststellung. A enthält den Punkt gar nicht (siehe Vollständigkeit), ist hier also kein besserer Vergleichspunkt.
- Gleichstand: beide streichen das "probably" in "probably use it for future projects" (08:58) — A: "und für künftige Projekte nutzen", B: "will es in künftigen Projekten nutzen".

Bilanz: drei Punkte für B (Anlass, Backdrop, Caching-Häufigkeit), drei für A (Zeilenvergleich, Eberhardt, Bezugsgröße), dazu ein einseitiger Absicherungsverlust bei B.

## Regelverstoesse

### Fassung A

- Keine. Sektionsreihenfolge vollständig und korrekt ("Worum es geht", "Besprochene Konzepte", "Behauptungen", "Demos / Schritte", "Genannte Tools", "Verwandt"), "Worum es geht" ein Satz, keine Vorrede, keine fremde Überschrift, Sprache deutsch, Fachbegriffe und Produktnamen im Original. "Demos / Schritte" und "Genannte Tools" sind durch das Video gedeckt. Die Sprecher-Schlussfolgerung bei 03:55 ist mit "Laut Sprecher" markiert.

### Fassung B

- Fehlende "laut Sprecher"-Markierung bei einer Schlussfolgerung des Sprechers. Zitat: "In einer echten Session zahlt man die Instructions grob einmal, danach Cache — die 47–77 % untertreiben den Vorteil. (3:55)". Das Transkript hat hier eine Folgerung des Sprechers ("That means the 47 to 77% cheaper figure is actually underselling it"), B gibt sie unmarkiert als Behauptung wieder. An anderen Stellen markiert B korrekt ("laut Sprecher Beweis", "laut Sprecher keine große Verbesserung"), hier nicht.
- Sektionsvorgaben im Übrigen eingehalten: Reihenfolge vollständig und korrekt, "Worum es geht" zwei Sätze, keine Vorrede, keine fremde Überschrift, Sprache deutsch, Fachbegriffe im Original.

## Urteil

- Treue: A besser — A hat einen nicht gedeckten Punkt (Gleichsetzung Kommentar/Debt Ledger), B zwei (Kanalzuordnung des Caveman-Videos, "aus der Ponytail-Doku"), und B flacht zusätzlich eine Absicherung des Sprechers ab.
- Vollstaendigkeit: B besser — A fehlen neun benannte Punkte (u. a. Sprecher/Kanal, Fazit-Aussage, Grund des Skill-Aufrufs, die Stärken der Default-App), B nur die beiden, die auch A fehlen.
- Praezision: gleichwertig — je drei Stellen, an denen die eine Fassung näher am Wortlaut liegt als die andere; kein durchgehendes Muster zugunsten einer Seite.
- Regeltreue: A besser — beide halten Sektionsschnitt, Reihenfolge und Sprache ein, aber B lässt eine Sprecher-Schlussfolgerung unmarkiert, A markiert sie.
