"use client"

import { Skeleton } from "@/components/ui/skeleton"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { addFundsToUser, addWithdrawalFundsToUser, getUserInvestments } from "@/lib/actions"
import { useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface User {
  id: string
  name: string
  phone: string
  balance: number
  withdrawalBalance: number
  createdAt: string
}

interface Investment {
  id: string
  packageId: string
  amount: number
  dailyReturn: number
  duration: number
  status: string
  startDate: string
  endDate: string
}

const addFundsSchema = z.object({
  amount: z.coerce.number().positive({
    message: "O valor deve ser maior que zero.",
  }),
})

export function AdminUserDetails({ user }: { user: User }) {
  const router = useRouter()
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)
  const [isLoadingWithdrawal, setIsLoadingWithdrawal] = useState(false)
  const [investments, setInvestments] = useState<Investment[]>([])
  const [isLoadingInvestments, setIsLoadingInvestments] = useState(true)

  const balanceForm = useForm<z.infer<typeof addFundsSchema>>({
    resolver: zodResolver(addFundsSchema),
    defaultValues: {
      amount: 0,
    },
  })

  const withdrawalForm = useForm<z.infer<typeof addFundsSchema>>({
    resolver: zodResolver(addFundsSchema),
    defaultValues: {
      amount: 0,
    },
  })

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const data = await getUserInvestments(user.id)
        setInvestments(data)
      } catch (error) {
        console.error("Erro ao buscar investimentos:", error)
      } finally {
        setIsLoadingInvestments(false)
      }
    }

    fetchInvestments()
  }, [user.id])

  async function onSubmitBalance(values: z.infer<typeof addFundsSchema>) {
    setIsLoadingBalance(true)
    try {
      const result = await addFundsToUser(user.id, values.amount)
      if (result.success) {
        toast({
          title: "Fundos adicionados com sucesso!",
          description: `${formatCurrency(values.amount)} foram adicionados ao saldo do usuário.`,
        })
        balanceForm.reset()
        router.refresh()
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao adicionar fundos",
          description: result.error || "Ocorreu um erro ao adicionar fundos.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao adicionar fundos",
        description: "Ocorreu um erro ao adicionar fundos.",
      })
    } finally {
      setIsLoadingBalance(false)
    }
  }

  async function onSubmitWithdrawal(values: z.infer<typeof addFundsSchema>) {
    setIsLoadingWithdrawal(true)
    try {
      const result = await addWithdrawalFundsToUser(user.id, values.amount)
      if (result.success) {
        toast({
          title: "Fundos de retirada adicionados com sucesso!",
          description: `${formatCurrency(values.amount)} foram adicionados ao saldo de retirada do usuário.`,
        })
        withdrawalForm.reset()
        router.refresh()
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao adicionar fundos de retirada",
          description: result.error || "Ocorreu um erro ao adicionar fundos de retirada.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao adicionar fundos de retirada",
        description: "Ocorreu um erro ao adicionar fundos de retirada.",
      })
    } finally {
      setIsLoadingWithdrawal(false)
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações do Usuário</CardTitle>
          <CardDescription>Detalhes e gerenciamento da conta do usuário.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium">Dados Pessoais</h3>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nome:</span>
                  <span className="font-medium">{user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Telefone:</span>
                  <span className="font-medium">{user.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Data de Cadastro:</span>
                  <span className="font-medium">{formatDate(user.createdAt)}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium">Informações Financeiras</h3>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Saldo da Conta:</span>
                  <span className="font-medium text-blue-600">{formatCurrency(user.balance)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Saldo de Retirada:</span>
                  <span className="font-medium text-green-600">{formatCurrency(user.withdrawalBalance)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="balance">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="balance">Adicionar Saldo</TabsTrigger>
          <TabsTrigger value="withdrawal">Adicionar Saldo de Retirada</TabsTrigger>
        </TabsList>
        <TabsContent value="balance">
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Saldo</CardTitle>
              <CardDescription>Adicione fundos ao saldo da conta do usuário para investimentos.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...balanceForm}>
                <form onSubmit={balanceForm.handleSubmit(onSubmitBalance)} className="space-y-4">
                  <FormField
                    control={balanceForm.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor (AOA)</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} step={1000} {...field} />
                        </FormControl>
                        <FormDescription>
                          Insira o valor que deseja adicionar ao saldo da conta do usuário.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoadingBalance}>
                    {isLoadingBalance ? "Adicionando..." : "Adicionar Fundos"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="withdrawal">
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Saldo de Retirada</CardTitle>
              <CardDescription>Adicione fundos ao saldo de retirada do usuário.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...withdrawalForm}>
                <form onSubmit={withdrawalForm.handleSubmit(onSubmitWithdrawal)} className="space-y-4">
                  <FormField
                    control={withdrawalForm.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor (AOA)</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} step={1000} {...field} />
                        </FormControl>
                        <FormDescription>
                          Insira o valor que deseja adicionar ao saldo de retirada do usuário.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoadingWithdrawal}>
                    {isLoadingWithdrawal ? "Adicionando..." : "Adicionar Fundos de Retirada"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Investimentos do Usuário</CardTitle>
          <CardDescription>Lista de todos os investimentos realizados pelo usuário.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingInvestments ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : investments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Este usuário não possui investimentos.</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pacote</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Retorno Diário</TableHead>
                    <TableHead>Duração</TableHead>
                    <TableHead>Data de Início</TableHead>
                    <TableHead>Data de Término</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {investments.map((investment) => (
                    <TableRow key={investment.id}>
                      <TableCell>{getPackageName(investment.packageId)}</TableCell>
                      <TableCell>{formatCurrency(investment.amount)}</TableCell>
                      <TableCell>{formatCurrency(investment.dailyReturn)}</TableCell>
                      <TableCell>{investment.duration} dias</TableCell>
                      <TableCell>{formatDate(investment.startDate)}</TableCell>
                      <TableCell>{formatDate(investment.endDate)}</TableCell>
                      <TableCell>{getStatusBadge(investment.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
