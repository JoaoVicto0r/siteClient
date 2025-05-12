"use client"

import { usePathname } from "next/navigation"
import { ReactNode } from "react"
import TopNavbar from "@/components/TopNavbar"

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname === "/login" // ajuste se o path for diferente

  return (
    <>
      {!isAuthPage && <TopNavbar />}
      {children}
    </>
  )
}
