// lib/db-check.js
import { Client } from 'pg'

export async function checkDatabaseConnection() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL, // Certifique-se de que DATABASE_URL está no seu .env
  })

  try {
    // Tentando conectar ao banco
    await client.connect()
    await client.query('SELECT NOW()') // Consulta simples para verificar a conexão
    return { success: true, message: 'Conexão bem-sucedida' }
  } catch (error) {
    // Em caso de erro, retornamos o erro na resposta
    return { success: false, message: 'Erro ao conectar ao banco de dados', error: error instanceof Error ? error.message : String(error) }
  } finally {
    // Fechar a conexão com o banco de dados independentemente de sucesso ou erro
    await client.end()
  }
}
