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

---

# Fassung A

## Worum es geht
Vortrag von Jeffrey Litt, Designingenieur bei Notion, vor einem Studiengang Design Engineering. These: Menschen müssen weiterhin verstehen, wie Code funktioniert — auch wenn Agenten Unmengen davon schreiben —, und zwar über Erklärungen, Quiz und Mikrowelten statt nur über Zeile-für-Zeile-Lesen.
## Besprochene Konzepte
- Verständnis zum Teilnehmen — nicht nur Korrektheit prüfen, sondern konzeptionelle Strukturen aufbauen, die kreative Sprünge im nächsten Durchlauf tragen.
- Kognitive Schulden — Analogie zur technischen Verschuldung: nachlassendes Verständnis rächt sich später; der Sprecher nennt Margaret Stories und einen Blog von Simon Willison.
- [gefuehrte-code-durchsicht-agenten-features](obsidian://open?vault=knowledge-base&file=gefuehrte-code-durchsicht-agenten-features) — Erklärungen für agenten-geschriebenen Code statt des rohen Diffs, inkl. didaktischer Reihenfolge.
- Intuition vor Details — erst Hintergrund und Ziel der Änderung in einem Satz, dann der Code.
- Literarische Code-Diffs — Prosa in der richtigen Reihenfolge, vor jeder Datei erklärt, worum es geht; keine bloße Dateiliste.
- Quiz zur Verständnisprüfung — fünf Fragen mittlerer Schwierigkeit am Ende der Erklärung; Inspiration Andy Matuschak („Bücher funktionieren nicht“) und Michael Nielsen (verteilte Wiederholungsquizze).
- Mikrowelten / Mathland — nach Seymour Papert: temporäre Welten (Debugger, Simulation, Spiel), in denen man ein System bewohnt statt nur darüber zu lesen.
- Gemeinschaftsräume — gemeinsames Verständnis im Team (Namen, Konzepte, Dokumente) statt getrennter Einzelgespräche mit Agenten.
## Behauptungen
- Der Sprecher hält es nach wie vor für wichtig, dass Menschen verstehen, wie Code funktioniert.
- Agenten schreiben Unmengen an Code; der Sprecher nennt persönliche Bestleistungen von 50.000 Zeilen, und es werde immer schwieriger mitzuhalten.
- Es gibt viele Wege zum Verständnis, nicht mehr nur Code Zeile für Zeile lesen.
- Viele Menschen glauben, Verständnis diene nur der Kontrolle, weil Agenten dumme Sachen machen.
- Code-Reviews gelten für viele als neuer Flaschenhals und als Korrektheitsprüfung.
- Korrektheit ist letztlich eine Daumen-hoch-oder-runter-Entscheidung; Agenten werden besser darin, sich selbst zu prüfen.
- Die Rolle des Menschen bei der Korrektheitsprüfung nimmt ab; der Sprecher findet das nicht schlimm.
- Der tiefere Grund zu verstehen ist Teilnahme: Verständnis aus einem Durchlauf nimmt man in den nächsten mit.
- Reichhaltige konzeptionelle Strukturen im Kopf ermöglichen fließende, kreative Sprünge, ohne Agent oder Mensch zu fragen; neue Ideen entwickeln sei der menschliche Teil der Arbeit.
- Kognitive Schulden treffen das gut: man kommt eine Zeitlang durch, aber nachlassendes Verständnis rächt sich.
- Bildung liefert die besten Ideen dafür; drei Techniken: Erklärungen, Mikrowelten, Gemeinschaftsräume.
- Der rohe Code-Diff ist die naivste Erklärung; besser wäre die bestmögliche Erklärung, als hätte ein Team ein Jahr Zeit für einen Lehrplan zu genau dieser Änderung.
- explain-diff nutzt der Sprecher täglich, genau wie viele Kollegen.
- Interaktivität kann eine Krücke sein, vermittelt aber geschmackvoll eingesetzt Verständnis, das statische Bilder nicht erreichen.
- Menschen sind faul, und Lesen ist schwierig; man kann ein Buch lesen, ohne zu merken, dass man es nicht verstanden hat.
- Der Sprecher schickt keinen Code zur Überprüfung, bevor er das Quiz bestanden hat; das Quiz ist ein Geschwindigkeitsregler.
- Bei KI dreht sich alles ums Beschleunigen, aber man muss sich auch im Tempo des Verstehens bewegen.
- Ein reines Skript von Claude gab dem Sprecher bei einer Website-Migration kein Gespür für die Änderung.
- Agenten können Code schreiben, der beim Verstehen hilft — nicht Software für den Markt, sondern Mikrowelten.
- Verständnis im Team ist die Grundlage für gemeinsames kreatives Arbeiten.
- Dokumente, über die man gemeinsam sprechen kann, sind ein wirkungsvolles Hilfsmittel.
- Seit letzter Woche lassen sich Coding-Agenten in Notion integrieren; Claude und Cursor laufen dort, und das Team erstellt einen Großteil des Codes direkt dort.
- Es geht nicht nur darum, wie Code funktioniert, sondern wie alles funktioniert — und das wird gerade in Frage gestellt.
- Alan Kay schrieb vor 50 Jahren „Ein persönlicher Computer für Kinder jeden Alters“; Kinder sollten Code in einem Videospiel ändern, um Physik zu lernen — es ging nie um den Computer, sondern um die Menschen.
- Mit KI ist Code kostenlos; man kann kurzlebige Benutzeroberflächen, dynamische Simulationen, Debugger und Spielwiesen bauen.
- Mit den richtigen Werkzeugen, Denkweise und Kreativität kann man besser verstehen als je zuvor — nicht weniger.
- Der Sprecher: man befreie sich nicht nur aus Schleifen, sondern verstricke sich tiefer in sie.
## Demos / Schritte
1. explain-diff auf einer Änderung (Beispiel: Zen-Garten-Spiel, Perspektive von Top-Down auf isometrisch) — Ausgabe als HTML, Markdown oder Notion-Seite.
2. Erklärung baut zuerst Hintergrund auf (Game-Engine, Koordinatensystem, Subsysteme), dann das Ziel des Commits in einem Satz.
3. Wo es Sinn ergibt: interaktive Grafik (Beispiel: Simulation zum Verschieben von Steinen mit live Koordinaten und Z-Ebenen) über HTML-Blöcke auf Notion-Seiten.
4. Danach literarische Code-Diffs: Prosa in der richtigen Reihenfolge, vor jeder Datei die Einordnung.
5. Am Ende ein Quiz mit fünf Fragen; erst nach Bestehen geht der Code in die Überprüfung.
6. Zwei explain-diff-Ausgaben per QR-Code: HTML und Notion.
7. Prolog-Interpreter zum Selbstlernen: Claude baut eine Mikrowelt — Debugger als temporäre Oberfläche mit Zeitleiste und Kommentarfunktion.
8. Website-Migration als Videospiel: alte Site links, neue rechts, Schritt für Schritt per Knopfdruck, Dateistrukturen zur Verfolgung der Verschiebung.
9. Mehrspieler-Chats von Menschen und Agenten in einem gemeinsamen Bereich; Claude erstellt einen Plan, das Team kommentiert direkt darin.
10. Coding-Agenten (Claude und Cursor) laufen in Notion; ein Großteil des Codes entsteht dort im gemeinsamen Arbeitsbereich.
## Genannte Tools
- Notion — Arbeitsbereich für kollaborative Erklärungen, HTML-Blöcke, Pläne und integrierte Coding-Agenten.
- Claude — schreibt Code, erzeugt Mikrowelten und Pläne; läuft laut Sprecher als Coding-Agent in Notion.
- [[Cursor]] — Coding-Agent, der laut Sprecher ebenfalls in Notion integriert läuft.
- Prolog — Programmiersprache, für die der Sprecher einen Interpreter implementiert hat, um sie zu lernen.
- explain-diff — vom Sprecher entwickelte Funktion, die aus einer Codeänderung ein Erklärungsdokument erzeugt.
## Verwandt
- [verstehenslast-gefuehrter-erklaerungen](obsidian://open?vault=knowledge-base&file=verstehenslast-gefuehrter-erklaerungen) — misst die Last, geführte Erklärungen zu verstehen; liegt neben der These, dass Verständnis der Engpass ist.
- [guided code tour - ideensammlung](obsidian://open?vault=knowledge-base&file=guided%20code%20tour%20-%20ideensammlung) — Ideen für geführte Touren durch agenten-gebauten Code, nah an literarischen Diffs und Mikrowelten.
- [ai-code-quality-research](obsidian://open?vault=knowledge-base&file=ai-code-quality-research) — technische Schulden und schwindendes Architekturverständnis bei KI-geschriebenem Code, verwandt mit kognitiven Schulden.
- [vorlage-last-autonomer-laeufe](obsidian://open?vault=knowledge-base&file=vorlage-last-autonomer-laeufe) — was ein autonomer Lauf dem Menschen vorlegt, und warum das Verstehen (nicht nur Abnehmen) Zeit kostet.
- [[Coding mit AI]] — Hub für Workflows und Werkzeuge beim Entwickeln mit KI.
- [[How to Build Claude Agent Teams Better Than 99% of People]] — parallele Agenten in einem gemeinsamen Bereich, verwandt mit Gemeinschaftsräumen statt Einzelchats.
- [[How to build your own AI Code Review Agent from scratch!]] — Code-Review durch Agenten, verwandt mit der These, dass Korrektheitsprüfung nicht mehr die menschliche Kernrolle bleibt.

---

# Fassung B

## Worum es geht

Vortrag von Jeffrey Litt (Design Engineer bei Notion) im Rahmen eines Studiengangs „Design Engineering" mit der These, dass Menschen weiterhin verstehen müssen, wie Code funktioniert — auch wenn Agenten den Großteil davon schreiben. Er stellt drei Praktiken vor, mit denen er das Verständnis für agenten-geschriebenen Code aufrechterhält.

## Besprochene Konzepte

- Verstehen zum Teilnehmen statt zum Überprüfen — Verständnis dient nicht der Korrektheitskontrolle, sondern dem kreativen Mitwirken über mehrere Durchläufe hinweg
- Kognitive Schulden — Analogie zur technischen Verschuldung: nachlassendes Verständnis rächt sich später
- Bildung als Vorbild — die besten Ideen aus dem Bildungsbereich auf das Verstehen von Code übertragen: Erklärungen, Mikrowelten, Gemeinschaftsräume
- Erklärende Dokumente statt roher Diffs — ein individueller Lehrplan für genau diese eine Codeänderung
- Hintergrund zuerst, Intuition vor Details — Systemaufbau, Engine, Koordinatensystem, dann das Commit-Ziel in einem Satz
- Literarische Code-Diffs — Code in erzählter Reihenfolge mit Prosa vor jeder Datei statt als Dateiliste
- Interaktive Grafiken in Erklärungen — Simulationen, die Zusammenhänge zeigen, die statische Bilder nicht vermitteln
- Verteilte Wiederholungsquizze in Aufsätzen — Verständnisprüfung eingebettet in den Erklärungstext
- Mikrowelten / Mathland — eine bewohnbare Umgebung, in der man den Gegenstand durch Handeln lernt
- Temporäre Benutzeroberflächen zur Visualisierung — Debugger und Spielwiesen, die nur dem Verstehen dienen, nicht dem Markt
- Gemeinsames Verständnis im Team — geteilte Namen für Systemteile, UI-Elemente und Konzepte als Grundlage kollektiver Werkzeuge
- Mehrspieler-Chats mit Menschen und Agenten — gemeinsamer Bereich statt getrennter Einzelgespräche

## Behauptungen

- Es ist nach wie vor wichtig, dass Menschen verstehen, wie Code funktioniert
- Agenten schreiben Unmengen an Code; der Sprecher nennt eine persönliche Bestleistung von 50.000 Zeilen
- Code Zeile für Zeile lesen ist nicht mehr der einzige Weg zum Verständnis
- Korrektheit ist letztlich eine Daumen-hoch-oder-runter-Entscheidung
- Agenten werden mit der Zeit immer besser darin, sich selbst zu prüfen
- Die Rolle des Menschen bei der Korrektheitsprüfung nimmt ab — der Sprecher findet das nicht schlimm
- Reichhaltige konzeptionelle Strukturen im Kopf ermöglichen kreative Sprünge, ohne einen Agenten oder Menschen fragen zu müssen
- Neue Ideen zu entwickeln ist der menschliche Teil der Arbeit
- Der Begriff „kognitive Schulden" wurde von der Wissenschaftlerin Margaret Stories populär gemacht; Simon Willison hat darüber gebloggt
- Der Sprecher nutzt seine Funktion explain-diff täglich, ebenso viele Kollegen
- Interaktivität kann eine Krücke sein, geschmackvoll eingesetzt vermittelt sie aber Verständnis, das statische Bilder nicht erreichen
- Lesen ist schwierig und Menschen sind faul
- Andy Matuschak sagt „Bücher funktionieren nicht" — man kann ein Buch lesen, ohne zu merken, dass man es nicht verstanden hat
- Matuschak und Michael Nielsen haben interaktive, verteilte Wiederholungsquizze in Aufsätze eingebaut
- Regel des Sprechers: kein Code geht zur Überprüfung, bevor er das Quiz mit fünf Fragen bestanden hat
- Das Quiz dient als Geschwindigkeitsregler — bei KI dreht sich alles ums Beschleunigen, man muss sich aber auch im Tempo des Verstehens bewegen
- Seymour Papert ließ Kinder einen Roboter namens Schildkröte programmieren, um durchs Programmieren Mathematik zu lernen — nicht um Roboter zu bauen
- Ein reines Migrations-Skript von Claude gab dem Sprecher kein Gespür für die Änderung
- Beim Debuggen der eigenen Mikrowelt bekam der Sprecher ein Gefühl für die Maschine, das man mit einem Agenten allein nicht bekommt
- Agenten können Code schreiben, der uns hilft, Code zu verstehen
- Bei Notion wird an Mehrspieler-Chats geforscht — analog dem Übergang von Einzelchats zu Slack-Kanälen
- Dokumente, über die man gemeinsam sprechen kann, sind ein wirkungsvolles Hilfsmittel: Claude erstellt einen Plan, Teammitglieder kommentieren direkt darin
- Seit der Woche vor dem Vortrag lassen sich Coding-Agenten in Notion integrieren; Claude und Cursor laufen jetzt in Notion
- Das Team des Sprechers erstellt einen Großteil seines Codes direkt in Notion, wegen der Vorteile eines gemeinsamen Arbeitsbereichs
- Alan Kay schrieb vor 50 Jahren den Aufsatz „Ein persönlicher Computer für Kinder jeden Alters"; seine Vision waren Kinder, die Code in einem Videospiel ändern, um Physik zu lernen
- Es ging nie um den Computer, sondern um die Menschen
- Mit KI ist Code kostenlos — kurzlebige Benutzeroberflächen, dynamische Simulationen, Debugger und Spielwiesen sind baubar
- Mit den richtigen Werkzeugen, Denkweise und Kreativität können wir besser verstehen als je zuvor, nicht weniger

## Demos / Schritte

1. explain-diff an einem Videospiel, in dem man Zen-Gärten zeichnet: Perspektive von Top-Down auf isometrisch umgestellt.
2. Beim Ausführen entsteht ein Code-Erklärungsdokument — als HTML- oder Markdown-Datei oder in Notion, weil es dort kollaborativ ist.
3. Das Dokument beginnt mit dem Hintergrund: Systemaufbau, Game-Engine, Koordinatensystem, Subsysteme.
4. Danach die Intuition: das Ziel des Commits in einem Satz, wie eine ausführlichere Commit-Nachricht.
5. Eine interaktive Simulation zum Verschieben von Steinen zeigt Koordinaten und Z-Ebenen live an, umgesetzt als HTML-Block auf einer Notion-Seite.
6. Zum Schluss der Code als literarische Diffs, plus ein Quiz mit fünf Fragen mittleren Schwierigkeitsgrads.
7. Mikrowelt-Beispiel Prolog: Der Sprecher schrieb einen Interpreter und ließ sich von Claude einen Debugger als temporäre Oberfläche bauen — mit Zeitleiste und Kommentarfunktion zur Visualisierung der internen Implementierung.
8. Mikrowelt-Beispiel Website-Migration: statt eines Skripts ein Videospiel — alte Website links, neue rechts, Schritt für Schritt per Knopfdruck, mit Dateistrukturen zur Verfolgung der Verschiebung.

## Genannte Tools

- Notion — Arbeitsbereich für die Erklärungsdokumente, mit HTML-Blöcken auf Seiten und integrierten Coding-Agenten
- explain-diff — selbstgebaute Funktion des Sprechers, die aus einem Diff ein Erklärungsdokument samt Quiz erzeugt; per QR-Code verfügbar in einer HTML- und einer Notion-Variante
- Claude — Coding-Agent, der die Mikrowelten und Pläne erzeugt
- [cursor-cli-als-zweite-harness](obsidian://open?vault=knowledge-base&file=cursor-cli-als-zweite-harness) — Cursor, laut Sprecher inzwischen in Notion integriert
- Slack — als Vergleich für den Übergang von Einzelchats zu gemeinsamen Kanälen
- Prolog — Programmiersprache, für die der Sprecher zum Lernen einen Interpreter implementierte

## Verwandt

- [gefuehrte-code-durchsicht-agenten-features](obsidian://open?vault=knowledge-base&file=gefuehrte-code-durchsicht-agenten-features) — dasselbe Problem: ein Mensch muss agenten-gebauten Code nicht nur abnehmen, sondern verstehen
- [guided code tour - ideensammlung](obsidian://open?vault=knowledge-base&file=guided%20code%20tour%20-%20ideensammlung) — Ideen, wie Code-Änderungen für Menschen erklärend aufbereitet werden
