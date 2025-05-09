import { cookies } from "next/headers"
import { db } from "@/lib/db"
import type { User } from "@prisma/client"
import { compare, hash } from "bcryptjs"

export async function getSession() {
  const sessionId = cookies().get("session")?.value

  if (!sessionId) {
    return null
  }

  try {
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
  const session = await db.session.create({
    data: {
      userId: user.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  })

  cookies().set("session", session.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: session.expiresAt,
    path: "/",
  })

  return session
}

export async function clearSession() {
  const sessionId = cookies().get("session")?.value

  if (sessionId) {
    await db.session.delete({
      where: { id: sessionId },
    })
  }

  cookies().delete("session")
}

export async function hashPassword(password: string) {
  return hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return compare(password, hashedPassword)
}
