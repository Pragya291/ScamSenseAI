import pytest
import time
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_visitor_cannot_access_protected_data():
    """Unauthenticated visitors cannot access protected user history or endpoints."""
    # 1. Unauthenticated request to /api/scan/history
    res_no_auth = client.get("/api/scan/history")
    assert res_no_auth.status_code == 401
    assert "Not authenticated" in res_no_auth.json()["detail"]

    # 2. Unauthenticated request to /api/v1/auth/me
    res_me_no_auth = client.get("/api/v1/auth/me")
    assert res_me_no_auth.status_code == 401

    # 3. Invalid/expired token request to /api/scan/history
    res_invalid_tok = client.get(
        "/api/scan/history",
        headers={"Authorization": "Bearer invalid.expired.token"}
    )
    assert res_invalid_tok.status_code == 401

def test_user_a_and_user_b_complete_isolation():
    """Verify complete data isolation between User A and User B."""
    ts = int(time.time() * 1000)
    email_a = f"alice_{ts}@isolation-test.com"
    email_b = f"bob_{ts}@isolation-test.com"
    pwd = "SecurePassword123!"

    # 1. Register User A
    reg_a = client.post(
        "/api/v1/auth/register",
        json={"email": email_a, "password": pwd, "full_name": "Alice Smith"}
    )
    assert reg_a.status_code == 201

    # Login User A
    login_a = client.post(
        "/api/v1/auth/login",
        json={"email": email_a, "password": pwd}
    )
    assert login_a.status_code == 200
    token_a = login_a.json()["access_token"]
    headers_a = {"Authorization": f"Bearer {token_a}"}

    # Verify User A profile
    me_a = client.get("/api/v1/auth/me", headers=headers_a)
    assert me_a.status_code == 200
    assert me_a.json()["email"] == email_a
    assert me_a.json()["full_name"] == "Alice Smith"

    # User A performs a scan
    scan_a = client.post(
        "/api/scan",
        json={"content": "https://suspicious-phish-portal.test"},
        headers=headers_a
    )
    assert scan_a.status_code == 200
    scan_id_a = scan_a.json()["scan_id"]
    assert scan_id_a is not None

    # User A history contains this scan
    hist_a = client.get("/api/scan/history", headers=headers_a)
    assert hist_a.status_code == 200
    user_a_scans = hist_a.json()
    assert len(user_a_scans) >= 1
    assert any(s["id"] == str(scan_id_a) for s in user_a_scans)

    # 2. Register User B
    reg_b = client.post(
        "/api/v1/auth/register",
        json={"email": email_b, "password": pwd, "full_name": "Bob Jones"}
    )
    assert reg_b.status_code == 201

    # Login User B
    login_b = client.post(
        "/api/v1/auth/login",
        json={"email": email_b, "password": pwd}
    )
    assert login_b.status_code == 200
    token_b = login_b.json()["access_token"]
    headers_b = {"Authorization": f"Bearer {token_b}"}

    # Verify User B profile is strictly Bob's (never Alice's or hardcoded owner's)
    me_b = client.get("/api/v1/auth/me", headers=headers_b)
    assert me_b.status_code == 200
    assert me_b.json()["email"] == email_b
    assert me_b.json()["full_name"] == "Bob Jones"

    # Verify User B's scan history does NOT contain User A's scans
    hist_b = client.get("/api/scan/history", headers=headers_b)
    assert hist_b.status_code == 200
    user_b_scans = hist_b.json()
    assert all(s["id"] != str(scan_id_a) for s in user_b_scans)

    # 3. User B cannot view User A's scan detail (403 Forbidden)
    detail_res_b = client.get(f"/api/scan/history/{scan_id_a}", headers=headers_b)
    assert detail_res_b.status_code == 403
    assert "Not authorized" in detail_res_b.json()["detail"]

    # 4. User B cannot delete User A's scan record (403 Forbidden)
    delete_res_b = client.delete(f"/api/scan/history/{scan_id_a}", headers=headers_b)
    assert delete_res_b.status_code == 403
    assert "Not authorized" in delete_res_b.json()["detail"]

    # 5. User A can view their own scan detail (200 OK)
    detail_res_a = client.get(f"/api/scan/history/{scan_id_a}", headers=headers_a)
    assert detail_res_a.status_code == 200
    assert detail_res_a.json()["id"] == str(scan_id_a)

    # 6. User A can delete their own scan record (200 OK)
    delete_res_a = client.delete(f"/api/scan/history/{scan_id_a}", headers=headers_a)
    assert delete_res_a.status_code == 200

def test_demo_tokens_isolated_identity():
    """Verify demo tokens generate separate isolated accounts and do not map to fixed user."""
    ts = int(time.time() * 1000)
    tok1 = f"demo-user-token-{ts}1"
    tok2 = f"demo-user-token-{ts}2"

    me1 = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {tok1}"})
    assert me1.status_code == 200

    me2 = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {tok2}"})
    assert me2.status_code == 200

    # Ensure two different demo tokens received different user records
    assert me1.json()["id"] != me2.json()["id"]
    assert me1.json()["email"] != me2.json()["email"]
