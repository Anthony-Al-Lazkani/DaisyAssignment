"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ClientInfo } from "./client-info"
import { CancellationPolicy } from "./cancellation-policy"
import { CancellationImpact } from "./cancellation-impact"
import { CancellationDialog } from "./cancellation-dialog"
import { StateWrapper } from "@/components/shared/state-wrapper"
import type { Reservation, CancellationInfo } from "@/lib/types"

async function computeCancellationInfo(reservation: Reservation): Promise<CancellationInfo> {
  const deadline = new Date(reservation.cancellationPolicy.deadline)
  const now = new Date()
  const price = 50

  if (reservation.status === "cancelled") {
    return { isCancellable: false, reason: "Réservation déjà annulée", refundPercent: 0 }
  }

  if (now > deadline) {
    return {
      isCancellable: false,
      reason: "Délai d'annulation dépassé (48h avant l'atelier)",
      feeAmount: price,
      refundAmount: 0,
      refundPercent: 0,
    }
  }

  const hoursUntilDeadline = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60)
  if (hoursUntilDeadline < 24) {
    const fee = Math.round(price * (reservation.cancellationPolicy.feePercent / 100))
    return {
      isCancellable: true,
      feeAmount: fee,
      refundAmount: price - fee,
      refundPercent: 100 - reservation.cancellationPolicy.feePercent,
    }
  }

  return { isCancellable: true, feeAmount: 0, refundAmount: price, refundPercent: 100 }
}

export function ReservationDetail({ id }: { id: string }) {
  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancellationInfo, setCancellationInfo] = useState<CancellationInfo | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [confirming, setConfirming] = useState(false)

  async function fetchReservation() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/reservations/${id}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Erreur")
      const r = json.data as Reservation
      setReservation(r)
      const info = await computeCancellationInfo(r)
      setCancellationInfo(info)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de chargement")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReservation()
  }, [id])

  async function handleCancel() {
    if (!reservation) return
    setConfirming(true)
    try {
      const res = await fetch(`/api/reservations/${id}/cancel`, { method: "POST" })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Erreur")
      setReservation({ ...reservation, status: "cancelled" })
      setCancellationInfo({
        isCancellable: false,
        reason: "Réservation annulée avec succès",
        refundPercent: cancellationInfo?.refundPercent ?? 0,
      })
      setDialogOpen(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur")
    } finally {
      setConfirming(false)
    }
  }

  function getStatusBadge() {
    if (!reservation) return null
    const map: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
      confirmed: { label: "Confirmée", variant: "default" },
      cancelled: { label: "Annulée", variant: "destructive" },
      pending: { label: "En attente", variant: "secondary" },
    }
    const s = map[reservation.status]
    return <Badge variant={s.variant}>{s.label}</Badge>
  }

  return (
    <div className="space-y-4">
      <StateWrapper
        loading={loading}
        error={error}
        data={reservation}
        emptyMessage="Réservation introuvable"
        onRetry={fetchReservation}
      >
        {reservation && (
          <>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h1 className="text-xl font-bold">{reservation.workshopTitle}</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {new Date(reservation.workshopDate + "T" + reservation.workshopTime).toLocaleDateString("fr-FR", {
                    weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit",
                  })}
                </p>
              </div>
              {getStatusBadge()}
            </div>

            <ClientInfo client={reservation.client} />
            <CancellationPolicy policy={reservation.cancellationPolicy} />

            {cancellationInfo && (
              <CancellationImpact info={cancellationInfo} />
            )}

            {reservation.status === "confirmed" && cancellationInfo?.isCancellable && (
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => setDialogOpen(true)}
              >
                Annuler cette réservation
              </Button>
            )}

            {reservation.status === "cancelled" && (
              <div className="rounded-xl bg-muted p-4 text-center text-sm text-muted-foreground">
                Cette réservation a été annulée.
              </div>
            )}

            <CancellationDialog
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              info={cancellationInfo}
              confirming={confirming}
              onConfirm={handleCancel}
            />
          </>
        )}
      </StateWrapper>
    </div>
  )
}
