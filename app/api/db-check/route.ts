import { NextResponse } from "next/server"
import { db, isPrismaClientAvailable, reconnectPrisma } from "@/lib/db"

export async function GET() {
  try {
    // Verifica se o cliente Prisma está disponível
    const isAvailable = await isPrismaClientAvailable()

    if (!isAvailable) {
      // Tenta reconectar
      console.log("Tentando reconectar ao banco de dados...")
      const reconnected = await reconnectPrisma()

      if (!reconnected) {
        return NextResponse.json(
          {
            success: false,
            message: "Não foi possível conectar ao banco de dados",
            timestamp: new Date().toISOString(),
          },
          { status: 500 },
        )
      }

      return NextResponse.json({
        success: true,
        message: "Reconectado ao banco de dados com sucesso",
        timestamp: new Date().toISOString(),
      })
    }

    // Tenta executar uma consulta simples
    const result = await db.$queryRaw`SELECT 1 as check`

    return NextResponse.json({
      success: true,
      message: "Conexão com o banco de dados está funcionando",
      data: result,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erro ao verificar status do banco de dados:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Erro ao verificar status do banco de dados",
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}