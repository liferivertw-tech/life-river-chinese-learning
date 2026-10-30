from fastapi.testclient import TestClient
import app as ocr_app

client=TestClient(ocr_app.app)
class FakeResult:
    json={'res':{'rec_texts':['你好','繁體中文'],'rec_scores':[0.99,0.95]}}
class FakeOCR:
    def predict(self,input): return [FakeResult()]

def test_health_names_pinned_ocr_models():
    body=client.get('/health').json()
    assert body['detector']=='PP-OCRv5_mobile_det'
    assert body['recognizer']=='PP-OCRv5_mobile_rec'

def test_normalize_results_extracts_text_and_scores():
    lines=ocr_app.normalize_results([FakeResult()])
    assert lines==[{'text':'你好','confidence':0.99},{'text':'繁體中文','confidence':0.95}]

def test_ocr_endpoint_returns_recognized_text(monkeypatch,tmp_path):
    from PIL import Image
    image_path=tmp_path/'test.png';Image.new('RGB',(12,12),'white').save(image_path)
    monkeypatch.setattr(ocr_app,'get_ocr',lambda:FakeOCR())
    response=client.post('/api/ocr',files={'file':('test.png',image_path.read_bytes(),'image/png')})
    assert response.status_code==200
    assert response.json()['text']=='你好\\n繁體中文'

def test_rejects_unsupported_image_type():
    response=client.post('/api/ocr',files={'file':('test.gif',b'GIF89a','image/gif')})
    assert response.status_code==415

def test_rejects_empty_image():
    response=client.post('/api/ocr',files={'file':('empty.png',b'','image/png')})
    assert response.status_code==400
