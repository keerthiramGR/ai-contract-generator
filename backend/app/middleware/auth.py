from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.security import decode_token
from app.core.database import SessionLocal
from app.models.profile import Profile
from sqlalchemy import select

class AuthenticationMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        """Binds authenticated user metadata to request.state.user if Bearer token is present."""
        authorization: str | None = request.headers.get("Authorization")
        request.state.user = None
        
        if authorization and authorization.startswith("Bearer "):
            token = authorization.split(" ")[1]
            payload = decode_token(token)
            if payload:
                user_id = payload.get("sub")
                if user_id:
                    request.state.user = {"id": user_id}
                            
        response = await call_next(request)
        return response
