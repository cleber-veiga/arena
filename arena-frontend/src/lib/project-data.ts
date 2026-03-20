import { Contact } from "@/lib/contact-data"
import { ProjectTemplate, TemplatePhase, TemplateTask, findTemplateById } from "@/lib/template-data"

export type ProjectTaskStatus = "todo" | "in_progress" | "review" | "done"

export type ProjectTask = {
  id: string
  templateTaskId: string
  title: string
  description: string
  durationDays: number
  checklist: string[]
  status: ProjectTaskStatus
}

export type ProjectPhase = {
  id: string
  templatePhaseId: string
  name: string
  tasks: ProjectTask[]
}

export type Project = {
  id: string
  name: string
  contactId: number
  contactName: string
  templateId: string
  templateName: string
  createdAt: string
  phases: ProjectPhase[]
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function copyTask(task: TemplateTask, index: number): ProjectTask {
  return {
    id: `proj-task-${task.id}-${index}`,
    templateTaskId: task.id,
    title: task.title,
    description: task.description,
    durationDays: task.durationDays,
    checklist: [...task.checklist],
    status: "todo",
  }
}

function copyPhase(phase: TemplatePhase, index: number): ProjectPhase {
  return {
    id: `proj-phase-${phase.id}-${index}`,
    templatePhaseId: phase.id,
    name: phase.name,
    tasks: phase.tasks.map(copyTask),
  }
}

export function instantiateProjectFromTemplate(input: {
  name: string
  contact: Contact
  template: ProjectTemplate
}): Project {
  const { name, contact, template } = input
  const createdAt = new Date().toISOString()

  return {
    id: `${slugify(name)}-${Date.now()}`,
    name,
    contactId: contact.id,
    contactName: contact.nome,
    templateId: template.id,
    templateName: template.title,
    createdAt,
    phases: template.phases.map(copyPhase),
  }
}

export function countProjectTasks(phases: ProjectPhase[]) {
  return phases.reduce((total, phase) => total + phase.tasks.length, 0)
}

export function countCompletedTasks(phases: ProjectPhase[]) {
  return phases.reduce(
    (total, phase) => total + phase.tasks.filter((task) => task.status === "done").length,
    0
  )
}

export function calculateProjectProgress(project: Project) {
  const total = countProjectTasks(project.phases)
  if (total === 0) return 0

  const completed = countCompletedTasks(project.phases)
  return Math.round((completed / total) * 100)
}

export function buildInitialProjects(contacts: Contact[]) {
  const projectsSeed = [
    {
      name: "Residencia Alto da Serra",
      contactId: contacts[0]?.id,
      templateId: "residential-renovation",
    },
    {
      name: "Escritorio Horizonte",
      contactId: contacts[1]?.id,
      templateId: "commercial-interior",
    },
  ]

  return projectsSeed
    .map((seed) => {
      const contact = contacts.find((item) => item.id === seed.contactId)
      const template = findTemplateById(seed.templateId)

      if (!contact || !template) return null

      const project = instantiateProjectFromTemplate({
        name: seed.name,
        contact,
        template,
      })

      if (project.phases[0]?.tasks[0]) {
        project.phases[0].tasks[0].status = "done"
      }
      if (project.phases[0]?.tasks[1]) {
        project.phases[0].tasks[1].status = "in_progress"
      }

      return project
    })
    .filter((project): project is Project => project !== null)
}
