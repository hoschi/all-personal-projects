# Bewertungsauftrag: zwei Zusammenfassungen desselben Videos

Du bekommst das aufbereitete Transkript eines YouTube-Videos und zwei
unabhaengig erzeugte deutsche Zusammenfassungen davon (Fassung A und Fassung B).
Welches Modell welche Fassung geschrieben hat, erfaehrst du nicht und sollst du
nicht raten.

## Die Regeln, nach denen beide Fassungen erzeugt wurden

- Sektionen in dieser Reihenfolge: "## Worum es geht" (1-2 Saetze),
  "## Besprochene Konzepte", "## Behauptungen", "## Demos / Schritte" (nur wenn
  etwas vorgefuehrt wird), "## Genannte Tools" (nur wenn Tools genannt werden),
  "## Verwandt".
- Nur was der Sprecher tatsaechlich sagt. Eigene Spekulation des Modells ist
  verboten: keine eigene Deutung ("vermutlich meint der Sprecher"), keine
  eigenen Schluesse ("daraus folgt"), keine Vorausschau. Spekulation des
  SPRECHERS darf uebernommen werden, markiert mit "laut Sprecher".
- Bei Unsicherheit, ob eine Behauptung woertlich ins Original zurueckfuehrbar
  ist: weglassen.
- Sprache deutsch. Fachbegriffe, Produkt- und Befehlsnamen bleiben im Original.
- Timestamps in "## Behauptungen" sind optional.
- Links auf Vault-Artikel sind erlaubt und erwuenscht; ihre technische
  Korrektheit wird getrennt gemessen und ist NICHT dein Gegenstand.

## Dein Auftrag

Miss beide Fassungen einzeln gegen das Transkript. Frageform ist Plural: nenne
alle Fundstellen, und sag ausdruecklich, wenn es nur eine oder keine gibt.

1. **Nicht gedeckte Aussagen.** Jede Aussage, die so nicht im Transkript steht —
   erfundene Zahl, erfundener Name, verdrehte Aussage, hinzugedichteter
   Zusammenhang. Je Fund: Fassung, Sektion, das Zitat aus der Fassung, und
   warum das Transkript es nicht deckt. Zaehl am Ende je Fassung.
2. **Eigene Spekulation des Modells.** Deutungen, Schluesse, Vorausschau, die
   der Sprecher nicht selbst zieht. Je Fund: Fassung, Zitat. Zaehl je Fassung.
3. **Fehlende wichtige Inhalte.** Geh das Transkript durch und nenne die Punkte,
   die ein Leser der Zusammenfassung braucht und die in einer der beiden
   Fassungen fehlen. Je Fund: welcher Punkt, in welcher Fassung er fehlt, wo er
   im Transkript steht. Zaehl je Fassung.
4. **Praezision der uebernommenen Aussagen.** Wo sagt eine Fassung dasselbe
   praeziser oder korrekter als die andere? Je Fund beide Formulierungen
   nebeneinander.
5. **Regelverstoesse gegen die Sektionsvorgaben** (fehlende Sektion, Sektion
   trotz fehlendem Anlass, Vorrede, fremde Ueberschrift, falsche Sprache).
6. **Gesamturteil je Kriterium** (Treue, Vollstaendigkeit, Praezision,
   Regeltreue): A besser / B besser / gleichwertig, mit einem Satz Begruendung.
   Kein Gesamtsieger-Satz ohne diese vier Einzelurteile.

Auflagen:

- Belege jeden Fund am Transkript. Findest du die Stelle nicht, schreib
  "im Transkript nicht gefunden" statt einer Vermutung.
- Zaehl nicht die Laenge als Qualitaet. Eine kuerzere Fassung ist nur dann
  schlechter, wenn ein benannter Inhalt fehlt.
- Bewerte die technische Form der Links NICHT.
- Rate nicht, welches Modell welche Fassung geschrieben hat.

## Ausgabe

Gib den Bericht als deine Schlussnachricht zurueck, in dieser Form:

    ## Nicht gedeckte Aussagen
    ### Fassung A
    - ...
    ### Fassung B
    - ...
    Zaehlung: A=<n> B=<n>

    ## Eigene Spekulation
    ... (gleiche Form, mit Zaehlung)

    ## Fehlende wichtige Inhalte
    ... (gleiche Form, mit Zaehlung)

    ## Praezision
    - ...

    ## Regelverstoesse
    ### Fassung A
    - ...
    ### Fassung B
    - ...

    ## Urteil
    - Treue: A besser | B besser | gleichwertig — <ein Satz>
    - Vollstaendigkeit: ...
    - Praezision: ...
    - Regeltreue: ...

---

# Transkript (audited_md)

### Einleitung — Zwei kompakte Modelle fordern KI-Giganten heraus

AI giants just got embarrassed. Two lean models just landed and proved that raw size no longer rules. Real progress now comes from smarter training, tighter planning and hardware that actually keeps up. One comes from MBZUAI, the other from BYU. Both are compact, both run fast, both are open. Together they flip the script on what frontier level really means. So let's talk about it.

### A3B — Architektur und Mixture-of-Experts-Design

Starting with BYU, their new model is called ERA 4.521B A3B thinking. And yeah, the name's pretty long and complicated. So to keep it simple, we'll just call it A3B. But the idea behind it is actually straightforward. It's a mixture of experts model. That means in total it has 21 billion parameters, but only three billion are active for each token. The router decides which experts get activated so you don't have to light up the entire network every time. That's how they keep compute costs low while still giving you the benefits of specialization. And to make sure those experts don't all collapse into doing the same thing, they added some extra training tricks like router orthogonalization loss and token balanced loss. The end result is diversity in activation and smoother training.

Now, why three billion active parameters per token? BYU's team is arguing that this number might be the sweet spot. It's enough to handle serious reasoning without making the system so huge that it's impossible to train or deploy. And because they released it under Apache 2.0, anybody can grab it from HuggingFace, whether it's for research or even a commercial product. That kind of openness matters a lot, especially when most reasoning focused models right now are closed or API only.

### A3B — Kontextfenster und Trainings-Pipeline

So, one of the biggest features here is the context window. A3B can handle 128,000 tokens, which is pretty decent. And the way they pulled this off is actually very clever. They progressively scaled rotary position embeddings from 10,000 up to 500,000 during training. Pair that with flash mask, attention, and memory efficient scheduling, and suddenly long context training doesn't kill your hardware. This isn't a patchwork solution either. It's directly trained into the model.

Training itself followed a pretty structured recipe. Stage one was text only pre-training starting small at 8,000 tokens gradually going up to 128,000. They skipped the vision and multimodal parts here since this model is text only. Then came supervised fine-tuning on math, logic, coding, and science. After that, progressive reinforcement learning — first logic, then math, and programming, then broader reasoning tasks. And here's something interesting. They used unified preference optimization, which blends preference learning with PO that helps avoid reward hacking and makes alignment more stable. Basically, it's a training pipeline laser focused on making the model reason better.

### A3B — Tool Use, Deployment und Performance

Another piece that stands out is tool use. This model has built-in structured function calling. So, it's not just generating text. It can call external APIs or other tools while reasoning. That's a huge deal for things like program synthesis or symbolic reasoning. It also integrates with VLM Transformers version 4.54 and up and fast deploy. If you're building multi-agent workflows or enterprise systems that need both long context reasoning and external tool use, this capability makes A3B a very practical option.

Performance-wise, it looks great. It's strong across logical reasoning, math, scientific question answering, and programming. It shows stable accuracy on long chain of thought benchmarks, competitive results against much larger dense models, and reliable academic synthesis outputs. So BYU is making the case that with a sparse mixture of experts design extended context windows and a careful training pipeline you can get frontier level reasoning without going into trillion parameter territory compared to OpenAI's O3, Anthropic's Claude, R1, or Qwen 3. BYU's approach is different. It's efficient, long context ready and most importantly open under a permissive license.

> [!info] Werbung ausgeschnitten (~Sponsor "Faceless Empire")

### K2 Think — Überblick und Dense-Architektur

Now, let's look at K2 Think from MBZUAI and G42. If BYU went sparse, MBZUAI went dense. K2 Think starts with a 32 billion parameter backbone Qwen 2.5 32B and then layers on a heavy post-training pipeline plus an inference scaffold. What they're proving is that you can take a manageable base model and with the right recipe get results that rival much larger systems.

### K2 Think — Trainings-Pipeline: SFT und Reinforcement Learning

The training pipeline for K2 Think has six big pieces that all work together. So let's break it down in plain language.

The first part is called long chain of thought supervised fine-tuning. But what it really means is they fed the model tons of examples where people solved problems step by step. Math problems, code, science questions, even general chat. The idea is to teach the model not just to spit out final answers, but to actually show its reasoning. And the gains showed up quickly. After only about half a round of training, accuracy on tough math tasks climbed sharply, showing that the model was learning structured reasoning earlier than expected. And that was before they even added reinforcement learning. For a model of this size, that's already really impressive.

Then they took it to the next stage, reinforcement learning. But instead of using just human preferences, they introduced something completely new, verifiable rewards. They built a dataset called Guru with about 92,000 prompts covering six areas: math, code, science, logic, simulation, and tabular data. The key difference here is that the model isn't just rewarded for sounding good. It's rewarded for answers that can actually be checked as right or wrong. That makes the learning signal much more reliable and reduces the chance of the model cheating the system, which is what reward hacking usually looks like.

They also found something really interesting. If you start this reinforcement learning process from a model that's already been fine-tuned too much, the gains flatten out. But if you start earlier, closer to the base model, the improvements are massive. This showed that there's a balance. You want enough fine-tuning to give the model structure, but not so much that you leave no room for reinforcement learning to actually make it better.

### K2 Think — Inference-Zeit-Planung und Benchmark-Ergebnisse

Now, here's the part that makes K2 Think feel more agent-like. At inference time, that's when it's actually answering questions. It doesn't just dive straight into the solution. Instead, it first writes a short plan, kind of like an outline, and then it generates the full answer based on that plan. After that, it produces a few different possible answers, say three, and runs them through verifiers to figure out which one is the most likely to be correct. The outcome is not just better accuracy, but also shorter, cleaner answers. And that's unusual because usually when you add more steps, you end up with longer outputs.

At inference, K2 Think shows a rare combination of accuracy, efficiency, and raw speed. On AIME24, it scored 90.83 with responses 6.7% shorter. On AIME25, it reached 81.24 while trimming 3.9%. On HMMT25, the score was 73.75 with a 7.2% cut. And on Omnimath, one of the toughest math benchmarks, it landed at 60.73 while shrinking answers by 11.7%. That combination of high accuracy and leaner outputs is rare since most models get wordier as tasks get harder. And compared to other systems, its answers are actually shorter than Qwen 3 235B, A22B, and in the same range as GPTO OSS 120B, which makes these efficiency gains even more impressive.

The pattern holds outside of math, too. On Live Codebench V5, a major coding benchmark, K2 Think scored 63.97 ahead of Qwen 3 235B A22B at 56.64, while also cutting response length by 10.5%. On SciCode, it posted 39.2 on subproblems and 12.0 on main tasks, showing that its coding ability extends beyond a single data set. For science reasoning, it reached 71.08 on GPQA Diamond and 9.95 on HLE. Again, proving it's not just a math specialist, but competitive across knowledge heavy areas as well.

### K2 Think — Sicherheit, Geschwindigkeit und Offenheit

And it doesn't just perform well, it's safe and robust. The MacroSafety 4 score comes in at 0.75 with refusal at 83, conversational robustness at 89, jailbreak resistance at 72, and cyber security at 56. So while math and reasoning are its highlights, MBZUAI's team clearly put thought into balancing raw capability with guard rails.

All of this is backed up by raw speed with speculative decoding predicting multiple tokens at once and Cerebras wafer scale engine hardware handling inference. K2 Think pushes out around 2,000 tokens per second. That's production level throughput, not just research speed. And it brings their small but fast philosophy to life. When you add it all up, the picture is clear. K2 Think delivers frontier level reasoning across math, coding, and science, runs faster and leaner than most, and does it while staying safer than you'd expect. And the real kicker is that it achieves all this while competing with models like DeepSeek V3.1 at 671B parameters and GPTO's 120B despite being just 32B. That kind of parameter efficiency is what makes this system stand out.

And just like BYU, MBZUAI made this open, but they went all the way. Weights, training data, deployment code, test time, optimization code. Full transparency, that's rare, especially for a model performing this well. For researchers, it's huge. You can reproduce results, test new ideas, and extend the system. For enterprises, it's another strong open option instead of depending on closed proprietary APIs.

> [!info] Werbung ausgeschnitten (~Sponsor "Faceless Empire")

### Fazit und Ausblick

So, what do you think? Are BYU and MBZUAI showing us the real future of reasoning AI, or are we still stuck chasing the wrong ideas? Drop your thoughts in the comments. Make sure to hit subscribe and like if you found this interesting. Thanks for watching, and catch you in the next one.

---

# Fassung A

## Worum es geht
Der Sprecher stellt zwei kompakte, offene Reasoning-Modelle vor: A3B von BYU (sparse MoE) und K2 Think von MBZUAI/G42 (dichtes 32B). These: Frontier-Reasoning kommt von Training, Inferenz-Planung und Hardware, nicht von Rohgröße.
## Besprochene Konzepte
- Mixture of Experts — 21 Mrd. Parameter gesamt, nur 3 Mrd. pro Token aktiv, ein Router wählt die Experten
- Router-Orthogonalisierungs-Loss und Token-Balanced-Loss — sollen Experten-Kollaps verhindern und das Training glätten
- 3 Mrd. aktive Parameter als Sweet Spot — laut BYU genug für ernstes Reasoning, noch trainier- und deploybar
- 128.000-Token-Kontext — Rotary Position Embeddings progressiv von 10.000 auf 500.000 skaliert, plus Flash-Mask-Attention
- A3B-Trainingsrezept — Text-Pretraining 8.000→128.000 Tokens, SFT auf Mathe/Logik/Code/Science, progressives RL, Unified Preference Optimization
- Structured Function Calling — das Modell ruft während des Reasonings APIs und andere Tools auf
- Dichtes 32B-Backbone — K2 Think setzt auf Qwen 2.5 32B plus Post-Training und Inferenz-Gerüst, nicht auf Sparse-MoE
- Long-Chain-of-Thought-SFT — Schritt-für-Schritt-Lösungen statt nur Endergebnisse
- Verifiable Rewards / Datensatz Guru — rund 92.000 Prompts; Belohnung nur für prüfbar richtige Antworten
- SFT/RL-Balance — zu viel SFT vor RL flacht die RL-Gewinne ab; früherer RL-Start bringt mehr
- Inferenz-Zeit-Planung — Kurzplan, volle Antwort, etwa drei Kandidaten, Verifier wählt
- Speculative Decoding — mehrere Tokens auf einmal vorhersagen, hier an Cerebras-Hardware gekoppelt
## Behauptungen
- Rohe Modellgröße bestimmt das Frontier-Niveau nicht mehr; Fortschritt kommt von Training, Planung und Hardware, die mithält.
- A3B (im Video kurz für „ERA 4.521B A3B thinking“) ist ein MoE mit 21 Mrd. Parametern, davon 3 Mrd. aktiv pro Token.
- A3B steht unter Apache 2.0 auf HuggingFace, auch für kommerzielle Produkte.
- Der 128.000-Token-Kontext ist direkt ins Training gebaut, kein nachträglicher Patch.
- Unified Preference Optimization mischt Preference Learning mit PO; der Sprecher sagt, das vermeide Reward Hacking und mache Alignment stabiler.
- A3B hat eingebautes strukturiertes Function Calling.
- A3B integriert mit VLM Transformers ab Version 4.54 und mit Fast Deploy.
- Der Sprecher hält A3B bei logischem Reasoning, Mathe, wissenschaftlichem QA und Programmierung für stark und gegen deutlich größere Dense-Modelle konkurrenzfähig.
- BYU setze anders an als OpenAI o3, Anthropic Claude, R1 oder Qwen 3: effizient, long-context-fähig, offen unter permissiver Lizenz.
- K2 Think zeige, dass ein handhabbares 32B-Basismodell plus Post-Training und Inferenz-Gerüst an viel größere Systeme heranreicht.
- Nach etwa einer halben SFT-Runde stieg die Genauigkeit auf schweren Mathe-Aufgaben bereits deutlich, noch vor Reinforcement Learning.
- RL mit verifizierbaren Rewards auf Guru (Mathe, Code, Science, Logik, Simulation, Tabellen) sei zuverlässiger als Belohnung nur für „gut klingende“ Antworten.
- RL näher am Basismodell bringe große Gewinne; startet man nach zu viel Fine-Tuning, flachen sie ab.
- Plan, dann Antwort, dann mehrere Kandidaten plus Verifier steigere die Genauigkeit und mache Antworten kürzer und klarer.
- AIME24: 90.83, Antworten 6,7 % kürzer.
- AIME25: 81.24, Antworten 3,9 % kürzer.
- HMMT25: 73.75, Antworten 7,2 % kürzer.
- OmniMath: 60.73, Antworten 11,7 % kürzer.
- Antworten kürzer als bei Qwen 3 235B A22B und in der Größenordnung von GPT-OSS 120B.
- Live Codebench V5: 63.97 gegen 56.64 bei Qwen 3 235B A22B, Antworten 10,5 % kürzer.
- SciCode: 39.2 auf Teilaufgaben, 12.0 auf Hauptaufgaben.
- GPQA Diamond: 71.08.
- Der Sprecher nannte HLE als weiteren Prüfstand für wissenschaftliches Reasoning.
- MacroSafety 4: 0.75; Refusal 83; Conversational Robustness 89; Jailbreak Resistance 72; Cyber Security 56.
- Mit Speculative Decoding und Cerebras Wafer-Scale Engine rund 2.000 Tokens pro Sekunde.
- K2 Think konkurriere mit DeepSeek V3.1 (671B) und GPT-OSS 120B, sei aber 32B.
- MBZUAI veröffentliche Gewichte, Trainingsdaten, Deployment-Code und Test-Time-Optimierungs-Code.
## Genannte Tools
- [[hugging face]] — Bezugsort für A3B-Gewichte unter Apache 2.0
- VLM Transformers 4.54+ — genannte Integrationsschicht für A3B
- Fast Deploy — genannte Deployment-Option für A3B
- Cerebras Wafer-Scale Engine — Inferenz-Hardware für die genannten ~2.000 Tokens/s von K2 Think
- Qwen 2.5 32B — Backbone von K2 Think
- Qwen 3 / Qwen 3 235B A22B — Vergleichsmodell bei Mathe- und Code-Zahlen
- OpenAI o3 — geschlossenes Vergleichsmodell
- Anthropic Claude — geschlossenes Vergleichsmodell
- R1 — weiteres genanntes Vergleichsmodell
- DeepSeek V3.1 — 671B-Vergleich, dem K2 Think laut Sprecher die Stirn bietet
- GPT-OSS 120B — Vergleich für Antwortlänge und Parametereffizienz
## Verwandt
- [lokale-ki-werkzeuge](obsidian://open?vault=knowledge-base&file=lokale-ki-werkzeuge) — Hardware, Runtimes und MoE-Durchsatz bei kompakten lokalen Modellen
- [llm-benchmark-register](obsidian://open?vault=knowledge-base&file=llm-benchmark-register) — AIME eingeschränkt, LiveCodeBench brauchbar (Split V5), GPQA-Diamond eingeschränkt, HLE-Original korrumpiert
- [[Lokale KI]] — Einstieg zu lokal laufenden Modellen statt API-only
- [[welche LLM für was]] — Modellwahl nach Aufgabe, inklusive offener Alternativen
- [[Tiny AI Is About to Change Everything (IBM Granite 4.0)]] — dieselbe These: kompakt und effizient statt Rohgröße
- [[New DeepSeek «Chimera» SHOCKED Experts 2X Faster and Smarter Than Original DeepSeek]] — andere Expert-Kombination, verwandt zur Sparse-/Experten-Familie
- [[DeepSeek’s New AI Just Humiliated GPT-5]] — DeepSeek V3.1, im Video als Vergleichsgröße
- [[New AI Just Broke Reasoning Limits at HUMAN Level]] — Inferenz-Zeit-Reasoning und kürzere Antworten
- [[Modelle von Hugging Face mit Ollama und n8n verwenden]] — praktische Nutzung von HuggingFace-Gewichten lokal

---

# Fassung B

## Worum es geht

Vorstellung zweier kompakter, quelloffener KI-Modelle — **A3B** (BYU) und **K2 Think** (MBZUAI/G42) — die belegen sollen, dass Reasoning auf Frontier-Niveau nicht über schiere Parametergröße, sondern über cleveres Training, Inferenz-Planung und passende Hardware erreichbar ist.

## Besprochene Konzepte

- Mixture of Experts (MoE) — Sparse-Architektur, bei der ein Router pro Token nur einen Teil der Experten aktiviert.
- Sparse vs. Dense — A3B geht den Sparse-Weg (MoE), K2 Think den Dense-Weg (durchgängig aktivierte Parameter).
- Router Orthogonalization Loss & Token Balanced Loss — Trainingstricks, damit die Experten nicht in dieselbe Funktion kollabieren.
- „Sweet Spot" aktiver Parameter — These, dass ~3 Mrd. aktive Parameter pro Token genug für ernsthaftes Reasoning sind.
- Progressive Skalierung der Rotary Position Embeddings — von 10.000 auf 500.000 während des Trainings, um 128k-Kontext zu erreichen.
- Flash-Mask-Attention & memory-efficient Scheduling — Long-Context-Training ohne Hardware-Überlastung.
- Mehrstufige Trainings-Pipeline — Text-Pretraining → Supervised Fine-Tuning → progressives Reinforcement Learning.
- Unified Preference Optimization — Mischung aus Preference Learning und PO gegen Reward Hacking, für stabileres Alignment.
- Structured Function Calling / Tool Use — eingebaut, sodass das Modell beim Reasoning externe APIs/Tools aufrufen kann.
- Long Chain-of-Thought SFT — das Modell lernt, seinen Lösungsweg Schritt für Schritt zu zeigen statt nur Endantworten.
- Reinforcement Learning with Verifiable Rewards — Belohnung nur für nachprüfbar korrekte Antworten statt für „gut klingende".
- Reward Hacking — das Austricksen des Belohnungssignals, das verifizierbare Rewards reduzieren sollen.
- Balance Fine-Tuning ↔ RL — zu starkes Fine-Tuning vor dem RL lässt die RL-Gewinne abflachen.
- Inferenz-Zeit-Planung — erst kurzer Plan, dann Antwort, dann mehrere Kandidaten via Verifier auswählen (Plan-then-Generate + Best-of-N).
- Speculative Decoding — mehrere Token gleichzeitig vorhersagen für höheren Durchsatz.
- Parameter-Effizienz — vergleichbare Leistung wie deutlich größere Modelle bei Bruchteil der Parameter.

## Behauptungen

- A3B hat insgesamt 21 Mrd. Parameter, aber nur 3 Mrd. sind pro Token aktiv.
- BYU argumentiert, ~3 Mrd. aktive Parameter seien der Sweet Spot für ernsthaftes Reasoning, ohne das System untrainierbar/undeploybar zu machen.
- A3B ist unter Apache 2.0 lizenziert und über HuggingFace frei verfügbar — auch für kommerzielle Produkte.
- A3B verarbeitet 128.000 Token Kontext.
- Das lange Kontextfenster ist direkt antrainiert, keine nachträgliche Patchwork-Lösung.
- A3B ist text-only; Vision/Multimodal wurde bewusst weggelassen.
- A3B bringt eingebautes strukturiertes Function Calling mit und kann externe APIs/Tools beim Reasoning aufrufen.
- A3B integriert mit VLM/Transformers ab Version 4.54 sowie „fast deploy".
- Laut Sprecher erreicht A3B Frontier-Reasoning ohne Billionen-Parameter — im Vergleich zu OpenAI O3, Anthropic Claude, R1 oder Qwen 3 sei BYUs Ansatz effizient, long-context-fähig und offen lizenziert.
- K2 Think setzt auf ein 32-Mrd-Parameter Dense-Backbone (Qwen 2.5 32B) plus schwere Post-Training-Pipeline und Inferenz-Scaffold.
- Die K2-Think-Trainings-Pipeline besteht aus sechs zusammenwirkenden Komponenten.
- Schon nach etwa einer halben SFT-Runde stieg die Genauigkeit bei schweren Mathe-Aufgaben stark — noch vor dem Reinforcement Learning.
- Der Guru-Datensatz umfasst ~92.000 Prompts über sechs Bereiche: Math, Code, Science, Logic, Simulation, Tabular Data.
- Startet man das RL von einem zu stark fine-getunten Modell, flachen die Gewinne ab; startet man näher am Base-Modell, sind die Verbesserungen massiv.
- Zur Inferenzzeit schreibt K2 Think erst einen kurzen Plan, generiert dann die volle Antwort, erzeugt mehrere (z. B. drei) Kandidaten und wählt per Verifier den wahrscheinlich korrektesten.
- Trotz mehr Inferenz-Schritten werden die Antworten kürzer und sauberer — ungewöhnlich, da Modelle bei härteren Aufgaben sonst wortreicher werden.
- Benchmarks: AIME24 90,83 (6,7 % kürzer), AIME25 81,24 (3,9 % kürzer), HMMT25 73,75 (7,2 % kürzer), Omnimath 60,73 (11,7 % kürzer).
- K2 Thinks Antworten seien kürzer als die von Qwen 3 235B A22B und im Bereich von GPT-OSS 120B.
- Live Codebench V5: K2 Think 63,97 vor Qwen 3 235B A22B (56,64), bei 10,5 % kürzeren Antworten.
- SciCode: 39,2 auf Subproblemen, 12,0 auf Haupt-Tasks.
- Science-Reasoning: GPQA Diamond 71,08, HLE 9,95.
- MacroSafety-4-Score 0,75 — Refusal 83, Conversational Robustness 89, Jailbreak Resistance 72, Cybersecurity 56.
- K2 Think nutzt Speculative Decoding und Cerebras Wafer-Scale-Engine und erreicht ~2.000 Token/Sekunde (Production-Niveau).
- K2 Think konkurriere mit DeepSeek V3.1 (671B) und GPT-OSS (120B), obwohl es nur 32B hat.
- MBZUAI veröffentlicht alles: Gewichte, Trainingsdaten, Deployment-Code und Test-Time-Optimization-Code.

## Genannte Tools

- [[hugging face]] — Modell-Hub, von dem A3B (Apache 2.0) für Forschung oder kommerzielle Nutzung bezogen werden kann.
- Cerebras Wafer-Scale Engine — Inferenz-Hardware hinter K2 Thinks ~2.000 Token/s.
- VLM / Transformers (ab v4.54) + „fast deploy" — Deployment-Stack, mit dem A3B integriert.
- Vergleichsmodelle (nur namentlich genannt): OpenAI O3, Anthropic Claude, DeepSeek R1 & V3.1 (671B), Qwen 3 (235B A22B) bzw. Qwen 2.5 32B, GPT-OSS 120B.

## Verwandt

- [[New AI Just Broke Reasoning Limits at HUMAN Level]] — weiteres Video über einen Reasoning-Modell-Durchbruch, gleiches Themenfeld.
- [[New Chinese AI Model Destroys DeepSeek 100X More Powerful]] — effizientes Modell gegen DeepSeek, dieselbe „klein schlägt groß"-Erzählung.
- [[Apple’s New AI SHOCKS The Industry With 85X More Speed (Beating Everyone)]] — Fokus auf Inferenz-Geschwindigkeit und Effizienz.
- [[Modelle von Hugging Face mit Ollama und n8n verwenden]] — praktische Nutzung offener HuggingFace-Modelle.
- [[welche LLM für was]] — Auswahl des passenden LLM je nach Use-Case.
- [lokale-ki-werkzeuge](obsidian://open?vault=knowledge-base&file=lokale-ki-werkzeuge) — lokale Modell-Auswahl, Hardware und Effizienz-Abwägungen.

---

Hinweise: Das audited_md enthält **keine** Timestamps, daher keine `(M:SS)`-Marker in den Behauptungen. Eine **Demos / Schritte**-Sektion entfällt, weil im Video nichts live vorgeführt, sondern nur beschrieben wird.
