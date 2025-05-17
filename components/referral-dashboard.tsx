"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { getUserReferrals } from "@/lib/actions"
import { Copy, Users } from "lucide-react"



interface ReferralInfo {
  referralCode: string
  referralLink: string
}

interface Referral {
  id: string
  name: string
  createdAt: string
  isActive: boolean
}


export function ReferralDashboard({ referralInfo }: { referralInfo: ReferralInfo }) {
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [isLoading, setIsLoading] = useState(true)

  

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        setIsLoading(true)
        const data = await getUserReferrals()

        // Converter Date para string se necessário
        const formattedData = data.map((ref: any) => ({
          ...ref,
          createdAt:
            typeof ref.createdAt === "object" && ref.createdAt instanceof Date
              ? ref.createdAt.toISOString()
              : ref.createdAt,
        }))

        setReferrals(formattedData)
      } catch (error) {
        console.error("Erro ao buscar referências:", error)
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar suas referências.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchReferrals()
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Link copiado!",
      description: "O link de convite foi copiado para a área de transferência.",
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-AO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Seu Link de Convite</CardTitle>
          <CardDescription>Compartilhe este link para convidar amigos e ganhar bônus.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md flex-1 overflow-hidden">
                <p className="text-sm font-mono truncate">{referralInfo.referralLink}</p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(referralInfo.referralLink)}
                title="Copiar link"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Seu código de convite: <span className="font-mono font-medium">{referralInfo.referralCode}</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Seus Convidados</CardTitle>
            <CardDescription>Lista de pessoas que se cadastraram usando seu link.</CardDescription>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            <span>{isLoading ? "..." : referrals.length}</span>
          </Badge>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : referrals.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Você ainda não tem convidados. Compartilhe seu link para começar!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Data de Registro</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referrals.map((referral) => (
                  <TableRow key={referral.id}>
                    <TableCell>{referral.name}</TableCell>
                    <TableCell>{formatDate(referral.createdAt)}</TableCell>
                    <TableCell>
                      {referral.isActive ? (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                        >
                          Ativo
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
                        >
                          Inativo
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
