import workshopsData from '@/data/workshops.json'
import participantsData from '@/data/participants.json'
import reservationsData from '@/data/reservations.json'
import type { Workshop, Participant, Reservation } from './types'

export function getWorkshops(): Workshop[] {
  return workshopsData.map((w: any) => ({
    ...w,
    participants: w.participants.map((pid: string) => getParticipant(pid)).filter(Boolean),
  })) as Workshop[]
}

export function getWorkshop(id: string): Workshop | undefined {
  const w = workshopsData.find((w: any) => w.id === id)
  if (!w) return undefined
  return {
    ...w,
    participants: w.participants.map((pid: string) => getParticipant(pid)).filter(Boolean),
  } as Workshop
}

export function getParticipant(id: string): Participant | undefined {
  return participantsData.find((p: any) => p.id === id) as Participant | undefined
}

export function updateParticipantPresence(workshopId: string, participantId: string, isPresent: boolean): boolean {
  const workshop = workshopsData.find((w: any) => w.id === workshopId)
  if (!workshop || !workshop.participants.includes(participantId)) return false
  const p = participantsData.find((p: any) => p.id === participantId)
  if (!p) return false
  p.isPresent = isPresent
  return true
}

export function getReservation(id: string): Reservation | undefined {
  return reservationsData.find((r: any) => r.id === id) as Reservation | undefined
}

export function cancelReservation(id: string): boolean {
  const r = reservationsData.find((r: any) => r.id === id) as any
  if (!r) return false
  r.status = 'cancelled'
  return true
}

export function getTodayWorkshops(): Workshop[] {
  const today = new Date().toISOString().split('T')[0]
  return getWorkshops().filter((w) => w.date === today)
}

export function delay(ms: number = 800): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
