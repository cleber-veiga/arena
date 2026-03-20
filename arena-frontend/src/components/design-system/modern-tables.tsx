"use client"

import { useMemo, useState } from "react"
import { Eye, Pencil, Trash2 } from "lucide-react"

import { ModernEntityTable } from "@/components/tables/modern-entity-table"
import { Button } from "@/components/ui/button"

type DemoContact = {
  id: number
  nome: string
  documento: string
  cidade: string
  uf: string
  endereco: string
}

const demoRows: DemoContact[] = [
  {
    id: 1,
    nome: "Ana Martins",
    documento: "123.456.789-10",
    cidade: "Sao Paulo",
    uf: "SP",
    endereco: "Rua A, 120",
  },
  {
    id: 2,
    nome: "Carlos Souza",
    documento: "-",
    cidade: "Rio de Janeiro",
    uf: "RJ",
    endereco: "Av. Central, 45",
  },
  {
    id: 3,
    nome: "Fernanda Lima",
    documento: "987.654.321-00",
    cidade: "Belo Horizonte",
    uf: "MG",
    endereco: "Rua das Flores, 88",
  },
]

export function ModernTablesSection() {
  const [filter, setFilter] = useState("")
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const filteredRows = useMemo(() => {
    const normalized = filter.trim().toLowerCase()
    if (!normalized) return demoRows
    return demoRows.filter((row) =>
      [row.nome, row.documento, row.cidade, row.uf, row.endereco]
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    )
  }, [filter])

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage))
  const safePage = Math.min(page, totalPages)
  const pageRows = filteredRows.slice(
    (safePage - 1) * rowsPerPage,
    safePage * rowsPerPage
  )

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Modern Tables</h1>
      <p className="max-w-2xl text-muted-foreground">
        Proposta de tabela moderna para entidades cadastrais com legibilidade de
        linhas/colunas e acoes por registro.
      </p>

      <ModernEntityTable
        title="Tabela moderna com acoes"
        description="Exemplo de listagem com divisao clara de colunas, zebra rows e toolbar."
        addButtonLabel="Adicionar novo"
        filterPlaceholder="Buscar por nome, cidade ou documento"
        filterValue={filter}
        onFilterValueChange={(value) => {
          setFilter(value)
          setPage(1)
        }}
        onAddNew={() => undefined}
        rows={pageRows}
        rowKey={(row) => row.id}
        columns={[
          {
            key: "nome",
            header: "Nome",
            className: "font-medium",
            cell: (row) => row.nome,
          },
          { key: "documento", header: "Documento", cell: (row) => row.documento },
          { key: "cidade", header: "Cidade", cell: (row) => row.cidade },
          { key: "uf", header: "UF", className: "w-16", cell: (row) => row.uf },
          { key: "endereco", header: "Endereco", cell: (row) => row.endereco },
          {
            key: "acoes",
            header: "Acoes",
            className: "w-28 text-right",
            cell: () => (
              <div className="flex items-center justify-end gap-1">
                <Button type="button" variant="ghost" size="icon-sm">
                  <Eye className="size-4" />
                </Button>
                <Button type="button" variant="ghost" size="icon-sm">
                  <Pencil className="size-4" />
                </Button>
                <Button type="button" variant="ghost" size="icon-sm" className="text-destructive">
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ),
          },
        ]}
        page={safePage}
        rowsPerPage={rowsPerPage}
        totalItems={filteredRows.length}
        totalPages={totalPages}
        onRowsPerPageChange={(size) => {
          setRowsPerPage(size)
          setPage(1)
        }}
        onPageChange={setPage}
        onPrevPage={() => setPage((current) => Math.max(1, current - 1))}
        onNextPage={() => setPage((current) => Math.min(totalPages, current + 1))}
        emptyMessage="Nenhum registro encontrado."
      />
    </div>
  )
}
