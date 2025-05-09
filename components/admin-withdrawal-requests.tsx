"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { getWithdrawalRequests, approveWithdrawal, rejectWithdrawal } from "@/lib/actions"

interface WithdrawalRequest {
  id: string
  userId: string
  userName: string
  amount: number
  iban: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  createdAt: string
}

export function AdminWithdrawalRequests() {
  const [requests, setRequests] = useState<WithdrawalRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      setIsLoading(true)
      const data = await getWithdrawalRequests()
      setRequests(data)
    } catch (error) {
      console.error("Erro ao buscar solicitações de retirada:", error)
      toast({
        variant: "destructive",
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as solicitações de retirada.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    setProcessingId(id)
    try {
      const result = await approveWithdrawal(id)
      if (result.success) {
        toast({
          title: "Solicitação aprovada",
          description: "A solicitação de retirada foi aprovada com sucesso.",
        })
        fetchRequests()
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao aprovar solicitação",
          description: result.error || "Ocorreu um erro ao aprovar a solicitação.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao aprovar solicitação",
        description: "Ocorreu um erro ao aprovar a solicitação.",
      })
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (id: string) => {
    setProcessingId(id)
    try {
      const result = await rejectWithdrawal(id)
      if (result.success) {
        toast({
          title: "Solicitação recusada",
          description: "A solicitação de retirada foi recusada.",
        })
        fetchRequests()
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao recusar solicitação",
          description: result.error || "Ocorreu um erro ao recusar a solicitação.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao recusar solicitação",
        description: "Ocorreu um erro ao recusar a solicitação.",
      })
    } finally {
      setProcessingId(null)
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
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pendente
          </Badge>
        )
      case "APPROVED":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Aprovado
          </Badge>
        )
      case "REJECTED":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Recusado
          </Badge>
        )
      default:
        return <Badge variant="outline">Desconhecido</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solicitações de Retirada</CardTitle>
        <CardDescription>Gerencie as solicitações de retirada dos usuários.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Não há solicitações de retirada pendentes.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>IBAN</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{formatDate(request.createdAt)}</TableCell>
                  <TableCell>{request.userName}</TableCell>
                  <TableCell className="font-mono text-xs">{request.iban}</TableCell>
                  <TableCell>{formatCurrency(request.amount)}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    {request.status === "PENDING" && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800"
                          onClick={() => handleApprove(request.id)}
                          disabled={processingId === request.id}
                        >
                          Aprovar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:text-red-800"
                          onClick={() => handleReject(request.id)}
                          disabled={processingId === request.id}
                        >
                          Recusar
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
