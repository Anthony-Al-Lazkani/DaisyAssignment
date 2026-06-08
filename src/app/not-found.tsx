import Link from "next/link"
import { Compass } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
        <Compass className="w-8 h-8 text-primary" />
      </div>
      <div className="space-y-2">
        <h1 className="text-xl font-bold">Page introuvable</h1>
        <p className="text-muted-foreground text-sm max-w-xs">
          Cette page n'existe pas ou a été déplacée.
        </p>
      </div>
      <Link
        href="/"
        className="inline-flex items-center justify-center h-8 gap-1.5 px-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium whitespace-nowrap hover:bg-primary/80 transition-colors min-w-[140px]"
      >
        Retour à l'accueil
      </Link>
    </div>
  )
}
