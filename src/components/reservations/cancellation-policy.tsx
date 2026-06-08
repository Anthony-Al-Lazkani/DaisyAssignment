import type { Reservation } from "@/lib/types"

export function CancellationPolicy({ policy }: { policy: Reservation["cancellationPolicy"] }) {
  const deadlineDate = new Date(policy.deadline)
  const formattedDeadline = deadlineDate.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="rounded-xl border-2 border-border bg-card p-4 space-y-2">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Politique d'annulation</h3>
      <p className="text-sm">
        Annulation possible jusqu'au <strong>{formattedDeadline}</strong>
      </p>
      <p className="text-sm text-muted-foreground">
        Frais d'annulation : <strong className="text-destructive">{policy.feePercent}%</strong> du montant
      </p>
    </div>
  )
}
