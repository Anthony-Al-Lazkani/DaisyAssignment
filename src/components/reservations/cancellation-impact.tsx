import type { CancellationInfo } from "@/lib/types"

interface CancellationImpactProps {
  info: CancellationInfo
  price?: number
}

export function CancellationImpact({ info, price = 50 }: CancellationImpactProps) {
  const state = info.isCancellable
    ? info.feeAmount && info.feeAmount > 0
      ? "warning"
      : "success"
    : "blocked"

  return (
    <div className="rounded-xl border-2 p-4 space-y-3"
      style={{
        borderColor: state === "blocked" ? "#F24E3E" : state === "warning" ? "#F59E0B" : "#10B981",
        backgroundColor: state === "blocked" ? "#FEF2F2" : state === "warning" ? "#FFFBEB" : "#F0FDF4",
      }}
    >
      <h3 className="text-sm font-semibold uppercase tracking-wider">
        {state === "blocked" && "⛔ Non annulable"}
        {state === "warning" && "⚠️ Annulation avec frais"}
        {state === "success" && "✅ Annulation sans frais"}
      </h3>

      {state === "blocked" && (
        <p className="text-sm">{info.reason}</p>
      )}

      {state === "warning" && (
        <div className="space-y-1 text-sm">
          <p>Frais d'annulation : <strong className="text-destructive">{info.feeAmount} €</strong></p>
          <p>Remboursement : <strong>{info.refundAmount} €</strong> ({info.refundPercent}%)</p>
        </div>
      )}

      {state === "success" && (
        <div className="space-y-1 text-sm">
          <p>Remboursement intégral : <strong>{price} €</strong></p>
        </div>
      )}
    </div>
  )
}
