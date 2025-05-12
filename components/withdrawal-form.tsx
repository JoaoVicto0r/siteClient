"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { requestWithdrawal } from "@/lib/actions"

interface WithdrawalFormProps {
  withdrawalBalance: number
}

export function WithdrawalForm({ withdrawalBalance }: WithdrawalFormProps) {
  const [iban, setIban] = useState("")
  const [amount, setAmount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const amountValue = Number.parseInt(amount, 10)

      if (isNaN(amountValue) || amountValue <= 0) {
        toast({
          variant: "destructive",
          title: "Valor inválido",
          description: "Por favor, insira um valor válido para retirada.",
        })
        setIsSubmitting(false)
        return
      }

      // Verificar valor mínimo de 2000 KZ
      if (amountValue < 2000) {
        toast({
          variant: "destructive",
          title: "Valor mínimo não atingido",
          description: "O valor mínimo para retirada é de 2.000 AOA.",
        })
        setIsSubmitting(false)
        return
      }

      if (amountValue > withdrawalBalance) {
        toast({
          variant: "destructive",
          title: "Saldo insuficiente",
          description: "Você não tem saldo suficiente para esta retirada.",
        })
        setIsSubmitting(false)
        return
      }

      if (!iban.trim()) {
        toast({
          variant: "destructive",
          title: "IBAN obrigatório",
          description: "Por favor, insira seu IBAN para retirada.",
        })
        setIsSubmitting(false)
        return
      }

      const result = await requestWithdrawal({ iban, amount: amountValue })

      if (result.success) {
        toast({
          title: "Solicitação enviada",
          description: "Sua solicitação de retirada foi enviada com sucesso.",
        })
        setIban("")
        setAmount("")
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao solicitar retirada",
          description: result.error || "Ocorreu um erro ao processar sua solicitação.",
        })
      }
    } catch (error) {
      console.error("Error requesting withdrawal:", error)
      toast({
        variant: "destructive",
        title: "Erro ao solicitar retirada",
        description: "Ocorreu um erro ao processar sua solicitação.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solicitar Retirada</CardTitle>
        <CardDescription>Solicite a retirada do seu saldo disponível.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="iban">IBAN</Label>
            <Input
              id="iban"
              placeholder="Insira seu IBAN"
              value={iban}
              onChange={(e) => setIban(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Valor (AOA)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Insira o valor para retirada"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="2000"
              step="1000"
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Valor mínimo: 2.000 AOA. Saldo disponível: {formatCurrency(withdrawalBalance)}
            </p>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Processando..." : "Solicitar Retirada"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-start text-xs text-gray-500 dark:text-gray-400">
        <p>Nota: As solicitações de retirada são processadas em até 48 horas úteis.</p>
      </CardFooter>
    </Card>
  )
}
