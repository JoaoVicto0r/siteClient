import { AdminUsersList } from "@/components/admin-users-list"

// Forçar renderização dinâmica
export const dynamic = "force-dynamic"

export default function AdminUsersPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Gerenciamento de Usuários</h1>
      <AdminUsersList />
    </div>
  )
}
