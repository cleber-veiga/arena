from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import get_settings

_engine = None
_sessionmaker = None


def _get_sessionmaker() -> async_sessionmaker[AsyncSession]:
    global _engine, _sessionmaker

    if _sessionmaker is not None:
        return _sessionmaker

    settings = get_settings()
    if not settings.database_url:
        raise RuntimeError("DATABASE_URL nao configurada. Defina no arquivo .env.")

    _engine = create_async_engine(
        settings.database_url,
        echo=settings.app_debug,
        pool_pre_ping=True,
    )
    _sessionmaker = async_sessionmaker(
        bind=_engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )
    return _sessionmaker


async def get_db() -> AsyncSession:
    sessionmaker = _get_sessionmaker()
    async with sessionmaker() as session:
        yield session
