import { NextResponse } from 'next/server'
import { cancelReservation, getReservation, delay } from '@/lib/db'
import type { CancellationInfo } from '@/lib/types'

function computeCancellation(reservation: NonNullable<ReturnType<typeof getReservation>>): CancellationInfo {
  const workshopStart = new Date(reservation.workshopDate + "T" + reservation.workshopTime)
  const now = new Date()
  const threeHoursBefore = new Date(workshopStart.getTime() - 3 * 60 * 60 * 1000)

  if (now >= threeHoursBefore) {
    return {
      isCancellable: false,
      reason: "Délai d'annulation dépassé (3h avant l'atelier)",
    }
  }

  return { isCancellable: true }
}

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await delay()
  const reservation = getReservation(id)
  if (!reservation) {
    return NextResponse.json({ error: 'Reservation not found' }, { status: 404 })
  }
  if (reservation.status === 'cancelled') {
    return NextResponse.json({ error: 'Réservation déjà annulée' }, { status: 400 })
  }

  const info = computeCancellation(reservation)
  if (!info.isCancellable) {
    return NextResponse.json({ error: info.reason ?? 'Non annulable' }, { status: 400 })
  }

  cancelReservation(id)
  return NextResponse.json({ data: { ...reservation, status: 'cancelled', cancellationInfo: info } })
}
