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

### — Einführung: LFM2VL als Wendepunkt

Liquid AI just dropped LFM2VL and it feels like a turning point. We're talking about vision language AI that runs directly on phones, laptops, and even wearables. And the crazy part is that it's already hitting up to twice the speed of the strongest models out there, proving that real multimodal AI can finally live on your own device.

### — Liquid AI: Hintergrund und Ansatz

Now, before we dive in, a quick word about Liquid AI. This company comes out of MIT's CSAIL, one of the most respected AI research groups. Instead of just making bigger and bigger transformer models, which is what most of the industry is still doing, they're trying to rethink how AI is built. At its core, their liquid foundation models or LFMs are designed around ideas from mathematics and signal processing. So, the models are lighter, faster, and more flexible. And that's really what this release is all about, efficiency. They keep repeating that efficiency is their product.

### — Die zwei Modellvarianten

And with LFM2VL, you can see what they mean. So, what's actually new here? LFM2VL is a set of vision language models built for low latency — in plain words, that means they're very fast to respond. And they're device-aware, meaning they're designed to run on smaller everyday devices. There are two versions of LFM2VL. The smaller one, LFM2VL 450 million parameters, that's meant for extremely resource limited devices where every bit of memory matters. The larger one, LFM2VL 1.6B, has 1.6 billion parameters, which makes it more capable, but still compact enough to run on a single GPU or a high-end mobile device. Normally, models that powerful require big server setups. So, this is a big step forward. What makes this release exciting is how much faster these models are compared to others in the same category. Liquid AI says they deliver up to two times faster inference speed on GPUs compared to other vision language models. In practice, we're talking about cutting processing time in half. Something that can make the difference between a laggy demo and an assistant that actually feels responsive.

### — Architektur: Backbone, Vision-Encoder und Multimodal-Projector

Now let's talk about how these models are built because this is where Liquid AI really took a different approach. LFM2VL has three main parts. The language model backbone, the vision encoder, and a multimodal projector that brings the two together. The backbone is basically the brain that handles text. For the larger 1.6 billion model, it's built on top of LFM2 1.2B. And for the smaller 450 million model, it uses LFM2 350M. Then there's the vision encoder which handles images. For that, they're using SigLIP 2 NaFlex encoders. The bigger version uses one with about 400 million parameters for more detailed image understanding, while the smaller version uses an 86 million parameter encoder that's faster but lighter.

Here's one of the clever parts. The models process images at their native resolution up to 512×512 pixels. So essentially they don't distort or blur the image by scaling it up or down unnecessarily. If the image is bigger than that, it gets split into squares of 512×512. So the model processes every part of the picture without losing detail. And the 1.6 billion model has an extra trick. It also processes a small thumbnail of the whole picture. So it gets both the fine details from the patches and the overall view of what's happening in the image.

Then comes the multimodal projector. This is what actually combines the text side and the vision side. It uses a technique called pixel unshuffle, which basically reduces the number of image tokens, meaning the model doesn't have to waste time on unnecessary details. For example, if you feed it an image that's 256×384 pixels, that produces about 96 tokens. A 384×680 image makes about 240 tokens. And a very large image like 1,000×3,000 pixels creates around 1,020 tokens. The whole point here is balancing detail and efficiency. And this design makes the model much faster while keeping the quality high.

### — Flexibilität und Training

Another big plus is flexibility. Users can adjust settings when running the model. You can tell it how many tokens to use or how many patches to process depending on whether you want maximum speed or maximum accuracy. So, if you're running this on a tiny device, you can set it to prioritize speed. If you're on a more powerful machine, you can allow more detail. This ability to adapt on the fly is one of the biggest advantages of the LFM2VL family.

The training process also shows how much thought went into this. They started by pre-training the backbone model. Then came a mid-training stage where they combined vision and language gradually, shifting the ratio of text to image data. At the start it was about 95% text but by the end it was 30%, giving the models a balanced understanding of both. Finally they fine-tuned the models for image understanding. Altogether training involved about 100 billion multimodal tokens using both open-source datasets and their own synthetic vision data.

### — Benchmarks und Inferenzgeschwindigkeit

Now, let's talk about performance because benchmarks are always where the hype either proves itself or falls apart. On real world QA, the 1.6 billion model scored 65.23, which is right up there with InternVL3. On InfoVQA, it hit 58.68 and on OCR Bench, it scored 742. The smaller model also did well, pulling 52.29 on real-world QA and 655 on OCR Bench. And when it comes to inference speed — how fast the models actually run — they're leading the pack. In a standard test using a 1,024×1,024 image with a short prompt, generating 100 tokens, these models were up to two times faster than other comparable systems. That speed isn't just about bragging rights on a chart. It really matters for actual use cases. If you're building something like a smart camera, a phone assistant, or a small robot, every second counts. Waiting for a model to process an image for three or four seconds might make it unusable in real life, but cutting that down to one or two seconds changes the game completely.

### — Integration, Leap-Plattform und Apollo

On top of performance, there's also how easy these models are to use. Liquid AI made sure LFM2VL integrates smoothly with Hugging Face Transformers. They've shared example code for llama.cpp and they support quantization which lets you run the models with even less memory by using smaller data types. And if you want to customize things further, they've tied everything into their Leap platform which they launched in July. Leap is a software kit that makes it easy to run small AI models on mobile devices and it works across iOS, Android, and other systems. They even have a companion app called Apollo where developers can test everything offline. That last part about offline use really shows where Liquid AI wants to go. They want to reduce dependency on the cloud. Instead of sending data back and forth to giant servers, they want your device to be able to run smart AI tasks locally. That's better for privacy. It cuts down costs and it makes everything faster.

### — Lizenzmodell

And yeah, licensing. The models are released as open weights under what they call the LFM 1.0 license. It's based on Apache 2.0, but with some conditions. If you're a smaller company making under $10 million in revenue, you can use the models for both research and commercial projects. If you're a bigger company, you'll need to contact Liquid AI for a commercial license. So, it's open, but with limits to make sure giant corporations can't just scoop it up for free.

### — Anwendungsfälle und Fazit

And finally, the use cases. Liquid AI highlights things like real-time image captioning, multimodal chatbots, visual search, robotics, IoT systems, and smart cameras. But the bigger picture here is about shifting AI away from being something that only runs in huge cloud servers. They're showing that with the right architecture, you can get high accuracy and real-time performance directly on devices people already own. That's where the industry is heading because people want AI that's private, fast, and doesn't cost a fortune to run. All right, that's everything on LFM2VL. Let me know what you think in the comments. Subscribe if you haven't already. Hit the like button if this was useful. Thanks for watching and I'll catch you in the next one.

---

# Fassung A

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

---

# Fassung B

## Worum es geht

Liquid AI hat mit LFM2VL eine Familie von Vision-Language-Modellen veröffentlicht, die direkt auf Geräten wie Smartphones, Laptops und Wearables laufen sollen. Das Video erklärt Architektur, Benchmarks, Lizenz und Anwendungsfälle dieses Ansatzes für effiziente, lokale multimodale KI.

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
