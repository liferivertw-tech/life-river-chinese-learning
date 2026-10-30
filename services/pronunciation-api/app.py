from __future__ import annotations
import os
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pypinyin import Style, pinyin

app = FastAPI(title="LIFE RIVER Chinese Pronunciation API", version="0.1.0")
origins = [x.strip() for x in os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",") if x.strip()]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=False, allow_methods=["GET"], allow_headers=["*"])

class PronunciationResponse(BaseModel):
    text: str
    pinyin: list[str]
    zhuyin: list[str]
    engine: str = "pypinyin"
    needs_human_review: bool = True
    note: str = "拼音與注音為自動推定結果；臺灣繁體、多音字及語境讀音請以教育部辭典或人工核校。"

@app.get("/health")
def health():
    return {"status": "ok", "service": "life-river-pronunciation-api"}

@app.get("/api/pronunciation", response_model=PronunciationResponse)
def get_pronunciation(text: str = Query(..., min_length=1, max_length=100)):
    if not any("\\u3400" <= ch <= "\\u9fff" for ch in text):
        raise HTTPException(status_code=422, detail="請至少輸入一個中文字。")
    try:
        py = [item[0] for item in pinyin(text, style=Style.TONE, heteronym=False, strict=False)]
        zy = [item[0] for item in pinyin(text, style=Style.BOPOMOFO, heteronym=False, strict=False)]
        return PronunciationResponse(text=text, pinyin=py, zhuyin=zy)
    except Exception as exc:
        raise HTTPException(status_code=500, detail="發音資料轉換失敗。") from exc
