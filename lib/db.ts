import { PrismaClient } from "@prisma/client"

// Evita múltiplas instâncias do Prisma Client em desenvolvimento
const globalForPrisma = global as unknown as { prisma: PrismaClient }

// Função para criar uma nova instância do PrismaClient com tratamento de erro
function createPrismaClient() {
  try {
    const client = new PrismaClient({
      log: ["error"],
    })

    // Teste de conexão
    client.$connect()

    return client
  } catch (error) {
    console.error("Erro ao criar cliente Prisma:", error)
    throw error
  }
}

// Inicializa o cliente Prisma
export const db = globalForPrisma.prisma || createPrismaClient()

// Mantém a mesma instância do Prisma Client em desenvolvimento
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db
}

// Adiciona um manipulador de erros não tratados
process.on("unhandledRejection", (error) => {
  console.error("Erro não tratado no Prisma Client:", error)
})
