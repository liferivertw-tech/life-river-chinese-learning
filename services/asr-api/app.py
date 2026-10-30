from __future__ import annotations
import os
import tempfile
from functools import lru_cache
from pathlib import Path
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from faster_whisper import WhisperModel

app = FastAPI(title="LIFE RIVER Chinese ASR API", version="0.1.0")
origins=[x.strip() for x in os.getenv("CORS_ORIGINS","http://localhost:5173,http://127.0.0.1:5173").split(",") if x.strip()]
app.add_middleware(CORSMiddleware,allow_origins=origins,allow_credentials=False,allow_methods=["GET","POST"],allow_headers=["*"])
MAX_AUDIO_BYTES=20*1024*1024
ALLOWED_SUFFIXES={'.wav','.mp3','.m4a','.mp4','.webm','.ogg','.flac'}
MODEL_ID=os.getenv('ASR_MODEL_ID','Systran/faster-whisper-base')
MODEL_REVISION=os.getenv('ASR_MODEL_REVISION','a80717a3a48b1b28aa687bca146cb7301feae1b1')

@lru_cache(maxsize=1)
def get_model():
    # Resolve a fixed model revision so model updates do not silently change behavior.
    from huggingface_hub import snapshot_download
    local_path=snapshot_download(repo_id=MODEL_ID,revision=MODEL_REVISION)
    return WhisperModel(local_path,device=os.getenv('ASR_DEVICE','cpu'),compute_type=os.getenv('ASR_COMPUTE_TYPE','int8'))

@app.get('/health')
def health():
    return {'status':'ok','service':'life-river-asr-api','model':MODEL_ID,'revision':MODEL_REVISION}

@app.post('/api/transcribe')
async def transcribe_audio(file: UploadFile=File(...), language: str|None=Form(default=None)):
    suffix=Path(file.filename or 'audio.wav').suffix.lower()
    if suffix not in ALLOWED_SUFFIXES:
        raise HTTPException(status_code=415,detail='不支援的音訊格式。')
    payload=await file.read(MAX_AUDIO_BYTES+1)
    if not payload:
        raise HTTPException(status_code=400,detail='音訊檔案是空的。')
    if len(payload)>MAX_AUDIO_BYTES:
        raise HTTPException(status_code=413,detail='音訊檔案不可超過 20 MB。')
    temp_path=None
    try:
        with tempfile.NamedTemporaryFile(suffix=suffix,delete=False) as temp:
            temp.write(payload);temp_path=temp.name
        model=get_model()
        segments,info=model.transcribe(temp_path,language=language or None,beam_size=5,vad_filter=True)
        transcript=''.join(segment.text for segment in segments).strip()
        return {'text':transcript,'language':info.language,'language_probability':round(float(info.language_probability),4),'model':MODEL_ID,'model_revision':MODEL_REVISION,'temporary_audio_deleted':True,'notice':'音訊僅暫存於伺服器暫存檔，請求結束後刪除；辨識結果仍可能有誤，請人工核對。'}
    except HTTPException: raise
    except Exception as exc:
        raise HTTPException(status_code=500,detail='語音辨識失敗，請稍後再試。') from exc
    finally:
        await file.close()
        if temp_path:
            try: os.remove(temp_path)
            except FileNotFoundError: pass
