"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { getAllInvestments, cancelInvestment } from "@/lib/actions"
import { Search, X } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Investment {
  id: string
  userId: string
  userName: string
  userPhone: string
  packageId: string
  amount: number
  dailyReturn: number
  duration: number
  status: string
  startDate: string
  endDate: string
}

export function AdminInvestmentsList() {
  const [investments, setInvestments] = useState<Investment[]>([])
  const [filteredInvestments, setFilteredInvestments] = useState<Investment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [cancelingId, setCancelingId] = useState<string | null>(null)

  useEffect(() => {
    fetchInvestments()
  }, [])

  const fetchInvestments = async () => {
    try {
      const data = await getAllInvestments()
      setInvestments(data)
      setFilteredInvestments(data)
    } catch (error) {
      console.error("Erro ao buscar investimentos:", error)
      toast({
        variant: "destructive",
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os investimentos.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredInvestments(investments)
    } else {
      const filtered = investments.filter(
        (investment) =>
          investment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          investment.userPhone.includes(searchTerm) ||
          investment.packageId.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredInvestments(filtered)
    }
  }, [searchTerm, investments])

  const handleCancelInvestment = async (id: string) => {
    setCancelingId(id)
    try {
      const result = await cancelInvestment(id)
      if (result.success) {
        toast({
          title: "Investimento cancelado",
          description: "O investimento foi cancelado e o valor foi devolvido ao usuário.",
        })
        fetchInvestments()
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao cancelar investimento",
          description: result.error || "Ocorreu um erro ao cancelar o investimento.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao cancelar investimento",
        description: "Ocorreu um erro ao cancelar o investimento.",
      })
    } finally {
      setCancelingId(null)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-AO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const getPackageName = (packageId: string) => {
    const packages: Record<string, string> = {
      "vip-1": "VIP-1",
      "vip-2": "VIP-2",
      "vip-3": "VIP-3",
      "vip-4": "VIP-4",
      "vip-5": "VIP-5",
      "vip-6": "VIP-6",
    }
    return packages[packageId] || packageId
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Ativo
          </Badge>
        )
      case "COMPLETED":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Concluído
          </Badge>
        )
      case "CANCELLED":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Cancelado
          </Badge>
        )
      default:
        return <Badge variant="outline">Desconhecido</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Investimentos</CardTitle>
        <CardDescription>Gerencie os investimentos da plataforma.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por usuário ou pacote..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : filteredInvestments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchTerm
              ? "Nenhum investimento encontrado com os critérios de busca."
              : "Não há investimentos cadastrados."}
          </div>
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Pacote</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Retorno Diário</TableHead>
                  <TableHead>Início</TableHead>
                  <TableHead>Término</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvestments.map((investment) => (
                  <TableRow key={investment.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{investment.userName}</div>
                        <div className="text-xs text-muted-foreground">{investment.userPhone}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getPackageName(investment.packageId)}</TableCell>
                    <TableCell>{formatCurrency(investment.amount)}</TableCell>
                    <TableCell>{formatCurrency(investment.dailyReturn)}</TableCell>
                    <TableCell>{formatDate(investment.startDate)}</TableCell>
                    <TableCell>{formatDate(investment.endDate)}</TableCell>
                    <TableCell>{getStatusBadge(investment.status)}</TableCell>
                    <TableCell className="text-right">
                      {investment.status === "ACTIVE" && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline" className="text-red-600">
                              <X className="h-4 w-4 mr-2" />
                              Cancelar
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Cancelar Investimento</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja cancelar este investimento? O valor será devolvido ao saldo do
                                usuário.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleCancelInvestment(investment.id)}
                                disabled={cancelingId === investment.id}
                              >
                                {cancelingId === investment.id ? "Cancelando..." : "Confirmar"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
