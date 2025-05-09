import type React from "react"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { AdminHeader } from "@/components/admin-header"

// Forçar renderização dinâmica
export const dynamic = "force-dynamic"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session || session.role !== "ADMIN") {
    redirect("/")
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AdminHeader />
      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
