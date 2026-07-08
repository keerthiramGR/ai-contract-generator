from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.core.database import Base, engine
from app.routers import (
    auth_router,
    companies_router,
    contracts_router,
    approvals_router,
    dashboard_router,
    uploads_router,
    notifications_router,
    ai_router,
    users_router,
)
from app.middleware import AuthenticationMiddleware, RequestLoggingMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle events manager handling SQLite bootstrapping or startup operations."""
    # Automatically create tables if they do not exist
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom context / logging middlewares
app.add_middleware(AuthenticationMiddleware)
app.add_middleware(RequestLoggingMiddleware)

# Include all API v1 routes
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(companies_router, prefix=settings.API_V1_STR)
app.include_router(contracts_router, prefix=settings.API_V1_STR)
app.include_router(approvals_router, prefix=settings.API_V1_STR)
app.include_router(dashboard_router, prefix=settings.API_V1_STR)
app.include_router(uploads_router, prefix=settings.API_V1_STR)
app.include_router(notifications_router, prefix=settings.API_V1_STR)
app.include_router(ai_router, prefix=settings.API_V1_STR)
app.include_router(users_router, prefix=settings.API_V1_STR)

@app.get("/", tags=["Health Check"])
def read_root():
    """Service status health check landing endpoint."""
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME
    }
