import { db } from "./db"

export async function checkDatabaseConnection() {
  try {
    // Tenta executar uma consulta simples
    const result = await db.$queryRaw`SELECT 1 as check`
    console.log("Conexão com o banco de dados bem-sucedida:", result)
    return { success: true, message: "Conexão com o banco de dados bem-sucedida" }
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error)
    return {
      success: false,
      message: "Erro ao conectar ao banco de dados",
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
