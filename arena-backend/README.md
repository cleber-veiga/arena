# Arena Backend (FastAPI + Neon PostgreSQL)

Backend inicial em FastAPI pronto para usar Neon PostgreSQL.

## 1) Criar ambiente virtual

```bash
python -m venv .venv
source .venv/bin/activate  # Linux/macOS
# .venv\\Scripts\\activate   # Windows (PowerShell)
```

## 2) Instalar dependências

```bash
pip install -r requirements.txt
```

Ou usando Make:

```bash
make install
```

## 3) Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` e preencha `DATABASE_URL` com sua conexão Neon.

Formato recomendado:

```env
DATABASE_URL=postgresql+asyncpg://USER:PASSWORD@HOST/DB_NAME?sslmode=require
```

## 4) Rodar aplicação

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Ou usando Make:

```bash
make dev
```

## 5) Endpoints úteis

- `GET /` -> status básico
- `GET /health` -> valida conexão com o banco
- `GET /docs` -> documentação Swagger

## 6) Migrações com Alembic

```bash
make alembic-init
make db-revision MSG="create users table"
make db-up
make db-down
```
