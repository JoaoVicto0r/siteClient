import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { AdminUserDetails } from "@/components/admin-user-details"

// Forçar renderização dinâmica
export const dynamic = "force-dynamic"

export default async function AdminUserDetailsPage({ params }: { params: { id: string } }) {
  const session = await getSession()

  if (!session || session.role !== "ADMIN") {
    redirect("/")
  }

  const user = await db.user.findUnique({
    where: { id: params.id },
    include: {
      wallet: true,
    },
  })

  if (!user) {
    redirect("/admin/users")
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Detalhes do Usuário</h1>
      <AdminUserDetails
        user={{
          id: user.id,
          name: user.name,
          phone: user.phone,
          balance: user.wallet?.balance || 0,
          withdrawalBalance: user.wallet?.withdrawalBalance || 0,
          createdAt: user.createdAt.toISOString(), // Convertendo Date para string
        }}
      />
    </div>
  )
}
