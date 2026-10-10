import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_reports():
    response = client.get("/api/v1/reports")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_create_and_interact_with_report():
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
    report_id = data["id"]
    assert data["title"] == "Suspicious Bank Verification SMS"

    # GET report by ID
    get_res = client.get(f"/api/v1/reports/{report_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == report_id

    # Upvote report
    up_res = client.post(f"/api/v1/reports/{report_id}/upvote")
    assert up_res.status_code == 200
    assert up_res.json()["upvotes"] >= 1

    # Add comment
    cmt_res = client.post(
        f"/api/v1/reports/{report_id}/comments",
        json={"comment_text": "I also received this exact message today!"}
    )
    assert cmt_res.status_code == 201
    assert cmt_res.json()["comment_text"] == "I also received this exact message today!"
