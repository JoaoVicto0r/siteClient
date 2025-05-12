import { getUserWallet } from "@/lib/actions"
import { ReferralDashboard } from "@/components/referral-dashboard"

export const dynamic = "force-dynamic"

export default async function ReferralsPage() {
  const walletInfo = await getUserWallet()

  // Corrigindo o link de referência para usar o URL correto do site
  const referralInfo = {
    referralCode: walletInfo.referralCode || "",
    referralLink:
      walletInfo.referralLink ||
      `${process.env.NEXT_PUBLIC_APP_URL || "https://site-client-one.vercel.app"}/register?ref=${walletInfo.referralCode}`,
  }

  return (
    <div className="container py-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Programa de Referência</h1>
        <p className="text-muted-foreground">
          Convide amigos para a plataforma e ganhe bônus quando eles se registrarem.
        </p>

        <ReferralDashboard referralInfo={referralInfo} />
      </div>
    </div>
  )
}
