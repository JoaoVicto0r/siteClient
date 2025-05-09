import { AdminDashboard } from "@/components/admin-dashboard"
import { AdminWithdrawalRequests } from "@/components/admin-withdrawal-requests"

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Painel de Administração</h1>
      <AdminDashboard />
      <AdminWithdrawalRequests />
    </div>
  )
}
