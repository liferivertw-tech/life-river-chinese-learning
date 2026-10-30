# LIFE RIVER Chinese ASR API

Prototype speech-to-text service based on faster-whisper.

```bash
python -m venv .venv
# activate the environment, then:
pip install -r services/asr-api/requirements.txt
uvicorn app:app --app-dir services/asr-api --reload --port 8001
```

The first transcription downloads the pinned `Systran/faster-whisper-base` model revision (about 148 MB). CPU int8 is the default; set `ASR_DEVICE=cuda` and a compatible compute type only on a properly configured GPU host. The model revision and license are recorded in the technology registry.

The endpoint accepts WAV, MP3, M4A, MP4, WebM, OGG and FLAC files up to 20 MB. It uses a temporary file and deletes it in a `finally` block. Do not log uploaded audio or transcripts in production. Configure `CORS_ORIGINS` to exact trusted origins. This is a prototype; benchmark Taiwanese Mandarin, Taiwanese accents, noise and code-switching before production use.
