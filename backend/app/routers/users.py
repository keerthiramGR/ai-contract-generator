from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.schemas.auth import UserResponse, UserUpdate
from app.core.auth import get_current_user
from app.middleware.permissions import require_company_admin
from app.models.profile import Profile, UserRole
from app.models.activity import ActivityLog
import uuid
from typing import List

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me", response_model=UserResponse)
async def get_my_profile(
    current_user: Profile = Depends(get_current_user)
):
    """Retrieve details of currently logged in user profile."""
    return current_user

@router.put("/me", response_model=UserResponse)
async def update_my_profile(
    update_in: UserUpdate,
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update profile details of currently logged in user."""
    for key, value in update_in.model_dump(exclude_unset=True).items():
        setattr(current_user, key, value)
        
    db.add(ActivityLog(user_id=current_user.id, action="UPDATE_PROFILE", module="USERS"))
    await db.commit()
    await db.refresh(current_user)
    return current_user

@router.get("", response_model=List[UserResponse])
async def get_company_users(
    current_user: Profile = Depends(require_company_admin),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve all users associated with the administrator's company (Admins only)."""
    if current_user.role == UserRole.SUPER_ADMIN:
        result = await db.execute(select(Profile))
        return list(result.scalars().all())
        
    result = await db.execute(
        select(Profile).where(Profile.company_id == current_user.company_id)
    )
    return list(result.scalars().all())
