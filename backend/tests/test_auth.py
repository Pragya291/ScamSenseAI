import pytest
import time
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_register_user():
    ts = int(time.time() * 1000)
    email = f"testuser_{ts}@example.com"
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": email,
            "password": "securepassword123",
            "full_name": "Test User"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == email
    assert data["full_name"] == "Test User"

def test_login_user():
    ts = int(time.time() * 1000)
    email = f"login_{ts}@example.com"
    client.post(
        "/api/v1/auth/register",
        json={
            "email": email,
            "password": "loginpassword123",
            "full_name": "Login User"
        }
    )
    
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": email,
            "password": "loginpassword123"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_invalid_password():
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "user@scamsense.ai",
            "password": "wrongpassword"
        }
    )
    assert response.status_code == 401

def test_me_and_change_password():
    ts = int(time.time() * 1000)
    email = f"me_{ts}@example.com"
    client.post(
        "/api/v1/auth/register",
        json={
            "email": email,
            "password": "oldpassword123",
            "full_name": "Me User"
        }
    )
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": "oldpassword123"}
    )
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # GET /me
    me_res = client.get("/api/v1/auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["email"] == email

    # POST /change-password
    chg_res = client.post(
        "/api/v1/auth/change-password",
        json={"old_password": "oldpassword123", "new_password": "newpassword123"},
        headers=headers
    )
    assert chg_res.status_code == 200

    # Login with new password
    login_new = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": "newpassword123"}
    )
    assert login_new.status_code == 200
