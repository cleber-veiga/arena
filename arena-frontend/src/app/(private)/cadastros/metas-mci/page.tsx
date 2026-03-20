"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { CirclePlus, Pencil, Plus, Search, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { projectTemplates } from "@/lib/template-data"

const mciSnapshotById: Record<
  string,
  {
    isActive: boolean
    progress: number
    dueDate: string
  }
> = {
  "residential-renovation": { isActive: true, progress: 38, dueDate: "2026-06-29" },
  "commercial-interior": { isActive: true, progress: 62, dueDate: "2026-05-20" },
  "landscape-design": { isActive: false, progress: 15, dueDate: "2026-07-10" },
  "sustainable-housing": { isActive: true, progress: 80, dueDate: "2026-04-30" },
}

function formatDateBr(dateInput: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${dateInput}T00:00:00`))
}

function getDaysToDueDate(dateInput: string) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const dueDate = new Date(`${dateInput}T00:00:00`)
  const msPerDay = 24 * 60 * 60 * 1000

  return Math.ceil((dueDate.getTime() - today.getTime()) / msPerDay)
}

export default function CadastroMetasMciPage() {
  const [query, setQuery] = useState("")

  const filteredTemplates = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return projectTemplates.filter((template) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        `${template.title} ${template.description} ${template.category}`
          .toLowerCase()
          .includes(normalizedQuery)

      return matchesQuery
    })
  }, [query])

  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-[linear-gradient(180deg,rgba(30,58,138,0.08)_0%,rgba(30,64,175,0.02)_100%)] p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-semibold tracking-tight">Metas (MCI)</h1>
            <p className="text-sm text-muted-foreground">
              Gerencie as metas MCI cadastradas no escritorio.
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
            <div className="relative w-full sm:min-w-64">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar MCIs..."
                className="pl-8"
              />
            </div>
            <Button type="button" className="sm:shrink-0" asChild>
              <Link href="/cadastros/metas-mci/novo">
                <Plus className="size-4" />
                Cadastrar MCI
              </Link>
            </Button>
          </div>
        </div>

      </section>

      <section className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredTemplates.map((template) => {
          const snapshot = mciSnapshotById[template.id] ?? {
            isActive: false,
            progress: 0,
            dueDate: "2026-12-31",
          }
          const daysRemaining = getDaysToDueDate(snapshot.dueDate)
          const deadlineLabel =
            daysRemaining >= 0 ? `${daysRemaining} dias` : `${Math.abs(daysRemaining)} dias atrasada`

          return (
            <article
              key={template.id}
              className="min-h-[220px] rounded-xl border bg-card p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={
                    snapshot.isActive
                      ? "inline-flex rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-700"
                      : "inline-flex rounded-full border border-zinc-300 bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600"
                  }
                >
                  {snapshot.isActive ? "Ativa" : "Inativa"}
                </span>

                <div className="inline-flex items-center rounded-md border bg-background p-0.5">
                  <Button type="button" variant="ghost" size="icon-sm" aria-label="Editar MCI" asChild>
                    <Link href={`/cadastros/metas-mci/${template.id}/editar`}>
                      <Pencil className="size-4" />
                    </Link>
                  </Button>
                  <Button type="button" variant="ghost" size="icon-sm" aria-label="Remover MCI">
                    <Trash2 className="size-4 text-red-500" />
                  </Button>
                </div>
              </div>

              <div className="mt-3 space-y-4">
                <h2 className="text-xl font-semibold leading-tight">{template.title}</h2>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-red-600">{snapshot.progress}%</p>
                  <div className="h-2 overflow-hidden rounded-full bg-zinc-200">
                    <div
                      className="h-full rounded-full bg-red-500 transition-all"
                      style={{ width: `${snapshot.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
                  <p>Prazo: {formatDateBr(snapshot.dueDate)}</p>
                  <p>{deadlineLabel}</p>
                </div>
              </div>
            </article>
          )
        })}

        <article className="flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-muted/20 p-6 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CirclePlus className="size-6" />
          </span>
          <h3 className="text-lg font-semibold">Nova meta MCI</h3>
          <p className="max-w-60 text-sm text-muted-foreground">
            Comece com uma MCI em branco e monte seu proprio fluxo.
          </p>
          <Button type="button" variant="outline" asChild>
            <Link href="/cadastros/metas-mci/novo">Cadastrar MCI</Link>
          </Button>
        </article>
      </section>
    </div>
  )
}
