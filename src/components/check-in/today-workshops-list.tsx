"use client"

import { useState, useEffect } from "react"
import { WorkshopCard } from "./workshop-card"
import { Button } from "@/components/ui/button"
import { StateWrapper } from "@/components/shared/state-wrapper"
import type { Workshop } from "@/lib/types"

const FILTERS = [
  { key: "today", label: "Aujourd'hui" },
  { key: "upcoming", label: "À venir" },
  { key: "cancelled", label: "Annulés" },
] as const

type Filter = (typeof FILTERS)[number]["key"]

export function TodayWorkshopsList() {
  const [filter, setFilter] = useState<Filter>("today")
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchWorkshops() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/workshops/today?filter=${filter}`)
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
  }, [filter])

  const emptyMessages: Record<Filter, string> = {
    today: "Aucun atelier prévu aujourd'hui 🎨",
    upcoming: "Aucun atelier à venir 📅",
    cancelled: "Aucun atelier annulé ❌",
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Présence & Check-in</h1>

      <div className="flex gap-1 rounded-xl bg-muted p-1">
        {FILTERS.map((f) => (
          <Button
            key={f.key}
            variant={filter === f.key ? "default" : "ghost"}
            size="sm"
            className="flex-1"
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      <StateWrapper
        loading={loading}
        error={error}
        data={workshops}
        emptyMessage={emptyMessages[filter]}
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
