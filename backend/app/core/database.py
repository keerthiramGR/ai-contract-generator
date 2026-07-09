from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from app.core.config import settings

# SQLite connection args configuration
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_async_engine(
    settings.DATABASE_URL, 
    connect_args=connect_args, 
    echo=False
)

SessionLocal = async_sessionmaker(
    bind=engine, 
    class_=AsyncSession, 
    autocommit=False, 
    autoflush=False,
    expire_on_commit=False
)

class Base(DeclarativeBase):
    pass

async def get_db():
    """Dependency injection helper for database session."""
    async with SessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
