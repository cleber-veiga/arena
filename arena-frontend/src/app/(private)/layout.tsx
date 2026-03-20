"use client"

import type { ReactNode } from "react"
import { PanelLeft } from "lucide-react"
import { useState } from "react"

import { AppSidebar } from "@/components/layout/app-sidebar"
import { ContentBreadcrumbs } from "@/components/layout/content-breadcrumbs"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { UserMenu } from "@/components/layout/user-menu"
import { Button } from "@/components/ui/button"

type PrivateLayoutProps = {
  children: ReactNode
}

export default function PrivateLayout({ children }: PrivateLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="flex min-h-screen w-full">
        <AppSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="flex h-12 items-center justify-between border-b bg-card px-4 md:px-6">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setIsSidebarOpen((current) => !current)}
                aria-label="Alternar menu lateral"
              >
                <PanelLeft className="size-4" />
              </Button>
              <p className="font-medium">Painel administrativo</p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <UserMenu />
            </div>
          </header>

          <main className="flex-1 p-4 md:p-8">
            <div className="mb-4 md:mb-6">
              <ContentBreadcrumbs />
            </div>
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
