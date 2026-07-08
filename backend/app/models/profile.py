import enum
import uuid
from datetime import datetime, timezone
from typing import TYPE_CHECKING
from sqlalchemy import String, DateTime, Enum as SQLEnum, text, UUID, ForeignKey

if TYPE_CHECKING:
    from app.models.company import Company
    from app.models.contract import Contract
    from app.models.signature import Signature
    from app.models.notification import Notification
    from app.models.document import AIChatHistory, UploadedDocument
    from app.models.activity import ActivityLog
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class UserRole(str, enum.Enum):
    USER = "user"
    COMPANY_ADMIN = "company_admin"
    SUPER_ADMIN = "super_admin"

class Profile(Base):
    __tablename__ = "profiles"
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    full_name: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String, nullable=True) # Added for local auth compatibility
    phone_number: Mapped[str] = mapped_column(String, nullable=True)
    avatar_url: Mapped[str] = mapped_column(String, nullable=True)
    
    role: Mapped[UserRole] = mapped_column(
        SQLEnum(UserRole, native_enum=False), 
        default=UserRole.USER
    )
    
    company_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("companies.id", ondelete="SET NULL"), 
        nullable=True
    )
    
    country: Mapped[str] = mapped_column(String, nullable=True)
    state: Mapped[str] = mapped_column(String, nullable=True)
    city: Mapped[str] = mapped_column(String, nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=text("CURRENT_TIMESTAMP"), 
        default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=text("CURRENT_TIMESTAMP"), 
        default=lambda: datetime.now(timezone.utc), 
        onupdate=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    company: Mapped["Company"] = relationship("Company", back_populates="profiles")
    admin_mappings: Mapped[list["CompanyAdmin"]] = relationship(
        "CompanyAdmin", 
        back_populates="profile", 
        cascade="all, delete-orphan"
    )
    contracts: Mapped[list["Contract"]] = relationship(
        "Contract", 
        back_populates="user", 
        cascade="all, delete-orphan"
    )
    signatures: Mapped[list["Signature"]] = relationship(
        "Signature", 
        back_populates="profile", 
        cascade="all, delete-orphan"
    )
    notifications: Mapped[list["Notification"]] = relationship(
        "Notification", 
        back_populates="profile", 
        cascade="all, delete-orphan"
    )
    chats: Mapped[list["AIChatHistory"]] = relationship(
        "AIChatHistory", 
        back_populates="profile", 
        cascade="all, delete-orphan"
    )
    documents: Mapped[list["UploadedDocument"]] = relationship(
        "UploadedDocument", 
        back_populates="profile", 
        cascade="all, delete-orphan"
    )
    logs: Mapped[list["ActivityLog"]] = relationship(
        "ActivityLog", 
        back_populates="profile"
    )


class CompanyAdmin(Base):
    __tablename__ = "company_admins"
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    company_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("companies.id", ondelete="CASCADE"), 
        nullable=False
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("profiles.id", ondelete="CASCADE"), 
        nullable=False
    )
    designation: Mapped[str] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=text("CURRENT_TIMESTAMP"), 
        default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    company: Mapped["Company"] = relationship("Company", back_populates="admins")
    profile: Mapped["Profile"] = relationship("Profile", back_populates="admin_mappings")
