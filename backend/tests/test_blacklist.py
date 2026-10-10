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
