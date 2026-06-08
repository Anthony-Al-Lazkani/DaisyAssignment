"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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

  const state = info.isCancellable
    ? info.feeAmount && info.feeAmount > 0
      ? "warning"
      : "success"
    : "blocked"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {state === "blocked" && "⛔ Annulation impossible"}
            {state === "warning" && "⚠️ Confirmer l'annulation ?"}
            {state === "success" && "✅ Annulation sans frais"}
          </DialogTitle>
          <DialogDescription>
            {state === "blocked" && (
              <p className="text-sm text-muted-foreground">{info.reason}</p>
            )}
            {state === "warning" && (
              <div className="space-y-2 text-sm">
                <p>Cette réservation sera annulée avec les frais suivants :</p>
                <div className="bg-muted p-3 rounded-lg space-y-1">
                  <p>Frais : <strong className="text-destructive">{info.feeAmount} €</strong></p>
                  <p>Remboursé : <strong>{info.refundAmount} €</strong></p>
                </div>
                <p className="text-muted-foreground">Voulez-vous continuer ?</p>
              </div>
            )}
            {state === "success" && (
              <div className="space-y-2 text-sm">
                <p>Cette réservation peut être annulée sans frais.</p>
                <p>Remboursement intégral : <strong>{info.refundAmount} €</strong></p>
                <p className="text-muted-foreground">Confirmez l'annulation ?</p>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        {state !== "blocked" && (
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={confirming}>
              Retour
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              disabled={confirming}
            >
              {confirming ? "Annulation..." : "Confirmer l'annulation"}
            </Button>
          </DialogFooter>
        )}

        {state === "blocked" && (
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Compris
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
