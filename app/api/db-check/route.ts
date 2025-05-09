import { NextResponse } from "next/server"
import { checkDatabaseConnection } from "@/lib/db-check"

export async function GET() {
  try {
    const result = await checkDatabaseConnection()

    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json(result, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao verificar conexão com o banco de dados",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
