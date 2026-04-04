# Prompt: Whisper.cpp Transkriptions-Server mit Base64-Audio-API

## Aufgabe

Erstelle einen Python-Server (FastAPI), der als Wrapper um den `whisper-server` von whisper.cpp fungiert. Der Server nimmt Base64-kodierte WAV-Audiodaten entgegen und gibt den transkribierten Text zurueck.

## Technischer Hintergrund

whisper.cpp bietet einen eingebauten HTTP-Server (`whisper-server`), der ueber `brew install whisper-cpp` installiert wurde. Dieser Server laeuft auf Apple Silicon mit Metal-GPU-Beschleunigung und nutzt das Modell `ggml-large-v3-turbo`. Er liefert in Benchmarks eine normierte Levenshtein-Distanz von 3-20 bei 0.6-1.3s Inferenzzeit und ist die einzige getestete Server-Loesung ohne Repetitions-Bugs.

### whisper-server starten

```bash
whisper-server \
  -m models/ggml-large-v3-turbo.bin \
  --host 0.0.0.0 \
  --port 9100 \
  -l de \
  -t 4
```

Das Modell wird vorher heruntergeladen:

```bash
mkdir -p models
curl -L -o models/ggml-large-v3-turbo.bin \
  "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-large-v3-turbo.bin"
```

### So spricht man den whisper-server an (Referenzimplementierung)

Der `whisper-server` hat einen `/inference`-Endpoint der multipart/form-data erwartet:

```python
import re
import requests

def transcribe_via_whisper_cpp(audio_bytes: bytes, port: int = 9100) -> str:
    url = f"http://127.0.0.1:{port}/inference"
    files = {"file": ("audio.wav", audio_bytes, "audio/wav")}
    data = {"response_format": "json", "language": "de", "temperature": "0.0"}
    r = requests.post(url, files=files, data=data, timeout=300)
    r.raise_for_status()
    text = r.json().get("text", "").strip()
    # whisper.cpp segmentiert die Ausgabe und fuegt Zeilenumbrueche/Leerzeichen
    # an Segment-Grenzen ein. Diese muessen normalisiert werden.
    text = re.sub(r"\s+", " ", text).strip()
    return text
```

**Wichtig: Die Whitespace-Normalisierung (`re.sub(r"\s+", " ", text)`) ist zwingend erforderlich.** whisper.cpp gibt den Text in Segmenten zurueck, die an Grenzen Zeilenumbrueche und ueberfluessige Leerzeichen enthalten. Ohne diese Normalisierung enthaelt die Ausgabe Artefakte wie `"zu\n frieden"` statt `"zufrieden"`.

## Anforderungen an den zu erstellenden Server

### API-Spezifikation

**Endpoint:** `POST /v1/transcribe`

**Request-Body (JSON):**

```json
{
  "audio": "<base64-kodierte WAV-Datei>",
  "language": "de"
}
```

- `audio` (string, required): Base64-kodierte WAV-Audiodaten
- `language` (string, optional, default: `"de"`): Sprachcode fuer die Transkription

**Response-Body (JSON):**

```json
{
  "text": "Der transkribierte Text ohne ueberfluessige Whitespace-Artefakte."
}
```

**Fehler-Response (JSON):**

```json
{
  "error": "Fehlerbeschreibung"
}
```

### Funktionale Anforderungen

1. Der Server nimmt Base64-kodierte WAV-Dateien entgegen, dekodiert sie, und leitet sie an den lokal laufenden `whisper-server` auf Port 9100 weiter
2. Die Antwort vom `whisper-server` wird per Whitespace-Normalisierung bereinigt (`re.sub(r"\s+", " ", text).strip()`)
3. Der bereinigte Text wird als JSON zurueckgegeben
4. Der `language`-Parameter wird an den `whisper-server` weitergeleitet
5. Timeouts und Fehler des `whisper-server` muessen sauber als HTTP-Fehler an den Client zurueckgegeben werden

### Nicht-funktionale Anforderungen

1. **Framework:** FastAPI mit uvicorn
2. **Kein eigenes Modell laden:** Der Server ist ein reiner Proxy/Wrapper. Das Modell laeuft im separaten `whisper-server`-Prozess
3. **Konfigurierbar:** Port des eigenen Servers und Port/Host des `whisper-server` als Umgebungsvariablen oder CLI-Argumente
4. **Health-Endpoint:** `GET /health` der prueft ob der `whisper-server` erreichbar ist
5. **CORS:** Aktiviert fuer lokale Entwicklung

### Beispiel-Client-Aufruf

```python
import base64
import requests

with open("input/test-input.wav", "rb") as f:
    audio_b64 = base64.b64encode(f.read()).decode("ascii")

response = requests.post("http://localhost:8000/v1/transcribe", json={
    "audio": audio_b64,
    "language": "de",
})
print(response.json()["text"])
```
