import enum
import uuid
from datetime import datetime, timezone
from typing import TYPE_CHECKING
from sqlalchemy import String, DateTime, Enum as SQLEnum, text, UUID, ForeignKey, Numeric, Boolean, Integer

if TYPE_CHECKING:
    from app.models.company import Company
    from app.models.profile import Profile
    from app.models.approval import ApprovalRequest
    from app.models.signature import Signature
    from app.models.document import UploadedDocument, AIChatHistory
    from app.models.activity import ContractEvent
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class ContractStatus(str, enum.Enum):
    DRAFT = "Draft"
    PENDING_REVIEW = "Pending Review"
    NEEDS_CHANGES = "Needs Changes"
    APPROVED = "Approved"
    REJECTED = "Rejected"
    ARCHIVED = "Archived"

class ContractCategory(Base):
    __tablename__ = "contract_categories"
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    description: Mapped[str] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=text("CURRENT_TIMESTAMP"), 
        default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    templates: Mapped[list["ContractTemplate"]] = relationship(
        "ContractTemplate", 
        back_populates="category"
    )


class ContractTemplate(Base):
    __tablename__ = "contract_templates"
    
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
    category_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("contract_categories.id", ondelete="SET NULL"), 
        nullable=True
    )
    template_name: Mapped[str] = mapped_column(String, nullable=False)
    template_content: Mapped[str] = mapped_column(String, nullable=False)
    version: Mapped[int] = mapped_column(Integer, default=1)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_by: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("profiles.id", ondelete="SET NULL"), 
        nullable=True
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
    company: Mapped["Company"] = relationship("Company", back_populates="templates")
    category: Mapped["ContractCategory"] = relationship("ContractCategory", back_populates="templates")
    contracts: Mapped[list["Contract"]] = relationship("Contract", back_populates="template")


class Contract(Base):
    __tablename__ = "contracts"
    
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
    company_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("companies.id", ondelete="CASCADE"), 
        nullable=True
    )
    template_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("contract_templates.id", ondelete="SET NULL"), 
        nullable=True
    )
    title: Mapped[str] = mapped_column(String, nullable=False)
    purpose: Mapped[str] = mapped_column(String, nullable=True)
    generated_content: Mapped[str] = mapped_column(String, nullable=False)
    ai_summary: Mapped[str] = mapped_column(String, nullable=True)
    risk_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=True)
    
    status: Mapped[ContractStatus] = mapped_column(
        SQLEnum(ContractStatus, native_enum=False), 
        default=ContractStatus.DRAFT
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
    user: Mapped["Profile"] = relationship("Profile", back_populates="contracts")
    company: Mapped["Company"] = relationship("Company", back_populates="contracts")
    template: Mapped["ContractTemplate"] = relationship("ContractTemplate", back_populates="contracts")
    
    approvals: Mapped[list["ApprovalRequest"]] = relationship(
        "ApprovalRequest", 
        back_populates="contract", 
        cascade="all, delete-orphan"
    )
    signatures: Mapped[list["Signature"]] = relationship(
        "Signature", 
        back_populates="contract", 
        cascade="all, delete-orphan"
    )
    chats: Mapped[list["AIChatHistory"]] = relationship(
        "AIChatHistory", 
        back_populates="contract", 
        cascade="all, delete-orphan"
    )
    documents: Mapped[list["UploadedDocument"]] = relationship(
        "UploadedDocument", 
        back_populates="contract", 
        cascade="all, delete-orphan"
    )
    events: Mapped[list["ContractEvent"]] = relationship(
        "ContractEvent", 
        back_populates="contract", 
        cascade="all, delete-orphan"
    )
    versions: Mapped[list["ContractVersion"]] = relationship(
        "ContractVersion", 
        back_populates="contract", 
        cascade="all, delete-orphan"
    )


class ContractVersion(Base):
    __tablename__ = "contract_versions"
    
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
    version: Mapped[int] = mapped_column(Integer, nullable=False)
    content: Mapped[str] = mapped_column(String, nullable=False)
    created_by: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("profiles.id", ondelete="SET NULL"), 
        nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=text("CURRENT_TIMESTAMP"), 
        default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    contract: Mapped["Contract"] = relationship("Contract", back_populates="versions")
