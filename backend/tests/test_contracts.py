import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_contract_flow(client: AsyncClient):
    """Verifies contract CRUD and version archiving triggers."""
    # 1. Register and Authenticate User
    signup_payload = {
        "email": "lawyer@example.com",
        "password": "securepassword123",
        "full_name": "Contract Lawyer"
    }
    await client.post("/api/v1/auth/signup", json=signup_payload)
    login_payload = {
        "email": "lawyer@example.com",
        "password": "securepassword123"
    }
    response = await client.post("/api/v1/auth/login", json=login_payload)
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # 2. Create Contract
    contract_payload = {
        "title": "Software Service SLA",
        "purpose": "freelancing",
        "generated_content": "Initial service content terms.",
        "ai_summary": "Initial summary"
    }
    response = await client.post(
        "/api/v1/contracts", 
        json=contract_payload, 
        headers=headers
    )
    assert response.status_code == 201
    contract = response.json()
    assert contract["title"] == "Software Service SLA"
    contract_id = contract["id"]
    
    # 3. Modify Contract Content (triggers versioning)
    update_payload = {
        "title": "Software Service SLA - V2",
        "generated_content": "Modified service content terms."
    }
    response = await client.put(
        f"/api/v1/contracts/{contract_id}", 
        json=update_payload, 
        headers=headers
    )
    assert response.status_code == 200
    
    # 4. Assert Versions Archiving
    response = await client.get(
        f"/api/v1/contracts/{contract_id}/versions", 
        headers=headers
    )
    assert response.status_code == 200
    versions = response.json()
    assert len(versions) >= 1
