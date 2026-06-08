import { NextResponse } from 'next/server'
import { cancelReservation, getReservation, delay } from '@/lib/mock-data'
import type { CancellationInfo } from '@/lib/types'

function computeCancellation(reservation: NonNullable<ReturnType<typeof getReservation>>): CancellationInfo {
  const deadline = new Date(reservation.cancellationPolicy.deadline)
  const now = new Date()
  const price = 50

  if (now > deadline) {
    return {
      isCancellable: false,
      reason: 'Délai d\'annulation dépassé (48h avant l\'atelier)',
      feeAmount: price,
      refundAmount: 0,
      refundPercent: 0,
    }
  }

  const hoursUntilDeadline = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60)
  if (hoursUntilDeadline < 24) {
    const fee = Math.round(price * (reservation.cancellationPolicy.feePercent / 100))
    return {
      isCancellable: true,
      feeAmount: fee,
      refundAmount: price - fee,
      refundPercent: 100 - reservation.cancellationPolicy.feePercent,
    }
  }

  return {
    isCancellable: true,
    feeAmount: 0,
    refundAmount: price,
    refundPercent: 100,
  }
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
