import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as {
  prisma?: PrismaClient
}

function createPrismaClient(): PrismaClient {
  const client = new PrismaClient({
    log: [
      { emit: "event", level: "query" },
      { emit: "stdout", level: "error" },
      { emit: "stdout", level: "warn" },
      { emit: "stdout", level: "info" }
    ]
  })

  client.$on("query", (e) => {
    console.log("Query:", e.query)
    console.log("Params:", e.params)
    console.log("Duration:", e.duration + "ms")
  })

  client.$connect().catch((error) => {
    console.error("Erro ao conectar ao banco de dados:", error)
  })

  return client
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db
}
