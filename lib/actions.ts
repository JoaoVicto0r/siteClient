"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { clearSession, createSession, getSession, hashPassword, verifyPassword } from "@/lib/auth"

// Função simples de geração de ID
function generateReferralCode() {
  return Math.random().toString(36).substring(2, 10)
}

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
export async function registerUser({
  name,
  phone,
  password,
  referralCode,
}: {
  name: string
  phone: string
  password: string
  referralCode?: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    
    if (!db) {
      console.error("Cliente Prisma não está definido")
      return { success: false, error: "Erro de conexão com o banco de dados" }
    }

    
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
     
      const existingUser = await db.user.findUnique({
        where: { phone },
      })

      if (existingUser) {
        return { success: false, error: "Este número de telefone já está registrado." }
      }

      const hashedPassword = await hashPassword(password)

      
      let referrerId = null
      if (referralCode) {
        
        const potentialReferrers = await db.user.findMany({
          where: {
            name: {
              contains: referralCode,
            },
          },
          select: {
            id: true,
          },
        })

        if (potentialReferrers.length > 0) {
          referrerId = potentialReferrers[0].id
          console.log(`Usuário sendo registrado com referência de: ${referrerId}`)
        } else {
          console.log(`Código de referência inválido: ${referralCode}`)
        }
      }

     
      const newUser = await db.user.create({
        data: {
          name: `${name}|${generateReferralCode()}`, 
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

      // Se houver um referenciador, adicionar bônus
      if (referrerId) {
        
        await db.wallet.updateMany({
          where: { userId: referrerId },
          data: {
            balance: { increment: 0 }, 
          },
        })
      }

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


async function isPrismaClientAvailable(): Promise<boolean> {
  try {
    await db.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    return false
  }
}

async function reconnectPrisma(): Promise<boolean> {
  try {
    await db.$disconnect()
    await db.$connect()
    return true
  } catch (error) {
    return false
  }
}

export async function loginUser({
  phone,
  password,
}: { phone: string; password: string }): Promise<{ success: boolean; role?: string; error?: string }> {
  try {
    
    if (!db) {
      console.error("Cliente Prisma não está definido")
      return { success: false, error: "Erro de conexão com o banco de dados" }
    }

    
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

// Função para extrair o código de referência do nome do usuário
function extractReferralCode(name: string): string {
  const parts = name.split("|")
  return parts.length > 1 ? parts[1] : generateReferralCode()
}

// Função para extrair o nome real do usuário
function extractRealName(name: string): string {
  const parts = name.split("|")
  return parts[0]
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

  // Buscar o usuário para extrair o código de referência do nome
  const user = await db.user.findUnique({
    where: { id: session.id },
  })

  if (!user) {
    throw new Error("Usuário não encontrado")
  }

  const referralCode = extractReferralCode(user.name)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://seu-site.com"

  return {
    id: session.phone,
    balance: wallet.balance,
    withdrawalBalance: wallet.withdrawalBalance,
    referralBalance: 0, // Valor padrão
    referralCode,
    referralLink: `${appUrl}/register?ref=${referralCode}`,
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
    "vip-1": { price: 6000, dailyReturn: 300, duration: 365 },
    "vip-2": { price: 15000, dailyReturn: 800, duration: 365 },
    "vip-3": { price: 31000, dailyReturn: 1800, duration: 365 },
    "vip-4": { price: 50000, dailyReturn: 3100, duration: 365 },
    "vip-5": { price: 100000, dailyReturn: 7300, duration: 365 },
    "vip-6": { price: 200000, dailyReturn: 16400, duration: 365 },
    "vip-7": { price: 500000, dailyReturn: 41666, duration: 365 },
    "vip-8": { price: 1000000, dailyReturn: 90900, duration: 365 },
    "vip-9": { price: 3000000, dailyReturn: 360000, duration: 365 },
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
    // Verificar valor mínimo de saque (2000 KZ)
    if (amount < 2000) {
      return { success: false, error: "O valor mínimo de retirada é de 2.000 AOA." }
    }

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

// Referral actions
export async function getUserReferrals() {
  const session = await getSession()

  if (!session) {
    throw new Error("Usuário não autenticado")
  }

  // Como não temos uma tabela de referências, vamos retornar uma lista vazia por enquanto
  // Em uma implementação real, você teria uma tabela para rastrear referências
  return []
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
      userName: extractRealName(req.user.name),
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
    name: extractRealName(user.name),
    phone: user.phone,
    balance: user.wallet?.balance || 0,
    withdrawalBalance: user.wallet?.withdrawalBalance || 0,
    referralBalance: 0, // Valor padrão
    referralCount: 0, // Valor padrão
    createdAt: user.createdAt,
  }))
}

export async function getAllReferrals() {
  const session = await getSession()

  if (!session || session.role !== "ADMIN") {
    throw new Error("Acesso não autorizado")
  }

  // Como não temos uma tabela de referências, vamos retornar uma lista vazia por enquanto
  return []
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
    userName: extractRealName(inv.user.name),
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
