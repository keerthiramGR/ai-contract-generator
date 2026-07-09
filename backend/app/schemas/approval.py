import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from app.models.approval import ApprovalStatus

class ApprovalRequestCreate(BaseModel):
    contract_id: uuid.UUID
    company_id: Optional[uuid.UUID] = None
    assigned_admin: Optional[uuid.UUID] = None

class ApprovalRequestUpdate(BaseModel):
    status: ApprovalStatus
    review_comments: Optional[str] = None

class ApprovalRequestResponse(BaseModel):
    id: uuid.UUID
    contract_id: uuid.UUID
    company_id: Optional[uuid.UUID] = None
    assigned_admin: Optional[uuid.UUID] = None
    status: ApprovalStatus
    review_comments: Optional[str] = None
    approved_at: Optional[datetime] = None
    rejected_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True
