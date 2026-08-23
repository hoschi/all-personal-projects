## Nicht gedeckte Aussagen
### Fassung A
- **Konzepte, Harness:** „Hülle aus Orchestrierung, Sandbox, Loops und Review-Bots um das Modell“ (`/tmp/claude/p5/j-Ib5GBkD555M.md:218`). Transkript 5:52 nennt „orchestration and a harness and a sandbox and a model and computer use“ (`…md:130`). Loops stehen dort als eigener Schritt (`…md:132`), Review-Bots nur früher als „adversarial review on enough of our PR bots“ (`…md:106`). Die vier Teile als Definition der Harness sind so nicht gesagt.
- **Behauptungen, Addy-Zitat:** „Zitat von Addy, wortgleich übernommen: ein Side-Project, das ein Dutzend Leute nutzen, und ein zehn Jahre altes Enterprise-System teilen fast keine nennenswerten Constraints.“ (`…md:244`). Transkript 7:30 ist länger und anders: „A developer vibe coding a side project a dozen people will ever run, and a team keeping a 10-year-old enterprise system alive for another quarter share almost no constraints worth naming.“ (`…md:138`). Es ist eine Kürzung, nicht wortgleich; „nutzen“ ≠ „will ever run“; „alive for another quarter“ fehlt.
- **Behauptungen, Juli 2025:** „Im Juli 2025 ging Human Layer full lights-off; es blieb mindestens ein Issue, das der Agent nicht löste, die Site lag, User waren verärgert, der Code war Slop.“ (`…md:247`). Transkript 7:30: „in July 2025, we tried this. We went full lights off“ — danach zweite Person: „if you have tried this seriously for a number of months, you probably found at least one issue“; „your site was down, your users were pissed“; Slop nur über „if you were like me“ (`…md:142`). Site-down, „mindestens ein Issue“ und User-Ärger sind nicht als Fakten des HL-Versuchs gesagt.
- **Behauptungen, Bybop:** „Modelle kommentieren Tests aus, setzen unnötige try/catch und Casts, nur damit Tests grün werden (Beispiel von Bybop).“ (`…md:256`). Transkript 10:12: Tests auskommentieren begründet das Rückgängigmachen von Test-Änderungen (`…md:168`); try/catch ist ein eigenes Sprecher-Beispiel (`…md:170`); Bybop nur für Casts (`…md:170`).
- **Behauptungen, Workspace:** „ein ‚Figma for Claude Code‘ und ein Codex-artiger gemeinsamer Workspace“ (`…md:269`). Transkript 17:16: ein Ding — „sort of a Figma for Claude Code and Codex-style collaborative workspace“ (`…md:206`).
### Fassung B
- **Behauptungen, CLI-Agenten vor Claude Code:** „Es gab vor Claude Code schon gute CLI-Agenten wie Aider und Codebuff“ (`…md:355`). Transkript 10:12: „Cuz they were great — CLI agents before Claude Code. You had Aider, you had Codebuff.“ (`…md:156`). „they were great“ antwortet auf die Umsatzfrage zu Claude Code; über Aider/Codebuff steht nur, sie hatten dieselben Tools.
Zaehlung: A=5 B=1
## Eigene Spekulation
### Fassung A
- keine Fundstelle
### Fassung B
- **Behauptungen:** „Human Layer hat im Juli 2025 selbst voll auf Lights-off umgestellt und ist damit gescheitert“ (`…md:350`). Der Sprecher setzt „this does not work“ / „why software factories fail“ (`…md:138`) und erzählt den Versuch; das Urteil „gescheitert“ über den HL-Lauf zieht die Fassung.
- **Konzepte, Loop/Token Maxing:** „die Haltung, mehr Schleifen und mehr Token zu fahren, statt die Ursache zu beheben“ (`…md:327`). Transkript 0:00/1:28 beschreibt die Erzählung „spend more tokens“ / Skill Issue (`…md:100`, `…md:104`). „statt die Ursache zu beheben“ ist die Deutung der Fassung.
Zaehlung: A=0 B=2
## Fehlende wichtige Inhalte
### Fassung A
- Program Design sei im agentischen Arbeiten unterbewertet; nach der Architektur könne das Modell nicht einfach loslegen (Transkript 14:58, `…md:192`; in B `…md:371`).
- Man könne den Code weiter lesen und trotzdem schnell bleiben (13:18: „stuck reading the code, but we can still move pretty fast“, `…md:182`; in B `…md:369`).
- Ein guter PR sei eine Freude zu reviewen (17:16, `…md:200`; in B `…md:374`).
- Sweep Marathon habe „sophisticated reward channel stuff“ (13:18, `…md:178`; in B Tools `…md:408`).
- Das Gegen-Narrativ: Harness plus adversarial Review-Bots ergebe „10 to 100x faster, high quality“ ohne Code-Review (1:28, `…md:106`). Fehlt in beiden.
- Incidents und User-Feedback direkt in die Factory; aufwachen mit PR; Job = Queue füllen (5:52, `…md:132`). Fehlt in beiden.
- Mario (AI Engineer Europe) als Quelle für die Ausfälle (1:28, `…md:104`). Fehlt in beiden.
- Benchmarks und Verifier seien verschiedene, getrennte Datensätze (13:18, `…md:176`). Fehlt in beiden.
- Abschluss: Loops nutzen, Hebel suchen, harte Probleme unter Constraints lösen (17:16, `…md:204`). Fehlt in beiden.
### Fassung B
- Viele Firmen behaupten, eine Agent-Factory shippe 75 % ihres Codes (5:52, `…md:128`; in A `…md:240`).
- 2022 planten Teams vorab, um Rework und Zeile-für-Zeile-Review zu senken (3:36, `…md:124`; in A `…md:239`).
- Die Standardantwort „you're holding it wrong“ / Skill Issue, mit „maybe you are, but that's not the point“ (1:28, `…md:104`; in A `…md:236`).
- Lights-off-Begriff laut Sprecher von Dentsu Bureau (5:52, `…md:134`; in A `…md:242`).
- Calvin French-Owen, MTS bei Codex zum Launch (10:12, `…md:160`; in A `…md:287`).
- Design Partners, Founding Engineers in San Francisco, bald bessere Verifier (17:16, `…md:206`; in A `…md:268`–`270`).
- Dieselben fünf gemeinsamen Lücken wie bei A: 10–100×/adversarial Review; Factory-Intake; Mario; Benchmarks ≠ Verifier; Abschlussrat.
Zaehlung: A=9 B=11
## Praezision
- **9-Milliarden-Umsatz.** A: „von nichts auf 4 Milliarden und seiner Einschätzung nach auf 9 Milliarden“ (`…md:251`). B: „von null auf 4 Milliarden und inzwischen 9 Milliarden“ (`…md:354`). Transkript: „from nothing to 4 billion and I think now they're at 9 billion“ (`…md:156`). A näher.
- **Tests auskommentieren vs. try/catch vs. Casts.** B trennt: Auskommentieren begründet das Zurücknehmen der Test-Änderungen (`…md:359`); try/catch und Casts extra (`…md:361`). A verklumpt und hängt Bybop an alles (`…md:256`). Transkript `…md:168`–`170`. B korrekt.
- **Juli 2025.** B: HL stellte um (`…md:350`); wer es Monate versucht, findet mindestens ein unlösbares Issue und muss in ungelesenen Code (`…md:351`). A macht Site-down und „mindestens ein Issue“ zu Fakten des HL-Versuchs (`…md:247`). Transkript `…md:142`. B näher.
- **Harness-Teile.** B: „Orchestrierung, Sandbox, Modell und Werkzeuge“ (`…md:326`). A: Loops und Review-Bots in der Hülle (`…md:218`). Transkript `…md:130`. B näher.
- **Workspace.** B: „eine Art Figma für Claude-Code- und Codex-Arbeitsweise“ (`…md:377`). A spaltet in zwei Dinge (`…md:269`). Transkript `…md:206`. B näher.
- **OpenAI-Nachteil.** A: „ohne Weights und ohne RL in der eigenen Harness“ (`…md:253`). B: nur „ohne eigene Modellgewichte“ (`…md:357`). Transkript `…md:158`. A vollständiger.
- **20 % Rework.** A: „laut Sprecher großzügig für viel AI-Slop“ (`…md:266`). B: Last ohne diese Einschränkung (`…md:375`). Transkript `…md:200`. A näher.
- **„probably write it“.** A: „würde es vermutlich selbst schreiben“ (`…md:261`). B: „hätte es ihn gleich geschrieben“ (`…md:367`). Transkript `…md:180`. A näher.
- **Codebases.** B: „schneller als je zuvor“ (`…md:343`). A: „schneller als zuvor“ (`…md:234`). Transkript: „faster than they ever have before“ (`…md:104`). B näher.
- **Faros, Merge ohne Review.** B: „ganz ohne Review gemerged“ (`…md:345`). A: „viele PRs ohne Review“ (`…md:235`). Transkript: „merged without any review at all“ (`…md:104`). B näher.
- **Addy-Zitat, Inhalt.** A behält „ein Dutzend Leute“ (`…md:244`). B spricht nur vom „Nebenprojekt“ (`…md:348`). Inhaltlich trägt A mehr vom Zitat; die Marke „wortgleich“ ist falsch (siehe oben).
- **Claude Code vs. Vorgänger.** A: dieselben Tools, Unterschied = Training gegen die Auslieferungs-Harness (`…md:252`). B nennt die Vorgänger „gute CLI-Agenten“ (`…md:355`) und hat dafür „zum ersten Mal ein Modell-Labor“ (`…md:356`). Erste-Lab-Klausel in B näher am Transkript `…md:156`; „gute“ ist falsch.
- **Deep Sweep „never built“.** A: „große Aufgaben auf OSS-Repos, die so nie gebaut wurden“ (`…md:259`). B kann „die … nie real gebaut wurden“ auf die Repos lesen (`…md:365`). Transkript `…md:178` ist mehrdeutig; A hängt „nie gebaut“ klarer an die Aufgaben.
- **Shotgun surgery.** B: „eine Änderung an einer Stelle bricht andere Stellen“ (`…md:329`) folgt dem Sprecher (`…md:148`). A: „eine Änderung zwingt zu vielen anderen Stellen“ (`…md:223`) ist eher Fowler-Lehrbuch. B näher am Gesagten.
## Regelverstoesse
### Fassung A
- keine Fundstelle (Reihenfolge Worum → Konzepte → Behauptungen → Demos → Tools → Verwandt; Demos und Tools haben Anlass; keine Vorrede, keine fremde Überschrift, Deutsch)
### Fassung B
- keine Fundstelle (dieselbe Sektionsfolge und dieselben Anlässe; keine Vorrede, keine fremde Überschrift, Deutsch)
## Urteil
- Treue: B besser — A hat fünf nicht gedeckte Verzerrungen (Harness-Definition, „wortgleich“, Juli-2025-Verklumpung, Bybop, Workspace-Split), B eine (Aider/Codebuff als „gute“ Agenten).
- Vollstaendigkeit: A besser — A trägt 75 %, Dentsu Bureau, 2022-Vorplanung, „holding it wrong“, Calvin, Hiring/Verifier; B lässt diese weg und hat dafür drei eigene Argument-Schritte, bleibt aber hinter der Zahl benannter Lücken.
- Praezision: B besser — B trennt Juli-Versuch und „if you tried“, Bybop-Casts und Test-Undo, Harness-Teile und den einen Workspace; A ist nur bei Hedges (9 Mrd, 20 % Slop, „vermutlich“) und der OpenAI-Doppelbedingung knapper am Wortlaut.
- Regeltreue: gleichwertig — beide erfüllen die Sektionsvorgaben ohne Vorrede oder fremde Überschrift.
