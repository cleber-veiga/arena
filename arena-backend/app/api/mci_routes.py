from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.mci import MCI
from app.schemas.mci import MCICreate, MCIBase, MCIResponse, MCIUpdate

router = APIRouter(prefix="/mcis", tags=["mcis"])


@router.post("", response_model=MCIResponse, status_code=status.HTTP_201_CREATED)
async def create_mci(payload: MCICreate, db: AsyncSession = Depends(get_db)) -> MCI:
    mci = MCI(**payload.model_dump())
    db.add(mci)
    await db.commit()
    await db.refresh(mci)
    return mci


@router.get("", response_model=list[MCIResponse])
async def list_mcis(db: AsyncSession = Depends(get_db)) -> list[MCI]:
    result = await db.execute(select(MCI).order_by(MCI.id.asc()))
    return list(result.scalars().all())


@router.get("/{mci_id}", response_model=MCIResponse)
async def get_mci(mci_id: int, db: AsyncSession = Depends(get_db)) -> MCI:
    mci = await db.get(MCI, mci_id)
    if not mci:
        raise HTTPException(status_code=404, detail="MCI nao encontrada")
    return mci


@router.put("/{mci_id}", response_model=MCIResponse)
async def update_mci(
    mci_id: int,
    payload: MCIUpdate,
    db: AsyncSession = Depends(get_db),
) -> MCI:
    mci = await db.get(MCI, mci_id)
    if not mci:
        raise HTTPException(status_code=404, detail="MCI nao encontrada")

    update_data = payload.model_dump(exclude_unset=True)

    merged_payload = MCIBase(
        titulo=update_data.get("titulo", mci.titulo),
        descricao=update_data.get("descricao", mci.descricao),
        tipo_medicao=update_data.get("tipo_medicao", mci.tipo_medicao),
        atributo_inicial=update_data.get("atributo_inicial", mci.atributo_inicial),
        atributo_final=update_data.get("atributo_final", mci.atributo_final),
        prazo_execucao=update_data.get("prazo_execucao", mci.prazo_execucao),
    )

    update_data = merged_payload.model_dump()
    for field, value in update_data.items():
        setattr(mci, field, value)

    await db.commit()
    await db.refresh(mci)
    return mci


@router.delete("/{mci_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_mci(mci_id: int, db: AsyncSession = Depends(get_db)) -> None:
    mci = await db.get(MCI, mci_id)
    if not mci:
        raise HTTPException(status_code=404, detail="MCI nao encontrada")

    await db.delete(mci)
    await db.commit()
