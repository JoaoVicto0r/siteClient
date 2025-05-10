// app/api/db-check/route.js
import { NextResponse } from "next/server"
import { checkDatabaseConnection } from "@/lib/db-check"

export async function GET() {
  try {
    const result = await checkDatabaseConnection()

    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json(result, { status: 500 }) // Erro interno do servidor
    }
  } catch (error) {
    console.error('Erro ao verificar conexão:', error) // Logar o erro no servidor
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao verificar conexão com o banco de dados",
        error: error instanceof Error ? error.message : String(error), // Garantir que o erro seja tratado
      },
      { status: 500 },
    )
  }
}
