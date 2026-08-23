---
tags:
  - youtube
aliases:
  - AI Code Review — session-to-acceptance-criteria statt Diff-basierter Prüfung
channelName: AI Engineer
publish_date: 2026-08-17
display_title: AI Code Review — session-to-acceptance-criteria statt Diff-basierter Prüfung
description: 'Ankit Jain erklärt, warum klassisches zeilenweises Code-Review
  faktisch beendet ist und was an dessen Stelle treten muss. Er zeigt sein
  überarbeitetes Fünf-Schichten-Vertrauensmodell, kritisiert spec-driven
  development als Wasserfall-Rückfall und schlägt stattdessen vor,
  Coding-Sessions in Akzeptanzkriterien und ein per KI generiertes Testplan
  umzuwandeln, ergänzt durch eine selbstlernende "AI-Slop-Registry" aus
  wiederkehrenden Review-Kommentaren, verifiziert gegen eine Live-Preview.
  Konkrete Substanz: Tools wie Claude Code, Codex, Cursor als Session-Quelle,
  das eigene Verify-Produkt von Aviator als Verifikationssystem, Screenshot- und
  Datenbank-Snapshots als Evidenz. Relevant für Engineering-Teams und
  Tooling-Entscheider, die KI-gestützte Reviews einführen und dabei
  Wissensaustausch und Architektur-Feedback nicht verlieren wollen.'
youtube_id: YgEv7IQzGdM
---

# How to Kill the Code Review — Ankit Jain, Aviator

## Worum es geht

Ankit, Mitgründer von Aviator, spricht auf einer Konferenz darüber, wie klassische Zeile-für-Zeile-Code-Reviews abgelöst werden können. Sein Vortrag korrigiert ein früheres „Five-Layer-Trust-Model" und stellt Alignment und semantische Genauigkeit als die zwei Hälften des Review-Problems dar.

---

## Notizen

[URL](https://www.youtube.com/watch?v=YgEv7IQzGdM)

---

## Besprochene Konzepte

- Five-Layer-Trust-Model — Schichtweiser Vertrauensaufbau, damit Code ohne Zeile-für-Zeile-Review gemergt werden kann.
- Alignment als Review-Zweck — Review ist auch Wissenstransfer, Mentoring, Architektur-Feedback, Onboarding und Zusammenarbeit.
- Semantische Genauigkeit — die Bug-/Konventions-/Sicherheits-Hälfte des Reviews, die durch bessere Werkzeuge automatisierbar ist.
- Spec-Driven Development — Spec schreiben, Agent generiert Code, danach verifizieren.
- Wasserfall-Analogie — Requirements → Spec → Implementierung → Verifikation ohne Rückkopplung, wie 1970.
- Intent — die eigentliche Absicht, verteilt über Jira-Ticket, PRD und vor allem die Prompts der Coding-Session.
- AI Slop Registry — kodifizierte, wiederkehrende Review-Kommentare als automatisch geprüfte Guardrails.
- Session → Akzeptanzkriterien → Testplan — die Entscheidungen aus der Agenten-Session werden zu Kriterien, Kriterien plus Invarianten zum Testplan.
- Verifikations-System — spinnt eine Preview hoch, fährt den Testplan und liefert Belege statt Diff.
- Review Surface — statt des Diffs werden Intent, Akzeptanzkriterien und Verifikationsbelege geprüft.
- „Deterministic where you can, LLM where you must" — deterministische Prüfung als Standard, LLM nur als Rückfallebene.
- Behavior-Driven Development — Testpläne in natürlicher Sprache, an denen auch Produkt und Design teilnehmen können.
- J-Curve — Aufbau der Registry kostet erst Zeit, zahlt sich erst später aus.

## Behauptungen

- Code Churn liegt bei 861 %; es wird immer mehr Code produziert ([1:17](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=77s))
- Das Verhältnis von Incidents zu PRs steigt — heutige Reviews sind also nicht wirksam ([1:17](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=77s))
- Die mediane Review-Dauer steigt; Entwickler warten 4x so lange wie früher ([1:17](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=77s))
- Der Engpass hat sich vom Coding zum Review verschoben; Coding gilt als gelöst ([1:17](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=77s))
- Über 30 % der Änderungen werden heute komplett ohne Review gemergt ([1:17](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=77s))
- Wir haben faktisch bereits aufgehört, Code zu lesen ([0:00](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=0s))
- Wenn AI den Code schreibt und AI ihn reviewt, ist ein UI-basierter Review-Prozess auf GitHub die falsche Konfiguration ([1:17](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=77s))
- Menschen überfliegen AI-Review-Ergebnisse nur noch und mergen ([1:17](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=77s))
- Code Reviews sind erst 15 bis 20 Jahre alt ([3:05](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=185s))
- Google startete 2006 intern Mondrian und machte formales Code Review zur Norm ([3:05](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=185s))
- Die ersten Windows-Versionen wurden ohne Reviews gebaut ([3:05](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=185s))
- Alignment war das fehlende Stück im Five-Layer-Model des Sprechers ([3:05](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=185s))
- Für semantische Genauigkeit lassen sich bessere Werkzeuge bauen, Alignment muss überleben ([3:05](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=185s))
- Spec-Driven Development entspricht dem Wasserfallmodell von 1970 und hat keinen Rückkopplungs-Weg ([4:21](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=261s))
- Entwickler nutzen weiterhin Coding-Sessions, weil die Spec Lücken lässt ([4:21](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=261s))
- Specs werden nach der Implementierung nicht mehr aktualisiert ([4:21](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=261s))
- LLMs sind nicht deterministisch, deshalb folgt aus einer fertigen Spec kein bestimmter Code ([4:21](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=261s))
- Spec-Driven Development ist eine gute Methodik, greift im Alltag aber zu kurz ([4:21](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=261s))
- Intent lebt heute vor allem in den Prompts — dort fallen die echten Entscheidungen ([5:53](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=353s))
- Prompts werden beim Anlegen des Pull Requests weggeworfen; das muss sich ändern ([5:53](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=353s))
- LLMs sind bei semantischer Genauigkeit ebenfalls nicht gut; AI-Reviewer sind nicht immer korrekt ([6:42](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=402s))
- Beim manuellen Review werden dieselben Punkte immer wieder gefunden ([6:42](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=402s))
- Eine AI Slop Registry lernt über Zeit aus den Review-Rückmeldungen der Menschen ([6:42](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=402s))
- Jeder wiederkehrende Kommentar wird zu einem Guardrail, den man nicht erneut reviewen muss ([6:42](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=402s))
- Die Erstellung von Testplänen ist schmerzhaft — dafür empfiehlt der Sprecher ein LLM ([7:58](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=478s))
- Bei neuen Features müssen keine Tests gepflegt werden, weil sie in Echtzeit entstehen ([7:58](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=478s))
- Der Wert des Menschen liegt in Governance und dem Review des Testplans, nicht des Codes ([7:58](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=478s))
- Test-Driven Development ist über 20 Jahre alt; der Ansatz liegt näher an Behavior-Driven Development ([7:58](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=478s))
- Testpläne in Englisch können mit Produktmanagern und Designern geteilt werden ([7:58](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=478s))
- Das System muss nicht perfekt sein; nicht alles lässt sich deterministisch bauen ([11:51](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=711s))
- Beispiel neues Zahlungsformular: ein Agent bedient die App, macht Screenshots und prüft zusammen mit DB-Snapshots, ob das Kriterium erfüllt ist ([11:51](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=711s))
- Belege geben dem Reviewer mehr Zuversicht, dass es tatsächlich funktioniert ([11:51](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=711s))
- Reviewer prüfen den Intent, nicht den Diff — inklusive dessen, was verworfen wurde ([11:51](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=711s))
- Der Testplan muss aus der Session stammen, nicht aus dem Code ([11:51](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=711s))
- Der Sprecher verweist auf Dex vom Vortag: baut derselbe Agent Code und Testplan, findet der Testplan keine Fehler ([11:51](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=711s))
- Die Diskussion verschiebt sich eine Ebene nach oben auf Architektur und Datenmodelle ([11:51](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=711s))
- Hausaufgabe: die letzten 1.000 Review-Kommentare auswerten und daraus eine AI Slop Registry bauen ([14:12](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=852s))
- Der Effekt verstärkt sich mit jedem gemergten PR ([14:12](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=852s))
- Der Aufbau folgt einer J-Kurve; der Schmerz am Anfang ist real ([14:12](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=852s))
- Kernaussage: Code Review geht nicht um Code Review, sondern um Alignment ([14:12](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=852s))
- Aviator pilotiert ein neues Produkt namens Verify und sucht Design-Partner ([14:12](https://www.youtube.com/watch?v=YgEv7IQzGdM&t=852s))

## Demos / Schritte

1. Die Coding-Session mit dem Agenten führen und die Nutzer-Entscheidungen aus dem Hin und Her festhalten.
2. Diese Entscheidungen — per LLM — in Akzeptanzkriterien überführen.
3. Akzeptanzkriterien mit der gepflegten AI Slop Registry und den Invarianten zum Testplan verbinden.
4. Testplan vom Menschen reviewen lassen (Governance-Punkt statt Code-Review).
5. Verifikations-System spinnt eine Preview hoch und fährt den Testplan durch.
6. Wo möglich deterministisch prüfen, sonst per Agent: Formular ausfüllen, Screenshots und DB-Snapshots als Belege sammeln.
7. Reviewer prüft Intent, Akzeptanzkriterien und die gesammelten Belege statt des Diffs.

## Genannte Tools

- [claude-code-overview](obsidian://open?vault=knowledge-base&file=claude-code-overview) — als Beispiel für eine Coding-Session mit Agent-Interaktion genannt.
- [[Cursor]] — ebenfalls als Beispiel für eine genutzte Coding-Umgebung genannt.
- Codex — als weiteres Beispiel für Coding-Sessions genannt.
- GitHub — Oberfläche, in der die AI-Reviews heute stattfinden.
- Jira — Ort des Tickets, in dem das Ziel formuliert wird.
- Google Mondrian — 2006 intern gestartetes Werkzeug, das formales Code Review etablierte.
- Aviator Verify — das pilotierte Verifikations-Produkt des Sprechers.

## Verwandt

- [[How to build your own AI Code Review Agent from scratch!]] — anderes Video zum Bau eines AI-Review-Agenten statt Zeile-für-Zeile-Review.
- [process-ai-review-comments-skill](obsidian://open?vault=knowledge-base&file=process-ai-review-comments-skill) — Verarbeitung wiederkehrender Review-Kommentare, das Gegenstück zur AI Slop Registry.
- [goal-verification-workflow](obsidian://open?vault=knowledge-base&file=goal-verification-workflow) — unabhängige Abnahme gegen eine vorab geschriebene Akzeptanzmatrix statt gegen den Diff.
- [gefuehrte-code-durchsicht-agenten-features](obsidian://open?vault=knowledge-base&file=gefuehrte-code-durchsicht-agenten-features) — geführte Durchsicht als Review-Oberfläche jenseits des reinen Diffs.
- [ai-code-quality-research](obsidian://open?vault=knowledge-base&file=ai-code-quality-research) — Befundlage zur Qualität KI-generierten Codes, Hintergrund zu Churn und Incident-Zahlen.
- [ai-browser-assisted-development-testing](obsidian://open?vault=knowledge-base&file=ai-browser-assisted-development-testing) — Agent bedient den Browser und sammelt Belege, wie im Zahlungsformular-Beispiel.
