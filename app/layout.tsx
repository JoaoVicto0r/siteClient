"use client"

import TopNavbar from "@/components/TopNavbar"
import type React from "react"
import { usePathname } from "next/navigation"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const hideNavbar = pathname === "/login" // ou ajuste para sua rota de login

  return (
    <html lang="pt" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {!hideNavbar && <TopNavbar />} {/* só mostra se não for /login */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
