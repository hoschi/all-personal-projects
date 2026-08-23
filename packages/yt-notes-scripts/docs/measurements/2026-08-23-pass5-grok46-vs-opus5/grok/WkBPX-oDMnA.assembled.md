# Understanding is the new bottleneck — Geoffrey Litt, Notion

## Worum es geht

Vortrag von Jeffrey Litt, Designingenieur bei Notion, vor einem Studiengang Design Engineering. These: Menschen müssen weiterhin verstehen, wie Code funktioniert — auch wenn Agenten Unmengen davon schreiben —, und zwar über Erklärungen, Quiz und Mikrowelten statt nur über Zeile-für-Zeile-Lesen.

---

## Notizen

[URL](https://www.youtube.com/watch?v=WkBPX-oDMnA)

---

---

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
