from datetime import date
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

from app.models.mci import TipoMedicao


class MCIBase(BaseModel):
    titulo: str = Field(min_length=1, max_length=255)
    descricao: str = Field(min_length=1)
    tipo_medicao: TipoMedicao
    atributo_inicial: Decimal
    atributo_final: Decimal
    prazo_execucao: date

    @field_validator("atributo_inicial", "atributo_final")
    @classmethod
    def validate_valor_nao_negativo(cls, value: Decimal) -> Decimal:
        if value < 0:
            raise ValueError("atributos nao podem ser negativos")
        return value

    @model_validator(mode="after")
    def validate_regras_tipo(self) -> "MCIBase":
        if self.atributo_final < self.atributo_inicial:
            raise ValueError("atributo_final deve ser maior ou igual ao atributo_inicial")

        if self.tipo_medicao == TipoMedicao.QUANTIDADE:
            if self.atributo_inicial % 1 != 0 or self.atributo_final % 1 != 0:
                raise ValueError("para tipo Quantidade, atributos devem ser inteiros")

        if self.tipo_medicao == TipoMedicao.PERCENTUAL:
            if self.atributo_inicial > 100 or self.atributo_final > 100:
                raise ValueError("para tipo Percentual, atributos devem estar entre 0 e 100")

        return self


class MCICreate(MCIBase):
    pass


class MCIUpdate(BaseModel):
    titulo: str | None = Field(default=None, min_length=1, max_length=255)
    descricao: str | None = Field(default=None, min_length=1)
    tipo_medicao: TipoMedicao | None = None
    atributo_inicial: Decimal | None = None
    atributo_final: Decimal | None = None
    prazo_execucao: date | None = None


class MCIResponse(MCIBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
