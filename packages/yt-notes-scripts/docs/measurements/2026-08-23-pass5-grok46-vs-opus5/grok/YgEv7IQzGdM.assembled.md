# How to Kill the Code Review — Ankit Jain, Aviator

## Worum es geht

Ankit, Mitgründer von Aviator, erklärt, warum Zeile-für-Zeile-Code-Reviews bei steigendem AI-Codevolumen nicht mehr tragen und was an seinem älteren Five-Layer-Trust-Model fehlte. Statt den Diff zu lesen, sollen Teams Alignment (Intent aus der Agent-Session) und semantische Korrektheit (AI Slop Registry plus Verifikation gegen einen Testplan) in einer Schleife halten.

---

## Notizen

[URL](https://www.youtube.com/watch?v=YgEv7IQzGdM)

---

---

## Besprochene Konzepte

- Five-Layer-Trust-Model — Trust schichtweise in den Code legen, damit ohne Zeile-für-Zeile-Review gemerged werden kann; der Sprecher korrigiert das Modell
- Alignment vs. semantic accuracy — Review hat zwei Hälften: Team-Ausrichtung (Wissen, Mentoring, Architektur) und semantische Korrektheit
- Spec-driven development als Wasserfall — Spec vorab, Agent erzeugt Code, Verify; ohne Feedback-Schleife, Spec wird nicht nachgezogen
- Intent in Prompts — die echten Entscheidungen fallen im Dialog mit dem Agenten, nicht nur in Jira, PRD oder Spec
- AI Slop Registry — wiederkehrende Review-Befunde kodifizieren, bis jeder wiederholte Kommentar ein Guardrail ist
- Session → Acceptance Criteria → Testplan — User-Antworten in der Session werden Kriterien; Kriterien plus Invarianten ergeben den Testplan
- Review-Oberfläche wechselt — Intent, Capability und Evidence statt Diff
- Deterministisch wo möglich, LLM wo nötig — LLM als Fallback, nicht als einziges Orakel
- Dark Factories / Orchestrators — vollautomatische Fabriken, in denen niemand auf den Code schaut; der Sprecher hält das für Teamarbeit nicht für den Normalfall
- Behavior-driven development — Testplan auf Englisch, teilbar mit PM und Design; näher an BDD als an klassischem TDD

## Behauptungen

- Aviator baut eine AI-Code-Verifikationsplattform. ([0:00](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=0s))
- Der Sprecher hat vor wenigen Monaten auf LinkedIn ein Five-Layer-Trust-Model vorgestellt; einiges daran war richtig, einiges falsch. ([0:00](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=0s))
- Es gibt 861% Code-Churn, es wird mehr Code produziert. ([1:17](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=77s))
- Das Verhältnis Incidents zu PRs steigt; Reviews sind deshalb nicht wirksam. ([1:17](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=77s))
- Die mediane Review-Zeit steigt. ([1:17](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=77s))
- Der Engpass hat sich vom Coding zum Review verschoben; Coding sei gelöst. ([1:17](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=77s))
- Teams verbringen 4× so viel Zeit wie zuvor nur mit Warten auf Reviews. ([1:17](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=77s))
- Über 30% der Changes werden ohne Review gemerged. ([1:17](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=77s))
- Wenn AI den Code schreibt und AI ihn reviewed und niemand die Reviews liest, ist das falsch konfiguriert. ([1:17](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=77s))
- Formelle Code-Reviews gibt es etwa 15–20 Jahre; 2006 hat Google intern Mondrian eingeführt. ([3:05](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=185s))
- Frühe Windows-Versionen entstanden ohne Reviews. ([3:05](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=185s))
- Review fängt Bugs, Conventions und Security-Probleme — ein großer Teil ist aber Alignment. ([3:05](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=185s))
- Alignment (Knowledge Sharing, Mentorship, Architektur-Feedback, Onboarding, Zusammenarbeit) fehlte im Five-Layer-Model. ([3:05](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=185s))
- Der Vortrag richtet sich an Teams, nicht an Solo-Projekte. ([3:05](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=185s))
- Für semantische Korrektheit lassen sich bessere Tools bauen; Alignment muss überleben. ([3:05](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=185s))
- Spec-driven development ist Wasserfall von 1970: Requirements, Spec, Implement, Verify, ohne Feedback-Schleife. ([4:21](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=261s))
- Teams interagieren deshalb weiter mit Agenten in Sessions, weil die Spec Unklares nicht erfasst. ([4:21](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=261s))
- Während der Implementierung tauchen weitere Issues auf, die Spec wird danach nicht aktualisiert. ([4:21](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=261s))
- Ein LLM ist nicht deterministisch und trifft eigene Entscheidungen. ([4:21](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=261s))
- Spec-driven development ist eine gute Methodik, reicht im Alltag der Softwareentwicklung aber nicht. ([4:21](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=261s))
- Intent lebt im Jira-Ticket, in PRDs und vor allem in den Prompts; dort fallen die User-Entscheidungen. ([5:53](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=353s))
- Nach Pull Request werden die Prompts weggeworfen; das muss sich ändern. ([5:53](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=353s))
- LLMs und AI-Reviewer-Agenten sind bei Bugs nicht zuverlässig. ([6:42](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=402s))
- Dieselben Review-Issues tauchen immer wieder auf; sie lassen sich in einer AI Slop Registry kodifizieren. ([6:42](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=402s))
- Die Registry lernt aus menschlichem Review und liefert mit der Zeit bessere Ergebnisse. ([6:42](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=402s))
- Jeder wiederkehrende Kommentar wird zum Guardrail, den man nicht erneut reviewen muss. ([6:42](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=402s))
- Alignment und semantic accuracy sind zwei Hälften desselben Problems. ([7:58](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=478s))
- Session-Antworten werden zu Acceptance Criteria; zusammen mit der Slop Registry entsteht der Testplan. ([7:58](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=478s))
- Das Verifikationssystem fährt eine Preview hoch und prüft den Testplan end-to-end. ([7:58](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=478s))
- Die neue Review-Oberfläche ist Evidence: Intent, umgesetzte Capability, Verhalten gegen die Acceptance Criteria — nicht Zeile für Zeile. ([7:58](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=478s))
- Die Entscheidungen im Dialog mit dem Agenten machen den Software-Ingenieur wertvoll und lehren Junioren. ([7:58](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=478s))
- Testpläne soll man per LLM erzeugen, weil Erstellung und Pflege schmerzhaft sind. ([7:58](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=478s))
- Criteria plus Invarianten ergeben den Testplan. ([7:58](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=478s))
- Tests entstehen in Echtzeit; man muss laut Sprecher keine Tests pflegen. ([7:58](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=478s))
- Der Mensch im Loop macht Governance und reviewed den Testplan, nicht den Code. ([7:58](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=478s))
- Das liegt näher an Behavior-driven Development als an Test-driven Development; der Testplan ist Englisch und teilbar mit PM und Design. ([7:58](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=478s))
- Daneben gibt es deterministische Verifikation, ob ein Kriterium erfüllt ist. ([7:58](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=478s))
- Das System muss nicht perfekt sein: deterministisch wo es geht, LLM wo es muss. ([11:51](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=711s))
- Beispiel Payment-Formular: ein Agent browsed die App, füllt das Formular, liefert Screenshots und Datenbank-Snapshots als Evidence. ([11:51](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=711s))
- Reviewer reviewen Intent und abgelehnte Alternativen, nicht den Diff. ([11:51](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=711s))
- Den Testplan aus der Session bauen, nicht aus dem Code; sonst fängt derselbe Agent die eigenen Fehler nicht. ([11:51](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=711s))
- Architektur-Diskussionen (Datenmodelle, Service-Schnittstellen) rücken eine Ebene über den Zeilen-Review. ([11:51](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=711s))
- Hausaufgabe: die letzten 1000 Review-Kommentare minen und daraus eine AI Slop Registry für Wiederholbares bauen. ([14:12](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=852s))
- Das folgt einer J-Kurve: der Anfangsaufwand ist real, der Nutzen kommt später. ([14:12](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=852s))
- Aviator pilotiert das Produkt Verify und sucht Early Design Partner. ([14:12](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=852s))
- Eine Sache merken: Code Review ist Alignment. ([14:12](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=852s))

## Demos / Schritte

1. User-Entscheidungen in der Agent-Session festhalten (Rückfragen, Feedback, abgelehnte Alternativen).
2. Daraus Acceptance Criteria erzeugen, auch per LLM.
3. Kriterien plus Invarianten aus der AI Slop Registry zu einem Testplan zusammenziehen (LLM empfohlen).
4. Preview hochfahren, Testplan ausführen, inklusive End-to-End.
5. Evidence sammeln (Screenshots, Datenbank-Snapshots) und dagegen reviewen: Intent und Verhalten, nicht den Diff.

## Genannte Tools

- Aviator — Firma des Sprechers, baut eine AI-Code-Verifikationsplattform
- GitHub — UI, in der AI-Review-Agenten Kommentare hinterlassen
- [claude-code-overview](obsidian://open?vault=knowledge-base&file=claude-code-overview) — interaktive Coding-Session mit dem Agenten
- Codex — interaktive Coding-Session mit dem Agenten
- [[Cursor]] — interaktive Coding-Session mit dem Agenten
- Jira — Ticket als Zielbeschreibung, ein Ort für Intent
- Verify — Aviator-Pilotprodukt: Alignment plus semantische Prüfung über die AI Slop Registry
- Mondrian — internes Google-Review-System ab 2006

## Verwandt

- [goal-verification-workflow](obsidian://open?vault=knowledge-base&file=goal-verification-workflow) — Abnahme gegen eine vorher geschriebene Akzeptanzmatrix, nicht gegen den gebauten Diff
- [gefuehrte-code-durchsicht-agenten-features](obsidian://open?vault=knowledge-base&file=gefuehrte-code-durchsicht-agenten-features) — Review-Oberfläche für agenten-gebauten Code, den ein Mensch verstehen muss
- [process-ai-review-comments-skill](obsidian://open?vault=knowledge-base&file=process-ai-review-comments-skill) — wiederkehrende KI-Review-Kommentare abarbeiten; nah an der AI Slop Registry
- [spec-etappen-workflow](obsidian://open?vault=knowledge-base&file=spec-etappen-workflow) — Spec in Etappen schneiden statt einmal Wasserfall-Spec an den Agenten
- [[Spec Kit Github's NEW tool That FINALLY Fixes AI Coding]] — Spec-Driven-Development-Toolchain, die der Sprecher als Wasserfall kritisiert
- [[How to Build the Most Powerful System for AI Coding (Full Breakdown)]] — Dark Factory, die der Sprecher für Teamarbeit ablehnt
- [[How to build your own AI Code Review Agent from scratch!]] — AI-Review-Agenten, die der Sprecher als ungelesen kritisiert
- [vorlage-last-autonomer-laeufe](obsidian://open?vault=knowledge-base&file=vorlage-last-autonomer-laeufe) — Dark-Factory-Spur und autonome Läufe im KIMS-Bestand
- [ai-browser-assisted-development-testing](obsidian://open?vault=knowledge-base&file=ai-browser-assisted-development-testing) — Agent-Browser-Verifikation mit Screenshots als Evidence
- [community-fr-review-skill](obsidian://open?vault=knowledge-base&file=community-fr-review-skill) — Review-Skill im community-fr-Workflow
- [[Coding mit AI]] — Hub für KI-Coding-Workflows im Shared-Vault
- [autonome-entwicklung-mit-superpowers](obsidian://open?vault=knowledge-base&file=autonome-entwicklung-mit-superpowers) — Review-Disziplin bei Subagent-Driven Development
