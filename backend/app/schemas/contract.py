import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from app.models.contract import ContractStatus

# Categories
class ContractCategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None

class ContractCategoryResponse(BaseModel):
    id: uuid.UUID
    name: str
    description: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Templates
class ContractTemplateCreate(BaseModel):
    category_id: Optional[uuid.UUID] = None
    template_name: str
    template_content: str
    is_active: Optional[bool] = True

class ContractTemplateUpdate(BaseModel):
    category_id: Optional[uuid.UUID] = None
    template_name: Optional[str] = None
    template_content: Optional[str] = None
    version: Optional[int] = None
    is_active: Optional[bool] = None

class ContractTemplateResponse(BaseModel):
    id: uuid.UUID
    company_id: uuid.UUID
    category_id: Optional[uuid.UUID] = None
    template_name: str
    template_content: str
    version: int
    is_active: bool
    created_by: Optional[uuid.UUID] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Contracts
class ContractCreate(BaseModel):
    company_id: Optional[uuid.UUID] = None
    template_id: Optional[uuid.UUID] = None
    title: str
    purpose: Optional[str] = None
    generated_content: str
    ai_summary: Optional[str] = None
    risk_score: Optional[float] = None
    status: Optional[ContractStatus] = ContractStatus.DRAFT

class ContractUpdate(BaseModel):
    title: Optional[str] = None
    purpose: Optional[str] = None
    generated_content: Optional[str] = None
    ai_summary: Optional[str] = None
    risk_score: Optional[float] = None
    status: Optional[ContractStatus] = None

class ContractResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    company_id: Optional[uuid.UUID] = None
    template_id: Optional[uuid.UUID] = None
    title: str
    purpose: Optional[str] = None
    generated_content: str
    ai_summary: Optional[str] = None
    risk_score: Optional[float] = None
    status: ContractStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Versions
class ContractVersionResponse(BaseModel):
    id: uuid.UUID
    contract_id: uuid.UUID
    version: int
    content: str
    created_by: Optional[uuid.UUID] = None
    created_at: datetime

    class Config:
        from_attributes = True

# AI Schemas
class ContractGenerateAIRequest(BaseModel):
    template_id: Optional[uuid.UUID] = None
    purpose: str = Field(..., description="E.g. employment, nda, freelancing")
    variables: Dict[str, str] = Field(default_factory=dict, description="Key-value mapping of placeholders to replacement strings")
    extra_instructions: Optional[str] = None

class ContractSummarizeRequest(BaseModel):
    contract_id: Optional[uuid.UUID] = None
    content: Optional[str] = None

class ContractImproveRequest(BaseModel):
    contract_id: Optional[uuid.UUID] = None
    content: Optional[str] = None
    focus_area: str = Field(..., description="E.g. strictness, clarity, indemnity risk")

class RiskClause(BaseModel):
    clause: str
    severity: str # 'Low', 'Medium', 'High'
    description: str
    mitigation: str

class ContractRiskAnalysisResponse(BaseModel):
    overall_score: float
    risk_clauses: List[RiskClause]
    summary: str

class ClauseGeneratorRequest(BaseModel):
    purpose: str
    clause_type: str # E.g. 'indemnity', 'termination'
    context: Optional[str] = None

class RewriteClauseRequest(BaseModel):
    clause_text: str
    tone: str # E.g. 'more developer friendly', 'strict employer friendly'

class ClauseResponse(BaseModel):
    text: str

class AIChatRequest(BaseModel):
    contract_id: uuid.UUID
    message: str

class AIChatResponse(BaseModel):
    reply: str
    timestamp: datetime
