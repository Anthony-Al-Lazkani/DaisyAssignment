import { ReactNode } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface StateWrapperProps {
  loading: boolean
  error: string | null
  data: unknown
  emptyMessage?: string
  children: ReactNode
  onRetry?: () => void
}

export function StateWrapper({
  loading,
  error,
  data,
  emptyMessage = "Aucune donnée",
  children,
  onRetry,
}: StateWrapperProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <span className="text-4xl">😵</span>
        <p className="text-muted-foreground">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-primary underline text-sm"
          >
            Réessayer
          </button>
        )}
      </div>
    )
  }

  if (!data || (Array.isArray(data) && data.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <span className="text-4xl">📭</span>
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return <>{children}</>
}
