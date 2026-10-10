import io
import time
import pytest
import cv2
import numpy as np
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_health_check():
    res = client.get("/")
    assert res.status_code == 200
    assert res.json()["status"] == "online"

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

def test_scan_url_ssrf_prevention():
    response = client.post(
        "/api/v1/scan/url",
        json={"url": "http://127.0.0.1:8000/admin"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["risk_score"] >= 70
    ssrf_indicators = [i for i in data["threat_indicators"] if i["rule_name"] == "private_network_target"]
    assert len(ssrf_indicators) > 0

def test_scan_phone_scam():
    response = client.post(
        "/api/v1/scan/phone",
        json={"phone_number": "+19005550199"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["risk_score"] > 70

def test_scan_multi_vector():
    response = client.post(
        "/api/v1/scan/multi",
        json={
            "text": "URGENT: Account locked, verify now!",
            "url": "http://chase-verify-banking.xyz",
            "phone_number": "+19005550199",
            "sender_email": "security@chase-verify-banking.xyz"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["scan_type"] == "multi"
    assert data["risk_score"] >= 70
    assert len(data["threat_indicators"]) > 0

def test_scan_qr_upload():
    # Create synthetic QR image containing test URL
    qr = cv2.QRCodeEncoder.create()
    img = np.zeros((300, 300, 3), dtype=np.uint8) + 255
    # Encode simple QR using opencv or synthetic black-white box
    is_success, buffer = cv2.imencode(".png", img)
    assert is_success
    
    file_bytes = io.BytesIO(buffer.tobytes())
    response = client.post(
        "/api/v1/scan/qr",
        files={"file": ("test_qr.png", file_bytes, "image/png")}
    )
    # 400 because synthetic plain image has no QR code matrix, returning clear message
    assert response.status_code == 400
    assert "No QR code detected" in response.json()["detail"]

def test_scan_history_and_deletion_authorization():
    ts = int(time.time() * 1000)
    email_a = f"usera_{ts}@example.com"
    email_b = f"userb_{ts}@example.com"

    # Register User A
    res_a = client.post(
        "/api/v1/auth/register",
        json={"email": email_a, "password": "password123", "full_name": "User A"}
    )
    login_a = client.post(
        "/api/v1/auth/login",
        json={"email": email_a, "password": "password123"}
    )
    token_a = login_a.json()["access_token"]
    headers_a = {"Authorization": f"Bearer {token_a}"}

    # Register User B
    res_b = client.post(
        "/api/v1/auth/register",
        json={"email": email_b, "password": "password123", "full_name": "User B"}
    )
    login_b = client.post(
        "/api/v1/auth/login",
        json={"email": email_b, "password": "password123"}
    )
    token_b = login_b.json()["access_token"]
    headers_b = {"Authorization": f"Bearer {token_b}"}

    # Create scan for User A
    scan_res_a = client.post(
        "/api/v1/scan/text",
        json={"text": "User A test message text scan"},
        headers=headers_a
    )
    scan_id_a = scan_res_a.json()["scan_id"]

    # Verify User B cannot delete User A's record (403 Forbidden)
    del_res = client.delete(f"/api/v1/scan/history/{scan_id_a}", headers=headers_b)
    assert del_res.status_code == 403

    # User A can delete own record
    del_res_a = client.delete(f"/api/v1/scan/history/{scan_id_a}", headers=headers_a)
    assert del_res_a.status_code == 200
