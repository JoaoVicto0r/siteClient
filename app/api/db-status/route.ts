import { PrismaClient } from "@prisma/client";

// Define um tipo global para armazenar o client em desenvolvimento
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// Cria nova instância do Prisma Client
function createPrismaClient(): PrismaClient {
  const client = new PrismaClient({
    log: [
      { emit: "stdout", level: "error" },
      { emit: "stdout", level: "warn" },
      { emit: "stdout", level: "info" },
      { emit: "event", level: "query" },
    ],
  });

  // Apenas em desenvolvimento: log detalhado de queries
  if (process.env.NODE_ENV === "development") {
    client.$on("query", (e) => {
      console.log("📦 Prisma Query:", e.query);
      console.log("📎 Params:", e.params);
      console.log("⏱️ Duration:", `${e.duration}ms`);
    });
  }

  return client;
}

// Usa instância única em dev para evitar problemas de hot reload
export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

// Verifica se o Prisma está funcionando corretamente
export async function isPrismaClientAvailable(): Promise<boolean> {
  try {
    await db.$queryRawUnsafe("SELECT 1"); // queryRawUnsafe para evitar erros de tag template
    return true;
  } catch (error) {
    console.error("❌ Prisma Client indisponível:", error);
    return false;
  }
}

// Função para tentar reconectar manualmente
export async function reconnectPrisma(): Promise<boolean> {
  try {
    await db.$disconnect();
    await db.$connect();
    return true;
  } catch (error) {
    console.error("❌ Falha ao reconectar Prisma Client:", error);
    return false;
  }
}

// Trata rejeições não capturadas globalmente
process.on("unhandledRejection", (reason) => {
  console.error("⚠️ Rejeição não tratada:", reason);
});
