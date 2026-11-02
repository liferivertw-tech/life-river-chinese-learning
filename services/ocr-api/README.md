# LIFE RIVER Chinese OCR API

Prototype image-to-text service using PaddleOCR 3.7.0 with explicitly selected PP-OCRv5 mobile detection and recognition models. Both selected Hugging Face model cards declare Apache-2.0. The package code is also Apache-2.0; retain license notices.

Install a compatible PaddlePaddle CPU or GPU wheel first using the official platform selector: https://www.paddlepaddle.org.cn/install/quick . Then:

```bash
pip install -r services/ocr-api/requirements-ocr.txt
uvicorn app:app --app-dir services/ocr-api --reload --port 8003
```

The first OCR request downloads model assets. The API accepts JPG, PNG and WebP images up to 10 MB, validates the image with Pillow, runs OCR, and deletes the temporary image in a `finally` block. Configure `CORS_ORIGINS` to exact trusted frontend origins.

The selected PP-OCRv5 mobile models support Simplified Chinese, Traditional Chinese, English and Japanese. This prototype has not yet been benchmarked against Taiwanese handwriting, low-light phone photos, vertical text or uncommon characters. OCR confidence is not a guarantee; always verify against the original image.
