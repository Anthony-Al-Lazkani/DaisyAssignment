import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { SlotFormData } from "@/lib/types"

interface SlotConfirmationProps {
  slot: SlotFormData
  workshopId?: string
  reservationId?: string
  onReset: () => void
}

export function SlotConfirmation({ slot, workshopId, reservationId, onReset }: SlotConfirmationProps) {
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
        {workshopId && (
          <Link href={`/check-in/${workshopId}`} className="w-full">
            <Button className="w-full">Faire l'appel des présences</Button>
          </Link>
        )}
        {reservationId && (
          <Link href={`/reservations/${reservationId}`} className="w-full">
            <Button variant="outline" className="w-full">
              Voir la réservation de démo
            </Button>
          </Link>
        )}
        <Button variant="outline" onClick={onReset}>
          Ajouter un autre créneau
        </Button>
      </div>
    </div>
  )
}
