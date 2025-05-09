"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getUserWallet } from "@/lib/actions"

interface WalletData {
  id: string
  balance: number
  withdrawalBalance: number
}

export function WalletInfo() {
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const data = await getUserWallet()
        setWallet(data)
      } catch (error) {
        console.error("Erro ao buscar dados da carteira:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWallet()
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Saldo da Conta</CardTitle>
          <CardDescription>Saldo disponível para investimentos</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(wallet?.balance || 0)}</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Saldo de Retirada</CardTitle>
          <CardDescription>Saldo disponível para retirada</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <div className="text-2xl font-bold text-green-600">{formatCurrency(wallet?.withdrawalBalance || 0)}</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ID da Conta</CardTitle>
          <CardDescription>Seu número de identificação</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <div className="text-2xl font-bold">{wallet?.id || "N/A"}</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
