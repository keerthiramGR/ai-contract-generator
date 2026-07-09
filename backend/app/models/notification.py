import uuid
from datetime import datetime, timezone
from typing import TYPE_CHECKING
from sqlalchemy import String, DateTime, text, UUID, ForeignKey, Boolean

if TYPE_CHECKING:
    from app.models.profile import Profile
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class Notification(Base):
    __tablename__ = "notifications"
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("profiles.id", ondelete="CASCADE"), 
        nullable=False
    )
    title: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(String, nullable=True)
    notification_type: Mapped[str] = mapped_column(String, nullable=True) # e.g. 'approved', 'changes_requested', 'new_request'
    
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=text("CURRENT_TIMESTAMP"), 
        default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    profile: Mapped["Profile"] = relationship("Profile", back_populates="notifications")
