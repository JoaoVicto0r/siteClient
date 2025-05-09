"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { purchasePackage } from "@/lib/actions"

const packages = [
  {
    id: "vip-1",
    name: "VIP-1",
    price: 10000,
    dailyReturn: 1000,
    duration: 31,
    color: "bg-gradient-to-br from-blue-50 to-blue-100",
  },
  {
    id: "vip-2",
    name: "VIP-2",
    price: 30000,
    dailyReturn: 3000,
    duration: 31,
    color: "bg-gradient-to-br from-green-50 to-green-100",
  },
  {
    id: "vip-3",
    name: "VIP-3",
    price: 55000,
    dailyReturn: 5500,
    duration: 60,
    color: "bg-gradient-to-br from-yellow-50 to-yellow-100",
  },
  {
    id: "vip-4",
    name: "VIP-4",
    price: 75000,
    dailyReturn: 8000,
    duration: 60,
    color: "bg-gradient-to-br from-orange-50 to-orange-100",
  },
  {
    id: "vip-5",
    name: "VIP-5",
    price: 150000,
    dailyReturn: 45000,
    duration: 7,
    color: "bg-gradient-to-br from-purple-50 to-purple-100",
  },
  {
    id: "vip-6",
    name: "VIP-6",
    price: 365000,
    dailyReturn: 120000,
    duration: 7,
    color: "bg-gradient-to-br from-red-50 to-red-100",
  },
]

export function InvestmentPackages() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const handlePurchase = async (packageId: string) => {
    setIsLoading(packageId)
    try {
      const result = await purchasePackage(packageId)
      if (result.success) {
        toast({
          title: "Pacote adquirido com sucesso!",
          description: "Seu investimento foi realizado com sucesso.",
        })
        router.refresh()
      } else if (result.insufficientFunds) {
        toast({
          variant: "destructive",
          title: "Saldo insuficiente",
          description: "Você não tem saldo suficiente para adquirir este pacote.",
        })
        router.push("/dashboard/deposit")
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao adquirir pacote",
          description: result.error || "Ocorreu um erro ao tentar adquirir o pacote.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao adquirir pacote",
        description: "Ocorreu um erro ao tentar adquirir o pacote. Tente novamente mais tarde.",
      })
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Pacotes de Investimento</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <Card key={pkg.id} className={`${pkg.color} border-t-4 border-blue-500`}>
            <CardHeader>
              <CardTitle>{pkg.name}</CardTitle>
              <CardDescription>Duração: {pkg.duration} dias</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-2xl font-bold">{formatCurrency(pkg.price)}</div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Ganho diário:</span>
                  <span className="font-medium text-green-600">{formatCurrency(pkg.dailyReturn)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ganho total:</span>
                  <span className="font-medium text-green-600">{formatCurrency(pkg.dailyReturn * pkg.duration)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => handlePurchase(pkg.id)} disabled={isLoading === pkg.id}>
                {isLoading === pkg.id ? "Processando..." : "Comprar"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
