from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.notification import NotificationResponse
from app.services.notification_service import NotificationService
from app.core.auth import get_current_user
from app.models.profile import Profile
import uuid
from typing import List

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("", response_model=List[NotificationResponse])
async def get_my_notifications(
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve notifications for the authenticated user profile."""
    return await NotificationService.get_user_notifications(db, current_user.id)

@router.put("/{notification_id}/read", response_model=NotificationResponse)
async def mark_as_read(
    notification_id: uuid.UUID,
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Marks a single notification as read."""
    notif = await NotificationService.mark_as_read(db, current_user.id, notification_id)
    if not notif:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Notification not found"
        )
    return notif

@router.put("/read-all")
async def mark_all_read(
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Marks all unread notifications for the user as read."""
    await NotificationService.mark_all_as_read(db, current_user.id)
    return {"message": "All notifications marked as read."}
