from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from app.core.config import settings
from app.core.logger import logger
from typing import List

# Setup configuration
conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME or "",
    MAIL_PASSWORD=settings.MAIL_PASSWORD or "",
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_STARTTLS=settings.MAIL_STARTTLS,
    MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
    USE_CREDENTIALS=True if settings.MAIL_USERNAME else False
)

class EmailService:
    @staticmethod
    async def send_email(recipients: List[str], subject: str, body: str):
        """Send a plain text email to a list of recipients."""
        if settings.USE_MOCK_EMAIL or not settings.MAIL_USERNAME:
            logger.info(f"[MOCK EMAIL] TO: {recipients} | SUBJECT: {subject} | BODY: {body}")
            return True

        message = MessageSchema(
            subject=subject,
            recipients=recipients,
            body=body,
            subtype=MessageType.plain
        )
        fm = FastMail(conf)
        try:
            await fm.send_message(message)
            logger.info(f"Email sent successfully to {recipients}")
            return True
        except Exception as e:
            logger.error(f"Failed to send email to {recipients}: {str(e)}")
            return False

    @staticmethod
    async def send_notification_email_async(email: str, title: str, message: str):
        """Asynchronously send notification email to a single user."""
        subject = f"ContractAI: {title}"
        body = f"Hello,\n\nYou have received a new notification on ContractAI:\n\n{title}\n{message}\n\nBest regards,\nContractAI Team"
        await EmailService.send_email([email], subject, body)
