import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Apenas tenta query se a URL estiver presente
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL não definida.')
    }

    await db.$queryRaw`SELECT 1`
    return NextResponse.json({ ok: true, message: 'Conexão OK com o banco' })
  } catch (error: any) {
    console.error('Erro ao verificar conexão com o banco:', error)
    return NextResponse.json(
      { ok: false, message: 'Erro na conexão', error: error?.message },
      { status: 500 }
    )
  }
}
