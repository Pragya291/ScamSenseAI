import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_reports():
    response = client.get("/api/v1/reports")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_create_report():
    response = client.post(
        "/api/v1/reports",
        json={
            "title": "Suspicious Bank Verification SMS",
            "scam_type": "sms",
            "scam_category": "phishing",
            "description": "Received SMS claiming my bank account is locked and asking to click chase-verify-banking.xyz link.",
            "sender_info": "chase-verify-banking.xyz"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Suspicious Bank Verification SMS"
    assert "id" in data
