// app/api/db-status/route.ts
import { NextResponse } from 'next/server';
import { checkDatabaseConnection } from '@/lib/db-check';

export async function GET() {
  try {
    const result = await checkDatabaseConnection();
    return NextResponse.json(result, { status: result.success ? 200 : 500 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Erro interno ao verificar o status do banco',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
