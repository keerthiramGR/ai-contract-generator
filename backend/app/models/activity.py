import uuid
from datetime import datetime, timezone
from typing import TYPE_CHECKING
from sqlalchemy import String, DateTime, text, UUID, ForeignKey

if TYPE_CHECKING:
    from app.models.profile import Profile
    from app.models.contract import Contract
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class ActivityLog(Base):
    __tablename__ = "activity_logs"
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("profiles.id", ondelete="SET NULL"), 
        nullable=True
    )
    action: Mapped[str] = mapped_column(String, nullable=False) # e.g. 'LOGIN', 'CREATE_CONTRACT'
    module: Mapped[str] = mapped_column(String, nullable=True) # e.g. 'AUTH', 'CONTRACTS'
    ip_address: Mapped[str] = mapped_column(String, nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=text("CURRENT_TIMESTAMP"), 
        default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    profile: Mapped["Profile"] = relationship("Profile", back_populates="logs")


class ContractEvent(Base):
    __tablename__ = "contract_events"
    
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
    event_type: Mapped[str] = mapped_column(String, nullable=False) # 'Created', 'Submitted', 'Approved', 'Rejected', 'Signed'
    
    event_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=text("CURRENT_TIMESTAMP"), 
        default=lambda: datetime.now(timezone.utc)
    )
    
    created_by: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("profiles.id", ondelete="SET NULL"), 
        nullable=True
    )

    # Relationships
    contract: Mapped["Contract"] = relationship("Contract", back_populates="events")
