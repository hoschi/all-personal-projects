## Nicht gedeckte Aussagen

### Fassung A

- Sektion "Genannte Tools": "Neon — serverlose Postgres-Datenbank für den Workflow-State." Das Transkript sagt nur "you can also use Postgres like I'm using Neon here" (5:10). "Serverlos" ist eine Eigenschaft, die der Sprecher nirgends nennt; sie stammt aus Weltwissen des Modells.
- Sektion "Genannte Tools": "Remotion — programmatisches Video-Framework, nur als Vergleich genannt." Das Transkript charakterisiert Remotion nicht. Es sagt "this is kind of like Remotion" und dass es viral ging als erstes Tool mit einem Skill für Claude Code (0:00). "Programmatisches Video-Framework" ist zugefügtes Modellwissen.

Borderline, nicht mitgezaehlt: "Hyperframes sei vergleichbar mit Remotion, aber laut Sprecher ein deutlicher Fortschritt in der Zuverlässigkeit." Der Sprecher sagt "It wasn't really the most reliable in my experience. Hyperframes is definitely a step up." Der Bezug auf Zuverlässigkeit liegt im Satz davor, "deutlicher Fortschritt" ueberzeichnet "a step up" leicht. Naeher an einer Praezisionsfrage als an einer Erfindung.

Zaehlung: A=2

### Fassung B

- Sektion "Worum es geht": "Cole Medin zeigt einen Open-Source-Workflow ..." Im Transkript faellt kein Sprechername. Der Name stammt von ausserhalb der Quelle.

Borderline, nicht mitgezaehlt: Sektion "Genannte Tools", "Git — Repo klonen; im Archon-Explainer ausserdem isolierter Git-Worktree pro Task." Der erste Teil ist gedeckt (`git clone`, 2:45). Der zweite Teil stammt aus dem Ton des KI-erzeugten Archon-Erklaervideos ("One isolated Git work tree per task", 11:00), nicht aus einer Aussage des Sprechers ueber den Video-Workflow. Der Satz steht im Transkript, aber nicht im Mund des Sprechers.

Zaehlung: B=1

## Eigene Spekulation

### Fassung A

- Keine gefunden.

Borderline, nicht mitgezaehlt: Sektion "Demos / Schritte", Setup-Schritt 4, "ein Template wählen (z. B. das Anthropic-/classic-Template)". Das Transkript nennt bei demselben Video zwei Namen: "I'm telling it to use the Anthropic template" (2:45) und "this is for the classic template that I used to generate that Claude Agent View video" (6:51). Die Gleichsetzung ist eine Schlussfolgerung, aber eine, die das Transkript selbst nahelegt, weil beide Stellen denselben Lauf meinen.

Zaehlung: A=0

### Fassung B

- Sektion "Demos / Schritte", Schritt 22: "Neue Session: Video zu MCP anfordern; das neue Template wird gewählt." Und in "Behauptungen": "In einer neuen Session genügt „create a video on MCP“: README, verfügbare Templates, Wahl des neuen Templates." Das Transkript formuliert das als Vorausschau des Sprechers: "if I go to like even a brand new Claude Code session here and I say create a video on MCP, it'll know ..." (12:08). Ein Lauf findet nicht statt. B fuehrt es als ausgefuehrten Demo-Schritt und als Tatsache, ohne die Markierung "laut Sprecher".

Zaehlung: B=1

## Fehlende wichtige Inhalte

### Fassung A

- Der komplette zweite Demo-Abschnitt "Archon Explainer Demo" fehlt: ein 30-Sekunden-Erklaervideo zu Archon mit einem selbst gebauten Template, der Versuch mit einer geklonten Eleven-Labs-Stimme, die stattdessen genutzte generische Stimme und das Urteil des Sprechers ("A little slow-paced overall, but I like the explanation quite a bit"). A uebernimmt daraus nur den Satz zur geklonten Stimme. Transkript 11:00.
- "Get it up and running in 15 minutes or less" (14:22). A nennt nur die "unter 10 Minuten" aus 0:00.
- "Even just creating YouTube shorts, like that's what this repository is specialized in right here" (1:39). Die Spezialisierung des Repos auf Shorts fehlt.
- Name und Umfeld des neu gebauten Templates: "Claude Code has created the new concept short template for me", die Beispielthemen "RAG, attention, MCP" und die Template-Wahl in einer frischen Session (12:08). A nennt nur den Default von rund 50 Sekunden.
- Das "Playbook" als eigener Baustein: "we have the playbook. This is what tells Claude Code how we're going to use Kokoro or Eleven Labs, how we're going to use HyperFrames ... And this is custom to the template that I'm using" (6:51). A hat ein Template-System, aber nicht das Playbook.
- Thema des ersten Demovideos: "The topic is a Claude Code Agent View. This is the latest edition of Claude Code" (2:45). A erwaehnt Agent View nur im Verwandt-Link, nicht als Aussage des Sprechers.
- "That's part of the validation that's built into the workflow as well" (6:01). Die eingebaute Validierung fehlt.
- Archon-Einordnung aus 5:10: "It's my open source harness builder", der Coding-Agent installiert es, "has a light footprint as well". A nennt Archon, aber weder die Urheberschaft des Sprechers noch Installation und Footprint.
- Inhalt des abgespielten Agent-View-Shorts (6:01): sechs Session-States, "one command, claude agents", "/goal for fully autonomous runs". Fehlt auch in B; geringes Gewicht, weil es der erzeugte Videotext ist und keine Lehre des Sprechers.

Zaehlung: A=9

### Fassung B

- "this is for the classic template that I used to generate that Claude Agent View video" (6:51). B nennt nur das Anthropic-Template und laesst den zweiten Namen weg.
- Inhalt der beiden abgespielten Demovideos (6:01 und 11:00): beim Agent-View-Short die sechs Session-States und "/goal", beim Archon-Explainer "21,000 GitHub stars", PIV/Fix/Review und "archon.diy". B nennt beide Videos, aber nicht ihren Inhalt. Fehlt auch in A; geringes Gewicht, siehe oben.

Zaehlung: B=2

## Praezision

- Zuverlaessigkeitsvergleich. A: "Hyperframes sei vergleichbar mit Remotion, aber laut Sprecher ein deutlicher Fortschritt in der Zuverlässigkeit." B: "Remotion war laut Sprecher das erste Tool mit einem Skill für Claude-Code-Videos, in seiner Erfahrung unzuverlässiger als Hyperframes" bzw. "in seiner Erfahrung nicht am zuverlässigsten. Hyperframes ist ein Schritt nach oben." Transkript: "It wasn't really the most reliable in my experience. Hyperframes is definitely a step up." B bleibt am Wortlaut, A macht aus "step up" einen "deutlichen Fortschritt".
- Bezug der 10 Minuten. A: "Das Repo sei Open Source und in unter 10 Minuten lauffähig." B: "Open-Source-Repo: den Coding-Agent einrichten lassen, eigenes KI-Video in unter 10 Minuten." Transkript: "you can have your own AI-generated video up and running in less than 10 minutes" (0:00). Die Zeitangabe gilt dem fertigen Video, nicht dem Repo. B trifft den Bezug.
- Neon. A: "serverlose Postgres-Datenbank für den Workflow-State." B: "Postgres-Hosting; persistiert Workflow-Runs." B bleibt im Transkript.
- Neues Template. A: "das neue Template defaulte z. B. auf ~50 Sekunden statt 25–30." B: "Template „concept short“, Default etwa 50 Sekunden statt 25 bis 30." B nennt den Namen, den der Sprecher ausspricht.
- Laenge des Selbst-Erklaervideos. A: "sich neue Claude-Code-Features per kurzem Erklärvideo erklären zu lassen." B: "in 30 bis 60 Sekunden". Transkript: "just have it explain it to you in a minute or 30 seconds" (14:22). B ist konkreter und trifft die Angabe.
- Einstiegsaussage. A: "hätte der Sprecher LLM-getriebene End-to-end-Videogenerierung noch für nicht praxistauglich gehalten." B: "hätte der Sprecher gesagt, LLMs können noch keine vollständigen Videos mit Animation und Audio in brauchbarer Qualität erzeugen." Transkript: "Not yet. It's theoretically possible, but you're not going to get the best output." B gibt die zweiteilige Aussage wieder, A verkuerzt sie zu einem Urteil ueber Praxistauglichkeit.
- Aufzaehlung der Schwaechen. A: "Stimm-Inflektion, leicht ungelenke Übergänge." B: "Stimm-Inflection, etwas ungeschickte Renderings und Übergänge." Transkript: "voice inflection, slightly awkward renderings or transitions" (1:39). A laesst die Renderings weg.
- Zuschreibung. A steht durchgehend in indirekter Rede ("sei", "würde", "betrachte") und macht damit jede Zeile als Sprecheraussage kenntlich. B steht im Indikativ ("Das Repo ist auf YouTube Shorts spezialisiert.", "Hyperframes-Komposition ist HTML."), was dieselben Inhalte als Feststellung der Zusammenfassung liest. Hier ist A praeziser.

## Regelverstoesse

### Fassung A

- Nachtrag hinter "## Verwandt": "Hinweis: Die Datei sollte unter `shared/youtube/<channel>/<title>.md` landen — Channel und exakter Titel waren im Input nicht enthalten, daher habe ich nur den Inhalt erzeugt. Sag mir den Channel-Namen, dann lege ich die Datei direkt im Vault an." Das ist kein Teil des Sektionsschemas, sondern eine Ansprache an den Nutzer mit Rueckfrage. Die Sektionsvorgabe endet mit "## Verwandt".
- Sektionsfolge selbst korrekt: alle sechs Sektionen vorhanden, in der vorgegebenen Reihenfolge, "Worum es geht" mit zwei Saetzen, Sprache deutsch, Fachbegriffe im Original.

### Fassung B

- Kein Verstoss gegen die genannten Vorgaben: alle sechs Sektionen in der Reihenfolge, beide bedingten Sektionen haben Anlass (es wird vorgefuehrt, es werden Tools genannt), keine Vorrede, keine fremde Ueberschrift, Sprache deutsch.
- Randnotiz ohne Verstossgewicht: B setzt keine Leerzeile zwischen Ueberschrift und Text. Das steht nicht in den Sektionsvorgaben.
- Die unmarkierte Vorausschau in "Demos / Schritte" Schritt 22 beruehrt die "laut Sprecher"-Regel; sie ist bereits unter "Eigene Spekulation" gezaehlt und wird hier nicht doppelt gezaehlt.

## Urteil

- Treue: gleichwertig — beide leisten sich je zwei kleine Abweichungen von der Quelle, A zwei zugefuegte Toolattribute aus Modellwissen (Neon "serverlos", Remotion als "programmatisches Video-Framework"), B einen im Transkript nicht genannten Sprechernamen und eine als Tatsache gesetzte Vorausschau.
- Vollstaendigkeit: B besser — A laesst den gesamten Archon-Explainer-Abschnitt (11:00), das Playbook, die eingebaute Validierung, die Shorts-Spezialisierung, den Templatenamen "concept short" und die 15-Minuten-Angabe aus, waehrend B nur den Zweitnamen "classic template" verfehlt.
- Praezision: B besser — in sechs von sieben gegenuebergestellten Paaren liegt B naeher am Wortlaut (10-Minuten-Bezug, "step up", Neon, Templatename, 30-bis-60-Sekunden, Renderings), A ist nur bei der durchgaengigen indirekten Rede genauer in der Zuschreibung.
- Regeltreue: B besser — A haengt hinter "## Verwandt" einen Nutzer-Hinweis mit Rueckfrage an, B haelt das Sektionsschema ein und faellt nur durch die eine unmarkierte Sprecher-Vorausschau auf.
