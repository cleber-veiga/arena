from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.auth_routes import router as auth_router
from app.api.mci_routes import router as mci_router
from app.db.session import get_db

router = APIRouter()
router.include_router(auth_router)
router.include_router(mci_router)


@router.get("/health", tags=["health"])
async def health_check(db: AsyncSession = Depends(get_db)) -> dict:
    try:
        result = await db.execute(text("SELECT 1"))
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    db_ok = result.scalar_one() == 1
    return {"status": "ok", "database": "connected" if db_ok else "disconnected"}
