import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class NotificationCreate(BaseModel):
    user_id: uuid.UUID
    title: str
    description: Optional[str] = None
    notification_type: Optional[str] = None

class NotificationUpdate(BaseModel):
    is_read: bool

class NotificationResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    title: str
    description: Optional[str] = None
    notification_type: Optional[str] = None
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True
