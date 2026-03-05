"""SQLAlchemy async engine, session factory, and declarative Base."""

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.config import settings


# ── Normalise the DATABASE_URL for asyncpg ────────────────────
def _normalize_url(url: str) -> str:
    """Ensure the URL uses the asyncpg driver and asyncpg-compatible params."""
    # Fix driver prefix
    if url.startswith("postgresql://"):
        url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
    # asyncpg uses 'ssl' instead of 'sslmode'
    url = url.replace("sslmode=", "ssl=")
    # asyncpg does not support channel_binding
    url = url.replace("&channel_binding=require", "")
    url = url.replace("?channel_binding=require&", "?")
    url = url.replace("?channel_binding=require", "")
    return url


_db_url = _normalize_url(settings.database_url)

# ── Engine ────────────────────────────────────────────────────
engine = create_async_engine(
    _db_url,
    echo=(settings.app_env == "development"),
    future=True,
)

# ── Session factory ───────────────────────────────────────────
async_session = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


# ── Base class ────────────────────────────────────────────────
class Base(DeclarativeBase):
    """Base class for all ORM models."""
    pass


# ── Dependency ────────────────────────────────────────────────
async def get_db() -> AsyncSession:
    """FastAPI dependency that yields an async database session."""
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
