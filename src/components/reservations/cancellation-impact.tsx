import type { CancellationInfo } from "@/lib/types"

interface CancellationImpactProps {
  info: CancellationInfo
}

export function CancellationImpact({ info }: CancellationImpactProps) {
  const blocked = !info.isCancellable

  return (
    <div className="rounded-xl border-2 p-4 space-y-3"
      style={{
        borderColor: blocked ? "#F24E3E" : "#10B981",
        backgroundColor: blocked ? "#FEF2F2" : "#F0FDF4",
      }}
    >
      <h3 className="text-sm font-semibold uppercase tracking-wider">
        {blocked ? "⛔ Non annulable" : "✅ Annulation possible"}
      </h3>

      {blocked ? (
        <p className="text-sm">{info.reason}</p>
      ) : (
        <p className="text-sm">Cette réservation peut être annulée.</p>
      )}
    </div>
  )
}
