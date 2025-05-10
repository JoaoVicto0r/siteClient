import { PrismaClient } from "@prisma/client"

// Evita múltiplas instâncias do Prisma Client em desenvolvimento
const globalForPrisma = global as unknown as { prisma: PrismaClient }

// Função para criar uma nova instância do PrismaClient com tratamento de erro
function createPrismaClient() {
  try {
    const client = new PrismaClient({
      log: [
        {
          emit: "event",
          level: "query",
        },
        {
          emit: "stdout",
          level: "error",
        },
        {
          emit: "stdout",
          level: "info",
        },
        {
          emit: "stdout",
          level: "warn",
        },
      ],
    })

    // Adiciona um listener para queries (isso é suportado pelo Prisma)
    client.$on("query", (e: any) => {
      console.log("Query: " + e.query)
      console.log("Params: " + e.params)
      console.log("Duration: " + e.duration + "ms")
    })

    return client
  } catch (error) {
    console.error("Erro ao criar cliente Prisma:", error)
    throw error
  }
}

// Inicializa o cliente Prisma com verificação de disponibilidade
export const db = globalForPrisma.prisma || createPrismaClient()

// Mantém a mesma instância do Prisma Client em desenvolvimento
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db
}

// Função para verificar se o cliente Prisma está disponível
export async function isPrismaClientAvailable() {
  try {
    await db.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error("Prisma Client não está disponível:", error)
    return false
  }
}

// Função para tentar reconectar
export async function reconnectPrisma() {
  try {
    await db.$disconnect()
    await db.$connect()
    return true
  } catch (error) {
    console.error("Falha ao reconectar Prisma Client:", error)
    return false
  }
}