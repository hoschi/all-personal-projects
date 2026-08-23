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