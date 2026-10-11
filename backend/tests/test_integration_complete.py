import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoints():
    """Verify health check on both /health and /api/health."""
    res1 = client.get("/health")
    assert res1.status_code == 200
    assert res1.json()["status"] == "healthy"

    res2 = client.get("/api/health")
    assert res2.status_code == 200
    assert res2.json()["status"] == "healthy"

def test_generic_scan_endpoint_url():
    """Verify POST /api/scan with URL input returns standardized response schema."""
    res = client.post(
        "/api/scan",
        json={"content": "http://testsafebrowsing.appspot.com/s/malware.html"}
    )
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "verdict" in data
    assert "risk_score" in data
    assert "risk_level" in data
    assert "summary" in data
    assert "indicators" in data
    assert "security_checks" in data
    assert "recommendations" in data
    assert "sources" in data
    assert data["scan_id"] is not None

def test_generic_scan_endpoint_text():
    """Verify POST /api/scan with SMS phishing text."""
    res = client.post(
        "/api/scan",
        json={"content": "URGENT: Your bank account has been suspended! Verify your identity immediately at secure-login-bank.xyz to prevent asset freezing."}
    )
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["risk_score"] >= 60
    assert data["verdict"] in ["SCAM", "High Risk", "SUSPICIOUS"]
    assert len(data["indicators"]) > 0
    assert len(data["recommendations"]) > 0

def test_scan_history_and_detail_flow():
    """Verify authenticated user can retrieve history and view specific scan detail."""
    import time
    ts = int(time.time() * 1000)
    email = f"flow_user_{ts}@scamsense.ai"

    # Register & Login
    client.post("/api/v1/auth/register", json={"email": email, "password": "Password123!", "full_name": "Integration User"})
    login_res = client.post("/api/v1/auth/login", json={"email": email, "password": "Password123!"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Perform a scan
    scan_res = client.post(
        "/api/scan",
        json={"content": "Important tax refund notification click here"},
        headers=headers
    )
    assert scan_res.status_code == 200
    scan_id = scan_res.json()["scan_id"]

    # Fetch history
    hist_res = client.get("/api/scan/history", headers=headers)
    assert hist_res.status_code == 200
    history_items = hist_res.json()
    assert len(history_items) > 0
    assert any(h["id"] == str(scan_id) for h in history_items)

    # Fetch detail by ID
    detail_res = client.get(f"/api/scan/history/{scan_id}", headers=headers)
    assert detail_res.status_code == 200
    detail = detail_res.json()
    assert detail["id"] == str(scan_id)
    assert "risk_score" in detail
