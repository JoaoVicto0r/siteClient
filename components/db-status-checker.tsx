"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react"

export function DbStatusChecker() {
  const [status, setStatus] = useState<"loading" | "connected" | "error">("loading")
  const [message, setMessage] = useState<string>("")
  const [isChecking, setIsChecking] = useState(false)
  const [lastChecked, setLastChecked] = useState<string | null>(null)

  const checkDbStatus = async () => {
    setIsChecking(true)
    setStatus("loading")

    try {
      const response = await fetch("/api/db-status")
      const data = await response.json()

      if (data.success) {
        setStatus("connected")
        setMessage(data.message)
        toast({
          title: "Conexão bem-sucedida",
          description: data.message,
        })
      } else {
        setStatus("error")
        setMessage(data.message || "Erro ao conectar ao banco de dados")
        toast({
          variant: "destructive",
          title: "Erro de conexão",
          description: data.message || "Erro ao conectar ao banco de dados",
        })
      }
    } catch (error) {
      setStatus("error")
      setMessage("Erro ao verificar status do banco de dados")
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível verificar o status do banco de dados",
      })
    } finally {
      setIsChecking(false)
      setLastChecked(new Date().toLocaleTimeString())
    }
  }

  useEffect(() => {
    checkDbStatus()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Status do Banco de Dados
          {status === "connected" ? (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="h-4 w-4 mr-1" /> Conectado
            </Badge>
          ) : status === "error" ? (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              <AlertCircle className="h-4 w-4 mr-1" /> Erro
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              <RefreshCw className="h-4 w-4 mr-1 animate-spin" /> Verificando
            </Badge>
          )}
        </CardTitle>
        <CardDescription>Verifique o status da conexão com o banco de dados</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm">{message || "Verificando status da conexão..."}</p>
          {lastChecked && <p className="text-xs text-gray-500">Última verificação: {lastChecked}</p>}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={checkDbStatus} disabled={isChecking} className="w-full">
          {isChecking ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Verificando...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Verificar Novamente
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
