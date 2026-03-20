import Link from "next/link"

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

export default function RegisterPage() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Criar conta</CardTitle>
        <CardDescription>
          Registre sua conta para começar a usar o Arena.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="fullName">Nome completo</Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              placeholder="Seu nome"
              required
            />
          </div>

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
              autoComplete="new-password"
              placeholder="Crie uma senha"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirmar senha</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Repita sua senha"
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Criar conta
          </Button>
        </form>

        <p className="mt-4 text-sm text-muted-foreground">
          Já possui conta?{" "}
          <Link className="underline underline-offset-4" href="/login">
            Fazer login
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
