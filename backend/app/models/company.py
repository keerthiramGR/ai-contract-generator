import enum
import uuid
from datetime import datetime, timezone
from typing import TYPE_CHECKING
from sqlalchemy import String, DateTime, Enum as SQLEnum, text, UUID

if TYPE_CHECKING:
    from app.models.profile import Profile, CompanyAdmin
    from app.models.contract import ContractTemplate, Contract
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class CompanyStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    SUSPENDED = "suspended"

class Company(Base):
    __tablename__ = "companies"
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    company_name: Mapped[str] = mapped_column(String, nullable=False)
    company_email: Mapped[str] = mapped_column(String, nullable=True)
    company_logo: Mapped[str] = mapped_column(String, nullable=True)
    website: Mapped[str] = mapped_column(String, nullable=True)
    industry: Mapped[str] = mapped_column(String, nullable=True)
    description: Mapped[str] = mapped_column(String, nullable=True)
    country: Mapped[str] = mapped_column(String, nullable=True)
    state: Mapped[str] = mapped_column(String, nullable=True)
    city: Mapped[str] = mapped_column(String, nullable=True)
    address: Mapped[str] = mapped_column(String, nullable=True)
    
    status: Mapped[CompanyStatus] = mapped_column(
        SQLEnum(CompanyStatus, native_enum=False), 
        default=CompanyStatus.PENDING
    )
    
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
    profiles: Mapped[list["Profile"]] = relationship(
        "Profile", 
        back_populates="company", 
        cascade="all, delete-orphan"
    )
    admins: Mapped[list["CompanyAdmin"]] = relationship(
        "CompanyAdmin", 
        back_populates="company", 
        cascade="all, delete-orphan"
    )
    templates: Mapped[list["ContractTemplate"]] = relationship(
        "ContractTemplate", 
        back_populates="company", 
        cascade="all, delete-orphan"
    )
    contracts: Mapped[list["Contract"]] = relationship(
        "Contract", 
        back_populates="company", 
        cascade="all, delete-orphan"
    )
