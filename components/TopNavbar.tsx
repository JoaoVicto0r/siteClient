'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Sun, Moon } from 'lucide-react'

export default function TopNavbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark')
    setDarkMode(!darkMode)
  }

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md w-full">
      <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
        {/* Menu toggle button on mobile */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menu">
          {menuOpen ? <X className="text-black dark:text-white" /> : <Menu className="text-black dark:text-white" />}
        </button>

        {/* Links */}
        <nav className={`flex-col md:flex-row md:flex gap-4 ${menuOpen ? 'flex' : 'hidden'} md:items-center`}>
          <Link href="/dashboard" className="text-black dark:text-white hover:underline">Dashboard</Link>
          <Link href="/carteira" className="text-black dark:text-white hover:underline">Carteira</Link>
          <Link href="/deposito" className="text-black dark:text-white hover:underline">Depósito</Link>
          <Link href="/retirada" className="text-black dark:text-white hover:underline">Retirada</Link>
          <Link href="/registro-retiradas" className="text-black dark:text-white hover:underline">Registro de Retiradas</Link>
          <Link href="/apoio" className="text-black dark:text-white hover:underline">Apoio ao Cliente</Link>
          <Link href="/logout" className="text-red-600 hover:underline">Sair</Link>
        </nav>

        {/* Botão tema escuro */}
        <button onClick={toggleTheme} className="text-black dark:text-white p-2 rounded" aria-label="Alternar modo escuro">
          {darkMode ? <Sun /> : <Moon />}
        </button>
      </div>
    </header>
  )
}
