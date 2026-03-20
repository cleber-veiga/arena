export type TemplateTask = {
  id: string
  title: string
  description: string
  durationDays: number
  checklist: string[]
}

export type TemplatePhase = {
  id: string
  name: string
  tasks: TemplateTask[]
}

export type ProjectTemplate = {
  id: string
  title: string
  category: string
  description: string
  imageClassName: string
  phases: TemplatePhase[]
}

export const templateCategories = [
  "Residential",
  "Commercial",
  "Landscape",
  "Interior Design",
] as const

export const projectTemplates: ProjectTemplate[] = [
  {
    id: "residential-renovation",
    title: "Residential Renovation",
    category: "Residential",
    description: "Template para reformas residenciais com checklist completo.",
    imageClassName:
      "bg-[linear-gradient(135deg,#2d3748_0%,#4a5568_45%,#9ca3af_100%)]",
    phases: [
      {
        id: "phase-pre-design",
        name: "Fase 1: Pre-Design",
        tasks: [
          {
            id: "task-site-analysis",
            title: "Site Analysis & Photography",
            description: "Levantamento inicial do local e registro fotografico.",
            durationDays: 3,
            checklist: ["Fotos externas", "Registro de medidas basicas"],
          },
          {
            id: "task-client-needs",
            title: "Client Needs Assessment",
            description: "Mapear necessidades, estilo de vida e prioridades do cliente.",
            durationDays: 5,
            checklist: ["Entrevista inicial", "Documento de requisitos"],
          },
        ],
      },
      {
        id: "phase-schematic-design",
        name: "Fase 2: Schematic Design",
        tasks: [
          {
            id: "task-floor-plan",
            title: "Floor Plan Layouts",
            description: "Desenvolvimento de opcoes preliminares de layout.",
            durationDays: 10,
            checklist: ["Opcao A", "Opcao B", "Revisao com cliente"],
          },
        ],
      },
    ],
  },
  {
    id: "commercial-interior",
    title: "Commercial Interior",
    category: "Commercial",
    description: "Fluxo para interiores comerciais com entregas e marcos definidos.",
    imageClassName:
      "bg-[linear-gradient(135deg,#1f2937_0%,#334155_50%,#a3a3a3_100%)]",
    phases: [
      {
        id: "phase-briefing",
        name: "Fase 1: Briefing",
        tasks: [
          {
            id: "task-brand-guidelines",
            title: "Brand & Operation Mapping",
            description: "Entender marca, fluxo de operacao e experiencia desejada.",
            durationDays: 4,
            checklist: ["Entrevista com stakeholders"],
          },
        ],
      },
      {
        id: "phase-concept",
        name: "Fase 2: Conceito",
        tasks: [
          {
            id: "task-concept-boards",
            title: "Concept Boards",
            description: "Criacao de paineis conceituais para direcao criativa.",
            durationDays: 7,
            checklist: ["Moodboard", "Paleta preliminar"],
          },
        ],
      },
    ],
  },
  {
    id: "landscape-design",
    title: "Landscape Design",
    category: "Landscape",
    description: "Planejamento de paisagismo com foco em areas externas.",
    imageClassName:
      "bg-[linear-gradient(135deg,#14532d_0%,#166534_50%,#4d7c0f_100%)]",
    phases: [
      {
        id: "phase-site-read",
        name: "Fase 1: Diagnostico",
        tasks: [
          {
            id: "task-solar-wind",
            title: "Solar & Wind Study",
            description: "Analise de insolacao, ventilacao e drenagem do terreno.",
            durationDays: 2,
            checklist: [],
          },
        ],
      },
    ],
  },
  {
    id: "sustainable-housing",
    title: "Sustainable Housing",
    category: "Residential",
    description: "Template com enfase em sustentabilidade para projetos habitacionais.",
    imageClassName:
      "bg-[linear-gradient(135deg,#1e3a8a_0%,#334155_50%,#6b7280_100%)]",
    phases: [
      {
        id: "phase-viability",
        name: "Fase 1: Viabilidade",
        tasks: [
          {
            id: "task-environment-constraints",
            title: "Environmental Constraints",
            description: "Levantamento de condicionantes ambientais e legais.",
            durationDays: 6,
            checklist: ["Zoneamento", "Restricoes ambientais"],
          },
        ],
      },
    ],
  },
]

export function countTemplateTasks(phases: TemplatePhase[]) {
  return phases.reduce((acc, phase) => acc + phase.tasks.length, 0)
}

export function findTemplateById(templateId: string) {
  return projectTemplates.find((item) => item.id === templateId)
}
