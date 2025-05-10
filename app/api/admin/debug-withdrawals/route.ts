import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getSession()

    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Verificar todas as solicitações de retirada
    const allRequests = await db.withdrawalRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    })

    return NextResponse.json({
      count: allRequests.length,
      requests: allRequests.map((req) => ({
        id: req.id,
        userName: req.user.name,
        amount: req.amount,
        status: req.status,
        createdAt: req.createdAt,
      })),
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erro ao depurar solicitações de retirada:", error)
    return NextResponse.json(
      {
        error: "Erro ao depurar solicitações de retirada",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
