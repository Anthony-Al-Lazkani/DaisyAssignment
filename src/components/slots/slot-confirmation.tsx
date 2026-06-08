import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { SlotFormData } from "@/lib/types"

interface SlotConfirmationProps {
  slot: SlotFormData
  onReset: () => void
}

export function SlotConfirmation({ slot, onReset }: SlotConfirmationProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
      <span className="text-6xl">🎉</span>
      <div>
        <h2 className="text-xl font-bold">Créneau créé !</h2>
        <p className="text-muted-foreground mt-1">
          {slot.title} — {slot.date} à {slot.time}
        </p>
      </div>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Link href="/check-in" className="w-full">
          <Button className="w-full">Voir les ateliers</Button>
        </Link>
        <Button variant="outline" onClick={onReset}>
          Ajouter un autre créneau
        </Button>
      </div>
    </div>
  )
}
