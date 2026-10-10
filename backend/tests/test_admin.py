import pytest
import time
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_admin_endpoints():
    # Login as admin
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@scamsense.ai", "password": "admin123"}
    )
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Get pending reports
    pending_res = client.get("/api/v1/admin/reports/pending", headers=headers)
    assert pending_res.status_code == 200
    assert isinstance(pending_res.json(), list)

    # 2. Get all users
    users_res = client.get("/api/v1/admin/users", headers=headers)
    assert users_res.status_code == 200
    assert isinstance(users_res.json(), list)

def test_admin_forbidden_for_regular_user():
    ts = int(time.time() * 1000)
    email = f"reg_user_{ts}@example.com"
    # Login as regular user
    client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": "password123", "full_name": "Regular User"}
    )
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": "password123"}
    )
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    res = client.get("/api/v1/admin/users", headers=headers)
    assert res.status_code == 403
