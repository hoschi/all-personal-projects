## Nicht gedeckte Aussagen

### Fassung A

- Keine gesicherte Fundstelle. Alle Zahlen (450M, 1.6B, LFM2 1.2B, LFM2 350M, 400M/86M SigLIP-2-NaFlex, 512x512, 96/240/1020 Tokens, 95%/30%, 100 Mrd. Tokens, 65.23 / 58.68 / 742 / 52.29 / 655, 1024x1024, 100 Tokens, Juli, 10 Mio.) stehen so im Transkript.
- Grenzfall (1): "## Besprochene Konzepte" fuehrt den Punkt "[[2025-08 MLX vs GGUF Quantisierung]] — kleinere Datentypen, damit die Modelle mit weniger Speicher laufen." Die Beschreibung ist gedeckt ("they support quantization which lets you run the models with even less memory by using smaller data types"), der als Konzeptname stehende Artikeltitel bringt aber die Begriffe MLX und GGUF in die Liste, die im Transkript nicht vorkommen. Als reine Linkform gewertet faellt der Punkt aus der Wertung; als Konzeptbezeichnung gewertet ist er ein nicht gedeckter Begriff.

Zaehlung: A=0 gesichert (1 Grenzfall)

### Fassung B

- "## Behauptungen": "Die Modelle erreichen bis zu doppelt so hohe Inferenzgeschwindigkeit auf GPUs wie vergleichbare Vision-Language-Modelle." Das Transkript stellt das nicht fest, sondern schreibt es dem Hersteller zu: "Liquid AI says they deliver up to two times faster inference speed on GPUs compared to other vision language models." Die Herstelleraussage wird zur Tatsachenaussage verdreht.
- Grenzfall (1): "## Besprochene Konzepte": "Vision-Language-Modelle (VLM) — KI-Modelle, die Bild und Text gemeinsam verarbeiten." Diese Definition sagt der Sprecher nirgends; sie stammt aus dem Allgemeinwissen des Modells. Inhaltlich harmlos, aber nicht ins Original zurueckfuehrbar.
- Grenzfall (2): "## Besprochene Konzepte": "On-Device-/Edge-KI". Der Begriff "Edge" faellt im Transkript nicht; der Sprecher sagt "on phones, laptops, and even wearables" und "device-aware". Sachlich deckungsgleich, terminologisch hinzugefuegt.

Zaehlung: A=0 B=1 (Grenzfaelle: A=1, B=2)

## Eigene Spekulation

### Fassung A

- Keine Fundstelle. Die einzige Zukunftsaussage ist ausdruecklich zugeschrieben: "Laut Sprecher steuert die Branche auf KI, die privat, schnell und guenstig auf vorhandenen Geraeten laeuft." Deckung: "That's where the industry is heading because people want AI that's private, fast, and doesn't cost a fortune to run."

### Fassung B

- Keine Fundstelle eigener Spekulation. Die Aussage "LFM2VL fuehlt sich wie ein Wendepunkt fuer multimodale KI auf eigenen Geraeten an" stammt vom Sprecher ("Liquid AI just dropped LFM2VL and it feels like a turning point"), ist also keine Deutung des Modells — sie ist nur unmarkiert uebernommen und daher unter "Regelverstoesse" gefuehrt. Ebenso die Schlussaussage, die B korrekt mit "Laut Sprecher" markiert.

Zaehlung: A=0 B=0

## Fehlende wichtige Inhalte

### Fassung A

- Die Architektur als Dreiteilung fehlt als Aussage, und mit ihr die Funktion des Multimodal-Projectors. Transkript: "LFM2VL has three main parts. The language model backbone, the vision encoder, and a multimodal projector that brings the two together." und "Then comes the multimodal projector. This is what actually combines the text side and the vision side." A nennt den Projector nur als Ort des Pixel Unshuffle ("Multimodal-Projector reduziert Image-Tokens"), sagt also nie, dass er Text- und Bildseite zusammenfuehrt. B hat den Punkt ("Dreiteilige Architektur — Sprachmodell-Backbone, Vision-Encoder und Multimodal-Projector").
- Die Einordnung des Sprechers zum Release fehlt: "Liquid AI just dropped LFM2VL and it feels like a turning point." Das ist die Ausgangsthese des Videos; mit "laut Sprecher" waere sie uebernehmbar gewesen. B hat sie (unmarkiert).

Zaehlung Fassung A: 2

### Fassung B

- Der Kontrast, der die 1.6B-Aussage traegt, fehlt: "Normally, models that powerful require big server setups. So, this is a big step forward." A hat ihn ("Modelle dieser Leistungsklasse braeuchten sonst grosse Server-Setups").
- Das konkrete Latenz-Beispiel fehlt: "Waiting for a model to process an image for three or four seconds might make it unusable in real life, but cutting that down to one or two seconds changes the game completely." B verkuerzt auf "Geschwindigkeit ist fuer reale Anwendungen ... entscheidend". A nennt beide Zeitspannen.
- Was Quantisierung hier leistet, fehlt: "they support quantization which lets you run the models with even less memory by using smaller data types." B schreibt nur "Quantisierung wird unterstuetzt". A nennt die kleineren Datentypen und den geringeren Speicherbedarf.
- Welche Stellschrauben zur Laufzeit verstellbar sind, fehlt: "You can tell it how many tokens to use or how many patches to process." B bleibt bei "zur Laufzeit einstellbar zwischen maximaler Geschwindigkeit und maximaler Genauigkeit". A nennt Token- und Patch-Zahl.
- Klein: die Begruendung der nativen Aufloesung fehlt — "they don't distort or blur the image by scaling it up or down unnecessarily". A hat "ohne unnoetiges Skalieren", B nur "nativ verarbeitet".

Zaehlung Fassung B: 4 (+1 klein)

### Beiden Fassungen fehlt

- Die Absicht hinter der Lizenzgrenze: "So, it's open, but with limits to make sure giant corporations can't just scoop it up for free." Beide nennen die 10-Millionen-Schwelle, keine nennt den vom Sprecher genannten Zweck.

## Praezision

- Zuschreibung der Tempo-Behauptung. A: "Laut Liquid AI ist die GPU-Inferenz bis zu zweimal schneller als bei anderen Vision-Language-Modellen; die Verarbeitungszeit koenne sich halbieren." B: "Die Modelle erreichen bis zu doppelt so hohe Inferenzgeschwindigkeit auf GPUs wie vergleichbare Vision-Language-Modelle." Transkript: "Liquid AI says they deliver ...". A korrekt, B verliert den Sprecher der Behauptung.
- Waehrung bei der Lizenzgrenze. A: "Unter 10 Millionen USD Umsatz". B: "Firmen mit unter 10 Millionen Umsatz". Transkript: "under $10 million in revenue". A praeziser.
- Laufzeit-Stellschrauben. A: "Laufzeit-Tradeoff Tokens/Patches — Nutzer stellen Token- und Patch-Zahl zwischen Tempo und Genauigkeit ein." B: "Adaptive Inferenz — zur Laufzeit einstellbar zwischen maximaler Geschwindigkeit und maximaler Genauigkeit." A nennt, was eingestellt wird.
- Quantisierung. A: "kleinere Datentypen, damit die Modelle mit weniger Speicher laufen." B: "Quantisierung wird unterstuetzt." A praeziser.
- Latenz-Beispiel. A: "Drei bis vier Sekunden Bildverarbeitung machten Smart Camera, Phone-Assistent oder kleinen Roboter unbrauchbar; eine bis zwei Sekunden aenderten das." B: "Geschwindigkeit ist fuer reale Anwendungen wie Smart-Kameras, Telefon-Assistenten oder kleine Roboter entscheidend." A traegt die Zahlen, gibt aber den Vorbehalt des Sprechers ("might make it unusable") nur ueber den Konjunktiv wieder.
- Architektur. B: "Dreiteilige Architektur — Sprachmodell-Backbone, Vision-Encoder und Multimodal-Projector." A hat keine entsprechende Aussage. B praeziser.
- Benennung von llama.cpp in "## Genannte Tools". B: "llama.cpp — Laufzeitumgebung, fuer die Beispielcode bereitgestellt wird." A: "[lokale-ki-werkzeuge](...) — lokale Runtime; Liquid AI liefert Beispielcode fuer llama.cpp." Das im Transkript genannte Werkzeug steht bei B im Eintragskopf, bei A erst im Nachsatz. B praeziser (Bewertung des Eintragsnamens, nicht der Linkform).
- Vision-Encoder-Groessen. A: "rund 400 Millionen Parameter in der grossen Variante, 86 Millionen in der kleinen." B: "(ca. 400M bzw. 86M Parameter)". Gleichwertig, beide gedeckt.
- Benchmark-Einordnung. A: "Real-World-QA 65.23 (auf Augenhoehe mit InternVL3)". B: "65,23 auf Real-World-QA (vergleichbar mit InternVL3)". Gleichwertig; Transkript: "right up there with InternVL3".

## Regelverstoesse

### Fassung A

- Sektionen und Reihenfolge korrekt: "## Worum es geht", "## Besprochene Konzepte", "## Behauptungen", "## Genannte Tools", "## Verwandt". "## Demos / Schritte" fehlt zu Recht — im Transkript wird nichts vorgefuehrt. Keine Vorrede, keine fremde Ueberschrift, Sprache durchgehend deutsch, Fachbegriffe im Original.
- Grenzfall: In "## Besprochene Konzepte" und "## Genannte Tools" steht je einmal ein Vault-Artikeltitel als Eintragsname ("2025-08 MLX vs GGUF Quantisierung", "lokale-ki-werkzeuge") statt des im Video genannten Begriffs (Quantisierung, llama.cpp). Beruehrt die Linkregel, die ausdruecklich nicht Gegenstand ist; als Eintragsbenennung gelesen weicht die Liste vom Vokabular des Videos ab.

### Fassung B

- "## Behauptungen": "LFM2VL fuehlt sich wie ein Wendepunkt fuer multimodale KI auf eigenen Geraeten an." Das ist die Einschaetzung des Sprechers ("it feels like a turning point") und haette nach der Regel mit "laut Sprecher" markiert werden muessen. Unmarkiert liest es sich als Feststellung der Zusammenfassung.
- "## Behauptungen": "Die Modelle erreichen bis zu doppelt so hohe Inferenzgeschwindigkeit auf GPUs ..." — dieselbe fehlende Zuschreibung, hier gegenueber dem Hersteller ("Liquid AI says").
- Grenzfall: "## Besprochene Konzepte" enthaelt mit der VLM-Definition und dem Begriff "Edge-KI" zwei Formulierungen, die nicht woertlich ins Transkript zurueckfuehrbar sind.
- Sektionen und Reihenfolge sonst korrekt, "## Demos / Schritte" zu Recht nicht vorhanden, Sprache deutsch, Fachbegriffe im Original.

## Urteil

- Treue: A besser — A hat keine gesicherte ungedeckte Aussage und schreibt Hersteller- wie Sprecheraussagen konsequent zu, waehrend B eine Herstellerbehauptung als Tatsache setzt und die Wendepunkt-Einschaetzung des Sprechers unmarkiert uebernimmt.
- Vollstaendigkeit: A besser — B fehlen vier benannte Punkte (Server-Setup-Kontrast, 3-4 s gegen 1-2 s, Wirkung der Quantisierung, Token-/Patch-Stellschrauben), A fehlen zwei (Dreiteilung der Architektur samt Projector-Funktion, Wendepunkt-Einschaetzung).
- Praezision: A besser — A gewinnt bei Zuschreibung, Waehrung, Stellschrauben, Quantisierung und Latenzzahlen, B nur bei der Architektur-Dreiteilung und der Benennung von llama.cpp im Tool-Eintrag.
- Regeltreue: A besser, knapp — beide halten Sektionsvorgabe und Sprache ein; B verletzt zweimal die Markierungspflicht fuer nicht selbst gepruefte Aussagen, A's einziger Punkt liegt in der Eintragsbenennung ueber Vault-Titel und beruehrt die ausgenommene Linkregel.
