import Link from "next/link"
import { Sparkles } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
      <Link href="/" className="flex items-center gap-2 group w-fit">
        <Sparkles className="w-5 h-5 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
        <span className="text-xl font-bold text-primary">Daisy Pro</span>
      </Link>
    </header>
  )
}
