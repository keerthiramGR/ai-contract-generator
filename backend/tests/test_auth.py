import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_auth_flow(client: AsyncClient):
    """Verifies user signup, token retrieval on login, and profile access."""
    # 1. User Registration
    signup_payload = {
        "email": "testuser@example.com",
        "password": "securepassword123",
        "full_name": "Test User",
        "phone_number": "1234567890",
        "country": "USA",
        "state": "California",
        "city": "Los Angeles"
    }
    response = await client.post("/api/v1/auth/signup", json=signup_payload)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "testuser@example.com"
    assert data["full_name"] == "Test User"
    assert "id" in data
    
    # 2. User Authentication
    login_payload = {
        "email": "testuser@example.com",
        "password": "securepassword123"
    }
    response = await client.post("/api/v1/auth/login", json=login_payload)
    assert response.status_code == 200
    token_data = response.json()
    assert "access_token" in token_data
    assert token_data["token_type"] == "bearer"
    
    token = token_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # 3. Fetch User Profile
    response = await client.get("/api/v1/users/me", headers=headers)
    assert response.status_code == 200
    profile = response.json()
    assert profile["email"] == "testuser@example.com"
