"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ParticipantRow } from "./participant-row"
import { CheckInStats } from "./check-in-stats"
import { StateWrapper } from "@/components/shared/state-wrapper"
import { WorkshopEditModal } from "./workshop-edit-modal"
import type { Workshop } from "@/lib/types"

export function WorkshopCheckIn({ id }: { id: string }) {
  const [workshop, setWorkshop] = useState<Workshop | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editOpen, setEditOpen] = useState(false)
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
              <div className="flex items-start justify-between gap-2">
                <h1 className="text-xl font-bold mt-1">{workshop.title}</h1>
                <Button variant="ghost" size="icon" className="mt-1 shrink-0" onClick={() => setEditOpen(true)} aria-label="Modifier l'atelier">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                </Button>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                <span>🕐 {workshop.time}</span>
                <span>📍 {workshop.studio}</span>
                <span>⏱ {workshop.duration}min</span>
              </div>
            </div>

            <CheckInStats participants={workshop.participants} />

            {workshop.reservationId && (
              <Link href={`/reservations/${workshop.reservationId}`} className="block">
                <div className="flex items-center gap-3 rounded-xl border-2 border-border bg-card p-3 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Réservation de démo</p>
                    <p className="text-xs text-muted-foreground">Voir le détail →</p>
                  </div>
                </div>
              </Link>
            )}

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
            <WorkshopEditModal
              open={editOpen}
              onOpenChange={setEditOpen}
              workshop={workshop}
              onSaved={fetchWorkshop}
            />
          </>
        )}
      </StateWrapper>
    </div>
  )
}
