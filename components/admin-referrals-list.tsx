"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { getAllReferrals } from "@/lib/actions"
import { Search, Users } from "lucide-react"

interface Referral {
  id: string
  name: string
  phone: string
  createdAt: string
  isActive: boolean
  referrer: {
    id: string
    name: string
    phone: string
  } | null
}

export function AdminReferralsList() {
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [filteredReferrals, setFilteredReferrals] = useState<Referral[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        setIsLoading(true)
        const data = await getAllReferrals()

        // Converter Date para string se necessário
        const formattedData = data.map((ref: any) => ({
          ...ref,
          createdAt:
            typeof ref.createdAt === "object" && ref.createdAt instanceof Date
              ? ref.createdAt.toISOString()
              : ref.createdAt,
        }))

        setReferrals(formattedData)
        setFilteredReferrals(formattedData)
      } catch (error) {
        console.error("Erro ao buscar referências:", error)
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar as referências.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchReferrals()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredReferrals(referrals)
    } else {
      const filtered = referrals.filter(
        (referral) =>
          referral.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          referral.referrer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          false ||
          referral.referrer?.phone.includes(searchTerm) ||
          false,
      )
      setFilteredReferrals(filtered)
    }
  }, [searchTerm, referrals])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-AO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Referências
        </CardTitle>
        <CardDescription>Lista de usuários que se cadastraram através de convites.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nome ou telefone..."
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
        ) : filteredReferrals.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchTerm
              ? "Nenhuma referência encontrada com os critérios de busca."
              : "Não há referências cadastradas."}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Data de Cadastro</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Convidado por</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReferrals.map((referral) => (
                  <TableRow key={referral.id}>
                    <TableCell className="font-medium">{referral.name}</TableCell>
                    <TableCell>{referral.phone}</TableCell>
                    <TableCell>{formatDate(referral.createdAt)}</TableCell>
                    <TableCell>
                      {referral.isActive ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Ativo
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                          Inativo
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {referral.referrer ? (
                        <div>
                          <div>{referral.referrer.name}</div>
                          <div className="text-xs text-muted-foreground">{referral.referrer.phone}</div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
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
