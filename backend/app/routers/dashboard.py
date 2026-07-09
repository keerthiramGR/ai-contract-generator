from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services.analytics_service import AnalyticsService
from app.core.auth import get_current_user
from app.models.profile import Profile, UserRole
from typing import Dict, Any

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("", response_model=Dict[str, Any])
async def get_dashboard_data(
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve summarized contract data and activity logs for dashboards."""
    company_id = None
    if current_user.role != UserRole.SUPER_ADMIN:
        company_id = current_user.company_id
        
    return await AnalyticsService.get_dashboard_stats(db, company_id)
