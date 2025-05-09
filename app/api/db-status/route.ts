import { PrismaClient } from "@prisma/client"

// Evita múltiplas instâncias do Prisma Client em dev
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Cria a instância do Prisma Client com log e tratamento
function createPrismaClient() {
  const client = new PrismaClient({
    log: [
      { emit: "stdout", level: "error" },
      { emit: "stdout", level: "warn" },
      { emit: "stdout", level: "info" },
      { emit: "event", level: "query" },
    ],
  })

  // Log de queries (útil para debug)
  client.$on("query", (e) => {
    console.log("Query:", e.query)
    console.log("Params:", e.params)
    console.log("Duration:", e.duration + "ms")
  })

  // Conexão inicial
  client.$connect().catch((error) => {
    console.error("Erro ao conectar ao banco de dados:", error)
  })

  return client
}

// Inicializa a instância única
export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db
}

// Verifica se o Prisma está funcionando
export async function isPrismaClientAvailable(): Promise<boolean> {
  try {
    await db.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error("Prisma Client não está disponível:", error)
    return false
  }
}

// Tenta reconectar ao banco
export async function reconnectPrisma(): Promise<boolean> {
  try {
    await db.$disconnect()
    await db.$connect()
    return true
  } catch (error) {
    console.error("Falha ao reconectar Prisma Client:", error)
    return false
  }
}

// Trata erros não tratados
process.on("unhandledRejection", (error) => {
  console.error("Erro não tratado no Prisma Client:", error)
})
