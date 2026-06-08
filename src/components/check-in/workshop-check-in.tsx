"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ParticipantRow } from "./participant-row"
import { CheckInStats } from "./check-in-stats"
import { StateWrapper } from "@/components/shared/state-wrapper"
import type { Workshop } from "@/lib/types"

export function WorkshopCheckIn({ id }: { id: string }) {
  const [workshop, setWorkshop] = useState<Workshop | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function fetchWorkshop() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/workshops/${id}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Erreur")
      setWorkshop(json.data ?? null)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de chargement")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWorkshop()
  }, [id])

  async function handleToggle(participantId: string, isPresent: boolean) {
    if (!workshop) return
    try {
      const res = await fetch(`/api/workshops/${id}/checkin`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId, isPresent }),
      })
      if (!res.ok) return
      setWorkshop({
        ...workshop,
        participants: workshop.participants.map((p) =>
          p.id === participantId ? { ...p, isPresent } : p
        ),
      })
    } catch {
      // silent
    }
  }

  return (
    <div className="space-y-4">
      <StateWrapper
        loading={loading}
        error={error}
        data={workshop}
        emptyMessage="Atelier introuvable"
        onRetry={fetchWorkshop}
      >
        {workshop && (
          <>
            <div>
              <Button variant="ghost" className="-ml-2 text-sm text-muted-foreground" onClick={() => router.back()}>
                ← Retour
              </Button>
              <h1 className="text-xl font-bold mt-1">{workshop.title}</h1>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                <span>🕐 {workshop.time}</span>
                <span>📍 {workshop.studio}</span>
                <span>⏱ {workshop.duration}min</span>
              </div>
            </div>

            <CheckInStats participants={workshop.participants} />

            <Separator />

            <div className="space-y-1">
              {workshop.participants
                .filter((p) => !p.hasCancelled)
                .map((p) => (
                  <ParticipantRow key={p.id} participant={p} onToggle={handleToggle} />
                ))}
              {workshop.participants.filter((p) => p.hasCancelled).length > 0 && (
                <>
                  <p className="text-xs text-muted-foreground pt-3 pb-1">Annulé·es</p>
                  {workshop.participants
                    .filter((p) => p.hasCancelled)
                    .map((p) => (
                      <ParticipantRow key={p.id} participant={p} onToggle={handleToggle} />
                    ))}
                </>
              )}
            </div>
          </>
        )}
      </StateWrapper>
    </div>
  )
}
