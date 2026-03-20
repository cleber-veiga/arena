"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { LogOut, Settings, User } from "lucide-react"
import { useState } from "react"

import { PreferencesDialog } from "@/components/layout/preferences-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function UserMenu() {
  const router = useRouter()
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false)

  const handleLogout = () => {
    document.cookie = "prumo_token=; path=/; max-age=0; samesite=lax"
    router.push("/login")
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="ghost" size="icon-sm" className="rounded-full">
            <span className="relative size-7 overflow-hidden rounded-full">
              <Image
                src="https://github.com/shadcn.png"
                alt="Foto do usuario"
                fill
                sizes="28px"
              />
            </span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 size-4" />
            Perfil
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setIsPreferencesOpen(true)}>
            <Settings className="mr-2 size-4" />
            Preferencias
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={handleLogout}>
            <LogOut className="mr-2 size-4" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <PreferencesDialog
        open={isPreferencesOpen}
        onOpenChange={setIsPreferencesOpen}
      />
    </>
  )
}
