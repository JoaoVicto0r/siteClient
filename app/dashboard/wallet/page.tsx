import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard-header"
import { WalletInfo } from "@/components/wallet-info"
import { DashboardFooter } from "@/components/dashboard-footer"

export default async function WalletPage() {
  const session = await getSession()

  if (!session) {
    redirect("/")
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <DashboardHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Minha Carteira</h1>
        <WalletInfo />
      </main>
      <DashboardFooter />
    </div>
  )
}
