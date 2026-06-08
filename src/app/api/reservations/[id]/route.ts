import { NextResponse } from 'next/server'
import { getReservation, delay } from '@/lib/mock-data'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await delay()
  const reservation = getReservation(id)
  if (!reservation) {
    return NextResponse.json({ error: 'Reservation not found' }, { status: 404 })
  }
  return NextResponse.json({ data: reservation })
}
