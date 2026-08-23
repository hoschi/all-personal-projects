---
tags:
  - youtube
aliases:
  - "Claude Code als Video-Pipeline: Skript, Stimme und Visuals automatisiert"
channelName: Cole Medin
publish_date: 2026-05-14
display_title: "Claude Code als Video-Pipeline: Skript, Stimme und Visuals automatisiert"
description: Ein Entwickler zeigt, wie Claude Code einen vollständigen
  End-to-End-Workflow ausführt, der aus einer Idee oder URL automatisch fertige
  Kurzvideos generiert. Der Workflow kombiniert HyperFrames (HTML-basiertes
  Video-Rendering), ElevenLabs/Kokoro (Text-to-Speech), Archon (Workflow-Engine
  mit Neon-Postgres-Backend) und Claude Code als Orchestrator — von
  Web-Recherche über Script-Erstellung, Audio-Generierung und Animations-Timing
  bis zum finalen MP4-Export. Relevant für Entwickler und Content-Creator, die
  erklärende Kurzvideos (YouTube Shorts, Team-Explainer) automatisiert und ohne
  manuelle Videobearbeitung produzieren wollen.
youtube_id: Ya51a1EJPZk
---

# Make the PERFECT Videos with Claude Code (Full Workflow)

## Worum es geht

Der Sprecher zeigt einen Open-Source-Workflow, mit dem sich kurze Videos (z. B. YouTube Shorts, Erklärvideos) end-to-end per KI erzeugen lassen — Skript, Audio, Animation und Synchronisation. Der Stack kombiniert Claude Code, Hyperframes (Rendering), Eleven Labs bzw. Kokoro (Sprache) und Archon (Workflow-Orchestrierung).

---

## Notizen

[URL](https://www.youtube.com/watch?v=Ya51a1EJPZk)
Okay, ich hatte gedacht, es geht darum, wie man mit KI Videos schneiden kann, Highlights setzen und so weiter. Das wäre nützlich für mich, um zum Beispiel schnell das aktuelle Feature, das ich im Frontend gebaut habe, zu zeigen und die KI den ganzen Erklärkram für mich zu machen. Aber darum geht es in diesem Video nicht. Interessant ist trotzdem, was aktuell möglich ist, um wirklich kompletten Content als Video generieren zu lassen, um Dinge zu veranschaulichen.

---

## Besprochene Konzepte

- End-to-end-KI-Videogenerierung — LLMs erzeugen komplette Videos inkl. Animation und synchronem Audio. Siehe [[Bild und Video Generierung mit KI]].
- AI Coding Harness / Workflow-Engine — Orchestrierungsschicht für mehrstufige, durchhaltefähige und parallele Agent-Workflows. Siehe [ai-agent-harness-konzept](obsidian://open?vault=knowledge-base&file=ai-agent-harness-konzept).
- Claude-Code-Skill als Workflow-Kapsel — der gesamte Ablauf steckt in einem Skill, der in den Harness eingebettet ist. Siehe [claude-code-skills](obsidian://open?vault=knowledge-base&file=claude-code-skills).
- Template-System — Vorlagen bestimmen Länge, Inhalt, Stil und Szenen des Videos.
- Prompt-Engineering für Text-to-Speech — Tags, Pausen und natürliche Abkürzungen im Skript optimieren die Sprachausgabe.
- Audio-getaktete Szenen-Synchronisation — das Animationstiming wird an das zuvor erzeugte Audio angepasst.
- Themen-Recherche mit Anti-Fabrication-Gate — der Agent recherchiert das Thema, statt zu halluzinieren.
- Preview-vor-Render-Workflow — eine HTML-Preview erlaubt Reviews und Anpassungen, bevor das finale MP4 gerendert wird.
- Isolierte Run-Umgebung — pro Video-Run eine eindeutige ID und ein eigener Ordner für alle Assets.

## Behauptungen

- Vor wenigen Monaten hätte der Sprecher LLM-getriebene End-to-end-Videogenerierung noch für nicht praxistauglich gehalten; das ändere sich nun schnell. ([0:00](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=0s))
- Der gezeigte YouTube-Short sei vollständig von KI erzeugt, inklusive Audio, das mit allen Übergängen synchronisiert ist. ([0:00](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=0s))
- Hyperframes sei das zentrale Tool, das die Render-Engine und den gezeigten Editor liefert. ([0:00](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=0s))
- Hyperframes sei vergleichbar mit Remotion, aber laut Sprecher ein deutlicher Fortschritt in der Zuverlässigkeit. ([0:00](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=0s))
- Remotion sei vor einigen Monaten als erstes Tool mit Skill viral gegangen, das Claude Code Videos erzeugen ließ, sei in seiner Erfahrung aber nicht sehr zuverlässig gewesen. ([0:00](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=0s))
- Das Repo sei Open Source und in unter 10 Minuten lauffähig. ([0:00](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=0s))
- KI-Videos seien noch nicht perfekt (Stimm-Inflektion, leicht ungelenke Übergänge), würden aber sehr schnell besser. ([1:39](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=99s))
- Der Sprecher betrachte das Projekt als laufendes Experiment, nicht als out-of-the-box-Produktionsqualität. ([1:39](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=99s))
- Alles sei kostenlos außer optional Eleven Labs; mit Kokoro sei es komplett gratis. ([2:45](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=165s))
- Drei Default-Templates würden mitgeliefert, vor allem als Beispiele zum Einstieg. ([2:45](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=165s))
- Archon unterstütze parallele Workflow-Ausführung, sodass mehrere Videos gleichzeitig generiert werden könnten. ([5:10](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=310s))
- Als Datenbank gehe SQLite, oder für mehr Zuverlässigkeit Postgres (er nutze Neon); der Workflow-State werde persistiert. ([5:10](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=310s))
- Das 25-Sekunden-Demo sei ohne Iteration und mit wenig Content-Vorgabe entstanden; Audio, Übergänge und Synchronisation seien laut Sprecher sehr gut gewesen. ([6:01](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=361s))
- Hyperframes nutze reines HTML für die Komposition, was leicht zu erstellen und anzupassen sei. ([6:51](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=411s))
- Der Preview-Modus sei direkt in Hyperframes eingebaut und kein selbstgebautes Dashboard. ([6:51](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=411s))
- Das volle Skript werde in einem einzigen Call an Eleven Labs gesendet. ([6:51](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=411s))
- Claude Code prüfe das Video Frame für Frame auf Layout-Overflow. ([6:51](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=411s))
- Granulare Anpassungen seien ohne kompletten Re-Render möglich. ([6:51](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=411s))
- Geklonte Eleven-Labs-Stimmen zuverlässig zu machen erfordere viel Aufwand. ([11:00](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=660s))
- Eigene Templates baue Claude Code über einen Frage-Antwort-Prozess; das neue Template defaulte z. B. auf ~50 Sekunden statt 25–30. ([12:08](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=728s))
- Ein guter Use Case sei, sich neue Claude-Code-Features per kurzem Erklärvideo erklären zu lassen, statt längere YouTube-Videos oder Docs zu konsumieren. ([14:22](https://www.youtube.com/watch?v=Ya51a1EJPZk&t=862s))

## Demos / Schritte

Setup (einmalig):

1. Repository per `git clone` klonen und ins Verzeichnis wechseln.
2. Claude Code im Repo öffnen.
3. Prompt senden: „Read the readme, set up everything so I can generate my first video" plus die Idee oder eine URL.
4. Optional einen zweiten Prompt für die Anpassung von Stil, Theme und Szenen schicken; ein Template wählen (z. B. das Anthropic-/classic-Template).

Workflow (vom Skill ausgeführt):

1. Eindeutige Video-ID erzeugen und isolierten Ordner für den Run anlegen.
2. Template in den Run-Ordner kopieren und Video-Metadaten setzen.
3. Thema recherchieren (mit Anti-Fabrication-Gate).
4. Aus der Recherche ein Skript erstellen — inkl. Tags, Pausen und Abkürzungen zur TTS-Optimierung.
5. Audio in einem einzigen Call an Eleven Labs (oder Kokoro) erzeugen.
6. Animationstiming an das Audio anpassen (Pacing der Szenen).
7. `index.html`-Komposition in Hyperframes bauen.
8. Linting sowie Layout-Overflow-Check Frame für Frame durchführen.
9. Preview (localhost-Seite) öffnen, reviewen und ggf. inline anpassen.
10. Nach Zufriedenheit das finale MP4 rendern.

## Genannte Tools

- Hyperframes — HTML-basierte Render-Engine mit eingebautem Editor/Preview, Kern des Stacks.
- Claude Code — Coding-Agent, der den gesamten Workflow ausführt.
- Archon — Open-Source-AI-Coding-Harness / Workflow-Engine zur Orchestrierung (Parallelität, Durability).
- Eleven Labs — Text-to-Speech für die Stimme (kostenpflichtig, API-Key nötig).
- Kokoro — kostenlose Text-to-Speech-Alternative.
- Remotion — programmatisches Video-Framework, nur als Vergleich genannt.
- Neon — serverlose Postgres-Datenbank für den Workflow-State.
- SQLite / Postgres — Datenbank-Optionen für die Workflow-Runs.
- Excalidraw — für ein Erklärdiagramm des Workflows genutzt.

## Verwandt

- [[The Next Evolution of AI Coding Is Harnesses - Here's How to Build Them]] — erklärt das Harness-Konzept hinter Archon ausführlich.
- [[Datenbanken für private und Open Source Projekte]] — Einordnung der DB-Wahl (SQLite vs. Postgres/Neon) für Open-Source-Projekte.
- [claude-code-updates-2026](obsidian://open?vault=knowledge-base&file=claude-code-updates-2026) — dokumentiert neuere Claude-Code-Features wie das im Video demonstrierte Agent View.

---

Hinweis: Die Datei sollte unter `shared/youtube/<channel>/<title>.md` landen — Channel und exakter Titel waren im Input nicht enthalten, daher habe ich nur den Inhalt erzeugt. Sag mir den Channel-Namen, dann lege ich die Datei direkt im Vault an.
