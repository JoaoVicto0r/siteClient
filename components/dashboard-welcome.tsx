"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle } from "lucide-react"

export function DashboardWelcome() {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Bem-vindo à Totalenergies</CardTitle>
        <CardDescription>Faça o seu investimento para receber o rendimento diariamente</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-gray-700">
          Entre no nosso grupo do Telegram para ficar por dentro de todas as novidades e atualizações da plataforma.
        </p>
        <Button asChild className="w-full sm:w-auto">
          <Link href="https://t.me/+B77-HB5HIT8zMjM0" target="_blank" rel="noopener noreferrer">
            <MessageCircle className="mr-2 h-4 w-4" />
            Grupo do Telegram
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
