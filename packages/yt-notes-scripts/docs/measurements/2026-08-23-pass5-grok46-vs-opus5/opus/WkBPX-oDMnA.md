---
tags:
  - youtube
aliases:
  - Understanding vs. Verifying — explaining docs, comprehension quizzes, and
    microworlds for agent-written code
channelName: AI Engineer
publish_date: 2026-07-10
display_title: Understanding vs. Verifying — explaining docs, comprehension
  quizzes, and microworlds for agent-written code
description: 'Design Engineer Jeffrey Litt (Notion) erklärt, warum menschliches
  Codeverständnis trotz KI-generiertem Code wichtig bleibt – nicht zur
  Korrektheitsprüfung, sondern für kreative Teilnahme am Entwicklungsprozess. Er
  zeigt drei Techniken: automatisch generierte Erklärungsdokumente mit
  Quizfragen (Tool „explainedif"), interaktive Mikrowelten zum Debuggen und
  Verstehen von Code (z. B. Prolog-Interpreter, Website-Migration als Spiel)
  sowie Gemeinschaftsräume für geteiltes Verständnis im Team, inklusive
  Coding-Agenten (Claude, Cursor) direkt in Notion. Relevant für Entwickler und
  Teams, die mit KI-Agenten arbeiten und Strategien suchen, um Code-Verständnis
  trotz hoher Generierungsgeschwindigkeit aufrechtzuerhalten.'
youtube_id: WkBPX-oDMnA
---

# Understanding is the new bottleneck — Geoffrey Litt, Notion

## Worum es geht

Vortrag von Jeffrey Litt (Design Engineer bei Notion) im Rahmen eines Studiengangs „Design Engineering" mit der These, dass Menschen weiterhin verstehen müssen, wie Code funktioniert — auch wenn Agenten den Großteil davon schreiben. Er stellt drei Praktiken vor, mit denen er das Verständnis für agenten-geschriebenen Code aufrechterhält.

---

## Notizen

[URL](https://www.youtube.com/watch?v=WkBPX-oDMnA)

---

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
