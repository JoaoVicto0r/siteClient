import AdminWithdrawalRequests from "@/components/admin-withdrawal-requests"

export default function AdminPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <AdminWithdrawalRequests />
    </div>
  )
}
