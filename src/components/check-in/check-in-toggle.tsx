"use client"

import { useState } from "react"
import type { Participant } from "@/lib/types"

interface CheckInToggleProps {
  participant: Participant
  onToggle: (participantId: string, isPresent: boolean) => Promise<void>
  disabled?: boolean
}

export function CheckInToggle({ participant, onToggle, disabled }: CheckInToggleProps) {
  const [loading, setLoading] = useState(false)

  if (participant.hasCancelled) {
    return (
      <span className="text-xs text-muted-foreground italic">Annulé</span>
    )
  }

  async function handleToggle() {
    if (disabled) return
    setLoading(true)
    try {
      await onToggle(participant.id, !participant.isPresent)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading || disabled}
      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm transition-all ${
        participant.isPresent
          ? "bg-primary border-primary text-white"
          : "border-muted-foreground/30 text-transparent"
      } ${loading || disabled ? "opacity-50 cursor-not-allowed" : "hover:border-primary"}`}
    >
      {loading ? "..." : participant.isPresent ? "✓" : ""}
    </button>
  )
}
