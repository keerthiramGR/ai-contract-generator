from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.security import create_access_token
from app.schemas.auth import UserCreate, UserResponse, Token, PasswordChange, UserLogin
from app.services.auth_service import AuthService
from app.core.auth import get_current_user
from app.models.profile import Profile

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    """Registers a new user profile."""
    return await AuthService.create_user(db, user_in)

@router.post("/login", response_model=Token)
async def login(login_data: UserLogin, db: AsyncSession = Depends(get_db)):
    """Authenticates credentials and issues a JWT token."""
    user = await AuthService.authenticate(db, login_data)
    access_token = create_access_token(subject=user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/login-swagger", include_in_schema=False)
async def login_swagger(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: AsyncSession = Depends(get_db)
):
    """Sub-endpoint to handle Swagger UI OAuth2 password flow logins."""
    login_data = UserLogin(email=form_data.username, password=form_data.password)
    user = await AuthService.authenticate(db, login_data)
    access_token = create_access_token(subject=user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.post("/change-password")
async def change_password(
    data: PasswordChange, 
    current_user: Profile = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    """Update current user password."""
    await AuthService.change_password(db, current_user.id, data)
    return {"message": "Password changed successfully."}
