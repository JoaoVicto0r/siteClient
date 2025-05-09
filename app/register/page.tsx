import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { hashPassword } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, phone, password } = body

    if (!name || !phone || !password) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 })
    }

    const existingUser = await db.user.findUnique({
      where: { phone },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Usuário já cadastrado com este telefone" }, { status: 400 })
    }

    const hashedPassword = await hashPassword(password)

    const user = await db.user.create({
      data: {
        name,
        phone,
        password: hashedPassword,
        wallet: {
          create: {},
        },
      },
    })

    return NextResponse.json({ success: true, message: "Usuário registrado com sucesso", userId: user.id }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Falha ao registrar usuário" }, { status: 500 })
  }
}
