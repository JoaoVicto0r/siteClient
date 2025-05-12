import { AdminReferralsList } from "@/components/admin-referrals-list"

export const dynamic = "force-dynamic"

export default function AdminReferralsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Gerenciamento de Referências</h1>
      <p className="text-gray-500 dark:text-gray-400">
        Visualize e gerencie as referências entre usuários da plataforma.
      </p>

      <AdminReferralsList />
    </div>
  )
}
