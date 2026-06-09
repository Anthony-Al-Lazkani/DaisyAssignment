"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { CancellationInfo } from "@/lib/types"

interface CancellationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  info: CancellationInfo | null
  confirming: boolean
  onConfirm: () => void
}

export function CancellationDialog({
  open,
  onOpenChange,
  info,
  confirming,
  onConfirm,
}: CancellationDialogProps) {
  if (!info) return null

  const blocked = !info.isCancellable

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {blocked ? "⛔ Annulation impossible" : "✅ Annulation sans frais"}
          </DialogTitle>
          <div className="text-sm text-muted-foreground space-y-2">
            {blocked ? (
              <p>{info.reason}</p>
            ) : (
              <>
                <p>Cette réservation peut être annulée sans frais.</p>
                <p>Remboursement intégral : <strong>{info.refundAmount} €</strong></p>
                <p className="text-muted-foreground">Confirmez l'annulation ?</p>
              </>
            )}
          </div>
        </DialogHeader>

        <DialogFooter>
          {blocked ? (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Compris
            </Button>
          ) : (
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={confirming} className="flex-1">
                Retour
              </Button>
              <Button variant="destructive" onClick={onConfirm} disabled={confirming} className="flex-1">
                {confirming ? "Annulation..." : "Confirmer l'annulation"}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
