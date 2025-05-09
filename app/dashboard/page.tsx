import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardWelcome } from "@/components/dashboard-welcome"
import { InvestmentPackages } from "@/components/investment-packages"
import { DashboardFooter } from "@/components/dashboard-footer"

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect("/")
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <DashboardHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <DashboardWelcome />
        <InvestmentPackages />
      </main>
      <DashboardFooter />
    </div>
  )
}
