"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const router = useRouter()

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    document.cookie = "prumo_token=fake-jwt-token; path=/; max-age=86400; samesite=lax"
    router.push("/dashboard")
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Entrar no Arena</CardTitle>
        <CardDescription>
          Use seu e-mail e senha para acessar sua conta.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="space-y-1.5">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="nome@empresa.com"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Digite sua senha"
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </form>

        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
          <p>
            <Link className="underline underline-offset-4" href="/reset-password">
              Esqueceu sua senha?
            </Link>
          </p>
          <p>
            Ainda não possui conta?{" "}
            <Link className="underline underline-offset-4" href="/register">
              Criar conta
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
