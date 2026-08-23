## Nicht gedeckte Aussagen

### Fassung A

- Sektion "Worum es geht": „spricht auf einer Konferenz darüber, wie klassische Zeile-für-Zeile-Code-Reviews abgelöst werden können". Das Transkript nennt keinen Veranstaltungstyp. Belegt ist nur „Thanks for joining in", „this talk" und der Nebensatz „I think Dex was talking about yesterday" — daraus folgt ein mehrtägiges Format, aber „Konferenz" steht nirgends. Hinzugedichteter Rahmen, wenn auch harmlos.
- Sektion "Behauptungen": „Wenn AI den Code schreibt und AI ihn reviewt, ist ein UI-basierter Review-Prozess auf GitHub die falsche Konfiguration (1:17)". Verdreht. Das Transkript stellt die UI-Frage nur rhetorisch („why are we doing it in a UI?") und fällt sein Urteil an anderer Stelle und über etwas anderes: „when AI reviews and nobody reads, we have configured the wrong thing." Falsch konfiguriert ist laut Sprecher, dass niemand liest — nicht, dass es eine Oberfläche gibt. Fassung A hängt das Urteil an das UI und lässt „nobody reads" als Bedingung weg (A hat den Punkt separat als eigene Zeile, aber ohne die Verknüpfung).

Zaehlung: A=2

### Fassung B

- Sektion "Verwandt": „[[Spec Kit Github's NEW tool That FINALLY Fixes AI Coding]] — Spec-Driven-Development-Toolchain, die der Sprecher als Wasserfall kritisiert". Der Sprecher kritisiert bei 4:21 spec-driven development als Methodik; ein Werkzeug namens Spec Kit kommt im ganzen Transkript nicht vor. Die Kritik an diesem konkreten Werkzeug ist dem Sprecher untergeschoben. (Bewertet wird die Aussage über den Sprecher, nicht der Link.)
- Sektion "Verwandt": „[[How to Build the Most Powerful System for AI Coding (Full Breakdown)]] — Dark Factory, die der Sprecher für Teamarbeit ablehnt". Das Transkript sagt bei 3:05 nur: „you're not likely using completely dark factories or orchestrators where nobody looks at the code" — eine Aussage über die vermutete Praxis des Publikums, keine Ablehnung. „ablehnt" ist eine Verschärfung. (Dasselbe Wort steht in B auch im Konzept-Eintrag milder als „hält das für Teamarbeit nicht für den Normalfall" — dort ist es gedeckt, hier nicht.)
- Sektion "Demos / Schritte", Schritt 3: „Kriterien plus Invarianten aus der AI Slop Registry zu einem Testplan zusammenziehen". Das Transkript koppelt zwei Dinge getrennt: „The acceptance criteria then tied with your AI slop registry ... finally creates a test plan" und „criteria plus invariants is what makes the test plan". Woher die Invarianten kommen, sagt der Sprecher nicht. B macht die Registry zur Quelle der Invarianten — ein hinzugedichteter Zusammenhang.

Zaehlung: B=3

## Eigene Spekulation

### Fassung A

- Keine Fundstelle. A referiert durchgehend Sprecher-Aussagen; die Konzept-Glossen bleiben beschreibend, die "Verwandt"-Anmerkungen beziehen sich auf die Vault-Artikel, nicht auf zusätzliche Schlüsse über das Video.

Zaehlung: A=0

### Fassung B

- Sektion "Besprochene Konzepte": „Deterministisch wo möglich, LLM wo nötig — LLM als Fallback, nicht als einziges Orakel". Der Zusatz „nicht als einziges Orakel" ist eine eigene Zuspitzung; das Transkript sagt bei 11:51 nur „This is where you use LLM as a fallback" und „Not every system can be built 100% on deterministic systems". Schwacher Fund — die Aussagerichtung stimmt, die Formulierung ist Deutung des Modells, kein Sprecherwort.

Zaehlung: B=1

## Fehlende wichtige Inhalte

### Fassung A

- Was Aviator baut: „At Aviator, we are building an AI code verification platform" (0:00). A nennt nur „Mitgründer von Aviator" und führt in "Genannte Tools" „Aviator Verify" — dass die Firma eine AI-Code-Verifikationsplattform baut, fehlt. Der Leser braucht es, um die Produktnennung am Ende einzuordnen.
- Herkunft des Five-Layer-Trust-Models: „a few months ago, I wrote a post on LinkedIn about how to kill code review, creating a framework, a five-layer trust model" (0:00). A erwähnt das Modell, nicht seinen Ursprung und nicht das „a few months ago".
- Adressat des Vortrags: „if you're doing solo coding, working as a solo project, this is not a talk for you. If you are working in teams..." (3:05). Fehlt in A vollständig. Es ist die Geltungsbedingung des ganzen Arguments.
- Dark Factories / Orchestrators: „you're not likely using completely dark factories or orchestrators where nobody looks at the code" (3:05). Fehlt in A vollständig.
- Wozu die Session-Entscheidungen dienen: „This is how you teach your junior engineers how to improve over time. These are the decisions which make a software engineer valuable today" (7:58). Fehlt in A. Das ist die Begründung, warum die Session-Erfassung mehr ist als Werkzeug-Mechanik.
- Wie die Registry besser wird: „Think of this as doing more training on top of the standard LLM that you have extracted, built on top of" (6:42). Fehlt in A — und ebenso in B (siehe unten). A hat „lernt über Zeit", nennt den Mechanismus aber nicht.

Zaehlung: A=6

### Fassung B

- Die Kernthese des Einstiegs: „when we think about like how long will it take us to actually stop reading code line by line? And the reality is we've already stopped reviewing it" (0:00). B hat sie nirgends — weder in "Worum es geht" noch in den Behauptungen. Fassung A führt sie ("Wir haben faktisch bereits aufgehört, Code zu lesen"). Das ist der Aufhänger des Vortrags.
- Zuschreibung an Dex: „I think Dex was talking about yesterday" (11:51). B gibt den Inhalt wieder („sonst fängt derselbe Agent die eigenen Fehler nicht"), lässt aber offen, dass der Sprecher sich auf einen anderen Vortrag beruft.
- Der Kumulationseffekt: „This compounds with every merged PR" (14:12). Fehlt in B; A hat ihn.
- Wirkung der Belege: „you're creating more solid evidence, which now a reviewer can look at and build more confidence that this actually works" (11:51). B nennt Screenshots und DB-Snapshots als Evidence, nicht aber, wozu sie dienen. A hat den Punkt.
- Alter von TDD: „It's been over 20 years since we came up with test-driven development" (7:58). B nennt BDD und TDD im Vergleich, lässt die Zahl weg; A hat sie.
- Wie die Registry besser wird: „Think of this as doing more training on top of the standard LLM" (6:42). Fehlt auch in B.

Zaehlung: B=6

## Praezision

- Falsch konfiguriert ist was? — A: „Wenn AI den Code schreibt und AI ihn reviewt, ist ein UI-basierter Review-Prozess auf GitHub die falsche Konfiguration". B: „Wenn AI den Code schreibt und AI ihn reviewed und niemand die Reviews liest, ist das falsch konfiguriert." Transkript (1:17): „when AI reviews and nobody reads, we have configured the wrong thing." **B korrekter** — A verschiebt das Urteil auf die Oberfläche.
- Review-Dauer und Wartezeit — A: „Die mediane Review-Dauer steigt; Entwickler warten 4x so lange wie früher" (eine Zeile, zwei Aussagen verschmolzen). B: zwei getrennte Zeilen, „Die mediane Review-Zeit steigt" und „Teams verbringen 4× so viel Zeit wie zuvor nur mit Warten auf Reviews". Transkript nennt beides getrennt. **B genauer** in der Trennung; „Entwickler"/„Teams" ist bei beiden eine Auflösung des transkribierten „you".
- Warum die Spec veraltet — A: „Specs werden nach der Implementierung nicht mehr aktualisiert". B: „Während der Implementierung tauchen weitere Issues auf, die Spec wird danach nicht aktualisiert." Transkript (4:21): „as you implement, you identify more issues, and you never go back and update the spec". **B vollständiger** — A lässt den Grund weg.
- Determinismus-Argument — A: „LLMs sind nicht deterministisch, deshalb folgt aus einer fertigen Spec kein bestimmter Code". B: „Ein LLM ist nicht deterministisch und trifft eigene Entscheidungen." Transkript: „Once the spec is done, you expect the code will come deterministically. But guess what? LLM is not deterministic. It's going to make decisions itself." **A trägt die Schlusskette des Sprechers mit, B den Nachsatz** — beide gedeckt, zusammen erst vollständig.
- Herkunft der Invarianten — A: „Akzeptanzkriterien mit der gepflegten AI Slop Registry und den Invarianten zum Testplan verbinden" (Registry und Invarianten nebeneinander). B: „Kriterien plus Invarianten aus der AI Slop Registry". **A korrekter** — das Transkript ordnet die Invarianten der Registry nicht zu.
- Windows — A: „Die ersten Windows-Versionen wurden ohne Reviews gebaut". B: „Frühe Windows-Versionen entstanden ohne Reviews." Transkript: „Windows back in the day — the first versions — was actually built without reviews." **A näher am Wortlaut** („die ersten" vs. „frühe").
- Dex-Beleg — A: „Der Sprecher verweist auf Dex vom Vortag: baut derselbe Agent Code und Testplan, findet der Testplan keine Fehler". B: „Den Testplan aus der Session bauen, nicht aus dem Code; sonst fängt derselbe Agent die eigenen Fehler nicht." **A präziser in der Zuschreibung**, verliert dabei aber die Absicherung des Sprechers („I think ... was talking about yesterday") und behauptet den Verweis als Tatsache.
- TDD-Alter — A: „Test-Driven Development ist über 20 Jahre alt; der Ansatz liegt näher an Behavior-Driven Development". B: „Das liegt näher an Behavior-driven Development als an Test-driven Development". **A präziser** (Zahl erhalten), **B präziser in der Gegenüberstellung** (nennt beide Pole explizit).
- Payment-Beispiel — A: „ein Agent bedient die App, macht Screenshots und prüft zusammen mit DB-Snapshots, ob das Kriterium erfüllt ist". B: „ein Agent browsed die App, füllt das Formular, liefert Screenshots und Datenbank-Snapshots als Evidence." Transkript (11:51) enthält beides: Formular ausfüllen **und** die Prüfung gegen das Kriterium. **Gleichwertig** — A hat den Prüfschritt, B den Bedienschritt.

## Regelverstoesse

### Fassung A

- Keine Fundstelle. Sektionsreihenfolge vollständig und korrekt ("Worum es geht", "Besprochene Konzepte", "Behauptungen", "Demos / Schritte", "Genannte Tools", "Verwandt"), "Worum es geht" umfasst zwei Sätze, Demos und Tools haben Anlass (vorgeführter Ablauf bzw. genannte Werkzeuge), keine Vorrede, keine fremde Überschrift, Sprache durchgehend deutsch mit englischen Fachbegriffen im Original.

### Fassung B

- Sprache, mehrere Stellen: englische Verben und Alltagswörter, die keine Fachbegriffe sind, stehen unübersetzt im deutschen Satz — „ein Agent browsed die App" (Demos/Behauptungen 11:51), „die letzten 1000 Review-Kommentare minen" (Behauptungen 14:12), „AI ihn reviewed" (Behauptungen 1:17), „Reviewer reviewen Intent" (11:51). Die Regel erlaubt Fachbegriffe, Produkt- und Befehlsnamen im Original; konjugierte englische Verben fallen nicht darunter. Milder Verstoß gegen „Sprache deutsch".
- Sektionsreihenfolge, Anzahl der Sätze in "Worum es geht", Anlass für Demos und Tools, keine Vorrede, keine fremde Überschrift: alles korrekt. Die fehlenden Leerzeilen zwischen Überschrift und Inhalt sind Formatierung, kein Regelverstoß nach den Vorgaben.

## Urteil

- Treue: **A besser** — A hat zwei nicht gedeckte Stellen und keine eigene Spekulation, B drei nicht gedeckte (zwei davon schieben dem Sprecher Wertungen über konkrete fremde Werkzeuge unter) plus eine milde eigene Zuspitzung.
- Vollstaendigkeit: **gleichwertig** — beide Fassungen lassen je sechs belegbare Punkte aus, mit gegenläufigem Zuschnitt: A verliert die Geltungsbedingung des Vortrags (Teams statt Solo, Dark Factories) und den Zweck der Session-Erfassung, B verliert die Einstiegsthese „wir haben bereits aufgehört zu reviewen", die Dex-Zuschreibung und drei Detailzahlen.
- Praezision: **A besser** — bei neun verglichenen Stellen liegt A fünfmal näher am Wortlaut (Invarianten, Windows, TDD-Alter, Dex-Zuschreibung, Determinismus-Schluss), B dreimal (Fehlkonfigurations-Urteil, Trennung Review-Dauer/Wartezeit, Grund für die veraltete Spec), eine ist gleichwertig.
- Regeltreue: **A besser** — A verletzt keine der geprüften Vorgaben, B mischt an mehreren Stellen konjugierte englische Verben in den deutschen Satz und trifft damit „Sprache deutsch" leicht.
