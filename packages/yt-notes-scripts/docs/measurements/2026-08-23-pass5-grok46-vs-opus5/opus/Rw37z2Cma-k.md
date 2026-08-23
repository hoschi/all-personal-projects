---
tags:
  - youtube
aliases:
  - "ERNIE-4.5 und K2 Think: Effiziente Open-Source-Reasoning-Modelle im
    Vergleich"
channelName: AI Revolution
publish_date: 2025-09-11
display_title: "ERNIE-4.5 und K2 Think: Effiziente Open-Source-Reasoning-Modelle im Vergleich"
description: "Das Video stellt zwei neue Open-Source-Reasoning-Modelle vor:
  Baidus ERNIE-4.5-21B A3B Thinking und MBZUAIs K2 Think, und vergleicht sie mit
  großen proprietären Modellen. A3B nutzt Mixture-of-Experts mit 3B aktiven
  Parametern pro Token, 128K-Kontextfenster und integriertes Function-Calling
  (Apache-2.0); K2 Think baut auf Qwen 2.5 32B auf und kombiniert Long-CoT-SFT,
  verifiable Rewards (Guru-Datensatz, 92K Prompts), Inference-Zeit-Planung und
  Speculative Decoding auf Cerebras-Hardware (~2000 Token/s). Relevant für
  Entwickler und Forscher, die leistungsfähige, quelloffene Reasoning-Modelle
  für Multi-Agent-Workflows, mathematische oder Code-Aufgaben einsetzen wollen,
  ohne auf proprietäre APIs angewiesen zu sein."
youtube_id: Rw37z2Cma-k
---

# New Chinese AI Model Destroys DeepSeek: 100X More Powerful

## Worum es geht

Vorstellung zweier kompakter, quelloffener KI-Modelle — **A3B** (BYU) und **K2 Think** (MBZUAI/G42) — die belegen sollen, dass Reasoning auf Frontier-Niveau nicht über schiere Parametergröße, sondern über cleveres Training, Inferenz-Planung und passende Hardware erreichbar ist.

---

## Notizen

[URL](https://youtu.be/Rw37z2Cma-k?si=L9ex8eJbpstO_rWu)

Heißt 3B aktiv, dann, dass ich auch nicht den vRAM-Speicher brauche für die ganzen 21B-Parameter? Mixture of Experts heißt ja aber auch, dass, wenn ich eine Aufgabe habe, die sehr speziell ist, wie zum Beispiel die Erzeugung von Code, ich kein 21B-Modell habe, sondern quasi nur ein 3B-Modell, weil eben das der Experte für Coding ist?

---

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
