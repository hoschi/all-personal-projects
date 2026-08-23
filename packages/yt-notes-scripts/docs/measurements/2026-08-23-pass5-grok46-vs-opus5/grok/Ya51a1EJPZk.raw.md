## Worum es geht
Cole Medin zeigt einen Open-Source-Workflow, mit dem sich kurze Videos (YouTube Shorts, Erklärvideos) end-to-end per KI erzeugen lassen: Skript, Audio, Animation und Synchronisation. Der Stack kombiniert Claude Code, Hyperframes, Archon sowie Eleven Labs oder Kokoro.
## Besprochene Konzepte
- End-to-End-KI-Videoerzeugung — LLMs erzeugen Animation und Audio in einem Durchlauf; der Sprecher hält das inzwischen für praxisnah.
- Hyperframes als HTML-Compositor — Szenen sind HTML; Render und Preview-Editor stecken im Tool.
- Remotion-Vergleich — Remotion war laut Sprecher das erste Tool mit einem Skill für Claude-Code-Videos, in seiner Erfahrung unzuverlässiger als Hyperframes.
- [claude-code-skills](obsidian://open?vault=knowledge-base&file=claude-code-skills) — der Ablauf steckt in einem Claude-Code-Skill, der in einem Archon-Workflow für Parallelität und Dauerhaftigkeit hängt.
- Playbook und Template — template-spezifische Anweisung, wie Kokoro oder Eleven Labs mit Hyperframes zusammengefügt werden; bestimmt Szenen und Länge.
- Isolierter Workflow-Lauf — eindeutige Video-ID, Template-Kopie in einen isolierten Ordner, Assets und Output an einem Ort.
- Anti-Fabrication-Gate — Recherche vor dem Skript, damit Claude Code das Thema nicht halluziniert.
- [[Text to speech]] — Skript mit Tags, Pausen und natürlichen Abkürzungen für Eleven Labs oder Kokoro.
- Audio-getaktetes Pacing — Szenen-Timing in Hyperframes wird am fertigen Audio ausgerichtet, bevor gerendert wird.
- Layout-Overflow-Prüfung — Claude Code prüft Frame für Frame, ob Text oder Grafik aus Containern läuft.
- Hyperframes-Preview — localhost-Dashboard für Audio, Soundeffekte, Slides und Animationen vor dem MP4.
- Granulare Nacharbeit — einzelne Inflection- oder Übergangsprobleme korrigieren, ohne den ganzen Render neu zu fahren.
- Custom Templates — die drei mitgelieferten Templates sind Beispiele; Claude Code baut per Fragenkatalog eigene (Stil, Komposition, Länge).
- Agent View — vom Sprecher als neueste Claude-Code-Funktion vorgestellt und als Demo-Thema genutzt.
- Parallele Workflow-Ausführung — Archon kann mehrere Videoläufe gleichzeitig fahren.
## Behauptungen
- Vor wenigen Monaten hätte der Sprecher gesagt, LLMs können noch keine vollständigen Videos mit Animation und Audio in brauchbarer Qualität erzeugen; das ändert sich schnell. (0:00)
- Das gezeigte YouTube Short ist vollständig KI-generiert, inklusive synchronem Audio. (0:00)
- Hyperframes ist der größte Baustein: Szenen rendern und der Editor. (0:00)
- Remotion ging vor ein paar Monaten viral als erstes Tool mit einem Skill, der Claude Code Videos erzeugen lässt; in seiner Erfahrung nicht am zuverlässigsten. Hyperframes ist ein Schritt nach oben. (0:00)
- Open-Source-Repo: den Coding-Agent einrichten lassen, eigenes KI-Video in unter 10 Minuten. (0:00)
- KI-Videos sind noch nicht perfekt (Stimm-Inflection, etwas ungeschickte Renderings und Übergänge), werden aber schnell gut genug für Team-/Community-Explainer und YouTube Shorts. (1:39)
- Das Repo ist auf YouTube Shorts spezialisiert. (1:39)
- Der Sprecher betrachtet das eher als laufendes Experiment als als Production-Qualität out of the box. (1:39)
- Input ist eine Idee oder eine URL (z. B. Blogpost-Explainer); der Workflow macht Skript, Audio, Visuals, Sync und ein fertiges Video zum Review. (2:45)
- Setup: `git clone`, Claude Code im Repo öffnen, Prompt in zwei Sätzen: README lesen, alles einrichten, erste Video-Idee oder URL. (2:45)
- Der Sprecher nennt das eine Vereinfachung; Stil, Theme und Szenen will man laut ihm oft noch anpassen — dafür gibt es einen zweiten Prompt. (2:45)
- Alles ist kostenlos, außer optional Eleven Labs (API-Key); Kokoro macht den Stack komplett kostenlos. Hyperframes und Archon sind kostenlos. (2:45)
- Drei Default-Templates liegen bei; der Sprecher rät, den Coding-Agent daraus ein eigenes Template bauen zu lassen. (2:45)
- Demo-Lauf: README, Setup, Thema Claude Code Agent View, Anthropic-Template. (2:45)
- Assets liegen pro Lauf in einem Ordner. (5:10)
- Archon ist sein Open-Source-Harness-Builder, wichtiger Teil des Stacks; der Coding-Agent installiert es, leichter Footprint. (5:10)
- Workflow-DB: SQLite oder Postgres; er nutzt Neon und persistiert jeden Videolauf dort. (5:10)
- Archon unterstützt parallele Workflow-Ausführung, mehrere Videos gleichzeitig. (5:10)
- 25-Sekunden-Demo ohne Iteration und mit wenig inhaltlicher Vorgabe: Audio perfekt, Transitions gut, Sync sehr gut; Validation steckt im Workflow. (6:01)
- Der gesamte Workflow ist dieser Claude-Code-Skill, gewrappt im Archon-Workflow für Parallelität und Durability. (6:51)
- Das Playbook sagt Claude Code, wie Kokoro oder Eleven Labs und Hyperframes zusammengefügt werden; es ist template-spezifisch. (6:51)
- Hyperframes-Komposition ist HTML. (6:51)
- Die Preview ist in Hyperframes eingebaut, kein selbst gebautes Dashboard, erreichbar als localhost-Seite. (6:51)
- Der Sprecher vermutet, das erste Video sei meist nicht perfekt; Anpassungen an Information, Transitions und Szenen seien nötig. (6:51)
- Granulare Korrekturen gehen ohne kompletten Re-Render. (6:51)
- Eine geklonte Eleven-Labs-Stimme zuverlässig zu machen, kostet laut Sprecher viel Arbeit; im Archon-Explainer nutzt er deshalb eine generische Stimme. (11:00)
- Den 30-Sekunden-Archon-Explainer findet er insgesamt etwas zu langsam, die Erklärung aber gut. (11:00)
- Die drei mitgelieferten Templates sind nur Startbeispiele. (12:08)
- Custom-Template-Bau: Claude Code liest das README und stellt Fragen; er wollte einen Explainer mit Before/After-Diagrammen, Analogy-Panels, clean und educational, Scope Architectures and Techniques. (12:08)
- Ergebnis: Template „concept short“, Default etwa 50 Sekunden statt 25 bis 30. (12:08)
- In einer neuen Session genügt „create a video on MCP“: README, verfügbare Templates, Wahl des neuen Templates. (12:08)
- Weiterer Use Case: eigene Explainer für neue Claude-Code-Features (z. B. Agent View) in 30 bis 60 Sekunden statt längeres YouTube oder Docs. (14:22)
- Kostenlos, laut Sprecher in 15 Minuten oder weniger lauffähig. (14:22)
## Demos / Schritte
1. Repo-URL kopieren und `git clone` (im Video nicht ausgeführt, Repo war schon da).
2. Ins Verzeichnis wechseln und Claude Code im Repo öffnen.
3. Prompt: README lesen, Setup für das erste Video, Idee oder URL; optional zweiter Prompt für Stil, Theme und Szenen.
4. Agent installiert Dependencies; Eleven Labs optional mit API-Key, sonst Kokoro.
5. Beispiel-Lauf: Thema Claude Code Agent View, Anthropic-Template.
6. Isolierten Asset-Ordner pro Lauf zeigen.
7. Neon mit persistierten Runs zeigen; parallele Ausführung ansprechen.
8. 25-Sekunden-Short zu Agent View abspielen (ohne Iteration).
9. Excalidraw-Ablauf: eindeutige Video-ID (isolierte Umgebung, Speichern in Neon).
10. Template in den isolierten Ordner kopieren, Video-Metadaten setzen.
11. Thema recherchieren, Anti-Fabrication-Gate.
12. Skript mit TTS-Tags, Breaks und Abkürzungen schreiben.
13. Einen Eleven-Labs-Call für das volle Skript, Audio holen.
14. Animation-Timing an das Audio anpassen, `index.html` in Hyperframes bauen.
15. Linting, Layout-Overflow, Frame-für-Frame-Check durch Claude Code.
16. Hyperframes-Preview im Browser, inline Änderungen im Dashboard.
17. MP4 erst rendern, wenn Preview passt; einzelne Stellen nachziehen ohne Full-Rerun.
18. 30-Sekunden-Archon-Explainer mit Custom-Template und generischer Eleven-Labs-Stimme abspielen.
19. Custom-Template: README lesen, diesmal Template bauen statt Setup.
20. Fragen beantworten (Explainer-Stil, Before/After, Analogy-Panels, Scope).
21. Claude Code erzeugt das Template „concept short“ (~50 s).
22. Neue Session: Video zu MCP anfordern; das neue Template wird gewählt.
## Genannte Tools
- Hyperframes — HTML-basiertes Render- und Preview-Tool für Szenen.
- Remotion — Vergleichsprodukt; Skill für Claude-Code-Videos.
- [claude-code-overview](obsidian://open?vault=knowledge-base&file=claude-code-overview) — Coding-Agent, führt Skill, Setup und Workflow aus.
- Eleven Labs — TTS, optional kostenpflichtig per API-Key.
- Kokoro — kostenlose TTS-Alternative.
- [[Introducing Archon - The Revolutionary Operating System for AI Coding]] — Open-Source-Harness-Builder und Workflow-Manager.
- Neon — Postgres-Hosting; persistiert Workflow-Runs.
- [[sqlite]] — lokale Alternative für Workflow-State.
- Postgres — vom Sprecher als zuverlässigere Alternative zu SQLite genannt.
- Excalidraw — Diagramm des Workflows.
- Git — Repo klonen; im Archon-Explainer außerdem isolierter Git-Worktree pro Task.
## Verwandt
- [[The Next Evolution of AI Coding Is Harnesses - Here's How to Build Them]] — Archon als Harness-Builder, der hier den Video-Workflow orchestriert.
- [[MCP]] — Beispiel-Thema, für das der Sprecher das neue Concept-Short-Template nutzen will.
- [[RAG]] — weiteres Beispiel-Thema neben Attention und MCP.
- [[Datenbanken für private und Open Source Projekte]] — SQLite- versus Postgres-Wahl, hier für persistierte Archon-Läufe.
