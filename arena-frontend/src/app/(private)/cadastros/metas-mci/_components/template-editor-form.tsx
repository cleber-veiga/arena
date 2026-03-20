"use client"

import { FormEvent, useMemo, useState } from "react"
import Link from "next/link"
import {
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  CirclePlus,
  GripVertical,
  Plus,
  Save,
  Trash2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ProjectTemplate, TemplateTask } from "@/lib/template-data"

type TemplateEditorFormProps = {
  mode: "create" | "edit"
  initialTemplate?: ProjectTemplate
}

type MeasurementType = "valor" | "quantidade" | "percentual"
type GoalCadence = "diaria" | "semanal" | "mensal"

type DirectionMeasure = {
  id: string
  title: string
  description: string
  cadence: GoalCadence
  measurementType: MeasurementType
  targetValue: number
  startDate: string
  unitLabel: string
  tasks: TemplateTask[]
}

type MciFormState = {
  title: string
  description: string
  measurementType: MeasurementType
  initialValue: number
  targetValue: number
  dueDate: string
  measures: DirectionMeasure[]
}

type DraggedTask = {
  measureId: string
  taskId: string
}

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function buildEmptyTask() {
  return {
    id: createId("task"),
    title: "",
    description: "",
    durationDays: 1,
    checklist: [] as string[],
  }
}

function buildEmptyMeasure(index = 1): DirectionMeasure {
  return {
    id: createId("measure"),
    title: `Medida ${index}`,
    description: "",
    cadence: "semanal",
    measurementType: "quantidade",
    targetValue: 0,
    startDate: "",
    unitLabel: "",
    tasks: [buildEmptyTask()],
  }
}

function buildInitialState(initialTemplate?: ProjectTemplate): MciFormState {
  if (!initialTemplate) {
    return {
      title: "",
      description: "",
      measurementType: "valor",
      initialValue: 0,
      targetValue: 100,
      dueDate: "",
      measures: [buildEmptyMeasure(1)],
    }
  }

  return {
    title: initialTemplate.title,
    description: initialTemplate.description,
    measurementType: "valor",
    initialValue: 0,
    targetValue: 100,
    dueDate: "",
    measures: initialTemplate.phases.map((phase) => ({
      id: phase.id,
      title: phase.name,
      description: "",
      cadence: "semanal",
      measurementType: "quantidade",
      targetValue: 0,
      startDate: "",
      unitLabel: "",
      tasks: phase.tasks.map((task) => ({
        ...task,
        checklist: [...task.checklist],
      })),
    })) || [buildEmptyMeasure(1)],
  }
}

function countMeasureTasks(measures: DirectionMeasure[]) {
  return measures.reduce((acc, measure) => acc + measure.tasks.length, 0)
}

export function TemplateEditorForm({ mode, initialTemplate }: TemplateEditorFormProps) {
  const [formState, setFormState] = useState<MciFormState>(() =>
    buildInitialState(initialTemplate)
  )
  const [collapsedMeasures, setCollapsedMeasures] = useState<Record<string, boolean>>({})
  const [draggedMeasureId, setDraggedMeasureId] = useState<string | null>(null)
  const [draggedTask, setDraggedTask] = useState<DraggedTask | null>(null)

  const totalTasks = useMemo(() => countMeasureTasks(formState.measures), [formState.measures])

  const pageTitle = mode === "create" ? "Nova MCI" : "Editar MCI"
  const pageDescription =
    mode === "create"
      ? "Preencha os dados para cadastrar uma nova MCI."
      : "Atualize os dados da MCI."
  const submitLabel = mode === "create" ? "Salvar MCI" : "Salvar alteracoes"

  const updateMeasure = (
    measureId: string,
    updater: (measure: DirectionMeasure) => DirectionMeasure
  ) => {
    setFormState((current) => ({
      ...current,
      measures: current.measures.map((measure) =>
        measure.id === measureId ? updater(measure) : measure
      ),
    }))
  }

  const addMeasure = () => {
    const newMeasure = buildEmptyMeasure(formState.measures.length + 1)
    setFormState((current) => ({
      ...current,
      measures: [...current.measures, newMeasure],
    }))
    setCollapsedMeasures((current) => ({ ...current, [newMeasure.id]: false }))
  }

  const removeMeasure = (measureId: string) => {
    setFormState((current) => {
      if (current.measures.length === 1) {
        return {
          ...current,
          measures: [buildEmptyMeasure(1)],
        }
      }

      return {
        ...current,
        measures: current.measures.filter((measure) => measure.id !== measureId),
      }
    })
  }

  const addTask = (measureId: string) => {
    updateMeasure(measureId, (measure) => ({
      ...measure,
      tasks: [...measure.tasks, buildEmptyTask()],
    }))
  }

  const removeTask = (measureId: string, taskId: string) => {
    updateMeasure(measureId, (measure) => {
      const remainingTasks = measure.tasks.filter((task) => task.id !== taskId)

      return {
        ...measure,
        tasks: remainingTasks.length === 0 ? [buildEmptyTask()] : remainingTasks,
      }
    })
  }

  const updateTaskField = (
    measureId: string,
    taskId: string,
    field: "title" | "description" | "durationDays",
    value: string | number
  ) => {
    updateMeasure(measureId, (measure) => ({
      ...measure,
      tasks: measure.tasks.map((task) => {
        if (task.id !== taskId) return task

        if (field === "durationDays") {
          return {
            ...task,
            durationDays: Number(value),
          }
        }

        return {
          ...task,
          [field]: value,
        }
      }),
    }))
  }

  const addChecklistItem = (measureId: string, taskId: string) => {
    updateMeasure(measureId, (measure) => ({
      ...measure,
      tasks: measure.tasks.map((task) =>
        task.id === taskId ? { ...task, checklist: [...task.checklist, ""] } : task
      ),
    }))
  }

  const updateChecklistItem = (
    measureId: string,
    taskId: string,
    checklistIndex: number,
    value: string
  ) => {
    updateMeasure(measureId, (measure) => ({
      ...measure,
      tasks: measure.tasks.map((task) => {
        if (task.id !== taskId) return task

        return {
          ...task,
          checklist: task.checklist.map((item, index) =>
            index === checklistIndex ? value : item
          ),
        }
      }),
    }))
  }

  const removeChecklistItem = (measureId: string, taskId: string, checklistIndex: number) => {
    updateMeasure(measureId, (measure) => ({
      ...measure,
      tasks: measure.tasks.map((task) => {
        if (task.id !== taskId) return task

        return {
          ...task,
          checklist: task.checklist.filter((_, index) => index !== checklistIndex),
        }
      }),
    }))
  }

  const toggleMeasure = (measureId: string) => {
    setCollapsedMeasures((current) => ({ ...current, [measureId]: !current[measureId] }))
  }

  const reorderMeasures = (sourceMeasureId: string, targetMeasureId: string) => {
    if (sourceMeasureId === targetMeasureId) return

    setFormState((current) => {
      const sourceIndex = current.measures.findIndex((measure) => measure.id === sourceMeasureId)
      const targetIndex = current.measures.findIndex((measure) => measure.id === targetMeasureId)

      if (sourceIndex < 0 || targetIndex < 0) {
        return current
      }

      const nextMeasures = [...current.measures]
      const [movedMeasure] = nextMeasures.splice(sourceIndex, 1)
      nextMeasures.splice(targetIndex, 0, movedMeasure)

      return {
        ...current,
        measures: nextMeasures,
      }
    })
  }

  const reorderTaskToTarget = (
    sourceMeasureId: string,
    sourceTaskId: string,
    targetMeasureId: string,
    targetTaskId: string
  ) => {
    if (sourceMeasureId === targetMeasureId && sourceTaskId === targetTaskId) return

    setFormState((current) => {
      const sourceMeasureIndex = current.measures.findIndex(
        (measure) => measure.id === sourceMeasureId
      )
      const targetMeasureIndex = current.measures.findIndex(
        (measure) => measure.id === targetMeasureId
      )
      if (sourceMeasureIndex < 0 || targetMeasureIndex < 0) return current

      const sourceTaskIndex = current.measures[sourceMeasureIndex].tasks.findIndex(
        (task) => task.id === sourceTaskId
      )
      const targetTaskIndex = current.measures[targetMeasureIndex].tasks.findIndex(
        (task) => task.id === targetTaskId
      )
      if (sourceTaskIndex < 0 || targetTaskIndex < 0) return current

      const nextMeasures = current.measures.map((measure) => ({
        ...measure,
        tasks: [...measure.tasks],
      }))

      const [movedTask] = nextMeasures[sourceMeasureIndex].tasks.splice(sourceTaskIndex, 1)
      nextMeasures[targetMeasureIndex].tasks.splice(targetTaskIndex, 0, movedTask)

      if (nextMeasures[sourceMeasureIndex].tasks.length === 0) {
        nextMeasures[sourceMeasureIndex].tasks.push(buildEmptyTask())
      }

      return {
        ...current,
        measures: nextMeasures,
      }
    })
  }

  const moveTaskToMeasureEnd = (
    sourceMeasureId: string,
    sourceTaskId: string,
    targetMeasureId: string
  ) => {
    setFormState((current) => {
      const sourceMeasureIndex = current.measures.findIndex(
        (measure) => measure.id === sourceMeasureId
      )
      const targetMeasureIndex = current.measures.findIndex(
        (measure) => measure.id === targetMeasureId
      )
      if (sourceMeasureIndex < 0 || targetMeasureIndex < 0) return current

      const sourceTaskIndex = current.measures[sourceMeasureIndex].tasks.findIndex(
        (task) => task.id === sourceTaskId
      )
      if (sourceTaskIndex < 0) return current

      const nextMeasures = current.measures.map((measure) => ({
        ...measure,
        tasks: [...measure.tasks],
      }))

      const [movedTask] = nextMeasures[sourceMeasureIndex].tasks.splice(sourceTaskIndex, 1)
      nextMeasures[targetMeasureIndex].tasks.push(movedTask)

      if (nextMeasures[sourceMeasureIndex].tasks.length === 0) {
        nextMeasures[sourceMeasureIndex].tasks.push(buildEmptyTask())
      }

      return {
        ...current,
        measures: nextMeasures,
      }
    })
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.info("MCI payload", formState)
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-start justify-between gap-4 rounded-xl border bg-[linear-gradient(180deg,rgba(30,58,138,0.08)_0%,rgba(30,64,175,0.02)_100%)] p-4 sm:p-5">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{pageTitle}</h1>
          <p className="text-sm text-muted-foreground">{pageDescription}</p>
        </div>

        <Button type="button" variant="outline" asChild>
          <Link href="/cadastros/metas-mci">
            <ChevronLeft className="size-4" />
            Voltar para MCIs
          </Link>
        </Button>
      </section>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dados da MCI</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="mci-title">Titulo</Label>
              <Input
                id="mci-title"
                value={formState.title}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, title: event.target.value }))
                }
                placeholder="Ex.: Meta de receita comercial"
                required
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="mci-description">Descricao</Label>
              <textarea
                id="mci-description"
                value={formState.description}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                className="min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Descreva a meta MCI"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="mci-measurement-type">Tipo de medicao</Label>
              <select
                id="mci-measurement-type"
                value={formState.measurementType}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    measurementType: event.target.value as MeasurementType,
                  }))
                }
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="valor">Valor</option>
                <option value="quantidade">Quantidade</option>
                <option value="percentual">Percentual</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="mci-due-date">Prazo de execucao</Label>
              <Input
                id="mci-due-date"
                type="date"
                value={formState.dueDate}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, dueDate: event.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="mci-initial-value">Valor inicial</Label>
              <Input
                id="mci-initial-value"
                type="number"
                value={formState.initialValue}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    initialValue: Number(event.target.value),
                  }))
                }
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="mci-target-value">Valor final</Label>
              <Input
                id="mci-target-value"
                type="number"
                value={formState.targetValue}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    targetValue: Number(event.target.value),
                  }))
                }
                required
              />
            </div>

            <div className="rounded-md border bg-muted/30 p-3 text-sm md:col-span-2">
              <p className="font-medium">Resumo</p>
              <p className="text-muted-foreground">{formState.measures.length} medidas</p>
              <p className="text-muted-foreground">{totalTasks} acoes</p>
            </div>
          </CardContent>
        </Card>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">Medidas de Direcao</h2>
                <span className="rounded-md border bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground">
                  {formState.measures.length} total
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Cada medida contem meta, unidade e as acoes especificas para atingir o resultado.
              </p>
            </div>
            <Button type="button" variant="outline" onClick={addMeasure}>
              <CirclePlus className="size-4" />
              Adicionar medida
            </Button>
          </div>

          {formState.measures.map((measure, measureIndex) => (
            <Card
              key={measure.id}
              onDragOver={(event) => {
                if (draggedMeasureId) {
                  event.preventDefault()
                }
              }}
              onDrop={(event) => {
                event.preventDefault()
                if (!draggedMeasureId) return
                reorderMeasures(draggedMeasureId, measure.id)
                setDraggedMeasureId(null)
              }}
            >
              <CardHeader className="flex flex-row items-center justify-between gap-3 py-4">
                <div className="flex min-w-0 items-center gap-2">
                  <button
                    type="button"
                    draggable
                    aria-label="Arrastar medida"
                    className="cursor-grab text-muted-foreground active:cursor-grabbing"
                    onDragStart={() => setDraggedMeasureId(measure.id)}
                    onDragEnd={() => setDraggedMeasureId(null)}
                  >
                    <GripVertical className="size-4" />
                  </button>
                  <span className="rounded px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-muted-foreground">
                    MEDIDA
                  </span>
                  <Input
                    id={`measure-title-${measure.id}`}
                    value={measure.title}
                    onChange={(event) =>
                      updateMeasure(measure.id, (currentMeasure) => ({
                        ...currentMeasure,
                        title: event.target.value,
                      }))
                    }
                    className="h-9 border-none bg-transparent px-0 text-base font-semibold shadow-none focus-visible:ring-0"
                    placeholder={`Medida ${measureIndex + 1}`}
                    required
                  />
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Excluir medida"
                    className="text-destructive"
                    onClick={() => removeMeasure(measure.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={
                      collapsedMeasures[measure.id] ? "Expandir medida" : "Retrair medida"
                    }
                    onClick={() => toggleMeasure(measure.id)}
                  >
                    {collapsedMeasures[measure.id] ? (
                      <ChevronDown className="size-4" />
                    ) : (
                      <ChevronUp className="size-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>

              {!collapsedMeasures[measure.id] ? (
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1.5 md:col-span-2">
                      <Label htmlFor={`measure-description-${measure.id}`}>Descricao da medida</Label>
                      <textarea
                        id={`measure-description-${measure.id}`}
                        value={measure.description}
                        onChange={(event) =>
                          updateMeasure(measure.id, (currentMeasure) => ({
                            ...currentMeasure,
                            description: event.target.value,
                          }))
                        }
                        className="min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                        placeholder="Descreva a medida de direcao"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor={`measure-cadence-${measure.id}`}>Definicao da meta</Label>
                      <select
                        id={`measure-cadence-${measure.id}`}
                        value={measure.cadence}
                        onChange={(event) =>
                          updateMeasure(measure.id, (currentMeasure) => ({
                            ...currentMeasure,
                            cadence: event.target.value as GoalCadence,
                          }))
                        }
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="diaria">Diaria</option>
                        <option value="semanal">Semanal</option>
                        <option value="mensal">Mensal</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor={`measure-type-${measure.id}`}>Unidade de medicao</Label>
                      <select
                        id={`measure-type-${measure.id}`}
                        value={measure.measurementType}
                        onChange={(event) =>
                          updateMeasure(measure.id, (currentMeasure) => ({
                            ...currentMeasure,
                            measurementType: event.target.value as MeasurementType,
                          }))
                        }
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="valor">Valor</option>
                        <option value="percentual">Percentual</option>
                        <option value="quantidade">Quantidade</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor={`measure-target-${measure.id}`}>Valor da meta</Label>
                      <Input
                        id={`measure-target-${measure.id}`}
                        type="number"
                        value={measure.targetValue}
                        onChange={(event) =>
                          updateMeasure(measure.id, (currentMeasure) => ({
                            ...currentMeasure,
                            targetValue: Number(event.target.value),
                          }))
                        }
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor={`measure-start-date-${measure.id}`}>Data inicial da contagem</Label>
                      <Input
                        id={`measure-start-date-${measure.id}`}
                        type="date"
                        value={measure.startDate}
                        onChange={(event) =>
                          updateMeasure(measure.id, (currentMeasure) => ({
                            ...currentMeasure,
                            startDate: event.target.value,
                          }))
                        }
                        required
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <Label htmlFor={`measure-unit-label-${measure.id}`}>Descricao da unidade</Label>
                      <Input
                        id={`measure-unit-label-${measure.id}`}
                        value={measure.unitLabel}
                        onChange={(event) =>
                          updateMeasure(measure.id, (currentMeasure) => ({
                            ...currentMeasure,
                            unitLabel: event.target.value,
                          }))
                        }
                        placeholder="Ex.: Ligacoes"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="text-sm font-semibold">Acoes especificas</h3>
                      <p className="text-xs text-muted-foreground">
                        Tarefas que devem ser executadas para atingir esta medida de direcao.
                      </p>
                    </div>

                    {measure.tasks.map((task, taskIndex) => (
                      <div
                        key={task.id}
                        className="space-y-3 rounded-lg border bg-muted/20 p-3 sm:p-4"
                        onDragOver={(event) => {
                          if (draggedTask) {
                            event.preventDefault()
                          }
                        }}
                        onDrop={(event) => {
                          event.preventDefault()
                          if (!draggedTask) return
                          reorderTaskToTarget(draggedTask.measureId, draggedTask.taskId, measure.id, task.id)
                          setDraggedTask(null)
                        }}
                      >
                        <div className="grid gap-2 md:grid-cols-[1fr,auto] md:items-center">
                          <div className="flex items-start gap-2">
                            <button
                              type="button"
                              draggable
                              aria-label="Arrastar tarefa"
                              className="mt-1 cursor-grab text-muted-foreground active:cursor-grabbing"
                              onDragStart={() => setDraggedTask({ measureId: measure.id, taskId: task.id })}
                              onDragEnd={() => setDraggedTask(null)}
                            >
                              <GripVertical className="size-3.5" />
                            </button>
                            <div className="min-w-0 flex-1 space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <Input
                                  id={`task-title-${task.id}`}
                                  value={task.title}
                                  onChange={(event) =>
                                    updateTaskField(measure.id, task.id, "title", event.target.value)
                                  }
                                  className="h-7 min-w-[240px] flex-1 border-none bg-transparent px-0 text-sm font-semibold shadow-none focus-visible:ring-0"
                                  placeholder={`Acao ${taskIndex + 1}`}
                                  required
                                />
                                <div className="flex items-center gap-1">
                                  <Label
                                    htmlFor={`task-duration-${task.id}`}
                                    className="text-[10px] uppercase tracking-wide text-muted-foreground"
                                  >
                                    Dias
                                  </Label>
                                  <Input
                                    id={`task-duration-${task.id}`}
                                    type="number"
                                    min={1}
                                    value={task.durationDays}
                                    onChange={(event) =>
                                      updateTaskField(
                                        measure.id,
                                        task.id,
                                        "durationDays",
                                        Math.max(1, Number(event.target.value) || 1)
                                      )
                                    }
                                    className="h-7 w-16"
                                    required
                                  />
                                </div>
                              </div>
                              <Input
                                id={`task-description-inline-${task.id}`}
                                value={task.description}
                                onChange={(event) =>
                                  updateTaskField(
                                    measure.id,
                                    task.id,
                                    "description",
                                    event.target.value
                                  )
                                }
                                className="h-6 border-none bg-transparent px-0 text-xs text-muted-foreground shadow-none focus-visible:ring-0"
                                placeholder="Detalhe da acao"
                                required
                              />
                            </div>
                          </div>

                          <div className="flex items-start justify-end">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              aria-label="Excluir tarefa"
                              className="text-destructive"
                              onClick={() => removeTask(measure.id, task.id)}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2 rounded-md border border-dashed p-3">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-medium">Checklist (opcional)</p>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addChecklistItem(measure.id, task.id)}
                            >
                              <Plus className="size-3.5" />
                              Item
                            </Button>
                          </div>

                          {task.checklist.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                              Nenhum item de checklist nesta tarefa.
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {task.checklist.map((item, itemIndex) => (
                                <div key={`${task.id}-check-${itemIndex}`} className="flex gap-2">
                                  <Input
                                    value={item}
                                    onChange={(event) =>
                                      updateChecklistItem(
                                        measure.id,
                                        task.id,
                                        itemIndex,
                                        event.target.value
                                      )
                                    }
                                    placeholder={`Item ${itemIndex + 1}`}
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-sm"
                                    aria-label="Excluir item do checklist"
                                    className="text-destructive"
                                    onClick={() =>
                                      removeChecklistItem(measure.id, task.id, itemIndex)
                                    }
                                  >
                                    <Trash2 className="size-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    <div
                      className="rounded-md border border-dashed px-3 py-4 text-center text-[11px] uppercase tracking-[0.12em] text-muted-foreground"
                      onDragOver={(event) => {
                        if (draggedTask) {
                          event.preventDefault()
                        }
                      }}
                      onDrop={(event) => {
                        event.preventDefault()
                        if (!draggedTask) return
                        moveTaskToMeasureEnd(draggedTask.measureId, draggedTask.taskId, measure.id)
                        setDraggedTask(null)
                      }}
                    >
                      Drop task here
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full justify-center border border-dashed"
                      onClick={() => addTask(measure.id)}
                    >
                      <Plus className="size-4" />
                      Add Task
                    </Button>
                  </div>
                </CardContent>
              ) : null}
            </Card>
          ))}
        </section>

        <div className="flex justify-end">
          <Button type="submit">
            <Save className="size-4" />
            {submitLabel}
          </Button>
        </div>
      </form>
    </div>
  )
}
