"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { registerUser } from "@/lib/actions"
import Link from "next/link"

export function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const referralCode = searchParams.get("ref") || ""

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [referral, setReferral] = useState(referralCode)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Senhas não coincidem",
        description: "Por favor, verifique se as senhas digitadas são iguais.",
      })
      setIsSubmitting(false)
      return
    }

    try {
      const result = await registerUser({ name, phone, password, referralCode: referral || undefined })

      if (result.success) {
        toast({
          title: "Registro concluído",
          description: "Sua conta foi criada com sucesso. Faça login para continuar.",
        })
        router.push("/")
      } else {
        toast({
          variant: "destructive",
          title: "Erro no registro",
          description: result.error || "Ocorreu um erro ao criar sua conta.",
        })
      }
    } catch (error) {
      console.error("Error registering user:", error)
      toast({
        variant: "destructive",
        title: "Erro no registro",
        description: "Ocorreu um erro ao criar sua conta.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Criar Conta</CardTitle>
        <CardDescription>Preencha os dados abaixo para se registrar.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              placeholder="Digite seu nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              placeholder="Digite seu número de telefone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="referral">Código de Convite (opcional)</Label>
            <Input
              id="referral"
              placeholder="Digite o código de convite, se tiver"
              value={referral}
              onChange={(e) => setReferral(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Processando..." : "Registrar"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Já tem uma conta?{" "}
          <Link href="/" className="text-blue-600 hover:underline dark:text-blue-400">
            Faça login
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}

export default RegisterForm
