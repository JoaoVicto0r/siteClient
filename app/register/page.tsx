import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { hashPassword } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    // Verificação explícita do cliente Prisma
    if (!db) {
      console.error("❌ Cliente Prisma não disponível na rota de registro")
      return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
    }

    const body = await request.json()
    const { name, phone, password } = body

    if (!name || !phone || !password) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 })
    }

    console.log("🔍 Verificando se o usuário já existe...")

    // Verificar se o usuário já existe
    const existingUser = await db.user.findUnique({
      where: { phone },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Usuário já cadastrado com este telefone" }, { status: 400 })
    }

    console.log("🔐 Gerando hash da senha...")
    const hashedPassword = await hashPassword(password)

    console.log("👤 Criando novo usuário...")
    // Criar o usuário
    const user = await db.user.create({
      data: {
        name,
        phone,
        password: hashedPassword,
        // Criar carteira automaticamente
        wallet: {
          create: {},
        },
      },
    })

    console.log("✅ Usuário criado com sucesso:", user.id)

    return NextResponse.json(
      {
        success: true,
        message: "Usuário registrado com sucesso",
        userId: user.id,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("❌ Erro ao registrar usuário:", error)
    return NextResponse.json({ error: "Falha ao registrar usuário" }, { status: 500 })
  }
}