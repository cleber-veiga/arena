"use client"

import { Plus, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type PreferencesDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type ProjectType = {
  id: string
  description: string
  color: string
}

const PROJECT_TYPES_STORAGE_KEY = "prumo.project-types"
const DEFAULT_COLOR = "#1f8ef1"

function createProjectType(description: string, color: string): ProjectType {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    description,
    color,
  }
}

export function PreferencesDialog({ open, onOpenChange }: PreferencesDialogProps) {
  const [projectTypes, setProjectTypes] = useState<ProjectType[]>(() => {
    if (typeof window === "undefined") {
      return []
    }

    const storedProjectTypes = window.localStorage.getItem(PROJECT_TYPES_STORAGE_KEY)
    if (!storedProjectTypes) {
      return []
    }

    try {
      const parsedProjectTypes = JSON.parse(storedProjectTypes) as ProjectType[]
      return Array.isArray(parsedProjectTypes) ? parsedProjectTypes : []
    } catch {
      return []
    }
  })
  const [description, setDescription] = useState("")
  const [color, setColor] = useState(DEFAULT_COLOR)

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    window.localStorage.setItem(PROJECT_TYPES_STORAGE_KEY, JSON.stringify(projectTypes))
  }, [projectTypes])

  const canAddProjectType = description.trim().length > 1

  const handleAddProjectType = () => {
    const cleanDescription = description.trim()
    if (cleanDescription.length <= 1) {
      return
    }

    setProjectTypes((currentTypes) => [
      ...currentTypes,
      createProjectType(cleanDescription, color),
    ])
    setDescription("")
    setColor(DEFAULT_COLOR)
  }

  const handleRemoveProjectType = (id: string) => {
    setProjectTypes((currentTypes) =>
      currentTypes.filter((projectType) => projectType.id !== id)
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Preferencias</DialogTitle>
          <DialogDescription>
            Defina configuracoes do seu ambiente. A primeira configuracao disponivel
            sao os tipos de projeto.
          </DialogDescription>
        </DialogHeader>

        <section className="space-y-3">
          <div>
            <h3 className="text-sm font-medium">Tipos de projeto</h3>
            <p className="text-sm text-muted-foreground">
              Crie tipos para organizar projetos por categoria.
            </p>
          </div>

          <div className="rounded-lg border bg-muted/20 p-3">
            <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
              <div className="space-y-1.5">
                <Label htmlFor="project-type-description">Descricao</Label>
                <Input
                  id="project-type-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Ex.: Comercial, Residencial..."
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="project-type-color">Cor</Label>
                <Input
                  id="project-type-color"
                  type="color"
                  className="w-16 p-1"
                  value={color}
                  onChange={(event) => setColor(event.target.value)}
                />
              </div>

              <div className="flex items-end">
                <Button
                  type="button"
                  onClick={handleAddProjectType}
                  disabled={!canAddProjectType}
                >
                  <Plus className="size-4" />
                  Adicionar
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {projectTypes.length === 0 ? (
              <p className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
                Nenhum tipo cadastrado ainda.
              </p>
            ) : (
              projectTypes.map((projectType) => (
                <div
                  key={projectType.id}
                  className="flex items-center justify-between rounded-lg border p-2.5"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className="size-3 shrink-0 rounded-full border"
                      style={{ backgroundColor: projectType.color }}
                    />
                    <span className="truncate text-sm">{projectType.description}</span>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleRemoveProjectType(projectType.id)}
                    aria-label={`Remover tipo ${projectType.description}`}
                  >
                    <Trash2 className="size-4 text-muted-foreground" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </section>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
