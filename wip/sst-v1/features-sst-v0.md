# SST v0 Feature List

- Improve Text
  - Use a local LLM via Ollama; first model target is `gemma3:latest`.
  - Pass the lower textbox text as context input, because it contains already-correct terms and named entities.
  - Request `response_format=verbose_json` from the Whisper server to keep richer metadata and pre-process before LLM correction.
  - Fix Whisper whitespace artifacts where line breaks can split words (example: `"Ar\nbeiten"`).
  - Fix punctuation, spelling, and grammar.
  - Use context-aware named-entity correction for low-sense words and similar-sounding terms (examples: `"Cloud" -> "Claude"`, `"Boxsack" -> "Voxtral"`, `"Sauber" -> "Server"`).
  - Add a `Debug` button in the web UI that shows a diff between raw Whisper output and corrected text.
  - Replace upload-size output with timing output:
    - transcription duration
    - correction duration
    - total duration
  - Persist all relevant model run data:
    - model input and output
    - model identifier
    - correction duration
    - current git commit hash
  - Keep this data to enable future evaluation of model size/cost/quality trade-offs (evaluation implementation is out of scope for v0).

- Tabbed UI, Synced
  - Support multiple parallel thought streams via tabs.
  - Tabs are auto-named by default and can be renamed by the user.
  - Sync tab titles and both textbox contents across clients.
  - Use local PostgreSQL storage (not localStorage; no Convex due GDPR/work-context constraints).
  - Implement conflict-safe synchronization:
    - field-level conflict detection (title, top textbox, bottom textbox)
    - abort writes on conflicts to prevent silent overwrite
    - show explicit conflict error with source-of-truth details and freshness
    - provide actions per tab: `Use Server Data` and `Write Client to Server`
  - v0 transport: polling-based sync.

- Replay Recorded Audio
  - User can replay the recorded audio with a simple toggle button (`Play` <-> `Stop`).
  - Audio file is local-only (browser session/state) and is not synchronized via server/database in v0.
