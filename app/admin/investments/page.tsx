import { AdminInvestmentsList } from "@/components/admin-investments-list"

export default function AdminInvestmentsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Gerenciamento de Investimentos</h1>
      <AdminInvestmentsList />
    </div>
  )
}
