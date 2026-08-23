# How to Build Claude Agent Teams Better Than 99% of People

## Worum es geht

Erklär- und Demo-Video zum experimentellen Claude-Code-Feature Agent Teams: Die Hauptsitzung spawnt spezialisierte Teammates, die parallel arbeiten, eine gemeinsame Task-Liste teilen und einander direkt Nachrichten schicken. Der Sprecher zeigt Aktivierung, Prompt-Muster, Demos in VS Code und tmux sowie Dos/Don’ts, Fallstricke und wann Teams gegenüber Sub-Agents die falsche Wahl sind.

---

## Notizen

[URL](https://www.youtube.com/watch?v=vDVSGVpB2vc)

---
Am Anfang macht es bestimmt Sinn, wenn er es schon explizit anspricht, eine Zusammenfassung der Dokumentationsseite in der Knowledge Base zu erzeugen. Aber bei ihm waren das 700 Zeilen. Hier müsste man also wieder mit Hooks und dergleichen arbeiten, um ein token-effizienteres System zu kreieren, wenn man das wirklich at scale benutzen möchte. Was ich mir auf jeden Fall aus meinem täglichen Setup vorstellen könnte, wäre ein dedizierter Agent, der die Knowledge Base durchsucht und eben die ganzen Hooks und Tools nutzt anstelle des Hauptagenten, damit der das auslagern kann. Genauso könnte ich mir für das Schreiben bzw. Editieren von Artikeln einen zweiten vorstellen, der sich eben nur mit den Regeln auseinandersetzt. Die Frage ist halt, ob die wirklich so gut kommunizieren können, damit da nichts auf der Strecke bleibt. Vielleicht muss man hier auch nochmal eine Research laufen lassen, was andere schon an Problemen mit den Agent Teams herausgefunden haben. Das wäre nämlich auch eines meiner direkten Probleme mit dem Setup. Der Plan Approval Mode hört sich aber sehr sinnvoll an, damit ein Agent nicht irgendetwas macht, was gar keinen Sinn ergibt.

---

---

## Besprochene Konzepte

- [claude-code-agent-teams](obsidian://open?vault=knowledge-base&file=claude-code-agent-teams) — experimentelles Feature: Team-Lead plus Teammates mit geteilter Task-Liste und Peer-Kommunikation
- Sub-Agents — arbeiten unabhängig und liefern ihr Ergebnis nur an den Hauptagenten zurück, ohne sich untereinander abzustimmen
- Team-Lead / Orchestrator — die Claude-Code-Hauptsitzung, die Teammates anlegt, die Task-Liste führt und Qualität prüft
- Shared Task List — gemeinsame Aufgabenliste, die alle Teammates sehen
- Send Message / Direct Messaging — Teammates schreiben einander direkt, ohne die Hauptsitzung als Mittler
- Plan Approval Mode — Teammates planen zuerst; Freigabe durch den Lead, den Menschen oder einen Reviewer-Teammate, erst dann Ausführung
- Permission- und Kontext-Vererbung — Teammates erben Permissions, Dateien, MCP-Server und Skills der Hauptsitzung, bekommen aber beim Start keine History
- File Ownership / Territory — jeder Agent besitzt eigene Dateien und Deliverables, damit sich Arbeit nicht überschreibt
- Parallelität statt Kette — Teams arbeiten gleichzeitig und kommunizieren durchgängig; reine 1-2-3-Abfolgen sind laut Sprecher eher Sub-Agents
- Natural-Language-Prompt — Ziel, Teamgröße, Modell, Rollen, Deliverables und namentliche Nachrichten-Empfänger in Alltagssprache
- Sauberes Shutdown — die Hauptsitzung schickt einen Shutdown-Request; Teammates speichern und bestätigen, statt hart beendet zu werden

## Behauptungen

- Der Sprecher nennt Agent Teams eines der mächtigsten AI-Agent-Features, die er je genutzt hat; man müsse sie richtig einsetzen. ([0:00](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=0s))
- Im Eröffnungs-Prompt stand nur, eine Landing Page für ein fiktives AI-Startup zu bauen; Copy, Animationen, Farbschema und dynamische Inhalte kamen vom Team. ([0:00](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=0s))
- Der Sprecher sagt, am Ergebnis sei nicht alles perfekt und man würde nachiterieren. ([0:00](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=0s))
- Sub-Agents arbeiten unabhängig und schicken ihr Ergebnis an den Hauptagenten; Agent Teams haben einen Team-Lead, eine Shared Task List und Peer-Kommunikation. ([1:24](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=84s))
- Der große Unlock sei, dass Teammates einander direkt anschreiben können, etwa bei Abhängigkeiten oder QA-Rückweisungen. ([1:24](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=84s))
- Agent Teams sind standardmäßig aus, weil das Feature experimentell ist; Aktivierung über eine Variable in der `settings.json`. ([2:29](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=149s))
- Im Demo-Projekt entstand `.claude/settings.local.json` mit dieser Einstellung. ([2:29](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=149s))
- Der Sprecher legt lokale Markdown-Doku aus der offiziellen Agent-Teams-URL in `docs/` an, damit Claude Code nicht ständig nachschlagen muss. ([2:29](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=149s))
- Agent Teams sind teurer und langsamer, liefern bei richtigem Einsatz aber höhere Qualität. ([4:32](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=272s))
- Aufruf geht in Alltagssprache: Team aus X Agenten mit Modell Haiku, Sonnet oder Opus, plus Rollen. ([4:32](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=272s))
- Beim Aufwachen haben Agenten keinen Kontext, nur den Prompt der Hauptsitzung. ([4:32](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=272s))
- Deshalb zuerst ein Ziel setzen, damit Teammates wissen, worauf sie hinarbeiten und warum die anderen da sind. ([4:32](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=272s))
- Do: jeder Agent besitzt konkrete Dateien; sonst überschreiben sie sich. ([6:30](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=390s))
- Do: Output klar definieren, keine vagen Deliverables. ([6:30](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=390s))
- Do: Empfänger namentlich nennen, nicht annehmen, die Agenten wüssten von selbst, wen sie anschreiben. ([6:30](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=390s))
- Do: etwa drei bis fünf Teammates; keine Schwärme von 10+, das sei auch zehnmal teurer. ([6:30](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=390s))
- Do: vollen Kontext geben, weil keine History mitgegeben wird; Dateien im Projekt können sie trotzdem lesen. ([6:30](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=390s))
- In der Claude-Code-Extension sieht man Denken und Tun der Agenten nicht unter der Haube. ([10:15](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=615s))
- Im Terminal mit tmux sieht man die Agenten arbeiten und kann sie einzeln anschreiben. ([10:15](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=615s))
- Unter Windows braucht tmux einen Workaround. ([10:15](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=615s))
- Drei Kernregeln: eigene Datei-Territorien, Direct Messaging ohne Mittler, parallele Arbeit statt reiner Staffel. ([11:45](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=705s))
- Eine reine Staffel (Agent 1 übergibt an 2, 2 an 3) rechtfertigt laut Sprecher oft kein Agent Team. ([11:45](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=705s))
- Teammates erben die Permissions der Hauptsitzung, inklusive Bypass Permissions und freigegebener Bash-Befehle. ([11:45](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=705s))
- Dateien, MCP-Server und Skills der Hauptsitzung stehen allen Teammates zur Verfügung. ([11:45](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=705s))
- Plan Approval Mode: Teammates müssen ihren Plan vom Hauptagenten freigeben lassen, bevor sie ausführen. ([11:45](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=705s))
- Der Sprecher hält es für besser, die Hauptsitzung freigeben zu lassen, nicht jeden Plan selbst; alternativ ein Plan-Reviewer-Teammate. ([11:45](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=705s))
- Agenten bleiben an Permissions hängen: betroffene Tools in den Projekt- oder Local-Settings vorab erlauben. ([13:12](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=792s))
- Deliverables wirken nicht ganzheitlich oder werden überschrieben: File Owner zuweisen. ([13:12](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=792s))
- Ein Agent sitzt untätig: im Prompt jedem Agenten Arbeit oder eine Abhängigkeit geben. ([13:12](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=792s))
- Zu viele Tokens: weniger Agenten. ([13:12](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=792s))
- Arbeit geht verloren: Zwischenergebnisse in temporäre Dateien schreiben, die später wieder gelesen werden. ([13:12](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=792s))
- Falsche Freigaben: anfangs selbst freigeben, bis der Ablauf klar ist. ([13:12](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=792s))
- Teams lohnen bei mehreren Spezialgebieten, paralleler Arbeit, gegenseitigem Reagieren/Zuweisen und hoher Qualität über viele Schritte. ([14:05](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=845s))
- Kein Team, wenn der Prozess streng sequentiell ist — dann eher Sub-Agents. ([14:05](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=845s))
- Kein Team, wenn alles in einer Conversation History bzw. einem Context Window bleiben soll. ([14:05](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=845s))
- Kein Team, wenn alle an denselben Dateien arbeiten. ([14:05](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=845s))
- Kein Team bei einfachen Aufgaben; das sei Overkill. ([14:05](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=845s))
- Drei parallele Sessions kosten grob dreimal so viel, fünf Sessions fünfmal so viel. ([14:05](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=845s))
- Der Sprecher bleibt bei etwa zwei bis fünf Agenten. ([14:05](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=845s))
- Sub-Agents früh abbrechen, wenn sie vom Weg abkommen; dafür sei die tmux-Split-Ansicht nützlich. ([14:05](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=845s))
- Shutdown heißt: Arbeit speichern und bestätigen; Teammates können widersprechen, wenn sie noch nicht fertig sind. ([14:05](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=845s))
- Hartes Kill ohne Shutdown kann unaufgeräumten Stand hinterlassen. ([14:05](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=845s))

## Demos / Schritte

1. Prompt an Claude: Team `Neuroflow` mit drei Sonnet-Teammates (Frontend, Backend, QA); Tool `team create` spawnt sie parallel. ([0:00](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=0s))
2. Frontend und Backend schicken Arbeit an QA; QA findet drei kritische Issues; der Hauptagent schickt beide plus QA in einen zweiten Durchgang; QA gibt frei, die Issues sind weg, die Landing Page steht. ([0:00](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=0s))
3. In einem leeren Projekt JSON aus der offiziellen Agent-Teams-Doku in die lokalen Settings legen lassen; Ergebnis: `.claude/settings.local.json`. ([2:29](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=149s))
4. Doku-URL kopieren und eine Master-Referenz unter `docs/` erzeugen lassen (Aktivierung, Wann nutzen, Display-Modi, Task Management, Hooks, Best Practices). ([2:29](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=149s))
5. Frische Sitzung: Team `research team` mit Sonnet (Researcher, Strategist, Critic) zum Aufräumen/Prüfen des Workspace. ([7:12](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=432s))
6. Spawn-Prompts prüfen: Rollen, Schrittfolge, Anweisung, per Send-Message-Tool an namentliche Teammates zu schreiben. ([7:12](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=432s))
7. Hauptagent fragt den Researcher, ob Inventar an Strategist und Critic ging; Researcher bestätigt, Critic läuft. ([7:12](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=432s))
8. Hauptagent schickt Shutdown („save your work“) an alle drei; Output u. a. Dokument „Agent Teams Patterns“ mit 11 Dokumentationslücken. ([7:12](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=432s))
9. Denselben Frontend/Backend/QA-Prompt in Claude Code unter tmux: farbige Panes (blau Frontend, grün Backend, gelb QA); Status in der Hauptsitzung, Direktansprache je Agent. ([10:15](https://www.youtube.com/watch?v=vDVSGVpB2vc&t=615s))

## Genannte Tools

- [claude-code-overview](obsidian://open?vault=knowledge-base&file=claude-code-overview) — CLI/Extension, in der Agent Teams laufen
- VS Code — Umgebung der Extension-Demos; der Sprecher nutzt sie bevorzugt, sagt aber, Agent Teams gehen überall, wo Claude Code läuft
- tmux — Split-Pane-Ansicht, in der Teammates sichtbar und einzeln ansprechbar sind
- Sonnet, Haiku, Opus — wählbare Modelle für Teammates; Demos laufen mit Sonnet
- React — im Beispiel-Prompt das Frontend der Full-Stack-App
- [claude-code-mcp-setup](obsidian://open?vault=knowledge-base&file=claude-code-mcp-setup) — MCP-Server der Hauptsitzung, die Teammates mitnutzen
- [claude-code-skills](obsidian://open?vault=knowledge-base&file=claude-code-skills) — Skills der Hauptsitzung, die Teammates mitnutzen

## Verwandt

- [claude-code-agent-teams-quickstart](obsidian://open?vault=knowledge-base&file=claude-code-agent-teams-quickstart) — Kurzüberblick zur selben Mechanik
- [claude-code-agent-teams-praxis](obsidian://open?vault=knowledge-base&file=claude-code-agent-teams-praxis) — Community-Prompt-Muster, Teamzuschnitt und bekannte Pitfalls
- [[Claude Code Dynamic Workflows Clearly Explained]] — grenzt Agent Teams gegen Sub-Agents, Skills und Dynamic Workflows ab
- [sub-agent-steuerung-hooks-und-anti-token-burn](obsidian://open?vault=knowledge-base&file=sub-agent-steuerung-hooks-und-anti-token-burn) — Steuerung und Token-Kosten von Sub-Agents und Teammates
- [agent-orchestrierung-entscheidung](obsidian://open?vault=knowledge-base&file=agent-orchestrierung-entscheidung) — wann Solo, wann Subagent, analog zur Team-vs-Sub-Agent-Grenze im Video
