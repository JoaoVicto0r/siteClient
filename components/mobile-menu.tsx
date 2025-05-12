"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

// Definindo o tipo dos itens
interface NavItem {
  title: string
  href: string
}

interface MobileMenuProps {
  items: NavItem[]
}

export function MobileMenu({ items }: MobileMenuProps) {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <div className="pt-6 pl-6">
          <h1 className="text-xl font-bold">TotalEnergies</h1>
        </div>
        <nav className="flex flex-col gap-4 mt-8 px-6">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-2 py-1 rounded-md ${
                pathname === item.href ? "bg-accent font-medium" : "text-muted-foreground"
              }`}
              onClick={() => setOpen(false)}
            >
              {item.title}
            </Link>
          ))}

          {/* Botão de Sair */}
          <button
            onClick={() => {
              setOpen(false)
              // Aqui você pode chamar signOut() se estiver usando NextAuth
              console.log("Usuário saiu")
            }}
            className="px-2 py-1 rounded-md text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
          >
            Sair
          </button>

          <div className="mt-4">
            <ThemeToggle />
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
