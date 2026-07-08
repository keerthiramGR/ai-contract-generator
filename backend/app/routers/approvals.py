from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.approval import ApprovalRequestCreate, ApprovalRequestUpdate, ApprovalRequestResponse
from app.services.approval_service import ApprovalService
from app.core.auth import get_current_user
from app.models.profile import Profile, UserRole
from app.middleware.permissions import require_company_admin
import uuid
from typing import List

router = APIRouter(prefix="/approvals", tags=["Approval Workflow"])

@router.post("/submit", response_model=ApprovalRequestResponse, status_code=status.HTTP_201_CREATED)
async def submit_contract(
    req_in: ApprovalRequestCreate,
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Submits a contract for approval review."""
    return await ApprovalService.submit_for_approval(db, current_user.id, req_in)

@router.put("/{request_id}", response_model=ApprovalRequestResponse)
async def review_request(
    request_id: uuid.UUID,
    update_in: ApprovalRequestUpdate,
    current_user: Profile = Depends(require_company_admin),
    db: AsyncSession = Depends(get_db)
):
    """Approve or reject a submitted contract (Admins only)."""
    return await ApprovalService.review_request(db, current_user.id, request_id, update_in)

@router.get("", response_model=List[ApprovalRequestResponse])
async def get_company_approvals(
    current_user: Profile = Depends(require_company_admin),
    db: AsyncSession = Depends(get_db)
):
    """List all approval requests for the company (Admins only)."""
    if current_user.role == UserRole.SUPER_ADMIN:
        from sqlalchemy import select
        from app.models.approval import ApprovalRequest
        result = await db.execute(select(ApprovalRequest))
        return list(result.scalars().all())
    
    return await ApprovalService.get_approvals_by_company(db, current_user.company_id)
