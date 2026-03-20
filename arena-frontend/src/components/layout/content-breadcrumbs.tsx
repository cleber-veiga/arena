"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { type ComponentType, Fragment } from "react"
import { BarChart3, FolderTree, Home, LayoutDashboard, LayoutTemplate } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

type SegmentMeta = {
  label: string
  icon?: ComponentType<{ className?: string }>
}

const segmentMap: Record<string, SegmentMeta> = {
  dashboard: { label: "Dashboard", icon: LayoutDashboard },
  placar: { label: "Placar", icon: BarChart3 },
  cadastros: { label: "Cadastros", icon: FolderTree },
  "metas-mci": { label: "Metas (MCI)", icon: LayoutTemplate },
  novo: { label: "Novo" },
  editar: { label: "Editar" },
}

function formatSegment(segment: string) {
  return segment
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export function ContentBreadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  const crumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`
    const meta = segmentMap[segment]

    return {
      href,
      label: meta?.label ?? formatSegment(segment),
      icon: meta?.icon,
      isLast: index === segments.length - 1,
    }
  })

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard" className="flex items-center gap-1">
              <Home className="size-4" />
              Home
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {crumbs.map((crumb) => (
          <Fragment key={crumb.href}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {crumb.isLast ? (
                <BreadcrumbPage className="flex items-center gap-1">
                  {crumb.icon ? <crumb.icon className="size-4" /> : null}
                  {crumb.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={crumb.href} className="flex items-center gap-1">
                    {crumb.icon ? <crumb.icon className="size-4" /> : null}
                    {crumb.label}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
