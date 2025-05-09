import { PrismaClient } from "@prisma/client"

// Abordagem mais robusta para o singleton do Prisma
declare global {
  var prisma: PrismaClient | undefined
}

// Função para criar o cliente com tratamento de erros
function createPrismaClient() {
  console.log("Criando nova instância do PrismaClient...")

  try {
    // Criação básica do cliente - sem configurações complexas para minimizar erros
    const client = new PrismaClient()

    // Teste de conexão imediato
    client
      .$connect()
      .then(() => console.log("✅ Conexão com o banco de dados estabelecida"))
      .catch((e) => console.error("❌ Erro na conexão com o banco:", e))

    return client
  } catch (e) {
    console.error("❌ Erro ao criar PrismaClient:", e)
    throw new Error("Falha ao inicializar o cliente Prisma")
  }
}

// Inicialização com verificação explícita
export const db = global.prisma || createPrismaClient()

// Salva a referência no objeto global em desenvolvimento
if (process.env.NODE_ENV !== "production") {
  global.prisma = db
}

export default db
