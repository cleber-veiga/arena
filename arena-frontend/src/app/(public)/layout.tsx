import type { ReactNode } from "react"

type PublicLayoutProps = {
  children: ReactNode
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-muted/30 px-4 py-8 md:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md items-center justify-center">
        {children}
      </div>
    </div>
  )
}
