"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { MobileMenu } from "@/components/mobile-menu"

const navigationItems = [
  { title: "Início", href: "/" },
  { title: "VIPs", href: "/vips" },
  { title: "Convites", href: "/convites" },
  { title: "Carteira", href: "/carteira" },
  { title: "Suporte", href: "/suporte" },
]

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl">
            SiteClient
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href ? "text-primary" : "text-muted-foreground",
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <MobileMenu items={navigationItems} />
          <div className="hidden md:block">
            <Button asChild>
              <Link href="/login">Entrar</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
