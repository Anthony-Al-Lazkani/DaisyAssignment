import type { Participant } from "@/lib/types"
import { CheckInToggle } from "./check-in-toggle"

interface ParticipantRowProps {
  participant: Participant
  onToggle: (participantId: string, isPresent: boolean) => Promise<void>
}

export function ParticipantRow({ participant, onToggle }: ParticipantRowProps) {
  return (
    <div className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-muted/50">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
          {participant.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-medium">{participant.name}</p>
          <p className="text-xs text-muted-foreground">{participant.email}</p>
        </div>
      </div>
      <CheckInToggle participant={participant} onToggle={onToggle} />
    </div>
  )
}
