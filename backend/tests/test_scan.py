import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_scan_text_phishing():
    response = client.post(
        "/api/v1/scan/text",
        json={
            "text": "URGENT: Your account suspended! Verify now at paypal-account-security-update.top or account locked.",
            "sender": "alert@paypal-account-security-update.top"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["risk_score"] > 60
    assert data["risk_level"] in ["Suspicious", "High Risk"]
    assert len(data["threat_indicators"]) > 0

def test_scan_url_blacklisted():
    response = client.post(
        "/api/v1/scan/url",
        json={"url": "http://paypal-account-security-update.top"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["risk_score"] > 70
    assert "url_reputation" in data

def test_scan_phone_scam():
    response = client.post(
        "/api/v1/scan/phone",
        json={"phone_number": "+19005550199"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["risk_score"] > 70
