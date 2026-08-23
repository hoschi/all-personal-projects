## Nicht gedeckte Aussagen

### Fassung A
- Sektion "Genannte Tools": "Qwen 3 / Qwen 3 235B A22B — Vergleichsmodell bei Mathe- und Code-Zahlen". Das Transkript nennt Qwen 3 235B A22B bei den Mathe-Benchmarks **nur** als Vergleich der Antwortlänge ("its answers are actually shorter than Qwen 3 235B, A22B"), nicht als Vergleich der Mathe-**Scores**. Ein Score-Vergleich existiert nur bei Live Codebench V5 (63.97 gegen 56.64). "Mathe-Zahlen" verschiebt damit den Bezug.

Zaehlung: A=1

### Fassung B
- Sektion "Genannte Tools": "DeepSeek R1 & V3.1 (671B)". Das Transkript nennt an dieser Stelle nur "R1" ("compared to OpenAI's O3, Anthropic's Claude, R1, or Qwen 3"), ohne Hersteller. Die Zuordnung zu DeepSeek ist ergänzt, nicht gesagt.
- Sektion "Genannte Tools": "Vergleichsmodelle (nur namentlich genannt): … Qwen 3 (235B A22B) bzw. Qwen 2.5 32B". Qwen 2.5 32B ist im Transkript kein Vergleichsmodell, sondern das Backbone von K2 Think ("a 32 billion parameter backbone Qwen 2.5 32B"). Die Einordnung als Vergleichsmodell verdreht die Rolle. (Fassung B benennt die Backbone-Rolle in "Behauptungen" korrekt — der Widerspruch steht in derselben Fassung.)
- Sektion "Behauptungen": "Trotz mehr Inferenz-Schritten werden die Antworten kürzer und sauberer — ungewöhnlich, **da Modelle bei härteren Aufgaben sonst wortreicher werden**." Das Transkript begründet das Ungewöhnliche anders: "that's unusual because usually when you add more steps, you end up with longer outputs". Die Aussage "most models get wordier as tasks get harder" steht im Transkript an anderer Stelle und begründet dort die Benchmark-Zahlen, nicht die Inferenz-Schritte. Der kausale Zusammenhang ist zusammengezogen.

Zaehlung: A=1 B=3

## Eigene Spekulation

### Fassung A
- Keine gefunden. Wo der Sprecher selbst spekuliert oder argumentiert, ist es markiert ("laut BYU", "der Sprecher sagt", "sei", "zeige"). Ausdrücklich: es gibt hier keine einzige Fundstelle.

### Fassung B
- Sektion "Besprochene Konzepte": "Inferenz-Zeit-Planung — … (Plan-then-Generate + Best-of-N)". Beide Fachlabel stehen nicht im Transkript; der Sprecher beschreibt das Verfahren, ohne es so zu benennen. Das ist eine Einordnung des Modells.
- Sektion "Besprochene Konzepte": "Sparse vs. Dense — … K2 Think den Dense-Weg **(durchgängig aktivierte Parameter)**". Das Transkript sagt nur "If BYU went sparse, MBZUAI went dense" und erklärt "dense" nicht. Die Klammer ist eine eigene Definition.

Zaehlung: A=0 B=2

## Fehlende wichtige Inhalte

### Fassung A
- **HLE-Wert 9.95** fehlt. Transkript, Abschnitt "K2 Think — Inference-Zeit-Planung und Benchmark-Ergebnisse": "it reached 71.08 on GPQA Diamond and 9.95 on HLE". Fassung A nennt HLE nur als Prüfstand ohne Zahl, während sie alle anderen Zahlen führt. (In B vorhanden.)
- **A3B ist text-only, Vision/Multimodal bewusst weggelassen.** Transkript, "A3B — Kontextfenster und Trainings-Pipeline": "They skipped the vision and multimodal parts here since this model is text only." (In B vorhanden.)
- **Memory-efficient Scheduling** als zweite Zutat des Long-Context-Trainings fehlt. Transkript, ebenda: "Pair that with flash mask, attention, and memory efficient scheduling". A nennt nur Flash-Mask-Attention. (In B vorhanden.)
- **Die K2-Think-Pipeline hat sechs Bestandteile.** Transkript, "K2 Think — Trainings-Pipeline": "The training pipeline for K2 Think has six big pieces that all work together." (In B vorhanden.)
- **Einordnung der ~2.000 Tokens/s als Produktionsniveau.** Transkript, "K2 Think — Sicherheit, Geschwindigkeit und Offenheit": "That's production level throughput, not just research speed." A nennt nur die Zahl. (In B vorhanden.)
- **Reihenfolge des progressiven RL bei A3B** (erst Logik, dann Mathe und Programmierung, dann breitere Reasoning-Aufgaben). Transkript, "A3B — Kontextfenster und Trainings-Pipeline". (Fehlt auch in B.)
- **Begründung, warum die Offenheit zählt:** die meisten Reasoning-Modelle sind derzeit geschlossen oder API-only. Transkript, "A3B — Architektur und Mixture-of-Experts-Design": "especially when most reasoning focused models right now are closed or API only". (Fehlt auch in B.)
- **Wofür der Tool Use gut ist:** Program Synthesis, symbolisches Reasoning, Multi-Agent-Workflows und Enterprise-Systeme. Transkript, "A3B — Tool Use, Deployment und Performance". (Fehlt auch in B.)
- **Wem die K2-Offenheit nützt:** Forscher können Ergebnisse reproduzieren und erweitern, Unternehmen bekommen eine Alternative zu geschlossenen APIs. Transkript, "K2 Think — Sicherheit, Geschwindigkeit und Offenheit". (Fehlt auch in B.)

### Fassung B
- **Der vollständige Modellname** "ERA 4.5 21B A3B thinking" fehlt; B führt nur das Kürzel A3B. Transkript, "A3B — Architektur und Mixture-of-Experts-Design": "their new model is called ERA 4.521B A3B thinking". Ohne den Namen ist das Modell für einen Leser nicht auffindbar. (In A vorhanden.)
- **Der Token-Fahrplan des A3B-Pretrainings** (Start bei 8.000 Tokens, schrittweise hoch auf 128.000). Transkript, "A3B — Kontextfenster und Trainings-Pipeline": "starting small at 8,000 tokens gradually going up to 128,000". B nennt nur "Text-Pretraining" ohne Zahlen. (In A vorhanden.)
- **Die SFT-Domänen von A3B** (Mathe, Logik, Coding, Science). Transkript, ebenda: "Then came supervised fine-tuning on math, logic, coding, and science." B nennt nur "Supervised Fine-Tuning". (In A vorhanden.)
- **Die Performance-Aussage zu A3B.** Transkript, "A3B — Tool Use, Deployment und Performance": stark bei logischem Reasoning, Mathe, wissenschaftlichem QA und Programmierung, stabile Genauigkeit auf Long-Chain-of-Thought-Benchmarks, konkurrenzfähig gegen deutlich größere Dense-Modelle. B hat zu A3B keine einzige Leistungsaussage außer "Frontier-Reasoning ohne Billionen-Parameter". A deckt diesen Punkt bis auf "stable accuracy on long chain of thought benchmarks" und "reliable academic synthesis outputs" ab.
- Dazu die vier oben genannten, in beiden Fassungen fehlenden Punkte: RL-Reihenfolge, Begründung der Offenheit, Einsatzzwecke des Tool Use, Nutzen der K2-Offenheit.

Zaehlung: A=9 B=8

## Praezision

- **Modellname A3B.** A: "A3B (im Video kurz für „ERA 4.521B A3B thinking")" — B: durchgehend nur "A3B". A ist präziser, weil sie das Kürzel an den im Video genannten Volltitel bindet.
- **HLE.** B: "Science-Reasoning: GPQA Diamond 71,08, HLE 9,95." — A: "Der Sprecher nannte HLE als weiteren Prüfstand für wissenschaftliches Reasoning." B ist präziser; A lässt die einzige Zahl weg, die dazu fällt.
- **Long-Context-Training.** B: "Flash-Mask-Attention & memory-efficient Scheduling" — A: "plus Flash-Mask-Attention". B ist vollständiger und damit präziser.
- **A3B-Pretraining.** A: "Text-Pretraining 8.000→128.000 Tokens, SFT auf Mathe/Logik/Code/Science" — B: "Text-Pretraining → Supervised Fine-Tuning → progressives Reinforcement Learning". A ist präziser: gleiche Kette, plus Tokenzahlen und Domänen.
- **Integrationsschicht.** A: "VLM Transformers ab Version 4.54 und mit Fast Deploy" — B: "VLM / Transformers (ab v4.54) + „fast deploy"". Das Transkript sagt "VLM Transformers version 4.54 and up and fast deploy"; A bleibt am Wortlaut, B trennt "VLM" und "Transformers" per Schrägstrich in zwei Dinge, die das Transkript nicht trennt.
- **Inferenz-Verfahren.** A: "Kurzplan, volle Antwort, etwa drei Kandidaten, Verifier wählt" — B: dieselbe Beschreibung, zusätzlich als "(Plan-then-Generate + Best-of-N)" etikettiert. A ist am Gesagten präziser, B fügt eine Benennung hinzu, die der Sprecher nicht verwendet.
- **Vergleichsmodell R1.** A: "R1 — weiteres genanntes Vergleichsmodell" — B: "DeepSeek R1". A gibt exakt wieder, was fällt; B ergänzt einen Hersteller.
- **Rolle von Qwen 2.5 32B.** B (Behauptungen): "32-Mrd-Parameter Dense-Backbone (Qwen 2.5 32B)" — A (Tools): "Qwen 2.5 32B — Backbone von K2 Think". Beide korrekt; B widerspricht sich allerdings in der eigenen Tools-Sektion, wo dasselbe Modell unter "Vergleichsmodelle" steht.
- **Antwortlänge vs. Score.** B: "K2 Thinks Antworten seien kürzer als die von Qwen 3 235B A22B und im Bereich von GPT-OSS 120B." — A: identische Aussage, ordnet Qwen 3 235B A22B in der Tools-Sektion aber zusätzlich den "Mathe- und Code-Zahlen" zu. Bei der Behauptung selbst sind beide gleich präzise; die Tools-Zeile von A ist der unschärfere Ort.
- **Sechsteilige K2-Pipeline.** B: "Die K2-Think-Trainings-Pipeline besteht aus sechs zusammenwirkenden Komponenten." — A: keine Entsprechung. B ist präziser.
- **Durchsatz.** B: "~2.000 Token/Sekunde (Production-Niveau)" — A: "rund 2.000 Tokens pro Sekunde". B ist präziser, weil das Transkript die Einordnung ausdrücklich vornimmt.
- **Benchmark-Zahlen insgesamt.** AIME24 90.83 / 6,7 %, AIME25 81.24 / 3,9 %, HMMT25 73.75 / 7,2 %, OmniMath 60.73 / 11,7 %, Live Codebench V5 63.97 gegen 56.64 / 10,5 %, SciCode 39.2 und 12.0, GPQA Diamond 71.08, MacroSafety 4 0.75 mit 83/89/72/56: in beiden Fassungen vollständig und im Wortlaut korrekt aus dem Transkript übernommen. Gleichwertig.

## Regelverstoesse

### Fassung A
- Keine gefunden. Sektionsfolge stimmt ("Worum es geht", "Besprochene Konzepte", "Behauptungen", "Genannte Tools", "Verwandt"), "Demos / Schritte" fehlt zu Recht — im Video wird nichts vorgeführt, nur beschrieben. Keine Vorrede, keine fremde Überschrift, Sprache deutsch, Fachbegriffe im Original, "Worum es geht" zwei Sätze.
- Randbemerkung ohne Verstoßcharakter: die Sektion "Genannte Tools" führt reine Vergleichsmodelle (OpenAI o3, Anthropic Claude, R1, DeepSeek V3.1, GPT-OSS 120B) als Tools. Die Regel verbietet das nicht; Fassung B tut dasselbe, kennzeichnet es aber als Vergleichsmodelle.

### Fassung B
- Keine gefunden. Gleiche Sektionsfolge, "Demos / Schritte" ebenfalls zu Recht weggelassen, keine Vorrede, Sprache deutsch, "Worum es geht" ein Satz. Fett- und Kursivauszeichnung ist von den Regeln nicht berührt.

Anmerkung zum Prüfmaterial: der Absatz "Hinweise: Das audited_md enthält keine Timestamps …" steht hinter dem Trenner nach Fassung B und trägt keine eigene Überschrift. Ich habe ihn als Notiz des Auftrags gewertet, nicht als Bestandteil von Fassung B; als Bestandteil wäre er eine fremde Sektion.

## Urteil

- Treue: A besser — A hat eine einzige, milde Unschärfe und keine einzige eigene Deutung, B hat drei nicht gedeckte Stellen (ergänzter Hersteller, verdrehte Backbone-Rolle, zusammengezogene Begründung) und zwei eigene Einordnungen.
- Vollstaendigkeit: gleichwertig — die Lücken sind gleich zahlreich (A=9, B=8) und liegen verteilt: A lässt K2-Details weg (HLE-Wert, sechs Pipeline-Teile, Produktionsniveau) und B die A3B-Details (Volltitel, Token-Fahrplan, SFT-Domänen, Performance-Aussage).
- Praezision: gleichwertig — A ist am Wortlaut näher (Modellname, Integrationsschicht, R1, unbenanntes Inferenz-Verfahren), B ist bei den K2-Angaben genauer (HLE-Zahl, memory-efficient Scheduling, sechs Bestandteile, Produktionsniveau); die Benchmark-Zahlen sind in beiden identisch korrekt übernommen.
- Regeltreue: gleichwertig — beide Fassungen halten Sektionsfolge, Auslassungsregel für "Demos / Schritte", Sprache und Begriffsbehandlung ein; in keiner der beiden findet sich ein Verstoß.
