"use client"

import { useEffect } from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-destructive" />
      </div>
      <div className="space-y-2">
        <h1 className="text-xl font-bold">Oups !</h1>
        <p className="text-muted-foreground text-sm max-w-xs">
          Quelque chose s'est mal passé. Pas d'inquiétude — vous pouvez réessayer.
        </p>
      </div>
      <Button onClick={reset} className="min-w-[140px]">
        Réessayer
      </Button>
    </div>
  )
}
