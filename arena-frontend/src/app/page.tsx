import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function Home() {
  const token = (await cookies()).get("prumo_token")?.value

  if (!token) {
    redirect("/login")
  }

  redirect("/dashboard")
}
