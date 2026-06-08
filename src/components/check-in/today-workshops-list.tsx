"use client"

import { useState, useEffect } from "react"
import { WorkshopCard } from "./workshop-card"
import { StateWrapper } from "@/components/shared/state-wrapper"
import type { Workshop } from "@/lib/types"

export function TodayWorkshopsList() {
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchWorkshops() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/workshops/today")
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Erreur")
      setWorkshops(json.data ?? [])
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de chargement")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWorkshops()
  }, [])

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Ateliers du jour</h1>
      <StateWrapper
        loading={loading}
        error={error}
        data={workshops}
        emptyMessage="Aucun atelier prévu aujourd'hui 🎨"
        onRetry={fetchWorkshops}
      >
        <div className="space-y-3">
          {workshops.map((w) => (
            <WorkshopCard key={w.id} workshop={w} />
          ))}
        </div>
      </StateWrapper>
    </div>
  )
}
