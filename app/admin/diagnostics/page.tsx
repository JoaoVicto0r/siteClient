import { DbStatusChecker } from "@/components/db-status-checker"

// Forçar renderização dinâmica
export const dynamic = "force-dynamic"

export default function DiagnosticsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Diagnóstico do Sistema</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DbStatusChecker />

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Informações do Ambiente</h2>
          <div className="bg-gray-50 p-4 rounded-md border">
            <pre className="text-xs overflow-auto">
              {`NODE_ENV: ${process.env.NODE_ENV}
VERCEL_ENV: ${process.env.VERCEL_ENV || "não definido"}
DATABASE_URL: ${process.env.DATABASE_URL ? "******" : "não definido"}`}
            </pre>
          </div>

          <h2 className="text-xl font-semibold mt-6">Dicas de Solução de Problemas</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>Verifique se as variáveis de ambiente estão configuradas corretamente</li>
            <li>Certifique-se de que o banco de dados está acessível a partir do seu ambiente</li>
            <li>Verifique se você não atingiu limites de conexão do seu provedor de banco de dados</li>
            <li>Tente reiniciar o servidor de desenvolvimento</li>
            <li>Considere usar um banco de dados local para desenvolvimento</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
