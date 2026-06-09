"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Workshop } from "@/lib/types"

const studios = ["Atelier A", "Atelier B", "Atelier C"]
const durations = [60, 90, 120, 150, 180]

interface WorkshopEditModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workshop: Workshop
  onSaved: () => void
}

export function WorkshopEditModal({ open, onOpenChange, workshop, onSaved }: WorkshopEditModalProps) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: workshop.title,
    time: workshop.time,
    duration: workshop.duration,
    studio: workshop.studio,
    capacity: workshop.capacity,
    price: workshop.price,
  })

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/workshops/${workshop.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Erreur")
      onSaved()
      onOpenChange(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur lors de la modification")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Modifier l'atelier</DialogTitle>
          <DialogDescription>
            Modifiez les informations de &ldquo;{workshop.title}&rdquo;
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Titre</label>
            <Input value={form.title} onChange={(e) => update("title", e.target.value)} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Heure</label>
            <Input type="time" value={form.time} onChange={(e) => update("time", e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Durée</label>
              <Select value={String(form.duration)} onValueChange={(v) => v && update("duration", Number(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {durations.map((d) => (
                    <SelectItem key={d} value={String(d)}>{d} min</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Studio</label>
              <Select value={form.studio} onValueChange={(v) => v && update("studio", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {studios.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Capacité</label>
              <Input type="number" min={1} max={30} value={form.capacity} onChange={(e) => update("capacity", Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Prix (€)</label>
              <Input type="number" min={0} step={5} value={form.price} onChange={(e) => update("price", Number(e.target.value))} />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
