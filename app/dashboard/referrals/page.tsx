import { getUserWallet } from "@/lib/actions"
import { ReferralDashboard } from "@/components/referral-dashboard"
import { DashboardHeader } from "@/components/dashboard-header"
import { PageHeader } from "@/components/page-header"

export const dynamic = "force-dynamic"

export default async function ReferralsPage() {
  const walletInfo = await getUserWallet()

  // Corrigindo o link de referência para usar o URL correto do site
  const referralInfo = {
    referralCode: walletInfo.referralCode || "",
    // Usando o URL correto do site
    referralLink: `https://site-client-one.vercel.app/register?ref=${walletInfo.referralCode}`,
  }

  return (
    <>
      <DashboardHeader />
      <div className="container py-6">
        <PageHeader
          heading="Programa de Referência"
          text="Convide amigos para a plataforma e ganhe bônus quando eles se registrarem."
        />
        <ReferralDashboard referralInfo={referralInfo} />
      </div>
    </>
  )
}
