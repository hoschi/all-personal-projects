## Nicht gedeckte Aussagen
### Fassung A
- **Demos / Schritte**, `/tmp/claude/p5/j-Ya51a1EJPZk.md:204`: „ein Template wählen (z. B. das Anthropic-/classic-Template)“. Im Transkript heißt der Setup-Prompt „Anthropic template“ (`:106`); später heißt dasselbe Demo-Playbook „classic template“ (`:125`). Dass beides ein Name ist, steht dort nicht.
- **Demos / Schritte**, `:212`: „Audio in einem einzigen Call an Eleven Labs (oder Kokoro) erzeugen“. Der eine Call gilt nur für Eleven Labs (`:127`). Kokoro ist Alternative, nicht Träger dieser Eigenschaft.
- **Genannte Tools**, `:226`: „Remotion — programmatisches Video-Framework“. Im Transkript nur Vergleich („kind of like Remotion“) und Skill-Viralität (`:96`). Die Produktklasse steht nicht dort.
- **Genannte Tools**, `:227`: „Neon — serverlose Postgres-Datenbank“. Genannt sind SQLite, Postgres und Neon (`:110`). „serverlose“ ist im Transkript nicht gefunden.
### Fassung B
- **Worum es geht**, `:246`: „Cole Medin zeigt …“. Der Name ist im Transkript nicht gefunden.
- **Besprochene Konzepte**, `:248`: „LLMs erzeugen Animation und Audio in einem Durchlauf“. Der Sprecher spricht von end-to-end über einen mehrstufigen Workflow (`:96`, `:104`, `:125`, `:127`), nicht von einem LLM-Durchlauf.
- **Genannte Tools**, `:327`: „Neon — Postgres-Hosting“. Neon ist die genutzte Postgres-Instanz (`:110`). „Hosting“ ist im Transkript nicht gefunden.
- **Genannte Tools**, `:331`: „im Archon-Explainer außerdem isolierter Git-Worktree pro Task“. Das sagt das abgespielte Archon-Video (`:135`), nicht der Sprecher über den Video-Gen-Stack.
Zählung: A=4 B=4
## Eigene Spekulation
### Fassung A
- Nur dieser eine Fund. **Behauptungen**, `:175`: „noch für nicht praxistauglich gehalten“. Der Sprecher sagt „Not yet. It's theoretically possible, but you're not going to get the best output.“ (`:96`). „Praxistauglich“ ist Deutung, kein Wort des Sprechers.
### Fassung B
- Nur dieser eine Fund. **Besprochene Konzepte**, `:248`: „der Sprecher hält das inzwischen für praxisnah“. „Praxisnah“ sagt er nicht. Belegt sind schnelle Änderung (`:96`), Use Cases (`:100`) und „pretty reliably now“ (`:151`).
Zählung: A=1 B=1
## Fehlende wichtige Inhalte
### Fassung A
- Repo ist auf YouTube Shorts spezialisiert. Fehlt in A. Transkript `:100`; in B `:270`.
- Playbook als template-spezifische Datei (Kokoro/Eleven Labs + Hyperframes, Szenen/Länge). Fehlt in A. Transkript `:125`; in B `:252`, `:284`.
- Thema des 25-Sekunden-Laufs: Claude Code Agent View mit Anthropic-Template. In A nur als Vault-Notiz `:235`, nicht in Behauptungen/Demos. Transkript `:106`, `:114`; in B `:277`, `:302`, `:305`.
- Validation steckt im Workflow. Fehlt in A. Transkript `:121`; in B `:282`.
- Zweite Demo: 30-Sekunden-Archon-Explainer, Custom-Template, generische Stimme, etwas zu langsam. A hat nur den Stimmen-Aufwand `:193`. Transkript `:131`–`:143`; in B `:289`–`:290`, `:315`.
- Custom-Template-Inhalt: Name „concept short“, Before/After, Analogy-Panels, Scope, RAG/Attention/MCP, neue Session. A hat nur Q&A und ~50 s (`:194`). Transkript `:147`; in B `:292`–`:294`, `:316`–`:319`.
- Am Ende: in 15 Minuten oder weniger lauffähig. Fehlt in A (nur die 10 Minuten `:180`). Transkript `:151`; in B `:296`.
- Coding-Agent installiert Dependencies und Archon; Archon hat leichten Footprint. Fehlt in A. Transkript `:104`, `:108`; in B `:279`, `:301`.
- Preview zeigt Soundeffekte. Fehlt in A. Transkript `:127`; in B `:258`.
### Fassung B
- Nur dieser eine Punkt. Name „classic template“ für das Playbook der Agent-View-Demo. Fehlt in B. Transkript `:125`. A nennt „classic“, setzt es aber fälschlich mit Anthropic gleich (`:204`).
Zählung: A=9 B=1
## Praezision
- Auftakt: A „nicht praxistauglich“ (`:175`) gegen B „keine vollständigen Videos … in brauchbarer Qualität“ (`:264`). B näher an `:96`.
- Hyperframes: A „zentrale Tool“ (`:177`) gegen B „größte Baustein“ (`:266`). B näher an „biggest kid on the block“ (`:96`).
- Remotion: A „deutlicher Fortschritt“ (`:178`) gegen B „nicht am zuverlässigsten“ / „Schritt nach oben“ (`:267`). B näher an `:96`.
- Dauer: A nur unter 10 Minuten (`:180`). B hat 10 Minuten (`:268`) und 15 Minuten (`:296`). B vollständig zu `:96` und `:151`.
- 25-Sekunden-Demo: A „sehr gut“ (`:187`) gegen B „Audio perfekt, Transitions gut, Sync sehr gut“ plus Validation (`:282`). B näher an `:121`.
- Mängel: A nur „ungelenke Übergänge“ (`:181`) gegen B „Renderings und Übergänge“ (`:269`). B näher an `:100`.
- TTS-Call: A „Eleven Labs (oder Kokoro)“ (`:212`) gegen B nur Eleven Labs (`:310`). B korrekt zu `:127`.
- Template-Setup: A „Anthropic-/classic-Template“ (`:204`) gegen B „Anthropic-Template“ (`:277`). B korrekt zum Prompt `:106`.
- End-to-end: A „end-to-end“ (`:159`, `:163`) gegen B „in einem Durchlauf“ (`:248`). A korrekt zu `:96`.
- Use-Case-Länge: A „kurzem Erklärvideo“ (`:195`) gegen B „30 bis 60 Sekunden“ (`:295`). B näher an „a minute or 30 seconds“ (`:151`).
- Geklonte Stimme: A nur Aufwand (`:193`) gegen B Aufwand plus generische Stimme im Archon-Explainer (`:289`). B näher an `:131`.
- `git clone`: B „im Video nicht ausgeführt“ (`:298`) gegen A als unkommentierter Schritt (`:201`). B näher an `:104`.
- Inflection: B behält „Inflection“ (`:269`); A schreibt „Inflektion“ (`:181`). B folgt der Original-Form aus `:100`.
- Custom-Template: B nennt „concept short“ (`:293`); A lässt den Namen weg (`:194`). B näher an `:147`.
- Postgres: A „für mehr Zuverlässigkeit“ (`:186`) näher an `:110` als B-Behauptung `:280`; B holt den Grund in den Tools nach (`:329`).
## Regelverstoesse
### Fassung A
- Nachwort nach Verwandt (`:239`): Ablagepfad, fehlender Channel, Ansprache des Lesers. Das ist Vorrede außerhalb der Sektionen.
- „Stimm-Inflektion“ (`:181`): Fachbegriff nicht im Original; Transkript hat „voice inflection“ (`:100`).
### Fassung B
- Nur dieser eine Punkt. Keine fehlende Sektion, keine Vorrede, keine fremde Überschrift. Demo-Schritt 22 (`:319`) stellt die MCP-Session als ausgeführten Schritt dar. Im Transkript ist es ein Eventualfall („if I go to like even a brand new Claude Code session“, `:147`).
## Urteil
- Treue: A besser — B erfindet den Sprechernamen und macht aus end-to-end einen LLM-Durchlauf; A's Fehler sind Zusatzattribute und eine Template-Gleichsetzung.
- Vollstaendigkeit: B besser — A lässt Playbook, zweite Demo, Custom-Template-Details, Shorts-Spezialisierung und die 15-Minuten-Angabe weg.
- Praezision: B besser — näher an Qualität, Zeiten, Demo-Thema und nicht ausgeführtem Clone; bei end-to-end trifft A besser.
- Regeltreue: B besser — A hängt ein Nachwort an; B bleibt in den vorgegebenen Sektionen.
Annahme: Nur das Transkript in dieser Datei zählt, nicht Kanal- oder Videometadaten.
