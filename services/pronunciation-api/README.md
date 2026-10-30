# LIFE RIVER Chinese Learning — Pronunciation API

Local development:

```bash
python -m venv .venv
# Windows: .venv\\Scripts\\activate
# macOS/Linux: source .venv/bin/activate
pip install -r services/pronunciation-api/requirements.txt
uvicorn app:app --app-dir services/pronunciation-api --reload --port 8000
```

In another terminal run `npm install && npm run dev`. Vite proxies `/api/*` to the local FastAPI service.

Production deployment must set `CORS_ORIGINS` to the exact public frontend origin(s). Do not use wildcard origins for authenticated deployments. This service currently provides pypinyin-based candidate readings only; it does not claim authoritative Taiwan Mandarin pronunciation. Multi-pronunciation, phrase context and Taiwan Traditional character coverage require dictionary review.

Moedict lookup is performed live from its public JSON endpoint. Dictionary text is shown without rewriting and with source attribution; see https://www.moedict.tw/about.html for CC BY-ND 3.0 Taiwan dictionary-content terms and the separate CC0 API statement. Do not ingest the corpus wholesale or publish adapted dictionary entries without a separate rights review.


Tone feedback prototype: 

- `POST /api/tone-assessment` accepts WAV/AIFF recordings up to 8 MB and target tone 1–4.
- Uses Praat pitch tracking and a simple normalized semitone contour heuristic. This is an experimental visual/practice aid, not a validated pronunciation score or TOCFL assessment.
- Do not use the numeric score for grading, employment, placement or other consequential decisions. Speaker range, recording quality and connected-speech tone sandhi are not yet calibrated.
