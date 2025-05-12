
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/Navbar" // ✅ importe aqui

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TotalEnergies Investimentos",
  description: "Plataforma de investimentos TotalEnergies",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Navbar /> {/* ✅ adicione o navbar aqui */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
