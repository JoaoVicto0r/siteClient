import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { AdminUserDetails } from "@/components/admin-user-details"
import { Button } from "@/components/ui/button"

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

  // Função de exclusão de usuário
  const deleteUser = async () => {
    // Primeiro, deletar a carteira associada ao usuário
    await db.wallet.delete({
      where: {
        userId: user.id,
      },
    })

    // Agora, deletar o usuário
    await db.user.delete({
      where: {
        id: user.id,
      },
    })

    // Após a exclusão, redireciona para a página de usuários
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
      
      {/* Botão de Exclusão */}
      <div className="mt-6">
        <Button variant="outline" size="sm" onClick={deleteUser}>
          Excluir Usuário
        </Button>
      </div>
    </div>
  )
}
