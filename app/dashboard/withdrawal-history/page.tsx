import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard-header"
import { WithdrawalHistory } from "@/components/withdrawal-history"
import { DashboardFooter } from "@/components/dashboard-footer"

// Forçar renderização dinâmica
export const dynamic = "force-dynamic"

export default async function WithdrawalHistoryPage() {
  const session = await getSession()

  if (!session) {
    redirect("/")
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <DashboardHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Histórico de Retiradas</h1>
        <WithdrawalHistory />
      </main>
      <DashboardFooter />
    </div>
  )
}
