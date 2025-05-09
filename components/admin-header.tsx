"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut, Menu, Users, BarChart3, DollarSign, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Logo } from "@/components/logo"
import { logoutUser } from "@/lib/actions"

export function AdminHeader() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: BarChart3 },
    { name: "Usuários", href: "/admin/users", icon: Users },
    { name: "Investimentos", href: "/admin/investments", icon: DollarSign },
  ]

  return (
    <header className="bg-gray-900 text-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/admin" className="flex items-center">
              <Logo className="h-8 w-8 mr-2 text-white" />
              <span className="text-xl font-bold">Totalenergies Admin</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium rounded-md flex items-center ${
                    isActive ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Link>
              )
            })}
            <form action={logoutUser}>
              <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-gray-800">
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </form>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px] bg-gray-900 text-white">
                <div className="flex items-center justify-between">
                  <Link href="/admin" className="flex items-center" onClick={() => setIsOpen(false)}>
                    <Logo className="h-6 w-6 mr-2 text-white" />
                    <span className="text-lg font-bold">Totalenergies Admin</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white">
                    <X className="h-5 w-5" />
                    <span className="sr-only">Fechar menu</span>
                  </Button>
                </div>
                <nav className="mt-8 flex flex-col space-y-3">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`px-3 py-2 text-sm font-medium rounded-md flex items-center ${
                          isActive ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {item.name}
                      </Link>
                    )
                  })}
                  <form action={logoutUser}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:text-white hover:bg-gray-800 w-full justify-start"
                    >
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
