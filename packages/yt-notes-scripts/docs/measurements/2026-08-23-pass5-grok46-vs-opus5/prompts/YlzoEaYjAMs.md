Du bekommst ein audited_md eines YouTube-Videos (Werbung schon ausgeschnitten).

Vault-Kontext: Die Zusammenfassung wird in eine Markdown-Datei geschrieben, die
im Obsidian-Vault `test` (Shared-Vault) liegt — Pfad
`shared/youtube/<channel>/<title>.md`. Wikilinks `[[…]]` lösen NUR innerhalb
dieses Vaults auf. Treffer aus dem KB-Vault (`knowledge-base`) brauchen
deshalb `obsidian://`-URIs — siehe Wikilink-Verfahren unten.

Aufgabe: Schreibe eine deutsche Zusammenfassung als Markdown, strukturiert in
folgende Sektionen. Setze Wikilinks zu KB-Artikeln im Vault aktiv, wo
entsprechende Sektionen das vorsehen.

## Worum es geht

Ein bis zwei Sätze: Was ist Thema und Kontext.

## Besprochene Konzepte

Bullet-Liste der inhaltlichen Konzepte / Theorien / Ansätze.
Pro Bullet: "<Konzept> — <ein Halbsatz Beschreibung>".
Wenn der Konzept-Begriff einen passenden Vault-Artikel hat (OHS-Lookup
geprüft, siehe Wikilink-Verfahren unten): "[[<artikel-name>]] — …".

## Behauptungen

Bullet-Liste konkreter Aussagen des Sprechers — Fakten, Empfehlungen,
Wertungen über Tools/Produkte/Vorgehen.
Pro Bullet: "<knappe Behauptung>" (optional: `(<timestamp>)` am Ende).
KEINE Wikilinks in dieser Sektion — die landen in `## Verwandt` unten.

Timestamp-Format STRIKT (nur wenn du einen aus dem audited_md übernimmst):
M:SS, MM:SS, H:MM:SS oder HH:MM:SS — IN runden Klammern, KEINE
selbstgebauten Markdown-Links. Die Timestamps werden in einem
deterministischen Post-Process zu YouTube-Marker-Links umgeschrieben.

Behauptung vs Spekulation:
- **DEINE** Spekulation ist verboten:
    - "Vermutlich meint der Sprecher …" — keine eigene Interpretation
    - "Daraus folgt …" — keine eigenen Schlüsse
    - "Das könnte zu Z führen" — keine Vorausschau
- **Sprecher-Spekulation** ist OK: wenn der Sprecher selbst vermutet
  ("ich glaube X wird Y überholen"), übernimm es mit Marker
  "Laut Sprecher …" oder "Der Sprecher vermutet …".
- Faustregel: bei Unsicherheit ob du eine Behauptung wörtlich ins Original
  zurückführen kannst, weglassen.

## Demos / Schritte

Falls etwas vorgeführt wird: nummerierte Liste, jeder Schritt knapp.
Wenn nichts vorgeführt wird, Sektion weglassen.

## Genannte Tools

Bullet-Liste der explizit genannten externen Tools / Frameworks / Produkte.
Pro Bullet: "[[<vault-artikel-name>]] — <Halbsatz Funktion>" wenn Match,
sonst Klartext-Name.
Wenn keine Tools im Video: Sektion weglassen.

## Verwandt

Bullet-Liste von Vault-Artikeln, die zum Video-Thema verwandt sind —
auch wenn nicht explizit im Video genannt. Quelle: OHS-Lookup mit
Video-Thema/Konzept-Phrasen.
Pro Bullet: "[[<artikel-name>]] — <Halbsatz, was die Verbindung ist>".
Keine Duplikate zu den schon in Konzepte/Tools verlinkten Artikeln.
Wenn nichts verwandt: Sektion weglassen.

---

Wikilink-Verfahren (für Konzepte, Tools, Verwandt — Pflicht):
1. Bash-Aufruf (mit explizitem Node-Interpreter — claude-CLI Sub-Agent erbt
   einen PATH, in dem ein Node v26 vor Node v22 steht, was den OHS-internen
   `better-sqlite3` mit NODE_MODULE_VERSION-Mismatch kaputtmacht):
   OHS_NODE_BIN=$HOME/.asdf/shims/node /Users/hoschi/repos/kims/scripts/ohs-search-merged.sh --vault-type arbeit --no-yt --limit 3 --json '<query>'
2. Score-Lese: nur Hits mit `score_native >= 0.8` betrachten (NICHT score_rrf —
   der ist Rank-basiert und liegt im Bereich ~0.01-0.02, also nie >= 0.8).
3. Title-Match-Prüfung gegen Video-Kontext:
   - Bei Mehrdeutigkeit (z.B. "Claude" → "Claude Code" vs "Claude API"):
     Kontext-Snippet aus diesem Video entscheidet
4. **Link-Format strikt nach `source_index` des Hits** (siehe JSON-Antwort):
   - `source_index: "shared"` → `[[<exakter-hit-title>]]` (Wikilink, gleicher Vault)
   - `source_index: "kb"` → `[<exakter-hit-title>](obsidian://open?vault=knowledge-base&file=<URL-encoded-file_path-OHNE-.md>)`
     **`.md`-Suffix wird abgeschnitten** (Obsidian-URI erwartet den File-Namen
     ohne Extension — sonst öffnet der Klick eine neue Stub-Datei statt der
     Ziel-Datei). URL-Encoding: Leerzeichen → `%20`, Slashes `/` → `%2F`,
     Sonderzeichen (Umlaute, Bindestrich-em-dash, Apostrophe) entsprechend RFC 3986.
     Beispiel: file_path `claude-code-mcp-setup.md` → `file=claude-code-mcp-setup`.
     Beispiel mit Sonderzeichen: `yt-pipeline — decisions.md` → `file=yt-pipeline%20%E2%80%94%20decisions`.
5. Kein Match / Score zu niedrig: Klartext lassen,
   KEINEN spekulativen Wikilink.
6. NIEMALS `[[…]]` für einen Hit mit `source_index: "kb"` — das wäre ein
   toter Cross-Vault-Link.
7. NIEMALS ein Markdown-Link mit relativem Vault-Pfad für eine Vault-Notiz —
   weder `[text](shared/…/datei.md)` noch `[text](knowledge-base/…/datei.md)`.
   Solche Pfade lösen in Obsidian NICHT auf. Es gibt nur zwei erlaubte Formen:
   Same-Vault → `[[…]]` (Punkt 4, source_index shared),
   KB-Vault → `[…](obsidian://…)` (Punkt 4, source_index kb).

Globale Regeln:
- NUR was der Sprecher tatsächlich sagt
- Sprache: deutsch
- Keine harten Längen-Limits
- Links (Wikilinks [[…]] und [text](obsidian://…)) NIEMALS in Backticks
  einschließen — Backticks rendern den Link als Inline-Code statt als
  klickbaren Link. Die Backtick-Beispiele oben dienen nur der Darstellung.
- Gib AUSSCHLIESSLICH den Markdown-Body aus (beginnend mit "## Worum es
  geht"). Keine Vorrede, kein Denken, keine Meta-Kommentare wie "Ich schreibe
  jetzt die Zusammenfassung", keine zusätzlichen Überschriften außer den oben
  definierten Sektionen.

Input audited_md:
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