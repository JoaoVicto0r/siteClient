import { Prisma, PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: [
      { emit: "event", level: "query" },
      { emit: "stdout", level: "error" },
      { emit: "stdout", level: "info" },
      { emit: "stdout", level: "warn" },
    ],
  })

prisma.$on("query", (e: Prisma.QueryEvent) => {
  console.log("Query:", e.query)
  console.log("Params:", e.params)
  console.log("Duration:", e.duration + "ms")
})

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export const db = prisma

// Verificação opcional
export async function isPrismaClientAvailable() {
  try {
    await db.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error("Prisma Client não está disponível:", error)
    return false
  }
}

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
