from app.routers.auth import router as auth_router
from app.routers.companies import router as companies_router
from app.routers.contracts import router as contracts_router
from app.routers.approvals import router as approvals_router
from app.routers.dashboard import router as dashboard_router
from app.routers.uploads import router as uploads_router
from app.routers.notifications import router as notifications_router
from app.routers.ai import router as ai_router
from app.routers.users import router as users_router

__all__ = [
    "auth_router",
    "companies_router",
    "contracts_router",
    "approvals_router",
    "dashboard_router",
    "uploads_router",
    "notifications_router",
    "ai_router",
    "users_router",
]
