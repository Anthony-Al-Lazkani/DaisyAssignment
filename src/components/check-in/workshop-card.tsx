import Link from "next/link"
import type { Workshop } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

export function WorkshopCard({ workshop }: { workshop: Workshop }) {
  const presentCount = workshop.participants.filter((p) => p.isPresent).length
  const totalActive = workshop.participants.filter((p) => !p.hasCancelled).length
  const hasCancelled = workshop.participants.some((p) => p.hasCancelled)

  return (
    <Link
      href={`/check-in/${workshop.id}`}
      className="block p-4 rounded-xl border-2 border-border bg-card hover:border-primary/50 transition-colors"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-sm leading-tight">{workshop.title}</h3>
        {hasCancelled ? (
          <Badge variant="destructive" className="shrink-0 ml-2">Annulé</Badge>
        ) : (
          <Badge variant={workshop.fillRate >= 80 ? "default" : "secondary"} className="shrink-0 ml-2">
            {workshop.fillRate}%
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
        <span>🕐 {workshop.time}</span>
        <span>📍 {workshop.studio}</span>
        <span>⏱ {workshop.duration}min</span>
      </div>
      <div className="text-xs">
        <span className="text-primary font-medium">{presentCount}/{totalActive}</span> présents
        {" · "}
        <span>{workshop.capacity} places</span>
      </div>
    </Link>
  )
}
