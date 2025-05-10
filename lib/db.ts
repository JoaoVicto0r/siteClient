import { PrismaClient } from '@prisma/client'

declare global {
  // Garante tipagem global apenas em tempo de desenvolvimento
  var prisma: PrismaClient | undefined
}

// Função para criar uma nova instância do Prisma Client
function createPrismaClient() {
  console.log('🛠 Criando nova instância do PrismaClient...')

  const client = new PrismaClient()

  if (process.env.NODE_ENV !== 'production') {
    client
      .$connect()
      .then(() => console.log('✅ Conexão com o banco de dados estabelecida'))
      .catch((e) => {
        console.error('❌ Erro ao conectar com o banco de dados:', e)
        process.exit(1) // encerra o processo em caso de erro grave no dev
      })
  }

  return client
}

// Usa uma instância única global em dev, nova em prod
export const db = globalThis.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db
}
