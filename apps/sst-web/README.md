# SST Web

Speech-to-text web app with local `whisper.cpp` (`whisper-server`) integration.

## Routes

- `/` marketing page
- `/app` transcription app

## Start whisper-server

Download model:

```bash
mkdir -p models
curl -L -o models/ggml-large-v3-turbo.bin \
  "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-large-v3-turbo.bin"
```

Start server:

```bash
whisper-server \
  -m models/ggml-large-v3-turbo.bin \
  --host 0.0.0.0 \
  --port 9100 \
  -l de \
  -t 4
```

Expected local endpoint:

`http://localhost:9100/inference`

The app sends `multipart/form-data` with `file`, `response_format=json`, `language`, and `temperature=0.0`.
