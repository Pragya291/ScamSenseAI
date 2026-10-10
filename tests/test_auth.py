import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_register_user():
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "testuser_new@example.com",
            "password": "securepassword123",
            "full_name": "Test User"
        }
    )
    assert response.status_code in [201, 400]  # 201 created or 400 if already exists
    if response.status_code == 201:
        data = response.json()
        assert data["email"] == "testuser_new@example.com"
        assert data["full_name"] == "Test User"

def test_login_user():
    # Register first
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "login_test@example.com",
            "password": "loginpassword123",
            "full_name": "Login User"
        }
    )
    
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "login_test@example.com",
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
