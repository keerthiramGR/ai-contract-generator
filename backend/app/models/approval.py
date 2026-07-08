import enum
import uuid
from datetime import datetime, timezone
from typing import TYPE_CHECKING
from sqlalchemy import String, DateTime, Enum as SQLEnum, text, UUID, ForeignKey

if TYPE_CHECKING:
    from app.models.contract import Contract
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class ApprovalStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class ApprovalRequest(Base):
    __tablename__ = "approval_requests"
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    contract_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("contracts.id", ondelete="CASCADE"), 
        nullable=False
    )
    company_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("companies.id", ondelete="CASCADE"), 
        nullable=True
    )
    assigned_admin: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("profiles.id", ondelete="SET NULL"), 
        nullable=True
    )
    
    status: Mapped[ApprovalStatus] = mapped_column(
        SQLEnum(ApprovalStatus, native_enum=False), 
        default=ApprovalStatus.PENDING
    )
    
    review_comments: Mapped[str | None] = mapped_column(String, nullable=True)
    
    approved_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), 
        nullable=True
    )
    rejected_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), 
        nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=text("CURRENT_TIMESTAMP"), 
        default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    contract: Mapped["Contract"] = relationship("Contract", back_populates="approvals")
