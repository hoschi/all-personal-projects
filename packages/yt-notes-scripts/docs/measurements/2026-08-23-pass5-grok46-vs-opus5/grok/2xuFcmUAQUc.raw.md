## Worum es geht
Andres von Better Stack stellt Ponytail vor: ein Plugin/Skill für Claude Code, das den Agenten wie den faulsten Senior-Dev die schlankste Lösung bauen lässt. Er erklärt YAGNI und die Decision Ladder, zeigt Benchmarks samt Cache-Vorbehalt und testet Ponytail gegen Default-Claude-Code sowie zusammen mit Caveman.
## Besprochene Konzepte
- [ponytail-skill](obsidian://open?vault=knowledge-base&file=ponytail-skill) — Agent denkt wie der faulste Senior-Dev und sucht die schlankste Lösung statt Bloat.
- YAGNI („you ain't gonna need it“) — nichts bauen, bis es gebraucht wird; keine Abstraktion, Library oder Klasse ohne Bedarf.
- Decision Ladder — vor neuem Code: muss es existieren, reicht die Standardbibliothek, gibt es ein natives Plattform-Feature, liegt schon eine Dependency da, reicht ein One-Liner.
- Natives HTML-`dialog` statt Komponentenbibliothek — Focus-Trap, Escape, Backdrop per CSS; in Major-Browsern seit 2022.
- [claude-code-prompt-caching](obsidian://open?vault=knowledge-base&file=claude-code-prompt-caching) — Benchmarks senden den Skill jedes Mal neu mit; in echten Sessions wird er grob einmal bezahlt und danach gecacht.
- Packaging ist das Produkt — automatisch injizierte Regeln plus Commands, Audit, Review und Debt Ledger, nicht nur drei Wörter im System-Prompt.
- Korrektheit als Benchmark-Gate — ein kaputter One-Liner mit wenig LoC fällt durch.
## Behauptungen
- Ponytail lässt den AI-Coding-Agenten wie den faulsten Senior-Dev im Raum denken; das sei ein Kompliment. (0:00)
- Mission: knapp bleiben, den üblichen Agent-Bloat streichen, die schlankste Lösung finden. (0:48)
- Ähnlich wie Caveman, das Agenten weniger reden und dadurch weniger Tokens verbrauchen lässt. (1:08)
- YAGNI stammt aus den 1990ern: nichts bauen, bis es wirklich gebraucht wird. (1:15)
- Nur wenn jede Sprosse der Decision Ladder „nein“ ist, schreibt der Agent neuen Code — und dann das Minimum. (1:42)
- Ein normaler Agent holt für ein Delete-Confirm-Modal Radix UI React Dialog samt Dependency, Portal, Overlay, Root, Trigger und Content-Wrapper. (2:05)
- Das native `dialog` fängt Fokus, schließt bei Escape, rendert Backdrop mit einem CSS-Selektor und läuft in allen Major-Browsern seit 2022. (2:05)
- Statt rund 30 Zeilen plus NPM-Paket: acht Zeilen, null Dependencies. (2:05)
- Ein Ponytail-Kommentar hält fest, was übersprungen wurde und warum; faul, aber nicht verantwortungslos. (2:05)
- Ponytail behauptet eine Kostenreduktion von 47 bis 77 %. (2:05)
- Benchmark: kein Skill, Caveman, Ponytail; drei Modelle; fünf Alltagsaufgaben; zehn Läufe pro Zelle; Median; plus Korrektheitsprüfung. (3:19)
- Die Benchmark-Kosten sind Single-Shot-Calls, die den vollen Regeltext jedes Mal mitsenden; Ponytail zahlt so die eigenen Instructions in jeder Zelle. (3:55)
- In einer echten Session zahlt man die Instructions grob einmal, danach Cache — die 47–77 % untertreiben den Vorteil. (3:55)
- Laut Colin Eberhardt matcht „Follow YAGNI principles“ den Ponytail-Benchmark fast; „Follow YAGNI principles and one-liner solutions“ schlägt ihn. (4:40)
- Der Sprecher argumentiert: Packaging ist das Produkt; „Follow YAGNI“ im System-Prompt liefert weder Audit noch Review. (4:40)
- Ponytail-Plugin manchmal nicht automatisch gegriffen — deshalb im Demo explizit den Skill anfordern. (5:37)
- Ponytail fertig unter 1 Minute, eine HTML-Datei; Default 2:30, drei Dateien plus Python-Server, stärker überentwickelt. (5:37)
- Default-App sieht gut aus und trifft die API, nimmt die Location aber nicht auf und zeigt London. (6:20)
- Ponytail-App fragt nach der Location und zeigt dazu das Wetter; UI karger, folgt dem Prompt genauer. (6:20)
- Ponytail-Lauf rund 50 % günstiger, deutlich weniger LoC, funktional besser — laut Sprecher Beweis, dass Ponytail trägt. (7:39)
- Caveman plus Ponytail: unter 1 Minute, gleiche Funktionalität, Output ähnlich, etwas teurer als Ponytail allein. (8:04)
- Die Kombination bringt laut Sprecher keine große Verbesserung; bei Caveman bleiben oder besser Ponytail, wenn man den Benchmarks glaubt. (8:04)
- Der Sprecher ist beeindruckt: viele Coding-Lösungen sind überentwickelt; weniger sei mehr, richtig eingesetzt. (8:58)
- Er behält Ponytail als Plugin in seinem Claude-Code-Setup und will es in künftigen Projekten nutzen. (8:58)
## Demos / Schritte
1. Modal-Beispiel aus der Ponytail-Doku: Default-Agent mit Radix-Dialog gegen natives `dialog` (acht Zeilen, kein Paket) plus Kommentar, was bewusst aufgeschoben wurde.
2. Zwei Claude-Code-Instanzen: Ponytail-Plugin nur lokal vs. Default ohne Plugins.
3. Gleicher Prompt: Weather-Dashboard mit Location-Erkennung und aktuellen Wetterdaten.
4. In der Ponytail-Instanz den Skill zusätzlich anfordern, weil er nicht immer von selbst greift.
5. Vergleich: Laufzeit, Dateischnitt (eine HTML-Datei vs. drei Dateien plus Python-Server), Location-Verhalten, Usage/LoC.
6. In einem neuen Verzeichnis Caveman und Ponytail zusammen aktivieren, denselben Prompt erneut laufen lassen, Output und Kosten gegen Ponytail allein halten.
## Genannte Tools
- [ponytail-skill](obsidian://open?vault=knowledge-base&file=ponytail-skill) — Plugin/Skill, das YAGNI und die Decision Ladder in den Agenten injiziert.
- [caveman-skill](obsidian://open?vault=knowledge-base&file=caveman-skill) — Library/Skill, das Agenten weniger reden und Tokens sparen lässt.
- [claude-code-overview](obsidian://open?vault=knowledge-base&file=claude-code-overview) — Harness, in der Andres Ponytail lokal installiert und gegen eine Default-Instanz testet.
- Radix UI React Dialog — Bibliothek, die ein normaler Agent laut Beispiel für ein Confirm-Modal zieht.
## Verwandt
- [[This Claude Skill Cuts Your Token Costs In HALF]] — Vorgänger-Video desselben Kanals zu Caveman, das Andres als Vergleich nennt.
- [skill-libs-overview](obsidian://open?vault=knowledge-base&file=skill-libs-overview) — Katalog der bei KIMS eingebundenen Skill-Repos, darunter Ponytail und Caveman.
- [llm-kosten-effizienz](obsidian://open?vault=knowledge-base&file=llm-kosten-effizienz) — Token-Effizienz und warum Benchmark-Preise den Session-Vorteil nicht abbilden.
- [claude-code-skills](obsidian://open?vault=knowledge-base&file=claude-code-skills) — Skill-Mechanik inkl. Auto-Pickup, den Andres im Demo extra anstoßen muss.
- [antwort-stil-regelwerk](obsidian://open?vault=knowledge-base&file=antwort-stil-regelwerk) — KIMS-eigener knapper Antwort-Stil, Nachfolger des Caveman-lite-Injects.
- [baseui-vs-radix-enterprise](obsidian://open?vault=knowledge-base&file=baseui-vs-radix-enterprise) — Radix-Dialog-Schnitt (Root, Trigger, Portal), den Ponytail im Modal-Beispiel vermeidet.
