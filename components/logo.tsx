import { CircleDollarSign } from "lucide-react"

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={`text-blue-600 ${className}`}>
      <CircleDollarSign className="w-full h-full" />
    </div>
  )
}
