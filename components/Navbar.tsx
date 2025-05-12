'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export default function TopNavbar() {
  const [darkMode, setDarkMode] = useState(false)

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark')
    setDarkMode(!darkMode)
  }

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-900 shadow-md">
      <nav className="flex gap-4">
        <Link href="/dashboard" className="text-gray-800 dark:text-white hover:underline">Dashboard</Link>
        <Link href="/carteira" className="text-gray-800 dark:text-white hover:underline">Carteira</Link>
        <Link href="/deposito" className="text-gray-800 dark:text-white hover:underline">Depósito</Link>
        <Link href="/retirada" className="text-gray-800 dark:text-white hover:underline">Retirada</Link>
        <Link href="/registro-retiradas" className="text-gray-800 dark:text-white hover:underline">Registro de Retiradas</Link>
        <Link href="/apoio" className="text-gray-800 dark:text-white hover:underline">Apoio ao Cliente</Link>
        <Link href="/logout" className="text-red-600 hover:underline">Sair</Link>
      </nav>
      <button
        onClick={toggleTheme}
        className="text-gray-800 dark:text-white p-2 rounded"
        aria-label="Alternar modo escuro"
      >
        {darkMode ? <Sun /> : <Moon />}
      </button>
    </header>
  )
}
