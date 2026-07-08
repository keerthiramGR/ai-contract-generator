from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.models.approval import ApprovalRequest, ApprovalStatus
from app.models.contract import Contract, ContractStatus
from app.models.activity import ActivityLog, ContractEvent
from app.schemas.approval import ApprovalRequestCreate, ApprovalRequestUpdate
from app.services.notification_service import NotificationService
from datetime import datetime, timezone
import uuid
from typing import List

class ApprovalService:
    @staticmethod
    async def submit_for_approval(db: AsyncSession, user_id: uuid.UUID, req_in: ApprovalRequestCreate) -> ApprovalRequest:
        """Submit a contract for admin approval."""
        # Find contract
        result = await db.execute(select(Contract).where(Contract.id == req_in.contract_id))
        contract = result.scalar_one_or_none()
        if not contract:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contract not found")
            
        # Update contract status
        contract.status = ContractStatus.PENDING_REVIEW
        
        # Create approval request
        approval_req = ApprovalRequest(
            contract_id=req_in.contract_id,
            company_id=req_in.company_id or contract.company_id,
            assigned_admin=req_in.assigned_admin,
            status=ApprovalStatus.PENDING
        )
        db.add(approval_req)
        
        # Log event & activity
        db.add(ContractEvent(contract_id=contract.id, event_type="Submitted", created_by=user_id))
        db.add(ActivityLog(user_id=user_id, action="SUBMIT_FOR_APPROVAL", module="APPROVALS"))
        
        # Create notification if an admin is assigned
        if req_in.assigned_admin:
            await NotificationService.create_notification(
                db, 
                user_id=req_in.assigned_admin,
                title="New Contract Request",
                description=f"A new contract '{contract.title}' has been submitted for your review.",
                notification_type="new_request"
            )
            
        await db.commit()
        await db.refresh(approval_req)
        return approval_req

    @staticmethod
    async def review_request(db: AsyncSession, admin_id: uuid.UUID, req_id: uuid.UUID, update_in: ApprovalRequestUpdate) -> ApprovalRequest:
        """Approve or Reject an approval request."""
        # Find approval request
        result = await db.execute(select(ApprovalRequest).where(ApprovalRequest.id == req_id))
        approval_req = result.scalar_one_or_none()
        if not approval_req:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Approval request not found")
            
        result = await db.execute(select(Contract).where(Contract.id == approval_req.contract_id))
        contract = result.scalar_one_or_none()
        if not contract:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contract not found")
            
        approval_req.status = update_in.status
        approval_req.review_comments = update_in.review_comments
        
        if update_in.status == ApprovalStatus.APPROVED:
            approval_req.approved_at = datetime.now(timezone.utc)
            contract.status = ContractStatus.APPROVED
            
            # Log event & activity
            db.add(ContractEvent(contract_id=contract.id, event_type="Approved", created_by=admin_id))
            
            # Notify user
            await NotificationService.create_notification(
                db,
                user_id=contract.user_id,
                title="Contract Approved! 🎉",
                description=f"Your contract '{contract.title}' has been approved.",
                notification_type="contract_approved"
            )
        elif update_in.status == ApprovalStatus.REJECTED:
            approval_req.rejected_at = datetime.now(timezone.utc)
            contract.status = ContractStatus.REJECTED
            
            # Log event
            db.add(ContractEvent(contract_id=contract.id, event_type="Rejected", created_by=admin_id))
            
            # Notify user
            await NotificationService.create_notification(
                db,
                user_id=contract.user_id,
                title="Contract Rejected",
                description=f"Your contract '{contract.title}' has been rejected. Feedback: {update_in.review_comments or 'No comments'}",
                notification_type="contract_rejected"
            )
            
        db.add(ActivityLog(user_id=admin_id, action=f"REVIEW_{update_in.status.value.upper()}", module="APPROVALS"))
        await db.commit()
        await db.refresh(approval_req)
        return approval_req

    @staticmethod
    async def get_approvals_by_company(db: AsyncSession, company_id: uuid.UUID) -> List[ApprovalRequest]:
        result = await db.execute(
            select(ApprovalRequest)
            .where(ApprovalRequest.company_id == company_id)
            .order_by(desc(ApprovalRequest.created_at))
        )
        return list(result.scalars().all())
