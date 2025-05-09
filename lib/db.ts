import { PrismaClient } from "@prisma/client"

declare global {
  var prisma: PrismaClient | undefined
}

function createPrismaClient() {
  console.log("🛠 Criando nova instância do PrismaClient...")

  const client = new PrismaClient()

  // Conecta e loga o status
  client
    .$connect()
    .then(() => console.log("✅ Conexão com o banco de dados estabelecida"))
    .catch((e) => console.error("❌ Erro ao conectar com o banco de dados:", e))

  return client
}

// Usa globalThis para compatibilidade moderna (em dev)
export const db = globalThis.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db
}
