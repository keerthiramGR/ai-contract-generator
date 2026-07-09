from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.security import get_password_hash, verify_password, create_access_token
from app.models.profile import Profile, UserRole
from app.schemas.auth import UserCreate, UserLogin, PasswordChange
from app.models.activity import ActivityLog
import uuid

class AuthService:
    @staticmethod
    async def create_user(db: AsyncSession, user_in: UserCreate) -> Profile:
        """Register a new user profile."""
        # Check if email already registered
        result = await db.execute(select(Profile).where(Profile.email == user_in.email))
        existing_profile = result.scalar_one_or_none()
        if existing_profile:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email address already registered."
            )
            
        hashed_password = get_password_hash(user_in.password)
        db_user = Profile(
            email=user_in.email,
            full_name=user_in.full_name,
            password_hash=hashed_password,
            phone_number=user_in.phone_number,
            country=user_in.country,
            state=user_in.state,
            city=user_in.city,
            role=UserRole.USER  # Default role
        )
        
        db.add(db_user)
        await db.flush()
        
        # Log activity
        log = ActivityLog(
            user_id=db_user.id,
            action="SIGNUP",
            module="AUTH"
        )
        db.add(log)
        
        await db.commit()
        await db.refresh(db_user)
        return db_user

    @staticmethod
    async def authenticate(db: AsyncSession, login_data: UserLogin) -> Profile:
        """Authenticate user credentials."""
        result = await db.execute(select(Profile).where(Profile.email == login_data.email))
        profile = result.scalar_one_or_none()
        if not profile or not profile.password_hash:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password."
            )
            
        if not verify_password(login_data.password, profile.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password."
            )
            
        # Log activity
        log = ActivityLog(
            user_id=profile.id,
            action="LOGIN",
            module="AUTH"
        )
        db.add(log)
        await db.commit()
        
        return profile

    @staticmethod
    async def change_password(db: AsyncSession, user_id: uuid.UUID, data: PasswordChange) -> bool:
        """Update password for logged-in user."""
        result = await db.execute(select(Profile).where(Profile.id == user_id))
        profile = result.scalar_one_or_none()
        if not profile or not profile.password_hash:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User profile not found."
            )
            
        if not verify_password(data.old_password, profile.password_hash):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Incorrect old password."
            )
            
        profile.password_hash = get_password_hash(data.new_password)
        
        # Log activity
        log = ActivityLog(
            user_id=profile.id,
            action="PASSWORD_CHANGE",
            module="AUTH"
        )
        db.add(log)
        
        await db.commit()
        return True
