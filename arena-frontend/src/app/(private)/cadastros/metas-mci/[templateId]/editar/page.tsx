import { notFound } from "next/navigation"

import { TemplateEditorForm } from "../../_components/template-editor-form"
import { findTemplateById } from "@/lib/template-data"

type EditTemplatePageProps = {
  params: Promise<{ templateId: string }>
}

export default async function EditMetaMciPage({ params }: EditTemplatePageProps) {
  const { templateId } = await params
  const template = findTemplateById(templateId)

  if (!template) {
    notFound()
  }

  return <TemplateEditorForm mode="edit" initialTemplate={template} />
}
