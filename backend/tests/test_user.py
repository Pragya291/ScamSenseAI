import pytest
import time
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_user_api_key_generation_and_list():
    ts = int(time.time() * 1000)
    email = f"apikey_{ts}@example.com"
    client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": "password123", "full_name": "API Key User"}
    )
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": "password123"}
    )
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Generate API Key
    gen_res = client.post("/api/v1/user/api-keys?name=TestKey", headers=headers)
    assert gen_res.status_code == 200
    key_data = gen_res.json()
    assert "api_key" in key_data
    assert key_data["api_key"].startswith("scam_")

    # List API Keys
    list_res = client.get("/api/v1/user/api-keys", headers=headers)
    assert list_res.status_code == 200
    assert len(list_res.json()) >= 1

    # Test accessing endpoint with X-API-Key header
    api_key = key_data["api_key"]
    me_res = client.get("/api/v1/auth/me", headers={"X-API-Key": api_key})
    assert me_res.status_code == 200
    assert me_res.json()["email"] == email
