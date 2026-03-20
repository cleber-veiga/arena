BASE_PYTHON ?= python
DEFAULT_VENV := $(if $(wildcard .venv),.venv,$(if $(wildcard venv),venv,.venv))
VENV ?= $(DEFAULT_VENV)
VENV_CFG := $(VENV)/pyvenv.cfg

ifeq ($(OS),Windows_NT)
VENV_PYTHON ?= $(VENV)/Scripts/python.exe
else
VENV_PYTHON ?= $(VENV)/bin/python
endif

PYTHON ?= $(VENV_PYTHON)
PIP ?= $(PYTHON) -m pip
UVICORN ?= $(PYTHON) -m uvicorn
ALEMBIC ?= alembic
APP_MODULE ?= app.main:app
HOST ?= 0.0.0.0
PORT ?= 8000
MSG ?= "update migration"

.PHONY: help venv install run dev alembic-init db-revision db-up db-down

help:
	@echo "Targets disponiveis:"
	@echo "  make venv          -> cria ambiente virtual ($(VENV))"
	@echo "  make install       -> instala dependencias"
	@echo "  make run           -> sobe API (sem reload)"
	@echo "  make dev           -> sobe API com --reload"
	@echo "  make alembic-init  -> inicializa estrutura Alembic em ./migrations"
	@echo "  make db-revision MSG='descricao' -> cria migration"
	@echo "  make db-up         -> aplica migracoes (upgrade head)"
	@echo "  make db-down       -> desfaz ultima migration (downgrade -1)"

$(VENV_CFG):
	$(BASE_PYTHON) -m venv $(VENV)

venv: $(VENV_CFG)

install: venv
	$(PIP) install -r requirements.txt

run: venv
	$(UVICORN) $(APP_MODULE) --host $(HOST) --port $(PORT)

dev: venv
	$(UVICORN) $(APP_MODULE) --reload --host $(HOST) --port $(PORT)

alembic-init: venv
	$(ALEMBIC) init migrations

db-revision: venv
	$(ALEMBIC) revision --autogenerate -m $(MSG)

db-up: venv
	$(ALEMBIC) upgrade head

db-down: venv
	$(ALEMBIC) downgrade -1
