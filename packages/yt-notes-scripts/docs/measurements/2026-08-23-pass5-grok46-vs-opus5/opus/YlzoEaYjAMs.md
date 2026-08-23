---
tags:
  - youtube
aliases:
  - "LFM2-VL: Multimodales Open-Source-Modell für lokale Geräte"
channelName: AI Revolution
publish_date: 2025-08-21
display_title: "LFM2-VL: Multimodales Open-Source-Modell für lokale Geräte"
description: "Liquid AI stellt LFM2-VL vor, eine Familie von
  Vision-Language-Modellen (450M und 1,6B Parameter), die direkt auf
  Smartphones, Laptops und Wearables laufen. Das Video erklärt die Architektur —
  LFM2-Backbone, SigLIP-2-NaFlex-Vision-Encoder, Pixel-Unshuffle-Projektor,
  native Auflösungsverarbeitung bis 512×512 — sowie Benchmarks (Real-World QA:
  65,23; OCR Bench: 742) und bis zu 2× schnellere Inferenz gegenüber
  vergleichbaren Modellen. Relevant für Entwickler, die Edge-AI-Anwendungen
  (Smart Cameras, Offline-Assistenten, Robotik, IoT) ohne Cloud-Abhängigkeit
  umsetzen wollen, mit Integration via Hugging Face Transformers, llama.cpp und
  der Leap/Apollo-Plattform."
youtube_id: YlzoEaYjAMs
---

# Liquid AI Just Dropped the Fastest, Best Open-Source Foundation Model

## Worum es geht

Liquid AI hat mit LFM2VL eine Familie von Vision-Language-Modellen veröffentlicht, die direkt auf Geräten wie Smartphones, Laptops und Wearables laufen sollen. Das Video erklärt Architektur, Benchmarks, Lizenz und Anwendungsfälle dieses Ansatzes für effiziente, lokale multimodale KI.

---

## Notizen

[URL](https://youtu.be/YlzoEaYjAMs?si=-2ew_tMbCG_esD55)

Hier geht es um ein Vision Modell das so klein ist dass es auf consumer Geräte passt und mit einer Single GPU sehr gut läuft. Interessant finde ich das weniger, da selbst 4b oder 12b Modelle bei mir lokal bei schwierigeren OCR Aufgaben nicht so gut performt haben. Hier habe ich hauptsächlich Gemma 3 getestet. Deshalb ist es interessant hier bei den Benchmarks Beispiele zu sehen wo man andere Modelle finden kann die ähnliche Aufgaben lösen

---

## Besprochene Konzepte

- Vision-Language-Modelle (VLM) — KI-Modelle, die Bild und Text gemeinsam verarbeiten.
- On-Device-/Edge-KI — Modelle, die lokal auf Endgeräten statt in der Cloud laufen.
- Liquid Foundation Models (LFM) — Liquid AIs Modellfamilie, gebaut auf Ideen aus Mathematik und Signalverarbeitung statt reiner Transformer-Skalierung.
- Effizienz als Produktphilosophie — Liquid AI stellt Geschwindigkeit und geringen Ressourcenbedarf in den Mittelpunkt.
- Dreiteilige Architektur — Sprachmodell-Backbone, Vision-Encoder und Multimodal-Projector.
- Native-Resolution-Bildverarbeitung — Bilder werden bis 512×512 nativ verarbeitet, größere in 512×512-Kacheln zerlegt.
- Pixel Unshuffle — Technik im Multimodal-Projector, die die Zahl der Bild-Tokens reduziert.
- Adaptive Inferenz — zur Laufzeit einstellbar zwischen maximaler Geschwindigkeit und maximaler Genauigkeit.
- Mehrstufiges Training — Pre-Training des Backbones, Mid-Training mit gradueller Text-Bild-Mischung, dann Fine-Tuning.
- Open Weights mit Lizenzbedingungen — Veröffentlichung als offene Gewichte unter eingeschränkter Lizenz.

## Behauptungen

- LFM2VL fühlt sich wie ein Wendepunkt für multimodale KI auf eigenen Geräten an.
- Die Modelle erreichen bis zu doppelt so hohe Inferenzgeschwindigkeit auf GPUs wie vergleichbare Vision-Language-Modelle.
- Liquid AI kommt aus dem MIT CSAIL, einer der angesehensten KI-Forschungsgruppen.
- Liquid AI wiederholt, dass Effizienz ihr Produkt sei.
- Es gibt zwei Varianten: LFM2VL mit 450 Millionen und mit 1,6 Milliarden Parametern.
- Die 450M-Variante ist für extrem ressourcenbeschränkte Geräte gedacht.
- Die 1,6B-Variante läuft noch auf einer einzelnen GPU oder einem High-End-Mobilgerät.
- Der 1,6B-Backbone basiert auf LFM2 1.2B, der 450M-Backbone auf LFM2 350M.
- Als Vision-Encoder kommen SigLIP 2 NaFlex zum Einsatz (ca. 400M bzw. 86M Parameter).
- Die 1,6B-Variante verarbeitet zusätzlich ein Thumbnail des Gesamtbildes für den Überblick.
- Ein 256×384-Bild erzeugt ca. 96 Tokens, ein 384×680-Bild ca. 240, ein 1.000×3.000-Bild ca. 1.020 Tokens.
- Das Training begann mit ca. 95% Text und endete bei 30%, mit insgesamt ca. 100 Milliarden multimodalen Tokens.
- Es wurden sowohl Open-Source-Datensätze als auch eigene synthetische Vision-Daten genutzt.
- Das 1,6B-Modell erreicht 65,23 auf Real-World-QA (vergleichbar mit InternVL3), 58,68 auf InfoVQA und 742 auf OCR Bench.
- Das kleinere Modell erreicht 52,29 auf Real-World-QA und 655 auf OCR Bench.
- Im Standardtest (1.024×1.024-Bild, kurzer Prompt, 100 Tokens) sind die Modelle bis zu doppelt so schnell wie vergleichbare Systeme.
- Geschwindigkeit ist für reale Anwendungen wie Smart-Kameras, Telefon-Assistenten oder kleine Roboter entscheidend.
- LFM2VL integriert sich nahtlos mit Hugging Face Transformers.
- Es gibt Beispielcode für llama.cpp, und Quantisierung wird unterstützt.
- Die Leap-Plattform wurde im Juli gelauncht und funktioniert über iOS, Android und andere Systeme.
- Die Begleit-App Apollo erlaubt Entwicklern, alles offline zu testen.
- Liquid AI will die Abhängigkeit von der Cloud reduzieren — besser für Privatsphäre, Kosten und Geschwindigkeit.
- Die Modelle stehen unter der LFM-1.0-Lizenz, basierend auf Apache 2.0, aber mit Bedingungen.
- Firmen mit unter 10 Millionen Umsatz dürfen die Modelle für Forschung und kommerzielle Projekte nutzen; größere Firmen brauchen eine kommerzielle Lizenz.
- Genannte Anwendungsfälle: Echtzeit-Bildbeschreibung, multimodale Chatbots, visuelle Suche, Robotik, IoT-Systeme und Smart-Kameras.
- Laut Sprecher geht die Branche dorthin, weil Menschen KI wollen, die privat, schnell und günstig im Betrieb ist.

## Genannte Tools

- Hugging Face Transformers — Bibliothek, mit der sich LFM2VL nahtlos integrieren lässt.
- llama.cpp — Laufzeitumgebung, für die Beispielcode bereitgestellt wird.
- Leap — Software-Kit von Liquid AI, um kleine KI-Modelle auf Mobilgeräten laufen zu lassen.
- Apollo — Begleit-App zum Offline-Testen der Modelle.
- SigLIP 2 NaFlex — Vision-Encoder, der in beiden Modellvarianten genutzt wird.

## Verwandt

- [Lokale KI-Werkzeuge — Hardware, Runtimes, Modell-Auswahl](obsidian://open?vault=knowledge-base&file=lokale-ki-werkzeuge) — deckt lokale Runtimes, Modell-Auswahl und die Lizenz-Pflichtprüfung für Open-Weights-Modelle ab, die hier direkt einschlägig ist.
- [[Kleine LLMs die für lokale Aufgaben in Frage kommen, speziell RAG und normale Textgenerierung]] — Sammlung kleiner, lokal lauffähiger Modelle, dieselbe On-Device-Stoßrichtung wie LFM2VL.
- [[Google Introducing MAD The Internet Will Never Be The Same]] — KI-News-Video, das u. a. kompakte, lokal einsetzbare Modelle behandelt.
