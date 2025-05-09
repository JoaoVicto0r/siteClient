"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { processInvestmentReturns } from "@/lib/actions"
import { BarChart3, Users, DollarSign } from "lucide-react"

export function AdminDashboard() {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleProcessReturns = async () => {
    setIsProcessing(true)
    try {
      const result = await processInvestmentReturns()
      if (result.success) {
        toast({
          title: "Retornos processados com sucesso!",
          description: `${result.processedCount} investimentos foram processados.`,
        })
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao processar retornos",
          description: result.error || "Ocorreu um erro ao processar os retornos dos investimentos.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao processar retornos",
        description: "Ocorreu um erro ao processar os retornos dos investimentos.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">Total de usuários registrados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investimentos Ativos</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">Investimentos em andamento</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total Investido</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">Soma de todos os investimentos</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Processamento de Retornos</CardTitle>
          <CardDescription>
            Processe os retornos diários de todos os investimentos ativos. Esta ação adiciona os ganhos diários ao saldo
            de retirada dos usuários.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Recomendamos executar esta ação uma vez por dia. Investimentos que atingiram sua data de término serão
            automaticamente marcados como concluídos.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleProcessReturns} disabled={isProcessing} className="w-full sm:w-auto">
            {isProcessing ? "Processando..." : "Processar Retornos Diários"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
