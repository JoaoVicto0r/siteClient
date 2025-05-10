"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { clearSession, createSession, getSession, hashPassword, verifyPassword } from "@/lib/auth"

// Função auxiliar para tratamento de erros
function handleDatabaseError(error: unknown, context: string) {
  console.error(`Erro em ${context}:`, error)

  // Verifica se é um erro de conexão com o banco de dados
  if (error instanceof Error && error.message.includes("PrismaClient")) {
    return {
      success: false,
      error: "Erro de conexão com o banco de dados. Por favor, tente novamente mais tarde.",
    }
  }

  return {
    success: false,
    error: "Ocorreu um erro inesperado. Por favor, tente novamente.",
  }
}

// Auth actions
export async function registerUser({ name, phone, password }: { name: string; phone: string; password: string }) {
  try {
    // Verifica se o cliente Prisma está definido
    if (!db) {
      console.error("Cliente Prisma não está definido")
      return { success: false, error: "Erro de conexão com o banco de dados" }
    }

    // Tenta reconectar se necessário
    try {
      const isAvailable = await isPrismaClientAvailable()
      if (!isAvailable) {
        console.log("Tentando reconectar ao banco de dados...")
        const reconnected = await reconnectPrisma()
        if (!reconnected) {
          return {
            success: false,
            error: "Não foi possível conectar ao banco de dados. Por favor, tente novamente mais tarde.",
          }
        }
      }
    } catch (connectionError) {
      console.error("Erro ao verificar conexão:", connectionError)
      return {
        success: false,
        error: "Erro ao verificar conexão com o banco de dados. Por favor, tente novamente mais tarde.",
      }
    }

    try {
      // Check if user already exists
      const existingUser = await db.user.findUnique({
        where: { phone },
      })

      if (existingUser) {
        return { success: false, error: "Este número de telefone já está registrado." }
      }

      const hashedPassword = await hashPassword(password)

      // Create user
      await db.user.create({
        data: {
          name,
          phone,
          password: hashedPassword,
          wallet: {
            create: {
              balance: 0,
              withdrawalBalance: 0,
            },
          },
        },
      })

      return { success: true }
    } catch (dbError) {
      console.error("Erro ao registrar usuário:", dbError)
      return {
        success: false,
        error: "Erro ao acessar o banco de dados. Por favor, tente novamente.",
      }
    }
  } catch (error) {
    return handleDatabaseError(error, "registerUser")
  }
}

// Mock functions for Prisma availability and reconnection
// Replace these with your actual implementation if needed
async function isPrismaClientAvailable(): Promise<boolean> {
  // Implement your logic to check Prisma client availability here
  // For example, you might try to ping the database
  return true // Placeholder: Assume it's always available for now
}

async function reconnectPrisma(): Promise<boolean> {
  // Implement your logic to reconnect to Prisma here
  // This might involve creating a new Prisma client instance
  return true // Placeholder: Assume reconnection is always successful for now
}

export async function loginUser({ phone, password }: { phone: string; password: string }) {
  try {
    // Verifica se o cliente Prisma está disponível
    if (!db) {
      console.error("Cliente Prisma não está definido")
      return { success: false, error: "Erro de conexão com o banco de dados" }
    }

    // Tenta reconectar se necessário
    try {
      const isAvailable = await isPrismaClientAvailable()
      if (!isAvailable) {
        console.log("Tentando reconectar ao banco de dados...")
        const reconnected = await reconnectPrisma()
        if (!reconnected) {
          return {
            success: false,
            error: "Não foi possível conectar ao banco de dados. Por favor, tente novamente mais tarde.",
          }
        }
      }
    } catch (connectionError) {
      console.error("Erro ao verificar conexão:", connectionError)
      return {
        success: false,
        error: "Erro ao verificar conexão com o banco de dados. Por favor, tente novamente mais tarde.",
      }
    }

    try {
      const user = await db.user.findUnique({
        where: { phone },
      })

      if (!user) {
        return { success: false, error: "Usuário não encontrado." }
      }

      const passwordValid = await verifyPassword(password, user.password)

      if (!passwordValid) {
        return { success: false, error: "Senha incorreta." }
      }

      // Create session
      await createSession(user)

      // Return user role for client-side redirection
      return {
        success: true,
        role: user.role,
      }
    } catch (dbError) {
      console.error("Erro ao buscar usuário:", dbError)
      return {
        success: false,
        error: "Erro ao acessar o banco de dados. Por favor, tente novamente.",
      }
    }
  } catch (error) {
    return handleDatabaseError(error, "loginUser")
  }
}

export async function logoutUser() {
  await clearSession()
  redirect("/")
}

// Wallet actions
export async function getUserWallet() {
  const session = await getSession()

  if (!session) {
    throw new Error("Usuário não autenticado")
  }

  const wallet = await db.wallet.findUnique({
    where: { userId: session.id },
  })

  if (!wallet) {
    throw new Error("Carteira não encontrada")
  }

  return {
    id: session.phone,
    balance: wallet.balance,
    withdrawalBalance: wallet.withdrawalBalance,
  }
}

// Investment actions
export async function purchasePackage(packageId: string) {
  const session = await getSession()

  if (!session) {
    return { success: false, error: "Usuário não autenticado" }
  }

  try {
    // Get package details
    const packageDetails = getPackageDetails(packageId)

    if (!packageDetails) {
      return { success: false, error: "Pacote não encontrado" }
    }

    // Check if user has enough balance
    const wallet = await db.wallet.findUnique({
      where: { userId: session.id },
    })

    if (!wallet || wallet.balance < packageDetails.price) {
      return { success: false, insufficientFunds: true, error: "Saldo insuficiente" }
    }

    // Check if user has reached the limit of 10 active investments
    const activeInvestments = await db.investment.count({
      where: {
        userId: session.id,
        status: "ACTIVE",
      },
    })

    if (activeInvestments >= 10) {
      return { success: false, error: "Você atingiu o limite de 10 investimentos ativos" }
    }

    // Create investment and update wallet
    await db.$transaction([
      db.investment.create({
        data: {
          userId: session.id,
          packageId,
          amount: packageDetails.price,
          dailyReturn: packageDetails.dailyReturn,
          duration: packageDetails.duration,
          status: "ACTIVE",
          endDate: new Date(Date.now() + packageDetails.duration * 24 * 60 * 60 * 1000),
        },
      }),
      db.wallet.update({
        where: { userId: session.id },
        data: {
          balance: { decrement: packageDetails.price },
        },
      }),
    ])

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error purchasing package:", error)
    return { success: false, error: "Ocorreu um erro ao adquirir o pacote" }
  }
}

function getPackageDetails(packageId: string) {
  const packages = {
    "vip-1": { price: 10000, dailyReturn: 1000, duration: 31 },
    "vip-2": { price: 30000, dailyReturn: 3000, duration: 31 },
    "vip-3": { price: 55000, dailyReturn: 5500, duration: 60 },
    "vip-4": { price: 75000, dailyReturn: 8000, duration: 60 },
    "vip-5": { price: 150000, dailyReturn: 45000, duration: 7 },
    "vip-6": { price: 365000, dailyReturn: 120000, duration: 7 },
  }

  return packages[packageId as keyof typeof packages]
}

// Withdrawal actions
export async function requestWithdrawal({ iban, amount }: { iban: string; amount: number }) {
  const session = await getSession()

  if (!session) {
    return { success: false, error: "Usuário não autenticado" }
  }

  try {
    // Check if user has enough withdrawal balance
    const wallet = await db.wallet.findUnique({
      where: { userId: session.id },
    })

    if (!wallet || wallet.withdrawalBalance < amount) {
      return { success: false, insufficientFunds: true, error: "Saldo de retirada insuficiente" }
    }

    // Log para depuração
    console.log(`Criando solicitação de retirada para usuário ${session.id}, valor: ${amount}, IBAN: ${iban}`)

    // Create withdrawal request and update wallet
    await db.$transaction([
      db.withdrawalRequest.create({
        data: {
          userId: session.id,
          amount,
          iban,
          status: "PENDING",
        },
      }),
      db.wallet.update({
        where: { userId: session.id },
        data: {
          withdrawalBalance: { decrement: amount },
        },
      }),
    ])

    // Revalidar os caminhos necessários
    revalidatePath("/dashboard/withdrawal-history")
    revalidatePath("/admin") // Importante: revalidar também o painel admin

    console.log("Solicitação de retirada criada com sucesso")
    return { success: true }
  } catch (error) {
    console.error("Error requesting withdrawal:", error)
    return { success: false, error: "Ocorreu um erro ao solicitar a retirada" }
  }
}

export async function getUserWithdrawals() {
  const session = await getSession()

  if (!session) {
    throw new Error("Usuário não autenticado")
  }

  const withdrawals = await db.withdrawalRequest.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: "desc" },
  })

  return withdrawals
}

// Admin actions
export async function getWithdrawalRequests() {
  const session = await getSession()

  if (!session || session.role !== "ADMIN") {
    throw new Error("Acesso não autorizado")
  }

  try {
    // Log para depuração
    console.log("Buscando solicitações de retirada para o admin")

    const requests = await db.withdrawalRequest.findMany({
      orderBy: [
        { status: "asc" }, // PENDING first
        { createdAt: "desc" },
      ],
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    })

    console.log(`Encontradas ${requests.length} solicitações de retirada`)

    return requests.map((req) => ({
      ...req,
      userName: req.user.name,
    }))
  } catch (error) {
    console.error("Erro ao buscar solicitações de retirada:", error)
    throw error
  }
}

export async function approveWithdrawal(id: string) {
  const session = await getSession()

  if (!session || session.role !== "ADMIN") {
    return { success: false, error: "Acesso não autorizado" }
  }

  try {
    await db.withdrawalRequest.update({
      where: { id },
      data: { status: "APPROVED" },
    })

    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Error approving withdrawal:", error)
    return { success: false, error: "Ocorreu um erro ao aprovar a retirada" }
  }
}

export async function rejectWithdrawal(id: string) {
  const session = await getSession()

  if (!session || session.role !== "ADMIN") {
    return { success: false, error: "Acesso não autorizado" }
  }

  try {
    // Get the withdrawal request
    const withdrawal = await db.withdrawalRequest.findUnique({
      where: { id },
      select: { userId: true, amount: true },
    })

    if (!withdrawal) {
      return { success: false, error: "Solicitação não encontrada" }
    }

    // Update withdrawal status and return funds to user's wallet
    await db.$transaction([
      db.withdrawalRequest.update({
        where: { id },
        data: { status: "REJECTED" },
      }),
      db.wallet.update({
        where: { userId: withdrawal.userId },
        data: {
          withdrawalBalance: { increment: withdrawal.amount },
        },
      }),
    ])

    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Error rejecting withdrawal:", error)
    return { success: false, error: "Ocorreu um erro ao recusar a retirada" }
  }
}

// Novas funções administrativas
export async function getAllUsers() {
  const session = await getSession()

  if (!session || session.role !== "ADMIN") {
    throw new Error("Acesso não autorizado")
  }

  const users = await db.user.findMany({
    where: { role: "USER" },
    include: {
      wallet: true,
    },
    orderBy: { createdAt: "desc" },
  })

  return users.map((user) => ({
    id: user.id,
    name: user.name,
    phone: user.phone,
    balance: user.wallet?.balance || 0,
    withdrawalBalance: user.wallet?.withdrawalBalance || 0,
    createdAt: user.createdAt,
  }))
}

export async function addFundsToUser(userId: string, amount: number) {
  const session = await getSession()

  if (!session || session.role !== "ADMIN") {
    return { success: false, error: "Acesso não autorizado" }
  }

  try {
    await db.wallet.update({
      where: { userId },
      data: {
        balance: { increment: amount },
      },
    })

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Error adding funds:", error)
    return { success: false, error: "Ocorreu um erro ao adicionar fundos" }
  }
}

export async function addWithdrawalFundsToUser(userId: string, amount: number) {
  const session = await getSession()

  if (!session || session.role !== "ADMIN") {
    return { success: false, error: "Acesso não autorizado" }
  }

  try {
    await db.wallet.update({
      where: { userId },
      data: {
        withdrawalBalance: { increment: amount },
      },
    })

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Error adding withdrawal funds:", error)
    return { success: false, error: "Ocorreu um erro ao adicionar fundos de retirada" }
  }
}

export async function getUserInvestments(userId: string) {
  const session = await getSession()

  if (!session || session.role !== "ADMIN") {
    throw new Error("Acesso não autorizado")
  }

  const investments = await db.investment.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })

  return investments
}

export async function cancelInvestment(investmentId: string) {
  const session = await getSession()

  if (!session || session.role !== "ADMIN") {
    return { success: false, error: "Acesso não autorizado" }
  }

  try {
    const investment = await db.investment.findUnique({
      where: { id: investmentId },
      select: { userId: true, amount: true },
    })

    if (!investment) {
      return { success: false, error: "Investimento não encontrado" }
    }

    await db.$transaction([
      db.investment.update({
        where: { id: investmentId },
        data: { status: "CANCELLED" },
      }),
      db.wallet.update({
        where: { userId: investment.userId },
        data: {
          balance: { increment: investment.amount },
        },
      }),
    ])

    revalidatePath("/admin/investments")
    return { success: true }
  } catch (error) {
    console.error("Error cancelling investment:", error)
    return { success: false, error: "Ocorreu um erro ao cancelar o investimento" }
  }
}

export async function getAllInvestments() {
  const session = await getSession()

  if (!session || session.role !== "ADMIN") {
    throw new Error("Acesso não autorizado")
  }

  const investments = await db.investment.findMany({
    include: {
      user: {
        select: {
          name: true,
          phone: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return investments.map((inv) => ({
    ...inv,
    userName: inv.user.name,
    userPhone: inv.user.phone,
  }))
}

export async function processInvestmentReturns() {
  const session = await getSession()

  if (!session || session.role !== "ADMIN") {
    return { success: false, error: "Acesso não autorizado" }
  }

  try {
    // Get all active investments
    const activeInvestments = await db.investment.findMany({
      where: { status: "ACTIVE" },
    })

    let processedCount = 0

    // Process each investment
    for (const investment of activeInvestments) {
      // Add daily return to user's withdrawal balance
      await db.wallet.update({
        where: { userId: investment.userId },
        data: {
          withdrawalBalance: { increment: investment.dailyReturn },
        },
      })

      processedCount++

      // Check if investment has ended
      const now = new Date()
      if (now >= investment.endDate) {
        await db.investment.update({
          where: { id: investment.id },
          data: { status: "COMPLETED" },
        })
      }
    }

    revalidatePath("/admin/dashboard")
    return { success: true, processedCount }
  } catch (error) {
    console.error("Error processing investment returns:", error)
    return { success: false, error: "Ocorreu um erro ao processar os retornos dos investimentos" }
  }
}
