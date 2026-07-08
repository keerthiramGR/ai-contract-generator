from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.models.notification import Notification
from app.schemas.notification import NotificationCreate
from typing import List, Optional
import uuid

class NotificationService:
    @staticmethod
    async def create_notification(
        db: AsyncSession, 
        user_id: uuid.UUID, 
        title: str, 
        description: Optional[str] = None, 
        notification_type: Optional[str] = None
    ) -> Notification:
        """Create a notification in the database."""
        notif = Notification(
            user_id=user_id,
            title=title,
            description=description,
            notification_type=notification_type,
            is_read=False
        )
        db.add(notif)
        await db.flush()
        
        # Trigger email in background if needed (can be integrated with email service)
        from app.services.email_service import EmailService
        await EmailService.send_notification_email_async(
            email="user-placeholder@example.com",  # Email service should fetch actual user email if needed
            title=title,
            message=description or ""
        )
        
        return notif

    @staticmethod
    async def get_user_notifications(db: AsyncSession, user_id: uuid.UUID, limit: int = 50) -> List[Notification]:
        """Fetch notifications for a specific user profile."""
        result = await db.execute(
            select(Notification)
            .where(Notification.user_id == user_id)
            .order_by(desc(Notification.created_at))
            .limit(limit)
        )
        return list(result.scalars().all())

    @staticmethod
    async def mark_as_read(db: AsyncSession, user_id: uuid.UUID, notification_id: uuid.UUID) -> Notification | None:
        """Mark a notification as read."""
        result = await db.execute(
            select(Notification)
            .where(Notification.id == notification_id, Notification.user_id == user_id)
        )
        notif = result.scalar_one_or_none()
        if notif:
            notif.is_read = True
            await db.commit()
        return notif

    @staticmethod
    async def mark_all_as_read(db: AsyncSession, user_id: uuid.UUID) -> bool:
        """Mark all unread notifications for a user as read."""
        result = await db.execute(
            select(Notification)
            .where(Notification.user_id == user_id, Notification.is_read == False)
        )
        unread_notifs = result.scalars().all()
        for notif in unread_notifs:
            notif.is_read = True
        await db.commit()
        return True
