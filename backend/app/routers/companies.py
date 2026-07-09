from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.schemas.company import CompanyCreate, CompanyUpdate, CompanyResponse
from app.models.company import Company
from app.middleware.permissions import require_super_admin, require_company_admin
from app.core.auth import get_current_user
from app.models.profile import Profile, UserRole
from app.models.activity import ActivityLog
import uuid
from typing import List, Optional

router = APIRouter(prefix="/companies", tags=["Companies"])

@router.post("", response_model=CompanyResponse, status_code=status.HTTP_201_CREATED)
async def create_company(
    company_in: CompanyCreate, 
    current_user: Profile = Depends(require_super_admin), 
    db: AsyncSession = Depends(get_db)
):
    """Creates a new company (Super Admin only)."""
    company = Company(**company_in.model_dump())
    db.add(company)
    await db.flush()
    
    # Log action
    db.add(ActivityLog(user_id=current_user.id, action="CREATE_COMPANY", module="COMPANIES"))
    await db.commit()
    await db.refresh(company)
    return company

@router.get("", response_model=List[CompanyResponse])
async def get_companies(
    search: Optional[str] = None, 
    db: AsyncSession = Depends(get_db),
    current_user: Profile = Depends(get_current_user)
):
    """Get list of companies."""
    query = select(Company)
    if search:
        query = query.where(Company.company_name.ilike(f"%{search}%"))
    result = await db.execute(query)
    return list(result.scalars().all())

@router.get("/{company_id}", response_model=CompanyResponse)
async def get_company(
    company_id: uuid.UUID, 
    db: AsyncSession = Depends(get_db),
    current_user: Profile = Depends(get_current_user)
):
    """Retrieve details of a single company by ID."""
    result = await db.execute(select(Company).where(Company.id == company_id))
    company = result.scalar_one_or_none()
    if not company:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")
    return company

@router.put("/{company_id}", response_model=CompanyResponse)
async def update_company(
    company_id: uuid.UUID,
    company_update: CompanyUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: Profile = Depends(require_company_admin)
):
    """Updates company details (Company Admin and Super Admin)."""
    # Verify auth permissions (if company admin, can only edit their own company)
    if current_user.role == UserRole.COMPANY_ADMIN and current_user.company_id != company_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="You can only manage your own company details."
        )
        
    result = await db.execute(select(Company).where(Company.id == company_id))
    company = result.scalar_one_or_none()
    if not company:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")
        
    for key, value in company_update.model_dump(exclude_unset=True).items():
        setattr(company, key, value)
        
    db.add(ActivityLog(user_id=current_user.id, action="UPDATE_COMPANY", module="COMPANIES"))
    await db.commit()
    await db.refresh(company)
    return company

@router.delete("/{company_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_company(
    company_id: uuid.UUID, 
    db: AsyncSession = Depends(get_db),
    current_user: Profile = Depends(require_super_admin)
):
    """Deletes a company (Super Admin only)."""
    result = await db.execute(select(Company).where(Company.id == company_id))
    company = result.scalar_one_or_none()
    if not company:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")
        
    await db.delete(company)
    db.add(ActivityLog(user_id=current_user.id, action="DELETE_COMPANY", module="COMPANIES"))
    await db.commit()
    return None
