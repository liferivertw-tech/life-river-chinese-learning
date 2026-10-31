from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

def test_health():
    response = client.get('/health')
    assert response.status_code == 200
    assert response.json()['status'] == 'ok'

def test_pronunciation_returns_pinyin_and_zhuyin():
    response = client.get('/api/pronunciation', params={'text': '你好'})
    assert response.status_code == 200
    body = response.json()
    assert body['text'] == '你好'
    assert len(body['pinyin']) == 2
    assert len(body['zhuyin']) == 2
    assert body['needs_human_review'] is True

def test_rejects_text_without_chinese_characters():
    response = client.get('/api/pronunciation', params={'text': 'hello'})
    assert response.status_code == 422

def test_rejects_overlong_text():
    response = client.get('/api/pronunciation', params={'text': '中' * 101})
    assert response.status_code == 422
