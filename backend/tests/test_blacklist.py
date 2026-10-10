import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_check_blacklist_match():
    response = client.post(
        "/api/v1/blacklist/check",
        json={"entity_value": "paypal-account-security-update.top"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["is_blacklisted"] is True
    assert data["risk_score"] > 80

def test_check_whitelist_match():
    response = client.post(
        "/api/v1/blacklist/check",
        json={"entity_value": "paypal.com"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["is_whitelisted"] is True
    assert data["is_blacklisted"] is False

def test_get_blacklisted_and_whitelisted_lists():
    res_bl = client.get("/api/v1/blacklist")
    assert res_bl.status_code == 200
    assert isinstance(res_bl.json(), list)

    res_wl = client.get("/api/v1/blacklist/whitelist")
    assert res_wl.status_code == 200
    assert isinstance(res_wl.json(), list)

def test_admin_add_blacklist_entry():
    # Login as admin
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@scamsense.ai", "password": "admin123"}
    )
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    response = client.post(
        "/api/v1/blacklist",
        json={
            "entity_type": "domain",
            "entity_value": "fake-bank-login-scam.xyz",
            "reason": "Confirmed fake login portal",
            "risk_score": 99.0
        },
        headers=headers
    )
    assert response.status_code == 201
    assert response.json()["entity_value"] == "fake-bank-login-scam.xyz"
