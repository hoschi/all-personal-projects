## Worum es geht
Liquid AI hat mit LFM2VL eine Familie von Vision-Language-Modellen vorgestellt, die direkt auf Smartphones, Laptops und Wearables laufen sollen. Das Video beschreibt Architektur, Training, Benchmarks, Integration (Hugging Face Transformers, llama.cpp, Leap, Apollo) und die LFM-1.0-Lizenz.
## Besprochene Konzepte
- LFM2VL — Vision-Language-Modelle für niedrige Latenz, gebaut für Alltagsgeräte statt Server-Racks.
- Liquid Foundation Models (LFMs) — Ansatz aus Mathematik und Signalverarbeitung statt immer größerer Transformer; leichter, schneller, flexibler.
- Device-aware On-Device-Inferenz — Modelle sollen auf kleinen Geräten laufen; Cloud-Abhängigkeit, Kosten und Latenz sollen sinken.
- Native-Resolution-Verarbeitung — Bilder bis 512×512 ohne unnötiges Skalieren; größere Bilder in 512×512-Quadrate, beim 1.6B-Modell plus Thumbnail der Gesamtszene.
- Pixel Unshuffle — Multimodal-Projector reduziert Image-Tokens, um Detail und Tempo auszubalancieren.
- Laufzeit-Tradeoff Tokens/Patches — Nutzer stellen Token- und Patch-Zahl zwischen Tempo und Genauigkeit ein.
- Stufenweises Multimodal-Training — Backbone-Pretraining, Mid-Training mit verschobenem Text-/Bild-Anteil (von etwa 95 % Text auf 30 %), danach Fine-Tuning für Bildverständnis.
- [[2025-08 MLX vs GGUF Quantisierung]] — kleinere Datentypen, damit die Modelle mit weniger Speicher laufen.
- LFM-1.0-Lizenz — Open Weights auf Apache-2.0-Basis mit Umsatzgrenze.
## Behauptungen
- Liquid AI stammt aus MIT CSAIL.
- LFMs sind leichter, schneller und flexibler als der Branchenweg „immer größere Transformer“; Effizienz sei das Produkt.
- LFM2VL 450M ist für extrem speicherarme Geräte gedacht; LFM2VL 1.6B bleibt kompakt genug für eine GPU oder ein High-End-Mobilgerät.
- Modelle dieser Leistungsklasse bräuchten sonst große Server-Setups.
- Laut Liquid AI ist die GPU-Inferenz bis zu zweimal schneller als bei anderen Vision-Language-Modellen; die Verarbeitungszeit könne sich halbieren.
- Das 1.6B-Backbone sitzt auf LFM2 1.2B, das 450M-Backbone auf LFM2 350M.
- Der Vision-Encoder ist SigLIP 2 NaFlex: rund 400 Millionen Parameter in der großen Variante, 86 Millionen in der kleinen.
- Beispiel-Tokenzahlen nach Pixel Unshuffle: 256×384 → etwa 96 Tokens, 384×680 → etwa 240, 1000×3000 → etwa 1020.
- Das Training umfasste etwa 100 Milliarden multimodale Tokens aus Open-Source-Datensätzen und eigener synthetischer Vision-Daten.
- 1.6B: Real-World-QA 65.23 (auf Augenhöhe mit InternVL3), InfoVQA 58.68, OCR Bench 742.
- 450M: Real-World-QA 52.29, OCR Bench 655.
- Im Standardtest (Bild 1024×1024, kurzer Prompt, 100 generierte Tokens) seien die Modelle bis zu zweimal schneller als vergleichbare Systeme.
- Drei bis vier Sekunden Bildverarbeitung machten Smart Camera, Phone-Assistent oder kleinen Roboter unbrauchbar; eine bis zwei Sekunden änderten das.
- LFM2VL integriert sich in Hugging Face Transformers; es gibt Beispielcode für llama.cpp und Unterstützung für Quantisierung.
- Leap (Start im Juli) ist ein Software-Kit für kleine KI-Modelle auf Mobile (iOS, Android und andere Systeme).
- Die Companion-App Apollo erlaubt Offline-Tests.
- Ziel sei lokale Ausführung statt Cloud: besser für Privacy, Kosten und Tempo.
- Unter 10 Millionen USD Umsatz: Research und kommerzielle Nutzung; darüber Commercial License bei Liquid AI.
- Genannte Einsatzfelder: Real-time Image Captioning, multimodale Chatbots, Visual Search, Robotik, IoT, Smart Cameras.
- Laut Sprecher steuert die Branche auf KI, die privat, schnell und günstig auf vorhandenen Geräten läuft.
## Genannte Tools
- LFM2VL / Liquid AI — Vision-Language-Modelle und Hersteller.
- SigLIP 2 NaFlex — Vision-Encoder für die Bildseite.
- InternVL3 — Vergleichsmodell auf Real-World-QA.
- Hugging Face Transformers — Integrationsweg für die Modelle.
- [lokale-ki-werkzeuge](obsidian://open?vault=knowledge-base&file=lokale-ki-werkzeuge) — lokale Runtime; Liquid AI liefert Beispielcode für llama.cpp.
- Leap — Software-Kit, um kleine Modelle auf Mobilgeräten zu betreiben.
- Apollo — Companion-App für Offline-Tests.
## Verwandt
- [[Apple’s New AI SHOCKS The Industry With 85X More Speed (Beating Everyone)]] — anderes On-Device-VLM (FastVLM), gleicher Themenkreis Latenz und Gerätelauf.
- [[Building a Vision App with Ollama Structured Outputs]] — lokale Vision-Modelle in einer App, ohne Cloud.
