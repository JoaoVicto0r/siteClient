"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { logoutUser } from "@/lib/actions"
import { Logo } from "@/components/logo"

export function DashboardHeader() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Logo className="h-6 w-6" />
            <span className="font-bold">TotalEnergies</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/dashboard"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/dashboard") ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/wallet"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/dashboard/wallet") ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Carteira
            </Link>
            <Link
              href="/dashboard/deposit"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/dashboard/deposit") ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Depósito
            </Link>
            <Link
              href="/dashboard/withdrawal"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/dashboard/withdrawal") ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Retirada
            </Link>
            <Link
              href="/dashboard/withdrawal-history"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/dashboard/withdrawal-history") ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Histórico
            </Link>
            <Link
              href="/dashboard/referrals"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/dashboard/referrals") ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Referências
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <form action={logoutUser}>
            <Button variant="outline" size="sm" type="submit">
              Sair
            </Button>
          </form>
        </div>
      </div>
    </header>
  )
}
