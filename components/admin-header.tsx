"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { logoutUser } from "@/lib/actions"
import { Logo } from "@/components/logo"
import { MobileMenu } from "@/components/mobile-menu"

export function AdminHeader() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  // Definindo os itens de navegação
  const navItems = [
    { title: "Dashboard", href: "/admin" },
    { title: "Usuários", href: "/admin/users" },
    { title: "Investimentos", href: "/admin/investments" },
    { title: "Referências", href: "/admin/referrals" },
    { title: "Diagnósticos", href: "/admin/diagnostics" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/admin" className="flex items-center space-x-2">
            <Logo className="h-6 w-6" />
            <span className="font-bold">TotalEnergies Admin</span>
          </Link>

          {/* Menu Mobile - visível em dispositivos móveis */}
          <MobileMenu items={navItems} />

          {/* Navegação Desktop - visível em telas maiores */}
          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.href) ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {item.title}
              </Link>
            ))}
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
