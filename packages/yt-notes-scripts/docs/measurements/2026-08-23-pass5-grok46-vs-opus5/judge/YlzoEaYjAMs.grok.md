## Nicht gedeckte Aussagen
### Fassung A
- **Besprochene Konzepte:** „gebaut für Alltagsgeräte statt Server-Racks.“ Das Transkript sagt „smaller everyday devices“ und stellt das 1.6B-Modell gegen „big server setups“ bzw. später „huge cloud servers“ (`j-YlzoEaYjAMs.md:104`, `:134`). „Server-Racks“ kommt nicht vor; das 1.6B-Modell soll auf „a single GPU or a high-end mobile device“ laufen, also nicht pauschal anstelle von Servern.
- **Behauptungen:** „Drei bis vier Sekunden Bildverarbeitung machten Smart Camera, Phone-Assistent oder kleinen Roboter unbrauchbar.“ Das Transkript hat „might make it unusable in real life“ (`j-YlzoEaYjAMs.md:122`). Aus einer Möglichkeit wird eine Feststellung.
### Fassung B
- **Besprochene Konzepte:** „On-Device-/Edge-KI.“ „On-Device“ und lokale Ausführung sind gedeckt (`j-YlzoEaYjAMs.md:96`, `:126`, `:134`); der Name „Edge“ steht nicht im Transkript.
- **Behauptungen:** „Das Training begann mit ca. 95% Text und endete bei 30%.“ 95 % → 30 % gehört zur Mid-Training-Phase nach dem Backbone-Pretraining (`j-YlzoEaYjAMs.md:118`). Außerdem fehlt „30 % Text“; „endete bei 30%“ hängt in der Luft.
Zaehlung: A=2 B=2
## Eigene Spekulation
### Fassung A
- Keine Fundstellen.
### Fassung B
- **Besprochene Konzepte:** „Vision-Language-Modelle (VLM) — KI-Modelle, die Bild und Text gemeinsam verarbeiten.“ Der Sprecher nennt VLMs und beschreibt Backbone, Encoder und Projector; diese Definition und das Kürzel VLM zieht er nicht selbst (`j-YlzoEaYjAMs.md:96`, `:108`).
Zaehlung: A=0 B=1
## Fehlende wichtige Inhalte
### Fassung A
- Apollo-Nutzer sind Entwickler, die offline testen. A: nur „Die Companion-App Apollo erlaubt Offline-Tests.“ Transkript: „a companion app called Apollo where developers can test everything offline“ (`j-YlzoEaYjAMs.md:126`).
- Rolle des Multimodal-Projectors: er verbindet Text- und Bildseite. A nennt ihn nur als Ort von Pixel Unshuffle / Token-Reduktion. Transkript: „This is what actually combines the text side and the vision side“ (`j-YlzoEaYjAMs.md:112`).
- Laufzeit-Beispiel: auf einem winzigen Gerät Tempo priorisieren, auf einer stärkeren Maschine mehr Detail; das sei einer der größten Vorteile. Transkript `j-YlzoEaYjAMs.md:116`. A hat nur den abstrakten Token-/Patch-Tradeoff.
### Fassung B
- Modelle dieser Leistungsklasse bräuchten sonst große Server-Setups; genau deshalb sei eine einzelne GPU bzw. High-End-Mobilgerät ein großer Schritt. Transkript `j-YlzoEaYjAMs.md:104`.
- Konkrete Latenz: drei bis vier Sekunden Bildverarbeitung vs. eine bis zwei Sekunden als Schwelle zur Nutzbarkeit (Smart Camera, Phone-Assistent, kleiner Roboter). B: nur dass Geschwindigkeit „entscheidend“ sei. Transkript `j-YlzoEaYjAMs.md:122`.
- Quantisierung bedeutet kleinere Datentypen und weniger Speicher. B: nur „Quantisierung wird unterstützt.“ Transkript `j-YlzoEaYjAMs.md:126`.
- Native Resolution bis 512×512, ohne unnötiges Skalieren, damit das Bild nicht verzerrt oder unscharf wird. B: nur „nativ verarbeitet“. Transkript `j-YlzoEaYjAMs.md:110`.
- Projector verbindet Text- und Bildseite — wie bei A, in B ebenfalls nicht gesagt (`j-YlzoEaYjAMs.md:112`).
- Laufzeit-Beispiel winziges Gerät vs. stärkere Maschine — wie bei A (`j-YlzoEaYjAMs.md:116`).
- Fine-Tuning ausdrücklich für Bildverständnis. B-Konzepte: nur „dann Fine-Tuning.“ Transkript: „Finally they fine-tuned the models for image understanding“ (`j-YlzoEaYjAMs.md:118`).
Zaehlung: A=3 B=7
## Praezision
- **2×-GPU-Inferenz:** A: „Laut Liquid AI ist die GPU-Inferenz bis zu zweimal schneller als bei anderen Vision-Language-Modellen.“ B: „Die Modelle erreichen bis zu doppelt so hohe Inferenzgeschwindigkeit auf GPUs wie vergleichbare Vision-Language-Modelle.“ A übernimmt die Quellenangabe aus `j-YlzoEaYjAMs.md:104`; B macht daraus eine Sprecher-Tatsache (die Intro-Zeile `:96` sagt es ungesichert, die präzisere Stelle nicht).
- **Trainingsratio:** A: „Mid-Training mit verschobenem Text-/Bild-Anteil (von etwa 95 % Text auf 30 %).“ B: „Das Training begann mit ca. 95% Text und endete bei 30%.“ A sitzt auf der Mid-Training-Stufe (`:118`); B verschiebt den Beginn.
- **Latenzzahlen:** A: „Drei bis vier Sekunden … unbrauchbar; eine bis zwei Sekunden änderten das.“ B: „Geschwindigkeit ist für reale Anwendungen wie Smart-Kameras, Telefon-Assistenten oder kleine Roboter entscheidend.“ A übernimmt die Zahlen aus `:122` (siehe Modalitätsfehler oben); B streicht sie.
- **Quantisierung:** A: „kleinere Datentypen, damit die Modelle mit weniger Speicher laufen.“ B: „Quantisierung wird unterstützt.“ A näher an `:126`.
- **Umsatzgrenze:** A: „Unter 10 Millionen USD Umsatz.“ B: „Firmen mit unter 10 Millionen Umsatz.“ A behält die Währung aus `$10 million` (`:130`).
- **Transformer-Gegensatz:** A: „statt immer größerer Transformer.“ B: „statt reiner Transformer-Skalierung.“ A näher an „bigger and bigger transformer models“ (`:100`).
- **Effizienz:** A: „Effizienz sei das Produkt.“ B: „Effizienz als Produktphilosophie.“ A wörtlicher zu „efficiency is their product“ (`:100`).
- **86M-Encoder:** A: „rund 400 Millionen …, 86 Millionen in der kleinen.“ B: „ca. 400M bzw. 86M Parameter.“ Das Transkript approximiert nur die 400M, nicht die 86M (`:108`).
- **Native Resolution:** A: „Bilder bis 512×512 ohne unnötiges Skalieren.“ B: „Bilder werden bis 512×512 nativ verarbeitet.“ A trägt den Grund aus `:110`.
- **GPU-Zahl:** B: „einer einzelnen GPU.“ A: „eine GPU.“ B näher an „a single GPU“ (`:104`).
- **CSAIL:** B: „einer der angesehensten KI-Forschungsgruppen.“ A: nur „Liquid AI stammt aus MIT CSAIL.“ B näher an `:100`.
- **Hugging Face:** B: „integriert sich nahtlos.“ A: „integriert sich in Hugging Face Transformers.“ B näher an „integrates smoothly“ (`:126`).
- **Apollo:** B: „erlaubt Entwicklern, alles offline zu testen.“ A: „erlaubt Offline-Tests.“ B vollständiger zu `:126`.
## Regelverstoesse
### Fassung A
- Keine. Reihenfolge Worum → Konzepte → Behauptungen → Tools → Verwandt stimmt. „Demos / Schritte“ entfällt zu Recht: das Transkript führt nichts vor, es ist durchgängig Erzählung. Worum hat zwei Sätze. Sprache deutsch, Produktnamen original.
### Fassung B
- Keine. Dieselbe Sektionsfolge, Demos ebenfalls zu Recht weggelassen, Worum zwei Sätze, Sprache deutsch.
## Urteil
- Treue: A besser — beide haben zwei ungedeckte Stellen, aber B verdreht den Trainingsbeginn; A verstärkt vor allem Modalität und ein Bild.
- Vollstaendigkeit: A besser — B lässt Server-Kontrast, 3–4-vs-1–2-Sekunden und die Quantisierungsbedeutung weg; A fehlt vor allem Apollo-Entwickler plus zwei gemeinsam fehlende Architektur-/Flexibilitätsdetails.
- Praezision: A besser — bei den lasttragenden Übernahmen (2×-Quelle, Mid-Training, Latenzzahlen, USD, 86M, Native Resolution) sitzt A enger am Transkript; B gewinnt nur Nebenstellen (einzelne GPU, CSAIL-Ansehen, nahtlos, Apollo-Entwickler).
- Regeltreue: gleichwertig — beide halten Sektionsvorgaben, Sprachregel und den Demos-Vorbehalt ein.
