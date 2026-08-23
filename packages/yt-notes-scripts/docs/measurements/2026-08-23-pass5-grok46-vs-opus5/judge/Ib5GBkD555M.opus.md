Vorbemerkung zur Zaehlung: Anmerkungen in "## Verwandt" beschreiben den
verlinkten Vault-Artikel, nicht das Video. Sie sind am Transkript grundsaetzlich
nicht pruefbar und bleiben in allen Zaehlungen unten ausgeschlossen — in beiden
Fassungen gleich behandelt.

## Nicht gedeckte Aussagen

### Fassung A

- Sektion "Behauptungen": "Im Juli 2025 ging Human Layer full lights-off; es
  blieb mindestens ein Issue, das der Agent nicht loeste, die Site lag, User
  waren veraergert, der Code war Slop. (7:30)" — Das Transkript trennt zwei
  Dinge. Als Human-Layer-Tatsache steht dort nur: "in July 2025, we tried this.
  We went full lights off." Die Folgen sind ein Bedingungssatz in der zweiten
  Person ueber andere: "if you have tried this seriously for a number of months,
  you probably found at least one issue that the agent couldn't solve … your
  site was down, your users were pissed." A macht daraus einen Bericht ueber den
  eigenen Betrieb. Nur "if you were like me, you were probably miserable reading
  all this slop code" stuetzt den Slop-Teil.
- Sektion "Besprochene Konzepte": "Shotgun surgery — Fowler-Code-Smell: eine
  Aenderung zwingt zu vielen anderen Stellen" — Das Transkript definiert es
  anders herum: "it becomes really, really hard to make a change in one part of
  the codebase without breaking other parts of the codebase" (8:56). A setzt die
  Lehrbuch-Definition ein, nicht die des Sprechers.
- Sektion "Behauptungen": "Modelle kommentieren Tests aus, setzen unnoetige
  try/catch und Casts, nur damit Tests gruen werden (Beispiel von Bybop).
  (10:12)" — Bybop wird im Transkript nur fuer das Cast-Beispiel genannt: "I
  think Bybop gave us this example earlier of casting things to other things".
  Das Auskommentieren der Tests ist ein eigener Einschub des Sprechers ("I'm
  sure you've seen models comment out tests"), das try/catch-Beispiel ohne
  Zuschreibung. A buendelt drei Quellen unter einen Namen.

### Fassung B

- Sektion "Behauptungen": "Human Layer hat im Juli 2025 selbst voll auf
  Lights-off umgestellt und ist damit gescheitert (7:30)" — Das Wort
  "gescheitert" faellt im Transkript nicht; dort steht "we tried this. We went
  full lights off" plus die These "I am going to posit that this does not work"
  (7:30). Geringe Schwere: die Schlussfolgerung zieht der Sprecher selbst, B
  formuliert sie nur als berichtete Tatsache ueber die Firma.
- Sektion "Behauptungen": "Claude Code ging in unter einem Jahr von null auf 4
  Milliarden und inzwischen 9 Milliarden Umsatz (10:12)" — Die zweite Zahl ist
  im Transkript ausdruecklich geschaetzt: "from nothing to 4 billion and I think
  now they're at 9 billion in revenue in under a year". B stellt die Schaetzung
  als Tatsache hin.

Zaehlung: A=3 B=2

## Eigene Spekulation

### Fassung A

- Keine Fundstelle. A markiert jede Deutung des Sprechers als solche ("laut
  Sprecher", "Der Sprecher setzt", "Der Sprecher vermutet", "seiner Einschaetzung
  nach") und fuegt im Textkoerper keine eigene Deutung, keinen eigenen Schluss
  und keine Vorausschau hinzu.

### Fassung B

- Keine Fundstelle. Auch B bleibt im Textkoerper bei dem, was der Sprecher
  selbst folgert; Stellen wie "statt die Ursache zu beheben" (Loop Maxing) oder
  "wuesste das Modell, wie guter Code aussieht, haette es ihn gleich
  geschrieben" geben Argumente des Sprechers wieder, nicht eigene.

Zaehlung: A=0 B=0

## Fehlende wichtige Inhalte

### Fassung A

- Agentisches Code-Review und agentische Regressionstests als Zwischenschritt:
  "we bring in agentic code review. We bring in agentic regression testing, and
  it makes this part faster, but it's probably still the bottleneck" (5:52). A
  nennt nur die Dauern, nicht diesen Loesungsversuch und sein Scheitern am
  Engpass. B hat ihn im Konzept-Eintrag "Agentic Software Factory".
- Die Schleife der 2022er-Fabrik als Ablauf: Tracker (Linear/Jira/Beads) →
  jemand baut → Tests → Pull Request mit Checks und menschlichem Review →
  Produktion → Nutzer melden Bugs und Wuensche → Monitoring weckt Engineers um
  3 Uhr → zurueck an den Anfang (3:36–5:52). A hat daraus nur die Dauern und die
  Tracker-Namen in "Genannte Tools"; der Kreislauf, auf dem der ganze
  Fabrik-Vergleich aufbaut, fehlt.
- Program Design ist unterbewertet: "something that I think is really
  under-emphasized in agentic coding these days … I think people assume that
  once you get the architecture right, the model can just cook" (14:58). A
  fuehrt Program Design als Konzept und Ablaufschritt, laesst aber die Aussage
  weg, warum der Sprecher ihn eigens betont.
- Der konkrete Ausfall-Mechanismus: "you just have to go and dig into that
  codebase that you stopped reading 3 months ago to try to figure out what's
  broken" (7:30). A nennt nur das Ergebnis, nicht den Grund, warum Lights-off im
  Stoerfall teuer wird. B hat den Punkt.
- Sweep Marathon hat ausgefeilte Reward-Kanaele: "they have some sophisticated
  reward channel stuff" (13:18). Fehlt in A, steht in B ("differenzierten
  Reward-Kanaelen"). Geringes Gewicht.

### Fassung B

- Die 75-Prozent-Behauptung: "Every company and their mother is talking about
  how they built a coding agent factory that ships 75% of their code now"
  (5:52). Fehlt in B vollstaendig; A hat sie.
- Herkunft des Lights-off-Begriffs: "Dentsu Bureau coined this" (5:52). B nennt
  das Konzept ohne Urheber.
- Das Zeitverhaeltnis, das den Engpass begruendet: "now the building part takes
  minutes or hours, but this human part still takes hours or days if you're
  going to review the code and test the changes" (5:52). Fehlt in B; A hat es
  als eigene Behauptung.
- Der Ausblick der Firma: "soon to be better verifiers for software quality"
  (17:16). Fehlt in B; A hat es. Relevant, weil es die Antwort des Sprechers auf
  die selbst benannte Luecke ist.
- Der Schluss-Aufruf: "We are talking to design partners. We are hiring founding
  engineers here in San Francisco … these slides are live … You can try Human
  Layer at humanlayer.com" (17:16). B hat nur "kostenlos fuer kleine Teams"; A
  hat Design Partners, Hiring und die Adresse.
- Calvin French-Owen namentlich als Quelle der zitierten Folien: "I'm going to
  cite a couple slides from my buddy Calvin French-Owen, who was a MTS on Codex
  during the initial launch" (10:12). B schreibt nur "ein frueherer MTS des
  Launch-Teams". Geringes Gewicht.
- Der Fokus von Human Layer: "At Human Layer, what we care about is how do we
  help people solve hard problems in complex codebases" (7:30). Fehlt in B; A
  hat es. Das ist die Abgrenzung, mit der der Sprecher den Geltungsbereich
  seiner These absteckt.

### In beiden Fassungen fehlend (zaehlt fuer A und B)

- Mario auf der AI Engineer Europe: "Our friend Mario at AI Engineer Europe
  begged us to slow down because companies that should not be having outages
  because of coding agents are having outages" (1:28). Beide Fassungen nennen
  den Befund, keine die benannte Quelle.
- Die Ausbaustufe vor Lights-off: "we can route all incidents straight into the
  factory … You can take all the user feedback and just stick it straight into
  the factory" (5:52). Fehlt in beiden; damit fehlt der Schritt, an dem der
  Mensch als Filter aus der Schleife faellt.
- Der ausdrueckliche Vorbehalt zu Benchmarks: "yes, I know benchmarks and
  verifiers are different and they actually have to be separate data sets, but
  they're shaped the same and the structure of these benchmarks is directionally
  correct" (13:18). Fehlt in beiden; ohne ihn liest sich der Benchmark-Abschnitt
  strenger, als der Sprecher ihn meint.
- Der Verweis auf horizontale Plaene: "I've talked a little bit about how models
  have horizontal plans … you can go watch our talk from AI Engineer Miami"
  (14:58). Fehlt in beiden. Geringes Gewicht.

Zaehlung: A=9 B=11 (davon je 4 aus dem gemeinsamen Block)

## Praezision

- Claude-Code-Umsatz (10:12). A: "ging laut Sprecher in unter einem Jahr von
  nichts auf 4 Milliarden und seiner Einschaetzung nach auf 9 Milliarden
  Umsatz". B: "ging in unter einem Jahr von null auf 4 Milliarden und inzwischen
  9 Milliarden Umsatz". Transkript: "I think now they're at 9 billion". A haelt
  die Abstufung zwischen belegter und geschaetzter Zahl, B nicht. A praeziser.
- Juli-2025-Erfahrung (7:30). A: "Im Juli 2025 ging Human Layer full lights-off;
  … die Site lag, User waren veraergert". B: zwei getrennte Punkte — "Human
  Layer hat im Juli 2025 selbst voll auf Lights-off umgestellt" und "Wer es
  ernsthaft ueber Monate versucht, findet mindestens ein Problem, das der Agent
  nicht loesen kann". B bildet die Trennung zwischen Eigenbericht und
  Bedingungssatz des Transkripts ab. B praeziser.
- Shotgun Surgery (8:56). A: "eine Aenderung zwingt zu vielen anderen Stellen".
  B: "eine Aenderung an einer Stelle bricht andere Stellen". Transkript: "hard
  to make a change in one part … without breaking other parts". B praeziser.
- Auskommentierte Tests (10:12). A: fuehrt es als Modellverhalten neben
  try/catch und Casts, mit Bybop als Quelle. B: "Modelle kommentieren Tests aus,
  nur damit etwas durchlaeuft — deshalb werden im Benchmark alle Aenderungen an
  Testdateien zurueckgenommen". B gibt die Kausalitaet des Transkripts wieder
  ("We undo all the changes it made to any test files cuz I'm sure you've seen
  models comment out tests"), A nur die Aufzaehlung. B praeziser im Mechanismus;
  A praeziser darin, ueberhaupt eine Quelle zu nennen — allerdings mit falscher
  Reichweite, siehe oben.
- Reward-Bedingung im Trainings-Set (10:12). A: "Reward 0/1 fuer Fix ohne
  Regression". B: "binaerem Reward", die zweite Bedingung erst in einem anderen
  Punkt ("Belohnung nur, wenn alte und neue Tests bestehen"). Das Transkript
  nennt beide Bedingungen zusammen: "did you fix the problem … And did you do it
  without breaking anything else?" A praeziser in einer Zeile, inhaltlich
  gleichwertig.
- Brownfield (7:30). A: "historisch alte Java-Systeme; der Sprecher setzt die
  Schwelle schon bei 3–6 Monaten". B: "Arbeit an gewachsenen, komplexen
  Codebasen, abgegrenzt vom Wegwerf-Nebenprojekt". Das Transkript definiert den
  Begriff ueber die Herkunft: "which historically has meant like some 10-year-old
  Java thing". A praeziser im Konzept-Eintrag; B holt die 3–6 Monate in den
  Behauptungen nach.
- Lights-off-Urheberschaft (5:52). A: "Begriff laut Sprecher von Dentsu Bureau".
  B: ohne Zuschreibung. A praeziser.
- Faros-AI-Befund (1:28). A: ein Punkt mit allen fuenf Zahlenaussagen. B: drei
  getrennte Punkte. Inhaltlich deckungsgleich, gleichwertig.

## Regelverstoesse

### Fassung A

- Kein Verstoss. Alle sechs Sektionen in der vorgegebenen Reihenfolge, keine
  Vorrede, keine fremde Ueberschrift, durchgehend deutsch, Timestamps gesetzt
  (optional erlaubt).
- Grenzfall ohne Verstoss: "Genannte Tools" fuehrt StrongDM (Firma), Figma
  (Vergleichsbild) und Fastlane (Beispiel-Repo in der Trainingsaufgabe) als
  Tools. Alle drei werden im Vortrag genannt, sind aber keine besprochenen
  Werkzeuge.
- Sprachlicher Fehler ohne Regelbezug: "ein Modell, das gutes Code aussehen
  kennen wuerde" (Behauptungen, 13:18) ist grammatisch defekt.

### Fassung B

- Kein Verstoss. Sechs Sektionen in der vorgegebenen Reihenfolge, keine Vorrede,
  keine fremde Ueberschrift, durchgehend deutsch, Timestamps als Links
  (optional erlaubt).
- Grenzfall ohne Verstoss: In "Demos / Schritte" sind die Schritte 1–3 die
  allgemeine RL-Erklaerung ("coding agent reinforcement learning in 60 seconds")
  und erst 4–8 der vorgefuehrte Ablauf an Fastlane. Der Sprecher fuehrt beides in
  einem Zug vor, die Zusammenfassung ist vertretbar.

## Urteil

- Treue: B besser — A hat drei nicht gedeckte Stellen, darunter eine
  substanzielle Fehlzuschreibung (Bedingungssatz des Transkripts als
  Human-Layer-Bericht), B nur zwei von geringer Schwere.
- Vollstaendigkeit: A besser — B fehlen sieben eigene Punkte gegenueber fuenf bei
  A, darunter die 75-Prozent-Behauptung, das Zeitverhaeltnis Bauen/Review und der
  gesamte Schlussteil zu Human Layer.
- Praezision: A besser — A haelt Zahlen-Abstufungen, Urheberschaften und
  Quellennamen genauer (9 Milliarden als Schaetzung, Dentsu Bureau, Bybop,
  Brownfield-Herkunft); B ist an drei Stellen genauer (Bedingungssatz,
  Shotgun-Surgery-Definition, Test-Ruecknahme als Folge).
- Regeltreue: gleichwertig — beide Fassungen halten Sektionsmenge, Reihenfolge,
  Sprache und Verbot der Vorrede ein; je ein Grenzfall ohne Verstoss.
