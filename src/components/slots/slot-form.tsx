"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SlotPreview } from "./slot-preview"
import { SlotConfirmation } from "./slot-confirmation"
import type { SlotFormData } from "@/lib/types"

const studios = ["Atelier A", "Atelier B", "Atelier C"]
const durations = [60, 90, 120, 150, 180]

export function SlotForm() {
  const [step, setStep] = useState<"form" | "preview" | "done">("form")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<SlotFormData>({
    title: "",
    date: "",
    time: "",
    duration: 120,
    studio: "",
    capacity: 8,
    price: 50,
  })

  function update<K extends keyof SlotFormData>(key: K, value: SlotFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function isValid(): boolean {
    return !!(form.title && form.date && form.time && form.studio && form.capacity > 0 && form.price > 0)
  }

  async function handleSubmit() {
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch("/api/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Erreur")
      setStep("done")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur lors de la création")
    } finally {
      setSubmitting(false)
    }
  }

  if (step === "done") {
    return <SlotConfirmation slot={form} onReset={() => { setForm({ title: "", date: "", time: "", duration: 120, studio: "", capacity: 8, price: 50 }); setStep("form") }} />
  }

  if (step === "preview") {
    return (
      <SlotPreview
        data={form}
        onBack={() => setStep("form")}
        onSubmit={handleSubmit}
        submitting={submitting}
        error={error}
      />
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Ajouter un créneau</h1>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Titre de l'atelier</label>
          <Input
            placeholder="Poterie soir — Perfectionnement"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <Input
              type="date"
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Heure</label>
            <Input
              type="time"
              value={form.time}
              onChange={(e) => update("time", e.target.value)}
            />
          </div>
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
            <label className="text-sm font-medium">Capacité max</label>
            <Input
              type="number"
              min={1}
              max={30}
              value={form.capacity}
              onChange={(e) => update("capacity", Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Prix (€)</label>
            <Input
              type="number"
              min={0}
              step={5}
              value={form.price}
              onChange={(e) => update("price", Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <Button
        className="w-full"
        disabled={!isValid()}
        onClick={() => setStep("preview")}
      >
        Vérifier le récapitulatif
      </Button>
    </div>
  )
}
