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

export default function ResetPasswordPage() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Redefinir senha</CardTitle>
        <CardDescription>
          Enviaremos um link de redefinição para seu e-mail.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form className="space-y-4">
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

          <Button type="submit" className="w-full">
            Enviar link
          </Button>
        </form>

        <p className="mt-4 text-sm text-muted-foreground">
          Lembrou sua senha?{" "}
          <Link className="underline underline-offset-4" href="/login">
            Voltar para login
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
