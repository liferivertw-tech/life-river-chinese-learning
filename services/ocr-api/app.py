from __future__ import annotations
import os, tempfile
from pathlib import Path
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

app=FastAPI(title='LIFE RIVER Chinese OCR API',version='0.1.0')
origins=[x.strip() for x in os.getenv('CORS_ORIGINS','http://localhost:5173,http://127.0.0.1:5173').split(',') if x.strip()]
app.add_middleware(CORSMiddleware,allow_origins=origins,allow_credentials=False,allow_methods=['GET','POST'],allow_headers=['*'])
MAX_IMAGE_BYTES=10*1024*1024
ALLOWED_SUFFIXES={'.jpg','.jpeg','.png','.webp'}

_ocr=None
def get_ocr():
    global _ocr
    if _ocr is None:
        from paddleocr import PaddleOCR
        _ocr=PaddleOCR(text_detection_model_name='PP-OCRv5_mobile_det',text_recognition_model_name='PP-OCRv5_mobile_rec',use_doc_orientation_classify=False,use_doc_unwarping=False,use_textline_orientation=False)
    return _ocr

def normalize_results(results):
    lines=[]
    for result in results or []:
        payload=getattr(result,'json',result)
        if callable(payload): payload=payload()
        if not isinstance(payload,dict): continue
        inner=payload.get('res',payload)
        texts=inner.get('rec_texts',[]) if isinstance(inner,dict) else []
        scores=inner.get('rec_scores',[]) if isinstance(inner,dict) else []
        for index,text in enumerate(texts):
            score=float(scores[index]) if index<len(scores) else None
            lines.append({'text':str(text),'confidence':round(score,4) if score is not None else None})
    return lines

@app.get('/health')
def health(): return {'status':'ok','service':'life-river-ocr-api','engine':'PaddleOCR 3.7.0','detector':'PP-OCRv5_mobile_det','recognizer':'PP-OCRv5_mobile_rec'}

@app.post('/api/ocr')
async def recognize_image(file:UploadFile=File(...)):
    suffix=Path(file.filename or 'image.png').suffix.lower()
    if suffix not in ALLOWED_SUFFIXES: raise HTTPException(status_code=415,detail='目前僅支援 JPG、PNG、WebP 圖片。')
    payload=await file.read(MAX_IMAGE_BYTES+1)
    if not payload: raise HTTPException(status_code=400,detail='圖片檔案是空的。')
    if len(payload)>MAX_IMAGE_BYTES: raise HTTPException(status_code=413,detail='圖片不可超過 10 MB。')
    temp_path=None
    try:
        with tempfile.NamedTemporaryFile(suffix=suffix,delete=False) as temp: temp.write(payload);temp_path=temp.name
        with Image.open(temp_path) as image: image.verify()
        results=get_ocr().predict(input=temp_path)
        lines=normalize_results(results)
        return {'lines':lines,'text':'\n'.join(item['text'] for item in lines),'engine':'PaddleOCR 3.7.0','detector':'PP-OCRv5_mobile_det','recognizer':'PP-OCRv5_mobile_rec','notice':'辨識結果可能有錯，請對照原圖校對。圖片僅暫存處理，請求結束後刪除。'}
    except HTTPException: raise
    except Exception as exc: raise HTTPException(status_code=422,detail='無法辨識圖片，請使用清晰、正向且文字可讀的圖片。') from exc
    finally:
        await file.close()
        if temp_path:
            try: os.remove(temp_path)
            except FileNotFoundError: pass
