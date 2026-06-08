import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { SlotFormData } from "@/lib/types"

interface SlotPreviewProps {
  data: SlotFormData
  onBack: () => void
  onSubmit: () => Promise<void>
  submitting: boolean
  error: string | null
}

export function SlotPreview({ data, onBack, onSubmit, submitting, error }: SlotPreviewProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Récapitulatif</h1>

      <div className="rounded-xl border-2 border-border bg-card p-4 space-y-3">
        <div>
          <p className="text-xs text-muted-foreground">Titre</p>
          <p className="font-medium">{data.title}</p>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Date</p>
            <p className="font-medium">{new Date(data.date + "T" + data.time).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Horaire</p>
            <p className="font-medium">{data.time} · {data.duration}min</p>
          </div>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Studio</p>
            <p className="font-medium">{data.studio}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Capacité</p>
            <p className="font-medium">{data.capacity} places</p>
          </div>
        </div>
        <Separator />
        <div>
          <p className="text-xs text-muted-foreground">Prix</p>
          <p className="font-medium text-lg">{data.price} €</p>
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={onBack} disabled={submitting}>
          Modifier
        </Button>
        <Button className="flex-1" onClick={onSubmit} disabled={submitting}>
          {submitting ? "Création..." : "Confirmer la création"}
        </Button>
      </div>
    </div>
  )
}
