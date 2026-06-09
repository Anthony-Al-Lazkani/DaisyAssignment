import { NextResponse } from 'next/server'
import { updateParticipantPresence, delay } from '@/lib/db'

export async function PATCH(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await _?.json?.() ?? {}
  const { participantId, isPresent } = body
  if (!participantId) {
    return NextResponse.json({ error: 'participantId is required' }, { status: 400 })
  }
  await delay(400)
  const ok = updateParticipantPresence(id, participantId, isPresent)
  if (!ok) {
    return NextResponse.json({ error: 'Participant not found in workshop' }, { status: 404 })
  }
  return NextResponse.json({ data: { participantId, isPresent } })
}
