"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Logo } from "@/components/logo"
import { logoutUser } from "@/lib/actions"

export function DashboardHeader() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Carteira", href: "/dashboard/wallet" },
    { name: "Depósito", href: "/dashboard/deposit" },
    { name: "Retirada", href: "/dashboard/withdrawal" },
    { name: "Registro de Retiradas", href: "/dashboard/withdrawal-history" },
    { name: "Apoio ao Cliente", href: "https://t.me/AbrahamAaliyah", external: true },
  ]

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center">
              <Logo className="h-8 w-8 mr-2" />
              <span className="text-xl font-bold text-blue-900">Totalenergies</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return item.external ? (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    isActive ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    isActive ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
            <form action={logoutUser}>
              <Button variant="ghost" size="sm" className="text-red-600">
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </form>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <div className="flex items-center justify-between">
                  <Link href="/dashboard" className="flex items-center" onClick={() => setIsOpen(false)}>
                    <Logo className="h-6 w-6 mr-2" />
                    <span className="text-lg font-bold text-blue-900">Totalenergies</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-5 w-5" />
                    <span className="sr-only">Fechar menu</span>
                  </Button>
                </div>
                <nav className="mt-8 flex flex-col space-y-3">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return item.external ? (
                      <a
                        key={item.name}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          isActive ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </a>
                    ) : (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          isActive ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )
                  })}
                  <form action={logoutUser}>
                    <Button variant="ghost" size="sm" className="text-red-600 w-full justify-start">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sair
                    </Button>
                  </form>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
