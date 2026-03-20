import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PRIVATE_PATHS = ["/dashboard", "/placar", "/cadastros"]
const AUTH_PATHS = ["/login", "/register", "/reset-password"]

function isPrivatePath(pathname: string) {
  return PRIVATE_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )
}

function isAuthPath(pathname: string) {
  return AUTH_PATHS.some((path) => pathname === path)
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("prumo_token")?.value

  if (isPrivatePath(pathname) && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (isAuthPath(pathname) && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/reset-password",
    "/dashboard",
    "/placar",
    "/cadastros/:path*",
  ],
}
