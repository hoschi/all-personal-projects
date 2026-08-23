---
tags:
  - youtube
aliases:
  - "Claude Code Agent Teams: Setup, Prompting und Live-Demo"
channelName: Nate Herk | AI Automation
publish_date: 2026-03-23
display_title: "Claude Code Agent Teams: Setup, Prompting und Live-Demo"
description: Das Video zeigt, wie Claude Code Agent Teams — parallele,
  untereinander kommunizierende KI-Agenten innerhalb einer Claude-Code-Session —
  eingerichtet und effektiv eingesetzt werden. Demonstriert werden das
  Aktivieren via `settings.local.json` (Umgebungsvariable), die Prompt-Struktur
  für Team-Erstellung (Ziel, Rollen, Übergabe-Logik, Deliverables), der
  tmux-Split-Pane-Modus zur Live-Beobachtung einzelner Agenten sowie Dos/Don'ts
  wie Datei-Ownership, 3–5 Agenten max., Plan-Approval-Modus und sauberes
  Shutdown-Protokoll. Relevant für Entwickler, die komplexe Aufgaben mit
  mehreren spezialisierten Rollen (z. B. Frontend-, Backend-Dev + QA) parallel
  bearbeiten wollen, ohne auf sequenzielle Sub-Agenten angewiesen zu sein.
youtube_id: vDVSGVpB2vc
---

# How to Build Claude Agent Teams Better Than 99% of People

## Worum es geht

Eine Erklär- und Demo-Session zum experimentellen Claude-Code-Feature „Agent Teams": Ein Haupt-Orchestrator spawnt mehrere spezialisierte Agenten, die parallel arbeiten, sich gegenseitig Nachrichten schicken und eine gemeinsame Task-Liste teilen. Der Sprecher zeigt Setup, Prompting, Dos & Don'ts und wann man das Feature besser nicht einsetzt.

---

## Notizen

[URL](https://www.youtube.com/watch?v=vDVSGVpB2vc)

---
Am Anfang macht es bestimmt Sinn, wenn er es schon explizit anspricht, eine Zusammenfassung der Dokumentationsseite in der Knowledge Base zu erzeugen. Aber bei ihm waren das 700 Zeilen. Hier müsste man also wieder mit Hooks und dergleichen arbeiten, um ein token-effizienteres System zu kreieren, wenn man das wirklich at scale benutzen möchte. Was ich mir auf jeden Fall aus meinem täglichen Setup vorstellen könnte, wäre ein dedizierter Agent, der die Knowledge Base durchsucht und eben die ganzen Hooks und Tools nutzt anstelle des Hauptagenten, damit der das auslagern kann. Genauso könnte ich mir für das Schreiben bzw. Editieren von Artikeln einen zweiten vorstellen, der sich eben nur mit den Regeln auseinandersetzt. Die Frage ist halt, ob die wirklich so gut kommunizieren können, damit da nichts auf der Strecke bleibt. Vielleicht muss man hier auch nochmal eine Research laufen lassen, was andere schon an Problemen mit den Agent Teams herausgefunden haben. Das wäre nämlich auch eines meiner direkten Probleme mit dem Setup. Der Plan Approval Mode hört sich aber sehr sinnvoll an, damit ein Agent nicht irgendetwas macht, was gar keinen Sinn ergibt.

---

## Besprochene Konzepte

- Agent Teams — ein Team Lead (Haupt-Session) erzeugt mehrere spezialisierte Agenten, die parallel arbeiten und eine geteilte Task-Liste haben
- Sub-Agents (Abgrenzung) — arbeiten unabhängig und liefern ihr Einzelergebnis an die Main-Session zurück, ohne Querkommunikation
- Team Lead / Orchestrator — die Main-Session managt die Teammates wie ein Projektmanager und sichert Qualität
- Geteilte Task-Liste — alle Teammates teilen sich dieselbe To-do-Liste
- Direct Messaging zwischen Teammates — Teammates kommunizieren direkt miteinander, ohne den Umweg über die Main-Session
- QA-Feedback-Loop — ein QA-Agent findet Mängel und schickt die Arbeit zur Überarbeitung an die anderen Agenten zurück
- Permission-Vererbung — [01-permission-modes](obsidian://open?vault=knowledge-base&file=team-setup-docs%2Fsicherheit%2F01-permission-modes) — Teammates erben die Permissions der Main-Session
- Plan Approval Mode — Teammates planen erst und müssen ihren Plan genehmigt bekommen, bevor sie ausführen
- Graceful Shutdown — Teammates bestätigen Abschluss/Speichern, statt sofort force-gekillt zu werden

## Behauptungen

- Agent Teams sind eines der mächtigsten KI-Agent-Features, das der Sprecher je genutzt hat — aber man muss es richtig einsetzen ([0:00](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=0s))
- In der Demo fand der QA-Agent drei kritische Issues; nach einem zweiten Durchlauf der beiden Dev-Agenten waren alle gelöst und das Team hat die Landing Page quasi one-shot gebaut ([0:00](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=0s))
- Der große Unterschied zu Sub-Agents: bei Agent Teams gibt es einen Team Lead/Projektmanager und Teammates können direkt miteinander reden ([1:24](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=84s))
- Zum Aktivieren reicht eine Environment-Variable in den Projekt-Settings; das Feature ist experimentell und standardmäßig deaktiviert ([2:29](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=149s))
- Empfehlung: Claude Code vorab auf die Agent-Teams-Doku „trainieren", indem man die Doku als lokale Master-Reference im docs-Ordner als Markdown ablegt — das macht Nachschlagen schneller ([2:29](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=149s))
- Agent Teams sind teurer und etwas langsamer, liefern bei richtigem Einsatz aber deutlich höhere Qualität ([4:32](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=272s))
- Man kann Agent Teams per natürlicher Sprache aufrufen, Muster: „Erstelle ein Team aus X Agenten mit Modell Y" (Haiku, Sonnet oder Opus) ([4:32](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=272s))
- Beim Prompten zuerst ein Ziel etablieren, weil die Agenten beim Aufwachen keinen Kontext außer dem Prompt der Main-Session haben ([4:32](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=272s))
- Do: jeder Agent besitzt seine eigenen Dateien, sonst überschreiben sich die Agenten gegenseitig ([6:30](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=390s))
- Do: Output definieren und Empfänger benennen; Don't: vage Deliverables, keine Annahmen wer mit wem redet ([6:30](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=390s))
- Empfehlung: etwa drei bis fünf Teammates, keine großen Swarms mit 10+ — das wäre 10× teurer ([6:30](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=390s))
- Teammates bekommen initial keinen History-Kontext, können aber alle Projektdateien lesen ([6:30](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=390s))
- tmux-Variante zeigt die Agenten farbcodiert im Split-Pane (blau/grün/gelb) und erlaubt das individuelle Anschreiben einzelner Teammates ([10:15](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=615s))
- Teammates erben die Permissions der Main-Session (z.B. bypass permissions, erlaubte Bash-Commands) ([11:45](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=705s))
- Teammates können alle Dateien, MCP-Server und Skills der Session nutzen ([11:45](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=705s))
- Plan Approval Mode: Teammates müssen ihren Plan genehmigen lassen, bevor sie ausführen — entweder durch die Main-Session, einen Reviewer-Teammate oder den User selbst ([11:45](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=705s))
- Pitfall-Fix: Tools vorab erlauben (pre-approve), wenn Agenten ständig nach Permissions fragen ([13:12](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=792s))
- Pitfall-Fix: File-Owner zuweisen, wenn Deliverables nicht holistisch wirken ([13:12](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=792s))
- Pitfall-Fix: weniger Agenten nutzen, wenn zu viele Tokens verbraucht werden ([13:12](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=792s))
- Pitfall-Fix: Agenten alles als temporäre Datei speichern lassen, wenn sie Arbeit verlieren ([13:12](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=792s))
- Agent Teams nutzen, wenn etwas komplex ist und mehrere spezialisierte, parallel arbeitende Agenten braucht, die aufeinander reagieren und kommunizieren ([14:05](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=845s))
- Nicht nutzen bei sequenziellen, voneinander abhängigen Schritten, bei Arbeit an denselben Dateien, bei nur einem benötigten Kontext-Fenster oder einfachen Tasks — dann eher Sub-Agents ([14:05](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=845s))
- Drei Sessions bedeuten dreifache Kosten; der Sprecher bleibt bei maximal zwei bis fünf Agenten ([14:05](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=845s))
- Shutdown heißt sauberes Speichern der Arbeit; ein Teammate kann signalisieren „noch nicht fertig, nicht abschalten" ([14:05](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=845s))

## Demos / Schritte

1. **Setup:** Offizielle Agent-Teams-Doku öffnen, das dort gezeigte JSON kopieren und Claude Code anweisen, es in die lokalen Projekt-Settings zu schreiben — es entsteht ein `.claude`-Ordner mit `settings.local.json` und der aktivierenden Variable.
2. **Master-Reference anlegen:** Doku-URL an Claude geben und einen „Master Reference Guide for Agent Teams" im `docs`-Ordner als Markdown erstellen lassen (lokales Nachschlagewerk für spätere Builds).
3. **Neuroflow-Demo:** Team „Neuroflow" aus drei Sonnet-Agenten (Frontend-Dev, Backend-Dev, QA) für eine Landing Page einer fiktiven AI-Startup; QA findet drei kritische Issues, Arbeit geht zurück an die beiden Devs, zweiter QA-Pass besteht.
4. **Research-Team-Demo (VS Code):** Drei Agenten (Researcher, Strategist, Critic) räumen den Workspace auf; man kann pro Agent den Spawn-Prompt einsehen; Ergebnis ist ein Doc „Agent Teams Patterns" mit 11 identifizierten Doku-Lücken.
5. **tmux-Demo:** Gleicher Team-Prompt im tmux-Terminal; Agenten erscheinen farbcodiert im Split-Pane und lassen sich einzeln direkt ansprechen, beobachten und freigeben.

## Genannte Tools

- [claude-code-overview](obsidian://open?vault=knowledge-base&file=claude-code-overview) — Coding-Agent, in dem das Agent-Teams-Feature läuft (im Video meist in der VS-Code-Extension genutzt)
- VS Code — Editor, in dem die Claude-Code-Extension verwendet wird
- tmux — Terminal-Multiplexer, um die Agenten im farbigen Split-Pane sichtbar zu machen und einzeln anzusprechen
- Sonnet, Haiku, Opus — Claude-Modelle, die man pro Team auswählen kann

## Verwandt

- [claude-code-hooks-overview](obsidian://open?vault=knowledge-base&file=claude-code-hooks-overview) — listet die Agent/Team-Hook-Events (`SubagentStart`, `TeammateIdle`, `TaskCreate` …), die genau dieses Feature instrumentieren
- [skill-army](obsidian://open?vault=knowledge-base&file=skill-army) — paralleles Multi-Agent-Pattern in Git-Worktrees, konzeptuell verwandt mit dem parallelen Arbeiten der Teammates
- [[Claude Code Dynamic Workflows Clearly Explained]] — grenzt Dynamic Workflows explizit gegen Sub-Agents und Agent Teams ab
