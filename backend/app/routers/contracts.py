from fastapi import APIRouter, Depends, HTTPException, status, Response, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.contract import ContractCreate, ContractUpdate, ContractResponse, ContractVersionResponse
from app.services.contract_service import ContractService
from app.services.pdf_service import PDFService
from app.core.auth import get_current_user
from app.models.profile import Profile, UserRole
import uuid
from typing import List, Optional

router = APIRouter(prefix="/contracts", tags=["Contracts"])

@router.post("", response_model=ContractResponse, status_code=status.HTTP_201_CREATED)
async def create_contract(
    contract_in: ContractCreate,
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Creates a new contract and logs the initial version."""
    # Ensure correct company association
    if current_user.role != UserRole.SUPER_ADMIN:
        contract_in.company_id = current_user.company_id
    return await ContractService.create_contract(db, current_user.id, contract_in)

@router.get("", response_model=List[ContractResponse])
async def get_contracts(
    db: AsyncSession = Depends(get_db),
    current_user: Profile = Depends(get_current_user)
):
    """Retrieves all contracts accessible by the user's role."""
    if current_user.role == UserRole.SUPER_ADMIN:
        from sqlalchemy import select
        from app.models.contract import Contract
        result = await db.execute(select(Contract))
        return list(result.scalars().all())
    elif current_user.role == UserRole.COMPANY_ADMIN:
        from sqlalchemy import select
        from app.models.contract import Contract
        result = await db.execute(select(Contract).where(Contract.company_id == current_user.company_id))
        return list(result.scalars().all())
    else:
        # General users can only access their own contracts
        return await ContractService.get_contracts_by_user(db, current_user.id)

@router.get("/{contract_id}", response_model=ContractResponse)
async def get_contract(
    contract_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: Profile = Depends(get_current_user)
):
    """Retrieves details of a single contract."""
    contract = await ContractService.get_contract(db, contract_id)
    
    # Access checks
    if current_user.role == UserRole.USER and contract.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    if current_user.role == UserRole.COMPANY_ADMIN and contract.company_id != current_user.company_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
        
    return contract

@router.put("/{contract_id}", response_model=ContractResponse)
async def update_contract(
    contract_id: uuid.UUID,
    contract_update: ContractUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: Profile = Depends(get_current_user)
):
    """Updates an existing contract, archiving old state in contract_versions if content is updated."""
    contract = await ContractService.get_contract(db, contract_id)
    
    if current_user.role == UserRole.USER and contract.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Permission denied")
    if current_user.role == UserRole.COMPANY_ADMIN and contract.company_id != current_user.company_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Permission denied")
        
    return await ContractService.update_contract(db, current_user.id, contract_id, contract_update)

@router.get("/{contract_id}/versions", response_model=List[ContractVersionResponse])
async def get_contract_versions(
    contract_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: Profile = Depends(get_current_user)
):
    """Fetch previous versions of the contract content."""
    contract = await ContractService.get_contract(db, contract_id)
    if current_user.role == UserRole.USER and contract.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    return await ContractService.get_contract_versions(db, contract_id)

@router.get("/{contract_id}/download")
async def download_contract(
    contract_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: Profile = Depends(get_current_user)
):
    """Compiles contract content into PDF and downloads file."""
    contract = await ContractService.get_contract(db, contract_id)
    
    # Access checks
    if current_user.role == UserRole.USER and contract.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    if current_user.role == UserRole.COMPANY_ADMIN and contract.company_id != current_user.company_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
        
    pdf_bytes = PDFService.generate_contract_pdf(contract.title, contract.generated_content)
    
    filename = f"{contract.title.replace(' ', '_')}.pdf"
    headers = {
        "Content-Disposition": f"attachment; filename={filename}"
    }
    return Response(content=pdf_bytes, media_type="application/pdf", headers=headers)
