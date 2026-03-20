"""create mcis table

Revision ID: 20260320_1707
Revises:
Create Date: 2026-03-20 17:07:00
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision: str = "20260320_1707"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    tipo_medicao_enum = postgresql.ENUM(
        "Valor",
        "Percentual",
        "Quantidade",
        name="tipo_medicao_enum",
        create_type=False,
    )
    tipo_medicao_enum.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "mcis",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("titulo", sa.String(length=255), nullable=False),
        sa.Column("descricao", sa.Text(), nullable=False),
        sa.Column("tipo_medicao", tipo_medicao_enum, nullable=False),
        sa.Column("atributo_inicial", sa.Numeric(18, 4), nullable=False),
        sa.Column("atributo_final", sa.Numeric(18, 4), nullable=False),
        sa.Column("prazo_execucao", sa.Date(), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("mcis")

    tipo_medicao_enum = postgresql.ENUM(
        "Valor",
        "Percentual",
        "Quantidade",
        name="tipo_medicao_enum",
    )

    tipo_medicao_enum.drop(op.get_bind(), checkfirst=True)
