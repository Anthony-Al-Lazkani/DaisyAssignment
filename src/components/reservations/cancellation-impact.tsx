import type { CancellationInfo } from "@/lib/types"

interface CancellationImpactProps {
  info: CancellationInfo
  price?: number
}

export function CancellationImpact({ info, price = 50 }: CancellationImpactProps) {
  const blocked = !info.isCancellable

  return (
    <div className="rounded-xl border-2 p-4 space-y-3"
      style={{
        borderColor: blocked ? "#F24E3E" : "#10B981",
        backgroundColor: blocked ? "#FEF2F2" : "#F0FDF4",
      }}
    >
      <h3 className="text-sm font-semibold uppercase tracking-wider">
        {blocked ? "⛔ Non annulable" : "✅ Annulation sans frais"}
      </h3>

      {blocked ? (
        <p className="text-sm">{info.reason}</p>
      ) : (
        <div className="space-y-1 text-sm">
          <p>Remboursement intégral : <strong>{price} €</strong></p>
        </div>
      )}
    </div>
  )
}
