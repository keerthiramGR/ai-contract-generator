import uuid
from datetime import datetime, timezone
from typing import TYPE_CHECKING
from sqlalchemy import String, DateTime, text, UUID, ForeignKey

if TYPE_CHECKING:
    from app.models.contract import Contract
    from app.models.profile import Profile
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class Signature(Base):
    __tablename__ = "signatures"
    
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
    signed_by: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("profiles.id", ondelete="CASCADE"), 
        nullable=False
    )
    signature_image: Mapped[str] = mapped_column(String, nullable=True) # URL or Base64 string
    signature_type: Mapped[str] = mapped_column(String, nullable=True)  # 'draw', 'type', 'upload'
    
    signed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=text("CURRENT_TIMESTAMP"), 
        default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    contract: Mapped["Contract"] = relationship("Contract", back_populates="signatures")
    profile: Mapped["Profile"] = relationship("Profile", back_populates="signatures")
