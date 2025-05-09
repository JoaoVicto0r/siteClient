import { cookies } from "next/headers"
import { db } from "@/lib/db"
import type { User } from "@prisma/client"
import { compare, hash } from "bcryptjs"

// Função auxiliar para verificar se o cliente Prisma está disponível
function ensurePrismaClient() {
  if (!db) {
    console.error("❌ ERRO CRÍTICO: Cliente Prisma não está disponível")
    throw new Error("Erro de conexão com o banco de dados")
  }
  return db
}

export async function getSession() {
  try {
    const sessionId = (await cookies()).get("session")?.value

    if (!sessionId) {
      return null
    }

    // Usa a função auxiliar para garantir que o cliente está disponível
    const prisma = ensurePrismaClient()

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    })

    if (!session) {
      return null
    }

    return {
      id: session.user.id,
      name: session.user.name,
      phone: session.user.phone,
      role: session.user.role,
    }
  } catch (error) {
    console.error("❌ Erro ao obter sessão:", error)
    return null
  }
}

export async function createSession(user: User) {
  try {
    // Usa a função auxiliar para garantir que o cliente está disponível
    const prisma = ensurePrismaClient()

    const session = await prisma.session.create({
      data: {
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
      },
    })
    ;(await cookies()).set("session", session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: session.expiresAt,
      path: "/",
    })

    return session
  } catch (error) {
    console.error("❌ Erro ao criar sessão:", error)
    throw error
  }
}

export async function clearSession() {
  try {
    const sessionId = (await cookies()).get("session")?.value

    if (sessionId) {
      // Usa a função auxiliar para garantir que o cliente está disponível
      const prisma = ensurePrismaClient()

      await prisma.session
        .delete({
          where: { id: sessionId },
        })
        .catch((error) => {
          console.error("❌ Erro ao excluir sessão:", error)
        })
    }
    ;(await cookies()).delete("session")
  } catch (error) {
    console.error("❌ Erro ao limpar sessão:", error)
  }
}

export async function hashPassword(password: string) {
  return hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return compare(password, hashedPassword)
}
