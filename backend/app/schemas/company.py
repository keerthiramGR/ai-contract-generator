import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr
from app.models.company import CompanyStatus

class CompanyCreate(BaseModel):
    company_name: str
    company_email: Optional[EmailStr] = None
    website: Optional[str] = None
    industry: Optional[str] = None
    description: Optional[str] = None
    country: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None
    address: Optional[str] = None

class CompanyUpdate(BaseModel):
    company_name: Optional[str] = None
    company_email: Optional[EmailStr] = None
    company_logo: Optional[str] = None
    website: Optional[str] = None
    industry: Optional[str] = None
    description: Optional[str] = None
    country: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None
    address: Optional[str] = None
    status: Optional[CompanyStatus] = None

class CompanyResponse(BaseModel):
    id: uuid.UUID
    company_name: str
    company_email: Optional[EmailStr] = None
    company_logo: Optional[str] = None
    website: Optional[str] = None
    industry: Optional[str] = None
    description: Optional[str] = None
    country: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None
    address: Optional[str] = None
    status: CompanyStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class CompanyAdminCreate(BaseModel):
    user_id: uuid.UUID
    designation: Optional[str] = None

class CompanyAdminResponse(BaseModel):
    id: uuid.UUID
    company_id: uuid.UUID
    user_id: uuid.UUID
    designation: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
