"use client"

import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = () => {
    document.cookie = "prumo_token=; path=/; max-age=0; samesite=lax"
    router.push("/login")
  }

  return (
    <Button type="button" variant="outline" onClick={handleLogout}>
      Sair
    </Button>
  )
}
