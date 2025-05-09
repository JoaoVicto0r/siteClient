import { Logo } from "@/components/logo"

export function DashboardFooter() {
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center">
          <Logo className="h-8 w-8 mb-2" />
          <p className="text-sm text-gray-500 max-w-3xl mx-auto">
            A TotalEnergies é uma empresa global de energia integrada que produz e comercializa diversos tipos de
            energia, incluindo petróleo, gás, eletricidade e energias renováveis, com um foco na transição energética e
            na neutralidade de carbono. A empresa opera em mais de 120 países e tem como objetivo fornecer energias mais
            acessíveis, sustentáveis e confiáveis.
          </p>
          <div className="mt-4 text-xs text-gray-400">
            © {new Date().getFullYear()} Totalenergies. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  )
}
