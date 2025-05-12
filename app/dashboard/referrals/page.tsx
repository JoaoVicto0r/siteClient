import { getUserWallet } from "@/lib/actions"
import { ReferralDashboard } from "@/components/referral-dashboard"

export const dynamic = "force-dynamic"

export default async function ReferralsPage() {
  const walletInfo = await getUserWallet()

  const referralInfo = {
    referralCode: walletInfo.referralCode || "",
    referralLink: walletInfo.referralLink || `${process.env.NEXT_PUBLIC_APP_URL || "https://seu-site.com"}/register`,
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Programa de Referência</h1>
      <p className="text-gray-500 dark:text-gray-400">
        Convide amigos para a plataforma e ganhe bônus quando eles se registrarem.
      </p>

      <ReferralDashboard referralInfo={referralInfo} />
    </div>
  )
}
