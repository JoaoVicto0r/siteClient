"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { requestWithdrawal } from "@/lib/actions"

const formSchema = z.object({
  iban: z.string().min(10, {
    message: "O IBAN deve ter pelo menos 10 caracteres.",
  }),
  amount: z.coerce.number().min(5000, {
    message: "O valor mínimo de retirada é de 5.000 AOA.",
  }),
})

export function WithdrawalForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      iban: "",
      amount: 5000,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const result = await requestWithdrawal(values)
      if (result.success) {
        toast({
          title: "Solicitação enviada com sucesso!",
          description: "Sua solicitação de retirada foi enviada e está em análise.",
        })
        form.reset()
        router.push("/dashboard/withdrawal-history")
      } else if (result.insufficientFunds) {
        toast({
          variant: "destructive",
          title: "Saldo insuficiente",
          description: "Você não tem saldo suficiente para esta retirada.",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao solicitar retirada",
          description: result.error || "Ocorreu um erro ao solicitar a retirada.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao solicitar retirada",
        description: "Ocorreu um erro ao solicitar a retirada. Tente novamente mais tarde.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Solicitar Retirada</CardTitle>
        <CardDescription>
          Preencha os dados abaixo para solicitar uma retirada. O valor mínimo é de 5.000 AOA.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="iban"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IBAN</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu IBAN" {...field} />
                  </FormControl>
                  <FormDescription>Insira o IBAN da conta bancária para receber o valor.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor (AOA)</FormLabel>
                  <FormControl>
                    <Input type="number" min={5000} step={1000} {...field} />
                  </FormControl>
                  <FormDescription>O valor mínimo de retirada é de 5.000 AOA (5% do valor investido).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Enviando solicitação..." : "Solicitar Retirada"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-gray-500">
        As solicitações de retirada são processadas em até 24 horas úteis.
      </CardFooter>
    </Card>
  )
}
