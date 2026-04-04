# Plan: Migrate SST Web From Voxtral to whisper.cpp (No Extra Server)

## Goal
Replace the current Voxtral/Mistral transcription flow with direct calls to `whisper-server` (whisper.cpp) **without** adding any Python or proxy server.

## Scope
- Only the **no-wrapper** variant (browser → `whisper-server` via multipart/form-data).
- Introduce a **marketing page** and a separate **app page**.
- App page is **directly accessible** (no token gate).
- Keep changes minimal so the diff stays readable.

## Inputs From Existing Markdown
From `current/needs-guidance.md`:
- `whisper-server` runs on `http://127.0.0.1:9100/inference` and expects `multipart/form-data`.
- Required whitespace normalization: replace `\s+` with a single space after transcription.
- Request parameters: `response_format=json`, `language`, `temperature`.

## Current State (Code)
- `apps/sst-web/src/useTranscribeText.ts` uses Mistral SDK and `voxtral-mini-latest`.
- `apps/sst-web/src/useAudioRecorder.ts` returns Base64 WAV data.
- `apps/sst-web/src/App.tsx` gates the app behind a token and uses Voxtral UI copy.

## Migration Steps (Minimal-Change Path)
1. **Transcription API switch (no server):**
   - Replace Mistral SDK usage in `apps/sst-web/src/useTranscribeText.ts` with a `fetch` to `http://localhost:9100/inference`.
   - Build `FormData` with:
     - `file`: WAV data
     - `response_format=json`
     - `language` (default `de`)
     - `temperature=0.0`
   - Parse JSON response and normalize whitespace (`/\s+/g` → single space).
   - Return a `{ text: string }` payload instead of `ChatCompletionResponse`.

2. **WAV payload handling:**
   - Keep `useAudioRecorder.ts` largely as-is.
   - Decide on the smallest change to feed `FormData`:
     - Option A: add the `Blob` to `RecordingInfo` (preferred for performance).
     - Option B: reconstruct a `Blob` from Base64 inside `useTranscribeText.ts`.
   - Choose the minimal diff that avoids re-encoding work.

3. **Remove token gating:**
   - Delete the token gate in `apps/sst-web/src/App.tsx`.
   - Remove API key storage in `localStorage` and the token-related state.

4. **Marketing page + app page:**
   - Reuse the existing `TokenInput` static content as the marketing page component.
   - Remove the API key input UI and Mistral-specific onboarding copy.
   - Add a simple CTA link/button to `/app`.
   - Keep the transcription UI as the app page component.

5. **Routing (minimal):**
   - Implement a lightweight route switch in `apps/sst-web/src/App.tsx` using `window.location.pathname`:
     - `/` → Marketing page
     - `/app` → App page
   - Avoid adding `react-router` to keep the diff small.

6. **Copy updates (minimal wording):**
   - Replace Voxtral/Mistral-specific text with whisper.cpp references where needed.
   - Keep structure intact to minimize the diff.

7. **Docs:**
   - Update `apps/sst-web/README.md` with:
     - `whisper-server` start command
     - `models/ggml-large-v3-turbo.bin` download instructions
     - Expected local endpoint `http://localhost:9100/inference`

## Risks / Checks
- **CORS:** If `whisper-server` does not allow CORS, the browser call will fail. This must be validated. If it fails, the “no-server” constraint cannot be satisfied unless `whisper-server` can be configured to send CORS headers.
- **Text quality:** Voxtral previously did grammar/punctuation corrections. whisper.cpp does not. If this behavior is needed, define a post-processing strategy separately.

## Definition of Done (for the no-wrapper migration)
- App page transcribes via `whisper-server` without any token.
- Marketing page and app page are reachable at `/` and `/app`.
- No Mistral SDK usage remains in `apps/sst-web`.
- README describes local whisper.cpp setup.
- `bun ci` doesn't fail

## Testing Readiness
Once the changes above are implemented, testing should include:
- Start `whisper-server` locally and open `/app`.
- Record audio → verify text output and whitespace normalization.
- Navigate between `/` and `/app` to confirm routing.
