"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { type ComponentType, useState } from "react"
import {
  BarChart3,
  Building2,
  ChevronDown,
  ChevronRight,
  LayoutTemplate,
  LayoutDashboard,
  Search,
  Settings,
} from "lucide-react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type AppSidebarProps = {
  isOpen: boolean
  onClose: () => void
}

type NavItem = {
  href?: string
  label: string
  icon: ComponentType<{ className?: string }>
}

type NavGroup = {
  id: string
  label: string
  items: NavItem[]
  defaultOpen?: boolean
}

function hasHref(item: NavItem): item is NavItem & { href: string } {
  return typeof item.href === "string"
}

const groups: NavGroup[] = [
  {
    id: "overview",
    label: "Overview",
    defaultOpen: true,
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/placar", label: "Placar", icon: BarChart3 },
    ],
  },
  {
    id: "cadastros",
    label: "Cadastros",
    defaultOpen: true,
    items: [
      { href: "/cadastros/metas-mci", label: "Metas (MCI)", icon: LayoutTemplate },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    items: [{ label: "Configuracoes", icon: Settings }],
  },
]

export function AppSidebar({ isOpen, onClose }: AppSidebarProps) {
  const pathname = usePathname()
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    groups.reduce(
      (acc, group) => ({ ...acc, [group.id]: Boolean(group.defaultOpen) }),
      {}
    )
  )

  const toggleGroup = (groupId: string) => {
    setOpenGroups((current) => ({ ...current, [groupId]: !current[groupId] }))
  }

  return (
    <>
      {isOpen ? (
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 border-r border-border bg-sidebar p-4 transition-all md:static md:inset-auto md:z-auto md:shrink-0 md:translate-x-0",
          isOpen
            ? "w-72 translate-x-0"
            : "-translate-x-full w-72 md:w-16 md:translate-x-0 md:px-2 md:py-4"
        )}
      >
        {isOpen ? (
          <>
            <div className="mb-6 flex items-center gap-2 px-2">
              <div className="flex size-8 items-center justify-center rounded-md bg-foreground">
                <Building2 className="size-4 text-background" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">Arena</p>
                <p className="text-xs text-muted-foreground">Gestao de arquitetura</p>
              </div>
              <ChevronDown className="size-4 text-muted-foreground" />
            </div>

            <div className="relative mb-4">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="text" placeholder="Buscar..." className="bg-background pl-8" />
            </div>

            <nav className="space-y-2">
              {groups.map((group) => {
                const isGroupOpen = Boolean(openGroups[group.id])

                return (
                  <div key={group.id}>
                    <button
                      type="button"
                      onClick={() => toggleGroup(group.id)}
                      className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
                    >
                      <span>{group.label}</span>
                      {isGroupOpen ? (
                        <ChevronDown className="size-4" />
                      ) : (
                        <ChevronRight className="size-4" />
                      )}
                    </button>

                    {isGroupOpen ? (
                      <div className="ml-4 mt-1 space-y-1">
                        {group.items.map((item) => {
                          const isActive = item.href
                            ? pathname === item.href ||
                              pathname.startsWith(`${item.href}/`)
                            : false
                          const itemClassName = cn(
                            "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                            isActive
                              ? "bg-accent font-medium text-foreground"
                              : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                          )

                          if (item.href) {
                            return (
                              <Link key={item.label} href={item.href} className={itemClassName}>
                                <item.icon className="size-4" />
                                {item.label}
                              </Link>
                            )
                          }

                          return (
                            <span
                              key={item.label}
                              aria-disabled="true"
                              className={cn(itemClassName, "cursor-not-allowed opacity-60")}
                            >
                              <item.icon className="size-4" />
                              {item.label}
                            </span>
                          )
                        })}
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </nav>
          </>
        ) : (
      <div className="hidden h-full flex-col items-center gap-2 md:flex">
            <div className="mb-4 flex size-10 items-center justify-center rounded-md bg-foreground">
              <Building2 className="size-5 text-background" />
            </div>

            <nav className="flex flex-1 flex-col items-center gap-2">
              {groups
                .flatMap((group) => group.items)
                .filter(hasHref)
                .map((item) => {
                  const isActive =
                    pathname === item.href || pathname.startsWith(`${item.href}/`)
                  const className = cn(
                    "flex size-10 items-center justify-center rounded-md transition-colors",
                    isActive
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  )

                  return (
                    <Link
                      key={`${item.label}-${item.href}`}
                      href={item.href}
                      title={item.label}
                      className={className}
                    >
                      <item.icon className="size-5" />
                    </Link>
                  )
                })}
            </nav>

            <span className="mb-1 flex size-10 items-center justify-center rounded-md text-muted-foreground">
              <Settings className="size-5" />
            </span>
          </div>
        )}
      </aside>
    </>
  )
}
