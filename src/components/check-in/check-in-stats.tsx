import type { Participant } from "@/lib/types"

export function CheckInStats({ participants }: { participants: Participant[] }) {
  const active = participants.filter((p) => !p.hasCancelled)
  const present = active.filter((p) => p.isPresent)
  const absent = active.filter((p) => !p.isPresent)

  return (
    <div className="flex gap-4 text-sm">
      <div className="flex items-center gap-1">
        <span className="w-2.5 h-2.5 rounded-full bg-primary" />
        <span className="text-muted-foreground">{present.length} présent{present.length !== 1 ? "s" : ""}</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
        <span className="text-muted-foreground">{absent.length} absent{absent.length !== 1 ? "s" : ""}</span>
      </div>
      <div className="text-muted-foreground">
        / {active.length} inscrit{active.length !== 1 ? "s" : ""}
      </div>
    </div>
  )
}
