import { cookies } from "next/headers"
import { db } from "@/lib/db"
import type { User } from "@prisma/client"
import { compare, hash } from "bcryptjs"

export async function getSession() {
  try {
    const sessionId = (await cookies()).get("session")?.value

    if (!sessionId) {
      return null
    }

    // Verifica se o cliente Prisma está definido
    if (!db) {
      console.error("Cliente Prisma não está definido em getSession")
      return null
    }

    const session = await db.session.findUnique({
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
    console.error("Error getting session:", error)
    return null
  }
}

export async function createSession(user: User) {
  try {
    // Verifica se o cliente Prisma está definido
    if (!db) {
      console.error("Cliente Prisma não está definido em createSession")
      throw new Error("Erro de conexão com o banco de dados")
    }

    const session = await db.session.create({
      data: {
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
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
    console.error("Error creating session:", error)
    throw error
  }
}

export async function clearSession() {
  try {
    const sessionId = (await cookies()).get("session")?.value

    if (sessionId && db) {
      await db.session
        .delete({
          where: { id: sessionId },
        })
        .catch((error) => {
          console.error("Error deleting session:", error)
        })
    }

    (await cookies()).delete("session")
  } catch (error) {
    console.error("Error clearing session:", error)
  }
}

export async function hashPassword(password: string) {
  return hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return compare(password, hashedPassword)
}
