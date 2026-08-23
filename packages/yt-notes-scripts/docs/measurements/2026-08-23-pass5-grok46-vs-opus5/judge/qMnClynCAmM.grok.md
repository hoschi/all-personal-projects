## Nicht gedeckte Aussagen
### Fassung A
- **Worum es geht** — Zitat: „Cole Medin stellt das neu gebaute Archon vor“ (`j-qMnClynCAmM.md:235`). Der Name steht im Transkript nicht; im Transkript nicht gefunden.
- **Behauptungen** — Zitat: „Human-in-the-Loop: an jedem Node auf Input warten.“ (`:294`). Transkript: „we can pause at any given node to ask for your input“ (`:200`). Das ist die Option, an einem gewählten Node zu pausieren, nicht dass jeder Node auf Input wartet.
- **Behauptungen** — Zitat: „Der Workflow-Builder entsteht, wenn man im Archon-Repo sagt, man wolle mit dem Workflow-Builder-Workflow einen Archon-Workflow bauen.“ (`:298`). Transkript: der Workflow-Builder-Workflow ist bereits da; der Satz erzeugt YAML, nicht den Builder (`:221–222`). Der visuelle Builder ist separat „working on“ (`:226`).
- **Demos / Schritte** — Zitat: „Per CLI mehrere Issues parallel anstoßen (im Demo 5, 7, 8, 9, 10, 11); Ergebnis: acht offene PRs.“ (`:315`). Transkript: die sechs Issues sind der Parallel-Lauf (`:211`); die acht PRs sind das Gesamtergebnis aller Läufe, inklusive Issue 1 und Issue 3 (`:164–166`, `:206`, `:217`).
- **Verwandt** — Zitat: „Vorgänger: Archon als OS in den Agents (RAG, Tasks)“ (`:344`). RAG und Task-Management stehen im Transkript (`:118`); „OS“ steht dort nicht. Im Transkript nicht gefunden.
### Fassung B
- **Worum es geht** — Zitat: „Cole Medin stellt die komplett überarbeitete Version von Archon vor“ (`:360`). Der Name steht im Transkript nicht; im Transkript nicht gefunden.
- **Besprochene Konzepte** — Zitat: „Per-Node-Modellwahl — pro Node lässt sich Modell und neue-Session-vs-Conversation-Fortsetzung festlegen“ (`:369`). Das sind zwei getrennte Steuerungen: Session neu vs. fortsetzen (`:180`) und Modell pro Node (`:190`). Session-Fortsetzung ist keine Modellwahl.
- **Behauptungen** — Zitat: Mythos sei „für Endkunden zu teuer“ (`:378`). Transkript: Consumer können Mythos nicht *für alles* bezahlen (`:110`), nicht dass es generell unerschwinglich sei.
Zählung: A=5 B=3
## Eigene Spekulation
### Fassung A
- „Getrennte Sessions — Planung und Implementierung in frischen Context-Windows, damit die Implementierung nicht an der Planung klebt“ (`:244`). Sprecher: „to remove bias“ (`:124`), nicht diese Deutung.
- „Kontext, Skills und MCP-Server lassen sich pro Node setzen, nicht nur global.“ (`:267`). Sprecher: „that level of control per node“ (`:122`); „nicht nur global“ zieht der Sprecher nicht selbst.
- „Per-Node-Modellwahl — schwache Schritte (z. B. Klassifikation) auf ein günstigeres Modell legen“ (`:246`). Sprecher: Klassifikation braucht wenig Reasoning (`:190`); „schwache Schritte“ ist Deutung.
### Fassung B
- „Stripe Minion — … als Vorbild“ (`:417`). Sprecher: Stripe habe etwas „kind of like Archon“ gebaut (`:112`); „Vorbild“ sagt er nicht.
Zählung: A=3 B=1
## Fehlende wichtige Inhalte
### Fassung A
- Begründung für getrennte Plan/Implement-Sessions: „to remove bias“ (`:124`) — in A durch die eigene Deutung ersetzt, die Originalbegründung fehlt.
- Slash-Command `/loop`: alle 10 Minuten Workflows prüfen und bei Fehler neu starten (`:213`) — fehlt in A.
- Archon-Agent in der Web-UI bekommt registrierte Projekte und Workflows zu Gesprächsbeginn injiziert (`:205`) — fehlt in A.
- In der Web-UI „add project“ per GitHub-URL oder lokalem Pfad (`:205`) — fehlt in A.
### Fassung B
- Livestream Samstag, 9:00 a.m. Central Time, zu Workflows und parallelen Läufen (`:102`, `:228`) — fehlt in B.
- Bestehende Harnesses (Ralph Loop, Open-Source-Harnesses von Anthropic) sind nicht auf den eigenen SDLC zugeschnitten; Archon schaltet den eigenen Prozess frei (`:108–109`) — fehlt in B.
- AI Shepherding: Skills/Commands selbst anstoßen und die Reihenfolge merken (`:120–121`) — fehlt in B.
- Mitgelieferte Workflows außer Fix-Issue/Ralph/Builder/Beads: Adversarial-Dev-Harness, umfassendes PR-Review, Issue-Erzeugung, Idea-to-PR, interaktives PRD (`:100`, `:200–202`) — fehlt in B.
- MCP-Server pro Node, z. B. nur in der Planung (`:122`) — fehlt in B.
- Auf manchen OS und auf einem VPS die Setup-Session selbst öffnen (`:144`) — fehlt in B.
- Workflows liegen als YAML unter `.archon` und stecken in der CLI (`:183`) — fehlt in B.
- Demo-Ergebnis: acht neue offene Pull Requests (`:217`) — B sagt nur „mehrere“ (`:405`).
- Default-Workflow „fix GitHub issue“: Investigation, Fix, Validierung, erst dann PR (`:165`) — fehlt in B.
- Commands im Workflow-Ordner als längere Prompts/Extensions für einzelne Nodes (`:191–192`) — fehlt in B.
- Claude-Code-Leak: Anthropic baut an Agent Teams und Sub-Agents (`:114`) — B hat nur die 40-Prozent-Zahl (`:382`).
- Slash-Command `/loop` alle 10 Minuten (`:213`) — fehlt in B.
- Archon-Agent in der Web-UI mit injiziertem Projekt-/Workflow-Kontext (`:205`) — fehlt in B.
- „add project“ in der Web-UI (`:205`) — fehlt in B.
Zählung: A=4 B=14
## Praezision
- Getrennte Sessions: B „um Bias zu entfernen“ (`:377`) trifft `:124`; A „nicht an der Planung klebt“ (`:244`) trifft das nicht.
- HITL: B „an beliebigen Nodes“ (`:371`) trifft „any given node“ (`:200`); A „an jedem Node“ (`:294`) überzieht.
- Mythos: A „Consumer könnten Mythos nicht für alles bezahlen“ (`:260`) trifft `:110`; B „für Endkunden zu teuer“ (`:378`) überzieht.
- Timestamps: A legt Mythos, Studie, Stripe Minion und 40-Prozent-Leak unter 3:07 (`:260–264`); B hängt dieselben Sätze an 5:54 (`:378–382`). Im Transkript stehen sie in der Sektion ab `:104`, nicht ab `:116`.
- Altes vs. neues Archon: B „komplett überarbeitete Version“ (`:360`) trifft „massive overhaul“ (`:96`); A „neu gebaute“ (`:235`) klingt nach Neubau statt Umbau.
- Plattformen: B „CLI default, optional GitHub, Telegram, Slack“ (`:399`) trifft `:142`; A „Die CLI ist Standard; zusätzlich GitHub, Telegram und Slack“ (`:275`) lässt die Optionalität weg.
- Modell vs. Session: A trennt Per-Node-Modell (`:290`) und „neu starten oder die Conversation fortsetzen“ (`:287`); B mischt beides unter „Per-Node-Modellwahl“ (`:369`).
- Parallel-Demo: A nennt Issue 3 aus der UI und 5/7/8/9/10/11 plus acht PRs (`:295–296`); B „z.B. sechs GitHub-Issues“ und „mehrere“ PRs (`:390`, `:405`). A ist konkreter, verknüpft die acht PRs in den Demos aber falsch mit nur den sechs Issues (`:315`).
- YAML-Ort: A „unter `.archon`“ (`:288`) trifft `:183`; B „einfache YAML-Dateien“ (`:387`) ohne Pfad.
- Stripe: B „Archon-ähnlich, aber nicht Open Source“ (`:381`) trifft „something kind of like Archon, but it's not open-source“ (`:112`); A hat 1300 PRs und „nicht Open Source“ (`:263`), nicht den Vergleich.
- Beads-Nachbau: A Exploration → Tasks → Loop mit Fortschritt → Validierung (`:299`, `:316`) trifft `:225`; B nur „Beads-inspirierten Workflow als YAML“ (`:406`).
- Setup-Test: A nennt „Archon assist“ (`:283`, `:310`); B „einen Test-Workflow“ (`:402`). Transkript: „basic Archon assist one“ (`:158`).
## Regelverstoesse
### Fassung A
- Keine gegen die Sektionsvorgaben: Reihenfolge Worum → Konzepte → Behauptungen → Demos → Tools → Verwandt; Worum zwei Sätze; Deutsch; Demos und Tools haben Anlass (Setup, Lauf, UI, Parallel, Builder werden vorgeführt; Tools werden genannt). Keine Vorrede, keine fremde Überschrift.
### Fassung B
- Keine gegen die Sektionsvorgaben: dieselbe Reihenfolge, Worum zwei Sätze, Deutsch, Demos/Tools mit Anlass. Keine Vorrede, keine fremde Überschrift.
## Urteil
- Treue: B besser — A verdreht HITL-Scope, die Entstehung des Workflow-Builders und das 8-PR-Ergebnis; B hat weniger inhaltliche Verdrehungen.
- Vollstaendigkeit: A besser — B lässt Livestream, Shepherding, den Unlock gegen fremde Harnesses, den Workflow-Katalog, MCP-pro-Node, `.archon` und das 8-PR-Ergebnis weg.
- Praezision: A besser — korrekte Kapitelzeiten, Issue-Nummern, `.archon` und Workflow-Namen; B genauer bei Bias, HITL-„beliebig“ und Overhaul.
- Regeltreue: gleichwertig — beide erfüllen Sektionsreihenfolge, 1–2-Satz-Worum, Deutsch und Demos/Tools-Anlass.
## Annahmen
- Gemessen nur gegen das gelieferte `audited_md` in `j-qMnClynCAmM.md`; Tonspur und Videobild nicht geprüft.
- Sprechername zählt als ungedeckt, weil er im Transkript nicht vorkommt.
- Falsche Timestamps zählen unter Präzision, nicht als ungedeckter Inhalt (der Satzinhalt steht im Transkript).
- Link-Ziele und Linkform nicht bewertet; beschreibender Text nach dem Link schon, wenn er Videoinhalt behauptet.
- Dieselbe Formulierung nicht doppelt unter „nicht gedeckt“ und „Spekulation“.
