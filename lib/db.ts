import { PrismaClient } from "@prisma/client"

// Definição mais precisa do tipo global
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * Cria e configura uma instância do PrismaClient com as configurações de conexão
 */
function createPrismaClient(): PrismaClient {
  try {
    console.log("Inicializando novo cliente Prisma...")

    // As configurações de conexão são definidas aqui, não no schema.prisma
    const client = new PrismaClient({
      log: [
        { emit: "event", level: "query" },
        { emit: "stdout", level: "error" },
        { emit: "stdout", level: "warn" },
        { emit: "stdout", level: "info" },
      ],
      // Configurações de conexão para PostgreSQL
      // Estas são as configurações que você tentou definir no schema.prisma
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
      // Configurações avançadas de conexão
      // Nota: O Prisma Client não expõe diretamente todas as opções de conexão
      // que você tentou configurar no schema.prisma
    })

    // Configurar listeners de eventos para monitoramento
    client.$on("query", (e) => {
      console.log("Query:", e.query)
      console.log("Params:", e.params)
      console.log("Duration:", e.duration + "ms")
    })

    // Teste de conexão imediato para verificar se o banco está acessível
    client
      .$connect()
      .then(() => console.log("Conexão com o banco de dados estabelecida com sucesso"))
      .catch((error) => {
        console.error("ERRO CRÍTICO: Falha ao conectar ao banco de dados:", error)
      })

    console.log("Cliente Prisma inicializado com sucesso")
    return client
  } catch (error) {
    console.error("ERRO CRÍTICO: Falha ao criar cliente Prisma:", error)
    // Em caso de erro na criação do cliente, criamos um cliente básico
    return new PrismaClient()
  }
}

// Inicialização do cliente Prisma como singleton
let prismaInstance: PrismaClient

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = createPrismaClient()
  prismaInstance = globalForPrisma.prisma
  console.log("Cliente Prisma global criado")
} else {
  prismaInstance = globalForPrisma.prisma
  console.log("Usando cliente Prisma global existente")
}

// Exportamos a instância do cliente
export const db = prismaInstance

// Exportação padrão para compatibilidade
export default db
