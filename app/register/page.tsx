import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import RegisterForm from "@/components/register-form"
import { Logo } from "@/components/logo"

export default async function RegisterPage() {
  const session = await getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center text-center">
          <Logo className="h-16 w-16 mb-4" />
          <h1 className="text-3xl font-bold text-blue-900">Totalenergies</h1>
          <p className="text-gray-600 mt-2">Crie sua conta</p>
        </div>
        <RegisterForm />
      </div>
    </main>
  )
}
