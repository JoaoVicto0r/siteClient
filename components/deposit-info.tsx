"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CopyIcon, ExternalLink } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export function DepositInfo() {
  const bankInfo = {
    bank: "Banco Atlântico",
    iban: "0055 0000 06300963101 98",
    name: "Faustino Muxibe",
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copiado!",
      description: "Informação copiada para a área de transferência.",
    })
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Informações de Depósito</CardTitle>
        <CardDescription>
          Faça um depósito para a conta abaixo e envie o comprovativo para ativar o saldo na sua conta.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">Banco:</span>
            <span>{bankInfo.bank}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">IBAN:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono">{bankInfo.iban}</span>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopy(bankInfo.iban)}>
                <CopyIcon className="h-4 w-4" />
                <span className="sr-only">Copiar IBAN</span>
              </Button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Nome:</span>
            <span>{bankInfo.name}</span>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 text-yellow-800">
          <p className="text-sm">
            <strong>Importante:</strong> Após realizar o depósito, envie o comprovativo através do WhatsApp para ativar
            o saldo na sua conta.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href="https://wa.me/244954356251" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            Enviar Comprovativo
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
