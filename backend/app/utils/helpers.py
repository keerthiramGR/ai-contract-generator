from datetime import datetime, timezone
import uuid

def get_utc_now() -> datetime:
    """Returns current datetime in UTC timezone."""
    return datetime.now(timezone.utc)

def format_date(dt: datetime, fmt: str = "%Y-%m-%d %H:%M:%S") -> str:
    """Formats a datetime object to a string format."""
    return dt.strftime(fmt) if dt else ""

def generate_uuid_str() -> str:
    """Generates a secure uuid4 string."""
    return str(uuid.uuid4())
