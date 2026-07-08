import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class SignatureCreate(BaseModel):
    contract_id: uuid.UUID
    signature_image: str  # Base64 string or URL
    signature_type: str   # 'draw', 'type', 'upload'

class SignatureResponse(BaseModel):
    id: uuid.UUID
    contract_id: uuid.UUID
    signed_by: uuid.UUID
    signature_image: Optional[str] = None
    signature_type: Optional[str] = None
    signed_at: datetime

    class Config:
        from_attributes = True
