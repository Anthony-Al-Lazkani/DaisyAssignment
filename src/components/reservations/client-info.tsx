import type { Reservation } from "@/lib/types"

export function ClientInfo({ client }: { client: Reservation["client"] }) {
  return (
    <div className="rounded-xl border-2 border-border bg-card p-4 space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Client</h3>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
          {client.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-medium">{client.name}</p>
          <p className="text-sm text-muted-foreground">{client.email}</p>
          <p className="text-sm text-muted-foreground">{client.phone}</p>
        </div>
      </div>
    </div>
  )
}
