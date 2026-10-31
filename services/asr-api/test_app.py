from fastapi.testclient import TestClient
import app as asr_app

client=TestClient(asr_app.app)
class FakeSegment:
    def __init__(self,text): self.text=text
class FakeInfo:
    language='zh';language_probability=0.98
class FakeModel:
    def transcribe(self,*args,**kwargs): return iter([FakeSegment('你好，'),FakeSegment('世界。')]),FakeInfo()

def test_health_reports_pinned_model():
    body=client.get('/health').json()
    assert body['model']=='Systran/faster-whisper-base'
    assert len(body['revision'])==40

def test_transcribe_returns_text_and_language(monkeypatch):
    monkeypatch.setattr(asr_app,'get_model',lambda:FakeModel())
    response=client.post('/api/transcribe',files={'file':('sample.wav',b'fake-audio','audio/wav')})
    assert response.status_code==200
    body=response.json()
    assert body['text']=='你好，世界。'
    assert body['language']=='zh'
    assert body['temporary_audio_deleted'] is True

def test_rejects_unsupported_audio_suffix():
    response=client.post('/api/transcribe',files={'file':('sample.exe',b'not-audio','application/octet-stream')})
    assert response.status_code==415

def test_rejects_empty_audio():
    response=client.post('/api/transcribe',files={'file':('sample.wav',b'','audio/wav')})
    assert response.status_code==400

def test_rejects_oversized_audio():
    response=client.post('/api/transcribe',files={'file':('sample.wav',b'x'*(asr_app.MAX_AUDIO_BYTES+1),'audio/wav')})
    assert response.status_code==413
