from datetime import datetime, timedelta, timezone
from typing import Any, Union
from jose import jwt, JWTError
import bcrypt
from app.core.config import settings

ALGORITHM = "HS256"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain text password against its hash."""
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"), 
            hashed_password.encode("utf-8")
        )
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    """Hashes a plain text password using bcrypt."""
    return bcrypt.hashpw(
        password.encode("utf-8"), 
        bcrypt.gensalt()
    ).decode("utf-8")

def create_access_token(
    subject: Union[str, Any], expires_delta: Union[timedelta, None] = None
) -> str:
    """Generates a secure JWT access token."""
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_token(token: str) -> Union[dict, None]:
    """Decodes a JWT access token, returning its claims or None if invalid."""
    try:
        decoded_token = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[ALGORITHM]
        )
        return decoded_token
    except JWTError:
        return None
