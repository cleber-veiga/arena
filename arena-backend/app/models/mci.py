import enum
from datetime import date
from decimal import Decimal

from sqlalchemy import Date, Enum, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class TipoMedicao(str, enum.Enum):
    VALOR = "Valor"
    PERCENTUAL = "Percentual"
    QUANTIDADE = "Quantidade"


class MCI(Base):
    __tablename__ = "mcis"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    titulo: Mapped[str] = mapped_column(String(255), nullable=False)
    descricao: Mapped[str] = mapped_column(Text, nullable=False)
    tipo_medicao: Mapped[TipoMedicao] = mapped_column(
        Enum(TipoMedicao, name="tipo_medicao_enum"),
        nullable=False,
    )
    atributo_inicial: Mapped[Decimal] = mapped_column(Numeric(18, 4), nullable=False)
    atributo_final: Mapped[Decimal] = mapped_column(Numeric(18, 4), nullable=False)
    prazo_execucao: Mapped[date] = mapped_column(Date, nullable=False)
